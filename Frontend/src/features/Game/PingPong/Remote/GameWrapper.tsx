import React, { useRef, useEffect, useState } from 'react';
import socket from '../../../Chat/services/socket';
import { useTranslation } from "react-i18next";

const baseWidth = 600;
const baseHeight = 400;

const basePaddleWidth = 12;
const basePaddleHeight = 70;
const baseBallRadius = 10;
const baseInitialBallSpeed = 3;

interface Score {
  left: number;
  right: number;
}

interface GameWrapperProps {
  playerName: string;
  playerDisplayName?: string;
  onGameEnd?: (winner: string | null) => void;
}

interface playersDataProps {
  left: string;
  right: string;
}

interface displayNamesProps {
  left: string;
  right: string;
}

interface usersImagesProps {
  id: string;
  user_image: string;
}

interface GameSettings {
  ball_color: string;
  paddle_color: string;
  table_color: string;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ playerName, playerDisplayName, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {t} = useTranslation();

  const [canvasSize, setCanvasSize] = useState({ width: baseWidth, height: baseHeight });
  const scaleRef = useRef(1);

  const paddleWidthRef = useRef(basePaddleWidth);
  const paddleHeightRef = useRef(basePaddleHeight);
  const ballRadiusRef = useRef(baseBallRadius);
  const initialBallSpeedRef = useRef(baseInitialBallSpeed);

  const ballRef = useRef({ x: baseWidth / 2, y: baseHeight / 2, dx: baseInitialBallSpeed, dy: baseInitialBallSpeed });
  const leftPaddleRef = useRef({ y: baseHeight / 2 - basePaddleHeight / 2 });
  const rightPaddleRef = useRef({ y: baseHeight / 2 - basePaddleHeight / 2 });

  const [score, setScore] = useState<Score>({ left: 0, right: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [playerSide, setPlayerSide] = useState<'left' | 'right' | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<'' | null>(null);
  const [playersNames, setPlayersNames] = useState<playersDataProps | null>(null);
  const [playersDisplayNames, setPlayersDisplayNames] = useState<displayNamesProps | null>(null);
  const [usersImages, setUserImages] = useState<usersImagesProps[] | null>(null);
  const isTournamentRef = useRef(false);
  
  // Game settings state
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    ball_color: '#ff0',
    paddle_color: '#0ff',
    table_color: '#0f0f0f'
  });

  const playerDataFetchedRef = useRef(false);
  const usernamesCacheRef = useRef<Record<string, string>>({});

  // Touch controls state
  const [isMobile, setIsMobile] = useState(false);
  const touchStateRef = useRef({
    touching: false,
    lastDirection: 0,
  });

  const keysRef = useRef({
    w: false,
    s: false,
    up: false,
    down: false,
  });

