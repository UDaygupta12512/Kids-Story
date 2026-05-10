import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type Choice = {
  text: string;
  nextScene: number;
};

type Scene = {
  id: number;
  text: string;
  choices: Choice[];
  isEnding?: boolean;
};

type BranchingStoryProps = {
  theme?: string;
};

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
  recentAchievements: [],
};

const getProgress = (): ProgressState => {
  const saved = localStorage.getItem('kidProgress');
  if (!saved) return progressDefaults;
  try {
    return { ...progressDefaults, ...JSON.parse(saved) } as ProgressState;
  } catch {
    return progressDefaults;
  }
};

const saveProgress = (data: ProgressState) => {
  localStorage.setItem('kidProgress', JSON.stringify(data));
};

export function BranchingStory({ theme = "adventure" }: BranchingStoryProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [storyPath, setStoryPath] = useState<number[]>([0]);
  const [points, setPoints] = useState(0);
  const [lastChoice, setLastChoice] = useState<string | null>(null);

  // Pre-defined branching story structure
  const getStoryScenes = (): Scene[] => {
    const themeScenes: Record<string, Scene[]> = {
      adventure: [
        {
          id: 0,
          text: "You stand at the entrance of a mysterious cave. Strange sounds echo from within. A worn map in your hand shows two possible paths - one leads through the dark cave, the other around the mountain.",
          choices: [
            { text: "Enter the cave bravely 🦁", nextScene: 1 },
            { text: "Take the safer mountain path 🏔️", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "Inside the cave, you discover glowing crystals lighting your way! You find a treasure chest, but hear footsteps approaching.",
          choices: [
            { text: "Hide behind the crystals 💎", nextScene: 3 },
            { text: "Open the treasure chest quickly 📦", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "The mountain path leads you to a friendly village. The villagers tell you about a secret passage that leads to the same treasure!",
          choices: [
            { text: "Follow the secret passage 🗝️", nextScene: 5 },
            { text: "Stay and learn from the villagers 📚", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "You hide just in time! A friendly dragon appears, impressed by your cleverness. The dragon offers to share the treasure with you!",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "The chest opens to reveal magical artifacts! You've found the legendary treasure, and gain wisdom about taking calculated risks.",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "The secret passage leads to an underground garden filled with rare treasures. Your patience and trust in others has been rewarded!",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "The villagers teach you valuable skills and give you gifts. Sometimes the real treasure is the friends we make along the way!",
          choices: [],
          isEnding: true
        }
      ],
      fantasy: [
        {
          id: 0,
          text: "A magical fairy appears before you with a glowing wand. 'I can grant you one wish,' she says, 'but choose wisely!'",
          choices: [
            { text: "Wish for magical powers ✨", nextScene: 1 },
            { text: "Wish to help others 💝", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "You gain the power to talk to animals! A wise owl tells you about a spell book hidden in the enchanted forest.",
          choices: [
            { text: "Search for the spell book 📖", nextScene: 3 },
            { text: "Use your powers to help forest animals 🦉", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "The fairy is touched by your kindness! She makes you a guardian of the magical realm, protecting all who need help.",
          choices: [
            { text: "Accept the responsibility 🛡️", nextScene: 5 },
            { text: "Ask for wisdom to help others better 🌟", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "You find the ancient spell book! With great power comes great responsibility. You use it to bring harmony to the magical world.",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "By helping the animals, you discover they hold the greatest magic of all - friendship and kindness. You become a beloved hero!",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "As a guardian, you protect the realm with courage. Your selfless choice has made the magical world a safer place for everyone!",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "The fairy grants you eternal wisdom. You become the wisest helper in the land, guiding others with your knowledge and heart.",
          choices: [],
          isEnding: true
        }
      ],
      friendship: [
        {
          id: 0,
          text: "Your best friend seems sad today. You notice they're sitting alone at lunch, not eating their favorite sandwich.",
          choices: [
            { text: "Sit with them and ask what's wrong 💬", nextScene: 1 },
            { text: "Give them space but watch from nearby 👀", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "Your friend opens up! They're worried about a test tomorrow. You remember you studied that subject well.",
          choices: [
            { text: "Offer to study together after school 📚", nextScene: 3 },
            { text: "Share your notes and tips 📝", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "You notice them tearing up. Sometimes being nearby is enough. They eventually come to you for a hug.",
          choices: [
            { text: "Give them a big hug 🤗", nextScene: 5 },
            { text: "Offer to do something fun together 🎨", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "You study together all afternoon! Your friend aces the test and your friendship grows even stronger. Helping friends helps everyone!",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "Your friend is so grateful for your notes! They feel confident now. You've learned that sharing knowledge spreads happiness!",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "Sometimes all we need is a hug! Your friend feels better and thanks you for always being there. True friendship means being present!",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "You spend the day doing fun activities together! Laughter is the best medicine. Your friend's smile returns, and so does yours!",
          choices: [],
          isEnding: true
        }
      ],
      space: [
        {
          id: 0,
          text: "Your rocket ship has landed on a mysterious planet covered in sparkling purple sand. Your scanner detects two interesting signals nearby.",
          choices: [
            { text: "Follow the signal to a crystal cave 🔮", nextScene: 1 },
            { text: "Follow the signal to a crashed alien ship 🛸", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "The crystal cave is alive with glowing minerals! A tiny alien creature peeks out from behind a crystal, looking scared but curious.",
          choices: [
            { text: "Offer it a snack from your pack 🍪", nextScene: 3 },
            { text: "Wave hello and sit down gently 👋", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "The abandoned alien ship has a working computer! It shows a map to a hidden space garden where rare star-flowers grow.",
          choices: [
            { text: "Follow the map to the garden 🌺", nextScene: 5 },
            { text: "Fix the ship and return it to its owner 🔧", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "The alien LOVES your cookies! It shows you a hidden room full of star maps. You've made a friend from another galaxy! Kindness is the universal language. 🌌",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "Your calm patience wins the alien's trust. It brings its whole family to meet you! You become the first human ambassador to this planet. Patience opens doors to amazing friendships! 🤝",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "The star-flower garden is breathtaking! Each flower sings a different note. You collect seeds to plant on Earth. Curiosity leads to the most wonderful discoveries! 🎵",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "You fix the ship and its grateful owner returns! They give you an honorary space pilot badge and promise to visit Earth. Doing the right thing always comes back to reward you! ⭐",
          choices: [],
          isEnding: true
        }
      ],
      animals: [
        {
          id: 0,
          text: "You wake up and discover you can talk to animals! Your pet dog says, 'Finally! The forest animals need your help — a baby bird fell from its nest!'",
          choices: [
            { text: "Run to the forest to help 🏃", nextScene: 1 },
            { text: "Ask your dog to gather animal friends first 🐕", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "You find the baby bird chirping sadly on the ground. The nest is very high up in the tree. A friendly squirrel offers to help.",
          choices: [
            { text: "Let the squirrel carry the bird up 🐿️", nextScene: 3 },
            { text: "Build a ramp with sticks and leaves 🪵", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "Your dog calls a meeting! A wise owl, a strong bear, and a clever fox all arrive. Together, you make a rescue plan.",
          choices: [
            { text: "Have the bear lift you to the nest 🐻", nextScene: 5 },
            { text: "Ask the owl to fly the baby bird home 🦉", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "The squirrel gently carries the baby bird home! The mama bird sings a beautiful thank-you song. Working together makes hard things easy! 🎶",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "Your clever ramp works perfectly! The baby bird hops up the ramp to its nest. All the forest animals cheer for your creative thinking! 🎉",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "The gentle bear lifts you up and you place the baby bird safely in its nest. The forest declares you an honorary animal protector! Teamwork saves the day! 🏅",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "The wise owl carefully flies the baby bird back to its nest. Sometimes asking the right person for help is the smartest thing you can do! 🦉",
          choices: [],
          isEnding: true
        }
      ],
      halloween: [
        {
          id: 0,
          text: "It's Halloween night! You're trick-or-treating when you hear a tiny 'Help!' coming from a spooky old house. Your candy bag is full, but someone needs you.",
          choices: [
            { text: "Bravely investigate the house 🏚️", nextScene: 1 },
            { text: "Go get an adult to help 👨‍👩‍👧", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "Inside, a friendly little ghost is stuck in a spider web! They were playing hide-and-seek and got tangled up.",
          choices: [
            { text: "Gently untangle the ghost 👻", nextScene: 3 },
            { text: "Tell a funny joke to calm them down first 😂", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "You find your neighbor who is happy to help! Together you enter the house and find a costume-wearing kitten stuck on a shelf.",
          choices: [
            { text: "Gently lift the kitten down 🐱", nextScene: 5 },
            { text: "Lure it with a treat from your candy bag 🍬", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "The ghost is free and so happy! They invite you to a secret ghost Halloween party with the best candy in town. Bravery leads to the best adventures! 🎃",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "Your joke makes the ghost laugh so hard they float right out of the web! Laughter really is magical. You become best friends and trick-or-treat together! 😄",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "The kitten purrs happily in your arms! Its owner is so grateful they give you and your neighbor extra-special Halloween treats. Helping others is always worth it! 🌟",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "The kitten comes down for the treat and snuggles right into your costume. You find its home and the whole neighborhood celebrates your kindness with a Halloween party! 🎉",
          choices: [],
          isEnding: true
        }
      ],
      christmas: [
        {
          id: 0,
          text: "On Christmas Eve, you find a tiny elf sitting on your doorstep looking lost. 'I got separated from Santa's sleigh!' the elf sniffles.",
          choices: [
            { text: "Help the elf send a signal to Santa 📡", nextScene: 1 },
            { text: "Invite the elf inside to warm up first ☕", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "You use Christmas lights to spell out 'ELF HERE' on your roof! But while waiting, the elf notices your neighbor's house has no decorations.",
          choices: [
            { text: "Decorate your neighbor's house together 🎄", nextScene: 3 },
            { text: "Make handmade cards for the neighbor 💌", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "Over hot cocoa, the elf tells you Santa's workshop needs one more gift finished. It's for a child who wished for a friend.",
          choices: [
            { text: "Help make the perfect friendship bracelet 📿", nextScene: 5 },
            { text: "Write a heartfelt letter to include with the gift ✉️", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "Your neighbor is so touched! Santa arrives and is so proud of your Christmas spirit that he makes you an Honorary Elf. The best gift is making others happy! 🎅",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "Your handmade cards bring tears of joy to your neighbor! Santa sees your kindness and says you've captured the true meaning of Christmas. Thoughtfulness is the greatest gift! ❤️",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "The friendship bracelet is beautiful! Santa delivers it and the child finds a forever friend. You've learned that making things with love is the best kind of magic! ✨",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "Your letter is so warm and kind that Santa reads it to all the elves! They vote to make you the Official Letter Writer of the North Pole. Words from the heart can change the world! 📜",
          choices: [],
          isEnding: true
        }
      ],
      underwater: [
        {
          id: 0,
          text: "You put on a magical diving helmet and plunge into the ocean! A dolphin swims up and chatters excitedly. It seems to want you to follow it.",
          choices: [
            { text: "Follow the dolphin deeper 🐬", nextScene: 1 },
            { text: "Explore the colorful coral reef nearby 🪸", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "The dolphin leads you to an underwater city made of shells and pearls! A seahorse mayor greets you. 'We need help! Our light crystal is fading.'",
          choices: [
            { text: "Search for a new crystal in the deep trench 💎", nextScene: 3 },
            { text: "Try to fix the old crystal with kindness ✨", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "Among the coral, you find a baby sea turtle tangled in seaweed. An octopus nearby has many arms but not enough to help alone.",
          choices: [
            { text: "Team up with the octopus to free the turtle 🐙", nextScene: 5 },
            { text: "Use your diving tools to gently cut the seaweed ✂️", nextScene: 6 }
          ]
        },
        {
          id: 3,
          text: "In the deep trench, you find crystal stronger than any other! The city glows brighter than ever. You're named Hero of the Deep! Courage lights up the world! 🌊",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "You sing to the crystal and it pulses with warmth! It only needed love to recharge. The whole ocean glows with gratitude. Love is the most powerful energy! 💖",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "Together with the octopus you free the turtle! All the sea creatures throw a celebration feast. Teamwork makes everything possible! 🎊",
          choices: [],
          isEnding: true
        },
        {
          id: 6,
          text: "You carefully free the baby turtle, who nuzzles you thankfully. Its mama turtle arrives and gives you a ride across the whole ocean! Gentle hands do the greatest work! 🐢",
          choices: [],
          isEnding: true
        }
      ],
      puzzle: [
        {
          id: 0,
          text: "You find a mysterious ancient door covered in vines. It has a magical puzzle carved into it: 'What has to be broken before you can use it?'",
          choices: [
            { text: "A window 🪟", nextScene: 1 },
            { text: "An egg 🥚", nextScene: 3 }
          ]
        },
        {
          id: 1,
          text: "INCORRECT! The ground shakes. Instead of punishing you, the floor gently opens up and you slide down into the Secret Training World! 🌠",
          choices: [
            { text: "Explore the Training World 👀", nextScene: 2 }
          ]
        },
        {
          id: 2,
          text: "Here in the Training World, a friendly owl teaches you that mistakes are just stepping stones to learning! You get to practice new puzzles without any fear. Growth happens when we try! 🌱",
          choices: [],
          isEnding: true
        },
        {
          id: 3,
          text: "CORRECT! The door glows green and opens to reveal a room of magical artifacts. You solved the puzzle on your very first try!",
          choices: [],
          isEnding: true
        }
      ],
      mission: [
        {
          id: 0,
          text: "STORY MISSION: You are traveling to the Crystal Castle, but a massive sleeping dragon is blocking the only bridge! You must choose a strategy to cross safely.",
          choices: [
            { text: "Sing a lullaby to keep it sleeping 🎵", nextScene: 1 },
            { text: "Try to quietly sneak past it 🤫", nextScene: 2 }
          ]
        },
        {
          id: 1,
          text: "You chose the Lullaby Strategy! The dragon's ear twitches, but your sweet melody makes it snore louder. However, halfway across, you step on a squeaky branch! QUICK, what do you do?",
          choices: [
            { text: "Freeze and stay perfectly still 🧊", nextScene: 3 },
            { text: "Run as fast as you can 🏃", nextScene: 4 }
          ]
        },
        {
          id: 2,
          text: "You chose to sneak past! You tip-toe very carefully. Suddenly, the dragon opens one giant yellow eye. 'Who dares cross my bridge?' it booms. You must answer its riddle to pass: 'What has legs but doesn't walk?'",
          choices: [
            { text: "A table 🪑", nextScene: 5 },
            { text: "A snake 🐍", nextScene: 4 }
          ]
        },
        {
          id: 3,
          text: "SUCCESS! You stay frozen like a statue. The dragon sleepily looks around, snorts out a puff of smoke, and goes back to sleep. You safely cross the bridge and reach the castle! MISSION ACCOMPLISHED 🏆",
          choices: [],
          isEnding: true
        },
        {
          id: 4,
          text: "OH NO! The dragon is startled! But instead of attacking, it laughs. 'You're quite funny, little one. But you must go back and try again.' The dragon gently picks you up and places you back at the start. GAME OVER - Try Again! 🔄",
          choices: [],
          isEnding: true
        },
        {
          id: 5,
          text: "CORRECT! The dragon smiles a toothy grin. 'A table indeed! You are smart. You may pass.' You proudly walk across the bridge to the Crystal Castle. MISSION ACCOMPLISHED 🏆",
          choices: [],
          isEnding: true
        }
      ]
    };

    return themeScenes[theme] || themeScenes.adventure;
  };

  const scenes = getStoryScenes();
  const scene = scenes[currentScene];

  useEffect(() => {
    if (!scene.isEnding) return;

    const stored = localStorage.getItem('storyMemoryUniverse');
    let universe = { characters: ["Story Adventurer"], pastChoices: [], worldState: "peaceful" };
    if (stored) {
      try {
        universe = JSON.parse(stored);
      } catch {
        universe = { characters: ["Story Adventurer"], pastChoices: [], worldState: "peaceful" };
      }
    }

    const choiceText = lastChoice || `completed a ${theme} adventure`;
    const updated = {
      ...universe,
      pastChoices: Array.from(new Set([choiceText, ...(universe.pastChoices || [])])).slice(0, 6),
      worldState: points >= 30 ? "thriving" : points >= 10 ? "hopeful" : "peaceful",
    };
    localStorage.setItem('storyMemoryUniverse', JSON.stringify(updated));

    const progress = getProgress();
    const updatedProgress: ProgressState = {
      ...progress,
      streak: progress.streak + 1,
      totalXp: progress.totalXp + 15,
      completionPercent: Math.min(100, progress.completionPercent + 5),
      level: Math.max(1, Math.floor((progress.totalXp + 15) / 100)),
      lesson: progress.lesson + 1,
    };
    saveProgress(updatedProgress);
  }, [scene.isEnding, lastChoice, points, theme]);

  const makeChoice = (choice: Choice) => {
    setCurrentScene(choice.nextScene);
    setStoryPath([...storyPath, choice.nextScene]);
    setPoints(points + 10);
    setLastChoice(choice.text);
    const progress = getProgress();
    const updatedProgress: ProgressState = {
      ...progress,
      totalXp: progress.totalXp + 5,
      completionPercent: Math.min(100, progress.completionPercent + 2),
      level: Math.max(1, Math.floor((progress.totalXp + 5) / 100)),
    };
    saveProgress(updatedProgress);
    toast.success("Great choice! +10 points");
  };

  const restart = () => {
    setCurrentScene(0);
    setStoryPath([0]);
    setPoints(0);
    setLastChoice(null);
    toast.info("Story restarted!");
  };

  return (
    <div className="story-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-kids-purple flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Interactive Story Adventure
        </h3>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-kids-yellow/20 rounded-lg">
            <span className="font-bold text-kids-purple">{points} Points</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={restart}
            className="border-kids-orange text-kids-orange hover:bg-kids-orange/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>

      {/* Story Progress */}
      <div className="mb-6 flex gap-2">
        {storyPath.map((sceneId, idx) => (
          <div
            key={idx}
            className="h-2 flex-1 bg-gradient-to-r from-kids-purple to-kids-blue rounded-full"
          />
        ))}
        {Array.from({ length: 4 - storyPath.length }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="h-2 flex-1 bg-gray-200 rounded-full"
          />
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-kids-purple/5 to-kids-blue/5 border-2 border-kids-purple/20">
        <p className="text-lg leading-relaxed mb-6 text-gray-700">
          {scene.text}
        </p>

        {scene.isEnding ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-kids-green/20 to-kids-blue/20 rounded-lg border-2 border-kids-green">
              <p className="font-bold text-kids-green text-center text-xl">
                🎉 The End! 🎉
              </p>
              <p className="text-center mt-2 text-gray-700">
                You earned {points} points on this adventure!
              </p>
            </div>
            <Button
              onClick={restart}
              className="w-full bg-gradient-to-r from-kids-purple to-kids-blue text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try a Different Path
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-semibold text-kids-purple mb-3">What will you do?</p>
            {scene.choices.map((choice, idx) => (
              <Button
                key={idx}
                onClick={() => makeChoice(choice)}
                className="w-full justify-between bg-white hover:bg-kids-purple/10 text-kids-purple border-2 border-kids-purple/30 transition-all"
                variant="outline"
              >
                <span>{choice.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-4 p-4 bg-kids-yellow/10 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          💡 Every choice leads to a different adventure! Try different paths to discover all the endings.
        </p>
      </div>
    </div>
  );
}
