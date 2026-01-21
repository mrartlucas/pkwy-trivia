/**
 * BACK TO SCHOOL! Game Display (5th Grader-style)
 */
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { GraduationCap, BookOpen, FlaskConical, Globe, Calculator, History } from 'lucide-react';

const BackToSchoolDisplay = ({ content, currentIndex, showAnswer }) => {
  if (!content?.questions) return null;
  
  const question = content.questions[currentIndex];
  if (!question) return null;

  const subjectIcons = {
    Math: Calculator,
    Science: FlaskConical,
    English: BookOpen,
    History: History,
    Geography: Globe,
  };
  
  const SubjectIcon = subjectIcons[question.subject] || BookOpen;

  const gradeColors = {
    1: 'bg-green-500',
    2: 'bg-green-600',
    3: 'bg-yellow-500',
    4: 'bg-yellow-600',
    5: 'bg-orange-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <GraduationCap className="w-20 h-20 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-6xl font-black text-white">BACK TO SCHOOL!</h1>
          <p className="text-2xl text-blue-100 mt-2">Are you smarter than a 5th grader?</p>
        </div>

        {/* Subject & Grade Badge */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
            <SubjectIcon className="w-6 h-6 text-yellow-300" />
            <span className="text-xl font-bold text-white">{question.subject}</span>
          </div>
          <div className={`px-6 py-3 rounded-full ${gradeColors[question.grade_level]}`}>
            <span className="text-xl font-bold text-white">Grade {question.grade_level}</span>
          </div>
        </div>

        {/* Chalkboard Question */}
        <Card className="bg-green-900 border-8 border-amber-700 mb-8 shadow-2xl">
          <CardContent className="p-12">
            {/* Chalk dust effect */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white/10 to-transparent" />
            
            <h2 className="text-4xl font-bold text-white text-center" style={{ fontFamily: 'Chalkduster, fantasy' }}>
              {question.question_text}
            </h2>
          </CardContent>
        </Card>

        {/* Answer Options - Notebook style */}
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(question.choices).map(([letter, text]) => {
            const isCorrect = letter === question.correct_answer;
            
            let bgStyle = 'bg-white border-blue-200';
            if (showAnswer) {
              bgStyle = isCorrect 
                ? 'bg-green-100 border-green-500 scale-105' 
                : 'bg-red-50 border-red-200';
            }

            return (
              <div
                key={letter}
                className={`p-6 rounded-lg border-4 transition-all duration-500 ${bgStyle}`}
                style={{ 
                  backgroundImage: showAnswer ? 'none' : 'repeating-linear-gradient(transparent, transparent 27px, #cce5ff 28px)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${
                    showAnswer && isCorrect 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {letter}
                  </div>
                  <p className={`text-xl font-semibold ${
                    showAnswer && isCorrect ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {text}
                  </p>
                  {showAnswer && isCorrect && (
                    <span className="text-3xl">✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grade Progress */}
        <div className="flex justify-center mt-8">
          <div className="bg-white/20 rounded-full px-8 py-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(grade => (
                <div
                  key={grade}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    grade <= question.grade_level 
                      ? gradeColors[grade] + ' text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {grade}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackToSchoolDisplay;
