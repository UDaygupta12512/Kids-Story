import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, User, Lightbulb } from 'lucide-react';

const QUESTIONS = [
  "Why do stars shine?",
  "What happens if gravity disappears?",
  "Why is the sky blue?",
  "How do birds know where to fly when it gets cold?",
  "Where do dreams come from?"
];

type Message = { role: 'ai' | 'user'; text: string; };

export function CuriosityEngine() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('curiosityScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hi there! Let's think together! ${QUESTIONS[0]}` }
  ]);
  const [inputValue, setInputValue] = useState("");

  const updateScore = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    localStorage.setItem('curiosityScore', newScore.toString());
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessages: Message[] = [...messages, { role: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setTimeout(() => {
      let aiResponse = "";
      const text = inputValue.toLowerCase();
      if (text.includes("i don't know") || text.includes("idk")) {
        aiResponse = "That's perfectly okay! Wondering is the first step. Think about what a star is made of. Is it solid like rock, or something else?";
      } else if (text.includes("gas") || text.includes("fire") || text.includes("hot")) {
        aiResponse = "You're on the right track! Stars are made of very hot gas. When things get incredibly hot, what happens? How does that create the light we see?";
      } else {
        aiResponse = "That's an interesting thought! What makes you think that? Let's explore more: think about how a lightbulb works, or how a fire glows when it's really hot. Could stars be similar?";
      }
      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
      updateScore(text.includes('why') || text.includes('how') ? 15 : 10);
    }, 1000);
  };

  const nextQuestion = () => {
    const nextIdx = (currentQuestionIndex + 1) % QUESTIONS.length;
    setCurrentQuestionIndex(nextIdx);
    setMessages([{ role: 'ai', text: `Here is a new mystery: ${QUESTIONS[nextIdx]}` }]);
    updateScore(5); // points for seeking new questions
  };

  return (
    <Card className="border-2 border-kids-purple/30 bg-gradient-to-b from-purple-50 to-white shadow-xl max-w-3xl mx-auto overflow-hidden">
      <CardHeader className="bg-kids-purple/10 border-b border-kids-purple/20">
        <CardTitle className="text-2xl font-bold text-kids-purple flex items-center justify-between">
          <div className="flex items-center gap-2"><Brain className="w-8 h-8 animate-pulse text-kids-purple" /> AI Curiosity Engine</div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Curiosity Score</span>
              <span className="text-xl font-black text-kids-orange">{score} 🌟</span>
            </div>
            <Button variant="outline" size="sm" onClick={nextQuestion}><Lightbulb className="w-4 h-4 mr-2" /> New Question</Button>
          </div>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">Instead of just giving answers, I'll help you think and discover the answers yourself!</p>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'ai' ? 'bg-kids-purple text-white' : 'bg-kids-blue text-white'}`}>
                {msg.role === 'ai' ? <Brain size={20} /> : <User size={20} />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'ai' ? 'bg-white border-2 border-kids-purple/20 rounded-tl-none text-gray-800' : 'bg-kids-blue text-white rounded-tr-none'}`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-4">
        <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your thoughts here..." className="flex-1 rounded-full border-2 focus-visible:ring-kids-purple text-lg" />
          <Button type="submit" size="icon" className="rounded-full bg-kids-purple w-12 h-12 hover:bg-kids-purple/90 shrink-0 text-white"><Send className="w-5 h-5" /></Button>
        </form>
      </CardFooter>
    </Card>
  );
}
