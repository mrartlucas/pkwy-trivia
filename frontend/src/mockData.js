// Mock data for trivia game with multiple formats

export const mockGames = [
  {
    id: 'GAME001',
    code: 'TRIVIA',
    name: 'PKWY Trivia Night',
    host: 'DJ Mike',
    venue: 'PKWY Tavern',
    status: 'waiting',
    currentQuestion: 0,
    totalQuestions: 15,
    players: [],
    createdAt: new Date().toISOString(),
  },
];

// Jeopardy-style categories and questions
export const jeopardyCategories = [
  { id: 'cat1', name: 'History', color: 'bg-blue-700' },
  { id: 'cat2', name: 'Science', color: 'bg-blue-700' },
  { id: 'cat3', name: 'Sports', color: 'bg-blue-700' },
  { id: 'cat4', name: 'Movies', color: 'bg-blue-700' },
  { id: 'cat5', name: 'Music', color: 'bg-blue-700' },
];

export const mockQuestions = [
  // Jeopardy-style questions
  {
    id: 'Q001',
    format: 'jeopardy',
    category: 'History',
    categoryId: 'cat1',
    pointValue: 200,
    question: 'This U.S. President appears on the $20 bill',
    answer: 'Who is Andrew Jackson?',
    options: ['George Washington', 'Andrew Jackson', 'Abraham Lincoln', 'Thomas Jefferson'],
    correctAnswer: 1,
    timeLimit: 30,
  },
  {
    id: 'Q002',
    format: 'jeopardy',
    category: 'Science',
    categoryId: 'cat2',
    pointValue: 200,
    question: 'This planet is known as the Red Planet',
    answer: 'What is Mars?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    timeLimit: 30,
  },
  {
    id: 'Q003',
    format: 'jeopardy',
    category: 'Sports',
    categoryId: 'cat3',
    pointValue: 400,
    question: 'This NBA player has won the most championships',
    answer: 'Who is Bill Russell?',
    options: ['Michael Jordan', 'Bill Russell', 'LeBron James', 'Kobe Bryant'],
    correctAnswer: 1,
    timeLimit: 30,
  },
  
  // Millionaire-style questions
  {
    id: 'Q004',
    format: 'millionaire',
    difficulty: 'easy',
    pointValue: 100,
    question: 'What is the capital of France?',
    options: ['A: London', 'B: Berlin', 'C: Paris', 'D: Madrid'],
    correctAnswer: 2,
    lifelines: ['50-50', 'Ask the Audience', 'Phone a Friend'],
    timeLimit: 45,
  },
  {
    id: 'Q005',
    format: 'millionaire',
    difficulty: 'medium',
    pointValue: 500,
    question: 'Which planet is closest to the Sun?',
    options: ['A: Venus', 'B: Mercury', 'C: Mars', 'D: Earth'],
    correctAnswer: 1,
    lifelines: ['50-50', 'Ask the Audience'],
    timeLimit: 45,
  },
  
  // Family Feud-style questions
  {
    id: 'Q006',
    format: 'family_feud',
    question: 'Name a popular pizza topping',
    answers: [
      { text: 'Pepperoni', points: 45, revealed: false },
      { text: 'Mushrooms', points: 22, revealed: false },
      { text: 'Sausage', points: 15, revealed: false },
      { text: 'Onions', points: 10, revealed: false },
      { text: 'Peppers', points: 8, revealed: false },
    ],
    strikes: 0,
    maxStrikes: 3,
    timeLimit: 60,
  },
  {
    id: 'Q007',
    format: 'family_feud',
    question: 'Name something you find at the beach',
    answers: [
      { text: 'Sand', points: 38, revealed: false },
      { text: 'Water', points: 25, revealed: false },
      { text: 'Seashells', points: 18, revealed: false },
      { text: 'Towels', points: 12, revealed: false },
      { text: 'Umbrellas', points: 7, revealed: false },
    ],
    strikes: 0,
    maxStrikes: 3,
    timeLimit: 60,
  },
  
  // Majority Rules questions
  {
    id: 'Q008',
    format: 'majority_rules',
    question: 'Which is the better sport?',
    options: ['Football', 'Basketball', 'Baseball', 'Soccer'],
    correctAnswer: 'majority', // Answer is determined by majority vote
    timeLimit: 30,
  },
  
  // Last Man Standing - True/False
  {
    id: 'Q009',
    format: 'last_man_standing',
    question: 'The Great Wall of China is visible from space',
    correctAnswer: false,
    eliminates: true,
    timeLimit: 20,
  },
  {
    id: 'Q010',
    format: 'last_man_standing',
    question: 'Bananas grow on trees',
    correctAnswer: false,
    eliminates: true,
    timeLimit: 20,
  },
];

export const mockPlayers = [
  {
    id: 'P001',
    name: 'Alex Thunder',
    gameCode: 'TRIVIA',
    score: 1200,
    correctAnswers: 6,
    eliminated: false,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P002',
    name: 'Sarah Champion',
    gameCode: 'TRIVIA',
    score: 950,
    correctAnswers: 5,
    eliminated: false,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P003',
    name: 'Mike Genius',
    gameCode: 'TRIVIA',
    score: 800,
    correctAnswers: 4,
    eliminated: false,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'P004',
    name: 'Emma Swift',
    gameCode: 'TRIVIA',
    score: 650,
    correctAnswers: 4,
    eliminated: false,
    joinedAt: new Date().toISOString(),
  },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Alex Thunder', score: 1200, correctAnswers: 6, trend: 'up' },
  { rank: 2, name: 'Sarah Champion', score: 950, correctAnswers: 5, trend: 'same' },
  { rank: 3, name: 'Mike Genius', score: 800, correctAnswers: 4, trend: 'down' },
  { rank: 4, name: 'Emma Swift', score: 650, correctAnswers: 4, trend: 'up' },
];