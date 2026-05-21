import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PortfolioResult } from "@/types/api";

export interface AgentStep {
  agent: string;
  tool: string | null;
  label: string;
  at: number;
}

interface ChatState {
  activeSessionId: string | null;
  isStreaming: boolean;
  advisorChunks: string;
  agentSteps: AgentStep[];
  portfolioResult: PortfolioResult | null;
  streamError: string | null;
  pendingUserMessage: string | null;
}

const initialState: ChatState = {
  activeSessionId: null,
  isStreaming: false,
  advisorChunks: "",
  agentSteps: [],
  portfolioResult: null,
  streamError: null,
  pendingUserMessage: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveSession(state, action: PayloadAction<string | null>) {
      // Idempotent: re-setting the same session id (which happens when the
      // session page mounts after the entry page already dispatched this same
      // action) must not wipe in-flight streaming state.
      if (state.activeSessionId === action.payload) return;
      state.activeSessionId = action.payload;
      state.isStreaming = false;
      state.advisorChunks = "";
      state.agentSteps = [];
      state.portfolioResult = null;
      state.streamError = null;
      state.pendingUserMessage = null;
    },
    startStreaming(
      state,
      action: PayloadAction<{ message: string } | undefined>,
    ) {
      state.isStreaming = true;
      state.advisorChunks = "";
      state.agentSteps = [];
      state.portfolioResult = null;
      state.streamError = null;
      state.pendingUserMessage = action.payload?.message ?? null;
    },
    appendAgentStep(state, action: PayloadAction<AgentStep>) {
      state.agentSteps.push(action.payload);
    },
    appendAdvisorChunk(state, action: PayloadAction<string>) {
      state.advisorChunks += action.payload;
    },
    finishStream(
      state,
      action: PayloadAction<{
        response: string;
        portfolioResult: PortfolioResult | null;
      }>,
    ) {
      state.isStreaming = false;
      state.advisorChunks = action.payload.response;
      state.portfolioResult = action.payload.portfolioResult;
    },
    streamError(state, action: PayloadAction<string>) {
      state.isStreaming = false;
      state.streamError = action.payload;
      state.pendingUserMessage = null;
    },
    stopStreaming(state) {
      state.isStreaming = false;
      state.pendingUserMessage = null;
    },
  },
});

export const {
  setActiveSession,
  startStreaming,
  appendAgentStep,
  appendAdvisorChunk,
  finishStream,
  streamError,
  stopStreaming,
} = chatSlice.actions;

export default chatSlice.reducer;
