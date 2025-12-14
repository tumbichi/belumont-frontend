import deleteImage from './services/deleteImage';
import uploadImage from './services/uploadImage';

export const ImagesManagerRepository = () => ({
  uploadImage,
  deleteImage,
});
