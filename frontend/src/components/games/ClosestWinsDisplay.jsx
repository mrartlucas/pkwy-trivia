/**
 * CLOSEST WINS! Game Display (Price Is Right-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Target, TrendingUp, TrendingDown, Equal } from 'lucide-react';

const ClosestWinsDisplay = ({ content, currentIndex, showAnswer, playerGuesses = [] }) => {
  if (!content?.numbers) return null;
  
  const question = content.numbers[currentIndex];
  if (!question) return null;

  // Sort guesses by closeness to correct answer
  const sortedGuesses = [...playerGuesses].sort((a, b) => {
    const diffA = Math.abs(a.guess - question.correct_number);
    const diffB = Math.abs(b.guess - question.correct_number);
    return diffA - diffB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-emerald-800 to-green-950 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-6xl font-black text-yellow-400">CLOSEST WINS!</h1>
        </div>

        {/* Question */}
        <Card className="bg-emerald-800 border-4 border-yellow-400 mb-8">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{question.question_text}</h2>
            {question.over_rule && (
              <p className="text-xl text-red-400">⚠️ Going OVER disqualifies you!</p>
            )}
          </CardContent>
        </Card>

        {/* Answer Reveal */}
        {showAnswer && (
          <div className="text-center mb-8">
            <div className="bg-yellow-400 inline-block px-16 py-8 rounded-2xl">
              <p className="text-2xl text-emerald-900 font-bold mb-2">The Answer Is:</p>
              <p className="text-7xl font-black text-emerald-900">
                {question.correct_number.toLocaleString()}
              </p>
            </div>
            <p className="text-xl text-emerald-300 mt-4">
              Acceptable Range: ±{question.acceptable_range}
            </p>
          </div>
        )}

        {/* Player Guesses */}
        {playerGuesses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-yellow-400 text-center mb-4">Player Guesses</h3>
            {sortedGuesses.map((guess, idx) => {
              const diff = guess.guess - question.correct_number;
              const isOver = diff > 0;
              const isExact = Math.abs(diff) <= question.acceptable_range;
              const isDisqualified = question.over_rule && isOver;
              
              let bgColor = 'bg-emerald-700';
              if (showAnswer) {
                if (isDisqualified) {
                  bgColor = 'bg-red-900';
                } else if (isExact) {
                  bgColor = 'bg-green-600';
                } else if (idx === 0) {
                  bgColor = 'bg-yellow-600';
                }
              }

              return (
                <div
                  key={guess.playerId}
                  className={`flex items-center justify-between p-6 rounded-xl ${bgColor} transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-white">{guess.playerName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-yellow-400">
                      {guess.guess.toLocaleString()}
                    </span>
                    {showAnswer && (
                      <div className="flex items-center gap-2">
                        {isOver ? (
                          <TrendingUp className="w-8 h-8 text-red-400" />
                        ) : diff < 0 ? (
                          <TrendingDown className="w-8 h-8 text-blue-400" />
                        ) : (
                          <Equal className="w-8 h-8 text-green-400" />
                        )}
                        <span className={`text-xl font-bold ${isOver ? 'text-red-400' : 'text-blue-400'}`}>
                          {isOver ? '+' : ''}{diff.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        {!showAnswer && playerGuesses.length === 0 && (
          <div className="text-center">
            <p className="text-2xl text-emerald-300">Submit your guess on your device!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosestWinsDisplay;
