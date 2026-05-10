import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, Trophy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type DifferenceItem = {
  id: number;
  x: number;
  y: number;
  found: boolean;
  hint: string;
};

type Scene = {
  title: string;
  background: string;
  leftItems: { emoji: string; x: number; y: number; size: number }[];
  rightItems: { emoji: string; x: number; y: number; size: number }[];
  differences: DifferenceItem[];
};

const allScenes: Scene[] = [
  {
    title: "Magical Castle",
    background: "from-purple-200 to-blue-200",
    leftItems: [
      { emoji: "🏰", x: 50, y: 40, size: 64 },
      { emoji: "🌟", x: 15, y: 12, size: 32 },
      { emoji: "✨", x: 80, y: 15, size: 28 },
      { emoji: "🦋", x: 12, y: 55, size: 28 },
      { emoji: "🌈", x: 78, y: 65, size: 32 },
      { emoji: "🌸", x: 30, y: 80, size: 28 },
      { emoji: "🐦", x: 70, y: 30, size: 28 },
      { emoji: "☁️", x: 35, y: 10, size: 32 },
      { emoji: "🌻", x: 65, y: 82, size: 28 },
      { emoji: "🎵", x: 88, y: 45, size: 24 },
    ],
    rightItems: [
      { emoji: "🏰", x: 50, y: 40, size: 64 },
      { emoji: "⭐", x: 15, y: 12, size: 32 },  // diff 1: 🌟→⭐
      { emoji: "✨", x: 80, y: 15, size: 28 },
      { emoji: "🐛", x: 12, y: 55, size: 28 },  // diff 2: 🦋→🐛
      { emoji: "🌈", x: 78, y: 65, size: 32 },
      { emoji: "🌺", x: 30, y: 80, size: 28 },  // diff 3: 🌸→🌺
      { emoji: "🐦", x: 70, y: 30, size: 28 },
      { emoji: "☁️", x: 35, y: 10, size: 32 },
      { emoji: "🌻", x: 65, y: 82, size: 28 },
      { emoji: "🎶", x: 88, y: 45, size: 24 },  // diff 4: 🎵→🎶
    ],
    differences: [
      { id: 1, x: 15, y: 12, found: false, hint: "Look at the stars..." },
      { id: 2, x: 12, y: 55, found: false, hint: "Something flying changed..." },
      { id: 3, x: 30, y: 80, found: false, hint: "Check the flowers..." },
      { id: 4, x: 88, y: 45, found: false, hint: "Listen to the music..." },
    ],
  },
  {
    title: "Ocean Adventure",
    background: "from-cyan-200 to-blue-300",
    leftItems: [
      { emoji: "🐠", x: 25, y: 30, size: 36 },
      { emoji: "🐙", x: 70, y: 50, size: 40 },
      { emoji: "🐚", x: 15, y: 75, size: 28 },
      { emoji: "🦀", x: 80, y: 80, size: 32 },
      { emoji: "🌊", x: 50, y: 10, size: 36 },
      { emoji: "⚓", x: 45, y: 70, size: 32 },
      { emoji: "🐡", x: 60, y: 25, size: 28 },
      { emoji: "🦈", x: 35, y: 50, size: 36 },
      { emoji: "💎", x: 85, y: 20, size: 24 },
      { emoji: "🐢", x: 20, y: 45, size: 32 },
    ],
    rightItems: [
      { emoji: "🐟", x: 25, y: 30, size: 36 },  // diff 1: 🐠→🐟
      { emoji: "🐙", x: 70, y: 50, size: 40 },
      { emoji: "🐚", x: 15, y: 75, size: 28 },
      { emoji: "🦞", x: 80, y: 80, size: 32 },  // diff 2: 🦀→🦞
      { emoji: "🌊", x: 50, y: 10, size: 36 },
      { emoji: "⚓", x: 45, y: 70, size: 32 },
      { emoji: "🐡", x: 60, y: 25, size: 28 },
      { emoji: "🦈", x: 35, y: 50, size: 36 },
      { emoji: "💎", x: 85, y: 20, size: 24 },
      { emoji: "🐸", x: 20, y: 45, size: 32 },  // diff 3: 🐢→🐸
    ],
    differences: [
      { id: 1, x: 25, y: 30, found: false, hint: "One fish looks different..." },
      { id: 2, x: 80, y: 80, found: false, hint: "Check the crustaceans..." },
      { id: 3, x: 20, y: 45, found: false, hint: "Something changed near the left..." },
    ],
  },
  {
    title: "Farm Fun",
    background: "from-green-200 to-yellow-200",
    leftItems: [
      { emoji: "🐄", x: 20, y: 55, size: 40 },
      { emoji: "🐔", x: 70, y: 65, size: 32 },
      { emoji: "🌻", x: 85, y: 20, size: 36 },
      { emoji: "🏠", x: 45, y: 25, size: 48 },
      { emoji: "🌾", x: 15, y: 80, size: 28 },
      { emoji: "🐷", x: 60, y: 45, size: 32 },
      { emoji: "☀️", x: 50, y: 8, size: 36 },
      { emoji: "🐑", x: 30, y: 70, size: 32 },
      { emoji: "🌳", x: 10, y: 30, size: 40 },
      { emoji: "🐴", x: 80, y: 45, size: 36 },
    ],
    rightItems: [
      { emoji: "🐄", x: 20, y: 55, size: 40 },
      { emoji: "🐤", x: 70, y: 65, size: 32 },  // diff 1: 🐔→🐤
      { emoji: "🌻", x: 85, y: 20, size: 36 },
      { emoji: "🏠", x: 45, y: 25, size: 48 },
      { emoji: "🌾", x: 15, y: 80, size: 28 },
      { emoji: "🐷", x: 60, y: 45, size: 32 },
      { emoji: "🌙", x: 50, y: 8, size: 36 },   // diff 2: ☀️→🌙
      { emoji: "🐑", x: 30, y: 70, size: 32 },
      { emoji: "🌲", x: 10, y: 30, size: 40 },  // diff 3: 🌳→🌲
      { emoji: "🦄", x: 80, y: 45, size: 36 },  // diff 4: 🐴→🦄
    ],
    differences: [
      { id: 1, x: 70, y: 65, found: false, hint: "Look at the birds..." },
      { id: 2, x: 50, y: 8, found: false, hint: "What's in the sky?" },
      { id: 3, x: 10, y: 30, found: false, hint: "Check the trees..." },
      { id: 4, x: 80, y: 45, found: false, hint: "A magical animal appeared!" },
    ],
  },
  {
    title: "Space Explorer",
    background: "from-indigo-300 to-purple-400",
    leftItems: [
      { emoji: "🚀", x: 50, y: 35, size: 48 },
      { emoji: "🌍", x: 20, y: 60, size: 40 },
      { emoji: "⭐", x: 80, y: 15, size: 28 },
      { emoji: "🌙", x: 75, y: 55, size: 36 },
      { emoji: "👨‍🚀", x: 35, y: 20, size: 32 },
      { emoji: "🛸", x: 15, y: 30, size: 32 },
      { emoji: "☄️", x: 65, y: 75, size: 28 },
      { emoji: "🪐", x: 85, y: 40, size: 36 },
      { emoji: "🌌", x: 40, y: 80, size: 28 },
      { emoji: "💫", x: 55, y: 10, size: 24 },
    ],
    rightItems: [
      { emoji: "🚀", x: 50, y: 35, size: 48 },
      { emoji: "🌎", x: 20, y: 60, size: 40 },  // diff 1: 🌍→🌎
      { emoji: "⭐", x: 80, y: 15, size: 28 },
      { emoji: "🌙", x: 75, y: 55, size: 36 },
      { emoji: "👩‍🚀", x: 35, y: 20, size: 32 },  // diff 2: 👨‍🚀→👩‍🚀
      { emoji: "🛸", x: 15, y: 30, size: 32 },
      { emoji: "☄️", x: 65, y: 75, size: 28 },
      { emoji: "🪐", x: 85, y: 40, size: 36 },
      { emoji: "🌌", x: 40, y: 80, size: 28 },
      { emoji: "🌟", x: 55, y: 10, size: 24 },  // diff 3: 💫→🌟
    ],
    differences: [
      { id: 1, x: 20, y: 60, found: false, hint: "Look at our planet..." },
      { id: 2, x: 35, y: 20, found: false, hint: "Who's the astronaut?" },
      { id: 3, x: 55, y: 10, found: false, hint: "The sparkle changed..." },
    ],
  },
];

