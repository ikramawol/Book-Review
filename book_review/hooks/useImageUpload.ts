import { useState, useCallback } from 'react';

interface ImageData {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UseImageUploadReturn {
  imageUrl: string;
  imageData: ImageData | null;
  isUploading: boolean;
  error: string | null;
  uploadProgress: number;
  handleImageUpload: (imageUrl: string, imageData?: ImageData) => void;
  handleUploadError: (error: string) => void;
  handleUploadStart: () => void;
  handleUploadProgress: (progress: number) => void;
  resetUpload: () => void;
  removeImage: () => void;
}

export const useImageUpload = (initialImageUrl?: string): UseImageUploadReturn => {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || '');
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = useCallback((url: string, data?: ImageData) => {
    setImageUrl(url);
    setImageData(data || null);
    setIsUploading(false);
    setError(null);
    setUploadProgress(100);
  }, []);

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
  }, []);

  const handleUploadProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  const resetUpload = useCallback(() => {
    setImageUrl('');
    setImageData(null);
    setIsUploading(false);
    setError(null);
    setUploadProgress(0);
  }, []);

  const removeImage = useCallback(() => {
    setImageUrl('');
    setImageData(null);
  }, []);

  return {
    imageUrl,
    imageData,
    isUploading,
    error,
    uploadProgress,
    handleImageUpload,
    handleUploadError,
    handleUploadStart,
    handleUploadProgress,
    resetUpload,
    removeImage,
  };
};
