/**
 * SPIN TO WIN! Game Display (Wheel of Fortune-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { RotateCw } from 'lucide-react';

const SpinToWinDisplay = ({ content, currentIndex, showAnswer, revealedLetters = [] }) => {
  if (!content?.puzzles) return null;
  
  const puzzle = content.puzzles[currentIndex];
  if (!puzzle) return null;

  // Create display string with revealed letters
  const displayPuzzle = puzzle.full_answer.split('').map(char => {
    if (char === ' ') return ' ';
    if (revealedLetters.includes(char.toUpperCase()) || showAnswer) return char;
    return '_';
  }).join('');

  // Common consonants and vowels for display
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
  const vowels = 'AEIOU'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <RotateCw className="w-12 h-12 text-yellow-400 animate-spin-slow" />
          <h1 className="text-6xl font-black text-yellow-400">SPIN TO WIN!</h1>
          <RotateCw className="w-12 h-12 text-yellow-400 animate-spin-slow" />
        </div>

        {/* Category */}
        <div className="text-center mb-8">
          <span className="bg-blue-600 px-8 py-3 rounded-full text-2xl font-bold text-white">
            {puzzle.category}
          </span>
        </div>

        {/* Puzzle Board */}
        <Card className="bg-blue-900 border-8 border-yellow-400 mb-8">
          <CardContent className="p-12">
            <div className="flex flex-wrap justify-center gap-2">
              {displayPuzzle.split('').map((char, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-20 flex items-center justify-center text-4xl font-black rounded ${
                    char === ' ' 
                      ? 'bg-transparent' 
                      : char === '_'
                        ? 'bg-white text-blue-900'
                        : 'bg-yellow-400 text-blue-900'
                  }`}
                >
                  {char === '_' ? '' : char}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Letter Board */}
        <div className="grid grid-cols-2 gap-8">
          {/* Consonants */}
          <div className="bg-black/30 rounded-xl p-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">Consonants</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {consonants.map(letter => {
                const isUsed = revealedLetters.includes(letter);
                return (
                  <div
                    key={letter}
                    className={`w-10 h-10 flex items-center justify-center font-bold rounded ${
                      isUsed 
                        ? 'bg-gray-600 text-gray-400' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vowels */}
          <div className="bg-black/30 rounded-xl p-4">
            <h3 className="text-xl font-bold text-green-400 mb-4 text-center">Vowels ($250)</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {vowels.map(letter => {
                const isUsed = revealedLetters.includes(letter);
                return (
                  <div
                    key={letter}
                    className={`w-10 h-10 flex items-center justify-center font-bold rounded ${
                      isUsed 
                        ? 'bg-gray-600 text-gray-400' 
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bonus Letter Hint */}
        {puzzle.bonus_letter && !showAnswer && (
          <div className="text-center mt-8">
            <span className="bg-purple-600 px-6 py-3 rounded-full text-xl font-bold text-white">
              Bonus Letter Hint: "{puzzle.bonus_letter}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinToWinDisplay;
