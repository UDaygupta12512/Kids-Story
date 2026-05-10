import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type StoryRemixerProps = {
  originalStory: string;
  theme: string;
  onRemixGenerated: (remixedStory: string) => void;
};

// Smart client-side remix helpers
function extractSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()).filter(Boolean) || [text];
}

function extractCharacterName(text: string): string | null {
  const patterns = [
    /(?:named|called)\s+(\w+)/i,
    /(?:a|an|the)\s+(?:brave|little|young|friendly|kind|clever|wise|curious|magical)\s+\w+\s+(?:named|called)\s+(\w+)/i,
    /(?:Once upon a time[^.]*?)\b([A-Z]\w+)\b/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1] || m[0];
  }
  const caps = text.match(/\b[A-Z][a-z]{2,}\b/g);
  const ignoreWords = new Set(['Once', 'One', 'The', 'This', 'That', 'There', 'They', 'Then', 'When', 'With', 'From', 'After', 'Before', 'Every', 'Some', 'Long', 'Deep', 'But', 'And', 'Her', 'His', 'She', 'Moral']);
  return caps?.find(w => !ignoreWords.has(w)) || null;
}

function remixEnding(story: string): string {
  const sentences = extractSentences(story);
  if (sentences.length < 4) return story;
  const keepCount = Math.max(3, Math.floor(sentences.length * 0.65));
  const kept = sentences.slice(0, keepCount);
  const charName = extractCharacterName(story) || "our hero";
  const endings = [
    `Just when ${charName} thought the adventure was over, a shimmering rainbow bridge appeared in the sky! "There's always more to discover," ${charName} whispered, stepping onto the glowing path that led to a whole new world of wonders.`,
    `But then, ${charName} noticed something surprising — a tiny glowing seed had fallen into their pocket during the adventure! Planting it in the garden, ${charName} watched in amazement as it grew into a magnificent tree that told stories of its own, one for every star in the sky.`,
    `As the sun began to set, ${charName} realized the greatest treasure wasn't the one they had been searching for — it was the friends they had made along the way. Together, they promised to meet again for an even bigger adventure, and deep down, they knew the best was yet to come.`,
    `Suddenly, a cheerful songbird landed on ${charName}'s shoulder and sang a melody that opened a secret door in the old oak tree. Behind it lay a room full of glittering maps, each leading to a different enchanted land. ${charName} smiled — this was only the beginning!`,
  ];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  return kept.join(' ') + ' ' + ending;
}

function remixCharacter(story: string): string {
  const charName = extractCharacterName(story);
  if (!charName) return story;
  const newCharacters = [
    { name: "Sparky", desc: "a clever little robot with a heart of gold" },
    { name: "Luna", desc: "a brave young astronaut exploring the unknown" },
    { name: "Finn", desc: "a cheerful talking fish with big dreams" },
    { name: "Maple", desc: "a wise old owl who loved riddles" },
    { name: "Ziggy", desc: "a mischievous but kind young wizard" },
    { name: "Coral", desc: "a fearless mermaid princess" },
  ];
  const newChar = newCharacters[Math.floor(Math.random() * newCharacters.length)];
  let result = story.split(charName).join(newChar.name);
  const firstMention = result.indexOf(newChar.name);
  if (firstMention >= 0) {
    result = result.slice(0, firstMention) + newChar.name + ", " + newChar.desc + "," + result.slice(firstMention + newChar.name.length);
  }
  return result;
}

function remixSetting(story: string): string {
  const settingSwaps: Record<string, string> = {
    'forest': 'underwater coral city',
    'kingdom': 'floating sky island',
    'castle': 'crystal cave palace',
    'garden': 'enchanted cloud garden',
    'village': 'bustling tree-top village',
    'mountain': 'rainbow volcano',
    'ocean': 'starlit desert oasis',
    'school': 'magical academy of wonders',
    'house': 'cozy mushroom cottage',
    'city': 'ancient dinosaur jungle',
    'land': 'sparkling ice kingdom',
    'world': 'miniature fairy realm',
    'island': 'floating crystal archipelago',
    'lake': 'shimmering moonlight lagoon',
    'river': 'rainbow waterfall canyon',
    'cave': 'glowing underground forest',
    'farm': 'enchanted animal sanctuary',
    'park': 'secret midnight carnival',
  };
  let result = story;
  for (const [orig, replacement] of Object.entries(settingSwaps)) {
    const regex = new RegExp(`\\b${orig}\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, replacement);
      break;
    }
  }
  if (result === story) {
    // No setting word found - add a setting transformation intro
    const charName = extractCharacterName(story) || "our hero";
    const newSettings = [
      `In a world where everything floated among the clouds, `,
      `Deep beneath the sparkling ocean, in a city made of coral and pearls, `,
      `High atop a mountain that touched the stars, `,
    ];
    result = newSettings[Math.floor(Math.random() * newSettings.length)] + story.charAt(0).toLowerCase() + story.slice(1);
  }
  return result;
}

function remixTwist(story: string): string {
  const sentences = extractSentences(story);
  if (sentences.length < 4) return story;
  const insertAt = Math.floor(sentences.length * 0.6);
  const charName = extractCharacterName(story) || "everyone";
  const twists = [
    `\n\nJust then, the ground began to shimmer and shift! What ${charName} thought was a simple path turned out to be the back of a giant, friendly sleeping turtle who had been napping for a hundred years. "Oh my!" ${charName} exclaimed as the turtle blinked awake with a warm smile.\n\n`,
    `\n\nSuddenly, ${charName}'s shadow started moving on its own! It danced and twirled, then pulled out a tiny golden envelope from its pocket. Inside was a message: "The real adventure starts now — look up!" And there, in the sky, was a door made entirely of starlight.\n\n`,
    `\n\nWithout warning, all the colors in the world swapped places! The sky turned green, the grass turned blue, and ${charName} discovered they could suddenly understand what the birds were saying. "Follow us!" the birds chirped excitedly, "We know a secret!"\n\n`,
    `\n\nThen something incredible happened — time froze for everyone except ${charName}! In the silence, a tiny fairy appeared and whispered, "You've been chosen for something special. Come, I'll show you what even grown-ups can't see."\n\n`,
  ];
  const twist = twists[Math.floor(Math.random() * twists.length)];
  return [...sentences.slice(0, insertAt), twist, ...sentences.slice(insertAt)].join(' ');
}

function remixTone(story: string): string {
  const sentences = extractSentences(story);
  const charName = extractCharacterName(story) || "they";
  const funnyInserts = [
    `(${charName} accidentally tripped over a pebble at this point, but quickly pretended it was a dance move.)`,
    `"Well, THAT was unexpected!" ${charName} said, eyes wide as saucers.`,
    `A squirrel nearby watched all of this and shook its head. "Amateurs," it muttered.`,
    `${charName}'s tummy rumbled loudly. "Oops! Even heroes get hungry," ${charName} giggled.`,
    `A butterfly landed on ${charName}'s nose, making them cross-eyed and everyone burst out laughing!`,
  ];
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    result.push(sentences[i]);
    if (i > 0 && i % 3 === 0 && funnyInserts.length > 0) {
      const idx = Math.floor(Math.random() * funnyInserts.length);
      result.push(' ' + funnyInserts.splice(idx, 1)[0] + ' ');
    }
  }
  return result.join(' ');
}

