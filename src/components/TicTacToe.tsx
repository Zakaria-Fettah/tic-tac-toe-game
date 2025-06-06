import { useState, useEffect } from 'react';
import { RotateCcw, Bot, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import GameBoard from './GameBoard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Player = 'X' | 'O' | null;
export type Difficulty = 'facile' | 'difficile';

const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [vsBot, setVsBot] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('facile');
  const { toast } = useToast();

  const checkWinner = (squares: Player[]): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'draw') {
        toast({
          title: "It's a draw!",
          description: "Nobody wins this time.",
        });
      } else {
        toast({
          title: `Player ${gameWinner} wins!`,
          description: "Congratulations! 🎉",
        });
      }
      return;
    }

    setIsXNext(!isXNext);
  };

  const findBestMove = (squares: Player[]): number => {
    const isMaximizing = false;
    let bestScore = Infinity;
    let bestMove = -1;

    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, true, 0);
        squares[i] = null;
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (squares: Player[], isMaximizing: boolean, depth: number): number => {
    const result = checkWinner(squares);
    if (result === 'X') return 1;
    if (result === 'O') return -1;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const score = minimax(squares, false, depth + 1);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const score = minimax(squares, true, depth + 1);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const botMove = () => {
    if (winner) return;
    
    if (difficulty === 'facile') {
      const emptySpaces = board.reduce((acc: number[], cell, idx) => 
        !cell ? [...acc, idx] : acc, []);
      
      if (emptySpaces.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySpaces.length);
        handleClick(emptySpaces[randomIndex]);
      }
    } else {
      const bestMove = findBestMove([...board]);
      if (bestMove !== -1) {
        handleClick(bestMove);
      }
    }
  };

  useEffect(() => {
    if (vsBot && !isXNext && !winner) {
      const timer = setTimeout(botMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, vsBot]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 p-4 relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-4">
            Cosmic Tic-Tac-Toe
          </h1>
          <motion.p 
            className="text-purple-200 mb-8 text-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {winner 
              ? winner === 'draw' 
                ? "The cosmos ends in balance!" 
                : `Player ${winner} conquers!`
              : `Next move: ${isXNext ? 'X' : 'O'}`}
          </motion.p>
        </motion.div>

        <div className="flex flex-col gap-4 items-center mb-8">
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className={`${!vsBot ? 'bg-purple-600 text-white' : 'bg-transparent text-purple-200'} 
                border-2 border-purple-400/50 hover:bg-purple-700 backdrop-blur-sm
                transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20`}
              onClick={() => setVsBot(false)}
            >
              <Users className="mr-2 h-4 w-4" /> VS Player
            </Button>
            <Button
              variant="outline"
              className={`${vsBot ? 'bg-purple-600 text-white' : 'bg-transparent text-purple-200'} 
                border-2 border-purple-400/50 hover:bg-purple-700 backdrop-blur-sm
                transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20`}
              onClick={() => setVsBot(true)}
            >
              <Bot className="mr-2 h-4 w-4" /> VS Bot
            </Button>
          </div>

          {vsBot && (
            <Select
              value={difficulty}
              onValueChange={(value: Difficulty) => setDifficulty(value)}
            >
              <SelectTrigger className="w-[180px] bg-purple-600/20 border-purple-400/50 text-purple-200">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900/90 border-purple-400/50">
                <SelectItem value="facile" className="text-purple-200 hover:bg-purple-700/50 focus:bg-purple-700/50">
                  Facile
                </SelectItem>
                <SelectItem value="difficile" className="text-purple-200 hover:bg-purple-700/50 focus:bg-purple-700/50">
                  Difficile
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <GameBoard board={board} onSquareClick={handleClick} />

        <motion.div 
          className="text-center mt-8"
          whileHover={{ scale: 1.05 }}
        >
          <Button
            variant="outline"
            className="bg-transparent text-purple-200 border-2 border-purple-400/50 hover:bg-purple-700
              backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            onClick={resetGame}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Game
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TicTacToe;
