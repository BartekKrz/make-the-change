export type ProductBlurHash = {
  url: string;
  blurHash: string;
  width?: number;
  height?: number;
  fileSize?: number;
  // Data URL stockée en DB pour Next/Image (placeholder)
  blurDataURL?: string;
};
