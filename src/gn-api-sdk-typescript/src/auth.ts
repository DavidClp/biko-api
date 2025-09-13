import axios from "axios";
import https from "https";
import { GnConfig } from "./interfaces/gnConfig.interface";
import { EndpointInterface } from "./interfaces/endpoint.interface";

class Auth {
	private constants: any;

	private client_id: string;

	private client_secret: string;

	private baseUrl?: string;

	private agent!: https.Agent;

	private authRoute!: EndpointInterface;

	constructor(options: GnConfig, constants: any) {
		this.constants = constants;
		this.client_id = options.client_id;
		this.client_secret = options.client_secret;
		this.baseUrl = options.baseUrl;

		if (options.agent) {
			this.agent = options.agent;
		}
		if (options.authRoute) {
			this.authRoute = options.authRoute;
		}
	}

	public getAccessToken(): Promise<any> {
		let postParams: any;

		if (
			this.constants.APIS.DEFAULT.URL.PRODUCTION === this.baseUrl ||
			this.constants.APIS.DEFAULT.URL.SANDBOX === this.baseUrl
		) {
			postParams = {
				method: "POST",
				url: this.baseUrl + this.constants.APIS.DEFAULT.ENDPOINTS.authorize.route,
				headers: {
					"api-sdk": "typescript-2.0.0",
				},
				data: {
					grant_type: "client_credentials",
				},
				auth: {
					username: this.client_id,
					password: this.client_secret,
				},
			};
		} else {
			const data_credentials = `${this.client_id}:${this.client_secret}`;
			const auth = Buffer.from(data_credentials).toString("base64");

			postParams = {
				method: "POST",
				url: this.baseUrl + this.authRoute.route,
				headers: {
					Authorization: `Basic ${auth}`,
					"Content-Type": "application/json",
					"api-sdk": "typescript-2.0.0",
				},
				httpsAgent: this.agent,
				data: {
					grant_type: "client_credentials",
				},
			};
		}

		const response = axios(postParams)
			.then((res: any) => {
				return res.data;
			})
			.catch((error: any) => {
				return error.response.data;
			});

		return response;
	}
}

export default Auth;
