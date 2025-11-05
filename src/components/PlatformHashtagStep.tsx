import { useState, useEffect } from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Plus, X, Sparkles, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import type { Platform, PostData } from '../App';

interface PlatformHashtagStepProps {
  postData: PostData;
  onUpdate: (data: Partial<PostData>) => void;
}

const platforms = [
  { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' },
  { id: 'facebook' as Platform, name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'twitter' as Platform, name: 'Twitter/X', icon: Twitter, color: 'bg-slate-900' },
  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
];

export function PlatformHashtagStep({ postData, onUpdate }: PlatformHashtagStepProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(postData.platform || null);
  const [hashtags, setHashtags] = useState<string[]>(postData.hashtags || []);
  const [hashtagInput, setHashtagInput] = useState('');
  const [caption, setCaption] = useState<string>(postData.caption || '');

  useEffect(() => {
    onUpdate({ platform: selectedPlatform, hashtags, caption });
  }, [selectedPlatform, hashtags, caption]);

  const addHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !hashtags.includes(tag)) {
      const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
      setHashtags([...hashtags, formattedTag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((h) => h !== tag));
  };

  const generateAIHashtags = () => {
    // Mock AI-generated hashtags based on post data
    const aiHashtags = [
      '#Marketing',
      '#SocialMedia',
      '#Business',
      '#Sale',
      '#NewPost',
      '#DigitalMarketing',
    ];
    const newTags = aiHashtags.filter((tag) => !hashtags.includes(tag));
    setHashtags([...hashtags, ...newTags.slice(0, 3)]);
  };

  const scrollToNext = () => {
    document.getElementById('final-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isValid = selectedPlatform !== null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
            Step 4
          </div>
          <h2 className="text-slate-900 mb-2">Platform & Hashtags</h2>
          <p className="text-slate-600">
            Choose your social media platform and add hashtags
          </p>
        </div>

        {/* Platform Selection */}
        <div className="mb-8">
          <Label className="mb-4 block">Select Platform</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`cursor-pointer rounded-xl p-6 transition-all ${
                  selectedPlatform === platform.id
                    ? 'ring-4 ring-blue-500 scale-105 bg-white shadow-xl'
                    : 'bg-slate-50 hover:scale-105 hover:shadow-lg'
                }`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className={`${platform.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-center text-sm text-slate-700">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Caption Section */}
        <div className="mb-8">
          <Label className="mb-3 block">Post Caption</Label>
          <Textarea
            placeholder="Write your post caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-sm text-slate-500 mt-2">
            {caption.length} characters
          </p>
        </div>

        {/* Hashtag Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Hashtags</Label>
            <Button
              onClick={generateAIHashtags}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </Button>
          </div>

          {/* Hashtag Input */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter hashtag (e.g., marketing)"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHashtag();
                }
              }}
            />
            <Button onClick={addHashtag} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Hashtag Display */}
          {hashtags.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4 min-h-[100px]">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {hashtags.length === 0 && (
            <div className="bg-slate-50 rounded-lg p-8 text-center min-h-[100px] flex items-center justify-center">
              <p className="text-slate-500 text-sm">
                No hashtags added yet. Add manually or use AI to generate.
              </p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        {isValid && (
          <div className="mt-8 text-center">
            <Button onClick={scrollToNext} className="gap-2">
              Continue to Preview
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
