import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Video, Download, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type VideoGenerationProps = {
  storyText: string;
  imageUrl?: string | null; // accepted for API compat; not currently used in the component body
  theme: string;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
};

const themeEmojis: Record<string, string[]> = {
  adventure: ['🗺️', '⚔️', '🏔️', '🌋', '🧭', '🏴‍☠️'],
  fantasy: ['🧙‍♂️', '🦄', '🏰', '✨', '🔮', '🐉'],
  mystery: ['🔍', '🗝️', '🕵️', '❓', '🌙', '👀'],
  friendship: ['🤝', '💕', '👫', '🌈', '🎉', '💛'],
  animals: ['🐶', '🐱', '🦋', '🐰', '🦁', '🐘'],
  space: ['🚀', '🌍', '⭐', '🛸', '👨‍🚀', '🪐'],
  halloween: ['🎃', '👻', '🦇', '🕷️', '🌙', '🏚️'],
  christmas: ['🎄', '🎅', '⛄', '🎁', '❄️', '🔔'],
  default: ['📖', '🌟', '✨', '🎭', '🎨', '💫'],
};

function generateSlideshowCanvas(
  sentences: string[], 
  theme: string,
  onComplete: (dataUrl: string) => void
): void {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;
  const emojis = themeEmojis[theme] || themeEmojis.default;
  
  // Generate a story illustration canvas image
  const bgColors = [
    ['#E8D5F5', '#D4E8FC'], // purple-blue
    ['#FCE4D6', '#FEF3C7'], // orange-yellow 
    ['#D1FAE5', '#DBEAFE'], // green-blue
    ['#FDE8E8', '#E8D5F5'], // pink-purple
    ['#FEF3C7', '#D1FAE5'], // yellow-green
  ];
  
  const colorPair = bgColors[Math.floor(Math.random() * bgColors.length)];
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colorPair[0]);
  gradient.addColorStop(1, colorPair[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw scene emojis
  ctx.font = '48px serif';
  const sceneEmojis = emojis.sort(() => Math.random() - 0.5).slice(0, 4);
  const positions = [[80, 80], [500, 70], [120, 260], [480, 250]];
  sceneEmojis.forEach((emoji, i) => {
    ctx.fillText(emoji, positions[i][0], positions[i][1]);
  });
  
  // Draw story excerpt
  const excerpt = sentences.length > 0 
    ? sentences[0].substring(0, 80) + (sentences[0].length > 80 ? '...' : '')
    : 'Your Story';
  
  // Text background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.roundRect(50, 120, 540, 120, 16);
  ctx.fill();
  
  // Title
  ctx.fillStyle = '#6B21A8';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📖 Your Story Scene', 320, 155);
  
  // Story text
  ctx.fillStyle = '#374151';
  ctx.font = '14px Arial, sans-serif';
  const maxWidth = 480;
  const lineText = excerpt;
  const wordsArr = lineText.split(' ');
  let line = '';
  let y = 180;
  for (const word of wordsArr) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), 320, y);
      line = word + ' ';
      y += 20;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line.trim(), 320, y);
  
  // Decorative border
  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(10, 10, 620, 340, 20);
  ctx.stroke();
  
  onComplete(canvas.toDataURL('image/png'));
}

