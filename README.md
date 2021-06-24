# TrtlCheckout

This repository provides a sample page for providing an online checkout,
powered by TurtlePay.

![Screenshot 2021-06-24 at 16-45-10 Shell Shop](https://user-images.githubusercontent.com/86194145/123223117-966cc780-d50b-11eb-98e2-0aa10496b3e9.png)

[###Live Version](https://shellshop.lol/)

### How to Use

This is a simple page that was created for a proof of concept to use Turtlecoin as a payment option for online checkout. To complete the payment process, click on the 'Checkout' button, scan the QR code with the TonChan wallet, and send the amount. From there confirmation of the payment will take anywhere from two to five minutes. After which, your download will start automatically. 

### How to Replicate

To replicate this repository, clone on a Linux computer running Nodejs. Run npm install to install the requires modules to run the application. In the TrtlCheckout.js change the addr variable to your wallet address, and change the view variable to your private view key. 

### Limitations

This limitations of this checkout method if you have no control over if and when the QR code has been read by the end user. Right now this would rely on honest reporting from an end user to click a button that said, "i scanned the QR code", or "I sent the payment", to change the state of the checkout modal from a QR code to a waiting spinner for the callback from Turtlepay. This could potentially be amended by adding in webhooks to the wallet application in some shape or form to let the checkout application know the state and intention of the end-user to be able to respond accordingly. 

### License

MIT License 2021 Benjamin Collins
