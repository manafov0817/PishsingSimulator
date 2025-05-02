import { User } from "./user";

export interface LoginResponse {
  user: User;
  token: string;
  access_token?: string;
  accessToken?: string;
}