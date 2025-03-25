const express = require('express');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json()); 

paypal.configure({
    'mode': 'sandbox', 
    'client_id': 'AZIyqfEJN1lnumZt41tTtIMBgv8U0VHYUyMq-IIgoJNnzX7E83-5w6TT4RG_9TTaI0RGZzfRcL7it5QZ',
    'client_secret': 'EJaJ6E4db-Bh3_gN7Q5_ar1fGk7m1px56p4lyqrqmwV1ZknluBnPiTM8W8lbWIJ5cv-rxoUASpTp2XBM'
  });

app.post('/api/payment', async(req, res)=>{
    const { user_id, successUrl } = req.body;
    console.log("🚀 ~ app.post ~ req.body:", req.body)
    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try{
        let create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:8300/api/success?user_id=${user_id}&successUrl=${successUrl}`,
                "cancel_url": "http://localhost:5174/failed"

                // "return_url": `https://unitain-server.vercel.app/api/success?user_id=${user_id}&successUrl=${successUrl}`,
                // "cancel_url": "https://test.unitain.net/failed"
            },
           "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": "99",
                        "currency": "EUR",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "EUR",
                    "total": "99"
                },
                "description": "Vehicle Tax Exemption Check"
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.error("Error creating payment:", error.response ? error.response.details : error);
                return res.status(500).send(error);
            } else {
                console.log("Payment created:", payment);
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        // return res.send({ approval_url: payment.links[i].href });
                        res.send(payment.links[i].href);
                    }
                }
            }
        });
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send(error);
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});