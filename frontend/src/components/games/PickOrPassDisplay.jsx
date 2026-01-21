/**
 * PICK OR PASS! Game Display (Deal or No Deal-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Briefcase, HelpCircle } from 'lucide-react';

const PickOrPassDisplay = ({ content, currentIndex, showAnswer, selectedCase, openedCases = [] }) => {
  if (!content?.cases) return null;
  
  const currentCase = content.cases[currentIndex];

  // Remaining case values
  const remainingValues = content.cases
    .filter((c, idx) => !openedCases.includes(idx))
    .map(c => c.case_value)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-6xl font-black text-center text-yellow-400 mb-8">PICK OR PASS!</h1>

        {/* Cases Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {content.cases.map((caseItem, idx) => {
            const isOpened = openedCases.includes(idx);
            const isCurrent = idx === currentIndex;
            
            return (
              <div
                key={idx}
                className={`relative p-4 rounded-xl transition-all duration-500 ${
                  isOpened 
                    ? 'bg-gray-700 opacity-50' 
                    : isCurrent 
                      ? 'bg-yellow-500 scale-110 shadow-2xl' 
                      : 'bg-amber-700 hover:bg-amber-600'
                }`}
              >
                <div className="text-center">
                  <Briefcase className={`w-12 h-12 mx-auto mb-2 ${
                    isOpened ? 'text-gray-500' : 'text-yellow-300'
                  }`} />
                  <div className="text-2xl font-black text-white">#{caseItem.case_number}</div>
                  {isOpened && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-black text-red-500 -rotate-12">
                        ${caseItem.case_value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Board */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-black/50 rounded-xl p-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Remaining Values</h3>
            <div className="grid grid-cols-5 gap-2">
              {[10, 25, 50, 100, 200, 300, 400, 500, 750, 1000].map(value => (
                <div
                  key={value}
                  className={`p-2 rounded text-center font-bold ${
                    remainingValues.includes(value)
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-500 line-through'
                  }`}
                >
                  ${value}
                </div>
              ))}
            </div>
          </div>

          {/* Current Question */}
          {currentCase && (
            <Card className="bg-amber-800 border-4 border-yellow-400">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">Answer to Win Case #{currentCase.case_number}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{currentCase.question_text}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(currentCase.choices).map(([letter, text]) => {
                    const isCorrect = letter === currentCase.correct_answer;
                    
                    return (
                      <div
                        key={letter}
                        className={`p-4 rounded-lg transition-all ${
                          showAnswer && isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-amber-700 text-yellow-200'
                        }`}
                      >
                        <span className="font-bold">{letter}:</span> {text}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tension Meter */}
        {currentCase && (
          <div className="flex justify-center">
            <div className="bg-black/50 rounded-full px-8 py-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">TENSION:</span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-8 rounded ${
                        i < currentCase.tension_meter 
                          ? 'bg-red-500 animate-pulse' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickOrPassDisplay;
