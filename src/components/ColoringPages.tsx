
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Palette, Eye } from "lucide-react";

// SVG coloring page templates as inline data URIs
const coloringPageSVGs: Record<string, string> = {
  castle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="white"/>
    <text x="200" y="30" text-anchor="middle" font-size="16" font-family="Arial" fill="#888">Magical Castle - Coloring Page</text>
    <!-- Ground -->
    <line x1="0" y1="340" x2="400" y2="340" stroke="black" stroke-width="2"/>
    <path d="M50 340 Q200 360 350 340" stroke="black" fill="none" stroke-width="1.5"/>
    <!-- Castle body -->
    <rect x="100" y="200" width="200" height="140" fill="none" stroke="black" stroke-width="2.5" rx="3"/>
    <!-- Castle door -->
    <path d="M175 340 L175 280 Q200 260 225 280 L225 340" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Door handle -->
    <circle cx="215" cy="310" r="4" fill="none" stroke="black" stroke-width="2"/>
    <!-- Windows -->
    <rect x="120" y="220" width="30" height="35" fill="none" stroke="black" stroke-width="2" rx="2"/>
    <line x1="135" y1="220" x2="135" y2="255" stroke="black" stroke-width="1.5"/>
    <line x1="120" y1="237" x2="150" y2="237" stroke="black" stroke-width="1.5"/>
    <rect x="250" y="220" width="30" height="35" fill="none" stroke="black" stroke-width="2" rx="2"/>
    <line x1="265" y1="220" x2="265" y2="255" stroke="black" stroke-width="1.5"/>
    <line x1="250" y1="237" x2="280" y2="237" stroke="black" stroke-width="1.5"/>
    <!-- Towers -->
    <rect x="70" y="140" width="60" height="200" fill="none" stroke="black" stroke-width="2.5"/>
    <rect x="270" y="140" width="60" height="200" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Tower roofs -->
    <polygon points="65,140 100,80 135,140" fill="none" stroke="black" stroke-width="2.5"/>
    <polygon points="265,140 300,80 335,140" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Center tower -->
    <rect x="160" y="120" width="80" height="80" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="155,120 200,60 245,120" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Flags -->
    <line x1="100" y1="80" x2="100" y2="50" stroke="black" stroke-width="2"/>
    <path d="M100 50 L125 58 L100 66" fill="none" stroke="black" stroke-width="2"/>
    <line x1="300" y1="80" x2="300" y2="50" stroke="black" stroke-width="2"/>
    <path d="M300 50 L325 58 L300 66" fill="none" stroke="black" stroke-width="2"/>
    <line x1="200" y1="60" x2="200" y2="25" stroke="black" stroke-width="2"/>
    <path d="M200 25 L230 35 L200 45" fill="none" stroke="black" stroke-width="2"/>
    <!-- Tower windows -->
    <circle cx="100" cy="180" r="12" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="300" cy="180" r="12" fill="none" stroke="black" stroke-width="2"/>
    <!-- Center window -->
    <circle cx="200" cy="150" r="14" fill="none" stroke="black" stroke-width="2"/>
    <!-- Stars -->
    <polygon points="50,50 53,42 60,42 55,37 57,30 50,34 43,30 45,37 40,42 47,42" fill="none" stroke="black" stroke-width="1.5"/>
    <polygon points="350,40 353,32 360,32 355,27 357,20 350,24 343,20 345,27 340,32 347,32" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Clouds -->
    <ellipse cx="320" cy="90" rx="30" ry="15" fill="none" stroke="black" stroke-width="1.5"/>
    <ellipse cx="340" cy="85" rx="20" ry="12" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Bushes -->
    <circle cx="60" cy="340" r="20" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="80" cy="335" r="18" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="340" cy="340" r="20" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="360" cy="335" r="15" fill="none" stroke="black" stroke-width="1.5"/>
  </svg>`,
  animals: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="white"/>
    <text x="200" y="25" text-anchor="middle" font-size="16" font-family="Arial" fill="#888">Friendly Animals - Coloring Page</text>
    <!-- Ground -->
    <path d="M0 330 Q100 320 200 330 Q300 340 400 330 L400 400 L0 400Z" fill="none" stroke="black" stroke-width="2"/>
    <!-- Cat -->
    <ellipse cx="100" cy="290" rx="35" ry="30" fill="none" stroke="black" stroke-width="2.5"/>
    <circle cx="100" cy="250" r="22" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Cat ears -->
    <polygon points="82,238 78,210 92,230" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="118,238 122,210 108,230" fill="none" stroke="black" stroke-width="2"/>
    <!-- Cat face -->
    <circle cx="92" cy="247" r="4" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="108" cy="247" r="4" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="100" cy="256" rx="3" ry="2" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Cat whiskers -->
    <line x1="75" y1="253" x2="90" y2="255" stroke="black" stroke-width="1.5"/>
    <line x1="75" y1="258" x2="90" y2="258" stroke="black" stroke-width="1.5"/>
    <line x1="110" y1="255" x2="125" y2="253" stroke="black" stroke-width="1.5"/>
    <line x1="110" y1="258" x2="125" y2="258" stroke="black" stroke-width="1.5"/>
    <!-- Cat tail -->
    <path d="M135 285 Q160 260 150 240" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Dog -->
    <ellipse cx="280" cy="285" rx="40" ry="35" fill="none" stroke="black" stroke-width="2.5"/>
    <circle cx="280" cy="240" r="25" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Dog ears -->
    <ellipse cx="258" cy="235" rx="12" ry="20" fill="none" stroke="black" stroke-width="2" transform="rotate(-15 258 235)"/>
    <ellipse cx="302" cy="235" rx="12" ry="20" fill="none" stroke="black" stroke-width="2" transform="rotate(15 302 235)"/>
    <!-- Dog face -->
    <circle cx="272" cy="237" r="4" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="288" cy="237" r="4" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="280" cy="250" rx="8" ry="5" fill="none" stroke="black" stroke-width="2"/>
    <path d="M280 255 L280 262" stroke="black" stroke-width="1.5"/>
    <!-- Dog tail -->
    <path d="M320 275 Q340 255 335 230" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Dog legs -->
    <line x1="260" y1="315" x2="260" y2="335" stroke="black" stroke-width="2.5"/>
    <line x1="300" y1="315" x2="300" y2="335" stroke="black" stroke-width="2.5"/>
    <!-- Butterfly -->
    <circle cx="200" cy="150" r="3" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="188" cy="145" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="212" cy="145" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="190" cy="158" rx="10" ry="8" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="210" cy="158" rx="10" ry="8" fill="none" stroke="black" stroke-width="2"/>
    <path d="M197 143 Q195 130 200 125" stroke="black" stroke-width="1.5" fill="none"/>
    <path d="M203 143 Q205 130 200 125" stroke="black" stroke-width="1.5" fill="none"/>
    <!-- Tree -->
    <rect x="185" y="200" width="10" height="130" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="190" cy="190" r="35" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="175" cy="180" r="25" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="210" cy="180" r="28" fill="none" stroke="black" stroke-width="2"/>
    <!-- Flowers -->
    <circle cx="50" cy="330" r="8" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="50" cy="316" r="5" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="42" cy="324" r="5" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="58" cy="324" r="5" fill="none" stroke="black" stroke-width="1.5"/>
    <line x1="50" y1="338" x2="50" y2="360" stroke="black" stroke-width="1.5"/>
    <circle cx="350" cy="325" r="8" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="350" cy="311" r="5" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="342" cy="319" r="5" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="358" cy="319" r="5" fill="none" stroke="black" stroke-width="1.5"/>
    <line x1="350" y1="333" x2="350" y2="360" stroke="black" stroke-width="1.5"/>
    <!-- Sun -->
    <circle cx="350" cy="60" r="25" fill="none" stroke="black" stroke-width="2"/>
    <line x1="350" y1="25" x2="350" y2="15" stroke="black" stroke-width="2"/>
    <line x1="375" y1="60" x2="385" y2="60" stroke="black" stroke-width="2"/>
    <line x1="371" y1="39" x2="378" y2="32" stroke="black" stroke-width="2"/>
    <line x1="371" y1="81" x2="378" y2="88" stroke="black" stroke-width="2"/>
    <line x1="329" y1="39" x2="322" y2="32" stroke="black" stroke-width="2"/>
  </svg>`,
  kitten: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="white"/>
    <text x="200" y="25" text-anchor="middle" font-size="16" font-family="Arial" fill="#888">Playful Kitten - Coloring Page</text>
    <!-- Big kitten head -->
    <circle cx="200" cy="200" r="80" fill="none" stroke="black" stroke-width="3"/>
    <!-- Ears -->
    <polygon points="140,145 125,80 165,130" fill="none" stroke="black" stroke-width="3"/>
    <polygon points="260,145 275,80 235,130" fill="none" stroke="black" stroke-width="3"/>
    <!-- Inner ears -->
    <polygon points="143,138 132,95 160,128" fill="none" stroke="black" stroke-width="1.5"/>
    <polygon points="257,138 268,95 240,128" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Eyes -->
    <ellipse cx="170" cy="190" rx="18" ry="20" fill="none" stroke="black" stroke-width="2.5"/>
    <circle cx="175" cy="188" r="8" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="178" cy="185" r="3" fill="none" stroke="black" stroke-width="1"/>
    <ellipse cx="230" cy="190" rx="18" ry="20" fill="none" stroke="black" stroke-width="2.5"/>
    <circle cx="225" cy="188" r="8" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="222" cy="185" r="3" fill="none" stroke="black" stroke-width="1"/>
    <!-- Nose -->
    <polygon points="200,215 193,225 207,225" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Mouth -->
    <path d="M193 225 Q185 240 175 235" fill="none" stroke="black" stroke-width="2"/>
    <path d="M207 225 Q215 240 225 235" fill="none" stroke="black" stroke-width="2"/>
    <!-- Whiskers -->
    <line x1="130" y1="215" x2="170" y2="220" stroke="black" stroke-width="2"/>
    <line x1="128" y1="225" x2="168" y2="225" stroke="black" stroke-width="2"/>
    <line x1="130" y1="235" x2="170" y2="230" stroke="black" stroke-width="2"/>
    <line x1="270" y1="215" x2="230" y2="220" stroke="black" stroke-width="2"/>
    <line x1="272" y1="225" x2="232" y2="225" stroke="black" stroke-width="2"/>
    <line x1="270" y1="235" x2="230" y2="230" stroke="black" stroke-width="2"/>
    <!-- Body -->
    <ellipse cx="200" cy="330" rx="60" ry="45" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Paws -->
    <ellipse cx="165" cy="365" rx="18" ry="10" fill="none" stroke="black" stroke-width="2"/>
    <ellipse cx="235" cy="365" rx="18" ry="10" fill="none" stroke="black" stroke-width="2"/>
    <!-- Paw lines -->
    <line x1="158" y1="360" x2="158" y2="370" stroke="black" stroke-width="1.5"/>
    <line x1="165" y1="360" x2="165" y2="370" stroke="black" stroke-width="1.5"/>
    <line x1="172" y1="360" x2="172" y2="370" stroke="black" stroke-width="1.5"/>
    <line x1="228" y1="360" x2="228" y2="370" stroke="black" stroke-width="1.5"/>
    <line x1="235" y1="360" x2="235" y2="370" stroke="black" stroke-width="1.5"/>
    <line x1="242" y1="360" x2="242" y2="370" stroke="black" stroke-width="1.5"/>
    <!-- Tail -->
    <path d="M260 320 Q300 290 290 260 Q280 240 300 230" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Yarn ball -->
    <circle cx="90" cy="340" r="25" fill="none" stroke="black" stroke-width="2"/>
    <path d="M70 330 Q90 350 110 330" fill="none" stroke="black" stroke-width="1.5"/>
    <path d="M75 345 Q90 325 105 345" fill="none" stroke="black" stroke-width="1.5"/>
    <path d="M115 340 Q130 350 140 340 Q150 330 160 340" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Hearts -->
    <path d="M320 130 Q320 115 332 115 Q345 115 345 130 Q345 145 320 160 Q295 145 295 130 Q295 115 308 115 Q320 115 320 130Z" fill="none" stroke="black" stroke-width="2"/>
    <path d="M80 100 Q80 90 88 90 Q96 90 96 100 Q96 110 80 118 Q64 110 64 100 Q64 90 72 90 Q80 90 80 100Z" fill="none" stroke="black" stroke-width="1.5"/>
  </svg>`,
  jungle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="white"/>
    <text x="200" y="25" text-anchor="middle" font-size="16" font-family="Arial" fill="#888">Jungle Adventure - Coloring Page</text>
    <!-- Ground -->
    <path d="M0 350 Q50 340 100 350 Q150 360 200 350 Q250 340 300 350 Q350 360 400 350 L400 400 L0 400Z" fill="none" stroke="black" stroke-width="2"/>
    <!-- Sun -->
    <circle cx="340" cy="60" r="30" fill="none" stroke="black" stroke-width="2"/>
    <line x1="340" y1="20" x2="340" y2="10" stroke="black" stroke-width="2"/>
    <line x1="340" y1="100" x2="340" y2="110" stroke="black" stroke-width="2"/>
    <line x1="300" y1="60" x2="290" y2="60" stroke="black" stroke-width="2"/>
    <line x1="380" y1="60" x2="390" y2="60" stroke="black" stroke-width="2"/>
    <line x1="319" y1="39" x2="311" y2="31" stroke="black" stroke-width="2"/>
    <line x1="361" y1="81" x2="369" y2="89" stroke="black" stroke-width="2"/>
    <!-- Palm tree left -->
    <path d="M60 350 Q55 250 65 150" fill="none" stroke="black" stroke-width="3"/>
    <path d="M65 150 Q30 130 10 100" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M65 150 Q50 120 20 120" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M65 150 Q80 120 110 100" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M65 150 Q90 130 120 130" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M65 150 Q65 120 60 90" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Coconuts -->
    <circle cx="60" cy="158" r="7" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="72" cy="155" r="7" fill="none" stroke="black" stroke-width="2"/>
    <!-- Elephant -->
    <ellipse cx="200" cy="290" rx="55" ry="40" fill="none" stroke="black" stroke-width="2.5"/>
    <circle cx="190" cy="245" r="30" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Elephant ear -->
    <ellipse cx="165" cy="250" rx="18" ry="22" fill="none" stroke="black" stroke-width="2"/>
    <!-- Elephant eye -->
    <circle cx="198" cy="240" r="5" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="200" cy="239" r="2" fill="none" stroke="black" stroke-width="1"/>
    <!-- Trunk -->
    <path d="M210 260 Q230 280 225 300 Q220 310 230 315" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Legs -->
    <rect x="170" y="320" width="18" height="30" fill="none" stroke="black" stroke-width="2" rx="5"/>
    <rect x="210" y="320" width="18" height="30" fill="none" stroke="black" stroke-width="2" rx="5"/>
    <!-- Tusks -->
    <path d="M205 265 Q210 275 205 280" fill="none" stroke="black" stroke-width="2"/>
    <!-- Tail -->
    <path d="M255 290 Q270 280 275 270" fill="none" stroke="black" stroke-width="2"/>
    <!-- Bird on tree -->
    <ellipse cx="300" cy="180" rx="12" ry="10" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="308" cy="174" r="7" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="315,174 325,172 315,176" fill="none" stroke="black" stroke-width="1.5"/>
    <circle cx="310" cy="172" r="2" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Right tree -->
    <path d="M330 350 Q335 280 325 200" fill="none" stroke="black" stroke-width="3"/>
    <path d="M325 200 Q290 180 270 160" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M325 200 Q350 170 380 160" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M325 200 Q310 170 300 140" fill="none" stroke="black" stroke-width="2.5"/>
    <path d="M325 200 Q350 180 370 190" fill="none" stroke="black" stroke-width="2.5"/>
    <!-- Grass tufts -->
    <path d="M130 350 L125 330 L135 350" fill="none" stroke="black" stroke-width="1.5"/>
    <path d="M135 350 L140 325 L145 350" fill="none" stroke="black" stroke-width="1.5"/>
    <path d="M280 350 L275 328 L285 350" fill="none" stroke="black" stroke-width="1.5"/>
    <path d="M285 350 L290 326 L295 350" fill="none" stroke="black" stroke-width="1.5"/>
    <!-- Flowers -->
    <circle cx="100" cy="340" r="6" fill="none" stroke="black" stroke-width="1.5"/>
    <line x1="100" y1="346" x2="100" y2="360" stroke="black" stroke-width="1.5"/>
    <circle cx="370" cy="335" r="6" fill="none" stroke="black" stroke-width="1.5"/>
    <line x1="370" y1="341" x2="370" y2="360" stroke="black" stroke-width="1.5"/>
  </svg>`,
};

