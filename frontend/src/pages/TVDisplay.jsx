import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Trophy, Users, Clock, Zap, TrendingUp } from 'lucide-react';
import { mockQuestions, mockLeaderboard } from '../mockData';
import { getBranding } from '../config/branding';

const TVDisplay = () => {
  const { gameCode } = useParams();
  const branding = getBranding();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameState, setGameState] = useState('lobby'); // lobby, question, leaderboard, final
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [playerCount, setPlayerCount] = useState(8);

  const question = mockQuestions[currentQuestion];

  useEffect(() => {
    // Simulate game flow
    const timer = setTimeout(() => {
      if (gameState === 'lobby') {
        setGameState('question');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState === 'question' && timeLeft > 0 && !showAnswer) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
      setTimeout(() => {
        if (currentQuestion < mockQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setShowAnswer(false);
          setTimeLeft(mockQuestions[currentQuestion + 1].timeLimit);
          setGameState('leaderboard');
          setTimeout(() => setGameState('question'), 5000);
        } else {
          setGameState('final');
        }
      }, 3000);
    }
  }, [gameState, timeLeft, showAnswer, currentQuestion]);

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 flex items-center justify-center">
        <div className="text-center space-y-12 max-w-4xl w-full">
          <div className="animate-pulse">
            <h1 className="text-8xl font-black text-white mb-4">TRIVIA SHOWDOWN</h1>
            <p className="text-3xl text-white/90">Get Ready to Play!</p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-lg border-0 text-white">
            <CardContent className="p-12">
              <p className="text-2xl mb-4">Join the game with code:</p>
              <p className="text-8xl font-black font-mono tracking-wider mb-8">{gameCode || 'QUIZ42'}</p>
              <div className="flex items-center justify-center gap-4 text-3xl">
                <Users className="w-12 h-12" />
                <span className="font-bold">{playerCount} Players Connected</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <div className="w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          
          <p className="text-2xl text-white/80">Game starting soon...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'final') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-pulse">
            <Trophy className="w-32 h-32 mx-auto text-white mb-6" />
            <h1 className="text-8xl font-black text-white mb-4">FINAL STANDINGS</h1>
          </div>
          
          <div className="space-y-4">
            {leaderboard.slice(0, 5).map((player, index) => (
              <Card 
                key={player.rank}
                className={`transform transition-all duration-500 ${
                  index === 0 ? 'scale-110 bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-white'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`text-6xl font-black ${
                        index === 0 ? 'text-white' : 'text-indigo-600'
                      }`}>
                        #{player.rank}
                      </div>
                      {index === 0 && <Trophy className="w-12 h-12 text-white" />}
                      <div>
                        <p className={`text-4xl font-bold ${
                          index === 0 ? 'text-white' : 'text-gray-900'
                        }`}>
                          {player.name}
                        </p>
                        <p className={`text-xl ${
                          index === 0 ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {player.correctAnswers} correct answers
                        </p>
                      </div>
                    </div>
                    <div className={`text-6xl font-black ${
                      index === 0 ? 'text-white' : 'text-indigo-600'
                    }`}>
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

  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-7xl font-black text-white mb-4">LEADERBOARD</h1>
            <p className="text-3xl text-white/90">After Question {currentQuestion + 1}</p>
          </div>
          
          <div className="grid gap-4">
            {leaderboard.slice(0, 8).map((player, index) => (
              <Card 
                key={player.rank}
                className="transform transition-all duration-300 hover:scale-105 bg-white/95"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-indigo-600 w-16">
                        #{player.rank}
                      </div>
                      <div className="flex items-center gap-3">
                        {player.trend === 'up' && <TrendingUp className="w-6 h-6 text-green-500" />}
                        {player.trend === 'down' && <TrendingUp className="w-6 h-6 text-red-500 transform rotate-180" />}
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{player.name}</p>
                          <p className="text-lg text-gray-500">{player.correctAnswers} correct</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-indigo-600">
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

  const progressPercentage = (timeLeft / question.timeLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-white" />
            <span className="text-3xl font-bold text-white">{playerCount} Players</span>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-xl">Question</p>
            <p className="text-4xl font-black text-white">{currentQuestion + 1}/{mockQuestions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-white" />
            <span className="text-3xl font-bold text-white">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white border-0 shadow-2xl">
          <CardContent className="p-12 space-y-8">
            {/* Progress Bar */}
            <Progress 
              value={progressPercentage} 
              className="h-4"
            />

            {/* Question Type */}
            <div className="flex justify-center">
              <span className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full text-2xl font-bold capitalize">
                {question.format ? question.format.replace('_', ' ') : 'Question'}
              </span>
            </div>

            {/* Question */}
            <h1 className="text-6xl font-black text-center text-gray-900 min-h-[200px] flex items-center justify-center">
              {question.question}
            </h1>

            {/* Options */}
            {question.type === 'multiple_choice' && (
              <div className="grid grid-cols-2 gap-6">
                {question.options.map((option, index) => {
                  const isCorrect = index === question.correctAnswer;
                  const showCorrect = showAnswer && isCorrect;
                  
                  return (
                    <div
                      key={index}
                      className={`p-8 rounded-2xl border-4 transition-all duration-500 transform ${
                        showCorrect
                          ? 'bg-green-500 border-green-600 scale-105 text-white'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                          showCorrect ? 'bg-white text-green-500' : 'bg-indigo-600 text-white'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <p className={`text-3xl font-bold ${
                          showCorrect ? 'text-white' : 'text-gray-900'
                        }`}>
                          {option}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {question.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-8">
                <div className={`p-12 rounded-2xl border-4 transition-all duration-500 ${
                  showAnswer && question.correctAnswer === true
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-5xl font-black text-center ${
                    showAnswer && question.correctAnswer === true ? 'text-white' : 'text-gray-900'
                  }`}>
                    TRUE
                  </p>
                </div>
                <div className={`p-12 rounded-2xl border-4 transition-all duration-500 ${
                  showAnswer && question.correctAnswer === false
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-5xl font-black text-center ${
                    showAnswer && question.correctAnswer === false ? 'text-white' : 'text-gray-900'
                  }`}>
                    FALSE
                  </p>
                </div>
              </div>
            )}

            {question.type === 'fastest_finger' && (
              <div className="text-center space-y-8">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-16 rounded-3xl">
                  <Zap className="w-32 h-32 mx-auto text-white mb-4" />
                  <p className="text-5xl font-black text-white">BUZZ IN NOW!</p>
                </div>
                {showAnswer && (
                  <div className="bg-green-500 p-8 rounded-2xl">
                    <p className="text-4xl font-bold text-white">Answer: {question.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}

            {question.type === 'survey' && (
              <div className="space-y-4">
                {question.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-black">
                        {index + 1}
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{answer.text}</p>
                    </div>
                    {showAnswer && (
                      <div className="text-3xl font-black text-indigo-600">
                        {answer.points} pts
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TVDisplay;