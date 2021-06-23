"use strict";

const qrcode = new QRCode(document.getElementById("qrCode"), {
	width: 350,
	height: 350,
	text : ''
});

let socket;

$("#checkout").click(async function() {

	let res = await fetch('/trtl/prepare');
	let data = await res.json();

	var n = Math.floor(Math.random() * 11);
	var k = Math.floor(Math.random() * 1000000);
	var m = String.fromCharCode(n) + k;
	// m = '';

	let name = window.encodeURIComponent("DashGL Shop" + m);
	let base = data.qrCode.substr(58);
	let url = `${base}&name=${name}`;

	qrcode.clear();
	qrcode.makeCode(url);
	$('#link').attr('href', url);
	
	$("#exampleModal").modal("show");

	socket = new WebSocket('wss://trtl.dashgl.com/ws');

	socket.addEventListener('open', function (event) {
		socket.send('Hello Server!');
	});

	socket.addEventListener('message', function (event) {
		console.log('Message from server ', event.data);
	});

	socket.addEventListener('close', function (event) {
		console.log('Socket closed!!!');
	});

});

$('#exampleModal').on('hidden.bs.modal', function () {
	
	console.log("Modal closed");
	socket.close();

});
