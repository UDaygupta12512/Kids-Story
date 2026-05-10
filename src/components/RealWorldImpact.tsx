import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, CheckCircle, Circle, ArrowRight } from 'lucide-react';

const CHALLENGES = [
  { id: 1, theme: 'kindness', story: 'Leo the Lion shared his lunch with a hungry squirrel.', mission: 'Help someone at home today.' },
  { id: 2, theme: 'bravery', story: 'Mia the Mouse stood up to the loud thunderstorm.', mission: 'Try something new that scares you a little.' },
  { id: 3, theme: 'patience', story: 'Toby the Turtle waited all day for the magic flower to bloom.', mission: 'Wait your turn without complaining today.' }
];

export function RealWorldImpact() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [missionStatus, setMissionStatus] = useState<'pending' | 'completed' | 'failed' | null>(null);
  const [showNextStory, setShowNextStory] = useState(false);
  
  useEffect(() => {
    const savedIndex = localStorage.getItem('realWorldChallengeIndex');
    const savedStatus = localStorage.getItem('realWorldMissionStatus');
    if (savedIndex) setCurrentChallengeIndex(parseInt(savedIndex));
    if (savedStatus) setMissionStatus(savedStatus as any);
  }, []);

  const saveState = (index: number, status: string | null) => {
    localStorage.setItem('realWorldChallengeIndex', index.toString());
    if (status) localStorage.setItem('realWorldMissionStatus', status);
    else localStorage.removeItem('realWorldMissionStatus');
  };

  const handleCompleteMission = (completed: boolean) => {
    const status = completed ? 'completed' : 'failed';
    setMissionStatus(status);
    saveState(currentChallengeIndex, status);
    setShowNextStory(true);
  };

  const currentChallenge = CHALLENGES[Math.min(currentChallengeIndex, CHALLENGES.length - 1)];

  const startNextChallenge = () => {
    const nextIndex = Math.min(currentChallengeIndex + 1, CHALLENGES.length - 1);
    setCurrentChallengeIndex(nextIndex);
    setMissionStatus(null);
    setShowNextStory(false);
    saveState(nextIndex, null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-kids-purple/20 bg-white/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-kids-purple">
            <Heart className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Real-World Impact Stories</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Stories are not just stories—they influence real-world habits! Read today's story and take on the real-world mission.
          </p>

          <div className="bg-kids-purple/10 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-kids-purple mb-2">Today's Theme: {currentChallenge.theme}</h3>
            <p className="text-lg italic text-gray-800 border-l-4 border-kids-purple pl-4 my-4">
              "{currentChallenge.story}"
            </p>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-kids-purple/20">
              <h4 className="font-bold text-kids-purple mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Today's Mission
              </h4>
              <p className="text-gray-700 text-lg font-medium">{currentChallenge.mission}</p>
            </div>
          </div>

          {!missionStatus ? (
            <div className="mt-8 text-center space-y-4">
              <h4 className="text-xl font-bold text-gray-800">Next Session: Did you do it?</h4>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => handleCompleteMission(true)}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle className="w-6 h-6" /> Yes, I did!
                </Button>
                <Button 
                  onClick={() => handleCompleteMission(false)}
                  variant="outline"
                  className="gap-2 text-lg py-6 px-8 rounded-full border-2"
                >
                  <Circle className="w-6 h-6" /> Not yet...
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 animate-fade-in border-t-2 border-dashed border-gray-200 pt-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                {missionStatus === 'completed' ? '🌟 Amazing job!' : '🌱 That is okay!'}
              </h4>
              <p className="text-gray-700 text-lg mb-6 p-4 bg-gray-50 rounded-lg">
                {missionStatus === 'completed' 
                  ? `Because you completed your mission, ${currentChallenge.theme} spread through the kingdom! Your character's next adventure will be even brighter.` 
                  : `Even heroes need a break. Next time you read a story, you can try again to bring ${currentChallenge.theme} into the real world.`}
              </p>
              
              <Button 
                onClick={startNextChallenge}
                className="w-full bg-gradient-to-r from-kids-purple to-kids-blue text-white py-6 rounded-xl text-lg gap-2"
              >
                Start Next Story Challenge <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
