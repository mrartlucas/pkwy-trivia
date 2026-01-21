/**
 * TV Display - Main game screen for bars/venues
 * Supports all 14 game formats (including GAME NIGHT MIX) with real-time WebSocket updates
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Trophy, Users, Loader2 } from 'lucide-react';
import { getBranding } from '../config/branding';
import { gamesApi, createWebSocket } from '../services/api';

// Import all game displays
import {
  PerilDisplay,
  SurveySaysDisplay,
  UrFinalAnswerDisplay,
  LastCallStandingDisplay,
  PickOrPassDisplay,
  LinkReactionDisplay,
  SpinToWinDisplay,
  ClosestWinsDisplay,
  ChainedUpDisplay,
  NoWhammyDisplay,
  BackToSchoolDisplay,
  QuizChaseDisplay,
  PKWYLiveDisplay,
  GameNightMixDisplay,
} from '../components/games';

const TVDisplay = () => {
  const { gameCode } = useParams();
  const branding = getBranding();
  
  // Game state
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayState, setDisplayState] = useState('lobby'); // lobby, question, leaderboard, final
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [ws, setWs] = useState(null);
  
  // Game-specific state
  const [gameSpecificState, setGameSpecificState] = useState({});

  // Fetch game data
  const fetchGame = useCallback(async () => {
    try {
      setLoading(true);
      const gameData = await gamesApi.getByCode(gameCode);
      setGame(gameData);
      setCurrentIndex(gameData.current_question_index || 0);
      
      if (gameData.status === 'finished') {
        setDisplayState('final');
      } else if (gameData.status === 'active') {
        setDisplayState('question');
      }
      
      // Fetch leaderboard
      const lb = await gamesApi.getLeaderboard(gameCode);
      setLeaderboard(lb);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  // WebSocket connection
  useEffect(() => {
    if (!gameCode) return;

    const socket = createWebSocket.tv(gameCode);
    
    socket.onopen = () => {
      console.log('TV WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt reconnect after 3 seconds
      setTimeout(() => {
        if (ws?.readyState === WebSocket.CLOSED) {
          setWs(createWebSocket.tv(gameCode));
        }
      }, 3000);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [gameCode]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message) => {
    const { event, data } = message;

    switch (event) {
      case 'game:started':
        setDisplayState('question');
        fetchGame();
        break;
        
      case 'game:paused':
        // Could show a pause screen
        break;
        
      case 'game:resumed':
        setDisplayState('question');
        break;
        
      case 'game:finished':
        setDisplayState('final');
        setLeaderboard(data.final_leaderboard || []);
        break;
        
      case 'question:changed':
        setCurrentIndex(data.question_index);
        setShowAnswer(false);
        setDisplayState('question');
        break;
        
      case 'answer:revealed':
        setShowAnswer(true);
        break;
        
      case 'leaderboard:update':
        setLeaderboard(data);
        setDisplayState('leaderboard');
        break;
        
      case 'display:state':
        setDisplayState(data.state);
        break;
        
      case 'player:joined':
        fetchGame(); // Refresh to get updated player count
        break;
        
      case 'survey:answer_revealed':
        setGameSpecificState(prev => ({
          ...prev,
          revealedAnswers: [...(prev.revealedAnswers || []), data.answerIndex]
        }));
        break;
        
      case 'survey:strike':
        setGameSpecificState(prev => ({
          ...prev,
          strikes: (prev.strikes || 0) + 1
        }));
        break;
        
      default:
        console.log('Unknown WebSocket event:', event);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-4 border-red-400 max-w-lg">
          <CardContent className="p-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Game Not Found</h1>
            <p className="text-xl text-red-200">{error}</p>
            <p className="text-lg text-red-300 mt-4">Code: {gameCode}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Lobby state
  if (displayState === 'lobby' || !game?.content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 flex items-center justify-center">
        <div className="text-center space-y-12 max-w-4xl w-full">
          <div className="animate-pulse">
            <img 
              src={branding.venue.logo} 
              alt={branding.venue.name}
              className="h-40 w-auto mx-auto object-contain mb-8"
            />
            <h1 className="text-8xl font-black text-white mb-4" style={{ fontFamily: branding.fonts.heading }}>
              {branding.venue.name.toUpperCase()}
            </h1>
            <p className="text-4xl text-white/90 mb-2">{branding.venue.tagline}</p>
            {game?.game_format && (
              <p className="text-5xl font-bold text-yellow-400 mt-6">{game.game_format}</p>
            )}
          </div>
          
          <Card className="bg-white/10 backdrop-blur-lg border-4 border-yellow-400">
            <CardContent className="p-12">
              <p className="text-3xl text-white/90 mb-4">Join the game with code:</p>
              <p className="text-9xl font-black font-mono tracking-wider mb-8 text-yellow-400">
                {gameCode || 'TRIVIA'}
              </p>
              <div className="flex items-center justify-center gap-4 text-4xl text-white">
                <Users className="w-14 h-14" />
                <span className="font-bold">{game?.players?.length || 0} Players Connected</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          
          <p className="text-3xl text-white/90">
            {game?.content ? 'Game ready! Waiting for host to start...' : 'Waiting for game content...'}
          </p>
        </div>
      </div>
    );
  }

  // Final standings
  if (displayState === 'final') {
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
                key={player.player_id || index}
                className={`transform transition-all duration-500 ${
                  index === 0 ? 'scale-110 bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-white'
                }`}
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
                          {player.correct_answers} correct answers
                        </p>
                      </div>
                    </div>
                    <div className={`text-6xl font-black ${
                      index === 0 ? 'text-white' : 'text-indigo-600'
                    }`}>
                      {player.score?.toLocaleString()}
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

  // Leaderboard state
  if (displayState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-7xl font-black text-white mb-4">LEADERBOARD</h1>
            <p className="text-3xl text-white/90">After Question {currentIndex + 1}</p>
          </div>
          
          <div className="grid gap-4">
            {leaderboard.slice(0, 8).map((player, index) => (
              <Card 
                key={player.player_id || index}
                className="transform transition-all duration-300 hover:scale-105 bg-white/95"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-indigo-600 w-16">
                        #{player.rank}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{player.name}</p>
                        <p className="text-lg text-gray-500">{player.correct_answers} correct</p>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-indigo-600">
                      {player.score?.toLocaleString()}
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

  // Game-specific displays
  const content = game?.content;
  const format = game?.game_format;
  const players = game?.players || [];

  const commonProps = {
    content,
    currentIndex,
    showAnswer,
    players,
    ...gameSpecificState,
  };

  switch (format) {
    case 'PERIL!':
      return <PerilDisplay {...commonProps} />;
      
    case 'SURVEY SAYS!':
      return <SurveySaysDisplay {...commonProps} />;
      
    case 'UR FINAL ANSWER!':
      return <UrFinalAnswerDisplay {...commonProps} />;
      
    case 'LAST CALL STANDING':
      return <LastCallStandingDisplay {...commonProps} />;
      
    case 'PICK OR PASS!':
      return <PickOrPassDisplay {...commonProps} />;
      
    case 'LINK REACTION':
      return <LinkReactionDisplay {...commonProps} />;
      
    case 'SPIN TO WIN!':
      return <SpinToWinDisplay {...commonProps} />;
      
    case 'CLOSEST WINS!':
      return <ClosestWinsDisplay {...commonProps} />;
      
    case 'CHAINED UP':
      return <ChainedUpDisplay {...commonProps} />;
      
    case 'NO WHAMMY!':
      return <NoWhammyDisplay {...commonProps} />;
      
    case 'BACK TO SCHOOL!':
      return <BackToSchoolDisplay {...commonProps} />;
      
    case 'QUIZ CHASE':
      return <QuizChaseDisplay {...commonProps} />;
      
    case 'PKWY LIVE!':
      return <PKWYLiveDisplay {...commonProps} playerCount={players.length} />;
      
    default:
      // Fallback to lobby if format unknown
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <Card className="bg-white/10 backdrop-blur-lg border-4 border-yellow-400 max-w-lg">
            <CardContent className="p-12 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Unknown Game Format</h1>
              <p className="text-xl text-gray-300">{format || 'No format specified'}</p>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default TVDisplay;
