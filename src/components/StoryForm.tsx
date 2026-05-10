
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type StoryFormProps = {
  onStoryGenerated: (storyText: string, theme: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
};

// Client-side fallback story generator for when API is unavailable
function generateFallbackStory(
  character: string,
  setting: string,
  theme: string,
  tone: string,
  moralFocus: number,
  details: string
): string {
  const charName = character.trim();
  const storyTemplates: Record<string, (c: string, s: string, d: string) => string> = {
    adventure: (c, s, d) =>
`Once upon a time, in ${s}, there lived ${c}. ${c} was known throughout the land for being brave and curious, always looking for the next great adventure.

One bright morning, ${c} discovered a mysterious, glowing map tucked inside an old hollow tree. The map showed a winding trail leading to the legendary Crystal Cave, a place whispered about but never found. ${d ? `${d} ` : ''}Without hesitation, ${c} packed a small bag with a compass, a water flask, and a handful of trail mix, then set off into the unknown.

The journey was challenging. ${c} crossed a rickety bridge over a roaring river, climbed steep rocky hills covered in colorful wildflowers, and navigated through a thick fog that made everything look like a dream. Along the way, ${c} met a cheerful bird named Melody who offered to guide the way with her sweet songs.

"Follow my tune!" Melody chirped. "The Crystal Cave hums a special note — I can hear it from here!"

Together, they pressed forward. When they finally reached the cave entrance, it sparkled with crystals of every color — ruby red, sapphire blue, emerald green, and golden amber. But the entrance was blocked by a large boulder. ${c} tried to push it, but it wouldn't budge.

"Maybe strength isn't what we need," Melody suggested gently. ${c} thought for a moment, then noticed musical notes carved into the boulder. Humming the tune that matched, the boulder slowly rolled aside, revealing the dazzling cave within.

Inside, the walls sang with light and warmth. At the center was not gold or jewels, but a beautiful crystal that showed memories — happy moments of kindness, laughter, and friendship shared by all who had visited before.

${c} smiled. "The real treasure was never about riches. It's about the experiences we collect and the friends we make along the way."

${c} carefully placed a small crystal from the cave in Melody's nest as a thank you, and together they walked home under a brilliant sunset, already dreaming of their next adventure.

${moralFocus >= 30 ? '\nMoral: The greatest treasures in life are not things we find, but the experiences we share and the friends we make on our journey.' : ''}`,

    fantasy: (c, s, d) =>
`Once upon a time, in the enchanted realm of ${s}, there lived ${c}. This was no ordinary place — the trees whispered ancient secrets, the rivers flowed with liquid silver, and the stars came down to dance every full moon.

${c} had always felt a special connection with the magic of ${s}. ${d ? `${d} ` : ''}One evening, as purple twilight draped the sky, a tiny fairy named Iris appeared in a burst of golden sparkles.

"${c}! The Great Rainbow Bridge that connects our world to the land of dreams is fading!" Iris cried, her wings trembling. "Without it, children everywhere will stop dreaming, and imagination itself will disappear!"

${c} knew this was serious. "How can I help?" ${c} asked with determination.

"You must collect three Enchanted Gems — the Ruby of Courage from the Dragon's Peak, the Sapphire of Wisdom from the Deep Crystal Lake, and the Emerald of Kindness from the Whispering Meadows," Iris explained.

The quest began at once. At Dragon's Peak, ${c} found a sleepy dragon named Ember who was grumpy because a thorn was stuck in his paw. Instead of fighting, ${c} gently removed the thorn. Grateful, Ember gifted the Ruby of Courage.

At the Crystal Lake, an ancient turtle asked three riddles. ${c} thought carefully and answered each one: "What grows stronger the more you share it? Love! What gets lighter the more you carry it? Hope! What can travel the world while staying in one place? A story!" The Sapphire of Wisdom rose from the depths.

In the Whispering Meadows, ${c} found a lonely little fox. Instead of rushing to grab the last gem, ${c} sat down, shared some berries, and listened to the fox's stories. Touched by this kindness, the meadow flowers bloomed into the Emerald of Kindness.

With all three gems in hand, ${c} and Iris flew to the Rainbow Bridge. Placing the gems at its base, the bridge burst back to life in a spectacular cascade of color — reds, oranges, yellows, greens, blues, and purples stretching across the sky.

Children everywhere began to dream again, and ${c} became known as the Guardian of Imagination.

${moralFocus >= 30 ? '\nMoral: True magic comes not from spells and potions, but from courage, wisdom, and most of all, kindness.' : ''}`,

    mystery: (c, s, d) =>
`Once upon a time, in the quiet corners of ${s}, there lived ${c}. ${c} had a sharp mind, a curious heart, and a magnifying glass that never left their pocket.

${d ? `${d} ` : ''}One misty morning, something strange happened — the beloved Golden Clock that sat in the town square had vanished overnight! The Golden Clock had chimed every hour since anyone could remember, and without it, the whole town felt lost.

"I'll find it!" ${c} declared, pulling out the magnifying glass. The investigation began immediately.

Clue #1: Near the clock's empty pedestal, ${c} found a trail of glittery dust that shimmered in the morning light. "This isn't ordinary dust," ${c} murmured, collecting a sample.

Clue #2: The baker, Mrs. Honeybun, said she heard a strange jingling sound at midnight. "It sounded like tiny bells dancing!" she recalled.

Clue #3: At the park, ${c} discovered a trail of small, sparkly footprints leading toward the old willow tree by the pond.

Following the footprints, ${c} found a hidden door in the willow's trunk. Inside was a cozy little room lit by fireflies, and there sat a family of pixies — and the Golden Clock, now decorated with flowers and ribbons!

"We didn't steal it!" the smallest pixie squeaked. "The clock was broken and had stopped chiming. We brought it here to fix it with our magic!"

Sure enough, when the pixie wound the clock, it chimed the most beautiful melody ${c} had ever heard — even better than before!

"You should have asked for help instead of just taking it," ${c} said gently but kindly. "The whole town was worried."

The pixies apologized and together, they carried the clock back to the town square. When it chimed at noon, everyone cheered, and the pixies became the official clock keepers.

${moralFocus >= 30 ? '\nMoral: When you need help or want to do something good, always communicate first. Even the best intentions need honesty and teamwork.' : ''}`,

    friendship: (c, s, d) =>
`Once upon a time, in the cozy corner of ${s}, there lived ${c}. ${c} was cheerful and fun-loving but had recently moved to a new place and didn't know anyone yet.

${d ? `${d} ` : ''}On the first day exploring the neighborhood, ${c} noticed a shy rabbit named Clover sitting alone under a big oak tree, reading a book. "What are you reading?" ${c} asked with a warm smile.

Clover looked up, surprised that someone was talking to them. "It's a story about two friends who go on amazing adventures together," Clover said softly.

"That sounds wonderful! I love adventures! Want to have a real one?" ${c} asked.

Clover hesitated. "I'm not very brave..."

"That's okay! I get scared sometimes too. We can be brave together!" ${c} said, reaching out a hand.

And so they set off together. They explored a colorful meadow where butterflies landed on their shoulders, built a cozy fort out of fallen branches and leaves, and discovered a stream where they skipped stones and counted the ripples.

When they reached a big hill, Clover wanted to turn back. "I can't climb that — it's too high."

"I'll go first and help you up," ${c} said encouragingly. Step by step, with ${c} reaching back each time, they made it to the top. The view was breathtaking — rolling hills of green and gold stretching to the horizon.

"I never could have seen this without you," Clover whispered, eyes wide with wonder.

"And I never would have found this beautiful place without you leading us through the meadow!" ${c} replied.

From that day on, ${c} and Clover were the best of friends. They learned that friendship isn't about being the same — it's about encouraging each other, being patient, and sharing the journey.

${moralFocus >= 30 ? '\nMoral: A true friend is someone who believes in you even when you doubt yourself. Together, we can achieve things we never thought possible alone.' : ''}`,

    animals: (c, s, d) =>
`Once upon a time, in the wonderful world of ${s}, there lived ${c}. All the animals in the region knew ${c} for always having a big heart and a helpful spirit.

${d ? `${d} ` : ''}One autumn morning, a strong gust of wind blew through ${s}, scattering leaves everywhere and knocking down Old Oliver the Owl's tree-house library. Books were scattered in every direction — across the meadow, into the stream, and even up in the clouds!

"Oh dear, oh dear!" Oliver hooted sadly, looking at the mess. "My library has been collecting stories for a hundred years!"

${c} didn't wait to be asked. "Don't worry, Oliver! I'll help gather every single book back!"

But the task was enormous. ${c} couldn't do it alone. So ${c} went to find friends. First, Splash the Dolphin helped retrieve books that had fallen into the stream, diving deep and balancing them on his nose. Then Bella the Butterfly spotted books that had blown into high branches and guided them down gently with her friends. Digger the Mole found books that had been buried under piles of leaves using his incredible sense of smell.

One by one, the books returned. The animals formed a chain, passing books from paw to wing to fin, all the way back to Oliver's tree.

By sunset, every single book was safe. Oliver arranged them lovingly on rebuilt shelves, and to show his gratitude, he read the most wonderful bedtime story to all the animals gathered around.

"Every one of you brought something special today," Oliver said warmly. "Splash brought strength, Bella brought sharp eyes, Digger brought keen senses, and ${c} — you brought everyone together."

That night, under a sky full of stars, ${s} felt more like home than ever before.

${moralFocus >= 30 ? '\nMoral: Everyone has unique talents and abilities. When we combine our strengths and work as a team, we can solve any problem and make the world a better place.' : ''}`,

    space: (c, s, d) =>
`Once upon a time, far beyond the clouds and past the twinkling stars, ${c} lived aboard a small but cozy spaceship floating near ${s}. ${c} was a young space explorer with a dream: to discover a planet where music grew like flowers.

${d ? `${d} ` : ''}One day, the ship's radar picked up a mysterious signal — a melody drifting through space! ${c} followed the sound through asteroid fields and past swirling nebulae of pink and purple.

"Beep-boop! Signal getting stronger!" announced Cosmo, the friendly robot companion. Cosmo's antenna spun excitedly.

They landed on a small, glowing planet called Harmonia. The ground was soft and bouncy, the trees had leaves shaped like musical notes, and the flowers played gentle tunes when the breeze blew through them!

But something was wrong. The music was fading. The flowers drooped, and the note-shaped leaves were turning grey.

An elderly starfish-shaped creature named Maestro floated toward them. "Our planet's Melody Crystal cracked during a meteor shower. Without its music, everything here will go silent forever."

"Can we fix it?" ${c} asked.

"It needs three sounds to heal — the sound of laughter, the sound of a kind word, and the sound of a heartbeat," Maestro explained.

${c} knew exactly what to do. First, ${c} told Cosmo the silliest joke ever invented, and they both burst out laughing. The crystal glowed faintly. Then, ${c} turned to Maestro and said, "You've kept this beautiful planet alive for so long. You are amazing." The crystal shone brighter. Finally, ${c} placed a hand on the crystal and let the steady thump-thump of a caring heart flow through.

The Melody Crystal burst into radiant light! Music poured out across Harmonia — flowers sang, leaves chimed, and even the stars seemed to dance. ${c} and Cosmo danced too, joined by every creature on the planet.

${moralFocus >= 30 ? '\nMoral: The most powerful forces in the universe are simple ones — joy, kindness, and love. They can heal anything, even a broken world.' : ''}`,

    halloween: (c, s, d) =>
`Once upon a time, on a spooky but fun Halloween night in ${s}, ${c} put on the most creative costume ever — a sparkling ghost-wizard with a hat made of candy wrappers and a cape that glowed in the dark!

${d ? `${d} ` : ''}As ${c} went trick-or-treating with friends, they noticed something curious. The old house at the end of Pumpkin Lane, which everyone said was haunted, had its lights on for the first time in years!

"Should we go there?" whispered ${c}'s friend, a little nervous.

"Let's be brave and check it out!" ${c} said with a grin.

When they knocked on the creaky door, it swung open to reveal... a friendly elderly woman named Grandma Willow! She had just moved back to the neighborhood and had been decorating all day.

"I've been waiting for trick-or-treaters! I made homemade caramel apples and pumpkin cookies!" she beamed.

Not only were her treats the best on the block, but Grandma Willow also told the most amazing ghost stories — funny ones that made everyone laugh rather than scream. She even taught them how to make shadow puppets on the wall that looked like dancing skeletons!

At the end of the night, ${c} realized that the "scariest" house had turned out to be the most fun stop of all.

${moralFocus >= 30 ? '\nMoral: Don\'t judge things by their appearance. Sometimes the most unexpected places hold the greatest surprises and the kindest people.' : ''}`,

    christmas: (c, s, d) =>
`Once upon a time, on a snowy Christmas Eve in ${s}, ${c} was busy helping everyone get ready for the big holiday celebration. The snow fell softly, covering everything in a blanket of white sparkles.

${d ? `${d} ` : ''}But there was a problem — the town's giant Christmas tree ornament, the Star of Wonder that had been passed down for generations, was missing from its box! Without it, the tree felt incomplete, and everyone was worried.

${c} decided to find the star before midnight. Following a trail of golden glitter through the snow, ${c} checked the toy shop, the bakery (where the gingerbread cookies smelled amazing), and even the ice skating rink.

Finally, at the old community center, ${c} found a little boy named Noel sitting alone, holding the star close. "I'm sorry," Noel sniffled. "I just wanted to look at it. My family can't afford decorations this year, and I thought maybe if I held it, some of its magic would rub off."

${c}'s heart melted like warm cocoa. Instead of being angry, ${c} sat down beside Noel. "You know what? The magic of Christmas isn't in any ornament. It's right here," ${c} said, pointing to Noel's heart.

Together, they walked back to the town square. ${c} asked everyone to help make decorations for Noel's family — paper snowflakes, popcorn garlands, and hand-drawn stars. Within an hour, Noel's house looked more beautiful than any store-bought decoration could achieve.

When the Star of Wonder was placed on top of the big tree at midnight, it seemed to glow brighter than ever before — maybe because the true spirit of Christmas was shining through everyone.

${moralFocus >= 30 ? '\nMoral: The magic of the holidays comes from sharing, caring, and making sure no one feels alone. The best gifts don\'t come in boxes — they come from the heart.' : ''}`,

    birthday: (c, s, d) =>
`Once upon a time, in ${s}, it was a very special day — it was ${c}'s birthday! The sun seemed to shine a little brighter, the birds sang a little sweeter, and even the clouds formed the shape of a birthday cake.

${d ? `${d} ` : ''}But when ${c} woke up that morning, the house was strangely quiet. No decorations, no singing, no smell of birthday pancakes. "Did everyone forget my birthday?" ${c} wondered sadly.

${c} decided to make the best of the day anyway. At the park, ${c} helped a little turtle flip back over. At the ice cream shop, ${c} shared the last scoop with a kid who had dropped theirs. At the library, ${c} read a story to some younger children who were waiting for their parents.

Each kind act made ${c} feel a warm glow inside, even though the birthday sadness lingered.

As the sun began to set, ${c}'s friend ran up breathlessly. "Come quick! There's an emergency at the Community Hall!"

Worried, ${c} rushed over and pushed open the doors — "SURPRISE!!!"

The entire hall was decorated with streamers, balloons, and a magnificent cake with sparklers on top. Every person ${c} had helped that day was there, plus all of ${c}'s friends and family.

"We planned this all week!" Mom said, hugging ${c} tightly. "And did you know? The turtle, the kid at the ice cream shop, and the children at the library all told us what you did. You spent your birthday making others happy!"

${c} grinned from ear to ear. It was already the best birthday ever — even before the cake!

${moralFocus >= 30 ? '\nMoral: The kindness you give to others always comes back to you in beautiful, unexpected ways. A generous heart is the greatest gift of all.' : ''}`,

    summer: (c, s, d) =>
`Once upon a time, during the sunniest summer ever, ${c} was spending the vacation in ${s}. The days were long, warm, and full of possibility.

${d ? `${d} ` : ''}${c} had a Summer Adventure Journal and was determined to fill every page with memories. Day one started with building the most epic sandcastle, complete with seashell windows and a seaweed flag.

But the real adventure began when ${c} found a message in a bottle washed up on shore. It read: "Follow the trail of seashells to find Summer's Greatest Secret!"

Excited, ${c} followed the trail — past the tide pools where tiny crabs waved hello, through a coconut grove where a parrot repeated jokes, and up to a sunny hilltop overlooking the entire coast.

There, under a rainbow-colored umbrella, sat a group of kids from different parts of the world, all brought together by similar messages in bottles!

"Welcome!" said a girl named Aria. "Every summer, this spot brings new friends together. It's the Greatest Secret — a friendship circle that spans the whole world!"

That summer, ${c} learned to say "hello" in ten different languages, tried foods from five different countries, and made friends who would write letters all year long.

On the last day of summer, ${c}'s journal was overflowing — not just with activities, but with drawings, photos, pressed flowers, and notes from new friends.

${moralFocus >= 30 ? '\nMoral: The best adventures aren\'t always planned. Stay open to surprises, be friendly to everyone you meet, and every day can become an unforgettable memory.' : ''}`,

    winter: (c, s, d) =>
`Once upon a time, during the coldest, snowiest winter anyone could remember, ${c} lived in ${s}. Everything was covered in a thick blanket of snow that sparkled like diamonds in the sunlight.

${d ? `${d} ` : ''}Most of the animals in ${s} had gone to sleep for the winter, and the other children stayed indoors by the fire. But not ${c}! ${c} loved the snow and went outside every single day.

One morning, ${c} discovered something magical — footprints in the snow that glowed faintly blue! They were too small for a person and too big for a mouse. Curious, ${c} followed them through the frozen forest.

The trail led to a clearing where a tiny ice fairy sat on a snowflake, crying. "My name is Crystal," she sniffled. "I was making snowflakes for the Winter Festival, but I lost my Frost Wand, and now I can't create any!"

"I'll help you find it!" ${c} said without hesitation.

Together, they searched under snow drifts and inside icicle caves. ${c} even asked a friendly snow owl to look from above. Finally, they found the wand stuck in a frozen pond — a squirrel had been using it as a bridge!

Crystal was overjoyed. With a wave of her wand, she created the most beautiful snowfall anyone had ever seen — each snowflake was a tiny, perfect crystal artwork.

"Thank you, ${c}! As a reward, whenever you see snowflakes fall, know that each one carries a wish of happiness from me to you."

From that day on, ${c} never looked at snow the same way again. Every snowflake felt like a tiny hug from a friend.

${moralFocus >= 30 ? '\nMoral: When we help others with kindness and don\'t expect anything in return, the world becomes a more magical place for everyone.' : ''}`,
  };

  // Fallback for themes without specific templates
  const defaultGenerator = (c: string, s: string, d: string) =>
`Once upon a time, in the wonderful world of ${s}, there lived ${c}. ${c} was known far and wide for having a heart full of wonder and a spirit full of adventure.

${d ? `${d} ` : ''}One beautiful day, something extraordinary happened. A shimmering rainbow appeared, leading from ${c}'s doorstep to a magnificent place no one had ever seen before — a garden where every flower told a story, every tree held a secret, and every breeze carried a song.

${c} decided to explore this magical place. Along the way, ${c} met a wise old tortoise named Theodore. "Welcome, young one," Theodore said with a slow, kind smile. "This is the Garden of Wonders. Each path you choose reveals something new about yourself."

${c} walked along the Path of Colors, where everything changed hues with each step — the sky turned pink, then gold, then brilliant turquoise. The Path of Sounds followed, where ${c} could hear the laughter of distant waterfalls and the gentle hum of honeybees.

But the most special path was the Path of Kindness. Here, ${c} found creatures who needed help — a bird with a tangled wing, a flower that needed water, and a lost little ladybug trying to find her way home. ${c} helped each one patiently and lovingly.

With every kind act, the garden grew more beautiful. New flowers bloomed, the colors grew more vivid, and the songs grew sweeter. Theodore appeared again, smiling broadly.

"You see, dear ${c}, this garden reflects the heart of whoever walks through it. Your kindness has made it the most beautiful it has ever been!"

${c} returned home with a heart full of memories and a new understanding — that wherever you go, the world reflects the love and kindness you put into it.

${moralFocus >= 30 ? '\nMoral: The beauty you see in the world is a reflection of the beauty you carry within. Be kind, be curious, and the world will always be magical.' : ''}`;

  const generator = storyTemplates[theme] || defaultGenerator;
  return generator(charName, setting, details);
}

export function StoryForm({ onStoryGenerated, isGenerating, setIsGenerating }: StoryFormProps) {
  const [mainCharacter, setMainCharacter] = useState("");
  const [setting, setSetting] = useState("");
  const [theme, setTheme] = useState("adventure");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [storyTone, setStoryTone] = useState('adventurous');
  const [moralStrength, setMoralStrength] = useState([50]);

  useEffect(() => {
    const draft = localStorage.getItem('storyDraft');
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft) as {
        mainCharacter?: string;
        setting?: string;
        theme?: string;
        details?: string;
        tone?: string;
        moralFocus?: number;
      };
      if (parsed.mainCharacter) setMainCharacter(parsed.mainCharacter);
      if (parsed.setting) setSetting(parsed.setting);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.details) setAdditionalDetails(parsed.details);
      if (parsed.tone) setStoryTone(parsed.tone);
      if (typeof parsed.moralFocus === 'number') setMoralStrength([parsed.moralFocus]);
      localStorage.removeItem('storyDraft');
    } catch (error) {
      console.warn('Failed to parse storyDraft', error);
    }
  }, []);

  const storyThemes = [
    { value: "adventure", label: "Adventure" },
    { value: "fantasy", label: "Fantasy" },
    { value: "mystery", label: "Mystery" },
    { value: "friendship", label: "Friendship" },
    { value: "animals", label: "Animal Stories" },
    { value: "space", label: "Space Exploration" },
    { value: "halloween", label: "🎃 Halloween Special" },
    { value: "christmas", label: "🎄 Christmas Magic" },
    { value: "valentines", label: "💝 Valentine's Day" },
    { value: "easter", label: "🐰 Easter Adventure" },
    { value: "thanksgiving", label: "🦃 Thanksgiving" },
    { value: "birthday", label: "🎂 Birthday Celebration" },
    { value: "newyear", label: "🎆 New Year's Eve" },
    { value: "summer", label: "☀️ Summer Vacation" },
    { value: "winter", label: "❄️ Winter Wonderland" },
  ];

  const handleGenerateStory = async () => {
    if (!mainCharacter || !setting) {
      toast.error("Please fill in the character and setting fields.");
      return;
    }

    setIsGenerating(true);
    
    // Process Child Personality Engine rules
    let finalDetails = additionalDetails;
    const savedPersonality = localStorage.getItem('childPersonality');
    if (savedPersonality) {
      try {
        const parsed = JSON.parse(savedPersonality);
        const rules = [];
        if (parsed.likes) rules.push(`Incorporate these interests: ${parsed.likes}`);
        if (parsed.fears) rules.push(`STRICTLY AVOID these themes: ${parsed.fears}`);
        if (parsed.readingLevel) rules.push(`Reading level: ${parsed.readingLevel}. Adapt sentence structure and vocabulary.`);
        
        if (rules.length > 0) {
          finalDetails += `\n\n[System Setting - Personality Profile: ${rules.join(". ")}]`;
        }
      } catch (e) {
        console.error("Failed to parse personality config", e);
      }
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: {
          mainCharacter,
          setting,
          theme,
          details: finalDetails,
          tone: storyTone,
          moralFocus: moralStrength[0]
        }
      });

      if (error) {
        console.warn('AI generation failed, using fallback:', error.message);
        // Fall back to client-side generation
        const fallbackStory = generateFallbackStory(mainCharacter, setting, theme, storyTone, moralStrength[0], finalDetails);
        onStoryGenerated(fallbackStory, theme);
        toast.success('Your story has been created!');
        return;
      }

      if (!data?.storyText) {
        // Fall back to client-side generation
        const fallbackStory = generateFallbackStory(mainCharacter, setting, theme, storyTone, moralStrength[0], finalDetails);
        onStoryGenerated(fallbackStory, theme);
        toast.success('Your story has been created!');
        return;
      }

      const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
      const storyLower = normalize(data.storyText);
      const hasKeyTerm = (phrase: string) => {
        const words = normalize(phrase).split(/\s+/).filter((word) => word.length > 2);
        return words.some((word) => storyLower.includes(word));
      };

      if (!hasKeyTerm(mainCharacter) || !hasKeyTerm(setting)) {
        const fallbackStory = generateFallbackStory(mainCharacter, setting, theme, storyTone, moralStrength[0], finalDetails);
        onStoryGenerated(fallbackStory, theme);
        toast.warning('AI story missed your details, so we generated one that matches your input.');
        return;
      }

      onStoryGenerated(data.storyText, theme);
      toast.success('Your story has been created!');
    } catch (error) {
      console.warn("AI error, using fallback story generator:", error);
      // Fall back to client-side story generation
      const fallbackStory = generateFallbackStory(mainCharacter, setting, theme, storyTone, moralStrength[0], finalDetails);
      onStoryGenerated(fallbackStory, theme);
      toast.success('Your story has been created!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="story-card animate-fade-in w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-kids-purple">Create Your Story</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="main-character" className="text-lg">Main Character</Label>
            <Input
              id="main-character"
              className="rounded-xl border-kids-purple/30 focus-visible:ring-kids-purple"
              placeholder="A friendly dragon"
              value={mainCharacter}
              onChange={(e) => setMainCharacter(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="setting" className="text-lg">Story Setting</Label>
            <Input
              id="setting"
              className="rounded-xl border-kids-purple/30 focus-visible:ring-kids-purple"
              placeholder="A magical forest"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="theme" className="text-lg">Story Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="rounded-xl border-kids-purple/30 focus-visible:ring-kids-purple">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {storyThemes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone" className="text-lg">Story Tone</Label>
          <Select value={storyTone} onValueChange={setStoryTone}>
            <SelectTrigger id="tone" className="rounded-xl border-kids-purple/30 focus-visible:ring-kids-purple">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funny">😄 Funny & Lighthearted</SelectItem>
              <SelectItem value="adventurous">🗺️ Adventurous & Exciting</SelectItem>
              <SelectItem value="mystery">🔍 Mystery & Suspense</SelectItem>
              <SelectItem value="heartwarming">💖 Heartwarming & Gentle</SelectItem>
              <SelectItem value="educational">📚 Educational & Informative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-lg">Moral Lesson Emphasis</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Subtle</span>
            <Slider
              value={moralStrength}
              onValueChange={setMoralStrength}
              max={100}
              step={10}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">Strong</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {moralStrength[0] < 30 && "Light touch - the moral will be gently woven into the story"}
            {moralStrength[0] >= 30 && moralStrength[0] < 70 && "Balanced - clear moral without being preachy"}
            {moralStrength[0] >= 70 && "Prominent - strong emphasis on the life lesson"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="details" className="text-lg">Additional Details (optional)</Label>
          <Textarea
            id="details"
            className="rounded-xl min-h-[100px] border-kids-purple/30 focus-visible:ring-kids-purple"
            placeholder="Add any other details you'd like to include in the story..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleGenerateStory}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-kids-purple to-kids-blue hover:opacity-90 text-white font-bold py-3 text-lg rounded-xl transition-all"
        >
          {isGenerating ? "Creating Your Story..." : "Generate Story"}
        </Button>
      </div>
    </div>
  );
}
