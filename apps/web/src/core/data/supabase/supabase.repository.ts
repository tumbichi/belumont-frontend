import {
  OrdersRepository,
  OrdersRepositoryReturn,
} from './orders/orders.repository';
import {
  PaymentsRepository,
  PaymentsRepositoryReturn,
} from './payments/payments.repository';
import { ProductsRepository, ProductsRepositoryReturn } from './products';
import { UsersRepository, UsersRepositoryReturn } from './users';

interface SupabaseRepositoryReturn {
  orders: OrdersRepositoryReturn;
  payments: PaymentsRepositoryReturn;
  products: ProductsRepositoryReturn;
  users: UsersRepositoryReturn;
}

const SupabaseRepository = (): SupabaseRepositoryReturn => ({
  orders: OrdersRepository(),
  payments: PaymentsRepository(),
  products: ProductsRepository(),
  users: UsersRepository(),
});

export default SupabaseRepository;
