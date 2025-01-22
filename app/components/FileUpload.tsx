"use client"

import React from 'react'

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  buttonLabel?: string
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, accept, buttonLabel }) => {
  return (
    <div>FileUpload</div>
  )
}

export default FileUpload