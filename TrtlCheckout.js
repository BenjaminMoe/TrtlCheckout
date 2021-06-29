
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
const express = require('express');
const WebSocket = require('ws');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const Handlebars = require('handlebars');
const WB = require('turtlecoin-wallet-backend');
const daemon = new WB.Daemon('192.168.10.103', 11898);

const http = require('http');
const app = express()
const port = 2800

const wallet = {
	api : null,
	filename : 'mywallet.wallet',
	password : 'keyboard_cat'
}

if(fs.existsSync(wallet.filename)) {
	open_wallet();
} else {
	create_wallet();
}

async function open_wallet() {

	console.log('Open Existing wallet!!');
	
	const w = await WB.WalletBackend.openWalletFromFile(daemon, wallet.filename, wallet.password);
	let err = w[1];
	if(err) {
		throw err;
	}

	wallet.api = w[0];

	try {
		await wallet.api.start();
	} catch(err) {
		throw err;
	}

	// Do the stuff and things

	show_address();
	append_events();
	
}

async function create_wallet() {
	
	console.log('Create a new wallet!!');

	try {
		wallet.api = await WB.WalletBackend.createWallet(daemon);
	} catch(err) {
		throw err;
	}

	console.log(wallet.api);
	
	console.log('Created wallet');
	
	try {
		await wallet.api.start();
	} catch(err) {
		throw err;
	}
	
	console.log('Started wallet');
	wallet.api.saveWalletToFile(wallet.filename, wallet.password);

	// Do the stuff and things

	show_address();
	append_events();

}

async function show_address() {
	
	let i = 0;
	for (const address of wallet.api.getAddresses()) {
		i++;
		console.log(`Address [${i}]: ${address}`);
		wallet.address = address
	}
	
	const privateViewKey = wallet.api.getPrivateViewKey();
	console.log('Private view key:', privateViewKey);	
	await wallet.api.rescan();

}

function append_events() {

	wallet.interval = setInterval(async function() {

        const [unlocked, locked] = await wallet.api.getBalance();
        console.log("Balance: %s %s", unlocked, locked);
        const [walletBlockCount, localDaemonBlockCount, networkBlockCount] = wallet.api.getSyncStatus();
        console.log("Wallet block count: ", walletBlockCount);
        console.log("Local Daemon Block Count: ", localDaemonBlockCount);
        console.log("Network Block Count: ", networkBlockCount);

    }, 60000);


	wallet.api.on('transaction', async (transaction) => {
		console.log('GOT A TRANSACTION!!!');
		console.log(transaction);

		const tx = await wallet.api.getTransaction(transaction.hash);

		if (tx) {
			console.log(`Tx ${tx.hash} is worth ${WB.prettyPrintAmount(tx.totalAmount())}`);
			console.log(tx);
		} else {
			console.log("Couldn't find transaction! Is your wallet synced?");
		}
		
		mem[transaction.paymentID] = 200;
		setTimeout( function() {
			delete mem[transaction.paymentID];
		}, 3600000);
		
		wss.clients.forEach(function each(client) {
			if(client.paymentId !== transaction.paymentID) {
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
			transaction.paymentID
		];

		db.run(sql, args, function(err) {
			if(err) {
				console.log("Error 200");
				throw err;
			}
		});

	});

}

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


app.get('/trtl/prepare', async function(req, res) {

	crypto.randomBytes(32, (err, buf) => {
		if (err) {
			throw err;
		}
		const paymentid = buf.toString('hex');
		console.log("The paymentid is: " + paymentid);
		
		let addr = wallet.address;
		let name = "ShellShop_node";
		let amount = 10000;
		
		const url = `turtlecoin://${addr}?amount=${amount}&name=${name}&paymentid=${paymentid}`;
		
		let data = {
			name : name,
			paymentId : paymentid,
			address : addr,
			amount : amount,
			url : url
		}
		
		let sql = `
			INSERT INTO dat_stats
				( paymentId, startTime)
			VALUES 
				( ?, ? )
		`;

		let args = [
			data.paymentId,
			Date.now()
		];

		db.run(sql, args, function(err) {
			if(err) {
				throw err;
			}
		});
		
		res.json(data);

	});

});

app.get('/assets/dashie.rar*', async function(req, res, next) {

	console.log('An attempt was made!!!!');
	console.log(req.query.paymentId);
	console.log(' ----- ');
	
	if(req.query.paymentId === 'bypass') {
		// Do nothing, force allow the user to download
	} else if(!mem[req.query.paymentId]) {
		res.status(403);
		return res.end('Not Authorized');
	} else {

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

	}

	next();

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

function exit_handler() {
	
	console.log('Stopping the wallet!!');
	wallet.api.stop();
	clearInterval(wallet.interval);

}

process.on('exit', exit_handler);
process.on('SIGINT', exit_handler);
process.on('SIGUSR1', exit_handler);
process.on('SIGUSR2', exit_handler);
process.on('uncaughtException', exit_handler);
