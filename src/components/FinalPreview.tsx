import { Download, Save, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { PostData } from '../App';
import { InstagramPreview, TwitterPreview, LinkedInPreview, FacebookPreview, TikTokPreview } from './SocialPreviews';

interface FinalPreviewProps {
  postData: PostData;
  onSave: () => void;
}

export function FinalPreview({ postData, onSave }: FinalPreviewProps) {
  const platformIcons = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
  };

  const PlatformIcon = postData.platform ? platformIcons[postData.platform] : null;

  // Mock gradient for preview (would use selected output in real app)
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ];
  const imageUrl = gradients[postData.selectedOutput ?? 0];

  // Render platform-specific preview
  const renderPlatformPreview = () => {
    switch (postData.platform) {
      case 'instagram':
        return <InstagramPreview postData={postData} imageUrl={imageUrl} />;
      case 'twitter':
        return <TwitterPreview postData={postData} imageUrl={imageUrl} />;
      case 'linkedin':
        return <LinkedInPreview postData={postData} imageUrl={imageUrl} />;
      case 'facebook':
        return <FacebookPreview postData={postData} imageUrl={imageUrl} />;
      case 'tiktok':
        return <TikTokPreview postData={postData} imageUrl={imageUrl} />;
      default:
        return <InstagramPreview postData={postData} imageUrl={imageUrl} />;
    }
  };

  const handleDownload = () => {
    alert('Post downloaded! (This would trigger an actual download in production)');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
          Step 5
        </div>
        <h2 className="text-slate-900 mb-2">Final Preview</h2>
        <p className="text-slate-600">
          Review your post before saving to your catalog
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview Panel */}
        <div className="bg-slate-50 rounded-2xl p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-slate-900">Post Preview</h3>
            {PlatformIcon && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200">
                <PlatformIcon className="w-4 h-4 text-slate-700" />
                <span className="text-sm capitalize text-slate-700">{postData.platform}</span>
              </div>
            )}
          </div>

          {/* Platform-Specific Preview */}
          <div className="mb-6">
            {renderPlatformPreview()}
          </div>

          {/* Additional Info */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-600 mb-2">Preview Details:</p>
            <div className="space-y-1 text-xs text-slate-700">
              {postData.caption && (
                <p>• Caption: {postData.caption.substring(0, 50)}{postData.caption.length > 50 ? '...' : ''}</p>
              )}
              <p>• Hashtags: {postData.hashtags.length} added</p>
              <p>• Platform: {postData.platform}</p>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-900 mb-4">Post Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Creation Method</p>
                <p className="text-slate-900 capitalize">
                  {postData.creationMethod === 'ai-generated' 
                    ? 'AI-Generated Content' 
                    : 'Upload & Enhance'}
                </p>
              </div>

              {postData.platform && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Platform</p>
                  <p className="text-slate-900 capitalize">{postData.platform}</p>
                </div>
              )}

              {postData.companyName && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Company Name</p>
                  <p className="text-slate-900">{postData.companyName}</p>
                </div>
              )}

              {postData.companyPhone && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone Number</p>
                  <p className="text-slate-900">{postData.companyPhone}</p>
                </div>
              )}

              {postData.caption && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Caption</p>
                  <p className="text-slate-900 text-sm line-clamp-3">{postData.caption}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 mb-1">Hashtags</p>
                <p className="text-slate-900">
                  {postData.hashtags.length} hashtag{postData.hashtags.length !== 1 ? 's' : ''} added
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleDownload} variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download Post
            </Button>

            <Button onClick={onSave} className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save to Catalog
            </Button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Your post will be saved to your catalog where you can access it anytime for publishing or editing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
