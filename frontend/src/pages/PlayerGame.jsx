/**
 * Player Game Page - Real-time game interface for players
 * Connected to backend API and WebSocket
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Trophy, Clock, Users, Loader2, Wifi, WifiOff } from 'lucide-react';
import { getBranding } from '../config/branding';
import { toast } from '../hooks/use-toast';
import { gamesApi, answersApi, createWebSocket } from '../services/api';

const PlayerGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'Player';
  const playerId = localStorage.getItem('playerId');
  const branding = getBranding();
  
  // State
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, answered, results
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [answerStartTime, setAnswerStartTime] = useState(null);

  // Fetch game data
  const fetchGame = useCallback(async () => {
    try {
      const gameData = await gamesApi.getByCode(gameCode);
      setGame(gameData);
      setCurrentIndex(gameData.current_question_index || 0);
      
      // Find player score
      const player = gameData.players?.find(p => p.id === playerId);
      if (player) {
        setScore(player.score || 0);
      }
      
      // Set game state based on status
      if (gameData.status === 'active') {
        setGameState('playing');
        extractCurrentQuestion(gameData);
      } else if (gameData.status === 'finished') {
        setGameState('results');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [gameCode, playerId]);

  // Extract current question based on game format
  const extractCurrentQuestion = (gameData) => {
    const content = gameData?.content;
    const index = gameData?.current_question_index || 0;
    const format = gameData?.game_format;
    
    if (!content) return;

    let question = null;

    if (format === 'GAME NIGHT MIX') {
      // Flatten all questions from rounds
      const allQuestions = [];
      for (const round of (content.rounds || [])) {
        const roundFormat = round.format;
        if (roundFormat === 'PERIL!') {
          for (const cat of (round.categories || [])) {
            for (const clue of (cat.clues || [])) {
              allQuestions.push({ ...clue, format: roundFormat, type: 'multiple_choice' });
            }
          }
        } else if (roundFormat === 'SURVEY SAYS!') {
          for (const q of (round.survey_questions || [])) {
            allQuestions.push({ 
              question_text: q.question, 
              answers: q.answers, 
              format: roundFormat, 
              type: 'survey' 
            });
          }
        } else if (roundFormat === 'SPIN TO WIN!') {
          for (const p of (round.puzzles || [])) {
            allQuestions.push({ 
              question_text: p.category + ': Solve the puzzle', 
              puzzle: p.puzzle_with_blanks,
              answer: p.full_answer,
              format: roundFormat, 
              type: 'text_input' 
            });
          }
        } else if (roundFormat === 'CLOSEST WINS!') {
          for (const n of (round.numbers || [])) {
            allQuestions.push({ ...n, format: roundFormat, type: 'number_input' });
          }
        } else {
          for (const q of (round.questions || [])) {
            allQuestions.push({ ...q, format: roundFormat, type: 'multiple_choice' });
          }
        }
      }
      question = allQuestions[index];
    } else {
      // Single format games
      switch (format) {
        case 'PERIL!':
          const allClues = (content.categories || []).flatMap(c => c.clues || []);
          question = allClues[index];
          if (question) question.type = 'multiple_choice';
          break;
        case 'SURVEY SAYS!':
          const surveyQ = content.survey_questions?.[index];
          if (surveyQ) {
            question = { question_text: surveyQ.question, answers: surveyQ.answers, type: 'survey' };
          }
          break;
        case 'SPIN TO WIN!':
          const puzzle = content.puzzles?.[index];
          if (puzzle) {
            question = { question_text: puzzle.category, puzzle: puzzle.puzzle_with_blanks, type: 'text_input' };
          }
          break;
        case 'CLOSEST WINS!':
          question = content.numbers?.[index];
          if (question) question.type = 'number_input';
          break;
        default:
          question = content.questions?.[index];
          if (question) question.type = 'multiple_choice';
      }
    }

    setCurrentQuestion(question);
    setAnswerStartTime(Date.now());
  };

  // WebSocket connection
  useEffect(() => {
    if (!gameCode || !playerId) return;

    const socket = createWebSocket.player(gameCode, playerId);
    
    socket.onopen = () => {
      setConnected(true);
      console.log('Player WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    socket.onerror = () => {
      setConnected(false);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [gameCode, playerId]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message) => {
    const { event, data } = message;

    switch (event) {
      case 'game:started':
        setGameState('playing');
        fetchGame();
        toast({ title: 'Game Started!', description: 'Get ready to play!' });
        break;
        
      case 'game:paused':
        toast({ title: 'Game Paused', description: 'Waiting for host...' });
        break;
        
      case 'game:resumed':
        setGameState('playing');
        break;
        
      case 'game:finished':
        setGameState('results');
        toast({ title: 'Game Over!', description: 'Check the TV for final standings!' });
        break;
        
      case 'question:changed':
        setCurrentIndex(data.question_index);
        setSelectedAnswer(null);
        setShowAnswer(false);
        setTextAnswer('');
        setGameState('playing');
        fetchGame();
        break;
        
      case 'answer:revealed':
        setShowAnswer(true);
        break;
        
      case 'timer:started':
        setTimeLeft(data.duration || 30);
        break;
        
      default:
        console.log('Player received:', event);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  // Submit answer
  const handleAnswerSelect = async (answer) => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const timeTaken = (Date.now() - answerStartTime) / 1000;

    // Send answer via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        event: 'answer:submit',
        data: {
          answer,
          time_taken: timeTaken,
          question_index: currentIndex,
        }
      }));
    }

    // Also submit via API for scoring
    try {
      const result = await answersApi.submit({
        player_id: playerId,
        game_id: game.id,
        question_index: currentIndex,
        answer,
        time_taken: timeTaken,
      });

      if (result.correct) {
        setScore(result.new_score);
        toast({
          title: '✓ Correct!',
          description: `+${result.points_earned} points`,
        });
      } else {
        toast({
          title: '✗ Wrong',
          description: 'Better luck next time!',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }

    setGameState('answered');
  };

  // Submit text/number answer
  const handleTextSubmit = () => {
    if (!textAnswer.trim()) return;
    handleAnswerSelect(textAnswer);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  // No player ID - redirect to join
  if (!playerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
            <p className="text-muted-foreground mb-4">Please rejoin the game</p>
            <Button onClick={() => navigate(`/?code=${gameCode}`)} className="w-full">
              Rejoin Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Waiting for game to start
  if (gameState === 'waiting' || game?.status === 'waiting') {
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
            <p className="text-muted-foreground">
              Game: <span className="font-mono font-bold">{gameCode}</span>
            </p>
            <div className="flex items-center justify-center gap-2">
              {connected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={connected ? 'text-green-600' : 'text-red-600'}>
                {connected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{game?.players?.length || 0} players connected</span>
            </div>
            <p className="text-lg">Waiting for host to start...</p>
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

  // Results screen
  if (gameState === 'results' || game?.status === 'finished') {
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

  // No question yet
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-500" />
            <h2 className="text-xl font-bold mb-2">Getting Ready...</h2>
            <p className="text-muted-foreground">Waiting for the next question</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing state - show question
  const progressPercentage = (timeLeft / 30) * 100;
  const questionType = currentQuestion.type || 'multiple_choice';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold text-xl">{score}</span>
          </div>
          <div className="text-white font-mono">
            Q {currentIndex + 1}
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
            <Progress value={progressPercentage} className="h-2" />

            {/* Format Badge */}
            {currentQuestion.format && (
              <div className="flex justify-center">
                <span className="px-4 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white">
                  {currentQuestion.format}
                </span>
              </div>
            )}

            {/* Question Text */}
            <h2 className="text-2xl font-bold text-center">
              {currentQuestion.question_text || currentQuestion.clue_text || currentQuestion.question}
            </h2>

            {/* Multiple Choice */}
            {questionType === 'multiple_choice' && currentQuestion.choices && (
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(currentQuestion.choices).map(([letter, text]) => {
                  const isSelected = selectedAnswer === letter;
                  const isCorrect = letter === currentQuestion.correct_answer;
                  const showResult = showAnswer || gameState === 'answered';
                  
                  let buttonClass = 'h-16 text-lg font-medium transition-all duration-300';
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += ' bg-green-500 hover:bg-green-500 text-white';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += ' bg-red-500 hover:bg-red-500 text-white';
                    }
                  } else if (isSelected) {
                    buttonClass += ' bg-indigo-600 text-white';
                  }
                  
                  return (
                    <Button
                      key={letter}
                      onClick={() => handleAnswerSelect(letter)}
                      disabled={gameState === 'answered' || selectedAnswer !== null}
                      className={buttonClass}
                      variant={isSelected ? 'default' : 'outline'}
                    >
                      <span className="font-bold mr-3">{letter}.</span> {text}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Wrong answers style (for PERIL!) */}
            {questionType === 'multiple_choice' && currentQuestion.wrong_answers && !currentQuestion.choices && (
              <div className="grid grid-cols-1 gap-3">
                {[currentQuestion.correct_answer, ...currentQuestion.wrong_answers]
                  .sort(() => Math.random() - 0.5)
                  .map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = option === currentQuestion.correct_answer;
                    const showResult = showAnswer || gameState === 'answered';
                    
                    let buttonClass = 'h-16 text-lg font-medium transition-all duration-300';
                    
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass += ' bg-green-500 hover:bg-green-500 text-white';
                      } else if (isSelected && !isCorrect) {
                        buttonClass += ' bg-red-500 hover:bg-red-500 text-white';
                      }
                    }
                    
                    return (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(letter)}
                        disabled={gameState === 'answered' || selectedAnswer !== null}
                        className={buttonClass}
                        variant={isSelected ? 'default' : 'outline'}
                      >
                        <span className="font-bold mr-3">{letter}.</span> {option}
                      </Button>
                    );
                  })}
              </div>
            )}

            {/* Survey Style */}
            {questionType === 'survey' && (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Type your answer..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                  disabled={gameState === 'answered'}
                  className="h-14 text-lg text-center"
                />
                <Button 
                  onClick={handleTextSubmit}
                  disabled={gameState === 'answered' || !textAnswer.trim()}
                  className="w-full h-12"
                  style={{ backgroundColor: branding.colors.primary }}
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Number Input */}
            {questionType === 'number_input' && (
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter your guess..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                  disabled={gameState === 'answered'}
                  className="h-14 text-2xl text-center font-bold"
                />
                <Button 
                  onClick={handleTextSubmit}
                  disabled={gameState === 'answered' || !textAnswer.trim()}
                  className="w-full h-12"
                  style={{ backgroundColor: branding.colors.primary }}
                >
                  Lock In Guess
                </Button>
              </div>
            )}

            {/* Text Input (Puzzles) */}
            {questionType === 'text_input' && (
              <div className="space-y-4">
                {currentQuestion.puzzle && (
                  <div className="bg-indigo-100 p-4 rounded-lg text-center">
                    <p className="text-2xl font-mono tracking-widest">{currentQuestion.puzzle}</p>
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Solve the puzzle..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                  disabled={gameState === 'answered'}
                  className="h-14 text-lg text-center uppercase"
                />
                <Button 
                  onClick={handleTextSubmit}
                  disabled={gameState === 'answered' || !textAnswer.trim()}
                  className="w-full h-12"
                  style={{ backgroundColor: branding.colors.primary }}
                >
                  Submit Solution
                </Button>
              </div>
            )}

            {/* Answered State */}
            {gameState === 'answered' && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-lg font-medium">Answer submitted!</p>
                <p className="text-sm text-muted-foreground">Waiting for next question...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerGame;
