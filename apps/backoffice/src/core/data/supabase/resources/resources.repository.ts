import createResource from './services/createResource';
import updateResource from './services/updateResource';
import getResourceByUrl from './services/getResourceByUrl';
import deleteResource from './services/deleteResource';

export type ResourceProvider = 'SUPABASE' | 'CLOUDFLARE_R2';

export interface Resource {
  id: string;
  folder: string;
  url: string;
  created_at: string;
  provider: ResourceProvider;
  bucket: string;
}

export interface ResourcesRepositoryReturn {
  create: (resource: Omit<Resource, 'id' | 'created_at'>) => Promise<Resource>;
  update: (
    id: string,
    resource: Partial<Omit<Resource, 'id' | 'created_at'>>
  ) => Promise<Resource>;
  getByUrl: (url: string) => Promise<Resource | null>;
  delete: (id: string) => Promise<void>;
}

export const ResourcesRepository = (): ResourcesRepositoryReturn => ({
  create: createResource,
  update: updateResource,
  getByUrl: getResourceByUrl,
  delete: deleteResource,
});
