// ── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = "user" | "admin";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  about_me: string | null;
  profile: string | null;
  created_at: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface UserListResponse {
  users: UserProfile[];
  total: number;
}

// ── Chat ────────────────────────────────────────────────────────────────────
export interface PortfolioAssetPanel {
  isin: string;
  company: string | null;
  sector: string | null;
  return_ann: number | null;
  risk: number | null;
  sharpe: number | null;
  mu_esg: number | null;
  delta_esg: number | null;
  weight: number;
  allocation: number;
}

export interface PortfolioResult {
  job_id: number;
  portfolio_model: string;
  panels: Record<string, PortfolioAssetPanel[]>;
}

export interface ChatSessionInfo {
  id: number;
  session_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatSessionListResponse {
  sessions: ChatSessionInfo[];
  total: number;
}

export interface ChatMessageInfo {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatSessionDetail {
  id: number;
  session_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessageInfo[];
}

// ── Training ────────────────────────────────────────────────────────────────
export type TrainingStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "stopped";

export interface TrainingJobResponse {
  job_id: number;
  status: TrainingStatus;
  message: string;
}

export type TrainingStage =
  | "stage1_ingestion"
  | "stage2_esg_normalization"
  | "stage3_normalizer_fit"
  | "stage4_training"
  | "completed"
  | "failed";

export interface TrainingStatusResponse {
  job_id: number;
  status: TrainingStatus;
  current_stage: TrainingStage | null;
  step: number;
  max_steps: number;
  progress_pct: number;
  entropy_rolling_std: number | null;
  best_sharpe: number | null;
  best_mu_esg: number | null;
  current_rewards: Record<string, number>;
  elapsed_seconds: number | null;
  error_message: string | null;
}

// ── Data ────────────────────────────────────────────────────────────────────
export interface AssetInfo {
  isin: string;
  name: string;
  sector: string;
}

export interface AssetsResponse {
  assets: AssetInfo[];
  total: number;
}

// ── Admin ───────────────────────────────────────────────────────────────────
export interface TimeSeriesBucket {
  /** ISO date string (YYYY-MM-DD) of the Monday that starts the bucket. */
  week_start: string;
  count: number;
}

export interface JobStatusBreakdown {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  stopped: number;
}

export interface RecentJobInfo {
  id: number;
  status: TrainingStatus;
  portfolio_model: string;
  topology: string;
  best_sharpe: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface RecentUserInfo {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  profile: string | null;
  created_at: string;
}

export interface DashboardMetrics {
  assets_count: number;
  jobs_count: number;
  users_count: number;
  market_data_count: number;
  training_running: boolean;
  job_status_breakdown: JobStatusBreakdown;
  users_per_week: TimeSeriesBucket[];
  jobs_per_week: TimeSeriesBucket[];
  recent_jobs: RecentJobInfo[];
  recent_users: RecentUserInfo[];
}

export interface AssetListItem {
  id: number;
  isin: string;
  name: string;
  sector: string;
  created_at: string;
  market_data_count: number;
}

export interface AssetListResponse {
  items: AssetListItem[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
