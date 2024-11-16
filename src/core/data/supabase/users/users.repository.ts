import createUser from "./services/createUser";
import getUserByEmail from "./services/getUserByEmail";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface UsersRepositoryReturn {
  getByEmail: (email: string) => Promise<User | null>;
  create: (email: string, name: string) => Promise<void>;
}

export const UsersRepository = (): UsersRepositoryReturn => ({ create: createUser, getByEmail: getUserByEmail });
