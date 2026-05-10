
import { useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Star, Sparkles, Trophy } from "lucide-react";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

type StoryQuizProps = {
  storyText: string;
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

const rewardBadges = [
  "🌟 Quiz Star",
  "🏆 Story Champ",
  "🔥 Focus Streak",
  "📚 Word Wizard",
  "🎯 Sharp Thinker",
];

const achievementPool = [
  "Quiz Explorer",
  "Accuracy Apprentice",
  "Story Sleuth",
  "Perfect Score",
  "Curiosity Builder",
];

const getProgress = (): ProgressState => {
  const saved = localStorage.getItem("kidProgress");
  if (!saved) return progressDefaults;
  try {
    return { ...progressDefaults, ...JSON.parse(saved) } as ProgressState;
  } catch {
    return progressDefaults;
  }
};

const saveProgress = (data: ProgressState) => {
  localStorage.setItem("kidProgress", JSON.stringify(data));
};

export function StoryQuiz({ storyText }: StoryQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [rewardApplied, setRewardApplied] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [achievementsAdded, setAchievementsAdded] = useState<string[]>([]);

  // Helpers for randomness and uniqueness
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const sample = <T,>(array: T[], n: number): T[] => {
    const arr = [...array];
    const res: T[] = [];
    while (res.length < n && arr.length) {
      const idx = Math.floor(Math.random() * arr.length);
      res.push(arr.splice(idx, 1)[0]);
    }
    return res;
  };

  const unique = <T,>(array: T[]): T[] => Array.from(new Set(array));

  const makeMCQ = (question: string, correct: string, distractorPool: string[]): QuizQuestion => {
    const pool = unique(distractorPool.filter((d) => d && d !== correct));
    const distractors = sample(pool, 3);
    const options = shuffle([correct, ...distractors]);
    const correctAnswer = options.indexOf(correct);
    return { question, options, correctAnswer };
  };

  // Extract key elements from the story for dynamic question generation
  const extractStoryElements = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Extract potential characters (capitalized words that aren't at sentence start)
    const characters = text.match(/\b[A-Z][a-z]+\b/g)?.filter((word, index, arr) => 
      arr.indexOf(word) === index && 
      !['Once', 'The', 'A', 'An', 'In', 'At', 'On', 'With', 'From'].includes(word)
    ) || [];
    
    // Extract locations and settings
    const locationWords = ['kingdom', 'forest', 'castle', 'garden', 'house', 'village', 'mountain', 'sea', 'cave'];
    const settings = locationWords.filter(word => text.toLowerCase().includes(word));
    
    // Extract actions and themes
    const actionWords = ['adventure', 'journey', 'explore', 'discover', 'help', 'save', 'find', 'learn'];
    const themes = actionWords.filter(word => text.toLowerCase().includes(word));
    
    return { characters, settings, themes, sentences, words };
  };

  // Generate dynamic quiz questions based on story content
  const generateQuestions = (): QuizQuestion[] => {
    if (!storyText) return [];

    const { characters, settings, themes, sentences, words } = extractStoryElements(storyText);

    const genericCharacters = ['Princess Aurora', 'Captain Adventure', 'Wizard Merlin', 'Brave Knight', 'Curious Fox', 'Sunny the Dolphin'];
    const genericSettings = ['forest', 'castle', 'village', 'mountain', 'garden', 'beach', 'space station', 'underwater city'];
    const genericWords = ['spaceship', 'robot', 'volcano', 'pirate', 'dinosaur', 'rocket', 'treasure', 'dragon'];

    const qs: QuizQuestion[] = [];

    // Q1: Main character (randomized)
    if (characters.length || genericCharacters.length) {
      const mainCharacter = (characters.length ? sample(characters, 1)[0] : sample(genericCharacters, 1)[0]) as string;
      const distractorPool = unique([...(characters.filter((c) => c !== mainCharacter)), ...genericCharacters]);
      qs.push(
        makeMCQ('Who is the main character in this story?', mainCharacter, distractorPool)
      );
    }

    // Q2: Setting (randomized wording and options)
    if (settings.length || genericSettings.length) {
      const setting = (settings.length ? sample(settings, 1)[0] : sample(genericSettings, 1)[0]) as string;
      const distractorPool = unique([...(settings.filter((s) => s !== setting)), ...genericSettings]);
      const correctText = `In a magical ${setting}`;
      const distractorTexts = distractorPool.map((s) => `In a magical ${s}`);
      qs.push(
        makeMCQ('Where does the story take place?', correctText, distractorTexts)
      );
    }

    // Q3: Theme (randomized correct index and option order)
    const storyLower = storyText.toLowerCase();
    const themeOptions = ['Adventure and discovery', 'Love and friendship', 'Magic and wonder', 'Learning and growth'];
    let correctTheme = 'Adventure and discovery';
    if (storyLower.includes('friend') || storyLower.includes('help')) {
      correctTheme = 'Love and friendship';
    } else if (storyLower.includes('magic') || storyLower.includes('magical')) {
      correctTheme = 'Magic and wonder';
    } else if (storyLower.includes('learn') || storyLower.includes('discover')) {
      correctTheme = 'Learning and growth';
    }
    qs.push(
      makeMCQ('What is the main theme of this story?', correctTheme, themeOptions.filter((o) => o !== correctTheme))
    );

    // Q4: Comprehension (word presence)
    const candidateWords = unique(words.filter((w) => w.length > 4));
    const correctWord = (candidateWords.length ? sample(candidateWords, 1)[0] : 'friendship') as string;
    const absentPool = genericWords.filter((w) => !words.includes(w));
    qs.push(
      makeMCQ('Which of these appears in the story?', correctWord, absentPool)
    );

    // Shuffle question order and cap to 4
    return shuffle(qs).slice(0, 4);
  };
  const [nonce, setNonce] = useState(0);
  const questions = useMemo(() => generateQuestions(), [storyText, nonce]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setRewardApplied(false);
    setEarnedBadges([]);
    setAchievementsAdded([]);
    setNonce((n) => n + 1); // force fresh question generation
  };

  useEffect(() => {
    if (!quizCompleted || rewardApplied) return;

    const percentage = Math.round((score / questions.length) * 100);
    const isExcellent = percentage === 100;
    const xpGain = Math.max(10, score * 10);
    const newAchievements = [
      achievementPool[score % achievementPool.length],
      ...(isExcellent ? ["Perfect Score"] : []),
    ];
    const badges = rewardBadges.slice(0, Math.max(2, Math.ceil(score / 2)));

    const progress = getProgress();
    const updated: ProgressState = {
      ...progress,
      completionPercent: Math.min(100, progress.completionPercent + Math.round((percentage / 100) * 10)),
      streak: progress.streak + 1,
      totalXp: progress.totalXp + xpGain,
      level: Math.max(1, Math.floor((progress.totalXp + xpGain) / 100)),
      lesson: progress.lesson + 1,
      recentAchievements: Array.from(new Set([...newAchievements, ...progress.recentAchievements])).slice(0, 5),
    };
    saveProgress(updated);
    setEarnedBadges(badges);
    setAchievementsAdded(newAchievements);
    setRewardApplied(true);
  }, [quizCompleted, rewardApplied, score, questions.length]);

  if (!storyText) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-300">
        <CardContent className="p-8 text-center">
          <div className="mb-4 text-6xl">📚</div>
          <p className="text-lg text-purple-600 font-semibold mb-2">
            Create Your Story First!
          </p>
          <p className="text-gray-600">
            Generate a magical story to unlock personalized quiz questions
          </p>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isExcellent = percentage === 100;
    const isGood = percentage >= 75;
    
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {isExcellent ? (
              <Trophy className="text-yellow-500 animate-bounce" size={64} />
            ) : isGood ? (
              <Star className="text-yellow-500 animate-pulse" size={64} />
            ) : (
              <Sparkles className="text-purple-500" size={64} />
            )}
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Quiz Complete! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="relative">
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text">
              {score}/{questions.length}
            </div>
            <div className="text-lg text-gray-600 mt-2">
              {percentage}% Correct!
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <p className="text-lg font-semibold text-gray-800">
              {isExcellent 
                ? "🌟 Perfect! You understood every detail of the story!" 
                : isGood 
                  ? "🎯 Excellent! You really paid attention to the story!" 
                  : percentage >= 50
                    ? "👍 Good job! You got the main ideas!"
                    : "📖 Keep reading! Every story teaches us something new!"}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-inner space-y-3">
            <p className="text-sm font-semibold text-gray-700">Badges Unlocked</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {earnedBadges.map((badge) => (
                <Badge key={badge} className="bg-kids-purple/10 text-kids-purple border border-kids-purple/20">
                  {badge}
                </Badge>
              ))}
            </div>
            {achievementsAdded.length > 0 && (
              <p className="text-xs text-gray-500">Achievements added: {achievementsAdded.join(", ")}.</p>
            )}
          </div>
          
          <Button 
            onClick={resetQuiz} 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Sparkles className="mr-2" size={20} />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles size={28} />
            Story Quiz
            <Sparkles size={28} />
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetQuiz}
            className="text-white/90 border-white/30 hover:bg-white/10"
            aria-label="Generate a new quiz"
          >
            New Quiz
          </Button>
        </div>
        <div className="text-center text-blue-100 font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-inner border-l-4 border-purple-400">
          <h3 className="text-xl font-bold mb-4 text-gray-800 leading-relaxed">
            {questions[currentQuestion]?.question}
          </h3>
        </div>
        
        <div className="space-y-3">
          {questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedAnswer === index 
                  ? showResult 
                    ? index === questions[currentQuestion].correctAnswer
                      ? "border-green-400 bg-green-50 text-green-800 shadow-lg"
                      : "border-red-400 bg-red-50 text-red-800 shadow-lg"
                    : "border-purple-400 bg-purple-50 text-purple-800 shadow-md"
                  : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {showResult && selectedAnswer === index && (
                  <div className="animate-scale-in">
                    {index === questions[currentQuestion].correctAnswer ? (
                      <CheckCircle className="text-green-500 animate-bounce" size={24} />
                    ) : (
                      <XCircle className="text-red-500 animate-pulse" size={24} />
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <Button 
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null || showResult}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg disabled:hover:scale-100 disabled:shadow-none"
        >
          {showResult ? (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="animate-spin" size={20} />
              {currentQuestion === questions.length - 1 ? "Calculating Results..." : "Loading Next Question..."}
            </div>
          ) : (
            currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"
          )}
        </Button>
        
        {showResult && (
          <div className="text-center text-sm text-gray-600 animate-fade-in">
            {selectedAnswer === questions[currentQuestion].correctAnswer ? 
              "🎉 Correct! Great job!" : 
              "📚 That's okay! Every mistake helps us learn!"
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
