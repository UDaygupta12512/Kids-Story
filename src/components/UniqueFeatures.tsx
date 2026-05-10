import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const remixParts = {
  hero: ["curious fox", "brave librarian", "tiny astronaut", "kind robot", "rainbow dragon", "quiet knight"],
  setting: ["floating market", "crystal forest", "undersea school", "sky train", "moon garden", "tiny village"],
  twist: ["time runs backwards", "every word becomes music", "colors swap places", "stars are missing", "shadows tell secrets", "rain tastes like candy"],
};

const coOpPrompts = [
  "You start the story. The child ends the sentence.",
  "Create a sound for every character.",
  "Add a silly rule: no word can start with A.",
  "Pick a color and hide it in every scene.",
  "Describe the setting using only senses.",
  "Switch roles: child narrates, adult acts it out.",
];

const fallbackStory = "A tiny astronaut found a glowing seed on the moon and planted it in a cup of stardust.";

function randomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatTime(minutes: number) {
  const totalSeconds = Math.max(1, Math.round(minutes * 60));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs}s`;
}

export function UniqueFeatures() {
  const [remix, setRemix] = useState(() => ({
    hero: randomItem(remixParts.hero),
    setting: randomItem(remixParts.setting),
    twist: randomItem(remixParts.twist),
  }));
  const [copied, setCopied] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [promptIndex, setPromptIndex] = useState(0);
  const [wpm, setWpm] = useState(150);
  const [storyText, setStoryText] = useState(fallbackStory);

  const remixText = useMemo(() => {
    return `A ${remix.hero} in a ${remix.setting} where ${remix.twist}.`;
  }, [remix]);

  const wordCount = useMemo(() => {
    return storyText.trim().split(/\s+/).filter(Boolean).length;
  }, [storyText]);

  const readMinutes = useMemo(() => wordCount / wpm, [wordCount, wpm]);

  useEffect(() => {
    const stored = localStorage.getItem("generatedStory");
    if (stored && stored.trim()) {
      setStoryText(stored.trim());
    }
  }, []);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 45;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerRunning]);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setPromptIndex((current) => (current + 1) % coOpPrompts.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [timerRunning]);

  const handleRemix = () => {
    setRemix({
      hero: randomItem(remixParts.hero),
      setting: randomItem(remixParts.setting),
      twist: randomItem(remixParts.twist),
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(remixText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleTimerToggle = () => {
    setTimerRunning((current) => !current);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(45);
    setPromptIndex(0);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-kids-orange to-kids-blue bg-clip-text text-transparent">
          Unique Story Magic
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-2 border-kids-orange/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-kids-orange">Remix Dice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Roll a one-of-a-kind prompt that no other story site has.
              </p>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <p className="font-semibold text-gray-800">{remixText}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-kids-orange hover:bg-kids-orange/90" onClick={handleRemix}>
                  Roll again
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy prompt"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-kids-purple/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-kids-purple">Co-Op Spark Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                A fast 45-second co-creation ritual with rotating prompts.
              </p>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white text-kids-purple border border-purple-200">{timerSeconds}s</Badge>
                  <span className="text-sm text-gray-600">next prompt in 10s</span>
                </div>
                <p className="font-semibold text-gray-800">{coOpPrompts[promptIndex]}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-kids-purple hover:bg-kids-purple/90" onClick={handleTimerToggle}>
                  {timerRunning ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" onClick={handleResetTimer}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-kids-blue/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-kids-blue">Read-Aloud Pace Lab</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Tune a reading pace and get a live time estimate for the last story.
              </p>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{wordCount} words</span>
                  <span>{wpm} wpm</span>
                </div>
                <Slider
                  value={[wpm]}
                  min={110}
                  max={220}
                  step={5}
                  onValueChange={(value) => setWpm(value[0])}
                />
                <div className="text-lg font-semibold text-kids-blue">{formatTime(readMinutes)}</div>
              </div>
              <p className="text-xs text-gray-500">Uses the most recent generated story, or a demo if none yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
