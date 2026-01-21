/**
 * GAME NIGHT MIX Display
 * Handles multi-round games that switch between different formats
 */
import React, { useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Trophy, Star } from 'lucide-react';

// Import all game displays
import PerilDisplay from './PerilDisplay';
import SurveySaysDisplay from './SurveySaysDisplay';
import UrFinalAnswerDisplay from './UrFinalAnswerDisplay';
import LastCallStandingDisplay from './LastCallStandingDisplay';
import PickOrPassDisplay from './PickOrPassDisplay';
import LinkReactionDisplay from './LinkReactionDisplay';
import SpinToWinDisplay from './SpinToWinDisplay';
import ClosestWinsDisplay from './ClosestWinsDisplay';
import ChainedUpDisplay from './ChainedUpDisplay';
import NoWhammyDisplay from './NoWhammyDisplay';
import BackToSchoolDisplay from './BackToSchoolDisplay';
import QuizChaseDisplay from './QuizChaseDisplay';
import PKWYLiveDisplay from './PKWYLiveDisplay';

const GameNightMixDisplay = ({ 
  content, 
  currentRoundIndex = 0,
  currentQuestionIndex = 0, 
  showAnswer, 
  players = [],
  gameSpecificState = {}
}) => {
  // Get current round
  const rounds = content?.rounds || [];
  const currentRound = rounds[currentRoundIndex];
  
  // Calculate which question within the round
  const questionInRound = useMemo(() => {
    // Flatten all questions up to current index to find position in round
    let questionsBeforeCurrentRound = 0;
    for (let i = 0; i < currentRoundIndex; i++) {
      questionsBeforeCurrentRound += getRoundQuestionCount(rounds[i]);
    }
    return currentQuestionIndex - questionsBeforeCurrentRound;
  }, [rounds, currentRoundIndex, currentQuestionIndex]);

  if (!currentRound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-4 border-yellow-400 max-w-2xl">
          <CardContent className="p-12 text-center">
            <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-6" />
            <h1 className="text-5xl font-black text-white mb-4">GAME NIGHT COMPLETE!</h1>
            <p className="text-2xl text-purple-200">Thanks for playing!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Round transition screen
  if (gameSpecificState.showingRoundIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-8 animate-pulse">
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div>
            <p className="text-3xl text-purple-300 mb-4">ROUND {currentRound.round_number}</p>
            <h1 className="text-6xl font-black text-white mb-4">{currentRound.round_name}</h1>
            <p className="text-2xl text-yellow-400">{currentRound.format}</p>
          </div>
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate format display
  const format = currentRound.format;
  const roundContent = getRoundContent(currentRound);
  
  const commonProps = {
    content: roundContent,
    currentIndex: questionInRound,
    showAnswer,
    players,
    ...gameSpecificState,
  };

  // Add round header overlay
  const RoundHeader = () => (
    <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
      <p className="text-sm text-purple-300">Round {currentRound.round_number}</p>
      <p className="text-lg font-bold text-white">{currentRound.round_name}</p>
    </div>
  );

  const renderFormatDisplay = () => {
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
        return <PKWYLiveDisplay {...commonProps} playerCount={players.length} />;
    }
  };

  return (
    <div className="relative">
      <RoundHeader />
      {renderFormatDisplay()}
    </div>
  );
};

// Helper to extract round content in the format each display expects
function getRoundContent(round) {
  const format = round.format;
  
  switch (format) {
    case 'PERIL!':
      return { categories: round.categories };
    case 'SURVEY SAYS!':
      return { survey_questions: round.survey_questions };
    case 'UR FINAL ANSWER!':
    case 'LAST CALL STANDING':
    case 'BACK TO SCHOOL!':
    case 'PKWY LIVE!':
      return { questions: round.questions };
    case 'PICK OR PASS!':
      return { cases: round.cases };
    case 'LINK REACTION':
      return { questions: round.questions };
    case 'SPIN TO WIN!':
      return { puzzles: round.puzzles };
    case 'CLOSEST WINS!':
      return { numbers: round.numbers };
    case 'CHAINED UP':
      return { chains: round.chains };
    case 'NO WHAMMY!':
      return { board: round.board, spin_questions: round.spin_questions };
    case 'QUIZ CHASE':
      return { categories: round.categories };
    default:
      return { questions: round.questions || [] };
  }
}

// Helper to count questions in a round
function getRoundQuestionCount(round) {
  if (!round) return 0;
  
  switch (round.format) {
    case 'PERIL!':
      return (round.categories || []).reduce((sum, cat) => sum + (cat.clues?.length || 0), 0);
    case 'SURVEY SAYS!':
      return (round.survey_questions || []).length;
    case 'SPIN TO WIN!':
      return (round.puzzles || []).length;
    case 'CLOSEST WINS!':
      return (round.numbers || []).length;
    case 'CHAINED UP':
      return (round.chains || []).length;
    case 'NO WHAMMY!':
      return (round.spin_questions || []).length;
    case 'PICK OR PASS!':
      return (round.cases || []).length;
    case 'QUIZ CHASE':
      return (round.categories || []).reduce((sum, cat) => sum + (cat.questions?.length || 0), 0);
    default:
      return (round.questions || []).length;
  }
}

// Export helper for other components
export { getRoundQuestionCount };

export default GameNightMixDisplay;