  // Fetch game settings
  const fetchGameSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/gameinfo`, {
        credentials: "include",
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        
        setGameSettings({
          ball_color: data.ball_color || '#ff0',
          paddle_color: data.paddle_color || '#0ff',
          table_color: data.table_color || '#0f0f0f'
        });
      } else {
        console.error('Failed to fetch game settings:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching game settings:', error);
    }
  };

  // Fetch game settings on component
  useEffect(() => {
    fetchGameSettings();
  }, []);

  const fetchPlayerData = async (playerIds: string[]) => {
    if (playerDataFetchedRef.current) {
      return;
    }
  
    playerDataFetchedRef.current = true;
  
    try {
      // Check if this is a tournament game
      const pathSegments = window.location.pathname.split('/');
      const tournamentIndex = pathSegments.indexOf('tournament');
      const tournamentId = tournamentIndex !== -1 ? pathSegments[tournamentIndex + 1] : null;
  
  
      // This is to veify if it is a tournament game
      if (tournamentId) {
        const tournamentCheckResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/tournament-game`, {
          credentials: "include",
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tournamentId, 
            playerId: playerName 
          }),
        });
  
        if (tournamentCheckResponse.ok)
          isTournamentRef.current = true;
      }

      const [usernamesResponse, imagesResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/${isTournamentRef.current ? 'display-names' : 'users'}`, {
          credentials: "include",
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: playerIds.map(id => parseInt(id, 10)) }),
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/user-image`, {
          credentials: "include",
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: playerIds.map(id => parseInt(id, 10)) }),
        })
      ]);
  
      if (usernamesResponse.ok) {
        const { users: fetchedUsers } = await usernamesResponse.json();
        playerIds.forEach((id, index) => {
          usernamesCacheRef.current[id] = fetchedUsers[index] || id;
        });
  
        setPlayersDisplayNames({
          left: usernamesCacheRef.current[playerIds[0]] || playerIds[0],
          right: usernamesCacheRef.current[playerIds[1]] || playerIds[1]
        });
      }
  
      if (imagesResponse.ok) {
        const jsonResponse = await imagesResponse.json();
        const { users: images } = jsonResponse;
        setUserImages(images);
      }
  
    } catch (error) {
      console.error("Error fetching player data:", error);
      playerDataFetchedRef.current = false;
      
      if (playerIds.length === 2) {
        setPlayersDisplayNames({
          left: playerIds[0],
          right: playerIds[1]
        });
      }
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playerSide || gameOver) return;
    
    touchStateRef.current.touching = true;
    
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touchY = touch.clientY - rect.top;
    const canvasHeight = canvasSize.height;
    const center = canvasHeight / 2;
    
    const direction = touchY < center ? -1 : 1;
    touchStateRef.current.lastDirection = direction;
    
    sendPaddleMovement(direction, 'start', playerName);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStateRef.current.touching || !playerSide || gameOver) return;

    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touchY = touch.clientY - rect.top;
    const canvasHeight = canvasSize.height;
    const center = canvasHeight / 2;
    
    const newDirection = touchY < center ? -1 : 1;
    
    if (newDirection !== touchStateRef.current.lastDirection) {
      sendPaddleMovement(touchStateRef.current.lastDirection, 'stop', playerName);
      sendPaddleMovement(newDirection, 'start', playerName);
      touchStateRef.current.lastDirection = newDirection;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStateRef.current.touching || !playerSide) return;
    
    touchStateRef.current.touching = false;
    sendPaddleMovement(touchStateRef.current.lastDirection, 'stop', playerName);
  };

  const updateCanvasSize = () => {
    const maxWidth = window.innerWidth * 0.7;
    const maxHeight = window.innerHeight * 0.5;

    let scale = Math.min(maxWidth / baseWidth, maxHeight / baseHeight);
    scale = Math.max(scale, 0.5);

    scaleRef.current = scale;

    const newWidth = Math.floor(baseWidth * scale);
    const newHeight = Math.floor(baseHeight * scale);

    setCanvasSize({ width: newWidth, height: newHeight });

    paddleWidthRef.current = basePaddleWidth * scale;
    paddleHeightRef.current = basePaddleHeight * scale;
    ballRadiusRef.current = baseBallRadius * scale;
    initialBallSpeedRef.current = baseInitialBallSpeed * scale;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = ballRef.current;
    const leftY = leftPaddleRef.current.y;
    const rightY = rightPaddleRef.current.y;

    const cw = canvasSize.width;
    const ch = canvasSize.height;
    const paddleW = paddleWidthRef.current;
    const paddleH = paddleHeightRef.current;
    const ballR = ballRadiusRef.current;
    
    ctx.fillStyle = gameSettings.table_color;
    ctx.fillRect(0, 0, cw, ch);

    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(cw / 2, 0);
    ctx.lineTo(cw / 2, ch);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = gameSettings.paddle_color;

    ctx.fillRect(20 * scaleRef.current, leftY, paddleW, paddleH);
    ctx.fillRect(cw - 20 * scaleRef.current - paddleW, rightY, paddleW, paddleH);

    ctx.beginPath();
    ctx.arc(x, y, ballR, 0, Math.PI * 2);
    ctx.fillStyle = gameSettings.ball_color;
    ctx.fill();
    ctx.closePath();

    ctx.shadowBlur = 0;
  };

  // Helper function to adjust color brightness
  const adjustColorBrightness = (color: string, amount: number): string => {
    const usePound = color[0] === "#";
    let col = color;
    
    if (usePound) {
      col = col.slice(1);
    }
    
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);
    
    return (usePound ? "#" : "") + 
      ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const sendPaddleMovement = (direction: number, state: 'start' | 'stop', playerName: string) => {
    if (!playerSide) return;
    socket.emit('paddleMove', { side: playerSide, direction, state, roomId, playerName });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (touchStateRef.current.touching) return;

    if (e.key === 'w' && !keysRef.current.w) {
      keysRef.current.w = true;
      sendPaddleMovement(-1, 'start', playerName);
    }
    if (e.key === 's' && !keysRef.current.s) {
      keysRef.current.s = true;
      sendPaddleMovement(1, 'start', playerName);
    }
    if (e.key === 'ArrowUp' && !keysRef.current.up) {
      keysRef.current.up = true;
      sendPaddleMovement(-1, 'start', playerName);
    }
    if (e.key === 'ArrowDown' && !keysRef.current.down) {
      keysRef.current.down = true;
      sendPaddleMovement(1, 'start', playerName);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (touchStateRef.current.touching) return;

    if (e.key === 'w' && keysRef.current.w) {
      keysRef.current.w = false;
      sendPaddleMovement(-1, 'stop', playerName);
    }
    if (e.key === 's' && keysRef.current.s) {
      keysRef.current.s = false;
      sendPaddleMovement(1, 'stop', playerName);
    }
    if (e.key === 'ArrowUp' && keysRef.current.up) {
      keysRef.current.up = false;
      sendPaddleMovement(-1, 'stop', playerName);
    }
    if (e.key === 'ArrowDown' && keysRef.current.down) {
      keysRef.current.down = false;
      sendPaddleMovement(1, 'stop', playerName);
    }
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId: number;

    const render = () => {
      if (ctx) draw(ctx);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, canvasSize, playerSide, playerName, gameSettings]);

  useEffect(() => {
    socket.on('init', ({ player }) => {
      console.log('I am player:', player);
      setPlayerSide(player === 0 ? 'left' : 'right');
    });

    socket.on('gameState', async (serverState) => {
      const data = { left: serverState.players[0], right: serverState.players[1] };
      setPlayersNames(data);
      
      if (!playerDataFetchedRef.current && serverState.players && serverState.players.length === 2) {
        await fetchPlayerData(serverState.players);
      }

      ballRef.current = {
        ...serverState.ball,
        x: serverState.ball.x * scaleRef.current,
        y: serverState.ball.y * scaleRef.current,
      };

      leftPaddleRef.current.y = serverState.paddles.left * scaleRef.current;
      rightPaddleRef.current.y = serverState.paddles.right * scaleRef.current;

      if (!playerSide && playerName) {
        if (serverState.players[0] === playerName) {
          setPlayerSide("left");
        } else if (serverState.players[1] === playerName) {
          setPlayerSide("right");
        }
      }

      setScore(serverState.score);
      setRoomId(serverState.roomId);
    });

    socket.on('gameOver', async (playerWin) => {
      console.log('Game Over winner:', playerWin);
      
      let winnerDisplayName = usernamesCacheRef.current[playerWin.winner];
      if (!winnerDisplayName) {
        await fetchPlayerData([playerWin.winner]);
        winnerDisplayName = usernamesCacheRef.current[playerWin.winner] || playerWin.winner;
      }
      
      setWinner(winnerDisplayName);
      setGameOver(true);
      
      if (onGameEnd)
        onGameEnd(winnerDisplayName);
    });

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log('Page is being refreshed or closed');
      socket.emit('playerLeft', playerName);
      socket.off('init');
      socket.off('gameState');
      socket.off('gameOver');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleBeforeUnload);

    return () => {
      if (playerSide)
        socket.emit('playerLeft', playerName)
      socket.off('init');
      socket.off('gameState');
      socket.off('gameOver');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
      
      playerDataFetchedRef.current = false;
      usernamesCacheRef.current = {};
    };
  }, [roomId, onGameEnd, playerName, playerSide]);

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl mb-4 font-bold font-mono tracking-wide">{t("pong")}</h1>
      {gameOver && (
        <div className="text-2xl font-bold text-yellow-400 mb-4">
          {t("game_over")} {winner} {t("wins")}
        </div>
      )}
      <div className="mb-2 text-xl font-mono flex items-center w-full">
        <span className="text-cyan-400 flex w-1/2 justify-end items-center gap-2">
          <div className="relative flex flex-row justify-center items-center group gap-1">
            <span className="relative text-sm text-gray-300 truncate max-w-[100px] md:overflow-visible md:max-w-full">
              {playersDisplayNames?.left || playersNames?.left}
            </span>
            <img src={usersImages && usersImages[0]?.user_image || ""}
            alt="" className='rounded-full bg-cover w-12 h-12' />
          </div>
          {winner === (playersDisplayNames?.left || playersNames?.left) && score.left === 6 ? 7 : score.left}
        </span>
        <span className="mx-4 text-gray-500">|</span>
        <span className="text-pink-400 flex w-1/2 justify-start items-center gap-2">
          {winner === (playersDisplayNames?.right || playersNames?.right) && score.right === 6 ? 7 : score.right}
          <div className="relative flex flex-row justify-center items-center group gap-1">
            <img src={usersImages && usersImages[1]?.user_image || ""}
            alt="" className='rounded-full bg-cover w-12 h-12' />
            <span className="relative text-sm text-gray-300 truncate max-w-[100px] md:overflow-visible md:max-w-full">
              {playersDisplayNames?.right || playersNames?.right}
            </span>
          </div>
        </span>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="rounded-lg border-2 border-white shadow-xl cursor-none"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {isMobile && playerSide && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
          />
        )}
      </div>

      <p className="mt-4 text-sm text-gray-400 font-mono">
        {isMobile 
          ? t("touch_right")
          : t("ws")
        }
      </p>
    </div>
  );
};

export default GameWrapper;
