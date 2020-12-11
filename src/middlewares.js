import {PythonShell} from 'python-shell';

let options = {
	mode: 'text',
	pythonPath: 'D:/Users/seung/anaconda3/python',
	pythonOptions: ['-u'], // get print results in real-time
	args: ['value1', 'value2', 'value3']
  };

const pyshell = new PythonShell.runString('x=1+1;print(x)', options, function (err) {
  if (err) throw err;
  console.log('finished');
});

export default pyshell