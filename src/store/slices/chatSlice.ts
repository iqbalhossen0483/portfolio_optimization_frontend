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
}

const initialState: ChatState = {
  activeSessionId: null,
  isStreaming: false,
  advisorChunks: "",
  agentSteps: [],
  portfolioResult: null,
  streamError: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveSession(state, action: PayloadAction<string | null>) {
      state.activeSessionId = action.payload;
      state.isStreaming = false;
      state.advisorChunks = "";
      state.agentSteps = [];
      state.portfolioResult = null;
      state.streamError = null;
    },
    startStreaming(state) {
      state.isStreaming = true;
      state.advisorChunks = "";
      state.agentSteps = [];
      state.portfolioResult = null;
      state.streamError = null;
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
    },
    stopStreaming(state) {
      state.isStreaming = false;
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
