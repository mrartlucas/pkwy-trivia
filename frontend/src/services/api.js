/**
 * API Service for PKWY Tavern Game Suite
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
}

// ============================================================
// Games API
// ============================================================

export const gamesApi = {
  // Create a new game
  create: async (data) => {
    const response = await fetch(`${API_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Get all games
  getAll: async (status = null) => {
    const url = status 
      ? `${API_URL}/api/games?status_filter=${status}`
      : `${API_URL}/api/games`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get game by code
  getByCode: async (gameCode) => {
    const response = await fetch(`${API_URL}/api/games/code/${gameCode}`);
    return handleResponse(response);
  },

  // Get game by ID
  getById: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}`);
    return handleResponse(response);
  },

  // Start game
  start: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}/start`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Pause game
  pause: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}/pause`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Resume game
  resume: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}/resume`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Finish game
  finish: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}/finish`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Next question
  nextQuestion: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}/next-question`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Update game content
  updateContent: async (gameId, content) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}/content`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    return handleResponse(response);
  },

  // Delete game
  delete: async (gameId) => {
    const response = await fetch(`${API_URL}/api/games/${gameId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Join game as player
  join: async (gameCode, playerName) => {
    const response = await fetch(`${API_URL}/api/games/${gameCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName, game_code: gameCode }),
    });
    return handleResponse(response);
  },

  // Get players in game
  getPlayers: async (gameCode) => {
    const response = await fetch(`${API_URL}/api/games/${gameCode}/players`);
    return handleResponse(response);
  },

  // Get leaderboard
  getLeaderboard: async (gameCode) => {
    const response = await fetch(`${API_URL}/api/games/${gameCode}/leaderboard`);
    return handleResponse(response);
  },

  // Update player score
  updateScore: async (gameCode, playerId, points, correct = true) => {
    const response = await fetch(
      `${API_URL}/api/games/${gameCode}/players/${playerId}/score?points=${points}&correct=${correct}`,
      { method: 'PATCH' }
    );
    return handleResponse(response);
  },
};

// ============================================================
// Game Packs API
// ============================================================

export const gamePacksApi = {
  // Create game pack from JSON
  create: async (data) => {
    const response = await fetch(`${API_URL}/api/game-packs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Upload game pack file
  upload: async (file, name = '', description = '', tags = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (tags) formData.append('tags', tags);

    const response = await fetch(`${API_URL}/api/game-packs/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  // Get all game packs
  getAll: async (gameFormat = null, tag = null) => {
    const params = new URLSearchParams();
    if (gameFormat) params.append('game_format', gameFormat);
    if (tag) params.append('tag', tag);
    
    const url = params.toString() 
      ? `${API_URL}/api/game-packs?${params}`
      : `${API_URL}/api/game-packs`;
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get available formats
  getFormats: async () => {
    const response = await fetch(`${API_URL}/api/game-packs/formats`);
    return handleResponse(response);
  },

  // Get single game pack
  getById: async (packId) => {
    const response = await fetch(`${API_URL}/api/game-packs/${packId}`);
    return handleResponse(response);
  },

  // Update game pack
  update: async (packId, data) => {
    const response = await fetch(`${API_URL}/api/game-packs/${packId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete game pack
  delete: async (packId) => {
    const response = await fetch(`${API_URL}/api/game-packs/${packId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Duplicate game pack
  duplicate: async (packId, newName = null) => {
    const url = newName 
      ? `${API_URL}/api/game-packs/${packId}/duplicate?new_name=${encodeURIComponent(newName)}`
      : `${API_URL}/api/game-packs/${packId}/duplicate`;
    
    const response = await fetch(url, { method: 'POST' });
    return handleResponse(response);
  },
};

// ============================================================
// Answers API
// ============================================================

export const answersApi = {
  submit: async (data) => {
    const response = await fetch(`${API_URL}/api/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ============================================================
// WebSocket Connection Helper
// ============================================================

export const createWebSocket = {
  director: (gameCode) => {
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    return new WebSocket(`${wsUrl}/ws/director/${gameCode}`);
  },

  tv: (gameCode) => {
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    return new WebSocket(`${wsUrl}/ws/tv/${gameCode}`);
  },

  player: (gameCode, playerId) => {
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    return new WebSocket(`${wsUrl}/ws/player/${gameCode}/${playerId}`);
  },
};

export default {
  games: gamesApi,
  gamePacks: gamePacksApi,
  answers: answersApi,
  createWebSocket,
};
