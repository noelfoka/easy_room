"use client"

import React, { useRef } from 'react'

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  buttonLabel?: string
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, accept="image/*", buttonLabel="Uploader une image" }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fonction qui permet de mettre à jour le fileInputRef
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>FileUpload</div>
  )
}

export default FileUpload