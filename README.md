# TrtlCheckout

This repository provides a sample page for providing an online checkout,
powered by TurtlePay.

![Screenshot 2021-06-24 at 16-45-10 Shell Shop](https://user-images.githubusercontent.com/86194145/123223117-966cc780-d50b-11eb-98e2-0aa10496b3e9.png)

[###Live Version](https://shellshop.lol/)

### How to Use

This is a simple page that was created for a proof of concept to use Turtlecoin as a payment option for online checkout. To complete the payment process, click on the 'Checkout' button, scan the QR code with the TonChan wallet, and send the amount. From there confirmation of the payment will take anywhere from two to five minutes. After which, your download will start automatically. 

### How to Replicate

To replicate this repository, clone on a Linux computer running Nodejs. Run npm install to install the requires modules to run the application. In the TrtlCheckout.js change the addr variable to your wallet address, and change the view variable to your private view key. And then finally run node on the TrtlCheckout.js file to run the web server to run the example store application. 

### Limitations

The limitations of this checkout method if you have no control over if and when the QR code has been read by the end user. Right now this would rely on honest reporting from an end user to click a button that said, "i scanned the QR code", or "I sent the payment", to change the state of the checkout modal from a QR code to a waiting spinner for the callback from Turtlepay. This could potentially be amended by adding in webhooks to the wallet application in some shape or form to let the checkout application know the state and intention of the end-user to be able to respond accordingly. 

Another assumption is made with respects to timing. The Turtlepay API provides multiple callbacks for the number of confirmations a transaction has before finally providing a final callback for the transaction to complete. At minimum, the first callback seems to take about two minutes, and for the default 60 confirmations, the final callback will take a lot longer. This checkout makes the assumption that once the transaction is in the pipeline, it will eventually be verified. it is not known if this can cause complications with transactions that might somehow get rejected later. 

The alternative for smoother or faster payments would be for the store or another trusted service to host their own wallets. The shop could query the service for the user's balance and approval. The user would give their approval, likely via some form of second factor authorization, such as a code sent to their phone or a future perfect password. And then that service would provide a 'promise' to the shop. The shop would complete the sale, and the wallet service would provide the actual transfer at a later time. 

### License

MIT License 2021 Benjamin Collins