function svgToDataUri(svgString: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

export function ColoringPages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const coloringPages = [
    { id: 1, title: "Magical Castle", description: "A beautiful castle with towers, flags, and magical stars", svgKey: "castle" },
    { id: 2, title: "Friendly Animals", description: "A cute cat, dog, and butterfly in a sunny scene", svgKey: "animals" },
    { id: 3, title: "Playful Kitten", description: "An adorable kitten with yarn ball and hearts", svgKey: "kitten" },
    { id: 4, title: "Jungle Adventure", description: "A friendly elephant with palm trees and tropical birds", svgKey: "jungle" },
  ];

  const downloadColoringPage = (page: typeof coloringPages[0]) => {
    const svgString = coloringPageSVGs[page.svgKey];
    if (!svgString) return;

    // Create a canvas and render the SVG to PNG for easy printing
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 800, 800);
      ctx.drawImage(img, 0, 0, 800, 800);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${page.title.toLowerCase().replace(/\s+/g, '-')}-coloring-page.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    img.src = svgToDataUri(svgString);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-kids-purple mb-4">
          🎨 Coloring Pages
        </h2>
        <p className="text-gray-600 mb-6">
          Print these magical coloring pages and bring your stories to life with colors!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coloringPages.map((page) => (
          <Card key={page.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-kids-blue flex items-center gap-2">
                <Palette size={20} />
                {page.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={svgToDataUri(coloringPageSVGs[page.svgKey])} 
                  alt={page.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <p className="text-gray-600 text-sm">{page.description}</p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedImage(svgToDataUri(coloringPageSVGs[page.svgKey]))}
                  variant="outline"
                  className="flex-1 border-kids-purple text-kids-purple hover:bg-kids-purple/10"
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </Button>
                <Button 
                  onClick={() => downloadColoringPage(page)}
                  className="flex-1 bg-kids-orange hover:bg-kids-orange/90"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-2xl max-h-[80vh] bg-white rounded-lg p-4">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <img 
              src={selectedImage} 
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              Click "Download" to save as PNG for printing
            </p>
          </div>
        </div>
      )}

      <Card className="bg-kids-yellow/20 border-kids-yellow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-kids-purple mb-2">Coloring Tips for Parents & Teachers:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use these pages to discuss story elements and characters</li>
                <li>• Encourage creativity - there are no wrong colors!</li>
                <li>• Ask children to tell you about their coloring choices</li>
                <li>• Display finished artwork to boost confidence</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
