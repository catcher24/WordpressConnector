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
