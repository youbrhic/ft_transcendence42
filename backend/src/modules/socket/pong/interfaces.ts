import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { Server as IOServer } from "socket.io";

export interface AuthenticatedSocket extends Socket {
	user?: any;
	numericId?: number;
	online?: boolean
}
  


export interface ballProps {
	x: number,
	y: number,
	dx: number,
	dy: number
}

export interface paddleProps {
	left: number,
	right: number
}

export interface scoreProps {
	left: number,
	right: number
}

export interface gameStateProps {
	ball: object,
	paddles: object,
	score: object
}

export interface resetBallProps {
	state: gameStateProps,
	leftScored: boolean,
	baseWidth: number,
	baseHeight: number,
	ballSpeed: number
}

export interface pongGameEventProps {
    fastify: FastifyInstance
    io: IOServer
    socket?: AuthenticatedSocket
}