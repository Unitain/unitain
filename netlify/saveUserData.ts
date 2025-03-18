const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const { userData } = JSON.parse(event.body);
            console.log('Received and saved userData:', userData);

            const filePath = path.join(__dirname, 'userData.json');
            fs.writeFileSync(filePath, JSON.stringify({ userData }), 'utf8');

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Data received and saved successfully!',
                    userData: userData,
                }),
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Internal Server Error' }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
};