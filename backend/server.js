const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Story templates ────────────────────────────────────────────────────
const storyTemplates = {
  adventure: (c, s) =>
    `Once upon a time, a brave adventurer named ${c} set out on an exciting journey through ${s}. The path ahead was filled with mystery and wonder.\n\nAs ${c} walked deeper, they discovered hidden trails and ancient markers left by explorers long ago. Every twist in the path brought a new surprise — sparkling streams, towering trees, and curious creatures watching from the shadows.\n\n"I must keep going!" ${c} said with determination. With each step, ${c} grew braver and wiser.\n\nAfter a thrilling journey, ${c} reached the heart of ${s} and found something truly special — a golden compass that always pointed toward home. ${c} learned that courage is not about being fearless, but about pressing forward even when things are scary.\n\nAnd so, ${c} returned home a true hero, ready for the next adventure!`,

  fantasy: (c, s) =>
    `In a magical realm hidden within ${s}, there lived a young dreamer named ${c} who had a very special gift — the ability to see magic others could not.\n\nOne morning, ${c} noticed tiny glowing lights dancing between the flowers. Following them, ${c} discovered a secret garden where wishes grew on trees! Each wish was a glowing orb waiting to be set free.\n\nA wise old fairy appeared and said, "Only those with a kind heart can see this place. Would you like to grant someone a wish?"\n\n${c} thought carefully and chose to wish for happiness for all the creatures in ${s}. The garden erupted in sparkles and color!\n\nFrom that day on, ${c} was known as the Guardian of Wishes, spreading joy and magic wherever they went. And the fairy smiled, knowing the magic was in ${c}'s heart all along.`,

  friendship: (c, s) =>
    `In the heart of ${s}, there was a cozy place where children loved to play. But ${c} was new here and felt a little shy.\n\nOne sunny day, ${c} sat alone on a bench, watching others play. A cheerful child named Robin ran over and said, "Hi! Do you want to join us?"\n\n${c} hesitated, then smiled and said, "Yes, please!" Together, they built the most magnificent sandcastle anyone had ever seen. They shared stories, laughed together, and made up silly games.\n\nWhen the sun began to set, Robin said, "Same time tomorrow?" ${c} nodded happily.\n\nFrom that day on, ${c} and Robin were inseparable friends, proving that sometimes all it takes is one kind invitation to change everything. True friendship begins with a simple hello.`,

  animals: (c, s) =>
    `Deep in ${s}, a friendly animal named ${c} lived in a cozy home under an old oak tree. ${c} loved exploring and making friends with all the creatures nearby.\n\nOne morning, ${c} heard a tiny cry. A baby bird had fallen from its nest! "Don't worry," said ${c}. "I'll help you get home."\n\n${c} called on friends for help — a squirrel who could climb, a turtle who offered encouragement, and a butterfly who showed the way to the nest. Working together, they carefully returned the baby bird to its family.\n\n"Thank you!" chirped the mama bird. "You showed true kindness today."\n\n${c} smiled and realized that helping others feels like the greatest adventure of all. From that day on, every creature in ${s} knew they could count on ${c}.`,

  space: (c, s) =>
    `Three... two... one... BLAST OFF! ${c} zoomed through the stars in a shiny rocket, heading toward ${s} — one of the most mysterious places in the galaxy!\n\nAs the rocket landed in a puff of shimmering dust, ${c} saw something amazing: the entire landscape sparkled with rainbow-colored crystals, and the sky had three moons!\n\nA friendly alien rolled up on six tiny wheels and beeped, "Welcome! We've been waiting for a brave explorer!"\n\n${c} explored underwater caves, bounced on low-gravity hills, and learned that the aliens communicated through music!\n\nBefore heading home, ${c}'s new alien friend gave them a glowing star seed. "Plant this on Earth," they said. "It will grow into a friendship that spans galaxies."\n\nBack on Earth, ${c} planted the seed and every night, the little plant glowed, reminding ${c} that friends can be found anywhere in the universe.`,

  mystery: (c, s) =>
    `It was a perfectly ordinary day in ${s} until ${c} noticed something strange — all the clocks had stopped at exactly 3:15!\n\n"How peculiar," said ${c}, pulling out a magnifying glass. Following a trail of sparkly footprints, ${c} discovered clue after clue: a riddle carved in a tree, a key hidden under a stone, and a map drawn in invisible ink.\n\nEach clue led closer to the answer. ${c} worked carefully, using their sharp mind and never giving up, even when the puzzle seemed impossible.\n\nFinally, ${c} found the source — a magical music box that had frozen time while it played its enchanted melody. ${c} gently closed the lid, and all the clocks started ticking again!\n\nThe townspeople cheered! ${c} learned that patience and observation can solve any mystery. And they always kept that magnifying glass handy... just in case.`,
};

