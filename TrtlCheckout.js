"use strict";

const fetch = require('node-fetch')
const express = require('express')
const WebSocket = require('ws')
const http = require('http');
const app = express()
const port = 2800

const addr = 'TRTLv3bpWo5KR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPUsUcgB';
const view = '9fcb0087252c147657af23700810cad0bceee0b4fdf2a4479406b9f2636eae0d';

const server = http.createServer(app);
app.use(express.json());

app.get('/trtl/prepare', async function(req, res) {

	const body = {
		amount : 10000,
		address : addr,
		privateViewKey : view,
		callback : "https://trtl.dashgl.com/trtl/process",
		confirmations : 30,
		name : "DashGL Shop"
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
	res.json(data);

});


let callbacks = 0;
app.post('/trtl/process', function(req, res) {
	
	callbacks++;
	console.log('ConfIRMED PAYMENT!!!', callbacks);
	console.log(req.body);

	res.status(200).end();

});

app.use(express.static('public'))

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {

	//connection is up, let's add a simple simple event
	ws.on('message', (message) => {

		//log the received message and send it back to the client
		console.log('received: %s', message);
		ws.send(`Hello, you sent -> ${message}`);
	});

	//send immediatly a feedback to the incoming connection	
	ws.send('Hi there, I am a WebSocket server');

});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
