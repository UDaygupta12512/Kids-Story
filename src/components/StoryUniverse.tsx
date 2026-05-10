import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Users, History, Sparkles, PlusCircle } from 'lucide-react';

interface UniverseStore {
  characters: string[];
  pastChoices: string[];
  worldState: string;
}

const DEFAULT_STORE: UniverseStore = {
  characters: ["Leo the Lion"],
  pastChoices: ["saved village"],
  worldState: "peaceful"
};

export function StoryUniverse() {
  const [store, setStore] = useState<UniverseStore>(DEFAULT_STORE);
  const [generatedPlot, setGeneratedPlot] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('storyMemoryUniverse');
    const savedChars = localStorage.getItem('savedCharacters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UniverseStore;
        let merged = parsed;
        if (savedChars) {
          try {
            const characters = (JSON.parse(savedChars) as { name: string }[]).map((c) => c.name);
            merged = {
              ...parsed,
              characters: Array.from(new Set([...(parsed.characters || []), ...characters]))
            };
          } catch {
            merged = parsed;
          }
        }
        setStore(merged);
      } catch (e) {
        console.error("Failed to parse store");
      }
    } else if (savedChars) {
      try {
        const characters = (JSON.parse(savedChars) as { name: string }[]).map((c) => c.name);
        setStore({ ...DEFAULT_STORE, characters: Array.from(new Set([...DEFAULT_STORE.characters, ...characters])) });
      } catch {
        setStore(DEFAULT_STORE);
      }
    }
  }, []);

  const saveStore = (newStore: UniverseStore) => {
    setStore(newStore);
    localStorage.setItem('storyMemoryUniverse', JSON.stringify(newStore));
  };

  const addCharacter = () => {
    const chars = ["Mia the Mouse", "Toby the Turtle", "Captain Crunch", "Wizard Finn"];
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    if (!store.characters.includes(randomChar)) {
      saveStore({ ...store, characters: [...store.characters, randomChar] });
    }
  };

  const generateNextChapter = () => {
    const chars = store.characters.join(" and ");
    const choices = store.pastChoices.join(" and ");
    const story = `Because you previously ${choices}, the world is currently ${store.worldState}. Now, ${chars} are embarking on a new quest in this connected universe!`;
    setGeneratedPlot(story);
  };

  const resetUniverse = () => {
    saveStore(DEFAULT_STORE);
    setGeneratedPlot(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-kids-blue/20 bg-white/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-kids-blue">
              <Globe className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Story Memory Universe</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUniverse} className="text-gray-500 hover:text-red-500">
              Reset Universe
            </Button>
          </div>
          
          <p className="text-gray-600 mb-8">
            Every story is connected in one continuous universe. Characters from past stories reappear, and your past choices affect future plots!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-xl border-2 border-kids-purple/20 shadow-sm">
              <div className="flex items-center gap-2 text-kids-purple mb-4">
                <Users className="w-5 h-5" />
                <h3 className="font-bold">Characters Met</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {store.characters.map((char, i) => (
                  <li key={i} className="bg-kids-purple/10 px-3 py-1.5 rounded-lg text-sm font-medium text-kids-purple">
                    {char}
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="outline" onClick={addCharacter} className="w-full gap-2 border-kids-purple text-kids-purple hover:bg-kids-purple/10">
                <PlusCircle className="w-4 h-4" /> Discover New
              </Button>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-kids-green/20 shadow-sm">
              <div className="flex items-center gap-2 text-kids-green mb-4">
                <History className="w-5 h-5" />
                <h3 className="font-bold">Past Choices</h3>
              </div>
              <ul className="space-y-2">
                {store.pastChoices.map((choice, i) => (
                  <li key={i} className="bg-kids-green/10 px-3 py-1.5 rounded-lg text-sm font-medium text-kids-green flex items-start gap-2">
                    <span className="mt-0.5">•</span> {choice}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-kids-orange/20 shadow-sm">
              <div className="flex items-center gap-2 text-kids-orange mb-4">
                <Globe className="w-5 h-5" />
                <h3 className="font-bold">World State</h3>
              </div>
              <div className="text-center p-6 bg-kids-orange/10 rounded-lg">
                <span className="text-2xl font-bold text-kids-orange capitalize">
                  {store.worldState}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={generateNextChapter}
              className="bg-gradient-to-r from-kids-blue to-kids-green text-white py-6 px-8 rounded-xl text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-6 h-6" /> Generate Connected Plot
            </Button>
          </div>

          {generatedPlot && (
            <div className="mt-8 p-6 bg-gradient-to-r from-kids-blue/10 to-kids-green/10 rounded-xl border border-kids-blue/20 animate-fade-in">
              <h4 className="font-bold text-xl text-kids-blue mb-3">Next Chapter in the Universe:</h4>
              <p className="text-lg text-gray-800 leading-relaxed italic border-l-4 border-kids-blue pl-4">
                "{generatedPlot}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
