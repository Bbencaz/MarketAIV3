import { useState } from 'react';
import { Loader2, ServerCrash, ArrowDown, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import type { PostData } from '../App';

interface OutputSelectionStepProps {
  postData: PostData;
  onSelect: (outputIndex: number) => void;
}

export function OutputSelectionStep({ postData, onSelect }: OutputSelectionStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  // This function is now called by a button click, not useEffect
  const performImageEdit = async () => {
    if (!postData.uploadedImage || !postData.imageEditDescription) {
      setError("Missing image or prompt. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    const formData = new FormData();
    formData.append('image', postData.uploadedImage);
    formData.append('prompt', postData.imageEditDescription);

    try {
      const response = await fetch('http://localhost:3000/api/edit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `The AI server failed with status: ${response.status}` }));
        throw new Error(errorData.error);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setEditedImageUrl(imageUrl);

    } catch (err) {
      console.error('Failed to edit image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToNext = () => {
    onSelect(0);
    document.getElementById('platform-hashtags')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Determine what to show in the main display area
  const renderDisplayContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-slate-500">
          <Loader2 className="w-12 h-12 mx-auto animate-spin" />
          <p className="mt-4">Your image is being enhanced by the AI...</p>
          <p className="text-sm text-slate-400">This may take up to a minute.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-500 max-w-md mx-auto">
          <ServerCrash className="w-12 h-12 mx-auto" />
          <p className="mt-4 font-semibold">Error Processing Image</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
        </div>
      );
    }
    if (editedImageUrl) {
      return <img src={editedImageUrl} alt="AI Edited Output" className="w-full h-full object-contain rounded-lg" />;
    }
    // Default state: Show the original image and the "Enhance" button
    if (postData.uploadedImage) {
      return (
        <div className="relative w-full h-full">
          <img src={URL.createObjectURL(postData.uploadedImage)} alt="Original for editing" className="w-full h-full object-contain rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Button size="lg" onClick={performImageEdit} className="gap-2 text-lg">
              <Wand2 className="w-5 h-5" />
              Enhance with AI
            </Button>
          </div>
        </div>
      );
    }
    return null; // Should not happen if logic is correct
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm mb-4">
            Step 3
          </div>
          <h2 className="text-slate-900 mb-2">Enhance Your Image</h2>
          <p className="text-slate-600">
            Click the button to apply your changes with AI.
          </p>
        </div>

        <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center border">
          {renderDisplayContent()}
        </div>

        {editedImageUrl && !isLoading && (
          <div className="mt-8 text-center">
            <Button onClick={scrollToNext} className="gap-2">
              Continue to Final Preview
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}