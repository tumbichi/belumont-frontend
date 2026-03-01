'use client';

import { useState, useEffect, useCallback } from 'react';
import compressImage from '@core/data/images-manager/services/compressImage';

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UseImageUploadReturn {
  /** The raw file selected by the user */
  file: File | null;
  /** Object-URL preview (auto-revoked on change) */
  preview: string | null;
  /** The compressed file ready for upload (null until compression finishes) */
  compressedFile: File | null;
  /** Whether compression is in progress */
  isCompressing: boolean;
  /** Validation or compression error (i18n key) */
  error: string | null;
  /** Set a new file (triggers validation + compression) */
  setFile: (file: File | null) => void;
  /** Clear the current file */
  clear: () => void;
  /** Original file size in bytes (for display) */
  originalSize: number | null;
  /** Compressed file size in bytes (for display) */
  compressedSize: number | null;
}

/**
 * Hook to manage a single image file with preview, validation, and compression.
 * Validates file type and size on selection, then compresses via WebP.
 */
export function useImageUpload(): UseImageUploadReturn {
  const [file, setFileState] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  // Generate / revoke preview URL
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Compress file when it changes
  useEffect(() => {
    if (!file) {
      setCompressedFile(null);
      setOriginalSize(null);
      setCompressedSize(null);
      return;
    }

    let cancelled = false;
    setIsCompressing(true);
    setCompressedFile(null);
    setOriginalSize(file.size);

    compressImage(file)
      .then((result) => {
        if (!cancelled) {
          setCompressedFile(result);
          setCompressedSize(result.size);
          setIsCompressing(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Fallback: use original file if compression fails
          setCompressedFile(file);
          setCompressedSize(file.size);
          setIsCompressing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const setFile = useCallback((newFile: File | null) => {
    setError(null);

    if (!newFile) {
      setFileState(null);
      return;
    }

    // Validate type
    if (!ACCEPTED_TYPES.includes(newFile.type)) {
      setError('PRODUCTS.IMAGE_INVALID_FORMAT');
      return;
    }

    // Validate size
    if (newFile.size > MAX_FILE_SIZE) {
      setError('PRODUCTS.IMAGE_TOO_LARGE');
      return;
    }

    setFileState(newFile);
  }, []);

  const clear = useCallback(() => {
    setFileState(null);
    setError(null);
    setCompressedFile(null);
    setOriginalSize(null);
    setCompressedSize(null);
  }, []);

  return {
    file,
    preview,
    compressedFile,
    isCompressing,
    error,
    setFile,
    clear,
    originalSize,
    compressedSize,
  };
}
