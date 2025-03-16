const express = require('express')
const app = express();
const fs = require('fs');

app.use(express.json())

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.post('/api/saveUserData', (req, res) => {
    const userData = req.body.userData;
    console.log('Received and saved userData:', userData);

    fs.writeFileSync('userData.json', JSON.stringify({ userData }), 'utf8');

    res.status(200).json({ 
        message: 'Data received and saved successfully!',
        userData: userData,
    });
})

app.listen(8000, () => {
    console.log('Server running on port 8000');
});