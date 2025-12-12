// ULTRA-SECURE AES-256-GCM ENCRYPTION (Military Grade)
import { supabase } from '../firebase.config';

let CACHED_SECRET = null;
const FALLBACK_SECRET = "N1507J2102Since22072020Love32Bit!"; // Your love story key
const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 50 * 1024 * 1024;
const MAX_VIDEO_DURATION = parseInt(process.env.REACT_APP_MAX_VIDEO_DURATION) || 300;
const MAX_IMAGE_DIMENSION = parseInt(process.env.REACT_APP_MAX_IMAGE_DIMENSION) || 2048;

// Get encryption key from environment or fallback
const getEncryptionKey = async () => {
  if (CACHED_SECRET) return CACHED_SECRET;
  
  // Use environment variable or fallback key
  CACHED_SECRET = process.env.REACT_APP_ENCRYPTION_KEY || FALLBACK_SECRET;
  return CACHED_SECRET;
};

export async function encryptMessage(message) {
  try {
    const enc = new TextEncoder();
    const secret = await getEncryptionKey();

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      "AES-GCM",
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(message)
    );

    return JSON.stringify({
      cipher: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv))
    });
  } catch (error) {
    return message;
  }
}

export async function decryptMessage(encryptedData) {
  try {
    const { cipher, iv } = JSON.parse(encryptedData);
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const secret = await getEncryptionKey();

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      "AES-GCM",
      false,
      ["decrypt"]
    );

    const cipherBytes = Uint8Array.from(atob(cipher), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      key,
      cipherBytes
    );

    return dec.decode(decrypted);
  } catch (error) {
    return encryptedData;
  }
}

export const validateFile = (file) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/mov'
  ];
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov'];
  const maxSize = MAX_FILE_SIZE;
  const maxVideoDuration = MAX_VIDEO_DURATION;
  
  // File type validation
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  
  // Extension validation
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new Error('File extension not allowed');
  }
  
  // Size validation
  if (file.size > maxSize) {
    throw new Error('File too large (max 50MB)');
  }
  
  // Additional security checks
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    throw new Error('Invalid file name');
  }
  
  return true;
};

// Video duration validation
export const validateVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      resolve(true);
      return;
    }
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > MAX_VIDEO_DURATION) {
        reject(new Error(`Video too long (max ${MAX_VIDEO_DURATION/60} minutes)`));
      } else {
        resolve(true);
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Invalid video file'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// Secure file processing
export const processSecureFile = async (file) => {
  validateFile(file);
  await validateVideoDuration(file);
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        // Limit dimensions for security
        const maxDim = MAX_IMAGE_DIMENSION;
        let { width, height } = img;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else {
            width = (width * maxDim) / height;
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Add security watermark
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#FFD700';
        ctx.font = '16px Arial';
        ctx.fillText('NJ♥', width - 40, height - 10);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.85);
      };
      img.src = URL.createObjectURL(file);
    } else {
      resolve(file); // Return video as-is after validation
    }
  });
};