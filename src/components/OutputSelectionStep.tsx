import { useState } from 'react';
import { Loader2, ServerCrash, ArrowDown, Wand2, WifiOff, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import type { PostData } from '../App';

interface OutputSelectionStepProps {
  postData: PostData;
  onSelect: (outputIndex: number) => void;
}

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function OutputSelectionStep({ postData, onSelect }: OutputSelectionStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // This function is now called by a button click, not useEffect
  const performImageEdit = async () => {
    if (!postData.uploadedImage || !postData.imageEditDescription) {
      setError("Missing image or prompt. Please go back and try again.");
      setErrorCode("VALIDATION_ERROR");
      return;
    }

    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    setEditedImageUrl(null);

    const formData = new FormData();
    formData.append('image', postData.uploadedImage);
    formData.append('prompt', postData.imageEditDescription);

    try {
      const response = await fetch(`${BACKEND_URL}/api/edit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { 
            error: `Server returned status ${response.status}`,
            code: 'HTTP_ERROR'
          };
        }
        
        setErrorCode(errorData.code || 'UNKNOWN');
        throw new Error(errorData.message || errorData.error || 'Failed to process image');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setEditedImageUrl(imageUrl);
      setRetryCount(0);

    } catch (err) {
      console.error('Failed to edit image:', err);
      
      // Network error (backend not reachable)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the backend server. Please ensure the backend is running.');
        setErrorCode('NETWORK_ERROR');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        if (!errorCode) {
          setErrorCode('UNKNOWN');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    performImageEdit();
  };

  const scrollToNext = () => {
    onSelect(0);
    document.getElementById('platform-hashtags')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Render appropriate icon based on error code
  const renderErrorIcon = () => {
    switch (errorCode) {
      case 'NETWORK_ERROR':
      case 'CONNECTION_FAILED':
        return <WifiOff className="w-12 h-12 mx-auto text-red-500" />;
      case 'TIMEOUT':
        return <Clock className="w-12 h-12 mx-auto text-red-500" />;
      default:
        return <ServerCrash className="w-12 h-12 mx-auto text-red-500" />;
    }
  };

  // Render helpful error message based on error code
  const renderErrorHelp = () => {
    switch (errorCode) {
      case 'NETWORK_ERROR':
        return (
          <div className="mt-4 text-sm text-slate-600 bg-slate-100 p-3 rounded">
            <p className="font-semibold">Troubleshooting:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Ensure the backend server is running on {BACKEND_URL}</li>
              <li>Check if the backend server started successfully</li>
              <li>Verify the VITE_BACKEND_URL in your .env file</li>
            </ul>
          </div>
        );
      case 'CONNECTION_FAILED':
        return (
          <div className="mt-4 text-sm text-slate-600 bg-slate-100 p-3 rounded">
            <p className="font-semibold">The AI server is not reachable:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The AI server may be offline or restarting</li>
              <li>Check if the Ngrok URL is configured correctly</li>
              <li>Verify the COLAB_AI_SERVER_URL in backend/.env</li>
            </ul>
          </div>
        );
      case 'TIMEOUT':
        return (
          <div className="mt-4 text-sm text-slate-600 bg-slate-100 p-3 rounded">
            <p className="font-semibold">The request timed out:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Try with a simpler prompt or smaller image</li>
              <li>The AI server may be processing too many requests</li>
              <li>Click retry to try again</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // Determine what to show in the main display area
  const renderDisplayContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-slate-500">
          <Loader2 className="w-12 h-12 mx-auto animate-spin" />
          <p className="mt-4 font-semibold">Your image is being enhanced by the AI...</p>
          <p className="text-sm text-slate-400 mt-2">This may take up to a minute.</p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 text-left">
                Processing complex images may take longer. Please be patient and don't refresh the page.
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-500 max-w-md mx-auto px-4">
          {renderErrorIcon()}
          <p className="mt-4 font-semibold text-lg">Error Processing Image</p>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          {renderErrorHelp()}
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="mt-4 gap-2"
          >
            Try Again {retryCount > 0 && `(Attempt ${retryCount + 1})`}
          </Button>
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