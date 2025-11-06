import React from "react";
import Choose from "./Componant/Choose";
import Board from "./Componant/Board";
import WaitingScreen from "./Componant/WaitingScreen";
import GameHeader from "./Componant/GameHeader";
import GameTimer from "./Componant/GameTimer";
import GameEndMessage from "./Componant/GameEndMessage";
import { useRemoteGameLogic } from "./Componant/GameLogic";
import { useTranslation } from "react-i18next";

const RemoteGame: React.FC = () => {
  const {
    gameStarted,
    usersJoin,
    waitingForPlayer,
    handleJoinGame,
    handleLeaveGame,
    startNewGame,
    playAgain,
    handlePlay,
    squares,
    xIsNext,
    playerXName,
    playerOName,
    mySymbol,
    gameResult,
    currentUser,
    startTimer,
    time,
    currentUserRef,
  } = useRemoteGameLogic();
  const {t} = useTranslation();
  
  const renderGameEndMessage = () => {

    if (!gameResult)
      return null;

    const isWinner = gameResult.winner === currentUserRef.current;

    switch (gameResult.reason) {
      case "win":
        return (
          <div className="text-center mt-6">
            <p className="text-2xl font-bold mb-4">
              {isWinner ? (
                <span className="text-green-400">{t("you_win")}</span>
              ) : (
                <span className="text-red-400">{t("you_lost")}</span>
              )}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startNewGame}
                className="bg-[#0077FF] hover:bg-blue-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
              >
                {t("go_back")}
              </button>
            </div>
          </div>
        );

      case "draw":
        return (
          <div className="text-center mt-6">
            <p className="text-2xl font-bold text-yellow-400 mb-4">
              {t("its_draw")}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startNewGame}
                className="bg-[#0077FF] hover:bg-blue-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
              >
                 {t("go_back")}
              </button>
            </div>
          </div>
        );

      case "timeout":
        return (
          <div className="text-center mt-6">
            <p className="text-2xl font-bold mb-4">
              {isWinner ? (
                <span className="text-green-400">
                  {t("you_win_opponent_timed_out")}
                </span>
              ) : (
                <span className="text-red-400">{t("you_lost_times_up")}</span>
              )}
            </p>
            <button
              onClick={startNewGame}
              className="bg-[#0077FF] hover:bg-blue-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
            >
              {t("go_back")}
            </button>
          </div>
        );

      case "disconnect":
        return (
          <div className="text-center mt-6">
            <p className="text-2xl font-bold mb-4">
              {isWinner ? (
                <span className="text-green-400">
                  {t("you_win_opp_disconnected")}
                </span>
              ) : (
                <span className="text-red-400">{t("cnx_lost")}</span>
              )}
            </p>
            <button
              onClick={startNewGame}
              className="bg-[#0077FF] hover:bg-blue-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
            >
              {t("go_back")}
            </button>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#222831] p-4 overflow-auto">
      {!gameStarted && !usersJoin ? (
        waitingForPlayer ? (
          <WaitingScreen onCancel={handleLeaveGame} />
        ) : (
          <Choose onChoose={handleJoinGame} />
        )
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full max-w-2xl h-[80%]">
          <h1 className="text-5xl font-extrabold text-white ">
            Tic Tac Toe
          </h1>

          <GameHeader
            playerXName={playerXName}
            playerOName={playerOName}
            mySymbol={mySymbol}
          />

          {!gameResult && startTimer && gameStarted && (
            <GameTimer xIsNext={xIsNext} time={time} />
          )}

          <Board
            xIsNext={xIsNext}
            squares={squares}
            onPlay={handlePlay}
            replayGame={startNewGame}
            playagain={playAgain}
            playerOName={playerOName}
            playerXName={playerXName}
            gameStarted={gameStarted}
            currentUser={currentUser}
            mySymbol={mySymbol}
            gameResult={gameResult}
          />

          {/* <GameEndMessage gameResult={gameResult} startNewGame={startNewGame} /> */}
          {renderGameEndMessage()}
          {!gameResult && gameStarted && (
            <button
              onClick={handleLeaveGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-md mt-4"
            >
              {t("leave_game")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RemoteGame;
