import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { tournaments, Tournament } from "./tournamentStore";
import { games, createGame, addPlayerToGame, getGame, Game } from "./gameManager";
import { getUserImage, getUserName } from "../../../utils/userauth.utils";
import { handlePlayerLeft } from "./tournamentUtils";
import { getdisplay_name } from "../../../utils/settings.utils";
import { getBlockUsers } from "../../../utils/friends.utils";
import { create_tournament_schema, get_tournament_schema, get_users_schema } from "./tournament.schema";
import { userSockets } from "../../socket/chat/chat.handlers";
interface CreateTournamentBody {
  name: string;
  maxPlayers: number;
  ownerName: string;
  ownerPlays: boolean;
}

interface JoinTournamentParams {
  id: string;
}

interface JoinTournamentBody {
  user: number;
}

interface userData {
  id:string;
  user_image:string;
}

export default async function tournamentRoutes(app: FastifyInstance) {
  // CREATE TOURNAMENT
  app.post('/tournament', {
    schema: {
      body: create_tournament_schema,
    }
  }, async (
    req: FastifyRequest<{ Body: CreateTournamentBody }>,
    res: FastifyReply
  ) => {
    const { name, maxPlayers, ownerPlays } = req.body;

    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .code(401)
        .send({
          userinfo: false,
          message: "No access token in cookies",
          accesstoken: false,
          refreshtoken: true,
        });
    }
    const decode = app.jwt.decode(token) as { userid: number };

    const ownerName = decode.userid.toString();
    if (!name || maxPlayers !== 4) {
      return res.status(400).send({ error: "Tournament name and at least 4 players are required." });
    }

    if (ownerPlays && Object.values(tournaments).some(t => t.players.includes(ownerName))) {
      return res.status(400).send({ error: "Player already in a tournament." });
    }

    const id = uuidv4();
    const players: string[] = ownerPlays ? [ownerName] : [];

    const tournament: Tournament = {
      id,
      name,
      owner: ownerName || "unknown",
      ownerPlays,
      maxPlayers,
      players: players,
      participants: null,
      winners: players,
      losers: [],
      currentPlayers: players.length,
      countdown: null,
      roundes: 0,
      matches: [],
      status: "waiting",
    };

    tournament.roundes = 0;
    tournaments[id] = tournament;
    app.io.emit('tournaments_updated', Object.values(tournaments));

    return res.status(201).send({ tournament });
  });

  // JOIN TOURNAMENT (PRIVATE ROOM EMIT)
  app.post('/tournaments/:id/join', async (
    req: FastifyRequest<{ Params: JoinTournamentParams }>,
    res: FastifyReply
  ) => {
    const { id } = req.params;

    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .code(401)
        .send({
          userinfo: false,
          message: "No access token in cookies",
          accesstoken: false,
          refreshtoken: true,
        });
    }
    const decode = app.jwt.decode(token) as { userid: number };

    const user = decode.userid.toString();

    if (Object.values(tournaments).some(t => t.players.includes(user))) {
      return res.status(400).send({ error: "Player already in a tournament." });
    }
    const tournament = tournaments[id];
    if (!tournament) {
      return res.status(404).send({ error: "Tournament not found." });
    }

    if (tournament.status !== "waiting") {
      return res.status(400).send({ error: "Tournament already started." });
    }

    if (tournament.players.includes(user)) {
      return res.status(400).send({ error: "Player already joined." });
    }

    if (tournament.players.length >= tournament.maxPlayers) {
      return res.status(400).send({ error: "Tournament is full." });
    }

    if (!tournament.players.includes(user)) {
      tournament.players.push(user);
      tournament.winners = tournament.players;
      tournament.currentPlayers = tournament.players.length;
    }

    if (tournament.players.length === tournament.maxPlayers) {
      tournament.status = "in_progress";
    }

    app.io.emit('tournaments_updated', Object.values(tournaments));
    app.io.to(`tournament:${id}`).emit('tournament-updated', tournament);

    return res.status(200).send(tournament);
  });

  // LEAVE TOURNAMENT
  app.post('/tournaments/:id/leave', async (
    req: FastifyRequest<{ Params: JoinTournamentParams; Body: JoinTournamentBody }>,
    res: FastifyReply
  ) => {
    const { id } = req.params;
    
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .code(401)
        .send({
          userinfo: false,
          message: "No access token in cookies",
          accesstoken: false,
          refreshtoken: true,
        });
    }
    const decode = app.jwt.decode(token) as { userid: number };

    const user = decode.userid.toString();

    const tournament = tournaments[id];
    if (!tournament) {
      return res.status(404).send({ error: "Tournament not found." });
    }
    
    if (tournament.status !== "waiting") {
      return res.status(400).send({ error: "Tournament already started." });
    }
    
    const index = tournament.players.indexOf(user);
    if (index === -1) {
      return res.status(400).send({ error: "Player not in tournament." });
    }
    tournament.players.splice(index, 1);
    tournament.currentPlayers = tournament.players.length;
    
    app.io.emit('tournaments_updated', Object.values(tournaments));
    app.io.to(`tournament:${id}`).emit('tournament-updated', tournament);
    return res.status(200).send(tournament);
  });

  // GET TOURNAMENT BY ID
  app.get('/tournaments/:id', async (
    req: FastifyRequest<{ Params: JoinTournamentParams }>,
    res: FastifyReply
  ) => {
    const { id } = req.params;

    for (const tId in tournaments) {
      const tournament = tournaments[tId];
      if (tournament.id === id) {
        return res.status(200).send({ tournament });
      }
    }

    return res.status(404).send({ error: "Tournament not found." });
  });

  // GET ALL TOURNAMENTS
  app.get('/tournaments', async (_req: FastifyRequest, res: FastifyReply) => {
    return res.status(200).send(Object.values(tournaments));
  });
  // GET ALL USERS BY IDS
  app.post('/users', {
    schema: {
      body: get_users_schema,
    }
  }, async (req: FastifyRequest<{ Body: { ids: number[] } }>, res: FastifyReply) => {
    const { ids } = req.body;
    
    const users : string[] = [];
    for (const id of ids) {
      const userName = await getUserName(app, id);
      users.push(userName || "");
    }
    return res.status(200).send({ users });
  });

  app.post('/display-names', {
    schema: {
      body: get_users_schema,
    }
  }, async (req: FastifyRequest<{ Body: { ids: number[] } }>, res: FastifyReply) => {
    const { ids } = req.body;
    
    const users : string[] = [];
    for (const id of ids) {
      const userName = await getdisplay_name(app, parseInt(id));
      users.push(userName || "");
    }
    return res.status(200).send({ users });
  });

  // START TOURNAMENT

  app.post('/tournaments/:id/start', async (
    req: FastifyRequest<{ Params: JoinTournamentParams }>,
    res: FastifyReply
  ) => {
    const { id } = req.params;
    const tournament = tournaments[id];
  
    if (!tournament) {
      return res.status(404).send({ error: "Tournament not found." });
    }
  
    if (tournament.status !== "in_progress") {
      return res.status(400).send({ error: "Tournament cannot start until players are filled." });
    }

    const hasOngoingMatches = tournament.matches.some(match => 
      match.progress === 'in_progress' || match.progress === 'pending'
    );

    if (hasOngoingMatches) {
      return res.status(400).send({ 
        error: "Cannot start new round while matches are still in progress. Please wait for current round to complete." 
      });
    }
  
    // Initialize participants array at tournament start
    tournament.participants = [...tournament.players];
    const players = tournament.winners;

    let playerPairs: string[][] = [];

    if (!tournament.participants)
      tournament.participants = [...tournament.players];
    tournament.roundes = (tournament.roundes || 0) + 1;

    for (let i = 0; i < players.length; i += 2) {
      const pair = players.slice(i, i + 2);
        playerPairs.push(pair);
    }

    playerPairs.forEach(pair => {
      const roomId = uuidv4();  
      createGame(roomId);
  
      pair.forEach(player => {
        addPlayerToGame({ roomId, playerName: player, socketId: player });
      });

      let game = getGame(roomId)
      if (game) {
        game.gameType = 'tournament';
        game.roomId = roomId;
        game.progress = 'pending';
        game.round = tournament.roundes || 0;
        tournament.matches.push(game);
      }
      
      setTimeout(() => {
        if (game) {
          game.progress = 'in_progress';
          app.io.to(`tournament:${id}`).emit('tournament-updated', tournament);
        }
      }, 10000);
      
      app.io.to(roomId).emit('game-starting', { countdown: 180, roomId });

      const notif = {
        type: 'tournament-match',
        name: tournament.name,
        roomId,
      }

      app.io.emit('tournament-notification', {notif})
      
      // Countdown and start game
      let countdown = 13;
      const interval = setInterval(() => {
        if (countdown <= 0) {
          clearInterval(interval);

          
          app.io.to(roomId).emit('game-start', { roomId, players: pair });
          setTimeout(() => {
            if (app.io.of("/").adapter.rooms.get(roomId)?.size != 2) {
              let playerName = game?.readyPlayers.includes(game?.players[0]) ? game?.players[1] : game?.players[0];
              handlePlayerLeft(app, app.io, roomId, playerName, tournament, game);
              
            } else {
              if (game)
                game.ready = true;
            }
          }, 1000);
        } else {
          app.io.to(roomId).emit('countdown', countdown - 3);
          countdown--;
        }
      }, 1000);
    });

  
    app.io.to(`tournament:${id}`).emit('tournament-updated', tournament);
  
    let tournamentCountdown = 10;
    app.io.to(`tournament:${id}`).emit('tournament-starting', tournamentCountdown);
  
    const tournamentInterval = setInterval(() => {
      tournament.countdown = tournamentCountdown;
      if (tournamentCountdown <= 0) {
        clearInterval(tournamentInterval);
        app.io.to(`tournament:${id}`).emit('readyToPlay', { matchId: id });
        app.io.to(`tournament:${id}`).emit('tournament-started', tournament);
      } else {
        app.io.to(`tournament:${id}`).emit('countdown', tournamentCountdown);
        tournamentCountdown--;
      }
    }, 1000);
  
    return res.status(200).send({ message: "Tournament is starting", tournament });
  });

  // DELETE endpoint for the torunament before it starts (only by the owner)
  app.delete('/tournaments/:id', async (
    req: FastifyRequest<{ Params: JoinTournamentParams }>,
    res: FastifyReply
  ) => {
    const { id } = req.params;
    const tournament = tournaments[id];
  
    if (!tournament) {
      return res.status(404).send({ error: "Tournament not found." });
    }
  
    if (tournament.status !== "waiting") {
      return res.status(400).send({ error: "Tournament can only be deleted when in waiting state." });
    }
    
    app.io.to(`tournament:${id}`).emit('tournament-deleted', { 
      message: 'Tournament has been deleted by the owner.',
      tournamentId: id 
    });
  
    delete tournaments[id];
  
    app.io.emit('tournaments_updated', Object.values(tournaments));

    return res.status(200).send({ message: "Tournament deleted successfully." });
  });

  // GET USER IMAGE BY IDS
  app.post('/user-image',  {
    schema: {
      body: get_users_schema,
    }
  }, async (
    req: FastifyRequest<{ Body: { ids: number[] }}>,
    res: FastifyReply
  ) => {
    const { ids } = req.body;
    const users : userData[] = [];
    for (const id of ids) {
      const userImage = await getUserImage(app, id);
      if (!userImage)
        res.status(404).send({ error: `User image not found for ID: ${id}` });
      users.push({
        id,
        user_image:userImage || ""
      });
    }
    return res.status(200).send({ users });
  });

  // GET GAME BY ID (FOR INVITE LINKS)
  app.get("/invite/:gameid", async (
    req: FastifyRequest<{ Params: { gameid: string }}>,
    res: FastifyReply
  ) => {
    const { gameid } = req.params;
    const game = getGame(gameid);
    if (game === undefined)
      return res.status(404).send({error: "Game not found."});
    return res.status(200).send({game});
  })

  // GET ONGOING TOURNAMENT GAME FOR A PLAYER
  app.post("/tournament-game", {
    schema: {
      body: get_tournament_schema,
    }
  }, async (
    req: FastifyRequest<{ Body: { tournamentId: string; playerId: number } }>,
    res: FastifyReply
  ) => {
    const { tournamentId, playerId } = req.body;
  
    // Check if the tournament exists
    const tournament = tournaments[tournamentId];

    if (!tournament) {
      return res.status(404).send({ error: "Tournament not found." });
    }
  
    // Check if the game exists and is still ongoing
    const ongoingGame = Array.from(games.values()).find((game: Game) =>
      game.players.includes(String(playerId))
    );
    
    if (!ongoingGame) {
      return res.status(404).send({ error: "No ongoing game found for the player." });
    }
    
  
    // Return the game details
    return res.status(200).send({
      message: "Game found.",
      game: ongoingGame,
    });
  });

  app.post("/get-blocked-users", {
    schema: {
      body: {
        type: "object",
        properties: {
          userId: { type: "integer" },
        },
        required: ["userId"],
      },
    }
  }, async (
    req: FastifyRequest<{ Body: { userId: number }}>,
    res: FastifyReply
  ) => {
    const blockedUsers: number[] = [];
    
    try {
      const token = req.cookies.accessToken;
			if (!token)
				return res
					.code(401)
					.send({
						message: "No access token in cookies",
						accesstoken: false,
						refreshtoken: true,
					});

			const decode = app.jwt.decode(token) as { userid: number };
      const blocked = await getBlockUsers(app, decode.userid);


      // instead of blocked[0].id to blocked.map(b => b.id)
      blocked.map(b => blockedUsers.push(b.id));

      return res.code(200).send({ blockedUsers });
    } catch (error) {
      return res.code(400).send({ error: "An error occurred" });
    }
  });
}