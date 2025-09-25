import fs from 'fs';
import path from 'path';
import { ListLogsDTO, LogEntry, ListLogsResult } from '../dtos/ListLogsDTO';

export class LogRepository {
  private logFilePath: string;

  constructor() {
    const logDir = path.join(__dirname, '../../../../logs');
    this.logFilePath = path.join(logDir, 'app.log');
  }

  async listLogs(params: ListLogsDTO): Promise<ListLogsResult> {
    try {
      // Verifica se o arquivo de log existe
      if (!fs.existsSync(this.logFilePath)) {
        return {
          logs: [],
          total: 0,
          page: params.page || 1,
          limit: params.limit || 50,
          totalPages: 0,
        };
      }

      // Lê o arquivo de log
      const logContent = fs.readFileSync(this.logFilePath, 'utf-8');
      const lines = logContent.trim().split('\n').filter(line => line.trim());

      // Converte cada linha para objeto JSON
      const allLogs: LogEntry[] = [];
      for (const line of lines) {
        try {
          const logEntry = JSON.parse(line) as LogEntry;
          allLogs.push(logEntry);
        } catch (error) {
          // Ignora linhas que não são JSON válido
          console.warn('Linha de log inválida:', line);
        }
      }

      // Aplica filtros
      let filteredLogs = allLogs;

      if (params.level !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.level === params.level);
      }

      if (params.method) {
        filteredLogs = filteredLogs.filter(log => 
          log.req?.method?.toLowerCase() === params.method?.toLowerCase()
        );
      }

      if (params.startTime || params.endTime) {
        filteredLogs = filteredLogs.filter(log => {
          const logTime = new Date(log.time);
          
          if (params.startTime) {
            const startTime = new Date(params.startTime);
            if (logTime < startTime) return false;
          }
          
          if (params.endTime) {
            const endTime = new Date(params.endTime);
            if (logTime > endTime) return false;
          }
          
          return true;
        });
      }

      // Ordena por tempo (mais recente primeiro)
      filteredLogs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      // Calcula paginação
      const page = params.page || 1;
      const limit = params.limit || 50;
      const total = filteredLogs.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Aplica paginação
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

      return {
        logs: paginatedLogs,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Erro ao ler logs:', error);
      throw new Error('Erro ao processar arquivo de logs');
    }
  }

  async getLogStats(): Promise<{
    totalLogs: number;
    errorLogs: number;
    infoLogs: number;
    methods: { [key: string]: number };
  }> {
    try {
      if (!fs.existsSync(this.logFilePath)) {
        return {
          totalLogs: 0,
          errorLogs: 0,
          infoLogs: 0,
          methods: {},
        };
      }

      const logContent = fs.readFileSync(this.logFilePath, 'utf-8');
      const lines = logContent.trim().split('\n').filter(line => line.trim());

      let totalLogs = 0;
      let errorLogs = 0;
      let infoLogs = 0;
      const methods: { [key: string]: number } = {};

      for (const line of lines) {
        try {
          const logEntry = JSON.parse(line) as LogEntry;
          totalLogs++;

          if (logEntry.level >= 50) { // level 50+ são erros
            errorLogs++;
          } else if (logEntry.level === 30) { // level 30 são info
            infoLogs++;
          }

          if (logEntry.req?.method) {
            methods[logEntry.req.method] = (methods[logEntry.req.method] || 0) + 1;
          }
        } catch (error) {
          // Ignora linhas inválidas
        }
      }

      return {
        totalLogs,
        errorLogs,
        infoLogs,
        methods,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas dos logs:', error);
      throw new Error('Erro ao processar estatísticas dos logs');
    }
  }
}