async function tryAIRemix(originalStory: string, remixType: string, theme: string): Promise<string | null> {
  try {
    const remixPrompts: Record<string, string> = {
      ending: `Rewrite only the ending (last 30%) of this children's story to create a surprising but satisfying new conclusion. Keep the beginning and middle the same. Theme: ${theme}.\n\nOriginal story:\n${originalStory}`,
      character: `Rewrite this children's story replacing the main character with a completely different character (different species/type). Keep the same plot structure. Theme: ${theme}.\n\nOriginal story:\n${originalStory}`,
      setting: `Rewrite this children's story changing the setting to a completely different environment, adjusting details to match. Keep the same characters and moral. Theme: ${theme}.\n\nOriginal story:\n${originalStory}`,
      twist: `Add an exciting, unexpected plot twist in the middle of this children's story that changes the direction but still leads to a positive ending. Theme: ${theme}.\n\nOriginal story:\n${originalStory}`,
      tone: `Rewrite this children's story in a much funnier, sillier tone with humorous descriptions, funny asides, and lighthearted comedy while keeping the same plot. Theme: ${theme}.\n\nOriginal story:\n${originalStory}`,
    };
    const { data, error } = await supabase.functions.invoke('generate-story', {
      body: {
        mainCharacter: '',
        setting: '',
        theme: theme,
        details: remixPrompts[remixType],
        tone: remixType === 'tone' ? 'funny' : 'adventurous',
        moralFocus: 50,
      }
    });
    if (error || !data?.storyText) return null;
    return data.storyText;
  } catch {
    return null;
  }
}

export function StoryRemixer({ originalStory, theme, onRemixGenerated }: StoryRemixerProps) {
  const [remixType, setRemixType] = useState("ending");
  const [isRemixing, setIsRemixing] = useState(false);

  const remixOptions = [
    { value: "ending", label: "🎭 Different Ending" },
    { value: "character", label: "👥 New Main Character" },
    { value: "setting", label: "🌍 Different Setting" },
    { value: "twist", label: "🌀 Plot Twist" },
    { value: "tone", label: "🎨 Change Tone (Funny/Serious)" },
  ];

  const handleRemix = async () => {
    setIsRemixing(true);
    
    try {
      // Try AI-powered remix first, fall back to smart client-side remix
      let remixedStory = await tryAIRemix(originalStory, remixType, theme);
      
      if (!remixedStory) {
        // Smart client-side fallback
        switch(remixType) {
          case "ending":
            remixedStory = remixEnding(originalStory);
            break;
          case "character":
            remixedStory = remixCharacter(originalStory);
            break;
          case "setting":
            remixedStory = remixSetting(originalStory);
            break;
          case "twist":
            remixedStory = remixTwist(originalStory);
            break;
          case "tone":
            remixedStory = remixTone(originalStory);
            break;
          default:
            remixedStory = originalStory;
        }
      }
      
      onRemixGenerated(remixedStory);
      toast.success("Story remixed successfully!");
    } catch (error) {
      toast.error("Failed to remix story");
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="story-card p-6">
      <h3 className="text-xl font-bold mb-4 text-kids-purple flex items-center gap-2">
        <Wand2 className="w-6 h-6" />
        Story Remixer
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Transform your story with creative twists! Choose how you want to remix it.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Remix Type</label>
          <Select value={remixType} onValueChange={setRemixType}>
            <SelectTrigger className="rounded-lg border-kids-purple/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {remixOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleRemix}
          disabled={isRemixing}
          className="w-full bg-gradient-to-r from-kids-orange to-kids-yellow text-white font-bold"
        >
          {isRemixing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Remixing Story...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Remix Story
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 p-3 bg-kids-yellow/10 rounded-lg border border-kids-yellow/30">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Try different remix types to explore creative variations of your story!
        </p>
      </div>
    </div>
  );
}