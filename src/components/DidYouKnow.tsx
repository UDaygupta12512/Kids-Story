import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const facts = [
  {
    category: "Spelling",
    badge: "💭 Word Wonder",
    text: "\"Dreamt\" is the only common English word that ends in the letters \"mt\".",
  },
  {
    category: "Sounds",
    badge: "🎵 Sound Science",
    text: "The letter Q is almost always followed by U in English words.",
  },
  {
    category: "Meaning",
    badge: "🧠 Word Sense",
    text: "\"Bookkeeper\" is the only common word with three double letters in a row.",
  },
  {
    category: "Story",
    badge: "✨ Story Spark",
    text: "\"Once upon a time\" appears in folktales worldwide, not just in English.",
  },
  {
    category: "Letters",
    badge: "🔤 Letter Lab",
    text: "The longest English word without a vowel is \"rhythms\".",
  },
];

export function DidYouKnow() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFactIndex((current) => (current + 1) % facts.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const fact = facts[factIndex];

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="border-2 border-kids-blue/20 bg-gradient-to-r from-blue-50 via-white to-kids-purple/10 shadow-md">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl text-kids-blue">Did You Know?</CardTitle>
              <p className="text-sm text-gray-600">{fact.category}</p>
            </div>
            <Badge className="bg-white text-kids-blue border border-kids-blue/20">{fact.badge}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700">
              <span className="text-2xl mr-2">💭</span>
              {fact.text}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
