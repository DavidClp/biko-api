export interface ListLogsDTO {
  level?: number;
  method?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
  page?: number;
}

export interface LogEntry {
  level: number;
  time: string;
  pid: number;
  hostname: string;
  req?: {
    method: string;
    url: string;
  };
  requestId?: string;
  res?: {
    statusCode: number;
  };
  responseTime?: number;
  msg: string;
  err?: {
    type: string;
    message: string;
    stack: string;
  };
}

export interface ListLogsResult {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
