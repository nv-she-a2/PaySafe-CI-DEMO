require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidV4 } = require('uuid');
const privateApiKey = process.env.PRIVATE_API_KEY;
const headers = {
  "Content-Type": "application/json",
  "Authorization": "Basic " + privateApiKey
};

module.exports = function(app){
app.get('/', function(req, res){
    fs.readFile('index.html', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

app.post('/paymentrequest',async (req,res) => {
    const paymentHandleToken = req.body.token;
    console.log("Payment token received: ", paymentHandleToken);
    try{
        var options = {
            'method': 'POST',
            'headers': headers,
            body: JSON.stringify({
                "merchantRefNum":uuidV4(),
                "merchantCustomerId":"roiim1000",
                "amount":1000,
                "currencyCode":"USD",
                "paymentHandleToken":paymentHandleToken,
                "description":"ROIIIM Assignment"
            })
        };

        const response = await fetch(process.env.PAYMENT_URL,options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
        const tokenizedPaymentResponse = await response.json();
        console.log("Tokenized payment response: ", tokenizedPaymentResponse);
        if (tokenizedPaymentResponse.status === "COMPLETED") {
            res.status(200).send({ status: "success" });
        } else {
            res.status(500).send({ error: "Payment failed." });
        }
    }
    catch(err){
        console.log("Internal server error: ", err.message);
        res.status(500).send({ error: "Internal server error." });
    }
});
};