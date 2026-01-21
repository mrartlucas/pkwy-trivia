/**
 * PERIL! Game Display (Jeopardy-style)
 */
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';

const PerilDisplay = ({ content, currentIndex, showAnswer, onClueSelect }) => {
  const [selectedClue, setSelectedClue] = useState(null);
  
  if (!content?.categories) return null;

  const handleClueClick = (catIndex, clueIndex, clue) => {
    if (clue.answered) return;
    setSelectedClue({ catIndex, clueIndex, clue });
    if (onClueSelect) onClueSelect(catIndex, clueIndex);
  };

  // If a clue is selected, show the question
  if (selectedClue) {
    const { clue } = selectedClue;
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-8">
        <Card className="max-w-5xl w-full bg-blue-800 border-8 border-yellow-400">
          <CardContent className="p-16 text-center">
            <div className="text-yellow-400 text-3xl font-bold mb-4">
              ${clue.value}
            </div>
            <h1 className="text-5xl font-bold text-white mb-12 leading-tight">
              {clue.clue_text}
            </h1>
            
            {showAnswer ? (
              <div className="space-y-6">
                <div className="bg-green-500 p-8 rounded-xl">
                  <p className="text-4xl font-bold text-white">
                    {clue.correct_answer}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedClue(null)}
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl text-xl font-bold"
                >
                  Back to Board
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 mt-8">
                {[clue.correct_answer, ...clue.wrong_answers]
                  .sort(() => Math.random() - 0.5)
                  .map((option, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-700 border-4 border-yellow-400 p-6 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center text-xl font-black">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <p className="text-2xl font-bold text-yellow-400">{option}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the game board
  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black text-yellow-400 text-center mb-8">PERIL!</h1>
        
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${content.categories.length}, 1fr)` }}>
          {/* Category Headers */}
          {content.categories.map((cat, catIdx) => (
            <div key={catIdx} className="bg-blue-800 p-4 text-center border-2 border-blue-600">
              <h2 className="text-xl font-bold text-white uppercase">{cat.category_title}</h2>
            </div>
          ))}
          
          {/* Clue Grid - 5 rows */}
          {[0, 1, 2, 3, 4].map(rowIdx => (
            content.categories.map((cat, catIdx) => {
              const clue = cat.clues[rowIdx];
              if (!clue) return <div key={`${catIdx}-${rowIdx}`} className="bg-blue-800 p-4" />;
              
              return (
                <div
                  key={`${catIdx}-${rowIdx}`}
                  onClick={() => handleClueClick(catIdx, rowIdx, clue)}
                  className={`p-6 text-center border-2 border-blue-600 cursor-pointer transition-all ${
                    clue.answered 
                      ? 'bg-blue-950 opacity-50' 
                      : 'bg-blue-800 hover:bg-blue-700 hover:scale-105'
                  }`}
                >
                  <span className={`text-4xl font-black ${clue.answered ? 'text-blue-800' : 'text-yellow-400'}`}>
                    ${clue.value}
                  </span>
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerilDisplay;
