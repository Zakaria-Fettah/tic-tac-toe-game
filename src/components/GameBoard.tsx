
import { Player } from './TicTacToe';
import { motion } from 'framer-motion';

interface GameBoardProps {
  board: Player[];
  onSquareClick: (index: number) => void;
}

const GameBoard = ({ board, onSquareClick }: GameBoardProps) => {
  const renderSymbol = (value: Player) => {
    if (value === 'X' || value === 'O') {
      return (
        <div className="text-5xl font-bold text-white">
          {value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-3 gap-3 aspect-square w-full max-w-[400px] mx-auto relative">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl" />
      
      {board.map((value, index) => (
        <motion.button
          key={index}
          className={`
            aspect-square rounded-2xl text-4xl font-bold relative
            ${value ? 'bg-purple-600/40' : 'bg-purple-500/20'}
            hover:bg-purple-600/60 transition-all duration-300
            border-2 border-purple-400/50 backdrop-blur-md
            flex items-center justify-center text-white
            shadow-lg shadow-purple-500/20
            hover:shadow-xl hover:shadow-purple-500/30
            group
          `}
          onClick={() => onSquareClick(index)}
          whileHover={{ 
            scale: 1.05,
            rotateZ: 5,
          }}
          whileTap={{ 
            scale: 0.95,
            rotateZ: -5,
          }}
          initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.3
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {renderSymbol(value)}
          </motion.div>
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/20 group-hover:to-blue-400/20 rounded-2xl transition-all duration-300" />
        </motion.button>
      ))}
    </div>
  );
};

export default GameBoard;
