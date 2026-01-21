/**
 * LINK REACTION Game Display (Chain-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Link, Unlink } from 'lucide-react';

const LinkReactionDisplay = ({ content, currentIndex, showAnswer, chainProgress = 0 }) => {
  if (!content?.questions) return null;
  
  const question = content.questions[currentIndex];
  if (!question) return null;

  const maxChain = 12;
  const chainMultiplier = question.chain_value || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-cyan-900 to-teal-950 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-6xl font-black text-center text-cyan-400 mb-4">LINK REACTION</h1>
        
        {/* Chain Progress */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/50 rounded-full p-4">
            <div className="flex items-center gap-2">
              {[...Array(maxChain)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {i < chainProgress ? (
                    <Link className="w-8 h-8 text-cyan-400" />
                  ) : i === chainProgress ? (
                    <Link className="w-8 h-8 text-yellow-400 animate-pulse" />
                  ) : (
                    <Unlink className="w-8 h-8 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-cyan-400">
                Chain: {chainProgress} × {chainMultiplier * 100} = {chainProgress * chainMultiplier * 100} pts
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <Card className="bg-cyan-800/80 border-4 border-cyan-400 mb-8">
          <CardContent className="p-12 text-center">
            <div className="text-cyan-300 text-xl mb-4">
              Chain Value: ×{chainMultiplier} | Penalty: {question.penalty_value} pts
            </div>
            <h2 className="text-4xl font-bold text-white">{question.question_text}</h2>
          </CardContent>
        </Card>

        {/* Answer Area */}
        {showAnswer ? (
          <div className="bg-green-600 p-8 rounded-2xl text-center">
            <p className="text-4xl font-black text-white">{question.correct_answer}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {[question.correct_answer, ...question.wrong_answers]
              .sort(() => Math.random() - 0.5)
              .map((option, idx) => (
                <div
                  key={idx}
                  className="bg-cyan-700 border-4 border-cyan-500 p-6 rounded-xl hover:bg-cyan-600 transition-all"
                >
                  <p className="text-2xl font-bold text-white text-center">{option}</p>
                </div>
              ))}
          </div>
        )}

        {/* Bank Button Display */}
        <div className="flex justify-center mt-8">
          <div className="bg-yellow-500 px-12 py-4 rounded-xl">
            <span className="text-2xl font-black text-black">BANK: {chainProgress * chainMultiplier * 100} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkReactionDisplay;
