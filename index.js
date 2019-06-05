const http = require('http');
const fs = require('fs');
const fetch = require('node-fetch');
const queryString = require('querystring');

const API_URL = 'http://195.54.163.180:5000/api/weather';
const FRONT_URL = 'http://195.54.163.180';
const intervalTime = 3000;
const PORT = 3000;
const server = http.createServer((request, response) => response.end('Start Upload!'));

server.listen(PORT, (err) => {
    if (err) return console.log('Something bad happened: ', err);

    console.log(`Start sending data | You can see result: ${FRONT_URL}`);

    let copyData = {
        temp: '0',
        pressure: '0',
        humidity: '0'
    };

    setInterval(() => {
        fs.readFile('./data.json', 'utf-8', (errRead, data) => {
            if (errRead) return console.log(`Reed error: ${errRead}`);

            const parseData = JSON.parse(data);

            for (let currentKey in parseData) {
                if (parseData[currentKey] !== copyData[currentKey]) {
                    for (let currentKeyNew in parseData) {
                        copyData[currentKeyNew] = parseData[currentKeyNew];
                    }

                    fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: queryString.stringify(parseData)
                    })
                        .then(res => res.json())
                        .then(res => console.log(`Sending ↑ | ID: ${res._id}`));

                    return;
                }
            }
            console.log('Data not sent ❌  | Data is identical');
        });
    }, intervalTime);
});