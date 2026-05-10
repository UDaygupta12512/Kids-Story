import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudLightning, Flame, Star, Award, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const topics = [
  {
    badge: "🌤️ Weather",
    description: "Try looking up these words today!",
    words: ["tornado", "blizzard", "drizzle", "thunder", "breeze"]
  },
  {
    badge: "🪐 Space",
    description: "Explore the sky with these big words!",
    words: ["orbit", "meteor", "nebula", "crater", "comet"]
  },
  {
    badge: "🌿 Nature",
    description: "Notice the world outside with new vocabulary.",
    words: ["meadow", "canopy", "stream", "pebble", "sprout"]
  },
  {
    badge: "🎵 Music",
    description: "Listen closely and learn these rhythm words.",
    words: ["tempo", "melody", "chorus", "harmony", "beat"]
  },
  {
    badge: "🧠 Feelings",
    description: "Name emotions and grow empathy.",
    words: ["proud", "brave", "curious", "grateful", "calm"]
  },
  {
    badge: "🧪 Science",
    description: "Try some discovery words today.",
    words: ["observe", "hypothesis", "mixture", "gravity", "energy"]
  }
];

const streakTilePresets = [
  {
    emoji: "🔥",
    label: "Streak",
    value: () => `${randomInt(3, 15)} Days`,
    sub: ["Consistent", "On Fire", "Focused"],
    tileClass: "bg-yellow-100",
    valueClass: "text-yellow-700",
    subClass: "text-yellow-600"
  },
  {
    emoji: "📚",
    label: "Reading",
    value: () => `+${randomInt(1, 3)} Level`,
    sub: ["Level Up", "New Skill", "Glow Up"],
    tileClass: "bg-blue-100",
    valueClass: "text-blue-700",
    subClass: "text-blue-600"
  },
  {
    emoji: "✨",
    label: "Topics",
    value: () => `${randomInt(1, 6)} Explored`,
    sub: ["New", "Curious", "Brave"],
    tileClass: "bg-purple-100",
    valueClass: "text-purple-700",
    subClass: "text-purple-600"
  }
];

const skills = ["Logic", "Vocab", "Empathy", "Creativity", "Memory", "Focus", "Curiosity", "Rhythm"];
const bonusLabels = ["Star Sprint", "Word Hunt", "Plot Twist", "Hero Quest", "Rhyme Time", "Color Burst"];
const challengeGoals = [60, 80, 95, 120, 150];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(items: T[]) {
  return items[randomInt(0, items.length - 1)];
}

function pickMany<T>(items: T[], count: number) {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function buildStreakTiles() {
  return streakTilePresets.map((tile) => ({
    ...tile,
    valueText: tile.value(),
    subText: pickOne(tile.sub)
  }));
}

function buildChallenge() {
  const goal = pickOne(challengeGoals);
  const progress = randomInt(0, goal);
  return {
    goal,
    progress,
    label: pickOne(bonusLabels)
  };
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

export function DashboardSummary() {
  const [topicIndex, setTopicIndex] = useState(0);
  const [streakTiles, setStreakTiles] = useState(() => buildStreakTiles());
  const [skillsImproved, setSkillsImproved] = useState(() => pickMany(skills, 2));
  const [challenge, setChallenge] = useState(() => buildChallenge());
  const [resetSeconds, setResetSeconds] = useState(() => randomInt(2 * 3600, 9 * 3600));

  const topic = useMemo(() => topics[topicIndex % topics.length], [topicIndex]);
  const challengePercent = Math.round((challenge.progress / challenge.goal) * 100);

  useEffect(() => {
    const rotate = () => {
      setTopicIndex((current) => (current + 1) % topics.length);
      setStreakTiles(buildStreakTiles());
      setSkillsImproved(pickMany(skills, 2));
      setChallenge(buildChallenge());
    };

    rotate();
    const intervalId = setInterval(rotate, 2500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setResetSeconds((current) => (current <= 1 ? randomInt(2 * 3600, 9 * 3600) : current - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Progress Summary / Recent Badges */}
        <Card className="border-2 border-kids-orange/20 bg-gradient-to-b from-orange-50 to-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-kids-orange">
              <Award className="w-6 h-6" />
              <h3 className="text-xl font-bold">Meaningful Streak</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              {streakTiles.map((tile) => (
                <div key={tile.label} className={`${tile.tileClass} p-2 rounded-xl flex flex-col items-center justify-center`}>
                  <span className="text-2xl">{tile.emoji}</span>
                  <span className={`text-xs font-bold mt-1 ${tile.valueClass}`}>{tile.valueText}</span>
                  <span className={`text-[10px] leading-tight ${tile.subClass}`}>{tile.subText}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg border">
              <span>Skills Improved</span>
              <span className="text-kids-orange font-bold">{skillsImproved.join(", ")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Topic of the Day */}
        <Card className="border-2 border-kids-blue/20 bg-gradient-to-b from-blue-50 to-white shadow-md md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-kids-blue">
                <CloudLightning className="w-6 h-6" />
                <h3 className="text-xl font-bold">Topic of the Day</h3>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-none">
                {topic.badge}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {topic.words.map((word) => (
                <Badge key={word} className="bg-white border-2 border-kids-blue/30 text-gray-700 hover:bg-blue-50 px-3 py-1 text-sm font-medium">
                  {word}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-kids-blue hover:text-blue-700 hover:bg-blue-50 flex justify-between items-center">
              Look Up Words <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Daily Challenges */}
        <Card className="border-2 border-kids-purple/20 bg-gradient-to-b from-purple-50 to-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-kids-purple">
              <Flame className="w-6 h-6" />
              <h3 className="text-xl font-bold">Daily Challenges</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-purple-100/50 p-2 rounded-lg w-fit">
              <Clock className="w-4 h-4" /> Resets in {formatTime(resetSeconds)}
            </div>
            
            <div className="space-y-4 text-center">
              <h4 className="font-bold text-gray-700">Today's Bonus: {challenge.label}</h4>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-extrabold text-kids-purple">{challenge.progress}/{challenge.goal}</span>
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-kids-purple h-2.5 rounded-full" style={{ width: `${challengePercent}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
