import { useState, useEffect } from "react";
import TETROMINOES from "../utils/tetrominoes";

const generate7Bag = () => {
  const tetrominoKeys = Object.keys(TETROMINOES) as Array<
    keyof typeof TETROMINOES
  >;
  const bag = [...tetrominoKeys];
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

const usePiece = (board: string[][]) => {
  const [currentBag, setCurrentBag] = useState(generate7Bag());
  const [bagIndex, setBagIndex] = useState(0);

  const [piece, setPiece] = useState(TETROMINOES[currentBag[0]][0]);
  const [type, setType] = useState(currentBag[0]);
  const [position, setPosition] = useState({ x: 3, y: 18 });
  const [rotation, setRotation] = useState(0);

  const [holdPiece, setHoldPiece] = useState<keyof typeof TETROMINOES | null>(
    null,
  );
  const [canHold, setCanHold] = useState(true);

  const isColliding = (
    newPosition: { x: number; y: number },
    newPiece: string[][],
  ) => {
    for (let y = 0; y < newPiece.length; y += 1) {
      for (let x = 0; x < newPiece[y].length; x += 1) {
        if (newPiece[y][x] !== "0") {
          const newX = newPosition.x + x;
          const newY = newPosition.y + y;

          if (newX < 0 || newX >= board[0].length || newY >= board.length) {
            return true;
          }

          if (board[newY][newX] !== "0") {
            return true;
          }
        }
      }
    }
    return false;
  };

  const getNextTetromino = () => {
    setBagIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex >= currentBag.length) {
        const newBag = generate7Bag();
        setCurrentBag(newBag);
        setBagIndex(0);
        return 0;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    const nextTetromino = currentBag[bagIndex];
    setType(nextTetromino);
    setPiece(TETROMINOES[nextTetromino][0]);
    setPosition({ x: 3, y: 18 });
    setRotation(0);
  }, [bagIndex, currentBag]);

  const attemptMove = (dir: { x: number; y: number }) => {
    const newPosition = { x: position.x + dir.x, y: position.y + dir.y };
    if (!isColliding(newPosition, piece)) {
      setPosition(newPosition);
    }
  };

  const movePiece = (dir: { x: number; y: number }) => {
    attemptMove(dir);
  };

  const attemptRotate = (newRotation: number) => {
    const newPiece = TETROMINOES[type][newRotation];
    if (!isColliding(position, newPiece)) {
      setRotation(newRotation);
      setPiece(newPiece);
    }
  };

  const rotatePieceCW = () => {
    const newRotation = (rotation + 1) % 4;
    attemptRotate(newRotation);
  };

  const rotatePieceCCW = () => {
    const newRotation = (rotation + 3) % 4;
    attemptRotate(newRotation);
  };

  const rotatePiece180 = () => {
    const newRotation = (rotation + 2) % 4;
    attemptRotate(newRotation);
  };

  const resetPiece = () => {
    getNextTetromino();
  };

  const holdCurrentPiece = () => {
    if (!canHold) return;

    if (holdPiece === null) {
      setHoldPiece(type);
      resetPiece();
    } else {
      const temp = holdPiece;
      setHoldPiece(type);
      setType(temp);
      setPiece(TETROMINOES[temp][0]);
      setPosition({ x: 3, y: 18 });
      setRotation(0);
    }
    setCanHold(false);
  };

  return {
    piece,
    position,
    isColliding,
    movePiece,
    rotatePieceCW,
    rotatePieceCCW,
    rotatePiece180,
    resetPiece,
    holdCurrentPiece,
    holdPiece,
    setCanHold,
  };
};

export default usePiece;
