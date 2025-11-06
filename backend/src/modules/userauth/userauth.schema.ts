import { kMaxLength } from "buffer";

export const user_signup = {
	type: "object",
	required: [
		"username",
		"email",
		"first_name",
		"family_name",
		"password",
		"confirmpassword",
	],
	properties: {
		first_name: {
			type: "string",
			maxLength: 25,
			minLength: 1,
			pattern: "^[A-Za-z]+(?: [A-Za-z]+)*$",
			errorMessage: "First name must not be empty and contain only letters ",
		},
		family_name: {
			type: "string",
			maxLength: 25,
			minLength: 1,
			pattern: "^[A-Za-z]+(?: [A-Za-z]+)*$",
			errorMessage: "Family name  must not be empty and contain only letters",
		},
		username: {
			type: "string",
			maxLength: 25,
			minLength: 2,
			pattern: "^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$",
			errorMessage:
				"Username should not be empty or have fewer than two characters",
		},
		email: {
			type: "string",
			format: "email",
			errorMessage: "Email must be a valid email address : ***@gmail.com",
		},
		password: {
			type: "string",
			minLength: 8,
			pattern: "^[^\\s]*$",
			errorMessage: "Password must be at least 8 characters",
		},
		confirmpassword: {
			type: "string",
			minLength: 8,
			pattern: "^[^\\s]*$",
			errorMessage: "Confirm password must be at least 8 characters",
		},
	},
	additionalProperties: false,
};

export const user_signin = {
	type: "object",
	required: ["username", "password"],
	properties: {
		username: {
			type: "string",
			minLength: 1,
			errorMessage: "You didn't enter the username",
		},
		password: {
			type: "string",
			minLength: 1,
			errorMessage: "You didn't enter the password",
		},
		twoFA: { type: "number" },
	},
	additionalProperties: false,
};

export const user_Verify2fa = {
	type: "object",
	required: ["twofa", "username", "password"],
	properties: {
		twofa: { type: "number" },
		username: { type: "string" },
		password: { type: "string" },
	},
	additionalProperties: false,
};
