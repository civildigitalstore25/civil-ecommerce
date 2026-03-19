import { drive_v3, google } from 'googleapis';
import { PassThrough, Readable } from 'stream';
import archiver from 'archiver';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

type DriveClient = ReturnType<typeof google.drive>;

interface DriveFolderFileEntry {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
  zipPath: string;
}

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

const sanitizeFileName = (value: string): string => {
  const sanitized = value
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();

  return sanitized || 'download';
};

const sanitizePathSegment = (value: string): string => {
  const sanitized = sanitizeFileName(value);
  return sanitized.replace(/\./g, '_');
};

const isGoogleWorkspaceMimeType = (mimeType: string): boolean => {
  return mimeType.startsWith('application/vnd.google-apps');
};

const getGoogleExportMime = (mimeType: string): { mimeType: string; extension: string } | null => {
  switch (mimeType) {
    case 'application/vnd.google-apps.document':
      return {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: '.docx',
      };
    case 'application/vnd.google-apps.spreadsheet':
      return {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: '.xlsx',
      };
    case 'application/vnd.google-apps.presentation':
      return {
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        extension: '.pptx',
      };
    case 'application/vnd.google-apps.drawing':
      return {
        mimeType: 'image/png',
        extension: '.png',
      };
    default:
      return null;
  }
};

const getDownloadStreamForDriveFile = async (
  drive: DriveClient,
  entry: DriveFolderFileEntry,
): Promise<{ stream: Readable; zipPath: string }> => {
  if (!isGoogleWorkspaceMimeType(entry.mimeType)) {
    const response = await drive.files.get(
      { fileId: entry.id, alt: 'media' },
      { responseType: 'stream' },
    );

    return {
      stream: response.data as Readable,
      zipPath: entry.zipPath,
    };
  }

  const exportConfig = getGoogleExportMime(entry.mimeType);

  if (!exportConfig) {
    throw new Error(`Unsupported Google Workspace file type for export: ${entry.mimeType}`);
  }

  const exportResponse = await drive.files.export(
    {
      fileId: entry.id,
      mimeType: exportConfig.mimeType,
    },
    { responseType: 'stream' },
  );

  const zipPathWithExtension = entry.zipPath.endsWith(exportConfig.extension)
    ? entry.zipPath
    : `${entry.zipPath}${exportConfig.extension}`;

  return {
    stream: exportResponse.data as Readable,
    zipPath: zipPathWithExtension,
  };
};

const collectFolderFilesRecursive = async (
  drive: DriveClient,
  folderId: string,
  parentPath: string,
): Promise<DriveFolderFileEntry[]> => {
  const collected: DriveFolderFileEntry[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const listResponse: drive_v3.Schema$FileList = (await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, size)',
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })).data;

    const files = listResponse.files || [];

    for (const file of files) {
      const id = file.id;
      const mimeType = file.mimeType;

      if (!id || !mimeType) {
        continue;
      }

      const fileName = sanitizeFileName(file.name || id);

      if (mimeType === DRIVE_FOLDER_MIME_TYPE) {
        const folderPath = `${parentPath}${sanitizePathSegment(fileName)}/`;
        const nestedFiles = await collectFolderFilesRecursive(drive, id, folderPath);
        collected.push(...nestedFiles);
        continue;
      }

      collected.push({
        id,
        name: fileName,
        mimeType,
        size: typeof file.size === 'string' ? Number(file.size) : null,
        zipPath: `${parentPath}${fileName}`,
      });
    }

    pageToken = listResponse.nextPageToken || undefined;
  } while (pageToken);

  return collected;
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
 * Check if a file metadata MIME type belongs to a folder.
 */
export const isDriveFolder = (mimeType: string | null | undefined): boolean => {
  return mimeType === DRIVE_FOLDER_MIME_TYPE;
};

/**
 * Get folder summary to show approximate total download size.
 */
export const getFolderDownloadSummary = async (folderId: string) => {
  const drive = getDriveClient();

  const folderMetaResponse = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
    supportsAllDrives: true,
  });

  if (!isDriveFolder(folderMetaResponse.data.mimeType)) {
    throw new Error('Provided resource is not a folder');
  }

  const folderName = sanitizeFileName(folderMetaResponse.data.name || 'folder');
  const files = await collectFolderFilesRecursive(drive, folderId, '');

  const hasUnknownSize = files.some((entry) => entry.size === null || Number.isNaN(entry.size));
  const totalSizeBytes = hasUnknownSize
    ? null
    : files.reduce((total, entry) => total + (entry.size || 0), 0);

  return {
    folderName,
    fileCount: files.length,
    totalSizeBytes,
  };
};

/**
 * Stream a Google Drive folder as a ZIP archive.
 */
export const downloadFolderAsZipStream = async (
  folderId: string,
  fallbackFolderName?: string,
): Promise<{
  stream: Readable;
  fileName: string;
  fileCount: number;
}> => {
  const drive = getDriveClient();

  const folderMetaResponse = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
    supportsAllDrives: true,
  });

  if (!isDriveFolder(folderMetaResponse.data.mimeType)) {
    throw new Error('Provided resource is not a folder');
  }

  const files = await collectFolderFilesRecursive(drive, folderId, '');

  if (files.length === 0) {
    throw new Error('The selected Drive folder is empty');
  }

  const folderName = sanitizeFileName(
    folderMetaResponse.data.name || fallbackFolderName || 'folder',
  );
  const archive = archiver('zip', { zlib: { level: 9 } });
  const output = new PassThrough();

  archive.on('warning', (warning: Error) => {
    console.warn('⚠️ ZIP warning:', warning.message);
  });

  archive.on('error', (error: Error) => {
    output.destroy(error);
  });

  output.on('error', (error) => {
    archive.destroy();
    console.error('❌ ZIP stream output error:', error.message);
  });

  archive.pipe(output);

  const appendFiles = async () => {
    for (const file of files) {
      const { stream, zipPath } = await getDownloadStreamForDriveFile(drive, file);
      archive.append(stream, { name: zipPath });
    }

    await archive.finalize();
  };

  void appendFiles().catch((error: Error) => {
    output.destroy(error);
  });

  return {
    stream: output,
    fileName: `${folderName}.zip`,
    fileCount: files.length,
  };
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

export default {
  downloadFile,
  getFileMetadata,
  isDriveFolder,
  getFolderDownloadSummary,
  downloadFolderAsZipStream,
  isDriveConfigured,
};
