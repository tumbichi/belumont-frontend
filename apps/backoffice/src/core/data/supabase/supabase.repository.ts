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
import {
  ResourcesRepository,
  ResourcesRepositoryReturn,
} from './resources/resources.repository';
import { UsersRepository, UsersRepositoryReturn } from './users';

interface SupabaseRepositoryReturn {
  orders: OrdersRepositoryReturn;
  payments: PaymentsRepositoryReturn;
  products: ProductsRepositoryReturn;
  users: UsersRepositoryReturn;
  promos: PromosRepositoryReturn;
  resources: ResourcesRepositoryReturn;
}

const SupabaseRepository = (): SupabaseRepositoryReturn => ({
  orders: OrdersRepository(),
  payments: PaymentsRepository(),
  products: ProductsRepository(),
  users: UsersRepository(),
  promos: PromosRepository(),
  resources: ResourcesRepository(),
});

export default SupabaseRepository;
