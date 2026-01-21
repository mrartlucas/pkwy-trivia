import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Upload, Download, PackagePlus, FileJson, FileSpreadsheet, 
  CheckCircle2, XCircle, AlertCircle, Eye, Trash2
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const QuestionImport = ({ onImportComplete }) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [importFormat, setImportFormat] = useState('csv');
  const [validationErrors, setValidationErrors] = useState([]);

  // Sample CSV template structure
  const csvTemplate = `format,category,question,option_a,option_b,option_c,option_d,correct_answer,points,time_limit
jeopardy,History,Who was the first President of the United States?,George Washington,John Adams,Thomas Jefferson,Benjamin Franklin,0,200,30
jeopardy,Science,What is the chemical symbol for gold?,Au,Ag,Fe,Cu,0,200,30
millionaire,Geography,What is the capital of Australia?,Sydney,Melbourne,Canberra,Brisbane,2,500,45
family_feud,Entertainment,Name a popular streaming service,Netflix,Hulu,Disney+,Amazon Prime,0,100,60`;

  // Sample JSON template structure
  const jsonTemplate = {
    questions: [
      {
        format: "jeopardy",
        category: "History",
        question: "Who was the first President of the United States?",
        options: ["George Washington", "John Adams", "Thomas Jefferson", "Benjamin Franklin"],
        correctAnswer: 0,
        points: 200,
        timeLimit: 30
      },
      {
        format: "millionaire",
        difficulty: "easy",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        points: 100,
        timeLimit: 45
      }
    ]
  };

  // Pre-built game packs
  const gamePacks = [
    {
      id: 'general-knowledge',
      name: 'General Knowledge Pack',
      description: '50 questions across various topics',
      format: 'Mixed',
      questionCount: 50,
      categories: ['History', 'Science', 'Geography', 'Pop Culture'],
      icon: '🧠'
    },
    {
      id: 'jeopardy-classics',
      name: 'Jeopardy Classics',
      description: 'Classic Jeopardy-style categories',
      format: 'Jeopardy',
      questionCount: 30,
      categories: ['History', 'Science', 'Literature', 'Movies', 'Sports'],
      icon: '💡'
    },
    {
      id: 'millionaire-challenge',
      name: 'Millionaire Challenge',
      description: 'Progressive difficulty questions',
      format: 'Millionaire',
      questionCount: 15,
      categories: ['Mixed'],
      icon: '💰'
    },
    {
      id: 'family-feud-fun',
      name: 'Family Feud Fun',
      description: 'Survey-style questions',
      format: 'Family Feud',
      questionCount: 20,
      categories: ['Surveys'],
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'sports-trivia',
      name: 'Sports Trivia Pack',
      description: '40 sports questions',
      format: 'Mixed',
      questionCount: 40,
      categories: ['NFL', 'NBA', 'MLB', 'Soccer', 'Olympics'],
      icon: '⚽'
    },
    {
      id: 'movie-madness',
      name: 'Movie Madness',
      description: 'Film and TV questions',
      format: 'Mixed',
      questionCount: 35,
      categories: ['Movies', 'TV Shows', 'Actors', 'Directors'],
      icon: '🎬'
    },
    {
      id: 'music-masters',
      name: 'Music Masters',
      description: 'Music trivia across decades',
      format: 'Mixed',
      questionCount: 30,
      categories: ['Rock', 'Pop', 'Hip Hop', 'Classical'],
      icon: '🎵'
    },
    {
      id: 'bar-classics',
      name: 'Bar Trivia Classics',
      description: 'Perfect for pub nights',
      format: 'Mixed',
      questionCount: 50,
      categories: ['Beer', 'Food', 'Local History', 'Pop Culture'],
      icon: '🍺'
    }
  ];

  const downloadTemplate = (format) => {
    if (format === 'csv') {
      const blob = new Blob([csvTemplate], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'question_template.csv';
      a.click();
      toast({ title: 'Template Downloaded', description: 'CSV template downloaded successfully' });
    } else {
      const blob = new Blob([JSON.stringify(jsonTemplate, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'question_template.json';
      a.click();
      toast({ title: 'Template Downloaded', description: 'JSON template downloaded successfully' });
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const questions = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const question = {
        format: values[0],
        category: values[1],
        question: values[2],
        options: [values[3], values[4], values[5], values[6]],
        correctAnswer: parseInt(values[7]),
        points: parseInt(values[8]) || 100,
        timeLimit: parseInt(values[9]) || 30
      };
      questions.push(question);
    }
    
    return questions;
  };

  const validateQuestions = (questions) => {
    const errors = [];
    
    questions.forEach((q, index) => {
      if (!q.question || q.question.trim() === '') {
        errors.push({ line: index + 1, error: 'Question text is required' });
      }
      if (!q.options || q.options.length < 2) {
        errors.push({ line: index + 1, error: 'At least 2 options required' });
      }
      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        errors.push({ line: index + 1, error: 'Invalid correct answer index' });
      }
    });
    
    return errors;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let questions;
        
        if (file.name.endsWith('.csv')) {
          questions = parseCSV(e.target.result);
        } else if (file.name.endsWith('.json')) {
          const data = JSON.parse(e.target.result);
          questions = data.questions || data;
        }
        
        const errors = validateQuestions(questions);
        setValidationErrors(errors);
        setPreviewData(questions);
        
        if (errors.length === 0) {
          toast({ 
            title: 'File Loaded Successfully', 
            description: `${questions.length} questions ready to import` 
          });
        } else {
          toast({ 
            title: 'Validation Errors Found', 
            description: `${errors.length} errors need to be fixed`,
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({ 
          title: 'Import Failed', 
          description: 'Invalid file format',
          variant: 'destructive'
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (validationErrors.length > 0) {
      toast({ 
        title: 'Cannot Import', 
        description: 'Please fix validation errors first',
        variant: 'destructive'
      });
      return;
    }
    
    // In real implementation, this would call the backend API
    onImportComplete && onImportComplete(previewData);
    toast({ 
      title: 'Import Successful!', 
      description: `${previewData.length} questions added to library` 
    });
    setImportDialogOpen(false);
    setPreviewData(null);
  };

  const loadGamePack = (packId) => {
    // In real implementation, this would fetch from backend
    toast({ 
      title: 'Game Pack Loaded', 
      description: 'Questions added to your library',
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Import Questions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Questions</DialogTitle>
              <DialogDescription>
                Upload a CSV or JSON file with your questions
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="templates">Download Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Click to upload</p>
                        <p className="text-sm text-muted-foreground">CSV or JSON files accepted</p>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Preview */}
                {previewData && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Preview ({previewData.length} questions)</h3>
                      {validationErrors.length === 0 ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          {validationErrors.length} Errors
                        </Badge>
                      )}
                    </div>

                    {/* Errors */}
                    {validationErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-red-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Validation Errors
                        </h4>
                        {validationErrors.slice(0, 5).map((error, i) => (
                          <p key={i} className="text-sm text-red-700">
                            Line {error.line}: {error.error}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Preview Table */}
                    <div className="border rounded-lg max-h-96 overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="p-2 text-left">Format</th>
                            <th className="p-2 text-left">Question</th>
                            <th className="p-2 text-left">Options</th>
                            <th className="p-2 text-left">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 10).map((q, i) => (
                            <tr key={i} className="border-t">
                              <td className="p-2">
                                <Badge variant="outline">{q.format}</Badge>
                              </td>
                              <td className="p-2">{q.question.substring(0, 50)}...</td>
                              <td className="p-2 text-xs">{q.options.length} options</td>
                              <td className="p-2">{q.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Import Button */}
                    <Button 
                      onClick={handleImport} 
                      disabled={validationErrors.length > 0}
                      className="w-full"
                    >
                      Import {previewData.length} Questions
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download a template to see the required format for importing questions
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => downloadTemplate('csv')}>
                    <CardContent className="p-6 text-center space-y-3">
                      <FileSpreadsheet className="w-12 h-12 mx-auto text-green-600" />
                      <div>
                        <h3 className="font-semibold">CSV Template</h3>
                        <p className="text-sm text-muted-foreground">Excel compatible</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => downloadTemplate('json')}>
                    <CardContent className="p-6 text-center space-y-3">
                      <FileJson className="w-12 h-12 mx-auto text-blue-600" />
                      <div>
                        <h3 className="font-semibold">JSON Template</h3>
                        <p className="text-sm text-muted-foreground">Developer friendly</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Game Packs Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5" />
            Game Pack Library
          </CardTitle>
          <CardDescription>
            Pre-built question sets ready to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gamePacks.map((pack) => (
              <Card key={pack.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="text-4xl text-center">{pack.icon}</div>
                  <div>
                    <h3 className="font-bold">{pack.name}</h3>
                    <p className="text-xs text-muted-foreground">{pack.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{pack.format}</Badge>
                    <span className="text-muted-foreground">{pack.questionCount} questions</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => loadGamePack(pack.id)}
                    >
                      Load Pack
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionImport;
