import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { ChildPersonalityEngine } from "@/components/ChildPersonalityEngine";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-kids-purple/5 via-white to-kids-blue/5">
      <Header />

      <main className="py-16 px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <BackButton />

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-kids-purple to-kids-blue bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-lg text-gray-600">
              Personalize learning, track progress, and celebrate achievements.
            </p>
          </div>

          <ChildPersonalityEngine />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
