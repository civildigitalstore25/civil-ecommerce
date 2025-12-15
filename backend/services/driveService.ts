import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

/**
 * Initialize Google Drive client with service account credentials
 */
const getDriveClient = () => {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
    throw new Error('Google Drive credentials not configured. Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env');
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
};

/**
 * Download file from Google Drive as a stream
 * @param fileId - The Google Drive file ID
 * @returns Readable stream of the file content
 */
export const downloadFile = async (fileId: string): Promise<Readable> => {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    console.log(`✅ Successfully initiated download stream for file: ${fileId}`);
    return response.data as Readable;
  } catch (error: any) {
    console.error('❌ Error downloading file from Drive:', error.message);
    throw new Error(`Failed to download file from Google Drive: ${error.message}`);
  }
};

/**
 * Get file metadata from Google Drive
 * @param fileId - The Google Drive file ID
 * @returns File metadata including name, mimeType, and size
 */
export const getFileMetadata = async (fileId: string) => {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, originalFilename'
    });

    console.log(`✅ Retrieved metadata for file: ${response.data.name}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error getting file metadata:', error.message);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

/**
 * Check if Google Drive is properly configured
 */
export const isDriveConfigured = (): boolean => {
  return !!(
    process.env.GOOGLE_DRIVE_ENABLED === 'true' &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_DRIVE_FOLDER_ID
  );
};

export default { downloadFile, getFileMetadata, isDriveConfigured };
