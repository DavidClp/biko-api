import { Role } from "@prisma/client";

export interface IUser {
  id: string;
  role: Role;
  email: string;
  password: string;
  createdAt: Date;
}


export interface IUserResponse {
  id: string;
  role: Role;
  email: string;
  createdAt: Date;
}

export interface ICreateUser {
  email: string;
  password: string;
  role: Role;
}