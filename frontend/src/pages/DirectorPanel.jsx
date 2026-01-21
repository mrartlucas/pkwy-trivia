/**
 * Director Panel - Real-time game control center
 * Controls game flow via WebSocket
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Play, Pause, SkipForward, SkipBack, Trophy, Users, 
  Eye, EyeOff, Home, Tv, CheckCircle2, Clock, Loader2,
  RefreshCw, StopCircle, BarChart3, Wifi, WifiOff, Bot, 
  Smartphone, Copy, QrCode, Trash2
} from 'lucide-react';
import { getBranding } from '../config/branding';
import { toast } from '../hooks/use-toast';
import { gamesApi, createWebSocket } from '../services/api';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const DirectorPanel = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const branding = getBranding();
  
  // State
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerAnswers, setPlayerAnswers] = useState([]);

  // Fetch game data
  const fetchGame = useCallback(async () => {
    try {
      const gameData = await gamesApi.getByCode(gameCode);
      setGame(gameData);
      
      const lb = await gamesApi.getLeaderboard(gameCode);
      setLeaderboard(lb);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  // WebSocket connection
  useEffect(() => {
    if (!gameCode) return;

    const socket = createWebSocket.director(gameCode);
    
    socket.onopen = () => {
      setConnected(true);
      console.log('Director WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnected(false);
    };

    socket.onclose = () => {
      setConnected(false);
      // Reconnect after delay
      setTimeout(() => {
        if (ws?.readyState === WebSocket.CLOSED) {
          setWs(createWebSocket.director(gameCode));
        }
      }, 3000);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [gameCode]);

  // Handle incoming messages
  const handleWebSocketMessage = (message) => {
    const { event, data } = message;
    
    switch (event) {
      case 'player:answered':
        setPlayerAnswers(prev => [...prev, data]);
        break;
        
      case 'player:joined':
        fetchGame();
        toast({
          title: 'Player Joined',
          description: `${data.players_count} players now connected`,
        });
        break;
        
      case 'leaderboard:update':
        setLeaderboard(data);
        break;
        
      default:
        console.log('Director received:', event, data);
    }
  };

  // Send WebSocket message
  const sendMessage = (event, data = {}) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }));
    } else {
      toast({
        title: 'Connection Error',
        description: 'Not connected to game server',
        variant: 'destructive',
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Game control handlers
  const handleStart = async () => {
    try {
      await gamesApi.start(game.id);
      sendMessage('game:start');
      setGame({ ...game, status: 'active' });
      toast({ title: 'Game Started!' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handlePause = async () => {
    try {
      await gamesApi.pause(game.id);
      sendMessage('game:pause');
      setGame({ ...game, status: 'paused' });
      toast({ title: 'Game Paused' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleResume = async () => {
    try {
      await gamesApi.resume(game.id);
      sendMessage('game:resume');
      setGame({ ...game, status: 'active' });
      toast({ title: 'Game Resumed' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleFinish = async () => {
    try {
      await gamesApi.finish(game.id);
      sendMessage('game:finish');
      setGame({ ...game, status: 'finished' });
      toast({ title: 'Game Finished!' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleNextQuestion = () => {
    sendMessage('question:next');
    setShowAnswer(false);
    setPlayerAnswers([]);
    setGame({ ...game, current_question_index: (game.current_question_index || 0) + 1 });
    toast({ title: 'Next Question' });
  };

  const handlePreviousQuestion = () => {
    sendMessage('question:previous');
    setShowAnswer(false);
    setPlayerAnswers([]);
    setGame({ ...game, current_question_index: Math.max(0, (game.current_question_index || 0) - 1) });
  };

  const handleRevealAnswer = () => {
    setShowAnswer(!showAnswer);
    sendMessage('answer:reveal', { revealed: !showAnswer });
    toast({ title: showAnswer ? 'Answer Hidden' : 'Answer Revealed' });
  };

  const handleShowLeaderboard = () => {
    sendMessage('leaderboard:show');
    toast({ title: 'Showing Leaderboard' });
  };

  const handleChangeDisplayState = (state) => {
    sendMessage('display:state', { state });
    toast({ title: `Display: ${state}` });
  };

  const openTVDisplay = () => {
    window.open(`/tv/${gameCode}`, '_blank', 'width=1920,height=1080');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // No game found
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
            <p className="text-gray-500 mb-4">Code: {gameCode}</p>
            <Button onClick={() => navigate('/host')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get current question from content
  const content = game.content;
  const currentIndex = game.current_question_index || 0;
  
  // Extract current question based on game format
  let currentQuestion = null;
  let totalQuestions = 0;
  
  if (content) {
    switch (game.game_format) {
      case 'PERIL!':
        const allClues = content.categories?.flatMap(c => c.clues) || [];
        currentQuestion = allClues[currentIndex];
        totalQuestions = allClues.length;
        break;
        
      case 'SURVEY SAYS!':
        currentQuestion = content.survey_questions?.[currentIndex];
        totalQuestions = content.survey_questions?.length || 0;
        break;
        
      case 'UR FINAL ANSWER!':
      case 'LAST CALL STANDING':
      case 'BACK TO SCHOOL!':
      case 'PKWY LIVE!':
        currentQuestion = content.questions?.[currentIndex];
        totalQuestions = content.questions?.length || 0;
        break;
        
      case 'PICK OR PASS!':
        currentQuestion = content.cases?.[currentIndex];
        totalQuestions = content.cases?.length || 0;
        break;
        
      case 'LINK REACTION':
        currentQuestion = content.questions?.[currentIndex];
        totalQuestions = content.questions?.length || 0;
        break;
        
      case 'SPIN TO WIN!':
        currentQuestion = content.puzzles?.[currentIndex];
        totalQuestions = content.puzzles?.length || 0;
        break;
        
      case 'CLOSEST WINS!':
        currentQuestion = content.numbers?.[currentIndex];
        totalQuestions = content.numbers?.length || 0;
        break;
        
      case 'CHAINED UP':
        currentQuestion = content.chains?.[currentIndex];
        totalQuestions = content.chains?.length || 0;
        break;
        
      case 'NO WHAMMY!':
        currentQuestion = content.spin_questions?.[currentIndex];
        totalQuestions = content.spin_questions?.length || 0;
        break;
        
      case 'QUIZ CHASE':
        const allQuizQuestions = content.categories?.flatMap(c => c.questions) || [];
        currentQuestion = allQuizQuestions[currentIndex];
        totalQuestions = allQuizQuestions.length;
        break;
        
      default:
        break;
    }
  }

  const players = game.players || [];
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-3xl font-black" style={{ color: branding.colors.primary }}>
                DIRECTOR CONTROL PANEL
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">
                  Game: <span className="font-mono font-bold">{gameCode}</span>
                </p>
                <Badge variant={connected ? 'default' : 'destructive'} className="gap-1">
                  {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchGame}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/host')}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={openTVDisplay} style={{ backgroundColor: branding.colors.primary }}>
              <Tv className="w-4 h-4 mr-2" />
              Open TV Display
            </Button>
          </div>
        </div>

        {/* Game Status Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant={
                  game.status === 'active' ? 'default' :
                  game.status === 'paused' ? 'secondary' :
                  game.status === 'finished' ? 'outline' :
                  'secondary'
                } className="text-lg px-4 py-1">
                  {game.status?.toUpperCase()}
                </Badge>
                <span className="text-lg font-bold">{game.game_format}</span>
                <span className="text-gray-500">|</span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {players.length} players
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-bold">{currentIndex + 1} / {totalQuestions}</div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* No content warning */}
        {!content && (
          <Card className="border-yellow-400 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">No Game Content Loaded</h3>
              <p className="text-yellow-700 mb-4">
                Go to the Host Dashboard and load a Game Pack into this game to start playing.
              </p>
              <Button onClick={() => navigate('/host')} variant="outline">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Game Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Primary Controls */}
              <div className="flex gap-3">
                {game.status === 'waiting' && (
                  <Button 
                    onClick={handleStart} 
                    size="lg" 
                    className="flex-1"
                    style={{ backgroundColor: branding.colors.primary }}
                    disabled={!content}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                )}
                
                {game.status === 'active' && (
                  <>
                    <Button onClick={handlePause} size="lg" variant="outline" className="flex-1">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                    <Button 
                      onClick={handleNextQuestion} 
                      size="lg" 
                      className="flex-1" 
                      style={{ backgroundColor: branding.colors.primary }}
                      disabled={currentIndex >= totalQuestions - 1}
                    >
                      <SkipForward className="w-5 h-5 mr-2" />
                      Next Question
                    </Button>
                    <Button onClick={handleFinish} size="lg" variant="destructive">
                      <StopCircle className="w-5 h-5 mr-2" />
                      End Game
                    </Button>
                  </>
                )}
                
                {game.status === 'paused' && (
                  <>
                    <Button 
                      onClick={handleResume} 
                      size="lg" 
                      className="flex-1" 
                      style={{ backgroundColor: branding.colors.primary }}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                    <Button onClick={handleFinish} size="lg" variant="destructive">
                      <StopCircle className="w-5 h-5 mr-2" />
                      End Game
                    </Button>
                  </>
                )}

                {game.status === 'finished' && (
                  <div className="flex-1 text-center p-4 bg-gray-100 rounded-lg">
                    <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
                    <p className="text-xl font-bold">Game Complete!</p>
                  </div>
                )}
              </div>

              {/* Secondary Controls */}
              <div className="grid grid-cols-4 gap-3">
                <Button 
                  onClick={handlePreviousQuestion} 
                  variant="outline" 
                  disabled={currentIndex === 0 || game.status !== 'active'}
                >
                  <SkipBack className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={handleRevealAnswer} 
                  variant="outline"
                  disabled={game.status !== 'active'}
                >
                  {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showAnswer ? 'Hide' : 'Reveal'} Answer
                </Button>
                <Button 
                  onClick={handleShowLeaderboard} 
                  variant="outline"
                  disabled={game.status === 'waiting'}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Show Scores
                </Button>
                <Button 
                  onClick={() => handleChangeDisplayState('lobby')} 
                  variant="outline"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Show Lobby
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Current Question Preview */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Current Question ({currentIndex + 1}/{totalQuestions})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion ? (
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge>{game.game_format}</Badge>
                      {currentQuestion.value && (
                        <Badge variant="outline">${currentQuestion.value}</Badge>
                      )}
                      {currentQuestion.point_value && (
                        <Badge variant="outline">${currentQuestion.point_value}</Badge>
                      )}
                      {currentQuestion.difficulty && (
                        <Badge variant="outline">Difficulty: {currentQuestion.difficulty}</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold">
                      {currentQuestion.question_text || 
                       currentQuestion.clue_text || 
                       currentQuestion.question ||
                       currentQuestion.puzzle_with_blanks ||
                       currentQuestion.chain_title ||
                       'No question text'}
                    </h3>

                    {/* Show choices/options if available */}
                    {currentQuestion.choices && (
                      <div className="space-y-2 mt-4">
                        {Object.entries(currentQuestion.choices).map(([letter, text]) => {
                          const isCorrect = letter === currentQuestion.correct_answer;
                          return (
                            <div
                              key={letter}
                              className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                                showAnswer && isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  showAnswer && isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200'
                                }`}>
                                  {letter}
                                </div>
                                <span>{text}</span>
                              </div>
                              {showAnswer && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Survey answers */}
                    {currentQuestion.answers && (
                      <div className="space-y-2 mt-4">
                        {currentQuestion.answers.map((ans, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${showAnswer ? 'bg-yellow-100' : 'bg-gray-100'}`}
                          >
                            <div className="flex justify-between">
                              <span>{showAnswer ? ans.answer : `Answer ${idx + 1}`}</span>
                              {showAnswer && <span className="font-bold">{ans.percent}%</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Correct answer display */}
                    {showAnswer && currentQuestion.correct_answer && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
                        <p className="font-semibold text-green-900">
                          Correct Answer: {currentQuestion.correct_answer}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No question loaded</p>
                    <p className="text-sm">Load a game pack to see questions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connected Players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {players.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No players yet</p>
                  ) : (
                    players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-gray-500">{player.score} pts</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          player.eliminated ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Top 5
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((player) => (
                    <div key={player.rank} className="flex items-center gap-3 p-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: branding.colors.primary }}
                      >
                        {player.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{player.name}</p>
                        <p className="text-xs text-gray-500">{player.score} pts</p>
                      </div>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No scores yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Answers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {playerAnswers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Waiting for answers...</p>
                  ) : (
                    playerAnswers.slice(-5).reverse().map((ans, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>{ans.player_name}</span>
                        <span className="font-mono">{ans.answer}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorPanel;
