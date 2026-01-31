const http = require('http');

function checkEndpoint(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`${method} ${path}: ${res.statusCode}`);
                console.log(`Response: ${data.substring(0, 100)}...`);
                resolve({ statusCode: res.statusCode, data });
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request ${path}: ${e.message}`);
            resolve({ error: e.message });
        });

        req.end();
    });
}

async function test() {
    console.log('Testing API Health...');
    await checkEndpoint('/api/health');

    console.log('Testing Payment Endpoint (Create Order)...');
    await checkEndpoint('/api/payment/create-order', 'POST');
}

test();
