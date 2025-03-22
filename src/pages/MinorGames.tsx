
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Gamepad, Clock, Trophy, Brain, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const MinorGames = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [memoryGrid, setMemoryGrid] = useState<{value: number, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameTime, setGameTime] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  // Sample games data
  const gamesData = [
    {
      id: "memory",
      name: "Memory Match",
      description: "Test your memory by matching pairs of cards.",
      icon: <Brain size={24} />,
      difficulty: "Easy",
      timeToComplete: "2-5 min"
    },
    {
      id: "reaction",
      name: "Reaction Time",
      description: "Click as quickly as possible when the color changes.",
      icon: <Zap size={24} />,
      difficulty: "Medium",
      timeToComplete: "1-2 min"
    },
    {
      id: "word-scramble",
      name: "Word Scramble",
      description: "Unscramble academic terms within the time limit.",
      icon: <History size={24} />,
      difficulty: "Hard",
      timeToComplete: "3-7 min"
    }
  ];

  // Setup memory game
  const initMemoryGame = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = values.sort(() => Math.random() - 0.5);
    
    setMemoryGrid(shuffled.map(value => ({
      value,
      flipped: false,
      matched: false
    })));
    
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameTime(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  // Handle card flip
  const handleCardFlip = (index: number) => {
    // Don't allow flipping if already flipped, matched, or two cards are already flipped
    if (memoryGrid[index].flipped || memoryGrid[index].matched || flippedCards.length >= 2) {
      return;
    }
    
    // Start game timer on first flip
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Flip the card
    const newGrid = [...memoryGrid];
    newGrid[index].flipped = true;
    setMemoryGrid(newGrid);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    
    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlippedCards;
      
      if (memoryGrid[first].value === memoryGrid[second].value) {
        // Match found
        setTimeout(() => {
          const matchedGrid = [...memoryGrid];
          matchedGrid[first].matched = true;
          matchedGrid[second].matched = true;
          setMemoryGrid(matchedGrid);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          
          // Check if all pairs are matched
          if (matchedPairs + 1 === 8) {
            setGameCompleted(true);
            setGameStarted(false);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetGrid = [...memoryGrid];
          resetGrid[first].flipped = false;
          resetGrid[second].flipped = false;
          setMemoryGrid(resetGrid);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameCompleted) {
      timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameCompleted]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Init memory game when it's selected
  useEffect(() => {
    if (activeGame === "memory") {
      initMemoryGame();
    }
  }, [activeGame]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          {!activeGame ? (
            <>
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Brain Training Games</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Take a study break with our collection of fun, brain-stimulating mini-games designed to sharpen your cognitive skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gamesData.map(game => (
                  <div 
                    key={game.id} 
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-br from-sfu-red/10 to-sfu-red/5 p-6">
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 text-sfu-red">
                        {game.icon}
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2">{game.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Gamepad size={14} />
                          <span>{game.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{game.timeToComplete}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <Button 
                        className="w-full bg-sfu-red hover:bg-sfu-red/90 text-white"
                        onClick={() => setActiveGame(game.id)}
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-sfu-lightgray rounded-xl p-6">
                <h2 className="text-2xl font-display font-semibold mb-4">Benefits of Brain Games</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Cognitive Enhancement",
                      description: "Improve memory, attention, reaction time, and problem-solving skills."
                    },
                    {
                      title: "Stress Reduction",
                      description: "Take a break from studying and reduce mental fatigue with fun activities."
                    },
                    {
                      title: "Skill Building",
                      description: "Develop skills that are transferable to academic and professional settings."
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg shadow-sm">
                      <h3 className="font-medium text-lg mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeGame === "memory" ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-sfu-black text-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain size={20} className="text-sfu-red" />
                    <h2 className="font-display font-semibold">Memory Match</h2>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                      <Clock size={14} />
                      <span>{formatTime(gameTime)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                      <Zap size={14} />
                      <span>Moves: {moves}</span>
                    </div>
                  </div>
                </div>
                
                {gameCompleted ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-sfu-red/10 rounded-full flex items-center justify-center text-sfu-red mx-auto mb-6">
                      <Trophy size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-display font-bold mb-4">Well Done!</h2>
                    
                    <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500 text-sm mb-1">Time</div>
                        <div className="text-2xl font-bold">{formatTime(gameTime)}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500 text-sm mb-1">Moves</div>
                        <div className="text-2xl font-bold">{moves}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={initMemoryGame}
                      >
                        Play Again
                      </Button>
                      
                      <Button 
                        className="bg-sfu-red text-white hover:bg-sfu-red/90"
                        onClick={() => setActiveGame(null)}
                      >
                        Back to Games
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    {!gameStarted && (
                      <div className="mb-4 text-center text-sm text-gray-600">
                        Click any card to begin the game. Find all matching pairs to win!
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-3">
                      {memoryGrid.map((card, index) => (
                        <div 
                          key={index}
                          className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 transform ${
                            card.flipped || card.matched 
                              ? 'rotate-y-180' 
                              : 'bg-gradient-to-br from-sfu-red/80 to-sfu-red hover:from-sfu-red hover:to-sfu-red/90'
                          } ${card.matched ? 'opacity-70' : 'opacity-100'}`}
                          onClick={() => handleCardFlip(index)}
                        >
                          <div className={`w-full h-full flex items-center justify-center ${
                            card.flipped || card.matched 
                              ? 'bg-white border-2 border-gray-200 text-gray-800' 
                              : 'text-white'
                          } rounded-lg`}>
                            {(card.flipped || card.matched) && (
                              <span className="text-2xl font-bold">{card.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={initMemoryGame}
                      >
                        Reset Game
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => setActiveGame(null)}
                      >
                        Exit Game
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="w-20 h-20 bg-sfu-red/10 rounded-full flex items-center justify-center text-sfu-red mx-auto mb-6">
                  <Gamepad size={32} />
                </div>
                
                <h2 className="text-2xl font-display font-bold mb-4">
                  {activeGame === "reaction" ? "Reaction Time" : "Word Scramble"}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  This game is coming soon! We're still developing this exciting brain training game.
                </p>
                
                <Button 
                  className="bg-sfu-red text-white hover:bg-sfu-red/90"
                  onClick={() => setActiveGame(null)}
                >
                  Back to Games
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MinorGames;
