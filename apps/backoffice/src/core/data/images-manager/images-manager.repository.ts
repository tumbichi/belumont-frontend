import compressImage from './services/compressImage';
import deleteImage from './services/deleteImage';
import uploadImage from './services/uploadImage';

export const ImagesManagerRepository = () => ({
  compressImage,
  uploadImage,
  deleteImage,
});
