import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackButton } from '@/components/BackButton';
import { CharacterBuilder } from '@/components/CharacterBuilder';
import { StoryLibrary } from '@/components/StoryLibrary';
import { BranchingStory } from '@/components/BranchingStory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, BookOpen, Users, GitBranch, Heart, Globe } from 'lucide-react';
import { RealWorldImpact } from '@/components/RealWorldImpact';
import { StoryUniverse } from '@/components/StoryUniverse';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Creative() {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState("");
  const [currentTheme, setCurrentTheme] = useState("");
  const [branchingTheme, setBranchingTheme] = useState("adventure");

  const handleLoadStory = (text: string, theme: string) => {
    setCurrentStory(text);
    setCurrentTheme(theme);
  };

  const openInGames = () => {
    if (!currentStory) return;
    localStorage.setItem('generatedStory', currentStory);
    if (currentTheme) localStorage.setItem('lastTheme', currentTheme);
    navigate('/games');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-kids-purple/5 via-kids-blue/5 to-kids-green/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-kids-purple via-kids-orange to-kids-blue bg-clip-text text-transparent">
            Creative Studio
          </h1>
          <p className="text-gray-600 text-lg">
            Build characters, save stories, and explore your creativity!
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {currentStory && (
            <div className="mb-6 rounded-2xl border border-kids-blue/20 bg-white/80 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Story Preview</p>
                  <p className="font-semibold text-gray-800 line-clamp-2">{currentStory.substring(0, 180)}...</p>
                  {currentTheme && (
                    <span className="inline-block mt-2 text-xs text-kids-blue bg-kids-blue/10 px-2 py-1 rounded">
                      {currentTheme}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={openInGames} className="bg-kids-blue text-white hover:bg-kids-blue/90">
                    Open in Games
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="characters" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger 
              value="characters"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-kids-purple data-[state=active]:to-kids-blue data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Character Builder
            </TabsTrigger>
            <TabsTrigger 
              value="library"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-kids-green data-[state=active]:to-kids-blue data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Story Library
            </TabsTrigger>
            <TabsTrigger 
              value="branching"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-kids-orange data-[state=active]:to-kids-blue data-[state=active]:text-white"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Interactive Story
            </TabsTrigger>
            <TabsTrigger 
              value="impact"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Impact
            </TabsTrigger>
            <TabsTrigger 
              value="universe"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Universe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="animate-fade-in">
            <CharacterBuilder 
              onCharacterCreated={(char) => {
                console.log("Character created:", char);
              }}
            />
            
            <div className="mt-6 p-6 story-card bg-gradient-to-r from-kids-purple/10 to-kids-blue/10">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-kids-purple flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-kids-purple mb-2">
                    How to Use Your Characters
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✨ Create unique characters with special powers and personalities</li>
                    <li>📝 Use them as inspiration for your next story</li>
                    <li>🎨 Mix and match different traits to make interesting combinations</li>
                    <li>🎲 Try the random generator for surprise characters!</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="animate-fade-in">
            <StoryLibrary 
              currentStory={currentStory}
              currentTheme={currentTheme}
              onLoadStory={handleLoadStory}
            />
            
            <div className="mt-6 p-6 story-card bg-gradient-to-r from-kids-green/10 to-kids-blue/10">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-kids-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-kids-green mb-2">
                    Story Library Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>💾 All stories are saved locally in your browser</li>
                    <li>📖 View and re-read your favorite stories anytime</li>
                    <li>🔄 Load saved stories to continue or remix them</li>
                    <li>🗑️ Delete stories you no longer need</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branching" className="animate-fade-in">
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-kids-purple">Choose Theme:</label>
              <Select value={branchingTheme} onValueChange={setBranchingTheme}>
                <SelectTrigger className="w-52 rounded-lg border-kids-purple/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventure">🦁 Adventure</SelectItem>
                  <SelectItem value="fantasy">✨ Fantasy</SelectItem>
                  <SelectItem value="friendship">💝 Friendship</SelectItem>
                  <SelectItem value="space">🚀 Space</SelectItem>
                  <SelectItem value="animals">🐾 Animals</SelectItem>
                  <SelectItem value="halloween">🎃 Halloween</SelectItem>
                  <SelectItem value="christmas">🎄 Christmas</SelectItem>
                  <SelectItem value="underwater">🌊 Underwater</SelectItem>
                  <SelectItem value="puzzle">🧩 Secret Puzzle</SelectItem>
                  <SelectItem value="mission">⚔️ Interactive Mission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <BranchingStory key={branchingTheme} theme={branchingTheme} />
            
            <div className="mt-6 p-6 story-card bg-gradient-to-r from-kids-orange/10 to-kids-blue/10">
              <div className="flex items-start gap-3">
                <GitBranch className="w-6 h-6 text-kids-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-kids-orange mb-2">
                    Interactive Story Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>🎯 Every choice you make changes the story path!</li>
                    <li>⭐ Earn points for each decision you make</li>
                    <li>🔄 Try different choices to discover all the endings</li>
                    <li>📚 Each ending teaches a valuable lesson</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="animate-fade-in">
            <RealWorldImpact />
          </TabsContent>

          <TabsContent value="universe" className="animate-fade-in">
            <StoryUniverse />
          </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}