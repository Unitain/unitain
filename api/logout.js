const express = require('express')
const app = express();
const fs = require('fs');

app.use(express.json())

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:5174');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.post('/api/logout', (req, res) => {
    try {
      fs.unlinkSync('userData.json'); 
      res.status(200).json({ message: 'Logged out successfully!' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Error during logout.' });
    }
  });

app.listen(8200, () => {
    console.log('Server running on port 8200');
});