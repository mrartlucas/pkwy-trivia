/**
 * CHAINED UP Game Display (Word Chain-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ArrowRight } from 'lucide-react';

const ChainedUpDisplay = ({ content, currentIndex, showAnswer, revealedWords = 0 }) => {
  if (!content?.chains) return null;
  
  const chain = content.chains[currentIndex];
  if (!chain) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 via-red-900 to-orange-950 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-6xl font-black text-center text-orange-400 mb-4">CHAINED UP</h1>
        <p className="text-2xl text-center text-orange-200 mb-8">Connect the words!</p>

        {/* Chain Title */}
        <div className="text-center mb-8">
          <span className="bg-orange-600 px-8 py-3 rounded-full text-2xl font-bold text-white">
            {chain.chain_title}
          </span>
        </div>

        {/* Word Chain */}
        <Card className="bg-orange-800/80 border-4 border-orange-400 mb-8">
          <CardContent className="p-12">
            <div className="flex items-center justify-center flex-wrap gap-4">
              {chain.words.map((word, idx) => {
                const isRevealed = idx < revealedWords || showAnswer;
                
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`px-8 py-6 rounded-xl text-3xl font-black transition-all duration-500 ${
                        isRevealed
                          ? 'bg-yellow-400 text-orange-900'
                          : 'bg-orange-700 text-orange-500'
                      }`}
                    >
                      {isRevealed ? word : '???'}
                    </div>
                    {idx < chain.words.length - 1 && (
                      <ArrowRight className={`w-8 h-8 ${
                        isRevealed ? 'text-yellow-400' : 'text-orange-600'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {showAnswer && (
          <Card className="bg-green-600 border-4 border-green-400">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Connection Explained:</h3>
              <p className="text-xl text-green-100">{chain.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {chain.words.map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full ${
                  idx < revealedWords || showAnswer
                    ? 'bg-yellow-400'
                    : 'bg-orange-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainedUpDisplay;
