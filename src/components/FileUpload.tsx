'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { validateFile, formatFileSize, getFileIcon, downloadFile, ACCEPT_STRING } from '@/lib/fileStorage';
import type { DepartmentId } from '@/data/types';

interface FileUploadProps {
  entityType: 'task' | 'hiring';
  entityId: string;
  departmentId: DepartmentId;
  /** Compact mode shows a smaller drop zone */
  compact?: boolean;
  /** Light theme for white-background modals (TaskEditModal) */
  light?: boolean;
}

export default function FileUpload({ entityType, entityId, departmentId, compact, light }: FileUploadProps) {
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

  // --- Theme-aware classes ---
  const dropZoneIdle = light
    ? 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40'
    : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]';
  const dropZoneActive = 'border-[#00B4D8] bg-[#00B4D8]/10';
  const iconColor = dragOver ? 'text-[#00B4D8]' : light ? 'text-gray-400' : 'text-white/30';
  const textColor = light ? 'text-gray-500' : 'text-white/40';
  const subTextColor = light ? 'text-gray-400' : 'text-white/25';
  const fileRowBg = light ? 'bg-gray-50 border-gray-200' : 'bg-white/[0.03] border-white/5';
  const fileNameColor = light ? 'text-gray-700' : 'text-white/70';
  const fileSizeColor = light ? 'text-gray-400' : 'text-white/30';
  const btnDownload = light ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' : 'text-white/30 hover:text-[#00B4D8] hover:bg-white/10';
  const btnDelete = light ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-white/30 hover:text-red-400 hover:bg-red-500/15';
  const errorBg = light ? 'text-red-600 bg-red-50 border border-red-200' : 'text-red-400 bg-red-500/10';

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
          ${compact ? 'flex-row gap-2 px-3 py-2' : 'flex-col gap-2 p-5'}
          ${dragOver ? dropZoneActive : dropZoneIdle}
        `}
      >
        <Upload size={compact ? 14 : 22} className={iconColor} />
        <p className={`${textColor} text-center ${compact ? 'text-[10px]' : 'text-sm'}`}>
          {uploading ? 'Enviando...' : compact ? 'Arraste ou clique para anexar' : 'Arraste arquivos aqui ou clique para selecionar'}
        </p>
        {!compact && (
          <p className={`text-xs ${subTextColor}`}>
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
        <p className={`text-xs rounded-lg px-3 py-2 ${errorBg}`}>
          {error}
        </p>
      )}

      {/* File list */}
      {attachments.length > 0 && (
        <div className="space-y-1.5">
          {attachments.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 group ${fileRowBg}`}
            >
              <span className="text-sm shrink-0" aria-hidden>
                {getFileIcon(file.type, file.name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${fileNameColor}`}>{file.name}</p>
                <p className={`text-[10px] ${fileSizeColor}`}>{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => downloadFile(file.id, file.name)}
                className={`shrink-0 p-1.5 rounded-md transition-colors ${btnDownload}`}
                title="Baixar"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => removeFileAttachment(file.id)}
                className={`shrink-0 p-1.5 rounded-md transition-colors ${btnDelete}`}
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
