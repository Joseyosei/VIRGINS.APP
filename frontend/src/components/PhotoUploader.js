import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadPhoto, compressImage, deletePhoto } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;

export default function PhotoUploader({ 
  photos = [], 
  maxPhotos = 6, 
  onPhotosChange,
  showMainPhotoLabel = true,
  className = '' 
}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !user) return;

    // Check if we can add more photos
    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const filesToUpload = files.slice(0, remainingSlots);
      const uploadedPhotos = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        let file = filesToUpload[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please select only image files');
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          // Compress the image
          file = await compressImage(file, 1200, 0.8);
        }

        // Upload to Firebase Storage
        const result = await uploadPhoto(file, user.uid, (progress) => {
          setUploadProgress(((i + progress / 100) / filesToUpload.length) * 100);
        });

        uploadedPhotos.push({
          url: result.url,
          path: result.path,
          isMain: photos.length === 0 && i === 0, // First photo is main
        });
      }

      // Update photos array
      const newPhotos = [...photos, ...uploadedPhotos];
      if (onPhotosChange) {
        onPhotosChange(newPhotos);
      }

      // Update profile in backend
      await updateProfilePhotos(newPhotos);

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async (index) => {
    const photoToRemove = photos[index];
    
    try {
      // Delete from Firebase Storage if it has a path
      if (photoToRemove.path) {
        await deletePhoto(photoToRemove.path);
      }

      // Remove from array
      const newPhotos = photos.filter((_, i) => i !== index);
      
      // If we removed the main photo, make the first remaining photo the main
      if (photoToRemove.isMain && newPhotos.length > 0) {
        newPhotos[0].isMain = true;
      }

      if (onPhotosChange) {
        onPhotosChange(newPhotos);
      }

      // Update profile in backend
      await updateProfilePhotos(newPhotos);

    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to remove photo');
    }
  };

  const handleSetMainPhoto = async (index) => {
    const newPhotos = photos.map((photo, i) => ({
      ...photo,
      isMain: i === index,
    }));

    if (onPhotosChange) {
      onPhotosChange(newPhotos);
    }

    await updateProfilePhotos(newPhotos);
  };

  const updateProfilePhotos = async (newPhotos) => {
    if (!user) return;

    try {
      const mainPhoto = newPhotos.find(p => p.isMain) || newPhotos[0];
      
      await fetch(`${API}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({
          photos: newPhotos.map(p => ({ url: p.url, path: p.path, isMain: p.isMain })),
          profileImage: mainPhoto?.url || '',
        }),
      });
    } catch (err) {
      console.error('Failed to update profile photos:', err);
    }
  };

  const emptySlots = Math.max(0, Math.min(maxPhotos - photos.length, 3));

  return (
    <div className={`photo-uploader ${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <X size={16} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div
            key={photo.path || photo.url || index}
            className={`relative aspect-[3/4] rounded-2xl overflow-hidden group ${
              photo.isMain ? 'ring-2 ring-gold-500 ring-offset-2' : ''
            }`}
          >
            <img
              src={photo.url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => handleRemovePhoto(index)}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
              {!photo.isMain && (
                <button
                  onClick={() => handleSetMainPhoto(index)}
                  className="text-[10px] font-bold text-white bg-gold-500 px-3 py-1 rounded-full"
                >
                  Set as Main
                </button>
              )}
            </div>

            {/* Main photo badge */}
            {photo.isMain && showMainPhotoLabel && (
              <div className="absolute bottom-2 left-2 bg-gold-500 text-navy-900 text-[10px] font-bold px-2 py-1 rounded-full">
                MAIN
              </div>
            )}
          </div>
        ))}

        {/* Upload button/slots */}
        {photos.length < maxPhotos && (
          <label
            className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 hover:bg-gold-50/50 transition-all ${
              uploading ? 'pointer-events-none' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-500">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-xs font-bold text-slate-500">Add Photo</span>
              </>
            )}
          </label>
        )}

        {/* Empty placeholder slots */}
        {emptySlots > 1 && Array.from({ length: emptySlots - 1 }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-[3/4] rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center"
          >
            <ImageIcon className="w-8 h-8 text-slate-200" />
          </div>
        ))}
      </div>

      {/* Helper text */}
      <p className="mt-3 text-xs text-slate-400 text-center">
        Add up to {maxPhotos} photos. First photo will be your main profile picture.
      </p>
    </div>
  );
}

// Simple single photo uploader for profile image
export function SinglePhotoUploader({ currentPhoto, onPhotoChange, className = '' }) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let fileToUpload = file;
      
      // Compress if too large
      if (file.size > 2 * 1024 * 1024) {
        fileToUpload = await compressImage(file, 800, 0.8);
      }

      const result = await uploadPhoto(fileToUpload, user.uid, setUploadProgress);
      
      if (onPhotoChange) {
        onPhotoChange(result.url);
      }

      // Update profile image in backend
      await fetch(`${API}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({ profileImage: result.url }),
      });

    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative">
        <img
          src={currentPhoto || `https://ui-avatars.com/api/?name=User&background=1A1A2E&color=D4A574&size=200`}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-gold-500 shadow-2xl"
        />
        
        <label className="absolute bottom-0 right-0 bg-gold-500 p-2 rounded-full text-navy-900 hover:bg-gold-400 transition-colors cursor-pointer shadow-lg">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </label>
      </div>

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-navy-900/80 rounded-full px-3 py-1">
            <span className="text-xs font-bold text-white">{Math.round(uploadProgress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
