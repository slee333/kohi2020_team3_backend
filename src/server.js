require('dotenv').config();
import {
	GraphQLServer
} from 'graphql-yoga';
import logger from "morgan";
import schema from "./schema";

// read PORT Number from .env file
const PORT = process.env.PORT || 4100;

// run server
const server = new GraphQLServer({	schema });

server.express.use(logger("dev"))

server.start({
		port: PORT
	}, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);

// misc
//console.log('Hello! Do I need prisma though?\n I just need to run some Python code - no need of database');