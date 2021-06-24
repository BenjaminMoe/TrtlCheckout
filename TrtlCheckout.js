
/******************************************************************************
 *
 * MIT License
 *
 * Copyright (c) 2021 Benjamin Collins benjamin@collins.moe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *****************************************************************************/

"use strict";

const fs = require('fs')
const fetch = require('node-fetch')
const express = require('express')
const WebSocket = require('ws')
const sqlite3 = require('sqlite3').verbose();
const Handlebars = require('handlebars');

const http = require('http');
const app = express()
const port = 2800

const addr = 'TRTLv3bpWo5KR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPUsUcgB';
const view = '9fcb0087252c147657af23700810cad0bceee0b4fdf2a4479406b9f2636eae0d';

const server = http.createServer(app);
app.use(express.json());

const db = new sqlite3.Database('db.sqlite');
db.serialize(function() {

	db.run(`
		CREATE TABLE IF NOT EXISTS dat_models (
			name VARCHAR(255) UNIQUE,
			views INT DEFAULT 0,
			downloads INT DEFAULT 0
		)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS dat_stats (
			paymentId VARCHAR(255) UNIQUE,
			startTime UNSIGNED BIG INT,
			confTime UNSIGNED BIG INT,
			completeTime UNSIGNED BIG INT,
			details TEXT
		)
	`);

	db.run(`
		INSERT OR IGNORE INTO dat_models 
			( name ) 
		VALUES
			( 'dashie' )
	`)

});

const mem = {}

function random (len) {

	len = len || 4;
    let chars = 'abcdefghijklmnopqrstuvwxyz';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;

};

app.get('/trtl/prepare', async function(req, res) {

	const body = {
		amount : 50000,
		address : addr,
		privateViewKey : view,
		callback : "https://shellshop.lol/trtl/process",
		name : "ShellShop_" + random(),
		confirmations : 10
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

	res.json(data);

	let sql = `
		INSERT INTO dat_stats
			( paymentId, startTime)
		VALUES 
			( ?, ? )
	`;

	let args = [
		data.paymendId || data.paymentId,
		Date.now()
	];

	db.run(sql, args, function(err) {
		if(err) {
			throw err;
		}
	});

});

app.get('/assets/dashie.rar*', async function(req, res, next) {

	let sql = `
		UPDATE
			dat_models
		SET 
			downloads = downloads + 1
		WHERE
			name = 'dashie'
	`;
	
	db.run(sql, function(err) {
		if(err) {
			console.log("Error 100");
			throw err;
		}
	});

	console.log('An attempt was made!!!!');
	console.log(req.query.paymentId);
	console.log(' ----- ');
	
	if(!mem[req.query.paymentId]) {
		res.status(403);
		return res.end('Not Authorized');
	}

	next();

});


app.post('/trtl/process', function(req, res) {

	if(req.body.confirmationsRemaining % 10 === 0) {
		console.log("%s %s %s", req.body.paymentId, req.body.status, req.body.confirmationsRemaining);
	}

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

		let sql = `
			UPDATE 
				dat_stats
			SET
				confTime = ?
			WHERE
				paymentId = ?
		`;
	
		let args = [
			Date.now(),
			req.body.paymentId
		];

		db.run(sql, args, function(err) {
			if(err) {
				console.log("Error 200");
				throw err;
			}
		});

	}

	if(req.body.status === 200) {
		
		console.log('Complete!!');
		console.log(req.body);

		setTimeout( function() {
			delete mem[req.body.paymentId];
		}, 3600000);

		let sql = `
			UPDATE 
				dat_stats
			SET
				completeTime = ?,
				details = ?
			WHERE
				paymentId = ?
		`;
	
		let args = [
			Date.now(),
			JSON.stringify(req.body),
			req.body.paymentId
		];

		db.run(sql, args, function(err) {
			if(err) {
				console.log("Error 300");
				throw err;
			}
		});

	} else if(req.body.status !== 102) {
		console.log(req.body);
	}

	mem[req.body.paymentId] = req.body.status;
	res.status(200).end();

});

const source = fs.readFileSync('public/index.html').toString();
const template = Handlebars.compile(source);

app.get(['/', 'index.html'], function(req, res) {

	let sql = `
		SELECT
			views,
			downloads
		FROM
			dat_models
		WHERE
			name = 'dashie'
	`;

	db.get(sql, function(err, data) {
		if(err) {
			console.log("Error 500");
			throw err;
		}
		
		data.views++;
		data.views = data.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		data.downloads = data.downloads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

		let result = template(data)
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(result);
	});

	sql = `
		UPDATE
			dat_models
		SET 
			views = views + 1
		WHERE
			name = 'dashie'
	`;
	
	db.run(sql, function(err) {
		if(err) {
			console.log("Error 600");
			throw err;
		}
	});

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
