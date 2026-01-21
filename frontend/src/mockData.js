// Mock data for trivia game

export const mockGames = [
  {
    id: 'GAME001',
    code: 'TRIVIA',
    name: 'Bar Trivia Night',
    host: 'DJ Mike',
    status: 'waiting', // waiting, active, finished
    currentQuestion: 0,
    totalQuestions: 10,
    players: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'GAME002',
    code: 'QUIZ42',
    name: 'Corporate Challenge',
    host: 'Sarah Johnson',
    status: 'active',
    currentQuestion: 3,
    totalQuestions: 15,
    players: [],
    createdAt: new Date().toISOString(),
  },
];

export const mockQuestions = [
  {
    id: 'Q001',
    type: 'multiple_choice',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    points: 100,
    timeLimit: 30,
  },
  {
    id: 'Q002',
    type: 'true_false',
    question: 'The Great Wall of China is visible from space.',
    correctAnswer: false,
    points: 100,
    timeLimit: 20,
  },
  {
    id: 'Q003',
    type: 'multiple_choice',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    points: 150,
    timeLimit: 25,
  },
  {
    id: 'Q004',
    type: 'fastest_finger',
    question: 'First to buzz: What year did World War II end?',
    correctAnswer: '1945',
    points: 200,
    timeLimit: 15,
  },
  {
    id: 'Q005',
    type: 'survey',
    question: 'Name a popular pizza topping',
    answers: [
      { text: 'Pepperoni', points: 45 },
      { text: 'Mushrooms', points: 22 },
      { text: 'Sausage', points: 15 },
      { text: 'Onions', points: 10 },
      { text: 'Peppers', points: 8 },
    ],
    totalPoints: 100,
    timeLimit: 40,
  },
  {
    id: 'Q006',
    type: 'multiple_choice',
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    correctAnswer: 1,
    points: 100,
    timeLimit: 30,
  },
  {
    id: 'Q007',
    type: 'true_false',
    question: 'Bananas grow on trees.',
    correctAnswer: false,
    points: 100,
    timeLimit: 20,
  },
  {
    id: 'Q008',
    type: 'multiple_choice',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
    points: 100,
    timeLimit: 25,
  },
  {
    id: 'Q009',
    type: 'fastest_finger',
    question: 'First to buzz: How many continents are there?',
    correctAnswer: '7',
    points: 200,
    timeLimit: 15,
  },
  {
    id: 'Q010',
    type: 'survey',
    question: 'Name a popular social media platform',
    answers: [
      { text: 'Facebook', points: 35 },
      { text: 'Instagram', points: 28 },
      { text: 'Twitter/X', points: 18 },
      { text: 'TikTok', points: 12 },
      { text: 'LinkedIn', points: 7 },
    ],
    totalPoints: 100,
    timeLimit: 40,
  },
];

export const mockPlayers = [
  {
    id: 'P001',
    name: 'Alex Thunder',
    gameCode: 'QUIZ42',
    score: 450,
    correctAnswers: 5,
    fastestBuzzer: true,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P002',
    name: 'Sarah Champion',
    gameCode: 'QUIZ42',
    score: 380,
    correctAnswers: 4,
    fastestBuzzer: false,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P003',
    name: 'Mike Genius',
    gameCode: 'QUIZ42',
    score: 320,
    correctAnswers: 4,
    fastestBuzzer: false,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P004',
    name: 'Emma Swift',
    gameCode: 'QUIZ42',
    score: 290,
    correctAnswers: 3,
    fastestBuzzer: false,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P005',
    name: 'David Brain',
    gameCode: 'QUIZ42',
    score: 250,
    correctAnswers: 3,
    fastestBuzzer: false,
    joinedAt: new Date().toISOString(),
  },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Alex Thunder', score: 450, correctAnswers: 5, trend: 'up' },
  { rank: 2, name: 'Sarah Champion', score: 380, correctAnswers: 4, trend: 'same' },
  { rank: 3, name: 'Mike Genius', score: 320, correctAnswers: 4, trend: 'down' },
  { rank: 4, name: 'Emma Swift', score: 290, correctAnswers: 3, trend: 'up' },
  { rank: 5, name: 'David Brain', score: 250, correctAnswers: 3, trend: 'same' },
  { rank: 6, name: 'Lisa Smart', score: 220, correctAnswers: 3, trend: 'up' },
  { rank: 7, name: 'Tom Quick', score: 180, correctAnswers: 2, trend: 'down' },
  { rank: 8, name: 'Nina Flash', score: 150, correctAnswers: 2, trend: 'same' },
];

// Game state management helper
export const getGameState = (gameCode) => {
  const game = mockGames.find(g => g.code === gameCode);
  if (!game) return null;
  
  return {
    ...game,
    players: mockPlayers.filter(p => p.gameCode === gameCode),
    currentQuestionData: mockQuestions[game.currentQuestion] || null,
  };
};