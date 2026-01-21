/**
 * Host Dashboard - Game management interface
 * Connects to real backend API
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Play, Plus, Tv, Users, Trash2, Settings, Upload, Package, Loader2, RefreshCw, Gamepad2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { gamesApi, gamePacksApi } from '../services/api';
import MediaLibrary from '../components/MediaLibrary';

const HostDashboard = () => {
  const navigate = useNavigate();
  
  // State
  const [games, setGames] = useState([]);
  const [gamePacks, setGamePacks] = useState([]);
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createGameOpen, setCreateGameOpen] = useState(false);
  const [importPackOpen, setImportPackOpen] = useState(false);
  const [loadPackOpen, setLoadPackOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  
  const [newGame, setNewGame] = useState({
    name: '',
    host: '',
    game_format: '',
  });

  const [newPack, setNewPack] = useState({
    name: '',
    description: '',
    tags: '',
    content: '',
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [gamesData, packsData, formatsData] = await Promise.all([
        gamesApi.getAll(),
        gamePacksApi.getAll(),
        gamePacksApi.getFormats(),
      ]);
      setGames(gamesData);
      setGamePacks(packsData);
      setFormats(formatsData.formats || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create game
  const handleCreateGame = async () => {
    if (!newGame.name || !newGame.host || !newGame.game_format) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const game = await gamesApi.create({
        name: newGame.name,
        host: newGame.host,
        venue: 'PKWY Tavern',
        game_format: newGame.game_format,
      });

      setGames([...games, game]);
      setCreateGameOpen(false);
      setNewGame({ name: '', host: '', game_format: '' });
      
      toast({
        title: 'Game Created!',
        description: `Game code: ${game.code}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Import game pack
  const handleImportPack = async () => {
    if (!newPack.name || !newPack.content) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a name and JSON content.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const content = JSON.parse(newPack.content);
      const pack = await gamePacksApi.create({
        name: newPack.name,
        description: newPack.description,
        tags: newPack.tags.split(',').map(t => t.trim()).filter(Boolean),
        content,
      });

      setGamePacks([...gamePacks, pack]);
      setImportPackOpen(false);
      setNewPack({ name: '', description: '', tags: '', content: '' });
      
      toast({
        title: 'Game Pack Imported!',
        description: `Format detected: ${pack.game_format}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message === 'Unexpected token' ? 'Invalid JSON format' : err.message,
        variant: 'destructive',
      });
    }
  };

  // Load pack into game
  const handleLoadPack = async (packId) => {
    if (!selectedGame) return;

    try {
      const pack = await gamePacksApi.getById(packId);
      await gamesApi.updateContent(selectedGame.id, pack.content);
      
      toast({
        title: 'Pack Loaded!',
        description: `"${pack.name}" loaded into game`,
      });
      
      setLoadPackOpen(false);
      setSelectedGame(null);
      fetchData();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Delete game
  const handleDeleteGame = async (gameId) => {
    try {
      await gamesApi.delete(gameId);
      setGames(games.filter(g => g.id !== gameId));
      toast({
        title: 'Game Deleted',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Delete pack
  const handleDeletePack = async (packId) => {
    try {
      await gamePacksApi.delete(packId);
      setGamePacks(gamePacks.filter(p => p.id !== packId));
      toast({
        title: 'Game Pack Deleted',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Open TV Display
  const handleOpenTV = (gameCode) => {
    window.open(`/tv/${gameCode}`, '_blank', 'width=1920,height=1080');
  };

  // Open Director Panel
  const handleOpenDirector = (gameCode) => {
    window.open(`/director/${gameCode}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Host Dashboard</h1>
              <p className="text-lg text-gray-600">Create and manage your trivia games</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Player View
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="packs">Game Packs</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Games ({games.length})</h2>
              <Dialog open={createGameOpen} onOpenChange={setCreateGameOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="create-game-btn">
                    <Plus className="w-4 h-4" />
                    Create Game
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Game</DialogTitle>
                    <DialogDescription>
                      Set up a new trivia game session
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Game Format</Label>
                      <Select
                        value={newGame.game_format}
                        onValueChange={(value) => setNewGame({ ...newGame, game_format: value })}
                      >
                        <SelectTrigger data-testid="game-format-select">
                          <SelectValue placeholder="Select a game format" />
                        </SelectTrigger>
                        <SelectContent>
                          {formats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Game Name</Label>
                      <Input
                        placeholder="e.g., Friday Night Trivia"
                        value={newGame.name}
                        onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                        data-testid="game-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Host Name</Label>
                      <Input
                        placeholder="Your name"
                        value={newGame.host}
                        onChange={(e) => setNewGame({ ...newGame, host: e.target.value })}
                        data-testid="host-name-input"
                      />
                    </div>
                    <Button onClick={handleCreateGame} className="w-full" data-testid="submit-create-game">
                      Create Game
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {games.length === 0 ? (
              <Card className="p-12 text-center">
                <Gamepad2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Games Yet</h3>
                <p className="text-gray-500 mb-4">Create your first game to get started!</p>
                <Button onClick={() => setCreateGameOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Game
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {games.map((game) => (
                  <Card key={game.id} data-testid={`game-card-${game.code}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold">{game.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              game.status === 'active' ? 'bg-green-100 text-green-700' :
                              game.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                              game.status === 'finished' ? 'bg-gray-100 text-gray-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {game.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                              {game.game_format}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Host: {game.host}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-mono font-bold text-indigo-600">Code: {game.code}</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {game.players_count} players
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedGame(game);
                              setLoadPackOpen(true);
                            }}
                            variant="outline"
                            className="gap-2"
                          >
                            <Package className="w-4 h-4" />
                            Load Pack
                          </Button>
                          <Button
                            onClick={() => handleOpenDirector(game.code)}
                            variant="outline"
                            className="gap-2"
                          >
                            <Settings className="w-4 h-4" />
                            Director
                          </Button>
                          <Button
                            onClick={() => handleOpenTV(game.code)}
                            className="gap-2"
                          >
                            <Tv className="w-4 h-4" />
                            TV Display
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteGame(game.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load Pack Dialog */}
            <Dialog open={loadPackOpen} onOpenChange={setLoadPackOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Load Game Pack</DialogTitle>
                  <DialogDescription>
                    Select a game pack to load into "{selectedGame?.name}"
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {gamePacks.filter(p => p.game_format === selectedGame?.game_format).length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No packs available for {selectedGame?.game_format}. Import a pack first!
                    </p>
                  ) : (
                    gamePacks
                      .filter(p => p.game_format === selectedGame?.game_format)
                      .map((pack) => (
                        <Card 
                          key={pack.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleLoadPack(pack.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold">{pack.name}</h4>
                                <p className="text-sm text-gray-500">{pack.description}</p>
                                <div className="flex gap-2 mt-2">
                                  {pack.tags?.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button size="sm">Load</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Game Packs Tab */}
          <TabsContent value="packs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Game Packs ({gamePacks.length})</h2>
              <Dialog open={importPackOpen} onOpenChange={setImportPackOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="import-pack-btn">
                    <Upload className="w-4 h-4" />
                    Import Pack
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Import Game Pack</DialogTitle>
                    <DialogDescription>
                      Paste JSON content generated from ChatGPT
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Pack Name</Label>
                      <Input
                        placeholder="e.g., Pop Culture Pack 1"
                        value={newPack.name}
                        onChange={(e) => setNewPack({ ...newPack, name: e.target.value })}
                        data-testid="pack-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Input
                        placeholder="Brief description of this pack"
                        value={newPack.description}
                        onChange={(e) => setNewPack({ ...newPack, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        placeholder="e.g., movies, 90s, pop culture"
                        value={newPack.tags}
                        onChange={(e) => setNewPack({ ...newPack, tags: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>JSON Content</Label>
                      <Textarea
                        placeholder='Paste the JSON from ChatGPT here...'
                        value={newPack.content}
                        onChange={(e) => setNewPack({ ...newPack, content: e.target.value })}
                        rows={12}
                        className="font-mono text-sm"
                        data-testid="pack-json-input"
                      />
                    </div>
                    <Button onClick={handleImportPack} className="w-full" data-testid="submit-import-pack">
                      Import Pack
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {gamePacks.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Game Packs</h3>
                <p className="text-gray-500 mb-4">Import game content from ChatGPT to get started!</p>
                <Button onClick={() => setImportPackOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Pack
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {gamePacks.map((pack) => (
                  <Card key={pack.id} data-testid={`pack-card-${pack.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{pack.name}</CardTitle>
                          <CardDescription>{pack.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePack(pack.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {pack.game_format}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {pack.tags?.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(pack.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* ChatGPT Prompt Helper */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Generate Content with ChatGPT</CardTitle>
                <CardDescription>
                  Use the game specification prompt to generate content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Open ChatGPT and paste the game specification prompt (from your saved docs)</li>
                  <li>Tell it which game format you want: e.g., "Generate a PERIL! round about movies"</li>
                  <li>Copy the JSON output and paste it in the Import dialog above</li>
                </ol>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Example request:</p>
                  <code className="text-xs text-gray-600">
                    Generate a SURVEY SAYS! round with questions about common bar behaviors
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Library Tab */}
          <TabsContent value="media" className="space-y-6">
            <MediaLibrary />
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Documentation</CardTitle>
                <CardDescription>
                  Download complete guides and specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Complete Documentation', file: 'COMPLETE_DOCUMENTATION.md', icon: '📚' },
                    { name: 'Project Roadmap', file: 'ROADMAP.md', icon: '🗺️' },
                    { name: 'Media Organization', file: 'MEDIA_ORGANIZATION_GUIDE.md', icon: '🏷️' },
                    { name: 'Media Formats', file: 'MEDIA_FORMAT_GUIDE.md', icon: '🎨' },
                    { name: 'Video Specs', file: 'VIDEO_SPECS.md', icon: '🎬' },
                    { name: 'Backend Contracts', file: 'contracts.md', icon: '⚙️' },
                  ].map((doc) => (
                    <Card key={doc.file} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{doc.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold">{doc.name}</h4>
                            <Button
                              size="sm"
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => window.open(`/${doc.file}`, '_blank')}
                            >
                              View →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;
