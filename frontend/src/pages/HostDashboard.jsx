import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Play, Plus, Tv, Users, Edit, Trash2, Settings } from 'lucide-react';
import { mockGames, mockQuestions } from '../mockData';
import { toast } from '../hooks/use-toast';
import QuestionImport from '../components/QuestionImport';

const HostDashboard = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState(mockGames);
  const [questions, setQuestions] = useState(mockQuestions);
  const [createGameOpen, setCreateGameOpen] = useState(false);
  const [createQuestionOpen, setCreateQuestionOpen] = useState(false);
  
  const [newGame, setNewGame] = useState({
    name: '',
    host: '',
  });

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 100,
    timeLimit: 30,
  });

  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGame = () => {
    if (!newGame.name || !newGame.host) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const game = {
      id: `GAME${String(games.length + 1).padStart(3, '0')}`,
      code: generateGameCode(),
      name: newGame.name,
      host: newGame.host,
      status: 'waiting',
      currentQuestion: 0,
      totalQuestions: questions.length,
      players: [],
      createdAt: new Date().toISOString(),
    };

    setGames([...games, game]);
    setCreateGameOpen(false);
    setNewGame({ name: '', host: '' });
    
    toast({
      title: 'Game Created!',
      description: `Game code: ${game.code}`,
    });
  };

  const handleCreateQuestion = () => {
    if (!newQuestion.question) {
      toast({
        title: 'Missing Question',
        description: 'Please enter a question.',
        variant: 'destructive',
      });
      return;
    }

    const question = {
      id: `Q${String(questions.length + 1).padStart(3, '0')}`,
      ...newQuestion,
    };

    setQuestions([...questions, question]);
    setCreateQuestionOpen(false);
    setNewQuestion({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 100,
      timeLimit: 30,
    });
    
    toast({
      title: 'Question Added!',
      description: 'Question has been added to the pool.',
    });
  };

  const handleStartGame = (gameCode) => {
    toast({
      title: 'Game Starting!',
      description: 'Opening TV display...',
    });
    window.open(`/tv/${gameCode}`, '_blank', 'width=1920,height=1080');
  };

  const handleDeleteGame = (gameId) => {
    setGames(games.filter(g => g.id !== gameId));
    toast({
      title: 'Game Deleted',
      description: 'The game has been removed.',
    });
  };

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
            <Button
              onClick={() => navigate('/')}
              variant="outline"
            >
              Player View
            </Button>
          </div>
        </div>

        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="questions">Question Bank</TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Games</h2>
              <Dialog open={createGameOpen} onOpenChange={setCreateGameOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
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
                      <Label>Game Name</Label>
                      <Input
                        placeholder="e.g., Friday Night Trivia"
                        value={newGame.name}
                        onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Host Name</Label>
                      <Input
                        placeholder="Your name"
                        value={newGame.host}
                        onChange={(e) => setNewGame({ ...newGame, host: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateGame} className="w-full">
                      Create Game
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {games.map((game) => (
                <Card key={game.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold">{game.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            game.status === 'active' ? 'bg-green-100 text-green-700' :
                            game.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {game.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Host: {game.host}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-mono font-bold text-indigo-600">Code: {game.code}</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {game.players.length} players
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStartGame(game.code)}
                          className="gap-2"
                        >
                          <Tv className="w-4 h-4" />
                          TV Display
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                        >
                          <Settings className="w-4 h-4" />
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
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Question Bank ({questions.length})</h2>
              <Dialog open={createQuestionOpen} onOpenChange={setCreateQuestionOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>
                      Create a new question for your trivia game
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={newQuestion.type}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="fastest_finger">Fastest Finger</SelectItem>
                          <SelectItem value="survey">Survey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea
                        placeholder="Enter your question"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {newQuestion.type === 'multiple_choice' && (
                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion({ ...newQuestion, options: newOptions });
                              }}
                            />
                            <Button
                              variant={newQuestion.correctAnswer === index ? 'default' : 'outline'}
                              onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                            >
                              {newQuestion.correctAnswer === index ? 'Correct' : 'Mark Correct'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time Limit (seconds)</Label>
                        <Input
                          type="number"
                          value={newQuestion.timeLimit}
                          onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleCreateQuestion} className="w-full">
                      Add Question
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium capitalize">
                              {question.format ? question.format.replace('_', ' ') : question.type ? question.type.replace('_', ' ') : 'Question'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {question.points || question.pointValue || 100} pts • {question.timeLimit}s
                            </span>
                          </div>
                          <p className="text-lg font-medium">{question.question}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {question.type === 'multiple_choice' && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg text-sm ${
                                index === question.correctAnswer
                                  ? 'bg-green-100 text-green-700 font-medium'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;