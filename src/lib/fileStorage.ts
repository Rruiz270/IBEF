// =============================================================================
// IndexedDB File Storage for i10 Project Control
// Stores file blobs locally using IndexedDB
// =============================================================================

const DB_NAME = 'i10-file-storage';
const STORE_NAME = 'files';
const DB_VERSION = 1;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'text/csv',
  'text/plain',
  'application/zip',
];

const ACCEPTED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.png', '.jpg', '.jpeg', '.csv', '.txt', '.zip',
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveFileBlob(id: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ id, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFileBlob(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => {
      const result = req.result;
      resolve(result ? result.blob : null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFileBlob(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function downloadFile(id: string, filename: string): Promise<void> {
  const blob = await getFileBlob(id);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `Arquivo muito grande (${formatFileSize(file.size)}). Máximo: 10MB.`;
  }
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const typeOk = ACCEPTED_TYPES.includes(file.type);
  const extOk = ACCEPTED_EXTENSIONS.includes(ext);
  if (!typeOk && !extOk) {
    return `Tipo de arquivo não suportado. Aceitos: ${ACCEPTED_EXTENSIONS.join(', ')}`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(type: string, name: string): string {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return '📝';
  if (type.includes('excel') || type.includes('spreadsheet') || name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) return '📊';
  if (type.includes('image')) return '🖼️';
  if (type.includes('zip')) return '📦';
  if (type.includes('text')) return '📃';
  return '📎';
}

export const ACCEPT_STRING = ACCEPTED_EXTENSIONS.join(',');
