import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy, Star, Award } from "lucide-react";

interface StoryQuizAIProps {
  storyText: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

function shuffleWithCorrect(correct: string, distractors: string[]): { options: string[]; correctAnswer: number } {
  // Pad with generic fallbacks if fewer than 3 distractors provided to avoid undefined options
  const fallbacks = ["Something else happened", "A different character appeared", "In another location entirely"];
  const filled = [...distractors, ...fallbacks].filter(d => d !== correct).slice(0, 3);
  const correctIdx = Math.floor(Math.random() * 4);
  const options = [...filled];
  options.splice(correctIdx, 0, correct);
  return { options: options.slice(0, 4), correctAnswer: correctIdx };
}

function generateFallbackQuiz(storyText: string): Question[] {
  const sentences = storyText.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [storyText];
  const words = storyText.split(/\s+/).filter(w => w.length > 3);
  
  // Extract potential character names
  const ignoreWords = new Set(['Once', 'Upon', 'Time', 'There', 'Then', 'They', 'That', 'This', 'With', 'From', 'After', 'Before', 'Every', 'Some', 'Long', 'Deep', 'When', 'What', 'Where', 'Moral', 'Their', 'About', 'Could', 'Would', 'Should', 'Very', 'Much', 'Just', 'Like', 'Into', 'Over', 'Also', 'Each', 'More', 'Most', 'Your', 'Back', 'Down', 'Step', 'Even', 'Still', 'Both', 'Such', 'Only', 'Suddenly', 'Together', 'Finally', 'Instead', 'Without']);
  const capitalWords = storyText.match(/\b[A-Z][a-z]{2,}\b/g)?.filter(w => !ignoreWords.has(w)) || [];
  const charName = capitalWords.length > 0 ? capitalWords[0] : null;
  
  // Extract potential settings/locations
  const settingWords = ['forest', 'castle', 'garden', 'kingdom', 'village', 'mountain', 'ocean', 'cave', 'island', 'city', 'house', 'school', 'farm', 'lake', 'river', 'land', 'world', 'palace', 'meadow', 'valley', 'space', 'ship', 'planet', 'beach', 'desert'];
  const lowerStory = storyText.toLowerCase();
  const foundSetting = settingWords.find(s => lowerStory.includes(s));
  
  // Extract adjectives/descriptors
  const adjectives = ['brave', 'magical', 'kind', 'friendly', 'clever', 'wise', 'curious', 'little', 'young', 'old', 'big', 'small', 'happy', 'beautiful', 'mysterious', 'enchanted', 'gentle', 'exciting', 'fun', 'wonderful', 'amazing', 'special'];
  const foundAdj = adjectives.filter(a => lowerStory.includes(a));
  
  // Check for moral
  const moralMatch = storyText.match(/[Mm]oral:\s*(.+)/);
  
  const questions: Question[] = [];
  
  // Q1: Main character
  if (charName) {
    const fakeNames = ['Oliver', 'Sophie', 'Max', 'Luna', 'Finn', 'Ruby', 'Leo', 'Ivy'].filter(n => n !== charName);
    const shuffled = fakeNames.sort(() => Math.random() - 0.5).slice(0, 3);
    const { options, correctAnswer } = shuffleWithCorrect(charName, shuffled);
    questions.push({
      question: "Who is the main character in this story?",
      options,
      correctAnswer,
      explanation: `${charName} is the main character mentioned throughout the story.`
    });
  } else {
    const beginning = sentences[0] || '';
    const wordsInFirst = beginning.split(/\s+/).slice(0, 5).join(' ');
    const { options, correctAnswer } = shuffleWithCorrect(
      `With "${wordsInFirst}..."`,
      ["With a scary storm", "In a busy city", "At a school playground"]
    );
    questions.push({
      question: "How does the story begin?",
      options,
      correctAnswer,
      explanation: `The story starts with: "${beginning.substring(0, 60)}..."`
    });
  }
  
  // Q2: Setting
  if (foundSetting) {
    const otherSettings = settingWords.filter(s => s !== foundSetting).sort(() => Math.random() - 0.5).slice(0, 3);
    const { options, correctAnswer } = shuffleWithCorrect(
      `In a ${foundSetting}`,
      otherSettings.map(s => `In a ${s}`)
    );
    questions.push({
      question: "Where does the main part of the story take place?",
      options,
      correctAnswer,
      explanation: `The story takes place in a ${foundSetting}, as described in the text.`
    });
  }
  
  // Q3: Story mood/tone
  if (foundAdj.length > 0) {
    const mainAdj = foundAdj[0];
    const wrongAdj = ['scary', 'angry', 'boring', 'confusing', 'lonely', 'sad'].filter(a => !foundAdj.includes(a)).sort(() => Math.random() - 0.5).slice(0, 3);
    const { options, correctAnswer } = shuffleWithCorrect(
      mainAdj.charAt(0).toUpperCase() + mainAdj.slice(1),
      wrongAdj.map(o => o.charAt(0).toUpperCase() + o.slice(1))
    );
    questions.push({
      question: "Which word best describes the feeling of this story?",
      options,
      correctAnswer,
      explanation: `The story has a "${mainAdj}" tone, as shown by the descriptions used.`
    });
  }
  
  // Q4: Story detail question
  const midSentence = sentences[Math.floor(sentences.length / 2)] || '';
  if (midSentence.length > 20) {
    const correctText = midSentence.length > 60 ? midSentence.substring(0, 57) + '...' : midSentence;
    const { options, correctAnswer } = shuffleWithCorrect(
      correctText,
      ["The character falls asleep", "A villain appears from nowhere", "Everyone goes home early"]
    );
    questions.push({
      question: `What happens in the middle of the story?`,
      options,
      correctAnswer,
      explanation: `In the middle of the story: "${midSentence.substring(0, 80)}..."`
    });
  }
  
  // Q5: Moral/ending
  if (moralMatch) {
    const moralText = moralMatch[1].substring(0, 60) + (moralMatch[1].length > 60 ? '...' : '');
    const { options, correctAnswer } = shuffleWithCorrect(
      moralText,
      ["Always run from problems", "Money is the most important thing", "Never trust anyone"]
    );
    questions.push({
      question: "What is the moral or lesson of this story?",
      options,
      correctAnswer,
      explanation: `The story teaches: "${moralMatch[1].substring(0, 80)}"`
    });
  } else {
    const lastSentence = sentences[sentences.length - 1] || '';
    const correctEnd = lastSentence.length > 60 ? lastSentence.substring(0, 57) + '...' : lastSentence;
    const { options: endOptions, correctAnswer: endCorrect } = shuffleWithCorrect(
      correctEnd,
      ["The characters got lost forever", "A storm destroyed everything", "Nobody could remember what happened"]
    );
    questions.push({
      question: "How does the story end?",
      options: endOptions,
      correctAnswer: endCorrect,
      explanation: `The story ends with: "${lastSentence.substring(0, 80)}"`
    });
  }
  
  return questions.slice(0, 5);
}

const StoryQuizAI = ({ storyText }: StoryQuizAIProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { storyText }
      });

      if (error) throw error;
      if (!data?.questions?.length) throw new Error('No questions returned');

      setQuestions(data.questions);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizComplete(false);
      
      toast({
        title: "Quiz Ready! 🎯",
        description: "Answer all questions to earn rewards!",
      });
    } catch (error) {
      console.error('AI quiz failed, using fallback:', error);
      // Fallback to client-side quiz generation
      const fallbackQuestions = generateFallbackQuiz(storyText);
      if (fallbackQuestions.length > 0) {
        setQuestions(fallbackQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuizComplete(false);
        toast({
          title: "Quiz Ready! 🎯",
          description: "Answer the questions to test your understanding!",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not generate quiz. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "+10 points!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Keep trying! You're learning!",
        variant: "destructive",
      });
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! You're a story master! 🏆";
    if (percentage >= 80) return "Excellent work! You understood the story well! ⭐";
    if (percentage >= 60) return "Good job! Keep reading and learning! 📚";
    return "Nice try! Want to read the story again? 💪";
  };

  if (questions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            AI Story Comprehension Quiz
          </CardTitle>
          <CardDescription>
            Test your understanding of the story with AI-generated questions!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateQuiz} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              "Start Quiz"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizComplete) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">
              {score}/{questions.length}
            </div>
            <p className="text-lg font-semibold">{getScoreMessage()}</p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < Math.floor((score / questions.length) * 5)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={generateQuiz} className="w-full">
            Try Another Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Score: {score}
          </Badge>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={
                showExplanation
                  ? index === question.correctAnswer
                    ? "default"
                    : index === selectedAnswer
                    ? "destructive"
                    : "outline"
                  : selectedAnswer === index
                  ? "secondary"
                  : "outline"
              }
              className="w-full text-left justify-start h-auto py-4 px-6"
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>

        {showExplanation && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm">
                <span className="font-semibold">Explanation: </span>
                {question.explanation}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryQuizAI;
