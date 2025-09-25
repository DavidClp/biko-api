import pino from "pino";
import fs from "fs";
import path from "path";

// garante que a pasta logs exista
const logDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, "app.log");

// função para formatar timestamp
function formatTime(ms: number) {
    const date = new Date(ms);

    const dateString = date.toLocaleString("pt-BR", {
      timeZone: "America/Porto_Velho",
      hour12: false, // formato 24h
    });

    console.log("dateString", dateString);
    return dateString;
  }
  

// cria um stream customizado que formata o JSON
const stream = fs.createWriteStream(logFilePath, { flags: "a" });

export const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime, // gera ISO timestamp
    formatters: {
      log(object) {
        const { level, pid, hostname, ...rest } = object;
        if (rest?.time) {
          rest.time = formatTime(Number(rest.time)); // converte timestamp para hora legível
        }
        return rest;
      },
    },
  },
  stream
);