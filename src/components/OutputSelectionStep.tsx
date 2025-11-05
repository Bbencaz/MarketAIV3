import { useState, useEffect } from 'react';
import { Check, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import type { CreationMethod, PostData } from '../App';

interface OutputSelectionStepProps {
  creationMethod: CreationMethod;
  postData: PostData;
  onSelect: (outputIndex: number) => void;
}

export function OutputSelectionStep({ creationMethod, postData, onSelect }: OutputSelectionStepProps) {
  const [selectedOutput, setSelectedOutput] = useState<number | null>(postData.selectedOutput ?? null);

  // Generate mock outputs based on creation method
  const outputs = generateMockOutputs(creationMethod, postData);

  useEffect(() => {
    if (selectedOutput !== null) {
      onSelect(selectedOutput);
    }
  }, [selectedOutput]);

  const scrollToNext = () => {
    document.getElementById('platform-hashtags')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
          Step 3
        </div>
        <h2 className="text-slate-900 mb-2">Choose Your Favorite Design</h2>
        <p className="text-slate-600">
          Select one of the three AI-generated options below
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {outputs.map((output, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all ${
              selectedOutput === index
                ? 'ring-4 ring-blue-500 scale-105'
                : 'hover:shadow-xl hover:scale-102'
            }`}
            onClick={() => setSelectedOutput(index)}
          >
            {/* Preview Image/Design */}
            <div className="relative aspect-square" style={{ background: output.gradient }}>
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Top Banner */}
                {output.companyName && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                    <p className="text-slate-900">{output.companyName}</p>
                    {output.companyPhone && (
                      <p className="text-sm text-slate-600">{output.companyPhone}</p>
                    )}
                  </div>
                )}

                {/* Center Content */}
                <div className="text-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl inline-block">
                    <p className="text-slate-900">{output.mainText}</p>
                  </div>
                </div>

                {/* Bottom Banner */}
                {output.bottomText && (
                  <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg text-center">
                    <p className="text-white">{output.bottomText}</p>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {selectedOutput === index && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Option Label */}
            <div className="p-4 bg-slate-50 text-center">
              <p className="text-slate-700">Option {index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      {selectedOutput !== null && (
        <div className="text-center">
          <Button onClick={scrollToNext} className="gap-2">
            Continue to Platform Selection
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function generateMockOutputs(creationMethod: CreationMethod, postData: PostData) {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ];

  if (creationMethod === 'ai-generated') {
    return gradients.map((gradient, index) => ({
      gradient,
      companyName: postData.companyName || 'Your Business',
      companyPhone: postData.companyPhone || '',
      mainText: postData.description || 'Your amazing offer',
      bottomText: ['Limited Time!', 'Don\'t Miss Out!', 'Shop Now!'][index],
    }));
  } else {
    // For upload & enhance, show variations
    return gradients.map((gradient, index) => ({
      gradient,
      companyName: null,
      companyPhone: null,
      mainText: postData.imageEditDescription 
        ? ['Enhanced Version', 'Styled Version', 'Premium Version'][index]
        : 'Enhanced Image',
      bottomText: null,
    }));
  }
}