const defaultTemplate = (c, s, theme) =>
  `Once upon a time in ${s}, there lived a wonderful character named ${c} who loved ${theme || 'discovering new things'}.\n\nEvery day, ${c} would explore the beautiful world around them, learning something new with each adventure. One day, ${c} found a mysterious path that no one had ever noticed before.\n\nFull of curiosity, ${c} followed the path and discovered a hidden garden filled with the most amazing things — talking flowers, dancing butterflies, and a wise old tree that told the most wonderful stories.\n\n"Welcome, ${c}!" said the tree. "You found this place because you have a kind heart and a curious mind."\n\n${c} spent the whole day learning and playing, and when it was time to go home, the tree whispered, "Remember, the greatest adventures start with curiosity and kindness."\n\nAnd from that day on, ${c} saw magic everywhere they looked, because they knew the secret — wonder is all around us if we just look closely enough.`;

function generateStory(character, setting, theme) {
  const c = character || 'Alex';
  const s = setting || 'a magical land';
  const key = (theme || '').toLowerCase();
  const generator = storyTemplates[key];
  return generator ? generator(c, s) : defaultTemplate(c, s, theme);
}

// ── Routes ─────────────────────────────────────────────────────────────

// Generate story
app.post('/api/story/generate', (req, res) => {
  const { character, setting, theme, prompt } = req.body;

  if (!character && !prompt) {
    return res.status(400).json({ error: 'Character name or prompt is required' });
  }

  const story = generateStory(
    character || 'A brave hero',
    setting || 'a magical land',
    theme || 'adventure'
  );

  res.json({
    story,
    theme: theme || 'adventure',
    generatedAt: new Date().toISOString(),
  });
});

// Generate quiz from story text
app.post('/api/quiz/generate', (req, res) => {
  const { storyText } = req.body;
  if (!storyText || typeof storyText !== 'string') {
    return res.status(400).json({ error: 'storyText is required' });
  }

  const sentences = storyText.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = storyText.split(/\s+/).filter(w => w.length > 3 && /^[a-zA-Z]+$/.test(w));

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)] || 'story';
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const questions = [
    {
      question: 'What is this story mainly about?',
      options: shuffle(['An exciting adventure', 'A cooking recipe', 'A math lesson', 'A history textbook']),
      correctAnswer: 0,
    },
    {
      question: `Which word appeared in the story?`,
      options: shuffle([pickRandom(words), 'Xylophone', 'Zodiac', 'Quantum']),
      correctAnswer: 0,
    },
    {
      question: 'What kind of story is this?',
      options: shuffle(["A children's tale", 'A news article', 'A science paper', 'A phone manual']),
      correctAnswer: 0,
    },
  ];

  // Fix correctAnswer after shuffle
  questions.forEach(q => {
    const correct = q.options[q.correctAnswer];
    q.correctAnswer = q.options.indexOf(correct);
  });

  res.json({ questions });
});

// Start server
app.listen(PORT, () => {
  console.log(`Kids Talebook Backend running on port ${PORT}`);
});
