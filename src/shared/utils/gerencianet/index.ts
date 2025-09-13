import { Gerencianet } from "@/gn-api-sdk-typescript"

const options = {
    client_id: process.env.GERENCIANET_CLIENT_ID as string,
    client_secret: process.env.GERENCIANET_CLIENT_SECRET as string,
    certificate: __dirname + (process.env.MODE === "PROD" ? "/certs/prod.p12" : "/certs/dev.p12"),
    //certificate: process.env.GERENCIANET_CERT_PATH as string,
    sandbox: process.env.MODE !== "PROD"
}

//Permissões seguras no host: 
//chmod 600 ./certs/prod.p12

export const gerencianet = new Gerencianet(options)