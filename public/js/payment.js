"use strict";

const qrcode = new QRCode(document.getElementById("qrCode"), {
	width: 350,
	height: 350,
	text : ''
});

let paymentId, interval;
let paymentComplete = false;
let elapsed, elim;

let payStart, payStop;
let socket, data, startTime, stopTime;

function makeSocket() {

	socket = new WebSocket('wss://trtl.dashgl.com/ws');
	socket.addEventListener('open', function (event) {
		console.log('Socket open!!!');
		
		startTime = Date.now();
		if(paymentId) {
			socket.send(paymentId);
		}

		interval = setInterval(ping, 15000);
		elim = setInterval(track, 60000);

	});

	socket.addEventListener('error', function (event) {

		console.log('OMG SOCKET ERRRORZZ!');
		console.log(event);

	});

	socket.addEventListener('message', function (event) {
		console.log('Message from server ', event.data);
		paymentComplete = true;
		socket.close();
		clearInterval(interval);
		clearInterval(elim);
		payStop = Date.now();

		let ms = payStop - payStart;
		console.log(ms);

		let s = Math.floor(ms / 1000);
		console.log("%s seconds", s);
		let min = s / 60;
		console.log("Time Taken: %s minutes", min.toFixed(2));
		console.log('Payment CONFIRMED!!!!');

		$("#exampleModal").modal("hide");
		$("#checkout").text('Download');
		download();

	});

	socket.addEventListener('close', function (event) {
		console.log('Socket closed!!!');
		console.log(event);

		if(!paymentComplete) {
			stopTime = Date.now();
			let ms = stopTime - startTime;
			console.log("Closed after %s seconds", (ms/1000).toFixed(2));
			console.log('we need to re-open!!!');
			makeSocket();
		}

	});

}

function track() {

	elapsed = elapsed || 0;
	elapsed++;
	console.log("%s minute(s) have passed", elapsed);

}

function ping() {

	console.log('sending ping');
	socket.send('ping');

}

function download() {
	
	var a = document.createElement("a")
	a.href = 'assets/dashie.rar?paymentId=' + paymentId;
	a.setAttribute("download", 'dashie.rar');
	a.click();

}

$("#checkout").click(async function() {

	if(!paymentComplete && !paymentId) {

		let res = await fetch('/trtl/prepare');
		data = await res.json();

		console.log(data);
		let url = data.qrCode.substr(58);

		qrcode.clear();
		qrcode.makeCode(url);
		$('#link').attr('href', url);
	
		$("#exampleModal").modal("show");
		paymentId = data.paymendId || data.paymentId;
		console.log('Sending payment ID', paymentId);
		makeSocket();
		
		payStart = Date.now();

	} else if(!paymentComplete && paymentId) {
		
		$("#exampleModal").modal("show");

	} else {
		
		download();
		console.log('We do the download!!!');

	}

});

$('#exampleModal').on('hidden.bs.modal', function () {
	
	console.log("Modal closed");

});
