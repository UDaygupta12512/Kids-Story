import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { BookMarked, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type WordExplorerProps = {
  storyText: string;
};

type WordDefinition = {
  word: string;
  definition: string;
  example: string;
};

const wordDefinitions: Record<string, WordDefinition> = {
  magical: { word: "magical", definition: "Having special powers or qualities that seem impossible", example: "The fairy waved her magical wand." },
  adventure: { word: "adventure", definition: "An exciting or unusual experience", example: "They went on an amazing adventure in the forest." },
  brave: { word: "brave", definition: "Ready to face danger or pain; showing courage", example: "The brave knight fought the dragon." },
  friendship: { word: "friendship", definition: "A relationship between friends", example: "Their friendship grew stronger every day." },
  mysterious: { word: "mysterious", definition: "Difficult to understand or explain; strange", example: "A mysterious door appeared in the wall." },
  imagination: { word: "imagination", definition: "The ability to form pictures in your mind", example: "Use your imagination to create stories." },
  curious: { word: "curious", definition: "Eager to know or learn something new", example: "The curious kitten explored the garden." },
  discover: { word: "discover", definition: "To find or learn something for the first time", example: "They were excited to discover a hidden treasure." },
  enormous: { word: "enormous", definition: "Extremely large in size or amount", example: "The enormous dragon towered over the village." },
  gentle: { word: "gentle", definition: "Soft, kind, and careful; not rough", example: "The gentle breeze blew through the meadow." },
  journey: { word: "journey", definition: "The act of traveling from one place to another", example: "They began their long journey across the mountains." },
  kingdom: { word: "kingdom", definition: "A land ruled by a king or queen", example: "The peaceful kingdom was surrounded by tall mountains." },
  quest: { word: "quest", definition: "A long search for something important", example: "The hero went on a quest to find the lost crown." },
  treasure: { word: "treasure", definition: "Something very valuable or precious", example: "The pirates buried their treasure on the island." },
  ancient: { word: "ancient", definition: "Very old; from a long time ago", example: "The ancient castle had stood for a thousand years." },
  enchanted: { word: "enchanted", definition: "Under a magical spell; delightful", example: "The enchanted forest was full of talking animals." },
  courageous: { word: "courageous", definition: "Brave; willing to face fear or danger", example: "The courageous firefighter rescued the kitten." },
  luminous: { word: "luminous", definition: "Giving off light; shining brightly", example: "The luminous moon lit up the night sky." },
  whimsical: { word: "whimsical", definition: "Playfully unusual or imaginative", example: "The whimsical garden had flowers that sang." },
  magnificent: { word: "magnificent", definition: "Extremely beautiful or impressive", example: "The magnificent palace sparkled in the sunlight." },
  determined: { word: "determined", definition: "Having made a firm decision; not giving up", example: "She was determined to climb to the top of the hill." },
  wander: { word: "wander", definition: "To walk or move without a fixed plan", example: "They loved to wander through the colorful market." },
  brilliant: { word: "brilliant", definition: "Very bright or clever", example: "The brilliant inventor created a flying machine." },
  cozy: { word: "cozy", definition: "Warm, comfortable, and snug", example: "They curled up in the cozy blanket by the fire." },
  sparkle: { word: "sparkle", definition: "To shine with small flashes of light", example: "The stars began to sparkle in the evening sky." },
  hidden: { word: "hidden", definition: "Not easy to find; secret", example: "They found a hidden cave behind the waterfall." },
  explore: { word: "explore", definition: "To travel to new places to learn about them", example: "Let's explore the mysterious island together!" },
  fierce: { word: "fierce", definition: "Strong, powerful, and sometimes scary", example: "The fierce storm shook the old ship." },
  wisdom: { word: "wisdom", definition: "The ability to make good decisions using experience and knowledge", example: "The old owl shared her wisdom with the young birds." },
  harmony: { word: "harmony", definition: "A state of peaceful agreement and cooperation", example: "The village lived in harmony with nature." },
  generous: { word: "generous", definition: "Willing to share and give more than expected", example: "The generous baker gave free bread to everyone." },
  grateful: { word: "grateful", definition: "Feeling thankful for something", example: "She was grateful for the help of her friends." },
  persevere: { word: "persevere", definition: "To keep trying even when things are difficult", example: "He learned to persevere through the tough challenge." },
  peculiar: { word: "peculiar", definition: "Strange or unusual in an interesting way", example: "There was a peculiar sound coming from the attic." },
  vibrant: { word: "vibrant", definition: "Full of energy and brightness", example: "The vibrant colors of the sunset filled the sky." },
  glimmer: { word: "glimmer", definition: "A faint or unsteady light; a small sign of something", example: "A glimmer of hope appeared on the horizon." },
  mighty: { word: "mighty", definition: "Very strong and powerful", example: "The mighty eagle soared above the mountains." },
  precious: { word: "precious", definition: "Very valuable or important", example: "The precious gem was hidden in the cave." },
  triumph: { word: "triumph", definition: "A great victory or success", example: "Completing the puzzle was a real triumph." },
  humble: { word: "humble", definition: "Not proud; modest about oneself", example: "The humble farmer helped everyone in the village." },
  shimmer: { word: "shimmer", definition: "To shine with a soft, flickering light", example: "The lake began to shimmer under the moonlight." },
  whisper: { word: "whisper", definition: "To speak very softly", example: "The trees seemed to whisper secrets in the wind." },
  blossom: { word: "blossom", definition: "A flower; or to bloom and grow", example: "The cherry trees began to blossom in spring." },
  serene: { word: "serene", definition: "Calm, peaceful, and untroubled", example: "The serene lake reflected the beautiful mountains." },
  dazzle: { word: "dazzle", definition: "To greatly impress or amaze someone", example: "The fireworks display continued to dazzle the crowd." },
  legend: { word: "legend", definition: "A very old, well-known story, often about heroes", example: "The legend of the brave dragon was told for centuries." },
  guardian: { word: "guardian", definition: "Someone or something that protects and watches over another", example: "The wise owl was the guardian of the enchanted forest." },
  wanderlust: { word: "wanderlust", definition: "A strong desire to travel and explore", example: "Her wanderlust led her to visit many magical places." },
  compassion: { word: "compassion", definition: "A feeling of concern for others and wanting to help", example: "She showed great compassion by helping the lost puppy." },
  eloquent: { word: "eloquent", definition: "Fluent, expressive, and persuasive in speaking or writing", example: "The eloquent storyteller captivated the whole audience." },
  resilient: { word: "resilient", definition: "Able to recover quickly from difficulties", example: "The resilient little plant grew back after the storm." },
  unique: { word: "unique", definition: "Being the only one of its kind; special", example: "Every snowflake is unique and different." },
  courage: { word: "courage", definition: "The ability to face fear and do something difficult", example: "It takes courage to try new things." },
  extraordinary: { word: "extraordinary", definition: "Very unusual or remarkable; beyond ordinary", example: "The extraordinary butterfly had wings that glowed in the dark." },
  kindness: { word: "kindness", definition: "The quality of being friendly, generous, and caring", example: "Her kindness made everyone feel welcome." },
  whirl: { word: "whirl", definition: "To spin or turn rapidly", example: "The leaves began to whirl in the autumn wind." },
  noble: { word: "noble", definition: "Having admirable qualities; brave and good", example: "The noble prince set out to save the kingdom." },
  crystal: { word: "crystal", definition: "Clear, bright, and sparkling like glass", example: "The crystal-clear water showed fish swimming below." },
  soar: { word: "soar", definition: "To fly or rise high into the air", example: "The eagle began to soar above the clouds." },
  protect: { word: "protect", definition: "To keep safe from harm or danger", example: "The mother bear would protect her cubs." },
  inspire: { word: "inspire", definition: "To fill someone with a desire to do something great", example: "The beautiful music continued to inspire the young artist." },
  peaceful: { word: "peaceful", definition: "Free from worry or noise; calm", example: "The peaceful garden was a perfect place to read." },
  clever: { word: "clever", definition: "Quick to understand, learn, and think of ideas", example: "The clever fox outsmarted the other animals." },
  loyal: { word: "loyal", definition: "Faithful and devoted to someone or something", example: "The loyal dog waited by the door every day." },
  graceful: { word: "graceful", definition: "Moving in a smooth, elegant way", example: "The graceful dancer twirled across the stage." },
  delightful: { word: "delightful", definition: "Causing great pleasure and happiness", example: "The delightful surprise made her smile all day." },
  powerful: { word: "powerful", definition: "Having great strength or influence", example: "The powerful wizard cast a spell of protection." },
  wonderful: { word: "wonderful", definition: "Extremely good; marvelous", example: "They had a wonderful time at the carnival." },
  beautiful: { word: "beautiful", definition: "Very pleasing to look at or experience", example: "The beautiful rainbow stretched across the sky." },
  dangerous: { word: "dangerous", definition: "Able or likely to cause harm", example: "The dangerous storm made everyone stay inside." },
  fantastic: { word: "fantastic", definition: "Extraordinarily good or wonderful", example: "The fantastic show amazed the audience." },
  glowing: { word: "glowing", definition: "Giving out a steady light", example: "The glowing lantern guided them through the dark." },
  heroic: { word: "heroic", definition: "Very brave; having the qualities of a hero", example: "The heroic rescue saved everyone in the village." },
  incredible: { word: "incredible", definition: "Impossible or very hard to believe; amazing", example: "The incredible magic trick left everyone speechless." },
  joyful: { word: "joyful", definition: "Feeling or causing great happiness", example: "The joyful children played in the sunshine." },
  majestic: { word: "majestic", definition: "Having impressive beauty or grandeur", example: "The majestic mountains stood against the sky." },
  daring: { word: "daring", definition: "Brave and willing to take risks", example: "The daring explorer climbed the tallest peak." },
  enchanting: { word: "enchanting", definition: "Delightfully charming or attractive", example: "The enchanting melody filled the whole forest." },
  forest: { word: "forest", definition: "A large area covered with trees and plants", example: "The animals lived together in the deep forest." },
  garden: { word: "garden", definition: "A piece of land where flowers or vegetables are grown", example: "The colorful garden was full of butterflies." },
  island: { word: "island", definition: "A piece of land completely surrounded by water", example: "They sailed to the small island in the middle of the lake." },
  magic: { word: "magic", definition: "The power to make impossible things happen", example: "With a wave of magic, the pumpkin turned into a carriage." },
  ocean: { word: "ocean", definition: "A very large body of salt water", example: "Dolphins jumped happily in the blue ocean." },
  rainbow: { word: "rainbow", definition: "An arc of colors in the sky caused by light and rain", example: "After the rain, a beautiful rainbow appeared." },
  secret: { word: "secret", definition: "Something that is kept hidden or unknown to others", example: "The old map held a secret that nobody knew." },
  castle: { word: "castle", definition: "A large building with thick walls, towers, and sometimes a moat", example: "The castle on the hill was home to the royal family." },
  dragon: { word: "dragon", definition: "A large, imaginary creature that can breathe fire", example: "The friendly dragon helped the village stay warm in winter." },
  fairy: { word: "fairy", definition: "A tiny magical being with wings", example: "The fairy sprinkled sparkling dust on the flowers." },
  giant: { word: "giant", definition: "An extremely large person or creature", example: "The friendly giant lived at the top of the beanstalk." },
  hero: { word: "hero", definition: "A person admired for brave deeds", example: "The hero saved the village from the flood." },
  knight: { word: "knight", definition: "A brave warrior who fights for good", example: "The knight rode his horse through the valley." },
  prince: { word: "prince", definition: "The son of a king or queen", example: "The prince searched for the lost crown." },
  princess: { word: "princess", definition: "The daughter of a king or queen", example: "The princess rescued the kingdom with her clever plan." },
  wizard: { word: "wizard", definition: "A person who uses magic spells", example: "The wise wizard taught magic to young students." },
  potion: { word: "potion", definition: "A liquid with magical or special powers", example: "The potion turned the frog back into a prince." },
  scroll: { word: "scroll", definition: "A roll of paper with writing on it", example: "The ancient scroll contained the spell they needed." },
  village: { word: "village", definition: "A small town in the countryside", example: "The village was known for its friendly people." },
  mountain: { word: "mountain", definition: "A very high, steep hill", example: "They climbed the mountain to see the sunrise." },
};

export function WordExplorer({ storyText }: WordExplorerProps) {
  const [selectedWord, setSelectedWord] = useState<WordDefinition | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Find which words from our dictionary actually appear in the story
  const storyWords = useMemo(() => {
    const lowerStory = storyText.toLowerCase();
    const found = new Set<string>();
    for (const key of Object.keys(wordDefinitions)) {
      if (lowerStory.includes(key)) {
        found.add(key);
      }
    }
    return found;
  }, [storyText]);

  const handleWordClick = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:'"()]/g, '');
    if (wordDefinitions[cleanWord]) {
      setSelectedWord(wordDefinitions[cleanWord]);
      setShowDialog(true);
    }
  };

  const renderInteractiveStory = () => {
    const words = storyText.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"()]/g, '');
      const isClickable = wordDefinitions[cleanWord] !== undefined;
      
      return (
        <span key={index}>
          <span
            onClick={() => isClickable && handleWordClick(word)}
            className={isClickable 
              ? 'cursor-pointer underline decoration-dotted decoration-kids-blue hover:text-kids-blue hover:bg-kids-blue/10 rounded px-0.5 transition-colors' 
              : ''
            }
          >
            {word}
          </span>
          {' '}
        </span>
      );
    });
  };

  return (
    <div className="story-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookMarked className="w-5 h-5 text-kids-purple" />
        <h3 className="text-lg font-bold text-kids-purple">
          Word Explorer
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs bg-kids-purple/10 text-kids-purple px-2 py-1 rounded-full font-medium">
            {storyWords.size} words to explore
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Lightbulb className="w-4 h-4" />
            Click underlined words to learn!
          </div>
        </div>
      </div>

      <div className="prose max-w-none text-base leading-relaxed">
        {renderInteractiveStory()}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-kids-purple flex items-center gap-2">
              <BookMarked className="w-5 h-5" />
              Word Definition
            </DialogTitle>
          </DialogHeader>
          {selectedWord && (
            <div className="space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-kids-blue mb-2">
                  {selectedWord.word}
                </h4>
                <p className="text-gray-700 text-lg">
                  {selectedWord.definition}
                </p>
              </div>
              
              <div className="bg-kids-purple/5 p-4 rounded-lg border-l-4 border-kids-purple">
                <p className="text-sm font-semibold text-kids-purple mb-1">
                  Example:
                </p>
                <p className="text-gray-700 italic">
                  "{selectedWord.example}"
                </p>
              </div>

              <Button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(selectedWord.word);
                    utterance.rate = 0.8;
                    speechSynthesis.speak(utterance);
                  }
                }}
                variant="outline"
                className="w-full border-kids-blue text-kids-blue hover:bg-kids-blue/10"
              >
                🔊 Hear Pronunciation
              </Button>

              <Button
                onClick={() => setShowDialog(false)}
                className="w-full bg-gradient-to-r from-kids-purple to-kids-blue text-white"
              >
                Got it!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}