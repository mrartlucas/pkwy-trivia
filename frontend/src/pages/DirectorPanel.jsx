import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Play, Pause, SkipForward, SkipBack, Trophy, Users, 
  Eye, EyeOff, Settings, Home, Tv, Volume2, VolumeX,
  CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { mockQuestions, mockPlayers, mockLeaderboard } from '../mockData';
import { getBranding } from '../config/branding';
import { toast } from '../hooks/use-toast';

const DirectorPanel = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const branding = getBranding();
  
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [players, setPlayers] = useState(mockPlayers);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  // Simulate real-time player responses
  const [responses, setResponses] = useState({
    total: players.length,
    answered: 5,
    correct: 3,
    incorrect: 2,
    breakdown: [45, 30, 15, 10] // % for each option
  });

  const handleStart = () => {
    setGameState('playing');
    toast({
      title: 'Game Started!',
      description: 'TV display is now showing questions',
    });
  };

  const handlePause = () => {
    setGameState('paused');
    toast({
      title: 'Game Paused',
      description: 'Players can still answer current question',
    });
  };

  const handleResume = () => {
    setGameState('playing');
    toast({
      title: 'Game Resumed',
    });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowAnswer(false);
      toast({
        title: 'Next Question',
        description: `Question ${currentQuestion + 2} of ${mockQuestions.length}`,
      });
    } else {
      setGameState('finished');
      toast({
        title: 'Game Finished!',
        description: 'Showing final results',
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowAnswer(false);
      toast({
        title: 'Previous Question',
        description: `Question ${currentQuestion} of ${mockQuestions.length}`,
      });
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    toast({
      title: showAnswer ? 'Answer Hidden' : 'Answer Revealed',
    });
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
    toast({
      title: showLeaderboard ? 'Leaderboard Hidden' : 'Leaderboard Shown',
    });
  };

  const openTVDisplay = () => {
    window.open(`/tv/${gameCode}`, '_blank', 'width=1920,height=1080');
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6\">
      <div className=\"max-w-7xl mx-auto space-y-6\">
        {/* Header */}
        <div className=\"flex items-center justify-between\">
          <div className=\"flex items-center gap-4\">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className=\"h-16 w-auto object-contain\"
            />
            <div>
              <h1 className=\"text-3xl font-black\" style={{ color: branding.colors.primary }}>
                DIRECTOR CONTROL PANEL
              </h1>
              <p className=\"text-muted-foreground\">Game Code: <span className=\"font-mono font-bold\">{gameCode}</span></p>
            </div>
          </div>
          <div className=\"flex gap-2\">
            <Button variant=\"outline\" onClick={() => navigate('/host')}>
              <Home className=\"w-4 h-4 mr-2\" />
              Dashboard
            </Button>
            <Button onClick={openTVDisplay} style={{ backgroundColor: branding.colors.primary }}>
              <Tv className=\"w-4 h-4 mr-2\" />
              Open TV Display
            </Button>
          </div>
        </div>

        {/* Game Controls */}
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center justify-between\">
              <span>Game Controls</span>
              <Badge 
                variant={gameState === 'playing' ? 'default' : gameState === 'paused' ? 'secondary' : 'outline'}
                className=\"text-lg px-4 py-1\"
              >
                {gameState.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              {/* Primary Controls */}
              <div className=\"flex gap-3\">
                {gameState === 'ready' && (
                  <Button 
                    onClick={handleStart} 
                    size=\"lg\" 
                    className=\"flex-1\"
                    style={{ backgroundColor: branding.colors.primary }}
                  >
                    <Play className=\"w-5 h-5 mr-2\" />
                    Start Game
                  </Button>
                )}
                
                {gameState === 'playing' && (
                  <>
                    <Button onClick={handlePause} size=\"lg\" variant=\"outline\" className=\"flex-1\">
                      <Pause className=\"w-5 h-5 mr-2\" />
                      Pause
                    </Button>
                    <Button onClick={handleNext} size=\"lg\" className=\"flex-1\" style={{ backgroundColor: branding.colors.primary }}>
                      <SkipForward className=\"w-5 h-5 mr-2\" />
                      Next Question
                    </Button>
                  </>
                )}
                
                {gameState === 'paused' && (
                  <>
                    <Button onClick={handleResume} size=\"lg\" className=\"flex-1\" style={{ backgroundColor: branding.colors.primary }}>
                      <Play className=\"w-5 h-5 mr-2\" />
                      Resume
                    </Button>
                    <Button onClick={handleNext} size=\"lg\" variant=\"outline\" className=\"flex-1\">
                      <SkipForward className=\"w-5 h-5 mr-2\" />
                      Next
                    </Button>
                  </>
                )}
              </div>

              {/* Secondary Controls */}
              <div className=\"grid grid-cols-4 gap-3\">
                <Button onClick={handlePrevious} variant=\"outline\" disabled={currentQuestion === 0}>
                  <SkipBack className=\"w-4 h-4 mr-2\" />
                  Previous
                </Button>
                <Button onClick={toggleAnswer} variant=\"outline\">
                  {showAnswer ? <EyeOff className=\"w-4 h-4 mr-2\" /> : <Eye className=\"w-4 h-4 mr-2\" />}
                  {showAnswer ? 'Hide' : 'Show'} Answer
                </Button>
                <Button onClick={toggleLeaderboard} variant=\"outline\">
                  <Trophy className=\"w-4 h-4 mr-2\" />
                  {showLeaderboard ? 'Hide' : 'Show'} Scores
                </Button>
                <Button onClick={() => setSoundEnabled(!soundEnabled)} variant=\"outline\">
                  {soundEnabled ? <Volume2 className=\"w-4 h-4 mr-2\" /> : <VolumeX className=\"w-4 h-4 mr-2\" />}
                  Sound
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className=\"grid grid-cols-3 gap-6\">
          {/* Current Question */}
          <div className=\"col-span-2 space-y-6\">
            <Card>
              <CardHeader>
                <CardTitle className=\"flex items-center justify-between\">
                  <span>Current Question ({currentQuestion + 1}/{mockQuestions.length})</span>
                  <div className=\"flex items-center gap-2\">
                    <span className=\"text-sm font-normal text-muted-foreground\">{Math.round(progress)}% Complete</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                {/* Question Details */}
                <div className=\"bg-muted p-6 rounded-lg space-y-4\">
                  <div className=\"flex items-center gap-3\">
                    <Badge>{question.format?.replace('_', ' ')}</Badge>
                    <Badge variant=\"outline\">{question.pointValue || question.points} pts</Badge>
                    <Badge variant=\"outline\">
                      <Clock className=\"w-3 h-3 mr-1\" />
                      {question.timeLimit}s
                    </Badge>
                  </div>
                  <h3 className=\"text-2xl font-bold\">{question.question}</h3>
                </div>

                {/* Answer Options */}
                {question.options && (
                  <div className=\"space-y-2\">
                    <h4 className=\"font-semibold\">Answer Options:</h4>
                    {question.options.map((option, index) => {
                      const isCorrect = index === question.correctAnswer;
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                            isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <div className=\"flex items-center gap-3\">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className=\"font-medium\">{option}</span>
                          </div>
                          {isCorrect && (
                            <CheckCircle2 className=\"w-6 h-6 text-green-500\" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Host Notes */}
                <div className=\"bg-blue-50 border-l-4 border-blue-500 p-4\">
                  <h4 className=\"font-semibold text-blue-900 mb-1\">Host Notes:</h4>
                  <p className=\"text-sm text-blue-800\">
                    Correct answer: <strong>{question.options ? question.options[question.correctAnswer] : 'N/A'}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Live Response Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Live Player Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=\"grid grid-cols-4 gap-4 mb-6\">
                  <div className=\"text-center p-4 bg-blue-50 rounded-lg\">
                    <p className=\"text-3xl font-black text-blue-600\">{responses.answered}</p>
                    <p className=\"text-sm text-muted-foreground\">Answered</p>
                  </div>
                  <div className=\"text-center p-4 bg-green-50 rounded-lg\">
                    <p className=\"text-3xl font-black text-green-600\">{responses.correct}</p>
                    <p className=\"text-sm text-muted-foreground\">Correct</p>
                  </div>
                  <div className=\"text-center p-4 bg-red-50 rounded-lg\">
                    <p className=\"text-3xl font-black text-red-600\">{responses.incorrect}</p>
                    <p className=\"text-sm text-muted-foreground\">Incorrect</p>
                  </div>
                  <div className=\"text-center p-4 bg-gray-50 rounded-lg\">
                    <p className=\"text-3xl font-black text-gray-600\">{responses.total - responses.answered}</p>
                    <p className=\"text-sm text-muted-foreground\">Pending</p>
                  </div>
                </div>

                {/* Response Breakdown */}
                {question.options && (
                  <div className=\"space-y-2\">
                    <h4 className=\"font-semibold mb-3\">Response Distribution:</h4>
                    {question.options.map((option, index) => (
                      <div key={index} className=\"space-y-1\">
                        <div className=\"flex items-center justify-between text-sm\">
                          <span>{String.fromCharCode(65 + index)}: {option}</span>
                          <span className=\"font-bold\">{responses.breakdown[index]}%</span>
                        </div>
                        <div className=\"w-full bg-gray-200 rounded-full h-3\">
                          <div 
                            className={`h-3 rounded-full ${index === question.correctAnswer ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${responses.breakdown[index]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className=\"space-y-6\">
            {/* Connected Players */}
            <Card>
              <CardHeader>
                <CardTitle className=\"flex items-center gap-2\">
                  <Users className=\"w-5 h-5\" />
                  Players ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className=\"space-y-2 max-h-[300px] overflow-y-auto\">
                  {players.map((player) => (
                    <div key={player.id} className=\"flex items-center justify-between p-3 bg-muted rounded-lg\">
                      <div>
                        <p className=\"font-medium\">{player.name}</p>
                        <p className=\"text-sm text-muted-foreground\">{player.score} pts</p>
                      </div>
                      <div className=\"w-2 h-2 rounded-full bg-green-500\"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className=\"flex items-center gap-2\">
                  <Trophy className=\"w-5 h-5\" />
                  Top 5
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className=\"space-y-2\">
                  {mockLeaderboard.slice(0, 5).map((player) => (
                    <div key={player.rank} className=\"flex items-center gap-3 p-2\">
                      <div className=\"w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold\">
                        {player.rank}
                      </div>
                      <div className=\"flex-1\">
                        <p className=\"font-medium text-sm\">{player.name}</p>
                        <p className=\"text-xs text-muted-foreground\">{player.score} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-2\">
                <Button variant=\"outline\" className=\"w-full justify-start\">
                  <Settings className=\"w-4 h-4 mr-2\" />
                  Game Settings
                </Button>
                <Button variant=\"outline\" className=\"w-full justify-start text-red-600 hover:text-red-600\">
                  <XCircle className=\"w-4 h-4 mr-2\" />
                  End Game
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorPanel;
