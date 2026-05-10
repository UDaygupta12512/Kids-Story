import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Target, TrendingUp } from "lucide-react";

const radarData = [
  { subject: 'Reading Level', A: 85, fullMark: 100 },
  { subject: 'Logic', A: 70, fullMark: 100 },
  { subject: 'Creativity', A: 95, fullMark: 100 },
  { subject: 'Consistency', A: 80, fullMark: 100 },
  { subject: 'Vocabulary', A: 75, fullMark: 100 },
];

const progressData = [
  { name: 'Week 1', reading: 40, logic: 24, creativity: 50 },
  { name: 'Week 2', reading: 50, logic: 35, creativity: 60 },
  { name: 'Week 3', reading: 65, logic: 40, creativity: 75 },
  { name: 'Week 4', reading: 85, logic: 70, creativity: 95 },
];

export function SkillTracker() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-8 h-8 text-kids-purple" />
        <h2 className="text-3xl font-bold text-kids-purple">Skill Tracker Dashboard</h2>
      </div>
      <p className="text-gray-600 mb-6">Track progress over time, discover strengths, and identify areas for growth.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-kids-blue/20">
          <CardHeader>
            <CardTitle className="text-kids-blue flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progress Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reading" stroke="#3b82f6" strokeWidth={3} name="Reading Level" />
                  <Line type="monotone" dataKey="logic" stroke="#f59e0b" strokeWidth={3} name="Logical Thinking" />
                  <Line type="monotone" dataKey="creativity" stroke="#8b5cf6" strokeWidth={3} name="Creativity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-kids-orange/20">
          <CardHeader>
            <CardTitle className="text-kids-orange flex items-center gap-2">
              <Target className="w-5 h-5" />
              Strengths & Areas to Grow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current Skills" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {['Reading Level', 'Logical Thinking', 'Creativity', 'Consistency'].map((skill, i) => (
          <div key={skill} className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm text-center">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">{skill}</h4>
            <div className="text-2xl font-bold bg-gradient-to-r from-kids-purple to-kids-blue bg-clip-text text-transparent">
              {['Excellent', 'Growing', 'Outstanding', 'On Track'][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
