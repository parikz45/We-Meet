const PF = import.meta.env.VITE_PUBLIC_FOLDER;

// Resolves an image/media source:
// - full URLs (Cloudinary uploads) are returned as-is
// - bare filenames (committed defaults like "profile.jpg", or legacy uploads)
//   get the VITE_PUBLIC_FOLDER prefix
export const media = (value) => {
  if (!value) return "";
  return /^https?:\/\//.test(value) ? value : PF + value;
};
