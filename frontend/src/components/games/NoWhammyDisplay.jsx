/**
 * NO WHAMMY! Game Display (Press Your Luck-style)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Zap, AlertTriangle } from 'lucide-react';

const NoWhammyDisplay = ({ content, currentIndex, showAnswer, isSpinning = false, spinResult = null }) => {
  const [highlightedPanel, setHighlightedPanel] = useState(0);

  // Animate board when spinning
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setHighlightedPanel(prev => (prev + 1) % 12);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpinning]);

  if (!content) return null;

  const board = content.board || [];
  const question = content.spin_questions?.[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-900 via-purple-900 to-pink-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-black text-yellow-400 mb-2">NO WHAMMY!</h1>
          <p className="text-2xl text-pink-300">Big money, no whammies!</p>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {board.map((panel, idx) => {
            const isWhammy = panel.content === 'WHAMMY!';
            const isHighlighted = isSpinning && highlightedPanel === idx;
            const isResult = !isSpinning && spinResult === idx;
            
            return (
              <div
                key={idx}
                className={`relative p-6 rounded-xl text-center transition-all duration-100 ${
                  isHighlighted || isResult
                    ? 'bg-yellow-400 scale-110 shadow-2xl'
                    : isWhammy
                      ? 'bg-red-600'
                      : 'bg-green-600'
                }`}
              >
                {isWhammy ? (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 text-white mb-1" />
                    <span className="text-xl font-black text-white">WHAMMY!</span>
                  </div>
                ) : (
                  <div>
                    <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-1" />
                    <span className="text-3xl font-black text-white">${panel.content}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Spin Question */}
        {question && (
          <Card className="bg-purple-800/80 border-4 border-pink-400 mb-8">
            <CardContent className="p-8">
              <h3 className="text-xl text-pink-300 mb-4">Answer correctly to earn spins!</h3>
              <h2 className="text-3xl font-bold text-white mb-6">{question.question_text}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(question.choices).map(([letter, text]) => {
                  const isCorrect = letter === question.correct_answer;
                  
                  return (
                    <div
                      key={letter}
                      className={`p-4 rounded-xl transition-all ${
                        showAnswer && isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-purple-700 text-pink-200'
                      }`}
                    >
                      <span className="font-bold text-xl">{letter}:</span> {text}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spin Result */}
        {spinResult !== null && !isSpinning && (
          <div className="text-center">
            <div className={`inline-block px-12 py-6 rounded-2xl ${
              board[spinResult]?.content === 'WHAMMY!'
                ? 'bg-red-600 animate-shake'
                : 'bg-green-600 animate-bounce'
            }`}>
              <span className="text-4xl font-black text-white">
                {board[spinResult]?.content === 'WHAMMY!' 
                  ? '💀 WHAMMY! 💀' 
                  : `+$${board[spinResult]?.content}!`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoWhammyDisplay;
