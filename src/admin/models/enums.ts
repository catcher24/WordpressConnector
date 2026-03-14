/** Shared enums used across multiple model domains to avoid circular imports. */

export enum TargetType {
  Host = 'host',
  WebApplication = 'webApplication',
}

export enum PortType {
  Tcp = 0,
  Udp = 1,
}

export enum CollectorStatus {
  Scheduled = 'scheduled',
  Available = 'available',
  Starting = 'starting',
  Running = 'running',
  Completed = 'completed',
  Canceled = 'canceled',
  TimedOut = 'timedOut',
  Failed = 'failed',
  Queued = 'queued',
  Skipped = 'skipped',
  ConnectionFailed = 'connectionFailed',
}

export enum VulnerabilitySeverity {
  Noise = "Noise",
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}
