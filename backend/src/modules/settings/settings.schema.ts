

export const profile_setting = {
	type: 'object',
	required: ['username', 'display_name', 'first_name', 'family_name', 'Language', 'image_url', 'cover_url'],
	properties: {
		first_name: { type: 'string', maxLength: 25, minLength: 2, pattern: '^[A-Za-z]+(?: [A-Za-z]+)*$', errorMessage: "First name must not be empty and contain only letters " },
		family_name: { type: 'string', maxLength: 25, minLength: 2, pattern: '^[A-Za-z]+(?: [A-Za-z]+)*$', errorMessage: "Family name  must not be empty and contain only letters" },
		username: { type: 'string', maxLength: 25, minLength: 2, pattern: '^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$', errorMessage: "Username should not be empty or have fewer than two characters" },
		display_name: { type: 'string', maxLength: 25, minLength: 2, pattern: '^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$', errorMessage: "Username should not be empty or have fewer than two characters" },
		Language: { type: 'string', enum: ['es', 'en', 'fr'] },
		image_url: { type: 'string' },
		cover_url: { type: 'string' }
	},
	additionalProperties: false,
};

export const game_setting = {
	type: 'object',
	required: ['ball_color', 'paddle_color', 'table_color'],
	properties: {
		ball_color: { type: 'string' },
		paddle_color: { type: 'string' },
		table_color: { type: 'string' }
	},
	additionalProperties: false,
};

export const tictac_setting = {
	type: 'object',
	required: ['x_color', 'o_color', 'grid_color', 'board_color'],
	properties: {
		x_color: { type: 'string' },
		o_color: { type: 'string' },
		grid_color: { type: 'string' },
		board_color: { type: 'string' }
	},
	additionalProperties: false,
};

export const security_settings = {
	type: 'object',
	properties: {
		oldpassowrd: { type: 'string', minLength: 8, maxLength: 25, pattern: '^[^\\s]*$', errorMessage: "Password must be at least 8 characters" },
		password: { type: 'string', minLength: 8, maxLength: 25 , pattern: '^[^\\s]*$', errorMessage: "Password must be at least 8 characters" },
		confirmpassword: { type: 'string', minLength: 8,maxLength: 25 , pattern: '^[^\\s]*$', errorMessage: "Password must be at least 8 characters" },
		twoFA: { type: 'boolean' },
	},
	additionalProperties: false,
	anyOf: [
		{ required: ['password'] },
		{ required: ['twoFA'] }
	  ]
}
