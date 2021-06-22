"use strict";

const qrcode = new QRCode(document.getElementById("qrCode"), {
	width: 350,
	height: 350,
	text : ''
});

$("#checkout").click(async function() {

	let data = {
  sendToAddress: 'TRTLuxwS2TA9G42nRC66sbHdBdTKrshYYAbezuZNh68CJ8NSwuALr2BAbooKT4pCZZHFtNuQY4awJHRjspfCFEqa94Zbhvf7yxwKR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPSxfhb1',
  paymendId: '92f91aedfe3bcc37c3de9a58b08efebc41609e642584a1289f39b56372650207',
  atomicAmount: 100000,
  amount: 1000,
  userDefined: {},
  startHeight: 3693696,
  endHeight: 3693816,
  confirmations: 60,
  callbackPublicKey: '2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d494942496a414e42676b71686b6947397730424151454641414f43415138414d49494243674b4341514541314f66786e386e615a544261367668697a4f6f340a486a35533538507a4f47644552776e6e705632644b3771644b31715a636443762b596a44376b4f4f6b31667467626c396e4b7a6b3848485a6e2b5170764745760a327448776f7430707a6b7941686a786278496c323133472f765061514f443741356277627a56513147616e7a4938327178755a55465a345058322b2f6e6158490a567a7a62613666634a57446b5a44554a627562545a424a71612f585468714741554a6a78376c4c73384d523032527a6554436f35733962374b4e4b6e645435330a397a4e787a496a6b70783675355a3643395a375532505433774b69564b4d4c39394266454d617a5270794e5758744771736a69516b6243492b6b7247734132420a6d53375a314736734b6a4b796e4a5744696577334e347234396c58425947612f4135666c756b3147737650516477663932797638716a6271717365636f79544c0a52514944415141420a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d',
  qrCode: 'https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl=turtlecoin://TRTLuxwS2TA9G42nRC66sbHdBdTKrshYYAbezuZNh68CJ8NSwuALr2BAbooKT4pCZZHFtNuQY4awJHRjspfCFEqa94Zbhvf7yxwKR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPSxfhb1?amount=100000'
};
	
	let res = await fetch('/trtl/prepare');
	data = await res.json();
	console.log(data);

	$("#exampleModal").modal("show");

	let url = data.qrCode.substr(58);
	// let addr = data.sendToAddress;
	let addr = 'TRTLv3bpWo5KR6ACMJ4cJeXq2CVtEwEwZhTJvSyriKjYjWEMS9Rb9Wwf4mDo3WTzDZNP1gPHYp8bJ7VYCgbHGxcvgFjXPUsUcgB';
	let payId = data.paymendId;
	let name = window.encodeURIComponent("DashGL");
	console.log(name);
	let amt = data.atomicAmount;
	
	console.log(addr);
	//url = `turtlecoin://${addr}?amount=${amt}&name=${name}&paymentId=${payId}`;
	//url = `turtlecoin://${addr}?amount=${amt}&name=${name}&paymentid=${payId}`;
	let base = data.qrCode.substr(58);
	url = `${base}&name=${name}&paymentid=${payId}`;
	url = `${base}&name=${name}`;

	// let uri = parseURI(url);
	
	qrcode.clear();
	qrcode.makeCode(url);
	$('#link').attr('href', url);

});

const Config = {
	uriPrefix : 'turtlecoin://'
}

async function parseURI(qrData) {

    /* It's a URI, try and get the data from it */
    if (qrData.startsWith(Config.uriPrefix)) {
        /* Remove the turtlecoin:// prefix */
        let data = qrData.replace(Config.uriPrefix, '');
        let index = data.indexOf('?');

        /* Doesn't have any params */
        if (index === -1) {
            index = data.length;
        }

        const address = data.substr(0, index);
        const params = parseQuery(data.substr(index));
		console.log(params);

        const amount = params.amount;
        const name = params.name;
        let paymentID = params.paymentid;

        if (paymentID) {
            const pidError = validatePaymentID(paymentID);
            
			/* Payment ID isn't valid. */
            if (pidError) {
                return {
                    valid: false,
                    error: 'QR Code is invalid',
                };
            }

            /* Both integrated address and payment ID given */
            if (address.length === Config.integratedAddressLength && paymentID.length !== 0) {
                return {
                    valid: false,
                    error: 'QR Code is invalid',
                };
            }
        }

        const addressError = await validateAddresses([address], true, Config);

        /* Address isn't valid */
        if (addressError.errorCode !== WalletErrorCode.SUCCESS) {
            return {
                valid: false,
                error: 'QR Code is invalid',
            };
        }

        const amountAtomic = Number(amount);

        /* No name, need to pick one.. */
        if (!name) {
            return {
                paymentID: paymentID || '',
                address,
                amount: !isNaN(amountAtomic) ? amountAtomic : undefined,
                suggestedAction: 'NewPayee',
                valid: true,
            }
        }

        const newPayee = {
            nickname: name,
            address: address,
            paymentID: paymentID || '',
        }

        const existingPayee = Globals.payees.find((p) => p.nickname === name);

        /* Payee exists already */
        if (existingPayee) {
            /* New payee doesn't match existing payee, get them to enter a new name */
            if (existingPayee.address !== newPayee.address ||
                existingPayee.paymentID !== newPayee.paymentID) {
                return {
                    paymentID: paymentID || '',
                    address,
                    amount: amountAtomic,
                    suggestedAction: 'NewPayee',
                    valid: true,
                };
            }
        /* Save payee to database for later use */
        } else {
            Globals.addPayee(newPayee);
        }

        if (!amount) {
            return {
                payee: newPayee,
                suggestedAction: 'Transfer',
                valid: true,
            };
        } else {
            return {
                payee: newPayee,
                amount: amountAtomic,
                suggestedAction: 'Confirm',
                valid: true,
            };
        }
    /* It's a standard address, try and parse it (or something else) */
    } else {
        const addressError = await validateAddresses([qrData], true, Config);

        if (addressError.errorCode !== WalletErrorCode.SUCCESS) {
            return {
                valid: false,
                error: 'QR code is invalid',
            };
        }

        return {
            valid: true,
            address: qrData,
            suggestedAction: 'NewPayee',
        }
    }
}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function validatePaymentID(paymentID, allowEmptyString) {

    if (paymentID === '' && allowEmptyString) {
        return false;
    }

    if (paymentID.length !== 64) {
		console.error('INVALID LENGTH');
		return true;
    }

    if (paymentID.match(new RegExp(/[a-zA-Z0-9]{64}/)) === null) {
		console.error('INVALID CHARACTERS');
		return true;
    }

    return false;
}
