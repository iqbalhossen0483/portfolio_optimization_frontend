"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Greeting } from "@/components/chat/Greeting";
import { PromptSuggestions } from "@/components/chat/PromptSuggestions";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSession, startStreaming } from "@/store/slices/chatSlice";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { isStreaming } = useAppSelector((s) => s.chat);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
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

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-8 overflow-y-auto">
          <Greeting />
          <PromptSuggestions onSelect={handleSubmit} />
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
