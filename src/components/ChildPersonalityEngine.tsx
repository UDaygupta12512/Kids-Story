import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Heart, ShieldAlert, BookOpen, Save } from 'lucide-react';
import { toast } from "sonner";
import { useTheme } from "next-themes";

type ProgressState = {
  completionPercent: number;
  streak: number;
  totalXp: number;
  level: number;
  lesson: number;
  recentAchievements: string[];
};

const progressDefaults: ProgressState = {
  completionPercent: 0,
  streak: 1,
  totalXp: 110,
  level: 1,
  lesson: 0,
  recentAchievements: ["🌟", "🏆", "🔥", "📚", "🎯"],
};

export function ChildPersonalityEngine() {
  const { theme, setTheme } = useTheme();
  const [likes, setLikes] = useState("");
  const [fears, setFears] = useState("");
  const [readingLevel, setReadingLevel] = useState("intermediate");
  const [progress, setProgress] = useState<ProgressState>(progressDefaults);

  useEffect(() => {
    const saved = localStorage.getItem('childPersonality');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLikes(parsed.likes || "");
      setFears(parsed.fears || "");
      setReadingLevel(parsed.readingLevel || "intermediate");
    }
    const progressSaved = localStorage.getItem('kidProgress');
    if (progressSaved) {
      try {
        setProgress({ ...progressDefaults, ...JSON.parse(progressSaved) });
      } catch {
        setProgress(progressDefaults);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('childPersonality', JSON.stringify({ likes, fears, readingLevel }));
    toast.success("Personality profile updated! All future stories will adapt to these settings.");
  };

  return (
    <Card className="border-2 border-kids-blue/20 shadow-lg mb-8">
      <CardHeader className="bg-gradient-to-r from-kids-blue/10 to-kids-purple/10 border-b border-kids-blue/20">
        <CardTitle className="flex items-center gap-2 text-2xl text-kids-blue">
          <Settings className="w-6 h-6" /> Child Personality Engine
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm mt-2">
          Instead of random stories, the system learns about your child. Adjust the settings below to dynamically adapt tone, themes, and reading difficulty for every generated story!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-kids-green font-bold text-base"><Heart className="w-5 h-5 text-kids-green" /> Interests & Likes</Label>
          <Input 
            placeholder="e.g. dinosaurs, space, superheroes..." 
            value={likes} 
            onChange={(e) => setLikes(e.target.value)} 
            className="border-2 border-kids-green/40 focus-visible:ring-kids-green text-lg rounded-xl"
          />
          <p className="text-sm text-gray-500">Every story will subtly include elements from these topics.</p>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-kids-orange font-bold text-base"><ShieldAlert className="w-5 h-5 text-kids-orange" /> Fears & Triggers (To Avoid)</Label>
          <Input 
            placeholder="e.g. dark, monsters, loud noises..." 
            value={fears} 
            onChange={(e) => setFears(e.target.value)} 
            className="border-2 border-kids-orange/40 focus-visible:ring-kids-orange text-lg rounded-xl"
          />
          <p className="text-sm text-gray-500">The story engine will actively avoid generating these themes.</p>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-kids-purple font-bold text-base"><BookOpen className="w-5 h-5 text-kids-purple" /> Reading Level</Label>
          <Select value={readingLevel} onValueChange={setReadingLevel}>
            <SelectTrigger className="border-2 border-kids-purple/40 focus-visible:ring-kids-purple text-lg rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (Simple words, short sentences)</SelectItem>
              <SelectItem value="intermediate">Intermediate (Standard sentences)</SelectItem>
              <SelectItem value="advanced">Advanced (Complex vocabulary and structure)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full bg-kids-blue hover:bg-kids-blue/90 text-white flex items-center gap-2 mt-4 text-lg py-6 rounded-xl">
          <Save className="w-5 h-5" /> Update Learning Profile
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div className="rounded-2xl border border-kids-purple/20 bg-purple-50/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-kids-purple">Recent Achievements</h3>
              <Button variant="ghost" size="sm" className="text-kids-purple">See All</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.recentAchievements.map((achievement, index) => (
                <Badge key={`${achievement}-${index}`} className="bg-white text-kids-purple border border-kids-purple/20">
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-kids-blue/20 bg-blue-50/60 p-5 space-y-4">
            <h3 className="text-lg font-bold text-kids-blue">Your Progress</h3>
            <p className="text-sm text-gray-600">Keep up the great work!</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-blue">{progress.completionPercent}%</div>
                <div className="text-xs text-gray-500">Completion</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-purple">{progress.streak}</div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-orange">{progress.totalXp}</div>
                <div className="text-xs text-gray-500">Total XP</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-green">{progress.level}</div>
                <div className="text-xs text-gray-500">Level</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center col-span-2">
                <div className="text-2xl font-bold text-kids-purple">{progress.lesson}</div>
                <div className="text-xs text-gray-500">Lesson</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-kids-orange/20 bg-orange-50/60 p-5 space-y-4 lg:col-span-2">
            <h3 className="text-lg font-bold text-kids-orange">Weekly Report</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-orange">0</div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-blue">0%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-purple">1</div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-green">0</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">No activity this week yet — start learning!</p>
          </div>

          <div className="rounded-2xl border border-kids-green/20 bg-green-50/60 p-5 space-y-4">
            <h3 className="text-lg font-bold text-kids-green">Student Report</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Reading focus: steady growth in comprehension.</p>
              <p>Creative writing: strong imagination and detail use.</p>
              <p>Next goal: practice short summaries after stories.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-kids-blue/20 bg-blue-50/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-kids-blue">Topic of the Day</h3>
              <Badge className="bg-white text-kids-blue border border-kids-blue/20">📚 School</Badge>
            </div>
            <p className="text-sm text-gray-600">Try looking up these words today!</p>
            <div className="flex flex-wrap gap-2">
              {["experiment", "library", "recess", "homework", "quiz"].map((word) => (
                <Badge key={word} className="bg-white text-kids-blue border border-kids-blue/20">
                  {word}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-kids-purple/20 bg-purple-50/60 p-5 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-kids-purple">Student Analytics</h3>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-purple">{progress.totalXp}</div>
                <div className="text-xs text-gray-500">XP Earned</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-blue">{progress.lesson}</div>
                <div className="text-xs text-gray-500">Lessons</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-green">{progress.streak}</div>
                <div className="text-xs text-gray-500">Best Streak</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-2xl font-bold text-kids-orange">{progress.completionPercent}%</div>
                <div className="text-xs text-gray-500">Goal Progress</div>
              </div>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div className="bg-kids-purple h-3" style={{ width: `${progress.completionPercent}%` }} />
            </div>
          </div>

          <div className="rounded-2xl border border-kids-blue/20 bg-blue-50/60 p-5 space-y-4">
            <h3 className="text-lg font-bold text-kids-blue">Theme</h3>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex-1"
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex-1"
              >
                Dark
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
