const xrpl = require('xrpl');

const express = require('express');

const bodyParser = require('body-parser');

const timeout = require('connect-timeout');

const app = express();

const port = 8000;

const currentAddress = 'rD6y5Pbfn5GUzNVcszRKGht8hSDWLZfxpa';

const secret = 'sEdTD8qnMQFch7urLfxUoQX22HGABGU';

app.get('/mintNFT', (req, res) => {
	const tx = req.query.tx;
    const to = req.query.to;
	const amount = req.query.amount;
	const domain = req.query.domain;
    request(to, res);
});

async function mintNFT(to, res){
  
   const msg = new Object();
  
   const standby_wallet = xrpl.Wallet.fromSeed(secret);
   
   const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
   
   await client.connect();
    
   try
   {
	  // Check payment_tx
	  
	  const paymenttx = await client.request({
			command: 'tx',
			transaction: tx
	  });
	  
	  var tx_payment_status = paymenttx.result.meta.TransactionResult;
	  var tx_payment_account = paymenttx.result.Account;
	  var tx_payment_amount = paymenttx.result.Amount;
	  
	  if (tx_payment_status == 'tesSUCCESS'){
		  
		   const transactionBlob = {
			"TransactionType": "NFTokenMint",
			"Account": standby_wallet.classicAddress,
			"URI": xrpl.convertStringToHex(uri),
			"Flags": parseInt(8),
			"TransferFee": parseInt(0),
			"NFTokenTaxon": 999999999 
		  }
		  
		  const mint = await client.submitAndWait(transactionBlob, { wallet: standby_wallet} );
		  
		  var _status =  mint.result.meta.TransactionResult;
		  
		  if (_status == 'tesSUCCESS'){
			  tx_mint = mint.result.hash;
		  }
		  
		  if (tx_mint != '')
		  {
			  
		  }
	  }
	  
	  msg = {
			code: 200, 
			status: true,
			address: to,
			amount: amount,
			message: 'success',
			tx_mint: tx_mint,
			tx_payment: tx
	  }
	}
	catch(e){
		  msg = {
			code: 0, 
			status: false,
			address: to,
			amount: amount, 
			message: e.toString(),
			hash: hash
		 }
	 }
  
  return res.send(msg);
}

app.listen(port, () => {

});

