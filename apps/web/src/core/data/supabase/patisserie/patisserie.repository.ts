import getAllPatisserieProducts from './services/getAllPatisserieProducts';
import getPatisserieProductByPathname from './services/getPatisserieProductByPathname';
import { PatisserieProduct } from '../../../../modules/patisserie/types/patisserie.types';

export interface PatisserieRepositoryReturn {
  getAll: () => Promise<PatisserieProduct[]>;
  getByPathname: (pathname: string) => Promise<PatisserieProduct | null>;
}

export const PatisserieRepository = (): PatisserieRepositoryReturn => ({
  getAll: getAllPatisserieProducts,
  getByPathname: getPatisserieProductByPathname,
});
