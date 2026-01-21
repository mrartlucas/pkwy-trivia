import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Trophy, Zap, Clock, Users, X } from 'lucide-react';
import { mockQuestions } from '../mockData';
import { getBranding, formatThemes } from '../config/branding';
import { toast } from '../hooks/use-toast';

const PlayerGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'Player';
  const branding = getBranding();
  
  const [gameState, setGameState] = useState('waiting');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [buzzerPressed, setBuzzerPressed] = useState(false);
  const [buzzerAnswer, setBuzzerAnswer] = useState('');
  const [playerCount, setPlayerCount] = useState(4);

  const question = mockQuestions[currentQuestion];
  const format = question?.format || 'jeopardy';
  const theme = formatThemes[format];

  useEffect(() => {
    // Simulate game starting after 3 seconds
    const timer = setTimeout(() => {
      if (question) {
        setGameState('playing');
        setTimeLeft(question.timeLimit || 30);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [gameState, timeLeft]);

  const handleTimeUp = () => {
    if (selectedAnswer === null && !buzzerPressed) {
      toast({
        title: 'Time\'s Up!',
        description: 'You didn\'t answer in time.',
        variant: 'destructive',
      });
    }
    setGameState('answered');
    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (index) => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      const earnedPoints = question.pointValue || question.points || 100;
      setScore(prev => prev + earnedPoints);
      toast({
        title: '✓ Correct!',
        description: `+${earnedPoints} points`,
      });
    } else {
      toast({
        title: '✗ Wrong Answer',
        description: 'Better luck next time!',
        variant: 'destructive',
      });
    }
    
    setGameState('answered');
    setTimeout(() => {
      moveToNextQuestion();
    }, 2500);
  };

  const handleBuzzerPress = () => {
    if (buzzerPressed) return;
    
    setBuzzerPressed(true);
    toast({
      title: 'Buzzer Activated!',
      description: 'You were first! Answer now.',
    });
  };

  const handleBuzzerSubmit = () => {
    if (!buzzerAnswer.trim()) return;
    
    // In real implementation, this would check against the correct answer
    const earnedPoints = question.pointValue || 200;
    setScore(prev => prev + earnedPoints);
    toast({
      title: '✓ Accepted!',
      description: `+${earnedPoints} points`,
    });
    
    setGameState('answered');
    setTimeout(() => {
      moveToNextQuestion();
    }, 2500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setBuzzerPressed(false);
      setBuzzerAnswer('');
      setTimeLeft(mockQuestions[currentQuestion + 1].timeLimit || 30);
      setGameState('playing');
    } else {
      setGameState('results');
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-12">
            <p className="text-xl">Loading game...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'waiting') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
        }}
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-12 space-y-6">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-24 w-auto mx-auto object-contain"
            />
            <h2 className="text-2xl font-bold">Welcome, {playerName}!</h2>
            <p className="text-muted-foreground">Game Code: <span className="font-mono font-bold">{gameCode}</span></p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{playerCount} players connected</span>
            </div>
            <p className="text-lg">Waiting for host to start the game...</p>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: branding.colors.primary, animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: branding.colors.primary, animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: branding.colors.primary, animationDelay: '300ms' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
        }}
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-12 space-y-6">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
            <h2 className="text-3xl font-bold">Game Over!</h2>
            <div className="bg-muted rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Your Final Score</p>
              <p className="text-5xl font-bold" style={{ color: branding.colors.primary }}>{score}</p>
              <p className="text-sm text-muted-foreground">Check the TV for final standings!</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="w-full"
              style={{ backgroundColor: branding.colors.primary }}
            >
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = (timeLeft / (question.timeLimit || 30)) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgColor} p-4`}>
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold text-xl">{score}</span>
          </div>
          <div className="text-white font-mono">
            Q {currentQuestion + 1}/{mockQuestions.length}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-xl">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
            </div>

            {/* Format Badge */}
            <div className="flex justify-center">
              <span 
                className="px-4 py-1 rounded-full text-sm font-medium capitalize"
                style={{ 
                  backgroundColor: branding.colors.primary,
                  color: branding.colors.accent
                }}
              >
                {theme.name}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-center min-h-[80px] flex items-center justify-center">
              {question.question}
            </h2>

            {/* Jeopardy or Millionaire Style - Multiple Choice */}
            {(format === 'jeopardy' || format === 'millionaire') && question.options && (
              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = gameState === 'answered';
                  
                  let buttonClass = 'h-16 text-lg font-medium transition-all duration-300 transform hover:scale-105';
                  
                  if (showResult) {
                    if (isSelected && isCorrect) {
                      buttonClass += ' bg-green-500 hover:bg-green-500 text-white';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += ' bg-red-500 hover:bg-red-500 text-white';
                    } else if (isCorrect) {
                      buttonClass += ' bg-green-500 hover:bg-green-500 text-white';
                    }
                  }
                  
                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={gameState === 'answered'}
                      className={buttonClass}
                      variant={showResult ? 'default' : 'outline'}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Family Feud - Survey Style */}
            {format === 'family_feud' && question.answers && (
              <div className="space-y-3">
                <p className="text-center text-muted-foreground text-sm">Select the most popular answer</p>
                {question.answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={gameState === 'answered' || answer.revealed}
                    className="w-full h-14 text-lg font-medium justify-between transition-all duration-300 transform hover:scale-105"
                    variant="outline"
                  >
                    <span>{answer.revealed || gameState === 'answered' ? answer.text : '???'}</span>
                    {gameState === 'answered' && (
                      <span className="font-bold" style={{ color: branding.colors.primary }}>
                        {answer.points} pts
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}

            {/* Last Man Standing - True/False */}
            {format === 'last_man_standing' && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAnswerSelect(1)}
                  disabled={gameState === 'answered'}
                  className={`h-20 text-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    gameState === 'answered' && selectedAnswer === 1
                      ? question.correctAnswer === true
                        ? 'bg-green-500 hover:bg-green-500'
                        : 'bg-red-500 hover:bg-red-500'
                      : ''
                  }`}
                  variant={gameState === 'answered' ? 'default' : 'outline'}
                >
                  TRUE
                </Button>
                <Button
                  onClick={() => handleAnswerSelect(0)}
                  disabled={gameState === 'answered'}
                  className={`h-20 text-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    gameState === 'answered' && selectedAnswer === 0
                      ? question.correctAnswer === false
                        ? 'bg-green-500 hover:bg-green-500'
                        : 'bg-red-500 hover:bg-red-500'
                      : ''
                  }`}
                  variant={gameState === 'answered' ? 'default' : 'outline'}
                >
                  FALSE
                </Button>
              </div>
            )}

            {/* Majority Rules - Voting */}
            {format === 'majority_rules' && question.options && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={gameState === 'answered'}
                    className="h-16 text-lg font-medium transition-all duration-300 transform hover:scale-105"
                    variant={selectedAnswer === index ? 'default' : 'outline'}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerGame;
