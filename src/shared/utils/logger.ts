import pino from "pino";
import fs from "fs";
import path from "path";


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
);