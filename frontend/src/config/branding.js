// White-label branding configuration
// This will be fetched from backend in production

export const defaultBranding = {
  venue: {
    name: 'PKWY Tavern',
    tagline: 'Taphouse and Grille',
    logo: 'https://customer-assets.emergentagent.com/job_brainbrawl-game/artifacts/2vpj2std_PKWY_Logo_Generic.webp',
  },
  colors: {
    primary: '#006838', // PKWY Green
    secondary: '#004d29', // Darker Green
    accent: '#ffffff', // White
    text: '#000000',
    textLight: '#666666',
  },
  fonts: {
    heading: '"Impact", "Arial Black", sans-serif',
    body: '"Arial", sans-serif',
  },
};

// Game show format themes
export const formatThemes = {
  jeopardy: {
    name: 'Knowledge Challenge',
    bgColor: 'from-blue-900 via-blue-800 to-blue-900',
    boardColor: 'bg-blue-900',
    cellColor: 'bg-blue-700',
    textColor: 'text-yellow-400',
    accentColor: 'text-blue-400',
  },
  millionaire: {
    name: 'Million Dollar Question',
    bgColor: 'from-purple-900 via-indigo-900 to-purple-900',
    boardColor: 'bg-gradient-to-r from-purple-800 to-indigo-800',
    cellColor: 'bg-purple-700',
    textColor: 'text-orange-400',
    accentColor: 'text-purple-400',
  },
  family_feud: {
    name: 'Survey Says',
    bgColor: 'from-red-800 via-orange-700 to-yellow-600',
    boardColor: 'bg-gradient-to-r from-red-700 to-orange-600',
    cellColor: 'bg-red-600',
    textColor: 'text-yellow-300',
    accentColor: 'text-red-400',
  },
  majority_rules: {
    name: 'Crowd Control',
    bgColor: 'from-green-800 via-emerald-700 to-teal-700',
    boardColor: 'bg-gradient-to-r from-green-700 to-teal-600',
    cellColor: 'bg-green-600',
    textColor: 'text-green-100',
    accentColor: 'text-green-400',
  },
  last_man_standing: {
    name: 'Elimination Round',
    bgColor: 'from-gray-900 via-slate-800 to-gray-900',
    boardColor: 'bg-gradient-to-r from-gray-800 to-slate-700',
    cellColor: 'bg-gray-700',
    textColor: 'text-red-400',
    accentColor: 'text-gray-400',
  },
};

// Get current branding (from localStorage or API)
export const getBranding = () => {
  try {
    const stored = localStorage.getItem('venue_branding');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading branding:', e);
  }
  return defaultBranding;
};

// Save branding configuration
export const saveBranding = (branding) => {
  localStorage.setItem('venue_branding', JSON.stringify(branding));
};