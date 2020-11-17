require('dotenv').config();
import {
	GraphQLServer
} from 'graphql-yoga';

// read PORT Number from .env file
const PORT = process.env.PORT || 4111;

// Define types
const typeDefs = `
    type Query {
        hello: String!
    }
`;

// add resolver
const resolvers = {
	Query: {
		hello: () => 'hi'
	}
};

// run server
const server = new GraphQLServer({
	typeDefs,
	resolvers
});

server.start({
		port: PORT
	},
	() => {
		// Callback function
		'Server running on port: ${PORT}';
	}
);

// misc
console.log('Hello! Do I need prisma though?\n I just need to run some Python code - no need of database');