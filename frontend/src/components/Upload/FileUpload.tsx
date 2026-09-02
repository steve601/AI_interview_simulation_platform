import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2, FileCheck } from 'lucide-react';
import { Button } from '../UI/Button';
import { useInterview } from '../../context/InterviewContext';

export const FileUpload: React.FC = () => {
  const { candidate, setCandidate, addToast } = useInterview();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      addToast({
        type: 'error',
        title: 'Invalid File Format',
        message: 'Please upload a PDF document (.pdf).'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload a PDF of 10MB or less.'
      });
      return;
    }

    setIsUploading(true);
    try {
      // Store the File object so the backend can receive it as multipart.
      // The actual LLM extraction (CV analyzer) happens server-side
      // when the user clicks "Generate Interview Plan".
      setCandidate({
        candidateName: '',
        email: '',
        yearsOfExperience: 0,
        extractedSkills: [],
        extractedText: '',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        // Attach the raw file for the backend multipart upload
        rawFile: file,
      });
      addToast({
        type: 'success',
        title: 'CV Uploaded',
        message: `${file.name} is ready for analysis.`
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Unable to process CV. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setCandidate({
      candidateName: '',
      email: '',
      yearsOfExperience: 0,
      extractedSkills: [],
      extractedText: '',
    });
  };

  return (
    <div className="w-full space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {candidate.fileName ? (
        <div className="p-4 bg-white border border-[#CBD5E1] rounded-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xs border border-blue-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] flex items-center space-x-2">
                <span>{candidate.fileName}</span>
                <span className="text-xs font-normal text-[#64748B]">({candidate.fileSize})</span>
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-xs flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Ready for Analysis</span>
                </span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={handleClear} icon={<Trash2 className="w-4 h-4 text-red-600" />}>
            Remove
          </Button>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#2563EB] bg-blue-50/50'
              : 'border-[#CBD5E1] bg-[#FAFAFA] hover:bg-white hover:border-[#94A3B8]'
          }`}
        >
          <div className="mx-auto w-10 h-10 bg-white border border-[#CBD5E1] rounded-xs flex items-center justify-center text-[#2563EB] mb-3">
            <UploadCloud className="w-5 h-5" />
          </div>

          <h4 className="text-sm font-semibold text-[#0F172A]">
            {isUploading ? 'Processing CV...' : 'Drag & Drop candidate CV (PDF)'}
          </h4>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Or click to browse from your device. Supported format: PDF up to 10MB.
          </p>

          <div className="mt-4 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isUploading}
            >
              Browse Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
