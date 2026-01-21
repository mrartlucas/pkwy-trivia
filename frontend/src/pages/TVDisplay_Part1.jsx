import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Users, Trophy, X as XIcon } from 'lucide-react';
import { mockQuestions, mockLeaderboard } from '../mockData';
import { getBranding, formatThemes } from '../config/branding';

const TVDisplay = () => {
  const { gameCode } = useParams();
  const [branding, setBranding] = useState(getBranding());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameState, setGameState] = useState('lobby');
  const [showAnswer, setShowAnswer] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [strikes, setStrikes] = useState(0);

  const question = mockQuestions[currentQuestion];
  const format = question?.format || 'jeopardy';
  const theme = formatThemes[format];

  useEffect(() => {
    setBranding(getBranding());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (gameState === 'lobby') {
        setGameState('question');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'question' && !showAnswer) {
      const timer = setTimeout(() => {
        setShowAnswer(true);
        setTimeout(() => {
          if (currentQuestion < mockQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setShowAnswer(false);
            setRevealedAnswers([]);
            setStrikes(0);
            setGameState('leaderboard');
            setTimeout(() => setGameState('question'), 5000);
          } else {
            setGameState('final');
          }
        }, 4000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [gameState, showAnswer, currentQuestion]);

  // Lobby Screen
  if (gameState === 'lobby') {
    return (
      <div 
        className={`min-h-screen bg-gradient-to-br ${theme.bgColor} p-8 flex items-center justify-center`}
      >
        <div className="text-center space-y-12 max-w-5xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/30">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-48 w-auto mx-auto object-contain mb-6"
            />
            <h1 className="text-7xl font-black text-white mb-2" style={{ fontFamily: branding.fonts.heading }}>
              {branding.venue.name.toUpperCase()}
            </h1>
            <p className="text-3xl text-white/90">{branding.venue.tagline}</p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-lg border-4 border-white/30">
            <CardContent className="p-12">
              <p className="text-3xl text-white/90 mb-4">Join with code:</p>
              <p className="text-9xl font-black font-mono tracking-wider text-white mb-8">
                {gameCode || 'TRIVIA'}
              </p>
              <div className="flex items-center justify-center gap-4 text-4xl text-white">
                <Users className="w-14 h-14" />
                <span className="font-bold">{playerCount} Players Connected</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <div className="w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          
          <p className="text-3xl text-white/90">Get ready to play!</p>
        </div>
      </div>
    );
  }

  // Final Results
  if (gameState === 'final') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bgColor} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-24 w-auto mx-auto object-contain mb-6"
            />
            <h1 className="text-8xl font-black text-white mb-4" style={{ fontFamily: branding.fonts.heading }}>
              FINAL STANDINGS
            </h1>
          </div>
          
          <div className="space-y-4">
            {mockLeaderboard.slice(0, 5).map((player, index) => (
              <Card 
                key={player.rank}
                className={`transform transition-all duration-500 ${
                  index === 0 
                    ? 'scale-110' 
                    : 'bg-white/95'
                }`}
                style={index === 0 ? {
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                } : {}}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div 
                        className="text-7xl font-black"
                        style={{ 
                          color: index === 0 ? branding.colors.accent : branding.colors.primary,
                          fontFamily: branding.fonts.heading
                        }}
                      >
                        #{player.rank}
                      </div>
                      {index === 0 && <Trophy className="w-16 h-16 text-yellow-400" />}
                      <div>
                        <p 
                          className="text-5xl font-bold"
                          style={{ color: index === 0 ? branding.colors.accent : branding.colors.text }}
                        >
                          {player.name}
                        </p>
                        <p 
                          className="text-2xl"
                          style={{ color: index === 0 ? 'rgba(255,255,255,0.8)' : branding.colors.textLight }}
                        >
                          {player.correctAnswers} correct answers
                        </p>
                      </div>
                    </div>
                    <div 
                      className="text-7xl font-black"
                      style={{ 
                        color: index === 0 ? branding.colors.accent : branding.colors.primary,
                        fontFamily: branding.fonts.heading
                      }}
                    >
                      {player.score}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard Screen
  if (gameState === 'leaderboard') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bgColor} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-20 w-auto object-contain"
            />
            <h1 className="text-6xl font-black text-white" style={{ fontFamily: branding.fonts.heading }}>
              LEADERBOARD
            </h1>
            <div className="text-3xl text-white font-bold">
              After Q{currentQuestion + 1}
            </div>
          </div>
          
          <div className="grid gap-4">
            {mockLeaderboard.map((player) => (
              <Card 
                key={player.rank}
                className="transform transition-all duration-300 bg-white/95"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="text-5xl font-black w-20"
                        style={{ 
                          color: branding.colors.primary,
                          fontFamily: branding.fonts.heading
                        }}
                      >
                        #{player.rank}
                      </div>
                      <div>
                        <p className="text-3xl font-bold" style={{ color: branding.colors.text }}>
                          {player.name}
                        </p>
                        <p className="text-xl" style={{ color: branding.colors.textLight }}>
                          {player.correctAnswers} correct
                        </p>
                      </div>
                    </div>
                    <div 
                      className="text-5xl font-black"
                      style={{ 
                        color: branding.colors.primary,
                        fontFamily: branding.fonts.heading
                      }}
                    >
                      {player.score}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Jeopardy-Style Question Display
  if (format === 'jeopardy') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 bg-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border-4 border-yellow-400">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-16 w-auto object-contain"
            />
            <div className="text-center">
              <p className="text-yellow-400 text-2xl font-bold" style={{ fontFamily: branding.fonts.heading }}>
                {question.category?.toUpperCase()}
              </p>
              <p className="text-white text-xl">for ${question.pointValue}</p>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-white">{playerCount}</span>
            </div>
          </div>

          <Card className="bg-blue-900 border-8 border-yellow-400 shadow-2xl">
            <CardContent className="p-12">
              {!showAnswer ? (
                <div className="text-center space-y-8">
                  <h1 
                    className="text-6xl font-bold text-yellow-400 min-h-[300px] flex items-center justify-center"
                    style={{ fontFamily: branding.fonts.heading }}
                  >
                    {question.question}
                  </h1>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <h1 
                    className="text-7xl font-black text-green-400 mb-8"
                    style={{ fontFamily: branding.fonts.heading }}
                  >
                    CORRECT ANSWER
                  </h1>
                  <p 
                    className="text-6xl font-bold text-yellow-400"
                    style={{ fontFamily: branding.fonts.heading }}
                  >
                    {question.answer || question.options[question.correctAnswer]}
                  </p>
                </div>
              )}

              {!showAnswer && (
                <div className="grid grid-cols-2 gap-6 mt-12">
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className="bg-blue-700 border-4 border-yellow-400 p-6 rounded-xl"
                    >
                      <p className="text-3xl font-bold text-yellow-400 text-center">
                        {option}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Continue in next file...
  return null;
};

export default TVDisplay;