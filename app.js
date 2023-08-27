const https = require('https');
const axios = require('axios');
const mqtt = require('mqtt')
const fs = require('fs');
const { error } = require('console');
require('dotenv').config()

const ca = fs.readFileSync(process.env.CA, 'utf8');
const cert = fs.readFileSync(process.env.CERT, 'utf8');
const key = fs.readFileSync(process.env.KEY, 'utf8');
const endpoint = process.env.ENDPOINT
const topic = "sdk/test/js";


const client = mqtt.connect(
  {
    host: endpoint,
    protocol: "mqtt",
    clientId: "sdk-nodejs-v2",
    clean: true,
    key: key,
    cert: cert,
    ca: ca,
    reconnectPeriod: 0,
    debug:true,
  }
);

client.on('connect', function () {
    console.log("MQTT broker connected!")
})

async function httpRequest(){
    const date = new Date();
    sampleTime = date.getTime();

    const postData = JSON.stringify({
        sample_time: sampleTime,
        device_id: "f2ab73195979",
        rssi: -40,
        uuid: "a7a7c916-42fd-11ee-be56-0242ac120002",
        txPower: -63,
        raspiTemp: 25,
        protocol: "http"
    })
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        httpsAgent: new https.Agent({
          key: key,
          cert: cert,
        }),
      };
    try {
        const response = await axios.post('https://' + endpoint + ':8443/topics/' + topic + '?qos=1', postData, options)
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function mqttPub(){
    const date = new Date();
    sampleTime = date.getTime();

    const pubData = JSON.stringify({
        sample_time: sampleTime,
        device_id: "f2ab73195979",
        rssi: -40,
        uuid: "a7a7c916-42fd-11ee-be56-0242ac120002",
        txPower: -63,
        raspiTemp: 25,
        protocol: "mqtt",
        humidity: 65
    })
    if (client){
        client.publish(topic, pubData, { qos: 0, retain: false }, (error) => {
            if (error){
                console.log(error)
            }
        })
    }
}

httpRequest();
mqttPub();