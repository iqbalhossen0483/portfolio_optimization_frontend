export interface TrainingMetric {
  step: number;
  entropy: number;
  entropy_rolling_std: number;
  reward_bloomberg: number;
  reward_lesg: number;
  reward_financial: number;
  loss_actor: number;
  loss_critic: number;
  alpha_t: number;
}

export interface LogEntry {
  timestamp: string;
  message: string;
}
