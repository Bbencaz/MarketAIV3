import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Repeat2, Share2, ThumbsUp, Share, Music } from 'lucide-react';
import type { PostData } from '../App';

interface SocialPreviewProps {
  postData: PostData;
  imageUrl: string;
}

// Instagram Preview
export function InstagramPreview({ postData, imageUrl }: SocialPreviewProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs">
              {postData.companyName?.[0] || 'M'}
            </div>
          </div>
          <span className="text-sm">{postData.companyName || 'Your Company'}</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-900" />
      </div>

      {/* Image */}
      <div className="aspect-square bg-slate-100" style={{ background: imageUrl }}>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6" />
            <MessageCircle className="w-6 h-6" />
            <Send className="w-6 h-6" />
          </div>
          <Bookmark className="w-6 h-6" />
        </div>

        {/* Likes */}
        <div>
          <p className="text-sm">1,234 likes</p>
        </div>

        {/* Caption */}
        {postData.caption && (
          <div className="text-sm">
            <span className="mr-2">{postData.companyName || 'your_company'}</span>
            <span className="text-slate-700">{postData.caption}</span>
          </div>
        )}

        {/* Hashtags */}
        {postData.hashtags && postData.hashtags.length > 0 && (
          <div className="text-sm text-blue-700">
            {postData.hashtags.join(' ')}
          </div>
        )}

        {/* Time */}
        <p className="text-xs text-slate-500 uppercase">2 hours ago</p>
      </div>
    </div>
  );
}

// Twitter/X Preview
export function TwitterPreview({ postData, imageUrl }: SocialPreviewProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden max-w-xl mx-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 text-white">
            {postData.companyName?.[0] || 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{postData.companyName || 'Your Company'}</span>
              <span className="text-sm text-slate-500">@{(postData.companyName || 'company').toLowerCase().replace(/\s+/g, '')}</span>
              <span className="text-sm text-slate-500">· 2h</span>
            </div>

            {/* Caption/Tweet Text */}
            {postData.caption && (
              <p className="text-sm text-slate-900 mb-3 whitespace-pre-wrap">
                {postData.caption}
              </p>
            )}

            {/* Hashtags */}
            {postData.hashtags && postData.hashtags.length > 0 && (
              <p className="text-sm text-blue-500 mb-3">
                {postData.hashtags.join(' ')}
              </p>
            )}

            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 mb-3" style={{ background: imageUrl }}>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-slate-500 max-w-md">
              <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">124</span>
              </div>
              <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer">
                <Repeat2 className="w-4 h-4" />
                <span className="text-xs">89</span>
              </div>
              <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="text-xs">1.2K</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// LinkedIn Preview
export function LinkedInPreview({ postData, imageUrl }: SocialPreviewProps) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden max-w-xl mx-auto shadow-sm">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0 text-white">
            {postData.companyName?.[0] || 'M'}
          </div>
          <div className="flex-1">
            <h3 className="text-sm">{postData.companyName || 'Your Company'}</h3>
            <p className="text-xs text-slate-600">1,234 followers</p>
            <p className="text-xs text-slate-500">2h · 🌐</p>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </div>

        {/* Caption */}
        {postData.caption && (
          <div className="mb-3 text-sm text-slate-900 whitespace-pre-wrap">
            {postData.caption}
          </div>
        )}

        {/* Hashtags */}
        {postData.hashtags && postData.hashtags.length > 0 && (
          <div className="mb-3 text-sm text-blue-700">
            {postData.hashtags.join(' ')}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-video bg-slate-100 border-y border-slate-200" style={{ background: imageUrl }}>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center">
                <ThumbsUp className="w-2 h-2 text-white" />
              </div>
              <div className="w-4 h-4 rounded-full bg-green-600 border border-white"></div>
            </div>
            <span>234</span>
          </div>
          <div className="flex gap-3">
            <span>45 comments</span>
            <span>12 reposts</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center justify-around">
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-3 py-2 rounded">
          <ThumbsUp className="w-5 h-5" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-3 py-2 rounded">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-3 py-2 rounded">
          <Repeat2 className="w-5 h-5" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-3 py-2 rounded">
          <Send className="w-5 h-5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}

// Facebook Preview
export function FacebookPreview({ postData, imageUrl }: SocialPreviewProps) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden max-w-xl mx-auto shadow-sm">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white">
            {postData.companyName?.[0] || 'M'}
          </div>
          <div className="flex-1">
            <h3 className="text-sm">{postData.companyName || 'Your Company'}</h3>
            <p className="text-xs text-slate-500">2 hours ago · 🌐</p>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </div>

        {/* Caption */}
        {postData.caption && (
          <div className="mb-3 text-sm text-slate-900 whitespace-pre-wrap">
            {postData.caption}
          </div>
        )}

        {/* Hashtags */}
        {postData.hashtags && postData.hashtags.length > 0 && (
          <div className="mb-3 text-sm text-blue-600">
            {postData.hashtags.join(' ')}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square bg-slate-100" style={{ background: imageUrl }}>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-y border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-600 border border-white flex items-center justify-center">
                <ThumbsUp className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 rounded-full bg-red-600 border border-white flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>
            <span>1.2K</span>
          </div>
          <div className="flex gap-3">
            <span>89 Comments</span>
            <span>34 Shares</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center justify-around border-b border-slate-200">
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-4 py-2 rounded flex-1 justify-center">
          <ThumbsUp className="w-5 h-5" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-4 py-2 rounded flex-1 justify-center">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-4 py-2 rounded flex-1 justify-center">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

// TikTok Preview
export function TikTokPreview({ postData, imageUrl }: SocialPreviewProps) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden max-w-sm mx-auto aspect-[9/16] relative">
      {/* Background Video/Image */}
      <div className="absolute inset-0" style={{ background: imageUrl }}>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent">
        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 mb-2 flex items-center justify-center">
              {postData.companyName?.[0] || 'M'}
            </div>
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center -mt-4 border-2 border-black">
              <span className="text-white text-xs">+</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-white">
            <Heart className="w-8 h-8 mb-1" />
            <span className="text-xs">234K</span>
          </div>

          <div className="flex flex-col items-center text-white">
            <MessageCircle className="w-8 h-8 mb-1" />
            <span className="text-xs">1,234</span>
          </div>

          <div className="flex flex-col items-center text-white">
            <Bookmark className="w-8 h-8 mb-1" />
            <span className="text-xs">5,678</span>
          </div>

          <div className="flex flex-col items-center text-white">
            <Share2 className="w-8 h-8 mb-1" />
            <span className="text-xs">890</span>
          </div>

          <div className="w-10 h-10 rounded-lg bg-slate-700 border-2 border-white flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-white space-y-2 pr-16">
          <h3 className="text-sm">@{(postData.companyName || 'company').toLowerCase().replace(/\s+/g, '')}</h3>
          
          {postData.caption && (
            <p className="text-sm line-clamp-2">{postData.caption}</p>
          )}

          {postData.hashtags && postData.hashtags.length > 0 && (
            <p className="text-sm">
              {postData.hashtags.slice(0, 3).join(' ')}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs">
            <Music className="w-3 h-3" />
            <span>Original Audio - {postData.companyName || 'Your Company'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
