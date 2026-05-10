import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { toast } from 'sonner';

type StoryNarratorProps = {
  storyText: string;
};

type VoicePreset = {
  value: string;
  label: string;
  pitch: number;
  rate: number;
  voiceKeywords: string[];
};

const VOICE_PRESETS: VoicePreset[] = [
  { value: "default", label: "🎭 Friendly Narrator", pitch: 1.0, rate: 0.95, voiceKeywords: ["female", "zira", "samantha", "google us english", "hazel"] },
  { value: "child", label: "👧 Kid Voice", pitch: 1.5, rate: 1.05, voiceKeywords: ["female", "zira", "samantha", "karen"] },
  { value: "storyteller", label: "📖 Storyteller", pitch: 0.85, rate: 0.8, voiceKeywords: ["male", "david", "daniel", "google uk english male", "james"] },
  { value: "excited", label: "🎉 Excited", pitch: 1.3, rate: 1.15, voiceKeywords: ["female", "zira", "samantha", "google us english"] },
  { value: "wizard", label: "🧙 Wizard", pitch: 0.6, rate: 0.75, voiceKeywords: ["male", "david", "daniel", "james"] },
  { value: "robot", label: "🤖 Robot", pitch: 0.3, rate: 1.0, voiceKeywords: ["male", "david", "google uk english male"] },
];

function findBestVoice(keywords: string[]): SpeechSynthesisVoice | null {
  const allVoices = window.speechSynthesis.getVoices();
  const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
  if (englishVoices.length === 0) return allVoices[0] || null;

  for (const keyword of keywords) {
    const match = englishVoices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()));
    if (match) return match;
  }
  return englishVoices[0];
}

export function StoryNarrator({ storyText }: StoryNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("default");
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(-1);

  const sentences = useMemo(
    () => storyText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0),
    [storyText]
  );

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoicesLoaded(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Stop narration when voice preset or speed changes
  useEffect(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setUtterance(null);
      setCurrentSentence(-1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice, speedMultiplier]);

  const speakFromSentence = useCallback((startIdx: number) => {
    if (!('speechSynthesis' in window)) {
      toast.error("Speech synthesis not supported in your browser");
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = sentences.slice(startIdx).join(' ');
    if (!textToSpeak.trim()) return;

    const newUtterance = new SpeechSynthesisUtterance(textToSpeak);
    const preset = VOICE_PRESETS.find(v => v.value === selectedVoice) || VOICE_PRESETS[0];

    const bestVoice = findBestVoice(preset.voiceKeywords);
    if (bestVoice) newUtterance.voice = bestVoice;

    newUtterance.pitch = preset.pitch;
    newUtterance.rate = preset.rate * speedMultiplier;

    let sentenceIdx = startIdx;
    newUtterance.onboundary = (event) => {
      if (event.name === 'sentence') {
        setCurrentSentence(sentenceIdx);
        sentenceIdx++;
      }
    };

    newUtterance.onend = () => {
      setIsPlaying(false);
      setCurrentSentence(-1);
      setUtterance(null);
      toast.success("Story narration completed! 🎉");
    };

    newUtterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        setIsPlaying(false);
        setCurrentSentence(-1);
        toast.error("Error playing narration");
      }
    };

    setCurrentSentence(startIdx);
    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
    setIsPlaying(true);
  }, [sentences, selectedVoice, speedMultiplier]);

  const handleSpeak = () => {
    if (isPlaying && utterance) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (utterance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    speakFromSentence(0);
    toast.success("Starting narration...");
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setUtterance(null);
    setCurrentSentence(-1);
  };

  const handleSkipBack = () => {
    const target = Math.max(0, currentSentence - 2);
    speakFromSentence(target);
  };

  const handleSkipForward = () => {
    const target = Math.min(sentences.length - 1, currentSentence + 2);
    speakFromSentence(target);
  };

  const speedLabel = speedMultiplier === 1 ? "Normal" : `${speedMultiplier.toFixed(1)}x`;

  return (
    <div className="story-card p-4">
      <h3 className="text-lg font-bold mb-4 text-kids-purple flex items-center gap-2">
        <Volume2 className="w-5 h-5" />
        Story Narrator
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose Voice</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="rounded-lg border-kids-purple/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_PRESETS.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed: {speedLabel}</label>
          <Slider
            value={[speedMultiplier]}
            onValueChange={([v]) => setSpeedMultiplier(v)}
            min={0.5}
            max={2.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isPlaying && (
            <Button onClick={handleSkipBack} variant="outline" size="icon" className="border-kids-purple/30">
              <SkipBack className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleSpeak}
            className="flex-1 bg-gradient-to-r from-kids-purple to-kids-blue text-white"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {utterance && window.speechSynthesis.paused ? "Resume" : "Play Story"}
              </>
            )}
          </Button>
          {isPlaying && (
            <Button onClick={handleSkipForward} variant="outline" size="icon" className="border-kids-purple/30">
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
          {(isPlaying || utterance) && (
            <Button
              onClick={handleStop}
              variant="outline"
              className="border-kids-orange text-kids-orange hover:bg-kids-orange/10"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Sentence highlight display */}
        {(isPlaying || (utterance && window.speechSynthesis.paused)) && sentences.length > 0 && (
          <div className="mt-3 p-3 bg-white/60 rounded-lg max-h-40 overflow-y-auto text-sm leading-relaxed">
            {sentences.map((sentence, idx) => (
              <span
                key={idx}
                className={
                  idx === currentSentence
                    ? "bg-yellow-200 text-kids-purple font-semibold rounded px-0.5 transition-colors"
                    : idx < currentSentence
                    ? "text-gray-400"
                    : "text-gray-700"
                }
              >
                {sentence}{' '}
              </span>
            ))}
          </div>
        )}

        {!voicesLoaded && (
          <p className="text-xs text-gray-400 text-center">Loading voices...</p>
        )}
      </div>
    </div>
  );
}