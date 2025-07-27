import createUser from './services/createUser';
import getUserByEmail from './services/getUserByEmail';
import getUserById from './services/getUserById';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface UsersRepositoryReturn {
  create: (email: string, name: string) => Promise<User>;
  getByEmail: (email: string) => Promise<User | null>;
  getById: (id: string) => Promise<User | null>;
}

export const UsersRepository = (): UsersRepositoryReturn => ({
  create: createUser,
  getByEmail: getUserByEmail,
  getById: getUserById,
});
