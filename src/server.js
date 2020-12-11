require('dotenv').config();
import {
	GraphQLServer
} from 'graphql-yoga';
import logger from "morgan";
import schema from "./schema";
import { PythonShell } from 'python-shell';
import cors from "cors";

// read PORT Number from .env file
const PORT = process.env.PORT || 4100;

// run server
// const server = new GraphQLServer({ schema });

const express = require('express')
const bodyParser = require('body-parser');
const app = express()


app.use(express.json());
app.use(cors());
app.use(logger("dev"))

app.listen(PORT, () => {
	console.log(`Server running on  http://localhost:${PORT}`)
})


// server.start({
// 	port: PORT
// }, () =>
// 	console.log(`Server running on http://localhost:${PORT}`)
// );


let options = {
	mode: 'text',
	pythonPath: 'D:/Users/seung/anaconda3/python',
	pythonOptions: ['-u'], // get print results in real-time 
	scriptPath: 'D:/Workspace/kohi2020_team3_backend/src'
};

let pyshell = new PythonShell('main.py', options);

app.post('/submit', function (req, res) {
	pyshell.send(JSON.stringify(req.body))
		// .on('message', function (message) {
		// 	res.send(JSON.stringify(message));
		// })
	res.send(JSON.stringify(message));

	// .end((err)=> {
	// 	if (err){
	// 		console.log(err);
	// 		// res.send('ERRORRRR');
	// 	} else {
	// 		pyshell.receive('data', function( data ){
	// 			console.log(data)
	// 			// res.send('POST request to the homepage');
	// 		})

})
// pyshell.stdout.on('daa')
pyshell.on('message', function (message) {
	// received a message sent from the Python script (a simple "print" statement)
	console.log(message);
});


app.get('/', (req, res) => {
	res.send('Hello World!')
})


// PythonShell.run('main.py', options, function (err) {F
//   if (err) throw err;
//   console.log('finished');
// });
// misc
//console.log('Hello! Do I need prisma though?\n I just need to run some Python code - no need of database');