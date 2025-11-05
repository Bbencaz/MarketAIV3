import { Zap, ImagePlus, Sparkles, Type, Hash } from 'lucide-react';
import type { CreationMethod } from '../App';

interface CreationMethodStepProps {
  selectedMethod: CreationMethod;
  onSelect: (method: CreationMethod) => void;
}

export function CreationMethodStep({ selectedMethod, onSelect }: CreationMethodStepProps) {
  const scrollToNext = () => {
    setTimeout(() => {
      document.getElementById('input')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelect = (method: CreationMethod) => {
    onSelect(method);
    scrollToNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
          Step 1
        </div>
        <h2 className="text-slate-900 mb-2">Choose Your Creation Method</h2>
        <p className="text-slate-600">Select how you'd like to create your social media post</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AI-Generated Content */}
        <div
          className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
            selectedMethod === 'ai-generated'
              ? 'border-purple-500 ring-4 ring-purple-200'
              : 'border-transparent hover:border-purple-500'
          }`}
          onClick={() => handleSelect('ai-generated')}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-center text-slate-900 mb-3">AI-Generated Content</h3>
          <p className="text-center text-slate-600 mb-6">
            Create complete posts with AI-generated images and content from just a text description
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 text-slate-600">
              <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" />
              <span className="text-sm">AI creates custom visuals</span>
            </div>
            <div className="flex items-start gap-3 text-slate-600">
              <Type className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" />
              <span className="text-sm">Generates engaging copy</span>
            </div>
            <div className="flex items-start gap-3 text-slate-600">
              <Hash className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" />
              <span className="text-sm">Smart hashtag suggestions</span>
            </div>
          </div>

          <button className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-center">
            {selectedMethod === 'ai-generated' ? 'Selected' : 'Start Creating'}
          </button>
        </div>

        {/* Upload & Enhance */}
        <div
          className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
            selectedMethod === 'upload-enhance'
              ? 'border-emerald-500 ring-4 ring-emerald-200'
              : 'border-transparent hover:border-emerald-500'
          }`}
          onClick={() => handleSelect('upload-enhance')}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
              <ImagePlus className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-center text-slate-900 mb-3">Upload & Enhance</h3>
          <p className="text-center text-slate-600 mb-6">
            Upload your own image and enhance it with AI-powered styling and text overlays
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 text-slate-600">
              <ImagePlus className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-500" />
              <span className="text-sm">Upload any image</span>
            </div>
            <div className="flex items-start gap-3 text-slate-600">
              <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-500" />
              <span className="text-sm">AI-enhanced styling</span>
            </div>
            <div className="flex items-start gap-3 text-slate-600">
              <Type className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-500" />
              <span className="text-sm">Smart text overlays</span>
            </div>
          </div>

          <button className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-center">
            {selectedMethod === 'upload-enhance' ? 'Selected' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
