"use strict";

const express = require('express')
const app = express()
const port = 2800

const addr = 'TRTLv3bpWo5KR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPUsUcgB';
const view = '9fcb0087252c147657af23700810cad0bceee0b4fdf2a4479406b9f2636eae0d';

app.post('/trtl/prepare', function(req, res) {

	const body = {
		amount : 100000,
		address : addr,
		privateViewKey : view,
		callback : "https://trtl.dashgl.com/trtl/process"
	}

});

app.all('/trtl/process', function(req, res) {

});

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
