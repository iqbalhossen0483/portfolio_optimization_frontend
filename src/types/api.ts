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

export interface TrainingStatusResponse {
  job_id: number;
  status: TrainingStatus;
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
export interface DashboardMetrics {
  assets_count: number;
  jobs_count: number;
  users_count: number;
  market_data_count: number;
  training_running: boolean;
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
