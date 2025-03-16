const express = require('express')
const app = express();
const fs = require('fs');

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://pretest.unitain.net');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  
app.get('/api/getUserData', (req, res) => {
    try {
    if(fs.existsSync('userData.json')) {
        const data = fs.readFileSync('userData.json', 'utf8');
        const parsedData = JSON.parse(data);
        console.log('Sending userData:', parsedData.userData);
        res.status(200).json(parsedData.userData);
    }else {
        res.status(404).json({ message: 'User data not found.' });
      }
} catch (error) {
    console.error('Error reading userData:', error);
    res.status(500).json({ error: 'Data not found or error reading data.' });
  }
})

app.listen(8100, () => {
    console.log('Server running on port 8100');
});