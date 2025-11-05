import { useState, useEffect } from 'react';
import { CreationMethodStep } from './components/CreationMethodStep';
import { InputStep } from './components/InputStep';
import { OutputSelectionStep } from './components/OutputSelectionStep';
import { PlatformHashtagStep } from './components/PlatformHashtagStep';
import { FinalPreview } from './components/FinalPreview';
import { AuthDialog } from './components/AuthDialog';
import { UserMenu } from './components/UserMenu';
import { CatalogDialog } from './components/CatalogDialog';
import { SocialLinksDialog } from './components/SocialLinksDialog';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { LogIn } from 'lucide-react';

export type CreationMethod = 'ai-generated' | 'upload-enhance' | null;
export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | null;

export interface PostData {
  creationMethod: CreationMethod;
  description?: string;
  uploadedImage?: File;
  imageEditDescription?: string;
  selectedOutput?: number;
  platform?: Platform;
  hashtags: string[];
  caption?: string;
  companyName?: string;
  companyPhone?: string;
}

export default function App() {
  const [postData, setPostData] = useState<PostData>({
    creationMethod: null,
    hashtags: [],
  });

  // Auth state
  const [user, setUser] = useState<{ email: string; name: string; accessToken: string } | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCatalogDialog, setShowCatalogDialog] = useState(false);
  const [showSocialLinksDialog, setShowSocialLinksDialog] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, boolean>>({});

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem('marketai_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    checkSession();
  }, []);

  const updatePostData = (data: Partial<PostData>) => {
    setPostData((prev) => ({ ...prev, ...data }));
  };

  const resetFlow = () => {
    setPostData({
      creationMethod: null,
      hashtags: [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (userData: { email: string; name: string; accessToken: string }) => {
    setUser(userData);
    localStorage.setItem('marketai_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('marketai_user');
    alert('Logged out successfully');
  };

  const handleSavePost = async () => {
    if (!user) {
      alert('Please login to save posts to your catalog');
      setShowAuthDialog(true);
      return;
    }

    try {
      // Generate a mock image URL for the post
      const imageUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500';

      const { projectId } = await import('./utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d4ba6aee/api/catalog/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          platform: postData.platform,
          caption: postData.caption || '',
          hashtags: postData.hashtags,
          imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save post');

      alert('Post saved to catalog!');
      resetFlow();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-300 px-6 py-6 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-4xl tracking-tight" style={{ 
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>MarketAI</h1>
          <p className="text-slate-600 text-lg tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Social Media Post Creator</p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu
              user={user}
              onLogout={handleLogout}
              onOpenCatalog={() => setShowCatalogDialog(true)}
              onOpenSocialLinks={() => setShowSocialLinksDialog(true)}
            />
          ) : (
            <Button
              onClick={() => setShowAuthDialog(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <LogIn className="w-4 h-4" />
              Login / Register
            </Button>
          )}

          <button
            onClick={resetFlow}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Catalog Dialog */}
      {user && (
        <CatalogDialog
          open={showCatalogDialog}
          onClose={() => setShowCatalogDialog(false)}
          accessToken={user.accessToken}
          connectedAccounts={connectedAccounts}
        />
      )}

      {/* Social Links Dialog */}
      {user && (
        <SocialLinksDialog
          open={showSocialLinksDialog}
          onClose={() => setShowSocialLinksDialog(false)}
          accessToken={user.accessToken}
          onConnectionsUpdate={setConnectedAccounts}
        />
      )}

      {/* Main Content - All sections visible on scroll */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Step 1: Creation Method */}
        <section id="creation-method" className="scroll-mt-24">
          <CreationMethodStep
            selectedMethod={postData.creationMethod}
            onSelect={(method) => updatePostData({ creationMethod: method })}
          />
        </section>

        {/* Step 2: Input */}
        {postData.creationMethod && (
          <section id="input" className="scroll-mt-24">
            <InputStep
              creationMethod={postData.creationMethod}
              postData={postData}
              onUpdate={updatePostData}
            />
          </section>
        )}

        {/* Step 3: Output Selection */}
        {postData.creationMethod && (
          (postData.description || postData.uploadedImage) && (
            <section id="output-selection" className="scroll-mt-24">
              <OutputSelectionStep
                creationMethod={postData.creationMethod}
                postData={postData}
                onSelect={(outputIndex) => updatePostData({ selectedOutput: outputIndex })}
              />
            </section>
          )
        )}

        {/* Step 4: Platform & Hashtags */}
        {postData.selectedOutput !== undefined && (
          <section id="platform-hashtags" className="scroll-mt-24">
            <PlatformHashtagStep
              postData={postData}
              onUpdate={updatePostData}
            />
          </section>
        )}

        {/* Step 5: Final Preview */}
        {postData.platform && (
          <section id="final-preview" className="scroll-mt-24">
            <FinalPreview
              postData={postData}
              onSave={handleSavePost}
            />
          </section>
        )}
      </main>

      {/* Footer spacing */}
      <div className="h-24"></div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
