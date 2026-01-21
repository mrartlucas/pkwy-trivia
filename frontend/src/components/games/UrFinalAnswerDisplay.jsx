/**
 * UR FINAL ANSWER! Game Display (Millionaire-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Phone, Users, Split } from 'lucide-react';

const UrFinalAnswerDisplay = ({ content, currentIndex, showAnswer, selectedAnswer, lifelinesUsed = [] }) => {
  if (!content?.questions) return null;
  
  const question = content.questions[currentIndex];
  if (!question) return null;

  const lifelines = [
    { id: '50-50', icon: Split, label: '50:50' },
    { id: 'Ask the Audience', icon: Users, label: 'Ask Audience' },
    { id: 'Phone a Friend', icon: Phone, label: 'Phone Friend' },
  ];

  // Money ladder values
  const moneyLadder = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with lifelines */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            UR FINAL ANSWER!
          </h1>
          <div className="flex gap-4">
            {lifelines.map(({ id, icon: Icon, label }) => (
              <div
                key={id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  lifelinesUsed.includes(id)
                    ? 'bg-gray-700 opacity-50'
                    : 'bg-purple-700 hover:bg-purple-600'
                }`}
              >
                <Icon className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="col-span-3">
            {/* Question */}
            <Card className="bg-gradient-to-r from-purple-800 to-purple-900 border-2 border-purple-500 mb-6">
              <CardContent className="p-8">
                <div className="text-yellow-400 text-xl mb-2">
                  Question {currentIndex + 1} - ${question.point_value?.toLocaleString()}
                </div>
                <h2 className="text-3xl font-bold text-white">{question.question_text}</h2>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(question.choices).map(([letter, text]) => {
                const isCorrect = letter === question.correct_answer;
                const isSelected = selectedAnswer === letter;
                
                let bgColor = 'bg-gradient-to-r from-blue-800 to-blue-900 border-blue-500';
                if (showAnswer) {
                  if (isCorrect) {
                    bgColor = 'bg-gradient-to-r from-green-600 to-green-700 border-green-400 animate-pulse';
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-gradient-to-r from-red-600 to-red-700 border-red-400';
                  }
                } else if (isSelected) {
                  bgColor = 'bg-gradient-to-r from-orange-600 to-orange-700 border-orange-400';
                }

                return (
                  <div
                    key={letter}
                    className={`p-6 rounded-xl border-2 transition-all duration-500 ${bgColor}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-400 text-purple-900 flex items-center justify-center text-2xl font-black">
                        {letter}
                      </div>
                      <p className="text-xl font-semibold text-white">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Money Ladder */}
          <div className="bg-gray-900/80 rounded-xl p-4 border border-purple-500">
            <div className="space-y-2">
              {moneyLadder.reverse().map((value, idx) => {
                const questionNum = 10 - idx;
                const isCurrent = questionNum === currentIndex + 1;
                const isPast = questionNum < currentIndex + 1;
                
                return (
                  <div
                    key={value}
                    className={`flex justify-between items-center px-4 py-2 rounded ${
                      isCurrent 
                        ? 'bg-yellow-400 text-purple-900' 
                        : isPast 
                          ? 'bg-green-700 text-white' 
                          : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <span className="font-bold">{questionNum}</span>
                    <span className="font-bold">${value.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrFinalAnswerDisplay;
