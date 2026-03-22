'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Paperclip } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { validateFile, formatFileSize, getFileIcon, downloadFile, ACCEPT_STRING } from '@/lib/fileStorage';
import type { DepartmentId } from '@/data/types';

interface FileUploadProps {
  entityType: 'task' | 'hiring';
  entityId: string;
  departmentId: DepartmentId;
  /** Compact mode shows a smaller drop zone */
  compact?: boolean;
}

export default function FileUpload({ entityType, entityId, departmentId, compact }: FileUploadProps) {
  const { getAttachmentsForEntity, addFileAttachment, removeFileAttachment } = useProject();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const attachments = getAttachmentsForEntity(entityType, entityId);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }
      await addFileAttachment(
        { name: file.name, size: file.size, type: file.type, entityType, entityId, departmentId },
        file
      );
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }, [addFileAttachment, entityType, entityId, departmentId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex items-center justify-center cursor-pointer transition-colors border-2 border-dashed rounded-lg
          ${compact ? 'flex-row gap-2 px-3 py-2' : 'flex-col gap-2 p-4'}
          ${dragOver
            ? 'border-[#00B4D8] bg-[#00B4D8]/10'
            : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
          }
        `}
      >
        <Upload size={compact ? 14 : 20} className={dragOver ? 'text-[#00B4D8]' : 'text-white/30'} />
        <p className={`text-white/40 text-center ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {uploading ? 'Enviando...' : compact ? 'Arraste ou clique para anexar' : 'Arraste arquivos ou clique para selecionar'}
        </p>
        {!compact && (
          <p className="text-[10px] text-white/25">
            PDF, DOC, XLS, PNG, JPG, CSV, TXT, ZIP &middot; Max 10MB
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_STRING}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* File list */}
      {attachments.length > 0 && (
        <div className="space-y-1.5">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 group"
            >
              <span className="text-sm shrink-0" aria-hidden>
                {getFileIcon(file.type, file.name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 truncate">{file.name}</p>
                <p className="text-[10px] text-white/30">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => downloadFile(file.id, file.name)}
                className="shrink-0 p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-[#00B4D8] transition-colors"
                title="Baixar"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => removeFileAttachment(file.id)}
                className="shrink-0 p-1.5 rounded-md hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-colors"
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
