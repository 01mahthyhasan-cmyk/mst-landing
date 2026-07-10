import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload a file buffer to Cloudinary with 'authenticated' type.
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @returns {Promise<object>} Cloudinary upload result
 */
export function uploadToCloudinary(fileBuffer, folder) {
  const uniqueName = `report_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

  if (!isConfigured) {
    console.log(`\n--- [MOCK CLOUDINARY UPLOAD] ---`);
    console.log(`Folder: ${folder}`);
    console.log(`Public ID Name: ${uniqueName}`);
    console.log(`Buffer Size: ${fileBuffer.length} bytes`);
    console.log(`---------------------------------\n`);
    
    // Simulate a successful Cloudinary response
    return Promise.resolve({
      public_id: `${folder}/${uniqueName}`,
      resource_type: 'raw',
      format: 'pdf',
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
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
    console.log(`\n--- [MOCK CLOUDINARY PUBLIC UPLOAD] ---`);
    console.log(`Folder: ${folder}, Name: ${uniqueName}`);
    console.log(`Buffer Size: ${fileBuffer.length} bytes`);
    console.log(`---------------------------------------\n`);
    // Return a placeholder image URL for local development
    return Promise.resolve({
      public_id: `${folder}/${uniqueName}`,
      secure_url: `https://picsum.photos/seed/${uniqueName}/800/600`,
      resource_type: 'image',
      format: 'jpg',
      width: 800,
      height: 600,
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
    console.log(`\n--- [MOCK CLOUDINARY SIGNED URL] ---`);
    console.log(`Public ID: ${report.cloudinaryPublicId}`);
    console.log(`Resource Type: ${report.cloudinaryResourceType}`);
    console.log(`Format: ${report.cloudinaryFormat}`);
    console.log(`-------------------------------------\n`);
    
    // In dev mock mode, return a placeholder PDF/image that can be viewed
    if (report.cloudinaryResourceType === 'image') {
      return `https://picsum.photos/800/1000`;
    }
    return `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
  }

  return cloudinary.url(report.cloudinaryPublicId, {
    resource_type: report.cloudinaryResourceType,
    type: 'authenticated',
    sign_url: true,
    format: report.cloudinaryFormat,
    expires_at: Math.floor(Date.now() / 1000) + 600, // 10-minute window
  });
}
