const fs = require('fs');
const path = require('path');

// exports.handler = async (event) => {
export const handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const { userData } = JSON.parse(event.body);
            console.log('Received and saved userData:', userData);

            const filePath = path.join(__dirname, 'userData.json');
            fs.writeFileSync(filePath, JSON.stringify({ userData }), 'utf8');

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Allow all origins or specify your domain
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                },
                body: JSON.stringify({
                    message: 'Data received and saved successfully!',
                    userData: userData,
                }),
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ error: 'Internal Server Error' }),
            };
        }
    } else if (event.httpMethod === 'OPTIONS') {
    return {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
    } else {
        return {
            statusCode: 405,
            headers: {"Access-Control-Allow-Origin": "*",},
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
};