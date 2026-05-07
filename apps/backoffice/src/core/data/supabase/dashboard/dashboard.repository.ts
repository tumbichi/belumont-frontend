import getDashboardKpis, {
  DashboardKpisParams,
} from './services/getDashboardKpis';
import getStuckPaidOrders from './services/getStuckPaidOrders';
import getBestSellingProductsForPeriod, {
  BestSellingProductsParams,
} from './services/getBestSellingProductsForPeriod';
import getTotalUsers from '../users/services/getTotalUsers';
import {
  DashboardKpisResult,
  BestSellingProductRow,
  StuckPaidOrder,
} from '@modules/dashboard/types';

export interface DashboardRepositoryReturn {
  getKpis: (params: DashboardKpisParams) => Promise<DashboardKpisResult>;
  getKpisForComparison: (
    params: DashboardKpisParams
  ) => Promise<DashboardKpisResult>;
  getStuckPaidOrders: (thresholdMinutes?: number) => Promise<StuckPaidOrder[]>;
  getBestSellers: (
    params: BestSellingProductsParams
  ) => Promise<BestSellingProductRow[]>;
  getTotalUsers: () => Promise<number>;
}

export const DashboardRepository = (): DashboardRepositoryReturn => ({
  getKpis: getDashboardKpis,
  getKpisForComparison: getDashboardKpis,
  getStuckPaidOrders: getStuckPaidOrders,
  getBestSellers: getBestSellingProductsForPeriod,
  getTotalUsers: getTotalUsers,
});