export function SpotDifference() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  const [clicks, setClicks] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentScene = allScenes[sceneIndex];
  const differences = currentScene.differences;

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gameWon) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClicks(prev => prev + 1);

    const foundDiff = differences.find(
      diff =>
        !foundDifferences.includes(diff.id) &&
        Math.abs(diff.x - x) < 12 &&
        Math.abs(diff.y - y) < 12
    );

    if (foundDiff) {
      const newFound = [...foundDifferences, foundDiff.id];
      setFoundDifferences(newFound);
      toast.success(`✨ Found ${newFound.length}/${differences.length}!`);
      setShowHint(false);

      if (newFound.length === differences.length) {
        setGameWon(true);
        toast.success(`🎉 You found all differences in ${clicks + 1} clicks!`);
      }
    }
  }, [gameWon, differences, foundDifferences, clicks]);

  const resetGame = () => {
    setFoundDifferences([]);
    setClicks(0);
    setGameWon(false);
    setShowHint(false);
    toast.info("New game started!");
  };

  const nextScene = () => {
    setSceneIndex((prev) => (prev + 1) % allScenes.length);
    setFoundDifferences([]);
    setClicks(0);
    setGameWon(false);
    setShowHint(false);
    toast.info("New scene loaded!");
  };

  const getHint = () => {
    const unfound = differences.find(d => !foundDifferences.includes(d.id));
    if (unfound) {
      setShowHint(true);
      toast.info(`💡 Hint: ${unfound.hint}`);
    }
  };

  const renderImage = (items: { emoji: string; x: number; y: number; size: number }[]) => (
    <div
      onClick={handleClick}
      className={`
        relative w-full aspect-square rounded-lg cursor-crosshair
        bg-gradient-to-br ${currentScene.background}
        border-4 border-kids-purple/30 hover:border-kids-purple/50 transition-all
        overflow-hidden select-none
      `}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            lineHeight: 1,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {differences.map(diff => (
        foundDifferences.includes(diff.id) && (
          <div
            key={diff.id}
            className="absolute w-12 h-12 border-4 border-kids-green rounded-full animate-pulse"
            style={{
              left: `${diff.x}%`,
              top: `${diff.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CheckCircle className="w-full h-full text-kids-green fill-white" />
          </div>
        )
      ))}
    </div>
  );

  return (
    <div className="story-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h3 className="text-2xl font-bold text-kids-purple flex items-center gap-2">
          <Eye className="w-7 h-7" />
          Spot the Difference — {currentScene.title}
        </h3>
        <div className="flex gap-3 flex-wrap">
          <div className="px-4 py-2 bg-kids-green/20 rounded-lg">
            <span className="font-bold text-kids-green">
              Found: {foundDifferences.length}/{differences.length}
            </span>
          </div>
          <div className="px-4 py-2 bg-kids-blue/20 rounded-lg">
            <span className="font-bold text-kids-blue">Clicks: {clicks}</span>
          </div>
          <Button
            onClick={getHint}
            variant="outline"
            size="sm"
            disabled={gameWon || foundDifferences.length === differences.length}
            className="border-kids-orange text-kids-orange hover:bg-kids-orange/10"
          >
            💡 Hint
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            size="sm"
            className="border-kids-purple text-kids-purple hover:bg-kids-purple/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button
            onClick={nextScene}
            variant="outline"
            size="sm"
            className="border-kids-blue text-kids-blue hover:bg-kids-blue/10"
          >
            Next Scene →
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-center text-gray-600">
          Find {differences.length} differences between these two pictures! Click on the spots where you see differences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-center font-semibold text-kids-purple mb-2">Picture 1</p>
          {renderImage(currentScene.leftItems)}
        </div>
        <div>
          <p className="text-center font-semibold text-kids-blue mb-2">Picture 2</p>
          {renderImage(currentScene.rightItems)}
        </div>
      </div>

      {gameWon && (
        <div className="p-6 bg-gradient-to-r from-kids-yellow/20 to-kids-orange/20 rounded-lg border-2 border-kids-yellow text-center space-y-3">
          <Trophy className="w-16 h-16 mx-auto text-kids-yellow" />
          <div>
            <p className="text-2xl font-bold text-kids-purple mb-2">
              🎉 Amazing Detective Work!
            </p>
            <p className="text-gray-700">
              You found all {differences.length} differences in just {clicks} clicks!
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {clicks <= differences.length + 3 
                ? "⭐⭐⭐ Perfect score!" 
                : clicks <= differences.length + 8 
                ? "⭐⭐ Great job!" 
                : "⭐ Keep practicing!"}
            </p>
            <Button onClick={nextScene} className="mt-4 bg-gradient-to-r from-kids-purple to-kids-blue text-white">
              Try Next Scene →
            </Button>
          </div>
        </div>
      )}

      {showHint && !gameWon && (
        <div className="mt-4 p-4 bg-kids-orange/10 rounded-lg border border-kids-orange/30">
          <p className="text-sm text-gray-700 text-center">
            💡 <strong>Hint:</strong> {differences.find(d => !foundDifferences.includes(d.id))?.hint}
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-kids-blue/10 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          💡 Look carefully at the emojis in both pictures — some have been swapped with similar-looking ones!
          <br />
          <span className="text-xs">Scene {sceneIndex + 1} of {allScenes.length}</span>
        </p>
      </div>
    </div>
  );
}
