/**
 * Player Join Page - Enter game with code
 * Uses real API to join games
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { User, Hash, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { getBranding } from '../config/branding';
import { gamesApi } from '../services/api';

const PlayerJoin = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState(getBranding());

  useEffect(() => {
    setBranding(getBranding());
  }, []);

  const handleJoinGame = async (e) => {
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
    
    try {
      // Join the game via API
      const playerData = await gamesApi.join(gameCode.toUpperCase(), playerName);
      
      // Store player info
      localStorage.setItem('playerName', playerName);
      localStorage.setItem('gameCode', gameCode.toUpperCase());
      localStorage.setItem('playerId', playerData.id);
      
      toast({
        title: 'Joined Successfully!',
        description: `Welcome ${playerName}! Get ready to play.`,
      });
      
      navigate(`/player/${gameCode.toUpperCase()}`);
    } catch (err) {
      toast({
        title: 'Unable to Join',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardContent className="pt-12 pb-8 px-8">
          {/* Venue Logo and Branding */}
          <div className="text-center space-y-6 mb-8">
            <div className="flex justify-center">
              <img 
                src={branding.venue.logo} 
                alt={branding.venue.name}
                className="h-32 w-auto object-contain"
              />
            </div>
            <div>
              <h1 
                className="text-4xl font-black mb-2"
                style={{ 
                  fontFamily: branding.fonts.heading,
                  color: branding.colors.primary 
                }}
              >
                TRIVIA NIGHT
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your name and game code to play
              </p>
            </div>
          </div>
          
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
                data-testid="player-name-input"
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
                data-testid="game-code-input"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-xl font-bold transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: branding.colors.primary,
                color: branding.colors.accent,
              }}
              data-testid="join-game-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                'JOIN GAME'
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Host a game?</p>
            <Button
              variant="outline"
              onClick={() => navigate('/host')}
              className="w-full"
              data-testid="host-dashboard-btn"
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
