import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const isDev = process.env.NODE_ENV === 'development';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else if (!isDev) {
  // In production/preview, missing credentials is a hard error — not a silent mock.
  // Patients would receive random placeholder images otherwise.
  throw new Error(
    '[Cloudinary] CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET ' +
    'must be set as environment variables. Add them in Vercel → Project Settings → Environment Variables.'
  );
}

/**
 * Upload a medical report file buffer to Cloudinary with 'authenticated' delivery.
 * PDFs → resource_type 'raw'  (stored as-is, served as a file, URL uses /raw/)
 * Images → resource_type 'image' (processed by Cloudinary pipeline, URL uses /image/)
 * Using explicit types instead of 'auto' prevents non-deterministic storage behaviour.
 * @param {Buffer} fileBuffer
 * @param {string} folder   - Cloudinary folder path (must NOT contain '+' or special chars)
 * @param {'pdf'|'image'}  fileType
 * @returns {Promise<object>} Cloudinary upload result
 */
export function uploadToCloudinary(fileBuffer, folder, fileType = 'image') {
  const uniqueName = `report_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  // PDFs are stored as 'raw' (file delivery). Images are stored as 'image'.
  const resourceType = fileType === 'pdf' ? 'raw' : 'image';

  if (!isConfigured) {
    // DEV ONLY mock — never reached in production (throws above)
    console.warn(`[DEV MOCK] Cloudinary upload skipped. public_id: ${folder}/${uniqueName}`);
    return Promise.resolve({
      public_id: `${folder}/${uniqueName}`,
      resource_type: resourceType,
      format: fileType === 'pdf' ? 'pdf' : 'jpg',
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,   // explicit — never 'auto'
        type: 'authenticated',
        folder,
        public_id: uniqueName,
        use_filename: false,
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Upload a public (non-medical) image to Cloudinary.
 * Used for event images, blog images, team photos etc.
 * Files are served via Cloudinary's standard CDN — no signing required.
 * @param {Buffer} fileBuffer
 * @param {string} folder  e.g. 'events', 'team', 'blog'
 * @returns {Promise<object>} Cloudinary upload result
 */
export function uploadPublicImage(fileBuffer, folder) {
  const uniqueName = `img_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

  if (!isConfigured) {
    // DEV ONLY mock — never reached in production (throws above)
    console.warn(`[DEV MOCK] Cloudinary public upload skipped. Returning picsum placeholder.`);
    return Promise.resolve({
      public_id: `${folder}/${uniqueName}`,
      secure_url: `https://picsum.photos/seed/${uniqueName}/800/600`,
      resource_type: 'image',
      format: 'jpg',
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        type: 'upload',            // public CDN delivery — no signing needed
        folder,
        public_id: uniqueName,
        use_filename: false,
        unique_filename: false,
        overwrite: false,
        invalidate: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Generate a signed, temporary (10 min) URL for an authenticated asset.
 * @param {object} report - The report document
 * @returns {string} Signed URL
 */
export function generateSignedUrl(report) {
  if (!isConfigured) {
    // DEV ONLY mock — never reached in production (throws above)
    console.warn(`[DEV MOCK] generateSignedUrl returning placeholder for: ${report.cloudinaryPublicId}`);
    if (report.cloudinaryResourceType === 'image') {
      return `https://picsum.photos/800/1000`;
    }
    return `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
  }

  return cloudinary.url(report.cloudinaryPublicId, {
    resource_type: report.cloudinaryResourceType,
    type: 'authenticated',
    sign_url: true,
    // Include the exact version returned at upload time so Cloudinary can locate
    // the asset. Without this, the SDK defaults to v1 which does not exist → 404.
    ...(report.cloudinaryVersion ? { version: report.cloudinaryVersion } : {}),
    format: report.cloudinaryFormat,
    expires_at: Math.floor(Date.now() / 1000) + 600, // 10-minute window
  });
}
