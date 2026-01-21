/**
 * PKWY LIVE! Game Display (HQ Trivia-style)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Wifi, Users, Clock, Zap } from 'lucide-react';

const PKWYLiveDisplay = ({ content, currentIndex, showAnswer, playerCount = 0, timeLeft = 10 }) => {
  const [answerCounts, setAnswerCounts] = useState({ A: 0, B: 0, C: 0, D: 0 });

  if (!content?.questions) return null;
  
  const question = content.questions[currentIndex];
  if (!question) return null;

  // Simulate answer distribution when answer is revealed
  useEffect(() => {
    if (showAnswer && playerCount > 0) {
      const total = playerCount;
      const correctLetter = question.correct_answer;
      const correctCount = Math.floor(total * (0.3 + Math.random() * 0.3));
      const remaining = total - correctCount;
      
      const distribution = { A: 0, B: 0, C: 0, D: 0 };
      distribution[correctLetter] = correctCount;
      
      const otherLetters = ['A', 'B', 'C', 'D'].filter(l => l !== correctLetter);
      let leftover = remaining;
      otherLetters.forEach((letter, idx) => {
        if (idx === otherLetters.length - 1) {
          distribution[letter] = leftover;
        } else {
          const count = Math.floor(Math.random() * leftover);
          distribution[letter] = count;
          leftover -= count;
        }
      });
      
      setAnswerCounts(distribution);
    }
  }, [showAnswer, playerCount, question]);

  const totalAnswers = Object.values(answerCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 via-purple-900 to-violet-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wifi className="w-6 h-6 text-green-400 animate-pulse" />
            <span className="text-green-400 font-bold">LIVE</span>
          </div>
          <h1 className="text-4xl font-black text-white">
            <span className="text-yellow-400">PKWY</span> LIVE!
          </h1>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-300" />
            <span className="text-purple-300 font-bold">{playerCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{timeLeft}s</span>
            </div>
            <span className="text-purple-300">Question {currentIndex + 1}/12</span>
          </div>
          <div className="h-2 bg-purple-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(12)].map((_, i) => (
            <Zap
              key={i}
              className={`w-4 h-4 ${
                i < question.difficulty 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-purple-700'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <Card className="bg-purple-800/50 backdrop-blur border-2 border-purple-500 mb-6">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-white">{question.question_text}</h2>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="space-y-3">
          {Object.entries(question.choices).map(([letter, text]) => {
            const isCorrect = letter === question.correct_answer;
            const count = answerCounts[letter];
            const percentage = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
            
            let bgColor = 'bg-purple-700 hover:bg-purple-600';
            if (showAnswer) {
              bgColor = isCorrect 
                ? 'bg-green-500' 
                : 'bg-red-900/50';
            }

            return (
              <div
                key={letter}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 ${bgColor}`}
              >
                {/* Answer bar */}
                {showAnswer && (
                  <div 
                    className={`absolute inset-0 ${isCorrect ? 'bg-green-400' : 'bg-red-700'} opacity-30`}
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${
                      showAnswer && isCorrect 
                        ? 'bg-white text-green-600' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {letter}
                    </div>
                    <p className="text-lg font-semibold text-white">{text}</p>
                  </div>
                  
                  {showAnswer && (
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{percentage}%</span>
                      <span className="text-purple-300">({count})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Eliminated Message */}
        {showAnswer && (
          <div className="text-center mt-6">
            <span className={`px-6 py-3 rounded-full text-lg font-bold ${
              answerCounts[question.correct_answer] > 0 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {totalAnswers - answerCounts[question.correct_answer]} players eliminated!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PKWYLiveDisplay;
