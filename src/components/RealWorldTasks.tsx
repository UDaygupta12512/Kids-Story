import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Award, ArrowRight, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export function RealWorldTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Build a paper bridge", description: "Use only paper and tape. Can it hold a toy car?", completed: false, reflection: "" },
    { id: 2, title: "Observe plants for 2 days", description: "Pick a plant. Notice how it changes in morning vs evening.", completed: false, reflection: "" }
  ]);
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [reflectionInput, setReflectionInput] = useState("");

  const handleComplete = (id: number) => {
    setActiveTask(id);
  };

  const submitReflection = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true, reflection: reflectionInput } : t));
    setActiveTask(null);
    setReflectionInput("");
    // In a real app, we would adapt next tasks based on this reflection
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Leaf className="w-8 h-8 text-kids-green" />
        <h2 className="text-3xl font-bold text-kids-green">Real-World Task Generator</h2>
      </div>
      <p className="text-gray-600 mb-6">Bridge digital learning with real-world exploration! Complete offline activities and tell us what you learned.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => (
          <Card key={task.id} className={`border-2 ${task.completed ? 'border-kids-green/50 bg-green-50' : 'border-kids-orange/20'} overflow-hidden`}>
            <CardHeader className={`${task.completed ? 'bg-kids-green/10' : 'bg-kids-orange/10'}`}>
              <CardTitle className={`flex items-center gap-2 ${task.completed ? 'text-kids-green' : 'text-kids-orange'}`}>
                {task.completed ? <Award className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                {task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">{task.description}</p>
              
              {!task.completed && activeTask !== task.id && (
                <Button 
                  onClick={() => handleComplete(task.id)}
                  className="w-full bg-gradient-to-r from-kids-orange to-pink-500 hover:from-kids-orange/90 text-white"
                >
                  I Did This! <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {activeTask === task.id && (
                <div className="space-y-4 animate-fade-in bg-white p-4 rounded-lg border-2 border-kids-orange/20">
                  <div className="flex items-center gap-2 text-kids-purple font-bold">
                    <MessageCircle className="w-4 h-4" />
                    What did you learn?
                  </div>
                  <Input 
                    placeholder="e.g., The paper was stronger when folded..."
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    className="border-kids-purple/30"
                  />
                  <Button 
                    onClick={() => submitReflection(task.id)}
                    className="w-full bg-kids-purple hover:bg-kids-purple/90"
                    disabled={!reflectionInput.trim()}
                  >
                    Save Reflection
                  </Button>
                </div>
              )}

              {task.completed && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-kids-green/30">
                  <p className="text-sm font-semibold text-kids-green mb-1">Your Reflection:</p>
                  <p className="text-gray-700 italic">"{task.reflection}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {tasks.every(t => t.completed) && (
        <div className="mt-4 p-6 bg-gradient-to-r from-kids-blue/10 to-kids-purple/10 rounded-xl text-center border-2 border-kids-blue/20">
          <h3 className="font-bold text-xl text-kids-blue mb-2">Great job exploring!</h3>
          <p className="text-gray-600">Based on your answers, we're preparing new tasks that involve building and structural thinking!</p>
        </div>
      )}
    </div>
  );
}
