import React, { useState } from 'react';
import './GamesScreen.css';

const MASSIVE_GAMES_DATABASE = {
  mindGames: [
    { id: 1, name: "Memory Master", difficulty: "Medium", icon: "🧠", description: "Test your memory with card matching" },
    { id: 2, name: "Number Puzzle", difficulty: "Hard", icon: "🔢", description: "Solve complex number sequences" },
    { id: 3, name: "Word Wizard", difficulty: "Medium", icon: "📝", description: "Create words from letters" },
    { id: 4, name: "Logic Master", difficulty: "Expert", icon: "♟️", description: "Solve logical puzzles" },
    { id: 5, name: "Math Genius", difficulty: "Hard", icon: "🧮", description: "Quick math challenges" },
    { id: 6, name: "Pattern Detective", difficulty: "Medium", icon: "🔍", description: "Find hidden patterns" },
    { id: 7, name: "Brain Teaser", difficulty: "Hard", icon: "🤔", description: "Mind-bending riddles" },
    { id: 8, name: "Speed Calculator", difficulty: "Medium", icon: "⚡", description: "Fast arithmetic challenges" },
    { id: 9, name: "Sequence Solver", difficulty: "Expert", icon: "🔗", description: "Complete number sequences" },
    { id: 10, name: "Visual Puzzle", difficulty: "Medium", icon: "👁️", description: "Spatial reasoning challenges" }
  ],
  loveGames: [
    { id: 11, name: "How Well Do You Know Me?", difficulty: "Fun", icon: "❤️", description: "Test your knowledge about each other" },
    { id: 12, name: "Love Message Generator", difficulty: "Sweet", icon: "💌", description: "Generate beautiful love messages" },
    { id: 13, name: "Our Future Together", difficulty: "Romantic", icon: "🌟", description: "Plan your beautiful future" },
    { id: 14, name: "Memory Lane", difficulty: "Nostalgic", icon: "📸", description: "Relive your favorite moments" },
    { id: 15, name: "Dream Date Planner", difficulty: "Creative", icon: "🌹", description: "Design perfect dates" },
    { id: 16, name: "Love Language Quiz", difficulty: "Insightful", icon: "💕", description: "Discover your love languages" },
    { id: 17, name: "Couple Goals", difficulty: "Inspiring", icon: "🎯", description: "Set relationship goals together" },
    { id: 18, name: "Anniversary Countdown", difficulty: "Special", icon: "🎉", description: "Count down to special moments" }
  ],
  funGames: [
    { id: 19, name: "Truth or Dare", difficulty: "Exciting", icon: "🎭", description: "Classic truth or dare game" },
    { id: 20, name: "Would You Rather", difficulty: "Thought-provoking", icon: "🤷", description: "Make tough choices together" },
    { id: 21, name: "20 Questions", difficulty: "Mysterious", icon: "❓", description: "Guess what I'm thinking" },
    { id: 22, name: "Story Builder", difficulty: "Creative", icon: "📚", description: "Create stories together" },
    { id: 23, name: "Emoji Charades", difficulty: "Fun", icon: "😄", description: "Act out emojis" },
    { id: 24, name: "Rhyme Time", difficulty: "Playful", icon: "🎵", description: "Create rhyming words" },
    { id: 25, name: "Quick Draw", difficulty: "Artistic", icon: "🎨", description: "Draw and guess" },
    { id: 26, name: "Name That Tune", difficulty: "Musical", icon: "🎶", description: "Guess the song" }
  ],
  challengeGames: [
    { id: 27, name: "Photo Challenge", difficulty: "Creative", icon: "📷", description: "Complete photo missions" },
    { id: 28, name: "Fitness Challenge", difficulty: "Active", icon: "💪", description: "Stay fit together" },
    { id: 29, name: "Cooking Challenge", difficulty: "Tasty", icon: "👨‍🍳", description: "Cook meals together" },
    { id: 30, name: "Learning Challenge", difficulty: "Educational", icon: "📖", description: "Learn new skills" },
    { id: 31, name: "Adventure Challenge", difficulty: "Exciting", icon: "🗺️", description: "Explore new places" },
    { id: 32, name: "Kindness Challenge", difficulty: "Heartwarming", icon: "🤗", description: "Spread kindness together" }
  ]
};

export default function GamesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('mindGames');
  const [currentGame, setCurrentGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);

  const categories = [
    { key: 'mindGames', name: 'Mind Games', icon: '🧠', color: '#FF4444' },
    { key: 'loveGames', name: 'Love Games', icon: '❤️', color: '#9C27B0' },
    { key: 'funGames', name: 'Fun Games', icon: '🎮', color: '#FFD700' },
    { key: 'challengeGames', name: 'Challenges', icon: '🏆', color: '#4CAF50' }
  ];

  const startGame = (game) => {
    setCurrentGame(game);
    setGameScore(0);
  };

  const closeGame = () => {
    setCurrentGame(null);
  };

  if (currentGame) {
    return (
      <div className="game-interface">
        <div className="game-header">
          <h2>{currentGame.icon} {currentGame.name}</h2>
          <div className="game-controls">
            <span className="score">Score: {gameScore}</span>
            <button className="close-btn" onClick={closeGame}>✕</button>
          </div>
        </div>
        <div className="game-content">
          <div className="game-placeholder">
            <div className="game-icon">{currentGame.icon}</div>
            <h3>{currentGame.name}</h3>
            <p>{currentGame.description}</p>
            <div className="game-actions">
              <button className="game-btn" onClick={() => setGameScore(gameScore + 10)}>
                Play Round (+10 points)
              </button>
              <button className="game-btn secondary" onClick={closeGame}>
                Finish Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-container">
      {/* Galaxy Background */}
      <div className="games-galaxy-bg">
        <div className="games-stars"></div>
        <div className="games-stars2"></div>
      </div>

      <div className="games-header">
        <h1 className="games-title">
          <span className="title-nelson">NELSON</span>
          <span className="title-heart">🎮</span>
          <span className="title-juliana">JULIANA</span>
        </h1>
        <p className="games-subtitle">Epic Games Collection</p>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.key}
            className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.key)}
            style={{ '--category-color': category.color }}
          >
            <span className="tab-icon">{category.icon}</span>
            <span className="tab-name">{category.name}</span>
            <span className="tab-count">{MASSIVE_GAMES_DATABASE[category.key].length}</span>
          </button>
        ))}
      </div>

      <div className="games-grid">
        {MASSIVE_GAMES_DATABASE[selectedCategory].map(game => (
          <div key={game.id} className="game-card" onClick={() => startGame(game)}>
            <div className="card-glow"></div>
            <div className="game-icon-large">{game.icon}</div>
            <h3 className="game-name">{game.name}</h3>
            <p className="game-description">{game.description}</p>
            <div className="game-difficulty">
              <span className="difficulty-badge">{game.difficulty}</span>
            </div>
            <button className="play-btn">
              <span>Play Now</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        ))}
      </div>

      <div className="games-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-number">{Object.values(MASSIVE_GAMES_DATABASE).flat().length}</div>
          <div className="stat-label">Total Games</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">∞</div>
          <div className="stat-label">Hours of Fun</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💕</div>
          <div className="stat-number">2</div>
          <div className="stat-label">Players</div>
        </div>
      </div>
    </div>
  );
}