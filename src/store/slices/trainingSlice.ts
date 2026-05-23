import type { LogEntry, TrainingMetric } from "@/types/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const LOG_CAP = 500;

interface TrainingState {
  jobIds: number[];
  liveMetrics: Record<number, TrainingMetric>;
  eventLogs: Record<number, LogEntry[]>;
}

const initialState: TrainingState = {
  jobIds: [],
  liveMetrics: {},
  eventLogs: {},
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    addJob(state, action: PayloadAction<number>) {
      if (!state.jobIds.includes(action.payload)) {
        state.jobIds.push(action.payload);
      }
    },
    removeJob(state, action: PayloadAction<number>) {
      state.jobIds = state.jobIds.filter((id) => id !== action.payload);
      delete state.liveMetrics[action.payload];
      delete state.eventLogs[action.payload];
    },
    pushMetric(
      state,
      action: PayloadAction<{ id: number; metric: TrainingMetric }>,
    ) {
      state.liveMetrics[action.payload.id] = action.payload.metric;
    },
    pushLog(state, action: PayloadAction<{ id: number; entry: LogEntry }>) {
      const { id, entry } = action.payload;
      if (!state.eventLogs[id]) state.eventLogs[id] = [];
      state.eventLogs[id].push(entry);
      if (state.eventLogs[id].length > LOG_CAP) {
        state.eventLogs[id] = state.eventLogs[id].slice(-LOG_CAP);
      }
    },
    resetJob(state, action: PayloadAction<number>) {
      delete state.liveMetrics[action.payload];
      state.eventLogs[action.payload] = [];
    },
  },
});

export const { addJob, removeJob, pushMetric, pushLog, resetJob } =
  trainingSlice.actions;

export default trainingSlice.reducer;
