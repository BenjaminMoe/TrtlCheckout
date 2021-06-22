"use strict";

const fetch = require('node-fetch')
const express = require('express')
const app = express()
const port = 2800

const addr = 'TRTLv3bpWo5KR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPUsUcgB';
const view = '9fcb0087252c147657af23700810cad0bceee0b4fdf2a4479406b9f2636eae0d';

app.use(express.json());

app.get('/trtl/prepare', async function(req, res) {

	const body = {
		amount : 10000,
		address : addr,
		privateViewKey : view,
		callback : "https://trtl.dashgl.com/trtl/process"
	}

	let prep = await fetch('https://api.turtlepay.io/v2/new', {
		headers: {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
    	},
    	method : "POST",
    	body: JSON.stringify(body)
	});

	console.log(prep);

	let data = await prep.json();

	console.log(data);

	res.json(data);

});

app.post('/trtl/process', function(req, res) {

	console.log('ConfIRMED PAYMENT!!!');
	console.log(req.body);
	res.end("okay thank you");

});

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
