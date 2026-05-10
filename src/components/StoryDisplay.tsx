
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { VideoGeneration } from './VideoGeneration';
import { ImageGeneration } from './ImageGeneration';
import { StoryNarrator } from './StoryNarrator';
import { WordExplorer } from './WordExplorer';
import { StoryRemixer } from './StoryRemixer';
import { StoryCertificate } from './StoryCertificate';
import { StoryPDFExport } from './StoryPDFExport';
import { Flashcards } from './Flashcards';
import { Rhymes } from './Rhymes';
import StoryQuizAI from './StoryQuizAI';
import StoryTheater from './StoryTheater';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

type StoryDisplayProps = {
  storyText: string;
  theme: string;
};

export function StoryDisplay({ 
  storyText, 
  theme
}: StoryDisplayProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [remixedStory, setRemixedStory] = useState("");

  // Derived early so all handlers below can reference it without a TDZ error
  const displayStory = remixedStory || storyText;

  const saveToLibrary = () => {
    const stored = localStorage.getItem('savedStories');
    const savedStories = stored ? JSON.parse(stored) : [];
    const newStory = {
      id: Date.now().toString(),
      title: displayStory.substring(0, 50) + '...',
      text: displayStory,
      theme: theme,
      timestamp: Date.now()
    };
    savedStories.push(newStory);
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    localStorage.setItem('generatedStory', displayStory);
    localStorage.setItem('lastTheme', theme);
    toast.success('Story saved to your library!');
  };

  const extractHighlights = (text: string) => {
    const lower = text.toLowerCase();
    const ignoreWords = new Set(["Once", "The", "A", "An", "In", "At", "On", "With", "From"]);
    const characterMatch = text.match(/\b[A-Z][a-z]{2,}\b/g)?.find((word) => !ignoreWords.has(word));
    const settingWords = [
      "forest",
      "castle",
      "garden",
      "kingdom",
      "village",
      "mountain",
      "ocean",
      "cave",
      "island",
      "city",
      "house",
      "school",
      "farm",
      "lake",
      "river",
      "space",
      "ship",
      "planet",
      "beach",
      "desert",
    ];
    const settingMatch = settingWords.find((word) => lower.includes(word));
    const emojiMap: Record<string, string> = {
      dragon: "🐉",
      princess: "👑",
      knight: "🛡️",
      robot: "🤖",
      fox: "🦊",
      rabbit: "🐰",
      dolphin: "🐬",
      owl: "🦉",
      pirate: "🏴‍☠️",
      treasure: "💎",
      magic: "✨",
      star: "⭐",
      moon: "🌙",
      rainbow: "🌈",
      ship: "🚢",
      rocket: "🚀",
      planet: "🪐",
      ocean: "🌊",
      forest: "🌲",
      castle: "🏰",
      mountain: "🏔️",
    };
    const storyEmojis = Object.entries(emojiMap)
      .filter(([keyword]) => lower.includes(keyword))
      .map(([, emoji]) => emoji);

    return {
      character: characterMatch || "Your Hero",
      setting: settingMatch ? settingMatch : "magical place",
      emojis: storyEmojis,
    };
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    // Generate a client-side illustration using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    const themeColors: Record<string, string[]> = {
      adventure: ['#FF6B35', '#FFF275', '#4ECDC4'],
      fantasy: ['#9B5DE5', '#F15BB5', '#00BBF9'],
      mystery: ['#2D3142', '#4F5D75', '#EF8354'],
      friendship: ['#FF70A6', '#FF9770', '#FFD670'],
      animals: ['#06D6A0', '#118AB2', '#FFD166'],
      space: ['#0B132B', '#1C2541', '#5BC0BE'],
      default: ['#9B87F5', '#F97316', '#0EA5E9'],
    };
    const colors = themeColors[theme] || themeColors.default;
    
    // Gradient background
    const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 360);
    grad.addColorStop(0, colors[0] + '40');
    grad.addColorStop(0.5, colors[1] + '30');
    grad.addColorStop(1, colors[2] + '20');
    ctx.fillStyle = '#FEFCE8';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    
    // Theme emojis
    const emojiMap: Record<string, string[]> = {
      adventure: ['🗺️', '⚔️', '🏔️', '🧭', '🦁'],
      fantasy: ['🧙‍♂️', '🦄', '🏰', '✨', '🐉'],
      mystery: ['🔍', '🗝️', '🕵️', '❓', '🌙'],
      friendship: ['🤝', '💕', '👫', '🌈', '🎉'],
      animals: ['🐶', '🐱', '🦋', '🐰', '🦁'],
      space: ['🚀', '🌍', '⭐', '🛸', '🪐'],
      default: ['📖', '🌟', '✨', '🎭', '💫'],
    };
    const highlights = extractHighlights(displayStory);
    const storyEmojis = highlights.emojis.length > 0 ? highlights.emojis : [];
    const emojis = storyEmojis.length > 0 ? storyEmojis.slice(0, 5) : (emojiMap[theme] || emojiMap.default);
    
    ctx.font = '64px serif';
    emojis.forEach((emoji, i) => {
      const x = 60 + (i % 3) * 170;
      const y = 80 + Math.floor(i / 3) * 200;
      ctx.fillText(emoji, x, y);
    });
    
    // Story title
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(30, 200, 452, 140, 16);
    ctx.fill();
    
    ctx.fillStyle = colors[0];
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    const themeLabel = theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'Story';
    ctx.fillText(`📖 ${highlights.character} in a ${highlights.setting}`, 256, 238);
    
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial, sans-serif';
    const excerpt = displayStory.substring(0, 100) + '...';
    const lines = excerpt.match(/.{1,45}/g) || [excerpt];
    lines.slice(0, 4).forEach((line, i) => {
      ctx.fillText(line, 256, 270 + i * 22);
    });
    
    // Border
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 496, 20);
    ctx.stroke();
    
    setTimeout(() => {
      setImageUrl(canvas.toDataURL('image/png'));
      setIsGeneratingImage(false);
      toast.success('Story illustration created!');
    }, 1500);
  };
  
  useEffect(() => {
    // Add a slight delay before animating in the content
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [storyText]);

  // Function to generate story paragraphs with proper spacing
  const formatStory = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.trim()}
      </p>
    ));
  };

  if (!storyText) return null;

  return (
    <div className={cn(
      "story-card w-full max-w-6xl mx-auto mt-8 transition-all duration-700 opacity-0 translate-y-10",
      animateIn && "opacity-100 translate-y-0"
    )}>
      <h2 className="text-2xl font-bold mb-6 text-center text-kids-purple">Your Story</h2>
      
      <Tabs defaultValue="story" className="w-full">
        <TabsList className="grid w-full grid-cols-9 mb-6">
          <TabsTrigger value="story">📖 Story</TabsTrigger>
          <TabsTrigger value="narrate">🎧 Narrate</TabsTrigger>
          <TabsTrigger value="explore">📚 Explore</TabsTrigger>
          <TabsTrigger value="remix">✨ Remix</TabsTrigger>
          <TabsTrigger value="rewards">🏆 Rewards</TabsTrigger>
          <TabsTrigger value="flashcards">🃏 Cards</TabsTrigger>
          <TabsTrigger value="rhymes">🎵 Rhymes</TabsTrigger>
          <TabsTrigger value="quiz">❓ Quiz</TabsTrigger>
          <TabsTrigger value="theater">🎭 Theater</TabsTrigger>
        </TabsList>

        <TabsContent value="story">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="prose max-w-none">
              {formatStory(displayStory)}
              
              <div className="mt-6 flex flex-wrap gap-2">
                <StoryPDFExport 
                  title={`${theme || 'My'} Story`}
                  content={displayStory}
                  theme={theme}
                />
                
                <Button 
                  onClick={() => window.print()} 
                  variant="outline" 
                  className="border-kids-purple text-kids-purple hover:bg-kids-purple/10"
                >
                  Print Story
                </Button>
                
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(displayStory);
                    toast.success('Story copied to clipboard!');
                  }} 
                  variant="outline"
                  className="border-kids-blue text-kids-blue hover:bg-kids-blue/10"
                >
                  Copy Text
                </Button>

                <Button 
                  onClick={saveToLibrary}
                  variant="outline"
                  className="border-kids-green text-kids-green hover:bg-kids-green/10"
                >
                  💾 Save to Library
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-6">
              <ImageGeneration
                imageUrl={imageUrl}
                isGenerating={isGeneratingImage}
                onGenerate={handleGenerateImage}
                theme={theme}
              />
              <VideoGeneration
                storyText={displayStory}
                imageUrl={imageUrl}
                theme={theme}
                isGenerating={isGeneratingVideo}
                setIsGenerating={setIsGeneratingVideo}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="narrate">
          <StoryNarrator storyText={displayStory} />
        </TabsContent>

        <TabsContent value="explore">
          <WordExplorer storyText={displayStory} />
        </TabsContent>

        <TabsContent value="remix">
          <StoryRemixer 
            originalStory={storyText}
            theme={theme}
            onRemixGenerated={setRemixedStory}
          />
          {remixedStory && (
            <div className="mt-6 story-card p-4">
              <h3 className="font-bold text-kids-purple mb-3">Remixed Version:</h3>
              <div className="prose max-w-none">
                {formatStory(remixedStory)}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rewards">
          <StoryCertificate 
            storyTitle={`${theme || 'My Amazing'} Story`}
          />
        </TabsContent>

        <TabsContent value="flashcards">
          <Flashcards storyText={displayStory} />
        </TabsContent>

        <TabsContent value="rhymes">
          <Rhymes />
        </TabsContent>

        <TabsContent value="quiz">
          <StoryQuizAI storyText={displayStory} />
        </TabsContent>

        <TabsContent value="theater">
          <StoryTheater storyText={displayStory} theme={theme} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
