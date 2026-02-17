import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Upload a single photo to Firebase Storage
export async function uploadPhoto(file, userId, onProgress) {
  if (!file) throw new Error('No file provided');
  
  // Generate unique filename
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const fileName = `profile_photos/${userId}/${timestamp}.${fileExtension}`;
  
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: fileName,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// Delete a photo from Firebase Storage
export async function deletePhoto(photoPath) {
  if (!photoPath) return;
  const storageRef = ref(storage, photoPath);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

// Compress image before upload (reduces file size)
export async function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas blob conversion failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = (err) => reject(err);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export {
  auth,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  ref,
  uploadBytesResumable,
  getDownloadURL,
};
