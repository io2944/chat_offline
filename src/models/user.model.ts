export interface User {
  id: number;
  username: string;
  password: string;
}
export type PublicUser = Omit<User, "password">;
