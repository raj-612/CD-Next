'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { uploadFile as supabaseUpload } from '@/integrations/supabase/client';

export interface FileInfo {
  url: string;
  fileName: string;
  displayName: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  title?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  onUploadComplete: (files: FileInfo[]) => void;
  initialFiles?: FileInfo[];
  className?: string;
  disabled?: boolean;
  bucket?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  title = "Upload Files",
  helperText = "Drag and drop files here, or click to select",
  accept,
  maxSize = 10,
  maxFiles = 10,
  multiple = true,
  onUploadComplete,
  initialFiles = [],
  className,
  disabled = false,
  bucket = 'Documents',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<FileInfo[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    onUploadComplete(files);
  }, [files, onUploadComplete]);

  const isUploading = uploadingFiles.length > 0;
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || isUploading) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File ${file.name} is too large. Maximum size is ${maxSize}MB.`;
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type === fileExtension;
        } else if (type.includes('/*')) {
          const [group] = type.split('/');
          const [fileGroup] = file.type.split('/');
          return group === fileGroup;
        } else {
          return type === file.type;
        }
      });

      if (!isAccepted) {
        return `File ${file.name} has an invalid type. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} files.`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;
    
    validFiles.forEach(uploadFile);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploadingFiles(prev => [...prev, file.name]);
      
      console.log('Uploading file to Supabase:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Upload to Supabase
      const { url, path } = await supabaseUpload(file, bucket);
      
      const fileInfo: FileInfo = {
        url,
        fileName: path,
        displayName: file.name,
        size: file.size,
        type: file.type
      };

      setFiles(prevFiles => [...prevFiles, fileInfo]);
      
      toast.success(`File ${file.name} uploaded successfully!`);
      
    } catch (error: any) {
      toast.error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
      console.error('Upload error:', error);
    } finally {
      setUploadingFiles(prev => prev.filter(name => name !== file.name));
    }
  };

  const removeFile = (index: number) => {
    if (isUploading) return;
    
    const newFiles = [...files];
    newFiles.splice(index, 1);
    
    setFiles(newFiles);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg p-8 text-center transition-all duration-300",
          "border-2 border-dashed",
          disabled || isUploading ? "opacity-60 pointer-events-none" : "",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
        )}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        <Upload
          className={cn(
            "mx-auto mb-4 h-8 w-8 transition-colors duration-300",
            isDragging ? "text-blue-500" : "text-gray-400"
          )}
        />
        <p className="text-gray-600 mb-2">{title}</p>
        <p className="text-gray-400 text-sm">{helperText}</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(Array.from(e.target.files));
              e.target.value = '';
            }
          }}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-600 text-sm mb-2">Uploading:</p>
          <div className="space-y-2">
            {uploadingFiles.map((fileName) => (
              <div key={fileName} className="flex items-center bg-blue-50 px-3 py-2 rounded text-sm">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                <span className="text-blue-700 flex-1 truncate">
                  {fileName} - Uploading...
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-gray-600 text-sm mb-2">Uploaded files:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center bg-blue-50 px-3 py-2 rounded text-sm">
                <span className="text-blue-700 flex-1 truncate">{file.displayName}</span>
                <button 
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                  disabled={isUploading}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 