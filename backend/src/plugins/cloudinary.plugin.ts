
import { FastifyInstance } from "fastify";
import  Multipart  from "@fastify/multipart";
import cloudinary from 'fastify-cloudinary'
import fp from "fastify-plugin";
import { env } from "./env.plugin";

const cloudinaryPlugin = async (fastify : FastifyInstance) => {
	fastify.register(Multipart, {
		limits: {
			fileSize: 10 * 1024 * 1024, // 10 MB
		  }
	});
	fastify.register(cloudinary, {
		url: `cloudinary://${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECURTY}@${env.CLOUDINARY_NAME}`
	});
}

export default fp(cloudinaryPlugin);