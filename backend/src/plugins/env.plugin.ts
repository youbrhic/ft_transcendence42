// import * as dotenv from 'dotenv';
// import * as path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Env {
	CLIENT_ID?: string;
	CLIENT_SECRUT?: string;
	GMAIL_PASSWORD?: string;
	GMAIL_ACCOUNT?: string;
	REFRSH_TOKEN?: string;
	JWT_SECRET?: string;
	COOKIE_SECRET?: string;
	DOMAINE_NAME?: string;
	CALLBACKURL?: string;
	REDERCURL?: string;
	CLOUDINARY_API_KEY?: string;
	CLOUDINARY_API_SECURTY?: string;
	CLOUDINARY_NAME?: string;
}

export const env : Env = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRUT: process.env.CLIENT_SECRUT,
	GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
	GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
	REFRSH_TOKEN: process.env.REFRSH_TOKEN,
	JWT_SECRET: process.env.JWT_SECRET,
	COOKIE_SECRET: process.env.COOKIE_SECRET,
	DOMAINE_NAME: process.env.DOMAINE_NAME,
	CALLBACKURL: process.env.CALLBACKURL,
	REDERCURL: process.env.REDERCURL,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECURTY: process.env.CLOUDINARY_API_SECURTY,
	CLOUDINARY_NAME: process.env.CLOUDINARY_NAME
};
