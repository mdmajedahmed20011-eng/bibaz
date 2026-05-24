/**
 * BIBAZ — Cloudinary Image Upload Utility
 * SOP §৬A — Product Image Management
 *
 * Features:
 * - Server-side signed upload
 * - MIME type validation
 * - Max 5MB file size
 * - Auto WebP/AVIF optimization
 * - Responsive image URLs
 */

import { UPLOAD_LIMITS } from "./constants";

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// ═══════════════════════════════════════════
// UPLOAD FUNCTION
// ═══════════════════════════════════════════

/**
 * Upload image to Cloudinary (server-side)
 * @param file - File or base64 data URL
 * @param folder - Cloudinary folder (e.g., "products", "categories")
 */
export async function uploadImage(
  file: File | string,
  folder: string = "products"
): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { success: false, error: "Cloudinary not configured" };
  }

  try {
    let fileData: string;

    if (file instanceof File) {
      // Validate file type
      if (
        !UPLOAD_LIMITS.ALLOWED_TYPES.includes(
          file.type as (typeof UPLOAD_LIMITS.ALLOWED_TYPES)[number]
        )
      ) {
        return {
          success: false,
          error: `Invalid file type. Allowed: ${UPLOAD_LIMITS.ALLOWED_TYPES.join(", ")}`,
        };
      }

      // Validate file size
      if (file.size > UPLOAD_LIMITS.MAX_SIZE_BYTES) {
        return {
          success: false,
          error: `File too large. Maximum size: ${UPLOAD_LIMITS.MAX_SIZE_MB}MB`,
        };
      }

      // Convert to base64
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      fileData = `data:${file.type};base64,${base64}`;
    } else {
      fileData = file; // Already a base64 data URL
    }

    // Generate signature for signed upload
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=bibaz/${folder}&timestamp=${timestamp}`;

    // Create SHA-1 signature
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", fileData);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", `bibaz/${folder}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || "Upload failed",
      };
    }

    const data: CloudinaryResponse = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("[CLOUDINARY] Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<{ success: boolean }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { success: false };
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;

    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    return { success: response.ok };
  } catch (error) {
    console.error("[CLOUDINARY] Delete error:", error);
    return { success: false };
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getOptimizedUrl(
  url: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (!url.includes("cloudinary.com")) return url;

  const { width = 800, quality = 80 } = options || {};
  // Insert transformation before /upload/
  return url.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
}
