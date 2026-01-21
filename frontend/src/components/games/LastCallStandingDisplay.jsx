/**
 * LAST CALL STANDING Game Display (Elimination-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skull, UserCheck } from 'lucide-react';

const LastCallStandingDisplay = ({ content, currentIndex, showAnswer, players = [], eliminatedPlayers = [] }) => {
  if (!content?.questions) return null;
  
  const question = content.questions[currentIndex];
  if (!question) return null;

  const activePlayers = players.filter(p => !eliminatedPlayers.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-black to-red-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-red-500 mb-2">LAST CALL STANDING</h1>
          <p className="text-2xl text-white">Round {currentIndex + 1} of {content.questions.length}</p>
        </div>

        {/* Player Status Bar */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2 bg-green-900 px-6 py-3 rounded-full">
            <UserCheck className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-green-400">{activePlayers.length} Remaining</span>
          </div>
          <div className="flex items-center gap-2 bg-red-900 px-6 py-3 rounded-full">
            <Skull className="w-6 h-6 text-red-400" />
            <span className="text-xl font-bold text-red-400">{eliminatedPlayers.length} Eliminated</span>
          </div>
        </div>

        {/* Difficulty Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-8 rounded ${
                  i < question.difficulty 
                    ? 'bg-red-500' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <Card className="bg-black/80 border-4 border-red-600 mb-8">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{question.question_text}</h2>
            <p className="text-red-400 text-xl">Answer wrong and you're OUT!</p>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(question.choices).map(([letter, text]) => {
            const isCorrect = letter === question.correct_answer;
            
            let bgColor = 'bg-gray-800 border-gray-600 hover:border-red-500';
            if (showAnswer) {
              bgColor = isCorrect 
                ? 'bg-green-600 border-green-400 animate-pulse' 
                : 'bg-red-900 border-red-700';
            }

            return (
              <div
                key={letter}
                className={`p-8 rounded-xl border-4 transition-all duration-500 ${bgColor}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl font-black">
                    {letter}
                  </div>
                  <p className="text-2xl font-bold text-white">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LastCallStandingDisplay;