export function VideoGeneration({ 
  storyText, 
  theme, 
  isGenerating, 
  setIsGenerating 
}: VideoGenerationProps) {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slideshowMode, setSlideshowMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sentences = storyText.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()).filter(s => s.length > 10) || [storyText];
  const slidesCount = Math.min(sentences.length, 8);
  const slides = sentences.slice(0, slidesCount);
  const emojis = themeEmojis[theme] || themeEmojis.default;

  useEffect(() => {
    return () => {
      if (slideshowRef.current) clearInterval(slideshowRef.current);
    };
  }, []);

  const handleGenerateVideo = async () => {
    if (!storyText) return;

    setIsGenerating(true);
    setProgress(0);
    setSlideshowMode(false);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Try AI-powered generation first
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: { 
          storyText: storyText.substring(0, 1000),
          theme 
        }
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('Edge function error:', error);
        if (error.message?.includes('429')) {
          toast({
            title: 'Rate Limit',
            description: 'Too many requests. Creating a slideshow version instead.',
            variant: 'destructive',
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: 'Credits Exhausted',
            description: 'Creating a slideshow version of your story.',
            variant: 'destructive',
          });
        }
        // Fallback to client-side slideshow
        generateSlideshowCanvas(slides, theme, (dataUrl) => {
          setVideoUrl(dataUrl);
          setSlideshowMode(true);
          setProgress(100);
          toast({
            title: 'Story Slideshow Created!',
            description: 'Navigate through your story scenes using the controls.',
          });
        });
      } else if (data?.videoUrl) {
        setProgress(100);
        setVideoUrl(data.videoUrl);
        toast({
          title: 'Success!',
          description: 'Your story illustration has been created!',
        });
      } else {
        // No URL returned — fallback
        generateSlideshowCanvas(slides, theme, (dataUrl) => {
          setVideoUrl(dataUrl);
          setSlideshowMode(true);
          setProgress(100);
          toast({
            title: 'Story Slideshow Created!',
            description: 'Navigate through your story scenes using the controls.',
          });
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Fallback to client-side slideshow
      generateSlideshowCanvas(slides, theme, (dataUrl) => {
        setVideoUrl(dataUrl);
        setSlideshowMode(true);
        setProgress(100);
        toast({
          title: 'Story Slideshow Created!',
          description: 'Navigate through your story scenes.',
        });
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (slideshowMode) {
      if (isPlaying) {
        if (slideshowRef.current) clearInterval(slideshowRef.current);
        setIsPlaying(false);
      } else {
        slideshowRef.current = setInterval(() => {
          setCurrentSlide(prev => {
            if (prev >= slides.length - 1) {
              if (slideshowRef.current) clearInterval(slideshowRef.current);
              setIsPlaying(false);
              return prev;
            }
            return prev + 1;
          });
        }, 4000);
        setIsPlaying(true);
      }
      return;
    }
    const video = document.getElementById('story-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoEnded = () => setIsPlaying(false);

  const handleDownload = () => {
    if (videoUrl) {
      const isImage = videoUrl.startsWith('data:image') || /\.(png|jpe?g|gif|webp)$/i.test(videoUrl);
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = isImage ? 'story-scene.png' : 'story-animation.mp4';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!storyText) return null;

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-bold mb-4 text-center text-kids-purple">
        Story Animation
      </h3>
      
      {!videoUrl && !isGenerating && (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-kids-blue/30 rounded-xl p-8 w-full">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-kids-blue/10 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-10 h-10 text-kids-blue" />
            </div>
            <h4 className="text-lg font-semibold text-kids-blue">Create Story Video</h4>
            <p className="text-sm text-gray-500 max-w-sm">
              Transform your story into an animated video with AI narration and visuals
            </p>
          </div>
          
          <Button 
            onClick={handleGenerateVideo}
            className="mt-6 bg-gradient-to-r from-kids-blue to-kids-purple hover:opacity-90 text-white"
          >
            Create Video Animation
          </Button>
        </div>
      )}
      
      {isGenerating && (
        <div className="border-2 border-kids-blue/30 rounded-xl p-8 w-full">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-kids-blue/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Video className="w-10 h-10 text-kids-blue" />
            </div>
            <h4 className="text-lg font-semibold text-kids-blue">Creating Your Video...</h4>
            <div className="w-full max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {progress < 30 && <p>🎭 Analyzing your story...</p>}
              {progress >= 30 && progress < 60 && <p>🎨 Creating visual scenes...</p>}
              {progress >= 60 && progress < 90 && <p>🎵 Adding narration and music...</p>}
              {progress >= 90 && <p>✨ Finalizing your animation...</p>}
            </div>
          </div>
        </div>
      )}
      
      {videoUrl && (
        <div className="w-full relative">
          {slideshowMode ? (
            <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-kids-purple/20">
              {/* Slideshow scene */}
              <div className="relative aspect-video flex flex-col items-center justify-center p-8 min-h-[280px]" style={{
                background: `linear-gradient(135deg, ${
                  ['#E8D5F5', '#D4E8FC', '#FCE4D6', '#D1FAE5', '#FDE8E8', '#FEF3C7'][currentSlide % 6]
                } 0%, ${
                  ['#D4E8FC', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#E8D5F5', '#D4E8FC'][currentSlide % 6]
                } 100%)`
              }}>
                {/* Background emojis - unique per slide */}
                <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
                  {emojis.map((emoji, i) => (
                    <span 
                      key={`${currentSlide}-${i}`} 
                      className="absolute text-5xl transition-all duration-700"
                      style={{ 
                        left: `${((i * 17 + currentSlide * 13) + 5) % 85}%`, 
                        top: `${((i * 23 + currentSlide * 11) + 10) % 80}%`,
                        transform: `rotate(${(i * 30 + currentSlide * 15) % 360}deg)`,
                        opacity: 0.3
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                
                {/* Scene number badge */}
                <div className="absolute top-4 left-4 bg-white/80 rounded-full px-3 py-1 text-sm font-bold text-kids-purple shadow-sm">
                  Scene {currentSlide + 1} / {slides.length}
                </div>
                
                {/* Scene content */}
                <div className="relative z-10 text-center max-w-lg mx-auto transition-opacity duration-500">
                  <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                    {emojis[currentSlide % emojis.length]}
                  </div>
                  <div className="bg-white/85 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">
                      {slides[currentSlide]}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Slideshow progress */}
              <div className="px-4 py-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-kids-purple to-kids-blue h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Controls */}
              <div className="p-4 flex items-center justify-center gap-3">
                <Button 
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  size="sm" variant="outline" 
                  disabled={currentSlide === 0}
                  className="border-kids-purple text-kids-purple"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={togglePlayPause}
                  size="sm"
                  className="bg-gradient-to-r from-kids-purple to-kids-blue text-white"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button 
                  onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  size="sm" variant="outline"
                  disabled={currentSlide >= slides.length - 1}
                  className="border-kids-purple text-kids-purple"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button onClick={handleDownload} size="sm" className="bg-kids-green hover:bg-kids-green/90 text-white ml-2">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button onClick={handleGenerateVideo} size="sm" className="bg-kids-orange hover:bg-kids-orange/90 text-white">
                  Regenerate
                </Button>
              </div>
            </div>
          ) : (videoUrl.startsWith('data:image') || /\.(png|jpe?g|gif|webp)$/i.test(videoUrl)) ? (
            <div className="rounded-xl overflow-hidden shadow-lg bg-black/5 flex flex-col items-center">
              <img 
                src={videoUrl}
                alt="AI-generated story scene image"
                className="w-full h-auto object-contain aspect-video"
                loading="lazy"
                onError={() => { setSlideshowMode(true); }}
              />
              <div className="p-4 flex items-center justify-center gap-2">
                <Button onClick={handleDownload} size="sm" className="bg-kids-green hover:bg-kids-green/90 text-white">
                  <Download className="w-4 h-4 mr-1" />
                  Download Image
                </Button>
                <Button onClick={handleGenerateVideo} size="sm" className="bg-kids-orange hover:bg-kids-orange/90 text-white">
                  Regenerate
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow-lg bg-black">
              <video 
                id="story-video"
                src={videoUrl}
                className="w-full h-auto aspect-video object-contain"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onError={() => { setSlideshowMode(true); }}
                preload="metadata"
                controls
              />
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Your story has been transformed into an animated scene! 
              { (videoUrl.startsWith('data:image') || /\.(png|jpe?g|gif|webp)$/i.test(videoUrl)) ? 'This is a generated image based on your story.' : 'Click play to watch your tale come to life.' }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
