import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PortfolioResult } from "@/types/api";

interface ChatState {
  activeSessionId: string | null;
  isStreaming: boolean;
  advisorChunks: string;
  researchChunks: string;
  researchPanelAgent: string | null;
  statusLabel: string | null;
  statusAgent: string | null;
  statusTool: string | null;
  portfolioResult: PortfolioResult | null;
  streamError: string | null;
}

const initialState: ChatState = {
  activeSessionId: null,
  isStreaming: false,
  advisorChunks: "",
  researchChunks: "",
  researchPanelAgent: null,
  statusLabel: null,
  statusAgent: null,
  statusTool: null,
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
      state.researchChunks = "";
      state.researchPanelAgent = null;
      state.statusLabel = null;
      state.statusAgent = null;
      state.statusTool = null;
      state.portfolioResult = null;
      state.streamError = null;
    },
    startStreaming(state) {
      state.isStreaming = true;
      state.advisorChunks = "";
      state.researchChunks = "";
      state.researchPanelAgent = null;
      state.statusLabel = null;
      state.statusAgent = null;
      state.statusTool = null;
      state.portfolioResult = null;
      state.streamError = null;
    },
    setStatus(
      state,
      action: PayloadAction<{ label: string; agent: string; tool: string | null }>,
    ) {
      state.statusLabel = action.payload.label;
      state.statusAgent = action.payload.agent;
      state.statusTool = action.payload.tool;
    },
    appendAdvisorChunk(state, action: PayloadAction<string>) {
      state.advisorChunks += action.payload;
    },
    appendResearchChunk(
      state,
      action: PayloadAction<{ content: string; agent: string }>,
    ) {
      state.researchChunks += action.payload.content;
      state.researchPanelAgent = action.payload.agent;
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
      state.statusLabel = null;
      state.statusAgent = null;
      state.statusTool = null;
    },
    streamError(state, action: PayloadAction<string>) {
      state.isStreaming = false;
      state.streamError = action.payload;
      state.statusLabel = null;
    },
    stopStreaming(state) {
      state.isStreaming = false;
      state.statusLabel = null;
      state.statusAgent = null;
      state.statusTool = null;
    },
  },
});

export const {
  setActiveSession,
  startStreaming,
  setStatus,
  appendAdvisorChunk,
  appendResearchChunk,
  finishStream,
  streamError,
  stopStreaming,
} = chatSlice.actions;

export default chatSlice.reducer;
