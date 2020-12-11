require('dotenv').config();

import logger from "morgan";
import { PythonShell } from 'python-shell';
import cors from "cors";

// read PORT Number from .env file
const PORT = process.env.PORT || 4100;

const express = require('express')
const app = express()


app.use(express.json());
app.use(cors());
app.use(logger("dev"))

app.listen(PORT, () => {
	console.log(`Server running on  http://localhost:${PORT}`)
})

app.post('/submit', function (req, res) {
	const options = {
		mode: 'text',
		pythonPath: 'D:/Users/seung/anaconda3/python',
		pythonOptions: ['-u'], // get print results in real-time 
		scriptPath: 'D:/Workspace/kohi2020_team3_backend/src',
		args: [JSON.stringify(req.body)]
	};

	PythonShell.run( 'main.py', options, function(err, results){
		if (err) { throw err };
		console.log(results)
		res.send( results );
	})
})

app.get('/', (req, res) => {
	res.send('Hello World!')
})


// PythonShell.run('main.py', options, function (err) {F
//   if (err) throw err;
//   console.log('finished');
// });
// misc
//console.log('Hello! Do I need prisma though?\n I just need to run some Python code - no need of database');