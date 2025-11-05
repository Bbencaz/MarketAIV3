import { useState, useEffect } from 'react';
import { Upload, Info, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { CreationMethod, PostData } from '../App';

interface InputStepProps {
  creationMethod: CreationMethod;
  postData: PostData;
  onUpdate: (data: Partial<PostData>) => void;
}

export function InputStep({ creationMethod, postData, onUpdate }: InputStepProps) {
  const [description, setDescription] = useState(postData.description || '');
  const [companyName, setCompanyName] = useState(postData.companyName || '');
  const [companyPhone, setCompanyPhone] = useState(postData.companyPhone || '');
  const [uploadedImage, setUploadedImage] = useState<File | null>(postData.uploadedImage || null);
  const [imageEditDescription, setImageEditDescription] = useState(postData.imageEditDescription || '');
  const [dragActive, setDragActive] = useState(false);

  // Auto-update parent when values change
  useEffect(() => {
    if (creationMethod === 'ai-generated') {
      onUpdate({ description, companyName, companyPhone });
    } else {
      onUpdate({ uploadedImage, imageEditDescription });
    }
  }, [description, companyName, companyPhone, uploadedImage, imageEditDescription]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const scrollToNext = () => {
    document.getElementById('output-selection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isValid = creationMethod === 'ai-generated' 
    ? description.trim().length > 0 
    : uploadedImage !== null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        {creationMethod === 'ai-generated' ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
                Step 2
              </div>
              <h2 className="text-slate-900 mb-2">Describe Your Post</h2>
              <p className="text-slate-600">
                Provide a simple description and company details. The AI will create a colorful post with banners for your information.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="description">Post Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Spring sale announcement, 20% off all items this weekend"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Your Business Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="companyPhone">Company Phone Number</Label>
                <Input
                  id="companyPhone"
                  placeholder="(555) 123-4567"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
                Step 2
              </div>
              <h2 className="text-slate-900 mb-2">Upload & Enhance Your Image</h2>
              <p className="text-slate-600">
                Upload your image and describe how you'd like it enhanced with AI
              </p>
            </div>

            <div className="space-y-6">
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900">Simple AI Enhancement Process</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Upload your image, describe the changes you want, and our AI will enhance it with professional styling, filters, and text overlays.
                  </p>
                </div>
              </div>

              {/* Dropbox */}
              <div>
                <Label>Upload Image</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive
                      ? 'border-emerald-500 bg-emerald-50'
                      : uploadedImage
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${uploadedImage ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {uploadedImage ? (
                    <div>
                      <p className="text-emerald-900">{uploadedImage.name}</p>
                      <p className="text-sm text-emerald-700 mt-1">
                        File uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-700 mb-2">
                        Drag and drop your image here, or click to browse
                      </p>
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Description */}
              <div>
                <Label htmlFor="edit-description">Describe Your Desired Changes</Label>
                <Textarea
                  id="edit-description"
                  placeholder="e.g., Add a vintage filter, brighten the colors, add text overlay saying 'New Collection'"
                  value={imageEditDescription}
                  onChange={(e) => setImageEditDescription(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          </>
        )}

        {/* Continue Button */}
        {isValid && (
          <div className="mt-8 text-center">
            <Button onClick={scrollToNext} className="gap-2">
              Continue to Output Selection
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
