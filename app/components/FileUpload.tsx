"use client";

import { ImageDown } from "lucide-react";
import React, { useRef } from "react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  buttonLabel?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = "image/*",
  buttonLabel = "Uploader une image",
}) => {
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
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="cursor-pointer w-full flex justify-center items-center flex-col-reverse"
        onClick={handleClick}
      >
        <ImageDown className="mt-5 w-8" />
        <span className="ml-2 font-bold">{buttonLabel}</span>
      </div>
    </div>
  );
};

export default FileUpload;
