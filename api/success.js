const express = require('express');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const app = express();
app.use(cors());

paypal.configure({
    'mode': 'sandbox', 
    'client_id': 'AZIyqfEJN1lnumZt41tTtIMBgv8U0VHYUyMq-IIgoJNnzX7E83-5w6TT4RG_9TTaI0RGZzfRcL7it5QZ',
    'client_secret': 'EJaJ6E4db-Bh3_gN7Q5_ar1fGk7m1px56p4lyqrqmwV1ZknluBnPiTM8W8lbWIJ5cv-rxoUASpTp2XBM'
  });

app.get('/api/success', async (req, res) => {
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const userId = req.query.user_id;
        const successUrl = req.query.successUrl
        console.log("🚀 ~ app.get ~ req.query.user_id:", req.query.user_id)

        if (!payerId || !paymentId || !userId || !successUrl) {
            return res.status(400).send("PayerID and paymentId are required");
        }

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "EUR",
                    "total": "99"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            const response = JSON.stringify({ ...payment, userId })
            if (error) {
                console.error("Error executing payment:", error.response ? error.response.details : error);
                return res.status(500).send(error);
            } else {
                console.log("Payment executed successfully:", payment);
                   if(payment.state === "approved"){
                        // return res.redirect(`http://localhost:5173/success?session=${response}`);
                        return res.redirect(`${successUrl}dashboard?sessionId=${payment?.id}&status=${payment?.state}&uid=${userId}&submission`);
                        // return res.redirect(`http://localhost:5173/dashboard?sessionId=${payment?.id}&status=${payment?.state}&uid=${userId}&submission`);
                    }else{
                        // return res.redirect("http://localhost:5173/failed");
                        return res.redirect("https://test.unitain.net/failed");
                    }
            }
        });
    } catch (error) {
        console.error("Error in success route:", error);
        return res.redirect("https://test.unitain.net/failed");
    }
});

app.listen(8300, () => {
    console.log('Server is running on port 8300');
});