import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfettiExplosion from "react-confetti-explosion";

const generateRandomNumber = (difficulty) => {
  let min = 1;
  let max = 10;

  if (difficulty === "medium") {
    max = 50;
  } else if (difficulty === "hard") {
    max = 100;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateHint = (number) => {
  let hints = [];

  if (number % 2 === 0) {
    hints.push("The number is even.");
  } else {
    hints.push("The number is odd.");
  }

  if (number % 3 === 0) {
    hints.push("It's divisible by 3.");
  }
  if (number % 5 === 0) {
    hints.push("It's divisible by 5.");
  }

  if (number <= 5) {
    hints.push("The number is 5 or smaller.");
  } else {
    hints.push("The number is greater than 5.");
  }

  if (number <= 25) {
    hints.push("The number is 25 or smaller.");
  } else if (number <= 50) {
    hints.push("The number is between 26 and 50.");
  } else if (number <= 75) {
    hints.push("The number is between 51 and 75.");
  } else {
    hints.push("The number is between 76 and 100.");
  }

  //   Randomly select one hint to make it more challenging
  return hints[Math.floor(Math.random() * hints.length)];
};

export default function Game() {
  const [number, setNumber] = useState(() => generateRandomNumber("easy"));
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  let maxAttempts = 10;
  if (difficulty === "medium") {
    maxAttempts = 5;
  } else if (difficulty === "hard") {
    maxAttempts = 3;
  }
  useEffect(() => {
    setNumber(generateRandomNumber(difficulty));
  }, [difficulty, isGameWon]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!guess) {
      toast.error("Please enter a number to guess!");
      return;
    }
    setAttempts(attempts + 1);

    if (parseInt(guess) === number && attempts < maxAttempts) {
      setIsGameWon(true);
      return;
    }
    if (attempts <= maxAttempts) {
      toast(generateHint(number), { icon: "🤔" });
    }
  };

  const resetGame = () => {
    setGuess("");
    setAttempts(0);
    setIsGameWon(false);
  };

  return (
    <div className="mx-6 flex flex-col gap-5 justify-center items-center relative rounded-lg border-2 border-gray-900 bg-[#a388ee] md:px-16 md:py-12 px-1 py-16 text-lg font-bold text-gray-900 shadow-[4px_4px_0px_0px_#000]">
      {isGameWon && (
        <ConfettiExplosion
          particleCount={300}
          height={"200vh"}
          width={3000}
          duration={3000}
          force={0.35}
        />
      )}
      <h1 className="md:text-3xl text-center text-xl">Number Guessing Game</h1>

      <div className="flex flex-wrap gap-5 justify-center items-center">
        <div className="relative inline-block">
          <select
            disabled={!isGameWon && attempts > 0}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="select-custom"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-900">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <button onClick={resetGame} className="btn-custom">
          Reset Game
        </button>
      </div>

      <form
        name="guessForm"
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-5 justify-center items-center"
      >
        <input
          disabled={isGameWon}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          type="number"
          placeholder="Enter your guess"
          className="input-custom"
        />
        {isGameWon ? (
          <p className="text-center font-bold">
            🎉 Amazing! You guessed the number in {attempts}{" "}
            {attempts === 1 ? "attempt" : "attempts"}! 🎉
          </p>
        ) : attempts >= maxAttempts ? (
          <p className="text-center font-bold">
            😔 Game Over! You&apos;ve used all {maxAttempts} attempts. The
            correct number was {number}. Try again!
          </p>
        ) : (
          <p className="text-center font-semibold">
            🔍 You&apos;ve made {attempts}{" "}
            {attempts === 1 ? "attempt" : "attempts"} out of {maxAttempts}. Keep
            going!
          </p>
        )}
        <button disabled={isGameWon} type="submit" className="btn-custom">
          Submit Guess
        </button>
      </form>
    </div>
  );
}