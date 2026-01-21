"""
PKWY Tavern Game Suite - Backend API Tests
Tests all game and game pack CRUD operations
"""
import pytest
import requests
import os
import json
import uuid

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test data prefix for cleanup
TEST_PREFIX = "TEST_"


class TestHealthEndpoints:
    """Health check endpoint tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["status"] == "running"
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"


class TestGameFormats:
    """Game formats endpoint tests"""
    
    def test_get_all_formats(self):
        """Test GET /api/game-packs/formats returns all 13 game formats"""
        response = requests.get(f"{BASE_URL}/api/game-packs/formats")
        assert response.status_code == 200
        data = response.json()
        assert "formats" in data
        formats = data["formats"]
        assert len(formats) == 13
        
        # Verify all expected formats are present
        expected_formats = [
            "PERIL!", "SURVEY SAYS!", "UR FINAL ANSWER!", "LAST CALL STANDING",
            "PICK OR PASS!", "LINK REACTION", "SPIN TO WIN!", "CLOSEST WINS!",
            "CHAINED UP", "NO WHAMMY!", "BACK TO SCHOOL!", "QUIZ CHASE", "PKWY LIVE!"
        ]
        format_values = [f["value"] for f in formats]
        for expected in expected_formats:
            assert expected in format_values, f"Missing format: {expected}"


class TestGamesCRUD:
    """Game CRUD operations tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.created_game_ids = []
        yield
        # Cleanup created games
        for game_id in self.created_game_ids:
            try:
                requests.delete(f"{BASE_URL}/api/games/{game_id}")
            except:
                pass
    
    def test_get_all_games(self):
        """Test GET /api/games returns list of games"""
        response = requests.get(f"{BASE_URL}/api/games")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_game(self):
        """Test POST /api/games creates a new game"""
        game_data = {
            "name": f"{TEST_PREFIX}Test Game {uuid.uuid4().hex[:6]}",
            "host": "Test Host",
            "venue": "Test Venue",
            "game_format": "PERIL!"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/games",
            json=game_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 201
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert "code" in data
        assert len(data["code"]) == 6  # Game codes are 6 characters
        assert data["name"] == game_data["name"]
        assert data["host"] == game_data["host"]
        assert data["game_format"] == game_data["game_format"]
        assert data["status"] == "waiting"
        
        self.created_game_ids.append(data["id"])
        
        # Verify game was persisted by fetching it
        get_response = requests.get(f"{BASE_URL}/api/games/{data['id']}")
        assert get_response.status_code == 200
        fetched_game = get_response.json()
        assert fetched_game["name"] == game_data["name"]
    
    def test_get_game_by_code(self):
        """Test GET /api/games/code/{code} returns game"""
        # First create a game
        game_data = {
            "name": f"{TEST_PREFIX}Code Test Game",
            "host": "Test Host",
            "venue": "Test Venue",
            "game_format": "SURVEY SAYS!"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/games",
            json=game_data,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 201
        created_game = create_response.json()
        self.created_game_ids.append(created_game["id"])
        
        # Get by code
        response = requests.get(f"{BASE_URL}/api/games/code/{created_game['code']}")
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == created_game["code"]
        assert data["name"] == game_data["name"]
    
    def test_get_game_by_code_not_found(self):
        """Test GET /api/games/code/{code} returns 404 for invalid code"""
        response = requests.get(f"{BASE_URL}/api/games/code/XXXXXX")
        assert response.status_code == 404
    
    def test_delete_game(self):
        """Test DELETE /api/games/{id} removes game"""
        # Create a game
        game_data = {
            "name": f"{TEST_PREFIX}Delete Test Game",
            "host": "Test Host",
            "venue": "Test Venue",
            "game_format": "PERIL!"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/games",
            json=game_data,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 201
        game_id = create_response.json()["id"]
        
        # Delete the game
        delete_response = requests.delete(f"{BASE_URL}/api/games/{game_id}")
        assert delete_response.status_code == 200
        
        # Verify game is deleted
        get_response = requests.get(f"{BASE_URL}/api/games/{game_id}")
        assert get_response.status_code == 404


class TestGameLifecycle:
    """Game lifecycle (start, pause, resume, finish) tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Create a test game for lifecycle tests"""
        game_data = {
            "name": f"{TEST_PREFIX}Lifecycle Test Game",
            "host": "Test Host",
            "venue": "Test Venue",
            "game_format": "PERIL!"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/games",
            json=game_data,
            headers={"Content-Type": "application/json"}
        )
        self.game = response.json()
        yield
        # Cleanup
        try:
            requests.delete(f"{BASE_URL}/api/games/{self.game['id']}")
        except:
            pass
    
    def test_start_game(self):
        """Test PATCH /api/games/{id}/start"""
        response = requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/start")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        
        # Verify status persisted
        get_response = requests.get(f"{BASE_URL}/api/games/{self.game['id']}")
        assert get_response.json()["status"] == "active"
    
    def test_pause_game(self):
        """Test PATCH /api/games/{id}/pause"""
        # First start the game
        requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/start")
        
        # Then pause
        response = requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/pause")
        assert response.status_code == 200
        assert response.json()["status"] == "paused"
    
    def test_resume_game(self):
        """Test PATCH /api/games/{id}/resume"""
        # Start then pause
        requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/start")
        requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/pause")
        
        # Resume
        response = requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/resume")
        assert response.status_code == 200
        assert response.json()["status"] == "active"
    
    def test_finish_game(self):
        """Test PATCH /api/games/{id}/finish"""
        requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/start")
        
        response = requests.patch(f"{BASE_URL}/api/games/{self.game['id']}/finish")
        assert response.status_code == 200
        assert response.json()["status"] == "finished"


class TestPlayerJoin:
    """Player join game tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Create a test game for player tests"""
        game_data = {
            "name": f"{TEST_PREFIX}Player Test Game",
            "host": "Test Host",
            "venue": "Test Venue",
            "game_format": "PERIL!"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/games",
            json=game_data,
            headers={"Content-Type": "application/json"}
        )
        self.game = response.json()
        yield
        # Cleanup
        try:
            requests.delete(f"{BASE_URL}/api/games/{self.game['id']}")
        except:
            pass
    
    def test_player_join_game(self):
        """Test POST /api/games/{code}/join"""
        player_data = {
            "name": f"{TEST_PREFIX}Player1",
            "game_code": self.game["code"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/games/{self.game['code']}/join",
            json=player_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["name"] == player_data["name"]
        assert data["game_code"] == self.game["code"]
        assert data["score"] == 0
        
        # Verify player was added to game
        game_response = requests.get(f"{BASE_URL}/api/games/{self.game['id']}")
        game_data = game_response.json()
        assert len(game_data["players"]) == 1
        assert game_data["players"][0]["name"] == player_data["name"]
    
    def test_player_duplicate_name_rejected(self):
        """Test duplicate player names are rejected"""
        player_data = {
            "name": f"{TEST_PREFIX}DuplicatePlayer",
            "game_code": self.game["code"]
        }
        
        # First join
        response1 = requests.post(
            f"{BASE_URL}/api/games/{self.game['code']}/join",
            json=player_data,
            headers={"Content-Type": "application/json"}
        )
        assert response1.status_code == 200
        
        # Second join with same name should fail
        response2 = requests.post(
            f"{BASE_URL}/api/games/{self.game['code']}/join",
            json=player_data,
            headers={"Content-Type": "application/json"}
        )
        assert response2.status_code == 400
    
    def test_get_players(self):
        """Test GET /api/games/{code}/players"""
        # Add some players
        for i in range(3):
            requests.post(
                f"{BASE_URL}/api/games/{self.game['code']}/join",
                json={"name": f"{TEST_PREFIX}Player{i}", "game_code": self.game["code"]},
                headers={"Content-Type": "application/json"}
            )
        
        response = requests.get(f"{BASE_URL}/api/games/{self.game['code']}/players")
        assert response.status_code == 200
        players = response.json()
        assert len(players) == 3
    
    def test_get_leaderboard(self):
        """Test GET /api/games/{code}/leaderboard"""
        # Add a player
        requests.post(
            f"{BASE_URL}/api/games/{self.game['code']}/join",
            json={"name": f"{TEST_PREFIX}LeaderboardPlayer", "game_code": self.game["code"]},
            headers={"Content-Type": "application/json"}
        )
        
        response = requests.get(f"{BASE_URL}/api/games/{self.game['code']}/leaderboard")
        assert response.status_code == 200
        leaderboard = response.json()
        assert isinstance(leaderboard, list)
        if len(leaderboard) > 0:
            assert "rank" in leaderboard[0]
            assert "name" in leaderboard[0]
            assert "score" in leaderboard[0]


class TestGamePacksCRUD:
    """Game packs CRUD operations tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.created_pack_ids = []
        yield
        # Cleanup created packs
        for pack_id in self.created_pack_ids:
            try:
                requests.delete(f"{BASE_URL}/api/game-packs/{pack_id}")
            except:
                pass
    
    def test_get_all_game_packs(self):
        """Test GET /api/game-packs returns list of packs"""
        response = requests.get(f"{BASE_URL}/api/game-packs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_game_pack(self):
        """Test POST /api/game-packs creates a new pack"""
        pack_data = {
            "name": f"{TEST_PREFIX}Test Pack {uuid.uuid4().hex[:6]}",
            "description": "Test pack description",
            "tags": ["test", "automated"],
            "content": {
                "game_name": "PERIL!",
                "categories": [
                    {
                        "category_title": "Test Category",
                        "clues": [
                            {
                                "value": 100,
                                "difficulty": 1,
                                "clue_text": "Test clue",
                                "correct_answer": "Test answer",
                                "wrong_answers": ["Wrong 1", "Wrong 2", "Wrong 3"]
                            }
                        ]
                    }
                ]
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/game-packs",
            json=pack_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 201
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["name"] == pack_data["name"]
        assert data["description"] == pack_data["description"]
        assert data["game_format"] == "PERIL!"  # Auto-detected from content
        assert data["tags"] == pack_data["tags"]
        
        self.created_pack_ids.append(data["id"])
        
        # Verify pack was persisted
        get_response = requests.get(f"{BASE_URL}/api/game-packs/{data['id']}")
        assert get_response.status_code == 200
        fetched_pack = get_response.json()
        assert fetched_pack["name"] == pack_data["name"]
        assert "content" in fetched_pack
    
    def test_create_survey_says_pack(self):
        """Test creating a SURVEY SAYS! game pack"""
        pack_data = {
            "name": f"{TEST_PREFIX}Survey Pack",
            "description": "Survey Says test pack",
            "tags": ["survey"],
            "content": {
                "game_name": "SURVEY SAYS!",
                "survey_questions": [
                    {
                        "question": "Name something people do at a bar",
                        "answers": [
                            {"answer": "Drink", "percent": 45},
                            {"answer": "Socialize", "percent": 30},
                            {"answer": "Watch TV", "percent": 15},
                            {"answer": "Play games", "percent": 10}
                        ]
                    }
                ]
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/game-packs",
            json=pack_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["game_format"] == "SURVEY SAYS!"
        self.created_pack_ids.append(data["id"])
    
    def test_get_game_pack_by_id(self):
        """Test GET /api/game-packs/{id} returns full pack with content"""
        # Create a pack first
        pack_data = {
            "name": f"{TEST_PREFIX}Get By ID Pack",
            "description": "Test",
            "tags": [],
            "content": {
                "game_name": "PERIL!",
                "categories": []
            }
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/game-packs",
            json=pack_data,
            headers={"Content-Type": "application/json"}
        )
        pack_id = create_response.json()["id"]
        self.created_pack_ids.append(pack_id)
        
        # Get by ID
        response = requests.get(f"{BASE_URL}/api/game-packs/{pack_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == pack_id
        assert "content" in data
    
    def test_delete_game_pack(self):
        """Test DELETE /api/game-packs/{id} removes pack"""
        # Create a pack
        pack_data = {
            "name": f"{TEST_PREFIX}Delete Pack",
            "description": "To be deleted",
            "tags": [],
            "content": {"game_name": "PERIL!", "categories": []}
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/game-packs",
            json=pack_data,
            headers={"Content-Type": "application/json"}
        )
        pack_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/game-packs/{pack_id}")
        assert delete_response.status_code == 200
        
        # Verify deleted
        get_response = requests.get(f"{BASE_URL}/api/game-packs/{pack_id}")
        assert get_response.status_code == 404


class TestGameContentLoading:
    """Test loading game packs into games"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Create test game and pack"""
        # Create game
        game_data = {
            "name": f"{TEST_PREFIX}Content Load Game",
            "host": "Test Host",
            "venue": "Test Venue",
            "game_format": "PERIL!"
        }
        game_response = requests.post(
            f"{BASE_URL}/api/games",
            json=game_data,
            headers={"Content-Type": "application/json"}
        )
        self.game = game_response.json()
        
        # Create pack
        pack_data = {
            "name": f"{TEST_PREFIX}Content Pack",
            "description": "Test",
            "tags": [],
            "content": {
                "game_name": "PERIL!",
                "categories": [
                    {
                        "category_title": "History",
                        "clues": [
                            {
                                "value": 100,
                                "difficulty": 1,
                                "clue_text": "First US President",
                                "correct_answer": "George Washington",
                                "wrong_answers": ["Lincoln", "Jefferson", "Adams"]
                            }
                        ]
                    }
                ]
            }
        }
        pack_response = requests.post(
            f"{BASE_URL}/api/game-packs",
            json=pack_data,
            headers={"Content-Type": "application/json"}
        )
        self.pack = pack_response.json()
        
        yield
        
        # Cleanup
        try:
            requests.delete(f"{BASE_URL}/api/games/{self.game['id']}")
            requests.delete(f"{BASE_URL}/api/game-packs/{self.pack['id']}")
        except:
            pass
    
    def test_load_pack_into_game(self):
        """Test PATCH /api/games/{id}/content loads pack content"""
        # Get full pack content
        pack_response = requests.get(f"{BASE_URL}/api/game-packs/{self.pack['id']}")
        pack_content = pack_response.json()["content"]
        
        # Load into game
        response = requests.patch(
            f"{BASE_URL}/api/games/{self.game['id']}/content",
            json=pack_content,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        
        # Verify content was loaded
        game_response = requests.get(f"{BASE_URL}/api/games/{self.game['id']}")
        game_data = game_response.json()
        assert game_data["content"] is not None
        assert game_data["content"]["game_name"] == "PERIL!"
        assert len(game_data["content"]["categories"]) == 1


class TestExistingData:
    """Test existing seed data"""
    
    def test_existing_game_exists(self):
        """Test that the seed game MLZHU4 exists"""
        response = requests.get(f"{BASE_URL}/api/games/code/MLZHU4")
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == "MLZHU4"
        assert data["name"] == "Friday Trivia Night"
        assert data["game_format"] == "PERIL!"
    
    def test_existing_pack_exists(self):
        """Test that the seed game pack exists"""
        response = requests.get(f"{BASE_URL}/api/game-packs")
        assert response.status_code == 200
        packs = response.json()
        
        # Find the Classic Trivia Pack
        classic_pack = next((p for p in packs if p["name"] == "Classic Trivia Pack 1"), None)
        assert classic_pack is not None
        assert classic_pack["game_format"] == "PERIL!"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
