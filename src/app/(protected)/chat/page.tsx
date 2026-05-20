"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSession, startStreaming } from "@/store/slices/chatSlice";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { StatusBar } from "@/components/chat/StatusBar";
import { ResearchPanel } from "@/components/chat/ResearchPanel";
import { PortfolioPanel } from "@/components/chat/PortfolioPanel";
import { Sheet } from "@/components/ui/Sheet";
import { useAppSelector as useSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { MessageSquare } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { isStreaming } = useAppSelector((s) => s.chat);
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const { stream, stop } = useStreamingChat();

  const handleSubmit = async (message: string) => {
    if (!session?.user?.accessToken) return;
    const sessionId = crypto.randomUUID();
    router.replace(`/chat/${sessionId}`);
    dispatch(setActiveSession(sessionId));
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center px-4 py-2 border-b border-border lg:hidden">
          <IconButton
            icon={<Menu className="w-4 h-4" />}
            aria-label="Open sidebar"
            onClick={() => dispatch(setSidebarOpen(true))}
          />
        </div>
        <StatusBar />
        <ResearchPanel />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Start a conversation
            </h2>
            <p className="text-sm text-muted">
              Ask about portfolio allocation, ESG scores, or model comparisons.
            </p>
          </div>
        </div>
        <ChatInput
          isStreaming={isStreaming}
          onSubmit={handleSubmit}
          onStop={stop}
        />
      </div>
    </div>
  );
}
