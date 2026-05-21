"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageThread } from "@/components/chat/MessageThread";
import { PortfolioPanel } from "@/components/chat/PortfolioPanel";
import { SessionHeader } from "@/components/chat/SessionHeader";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useGetSessionQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSession, startStreaming } from "@/store/slices/chatSlice";
import { setPortfolioSheetOpen, setSidebarOpen } from "@/store/slices/uiSlice";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { isStreaming, advisorChunks, portfolioResult } = useAppSelector(
    (s) => s.chat,
  );
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const portfolioSheetOpen = useAppSelector((s) => s.ui.portfolioSheetOpen);
  const { stream, stop } = useStreamingChat();
  const { data: sessionDetail, isLoading } = useGetSessionQuery(sessionId);

  useEffect(() => {
    dispatch(setActiveSession(sessionId));
  }, [sessionId, dispatch]);

  const handleSubmit = async (message: string) => {
    if (!session?.user?.accessToken) return;
    dispatch(startStreaming());
    await stream(message, sessionId, session.user.accessToken);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="hidden lg:flex">
        <ChatSidebar />
      </div>
      <Sheet open={sidebarOpen} onClose={() => dispatch(setSidebarOpen(false))}>
        <ChatSidebar />
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border lg:hidden">
          <IconButton
            icon={<Menu className="w-4 h-4" />}
            aria-label="Open sidebar"
            onClick={() => dispatch(setSidebarOpen(true))}
          />
          <span className="text-sm font-bold text-foreground tracking-tight">
            MADRL Portfolio
          </span>
        </div>

        <SessionHeader sessionId={sessionId} />

        {isLoading ? (
          <div className="flex-1 p-6">
            <div className="mx-auto w-full max-w-3xl">
              <Skeleton count={4} className="h-12 mb-3" />
            </div>
          </div>
        ) : (
          <MessageThread
            messages={sessionDetail?.data?.messages ?? []}
            advisorChunks={advisorChunks}
            isStreaming={isStreaming}
          />
        )}

        <ChatInput
          isStreaming={isStreaming}
          onSubmit={handleSubmit}
          onStop={stop}
        />
      </div>

      {portfolioResult && (
        <>
          <div className="hidden lg:flex">
            <PortfolioPanel />
          </div>
          <BottomSheet
            open={portfolioSheetOpen}
            onClose={() => dispatch(setPortfolioSheetOpen(false))}
            className="lg:hidden"
          >
            <PortfolioPanel />
          </BottomSheet>
        </>
      )}
    </div>
  );
}
