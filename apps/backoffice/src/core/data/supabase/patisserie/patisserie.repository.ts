import getAllPatisserieProducts from './services/getAllPatisserieProducts';
import getPatisserieProductById from './services/getPatisserieProductById';
import createPatisserieProduct from './services/createPatisserieProduct';
import updatePatisserieProduct from './services/updatePatisserieProduct';
import togglePatisserieProductActive from './services/togglePatisserieProductActive';
import {
  CreatePatisserieInput,
  PatisserieProduct,
  UpdatePatisserieInput,
} from '@modules/patisserie/types/patisserie.types';

export interface PatisserieRepositoryReturn {
  getAll: () => Promise<PatisserieProduct[]>;
  getById: (id: string) => Promise<PatisserieProduct | null>;
  create: (data: CreatePatisserieInput) => Promise<PatisserieProduct>;
  update: (
    id: string,
    data: UpdatePatisserieInput
  ) => Promise<PatisserieProduct>;
  toggleActive: (id: string, active: boolean) => Promise<PatisserieProduct>;
}

export const PatisserieRepository = (): PatisserieRepositoryReturn => ({
  getAll: getAllPatisserieProducts,
  getById: getPatisserieProductById,
  create: createPatisserieProduct,
  update: updatePatisserieProduct,
  toggleActive: togglePatisserieProductActive,
});
