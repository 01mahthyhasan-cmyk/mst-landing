import { v2 as cloudinary } from 'cloudinary';

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
  if (!isConfigured) {
    console.log(`\n--- [MOCK CLOUDINARY UPLOAD] ---`);
    console.log(`Folder: ${folder}`);
    console.log(`Buffer Size: ${fileBuffer.length} bytes`);
    console.log(`---------------------------------\n`);
    
    // Simulate a successful Cloudinary response
    return Promise.resolve({
      public_id: `reports/mock_cloudinary_public_id_${Date.now()}`,
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
        use_filename: false,
        unique_filename: true,
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
