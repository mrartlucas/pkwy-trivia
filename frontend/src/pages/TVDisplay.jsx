import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Users, Trophy, X as XIcon, Diamond, CheckCircle2 } from 'lucide-react';
import { mockQuestions, mockLeaderboard } from '../mockData';
import { getBranding, formatThemes } from '../config/branding';

const TVDisplay = () => {
  const { gameCode } = useParams();
  const [branding, setBranding] = useState(getBranding());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameState, setGameState] = useState('lobby');
  const [showAnswer, setShowAnswer] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [strikes, setStrikes] = useState(0);
  const [usedLifelines, setUsedLifelines] = useState([]);

  const question = mockQuestions[currentQuestion];
  const format = question?.format || 'jeopardy';
  const theme = formatThemes[format];

  useEffect(() => {
    setBranding(getBranding());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (gameState === 'lobby') {
        setGameState('question');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'question' && !showAnswer) {
      const timer = setTimeout(() => {
        setShowAnswer(true);
        // Simulate revealing answers for Family Feud
        if (format === 'family_feud') {
          revealAnswersSequentially();
        }
        setTimeout(() => {
          if (currentQuestion < mockQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setShowAnswer(false);
            setRevealedAnswers([]);
            setStrikes(0);
            setUsedLifelines([]);
            setGameState('leaderboard');
            setTimeout(() => setGameState('question'), 5000);
          } else {
            setGameState('final');
          }
        }, format === 'family_feud' ? 8000 : 4000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [gameState, showAnswer, currentQuestion, format]);

  const revealAnswersSequentially = () => {
    if (format === 'family_feud' && question.answers) {
      question.answers.forEach((_, index) => {
        setTimeout(() => {
          setRevealedAnswers(prev => [...prev, index]);
        }, index * 1000);
      });
    }
  };

  // Lobby Screen
  if (gameState === 'lobby') {
    return (
      <div
