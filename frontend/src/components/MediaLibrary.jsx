import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Upload, Image as ImageIcon, Video, Music, File, Trash2, 
  Eye, Download, Play, Pause, CheckCircle2
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const MediaLibrary = () => {
  const [uploadedMedia, setUploadedMedia] = useState([
    {
      id: 1,
      name: 'pkwy-intro.mp4',
      type: 'video',
      size: '15.2 MB',
      duration: '10s',
      url: '/media/videos/pkwy-intro.mp4',
      thumbnail: '/media/thumbnails/pkwy-intro.jpg',
      usage: 'Venue Intro'
    },
    {
      id: 2,
      name: 'jeopardy-background.jpg',
      type: 'image',
      size: '2.1 MB',
      dimensions: '1920x1080',
      url: '/media/images/jeopardy-bg.jpg',
      usage: 'Question Background'
    },
    {
      id: 3,
      name: 'transition-wipe.mp4',
      type: 'video',
      size: '5.8 MB',
      duration: '2s',
      url: '/media/transitions/wipe.mp4',
      usage: 'Transition Effect'
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const handleFileUpload = (event, mediaType) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: mediaType,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          url: e.target.result,
          usage: 'Unused'
        };
        
        if (mediaType === 'video') {
          const video = document.createElement('video');
          video.src = e.target.result;
          video.onloadedmetadata = () => {
            newMedia.duration = `${Math.round(video.duration)}s`;
            setUploadedMedia(prev => [...prev, newMedia]);
          };
        } else if (mediaType === 'image') {
          const img = new window.Image();
          img.src = e.target.result;
          img.onload = () => {
            newMedia.dimensions = `${img.width}x${img.height}`;
            setUploadedMedia(prev => [...prev, newMedia]);
          };
        } else {
          setUploadedMedia(prev => [...prev, newMedia]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    toast({
      title: 'Upload Complete',
      description: `${files.length} file(s) uploaded successfully`
    });
  };

  const deleteMedia = (id) => {
    setUploadedMedia(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Media Deleted' });
  };

  const filteredMedia = uploadedMedia.filter(m => 
    activeTab === 'all' || m.type === activeTab
  );

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Upload graphics from Dzine and videos from Higgsfield AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Images */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                multiple
                onChange={(e) => handleFileUpload(e, 'image')}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <p className="font-semibold mb-1">Upload Images</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP, SVG</p>
                <p className="text-xs text-muted-foreground mt-1">Max 10MB each</p>
              </Label>
            </div>

            {/* Videos */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <Input
                type="file"
                accept="video/mp4,video/webm"
                multiple
                onChange={(e) => handleFileUpload(e, 'video')}
                className="hidden"
                id="video-upload"
              />
              <Label htmlFor="video-upload" className="cursor-pointer">
                <Video className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                <p className="font-semibold mb-1">Upload Videos</p>
                <p className="text-xs text-muted-foreground">MP4, WebM</p>
                <p className="text-xs text-muted-foreground mt-1">Max 50MB each</p>
              </Label>
            </div>

            {/* Audio */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <Input
                type="file"
                accept="audio/mp3,audio/wav,audio/ogg"
                multiple
                onChange={(e) => handleFileUpload(e, 'audio')}
                className="hidden"
                id="audio-upload"
              />
              <Label htmlFor="audio-upload" className="cursor-pointer">
                <Music className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="font-semibold mb-1">Upload Audio</p>
                <p className="text-xs text-muted-foreground">MP3, WAV, OGG</p>
                <p className="text-xs text-muted-foreground mt-1">Max 20MB each</p>
              </Label>
            </div>
          </div>

          {/* Format Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Recommended Formats</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium">Images (Dzine):</p>
                <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                  <li>PNG with transparency for overlays</li>
                  <li>JPG for backgrounds (1920x1080)</li>
                  <li>WebP for optimized loading</li>
                  <li>SVG for logos and icons</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Videos (Higgsfield AI):</p>
                <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                  <li>MP4 (H.264) most compatible</li>
                  <li>WebM for web optimization</li>
                  <li>1920x1080 @ 30fps ideal</li>
                  <li>Max 10-15 seconds for intros</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>{uploadedMedia.length} files uploaded</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({uploadedMedia.length})</TabsTrigger>
              <TabsTrigger value="image">Images ({uploadedMedia.filter(m => m.type === 'image').length})</TabsTrigger>
              <TabsTrigger value="video">Videos ({uploadedMedia.filter(m => m.type === 'video').length})</TabsTrigger>
              <TabsTrigger value="audio">Audio ({uploadedMedia.filter(m => m.type === 'audio').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((media) => (
                  <Card key={media.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                      {media.type === 'image' && media.url ? (
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                      ) : media.type === 'video' ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
                          <Play className="w-12 h-12 text-white" />
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {media.duration}
                          </span>
                        </div>
                      ) : (
                        <Music className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <p className="font-medium text-sm truncate" title={media.name}>
                          {media.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {media.size} • {media.dimensions || media.duration}
                        </p>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {media.usage}
                      </Badge>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteMedia(media.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMedia.length === 0 && (
                <div className="text-center py-12">
                  <File className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} files uploaded yet</p>
                  <p className="text-sm text-muted-foreground">Upload your media to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Your Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Venue Branding
              </h4>
              <ul className="text-sm space-y-2 ml-6">
                <li>• Upload logo (PNG with transparency)</li>
                <li>• Set as venue logo in Branding settings</li>
                <li>• Appears on all screens automatically</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Intro Videos
              </h4>
              <ul className="text-sm space-y-2 ml-6">
                <li>• Upload 10-15 second MP4</li>
                <li>• Assign to game in settings</li>
                <li>• Plays when TV display opens</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Question Backgrounds
              </h4>
              <ul className="text-sm space-y-2 ml-6">
                <li>• Upload 1920x1080 JPG images</li>
                <li>• Set per question or category</li>
                <li>• Enhances visual appeal</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Transition Effects
              </h4>
              <ul className="text-sm space-y-2 ml-6">
                <li>• Upload 2-3 second videos</li>
                <li>• Set as transition in game settings</li>
                <li>• Plays between questions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibrary;
