const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());


app.get('/api/failed', async (req, res) => {

    // return res.redirect("http://localhost:5173/failed");
    return res.redirect("https://test.unitain.net/failed");
})


app.listen(8200, ()=>{
    console.log('Server is running on port 8200');
    
})