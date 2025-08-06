import {
  OrdersRepository,
  OrdersRepositoryReturn,
} from './orders/orders.repository';
import {
  PaymentsRepository,
  PaymentsRepositoryReturn,
} from './payments/payments.repository';
import { ProductsRepository, ProductsRepositoryReturn } from './products';
import {
  PromosRepository,
  PromosRepositoryReturn,
} from './promos/promos.repository';
import { UsersRepository, UsersRepositoryReturn } from './users';

interface SupabaseRepositoryReturn {
  orders: OrdersRepositoryReturn;
  payments: PaymentsRepositoryReturn;
  products: ProductsRepositoryReturn;
  users: UsersRepositoryReturn;
  promos: PromosRepositoryReturn;
}

const SupabaseRepository = (): SupabaseRepositoryReturn => ({
  orders: OrdersRepository(),
  payments: PaymentsRepository(),
  products: ProductsRepository(),
  users: UsersRepository(),
  promos: PromosRepository(),
});

export default SupabaseRepository;
