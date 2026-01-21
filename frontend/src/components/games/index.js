/**
 * Game Display Components Index
 * All 13 game format displays for PKWY Tavern Game Suite
 */

export { default as PerilDisplay } from './PerilDisplay';
export { default as SurveySaysDisplay } from './SurveySaysDisplay';
export { default as UrFinalAnswerDisplay } from './UrFinalAnswerDisplay';
export { default as LastCallStandingDisplay } from './LastCallStandingDisplay';
export { default as PickOrPassDisplay } from './PickOrPassDisplay';
export { default as LinkReactionDisplay } from './LinkReactionDisplay';
export { default as SpinToWinDisplay } from './SpinToWinDisplay';
export { default as ClosestWinsDisplay } from './ClosestWinsDisplay';
export { default as ChainedUpDisplay } from './ChainedUpDisplay';
export { default as NoWhammyDisplay } from './NoWhammyDisplay';
export { default as BackToSchoolDisplay } from './BackToSchoolDisplay';
export { default as QuizChaseDisplay } from './QuizChaseDisplay';
export { default as PKWYLiveDisplay } from './PKWYLiveDisplay';
export { default as GameNightMixDisplay } from './GameNightMixDisplay';

// Game format to component mapping
export const gameDisplayMap = {
  'PERIL!': 'PerilDisplay',
  'SURVEY SAYS!': 'SurveySaysDisplay',
  'UR FINAL ANSWER!': 'UrFinalAnswerDisplay',
  'LAST CALL STANDING': 'LastCallStandingDisplay',
  'PICK OR PASS!': 'PickOrPassDisplay',
  'LINK REACTION': 'LinkReactionDisplay',
  'SPIN TO WIN!': 'SpinToWinDisplay',
  'CLOSEST WINS!': 'ClosestWinsDisplay',
  'CHAINED UP': 'ChainedUpDisplay',
  'NO WHAMMY!': 'NoWhammyDisplay',
  'BACK TO SCHOOL!': 'BackToSchoolDisplay',
  'QUIZ CHASE': 'QuizChaseDisplay',
  'PKWY LIVE!': 'PKWYLiveDisplay',
  'GAME NIGHT MIX': 'GameNightMixDisplay',
};
