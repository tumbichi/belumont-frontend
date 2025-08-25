import createUser from './services/createUser';
import getUserByEmail from './services/getUserByEmail';
import getUserById from './services/getUserById';
import getAllUsers from './services/getAllUsers';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}
import getTotalUsers from './services/getTotalUsers';

// ... (imports)

export interface UsersRepositoryReturn {
  create: (email: string, name: string) => Promise<User>;
  getByEmail: (email: string) => Promise<User | null>;
  getById: (id: string) => Promise<User | null>;
  getAll: () => Promise<User[]>;
  getTotal: () => Promise<number>;
}
export const UsersRepository = (): UsersRepositoryReturn => ({
  create: createUser,
  getByEmail: getUserByEmail,
  getById: getUserById,
  getAll: getAllUsers,
  getTotal: getTotalUsers,
});
