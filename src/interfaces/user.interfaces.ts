import { loginSchema, registerSchema } from "@/schemas";
import { z } from "zod";

type IRegister = z.infer<typeof registerSchema>;

interface IUserAddress {
  zip_code: string;
  state: string;
  city: string;
  street: string;
  number?: string | undefined | null;
  complement?: string | undefined | null;
}

interface IUserCreate {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  description?: string | undefined | null;
  is_seller: boolean;
  password: string;
  address: IUserAddress;
}

type TUser = Omit<IUserCreate, "address" | "password">;

type IUserLogin = z.infer<typeof loginSchema>;

export type { IRegister, IUserCreate, IUserLogin, TUser };
