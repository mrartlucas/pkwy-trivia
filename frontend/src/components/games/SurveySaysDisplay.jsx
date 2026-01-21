/**
 * SURVEY SAYS! Game Display (Family Feud-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { X } from 'lucide-react';

const SurveySaysDisplay = ({ content, currentIndex, showAnswer, revealedAnswers = [] }) => {
  if (!content?.survey_questions) return null;
  
  const question = content.survey_questions[currentIndex];
  if (!question) return null;

  const strikes = question.strikes || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-black text-yellow-400 text-center mb-8">SURVEY SAYS!</h1>
        
        {/* Question */}
        <Card className="bg-blue-800 border-4 border-yellow-400 mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-3xl font-bold text-white">{question.question}</p>
          </CardContent>
        </Card>

        {/* Answer Board */}
        <div className="bg-blue-950 rounded-2xl p-6 border-4 border-yellow-400">
          <div className="grid gap-3">
            {question.answers.map((answer, idx) => {
              const isRevealed = showAnswer || revealedAnswers.includes(idx);
              
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
                    isRevealed 
                      ? 'bg-yellow-400' 
                      : 'bg-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black ${
                      isRevealed ? 'bg-blue-900 text-yellow-400' : 'bg-blue-700 text-yellow-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-2xl font-bold ${
                      isRevealed ? 'text-blue-900' : 'text-blue-600'
                    }`}>
                      {isRevealed ? answer.answer : '???'}
                    </span>
                  </div>
                  <div className={`text-3xl font-black ${
                    isRevealed ? 'text-blue-900' : 'text-blue-700'
                  }`}>
                    {isRevealed ? answer.percent : '--'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strikes */}
        {strikes > 0 && (
          <div className="flex justify-center gap-4 mt-8">
            {[...Array(strikes)].map((_, i) => (
              <div key={i} className="bg-red-600 p-4 rounded-full animate-pulse">
                <X className="w-12 h-12 text-white" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveySaysDisplay;
