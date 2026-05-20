import type {
  AssetListResponse,
  AssetsResponse,
  ChatSessionDetail,
  ChatSessionListResponse,
  DashboardMetrics,
  TrainingJobResponse,
  TrainingStatusResponse,
  UserListResponse,
  UserProfile,
} from "@/types/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    if (session?.user?.accessToken) {
      headers.set("Authorization", `Bearer ${session.user.accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    if (status === 401) {
      toast.error("Session expired");
      signOut({ callbackUrl: "/login" });
    } else if (status === 403) {
      toast.error("You don't have permission to do this");
    } else if (status === 503) {
      toast.error("AI service unavailable — please try again shortly");
    } else if (typeof status === "number" && status >= 500) {
      toast.error("Server error — please try again");
    } else if (status === "FETCH_ERROR") {
      toast.error("Connection lost — check your network");
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Auth", "Users", "Chat", "Training", "Data", "Admin"],
  endpoints: (builder) => ({
    // ── Auth ─────────────────────────────────────────────────────────────────
    register: builder.mutation<
      UserProfile,
      { email: string; name: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    getMe: builder.query<UserProfile, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    updateMe: builder.mutation<
      UserProfile,
      Partial<{ email: string; username: string; password: string }>
    >({
      query: (body) => ({ url: "/auth/me", method: "PUT", body }),
      invalidatesTags: ["Auth"],
    }),
    listUsers: builder.query<UserListResponse, void>({
      query: () => "/auth/users",
      providesTags: ["Users"],
    }),
    updateUserRole: builder.mutation<
      UserProfile,
      { id: number; role: "admin" | "user" }
    >({
      query: ({ id, role }) => ({
        url: `/auth/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    // ── Chat ─────────────────────────────────────────────────────────────────
    listSessions: builder.query<ChatSessionListResponse, void>({
      query: () => "/chat/sessions",
      providesTags: ["Chat"],
    }),
    getSession: builder.query<ChatSessionDetail, string>({
      query: (sessionId) => `/chat/sessions/${sessionId}`,
      providesTags: ["Chat"],
    }),
    renameSession: builder.mutation<
      ChatSessionDetail,
      { id: number; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/chat/sessions/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteSession: builder.mutation<void, number>({
      query: (id) => ({ url: `/chat/sessions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Chat"],
    }),

    // ── Training ─────────────────────────────────────────────────────────────
    startTraining: builder.mutation<TrainingJobResponse, FormData>({
      query: (formData) => ({
        url: "/training/start",
        method: "POST",
        body: formData,
      }),
    }),
    getTrainingStatus: builder.query<TrainingStatusResponse, number>({
      query: (id) => `/training/${id}/status`,
      providesTags: ["Training"],
    }),
    stopTraining: builder.mutation<TrainingJobResponse, number>({
      query: (id) => ({ url: `/training/${id}/stop`, method: "POST" }),
    }),

    // ── Data ─────────────────────────────────────────────────────────────────
    listAssets: builder.query<AssetsResponse, { sector?: string } | void>({
      query: (params) => ({
        url: "/data/assets",
        params: params ?? {},
      }),
      providesTags: ["Data"],
    }),

    // ── Admin ─────────────────────────────────────────────────────────────────
    getDashboard: builder.query<DashboardMetrics, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Admin"],
    }),
    listAdminAssets: builder.query<
      AssetListResponse,
      { q?: string; limit?: number; cursor?: string }
    >({
      query: (params) => ({ url: "/admin/assets", params }),
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useListSessionsQuery,
  useGetSessionQuery,
  useRenameSessionMutation,
  useDeleteSessionMutation,
  useStartTrainingMutation,
  useGetTrainingStatusQuery,
  useStopTrainingMutation,
  useListAssetsQuery,
  useGetDashboardQuery,
  useListAdminAssetsQuery,
} = api;
