/**
 * QUIZ CHASE Game Display (Trivial Pursuit-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Circle } from 'lucide-react';

const QuizChaseDisplay = ({ content, currentIndex, showAnswer, categoryIndex = 0 }) => {
  if (!content?.categories) return null;
  
  const category = content.categories[categoryIndex];
  const question = category?.questions?.[currentIndex];
  
  if (!question) return null;

  const categoryColors = [
    { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-blue-100' },
    { bg: 'bg-pink-600', border: 'border-pink-400', text: 'text-pink-100' },
    { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-900' },
    { bg: 'bg-green-600', border: 'border-green-400', text: 'text-green-100' },
    { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-100' },
    { bg: 'bg-purple-600', border: 'border-purple-400', text: 'text-purple-100' },
  ];

  const currentColor = categoryColors[categoryIndex % categoryColors.length];

  return (
    <div className={`min-h-screen ${currentColor.bg} p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-6xl font-black text-white text-center mb-8">QUIZ CHASE</h1>

        {/* Category Wheel */}
        <div className="flex justify-center gap-4 mb-8">
          {content.categories.map((cat, idx) => {
            const color = categoryColors[idx % categoryColors.length];
            const isActive = idx === categoryIndex;
            
            return (
              <div
                key={idx}
                className={`px-4 py-2 rounded-full transition-all ${
                  isActive 
                    ? 'scale-110 bg-white text-gray-900' 
                    : `${color.bg} text-white opacity-60`
                }`}
              >
                <span className="font-bold">{cat.category_title}</span>
              </div>
            );
          })}
        </div>

        {/* Difficulty Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(level => (
            <Circle
              key={level}
              className={`w-8 h-8 ${
                level <= question.difficulty 
                  ? 'text-yellow-300 fill-yellow-300' 
                  : 'text-white/30'
              }`}
            />
          ))}
        </div>

        {/* Category Header */}
        <div className="text-center mb-6">
          <span className={`${currentColor.bg} border-4 ${currentColor.border} px-8 py-3 rounded-full text-2xl font-bold text-white`}>
            {category.category_title}
          </span>
        </div>

        {/* Question */}
        <Card className={`${currentColor.bg} border-4 ${currentColor.border} mb-8`}>
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white">{question.question_text}</h2>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(question.choices).map(([letter, text]) => {
            const isCorrect = letter === question.correct_answer;
            
            let bgColor = 'bg-white/90 text-gray-900';
            if (showAnswer) {
              bgColor = isCorrect 
                ? 'bg-green-500 text-white scale-105' 
                : 'bg-white/50 text-gray-500';
            }

            return (
              <div
                key={letter}
                className={`p-6 rounded-xl transition-all duration-500 ${bgColor}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${
                    showAnswer && isCorrect 
                      ? 'bg-white text-green-600' 
                      : `${currentColor.bg} text-white`
                  }`}>
                    {letter}
                  </div>
                  <p className="text-xl font-semibold">{text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wedge Progress */}
        <div className="flex justify-center mt-8">
          <div className="bg-white/20 rounded-full p-4">
            <div className="flex gap-2">
              {content.categories.map((_, idx) => {
                const color = categoryColors[idx % categoryColors.length];
                return (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full ${color.bg} ${
                      idx <= categoryIndex ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizChaseDisplay;
