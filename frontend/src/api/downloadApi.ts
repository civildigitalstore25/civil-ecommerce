import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DownloadResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    productName: string;
    productVersion: string;
    fileName: string;
    message: string;
  };
  message?: string;
}

export interface DownloadMetadataResponse {
  success: boolean;
  data?: {
    fileName: string;
    mimeType: string;
    sizeBytes: number | null;
  };
  message?: string;
}

export interface DownloadProgressUpdate {
  loaded: number;
  total: number | null;
  percent: number | null;
}

// Get secure download URL for a purchased product
// Uses the /secure endpoint which streams through server (users never see Drive link)
export const getProductDownloadUrl = async (orderId: string, productId: string): Promise<DownloadResponse> => {
  try {
    // Use the secure endpoint that streams through our server
    const secureUrl = `${API_BASE_URL}/api/download/${orderId}/${productId}/secure`;
    
    return {
      success: true,
      data: {
        downloadUrl: secureUrl,
        productName: '',
        productVersion: '',
        fileName: 'download',
        message: 'Download link generated'
      }
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get download link');
  }
};

export const getProductDownloadMetadata = async (
  orderId: string,
  productId: string,
): Promise<DownloadMetadataResponse> => {
  try {
    const response = await api.get(`/download/${orderId}/${productId}/metadata`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch download metadata');
  }
};

const getFileNameFromDisposition = (contentDisposition: string | null): string | null => {
  if (!contentDisposition) return null;

  const utf8NameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8NameMatch?.[1]) {
    return decodeURIComponent(utf8NameMatch[1]);
  }

  const nameMatch = contentDisposition.match(/filename="?([^\";]+)"?/i);
  return nameMatch?.[1] || null;
};

export const downloadSecureProductFile = async (
  downloadUrl: string,
  onProgress?: (update: DownloadProgressUpdate) => void,
): Promise<{ blob: Blob; fileName: string | null; totalBytes: number | null }> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please login to download');
  }

  const response = await fetch(downloadUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }

    if (response.status === 403) {
      const serverMessage = await response
        .clone()
        .json()
        .then((data) => data?.message)
        .catch(() => null);
      throw new Error(serverMessage || 'You are not allowed to download this product.');
    }

    throw new Error('Download failed. Please try again.');
  }

  const totalHeader = response.headers.get('content-length');
  const totalBytes = totalHeader ? Number(totalHeader) : null;
  const fileName = getFileNameFromDisposition(response.headers.get('content-disposition'));

  const responseBody = response.body;
  if (!responseBody) {
    const blob = await response.blob();
    return { blob, fileName, totalBytes };
  }

  const reader = responseBody.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (value) {
      chunks.push(value);
      loaded += value.length;

      onProgress?.({
        loaded,
        total: totalBytes,
        percent: totalBytes ? Math.min((loaded / totalBytes) * 100, 100) : null,
      });
    }
  }

  const blob = new Blob(chunks, {
    type: response.headers.get('content-type') || 'application/octet-stream',
  });

  onProgress?.({
    loaded,
    total: totalBytes,
    percent: totalBytes ? 100 : null,
  });

  return { blob, fileName, totalBytes };
};

// Stream download (alternative method)
export const streamProductDownload = async (orderId: string, productId: string) => {
  try {
    const response = await api.get(`/download/${orderId}/${productId}/stream`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download product');
  }
};
