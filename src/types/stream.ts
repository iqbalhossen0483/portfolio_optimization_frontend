import type { PortfolioResult } from "./api";

export interface StatusEvent {
  type: "status";
  agent: string;
  tool?: string;
  label: string;
  content: "";
}

export interface TextChunkEvent {
  type: "text_chunk";
  agent: string;
  label: string;
  content: string;
}

export interface DoneEvent {
  type: "done";
  session_id: string;
  response: string;
  portfolio_result: PortfolioResult | null;
}

export interface ErrorEvent {
  type: "error";
  message: string;
}

export type StreamEvent = StatusEvent | TextChunkEvent | DoneEvent | ErrorEvent;
