"use strict";

const uniqid = require('uniqid')
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

const mem = {}

app.get('/trtl/prepare', async function(req, res) {

	const body = {
		amount : 10000,
		address : addr,
		privateViewKey : view,
		callback : "https://trtl.dashgl.com/trtl/process",
		name : uniqid()
	}

	let prep = await fetch('https://api.turtlepay.io/v2/new', {
		headers: {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		method : "POST",
		body: JSON.stringify(body)
	});

	let data = await prep.json();
	console.log(data);

	res.json(data);

});

app.get('/assets/dashie.rar*', async function(req, res, next) {

	console.log('An attempt was made!!!!');
	next();

});


app.post('/trtl/process', function(req, res) {

	console.log("%s %s %s", req.body.paymentId, req.body.status, req.body.confirmationsRemaining);

	if(!mem[req.body.paymentId]) {
		console.log('ConfIRMED PAYMENT!!!');
		console.log(req.body);
		wss.clients.forEach(function each(client) {
			if(client.paymentId !== req.body.paymentId) {
				return;
			}
			if (client.readyState !== WebSocket.OPEN) {
				return;
			}
			
			console.log('Payment confirmed, sending!!');
			client.send('Payment confirmed');
		});
	}

	if(req.body.status !== 102) {
		console.log(req.body);
	}

	mem[req.body.paymentId]  = req.body.status;
	res.status(200).end();

});

app.use(express.static('public'))

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
	
	ws.on('message', (message) => {

		if(message === 'ping') {
			return;
		}
		
		console.log(message);
		console.log('Setting payment id for ws client', message);
		ws.paymentId = message;

		if(mem[message]) {
			console.log('Payment confirmed, reporting');
			ws.send('Payment confirmed');
		}
	});

});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
