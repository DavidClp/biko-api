export interface ICreditCard {
	card_mask?: string;
	card_flag?: string;
	owner?: string;
	brand?: any;
	number?: any;
	cvv?: any;
	expirationMonth?: any;
	expirationYear?: any;
	payment_token?: string;
	customer?: {
		name: string;
		cpf: string;
		phone_number: string;
		email: string;
		birth: string;
	};
	billing_address?: {
		street: string;
		number: any;
		neighborhood: string;
		zipcode: string;
		city: string;
		state: string;
	};
}

export interface IBankingBillet {
	expire_at: string;
	customer: {
	  name: string;
	  cpf: string;
	  phone_number: string;
	  email: string;
	  birth: string;
	};
  }

export interface ICreateDTO {
	value: number;
	description: string;
	paymentMethod: "credit" | "debit";
	creditCard?: ICreditCard;
	reservation_id: string;
}

export interface IUpdateDTO {
	id: string;
	status: "paid" | "pending" | "refused" | "refunded" | "canceled";
}

export interface IFindDTO {
	id: string;
	paymentMethod: "credit" | "debit";
}

interface IPayment {
	calendario?: Calendario;
	txid?: string;
	revisao?: number;
	status?: "ATIVA" | "CONCLUIDA" | "REMOVIDA_PELO_USUARIO_RECEBEDOR" | "REMOVIDA_PELO_PSP";
	valor?: Valor;
	chave?: string;
	solicitacaoPagador?: string;
	loc?: LOC;
	location?: string;
	pixCopiaECola?: string;
	code?: number;
	data?: Data;
}

export interface IPaymentDebit {
	calendario: Calendario;
	txid: string;
	revisao: number;
	status: string;
	valor: Valor;
	chave: string;
	solicitacaoPagador: string;
	loc: LOC;
	location: string;
	pixCopiaECola: string;
}

export interface IPaymentCredit {
	code: number;
	data: Data;
}

export interface Calendario {
	criacao: Date;
	expiracao: number;
}

export interface LOC {
	id: number;
	location: string;
	tipoCob: string;
	criacao: Date;
}

export interface Valor {
	original: string;
}

export interface Data {
	charge_id: number;
	total: number;
	status:
	| "new"
	| "waiting"
	| "identified"
	| "approved"
	| "paid"
	| "unpaid"
	| "refunded"
	| "contested"
	| "canceled"
	| "settled"
	| "link"
	| "expired";
	reason: string;
	custom_id: null;
	created_at: Date;
	notification_url: string;
	items: Item[];
	history: History[];
	customer: Customer;
	payment: Payment;
}

export interface Customer {
	name: string;
	cpf: string;
	birth: Date;
	email: string;
	phone_number: string;
}

export interface History {
	message: string;
	created_at: Date;
}

export interface Item {
	name: string;
	value: number;
	amount: number;
}

export interface Payment {
	method: string;
	created_at: Date;
	message: null;
	credit_card: CreditCard;
}

export interface CreditCard {
	mask: string;
	installments: number;
	installment_value: number;
	address: Address;
}

export interface Address {
	street: string;
	address_number: string;
	neighborhood: string;
	address_complement?: null;
	city: string;
	state: string;
	zipcode: string;
}

export interface IPaymentGatewayHelper {
	createTransaction(data: ICreateDTO): Promise<any>;
	find(data: IFindDTO): Promise<IPayment>;
	cancelTransaction(data: { id: string }): Promise<void>;
}
