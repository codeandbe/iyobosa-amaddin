const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Resolves an image URL from various possible formats.
 * 
 * Handles:
 * - Full absolute URLs (https://...)
 * - Relative paths (/...)
 * - Supabase Storage image IDs (filenames)
 * 
 * @param imageUrl - A full URL or relative path
 * @param imageId - A filename from Supabase Storage
 * @param bucket - The Supabase storage bucket name (default: "portfolio-assets")
 * @returns A valid image URL or null if no valid image source exists
 */
export function resolveImageUrl(
  imageUrl?: string | null,
  imageId?: string | null,
  bucket: string = "portfolio-assets"
): string | null {
  // Check imageUrl first
  if (imageUrl) {
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }
  }

  // Check imageId
  if (imageId) {
    if (imageId.startsWith("http")) {
      return imageId;
    }
    if (imageId.startsWith("/")) {
      return imageId;
    }

    // Assume imageId is a filename in Supabase Storage
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${imageId}`;
    }
  }

  return null;
}
