import { Users } from "./users.model";

export interface AuthResponse {
  token: string;
  user: Users;
}
