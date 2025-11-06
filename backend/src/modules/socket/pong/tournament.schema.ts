export const create_tournament_schema = {
	type: "object",
	required: ["name", "maxPlayers", "ownerPlays"],
	properties: {
		name: {
			type: "string",
			minLength: 1,
			maxLength: 50,
			errorMessage: "Tournament name must be between 1 and 50 characters",
		},
		maxPlayers: {
			type: "integer",
			enum: [4],
			errorMessage: "Max players must be one of the following values: 4",
		},
		ownerPlays: {
			type: "boolean",
			errorMessage: "Owner plays must be a boolean value",
		},
	},
}

export const leave_tournament_schema = {
	type: "object",
	required: ["playerName"],
	properties: {
		user: {
			type: "integer",
			errorMessage: "Player must be an integer",
		},
	},
}

export const get_users_schema = {
	type: "object",
	required: ["ids"],
	properties: {
		ids: {
			type: "array",
			items: {
				type: "integer",
			},
			errorMessage: "IDs must be an array of integers",
		},
	},
}

export const get_tournament_schema = {
	type: "object",
	required: ["tournamentId", "playerId"],
	properties: {
		tournamentId: {
			type: "string",
			errorMessage: "Tournament ID must be a string",
		},
		playerId: {
			type: "integer",
			errorMessage: "Player ID must be an integer",
		},
	},
}