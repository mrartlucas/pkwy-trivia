import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Gamepad2, User, Hash } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const PlayerJoin = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinGame = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name to join the game.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!gameCode.trim()) {
      toast({
        title: 'Game Code Required',
        description: 'Please enter a valid game code.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Store player info in localStorage for mock
      localStorage.setItem('playerName', playerName);
      localStorage.setItem('gameCode', gameCode.toUpperCase());
      
      toast({
        title: 'Joined Successfully!',
        description: `Welcome ${playerName}! Get ready to play.`,
      });
      
      navigate(`/player/${gameCode.toUpperCase()}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-full">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Join the Game
          </CardTitle>
          <CardDescription className="text-base">
            Enter your name and game code to start playing
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleJoinGame} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="h-12 text-base"
                maxLength={20}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Game Code
              </label>
              <Input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="h-12 text-base uppercase font-mono tracking-wider"
                maxLength={10}
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {loading ? 'Joining...' : 'Join Game'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">Want to host a game?</p>
            <Button
              variant="outline"
              onClick={() => navigate('/host')}
              className="w-full"
            >
              Host Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerJoin;