import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
//import { saveSensorValue, getSensorValues } from './controllers/mq2controller.js';

import { getData } from './controllers/gasreading.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    const filePath = join(__dirname, 'index.html');
    console.log(`Serving file from: ${filePath}`);
    res.sendFile(filePath);
});

router.get('/valentine', (req, res) => {
    const filePath = join(__dirname, 'page', 'valentine.html');
    console.log(`Serving file from: ${filePath}`);
    res.sendFile(filePath);
});


// Serve images from the /page/images directory
router.use('/images', express.static(join(__dirname, 'page', 'images')));

router.post('/saveData', (req, res) => {
    const sensorValue = req.body.value;
    // Process the received sensor value here
    console.log('Received sensor value:', sensorValue);

    // Save the data to your database or perform any other desired actions
    saveSensorValue(sensorValue);

    res.send('Data received successfully'); // Send a response back to the ESP32
});

router.get('/sensorValues', async (req, res) => {
    try {
        const sensorValues = await getSensorValues();
        res.json(sensorValues);
    } catch (error) {
        console.error('Error fetching sensor values:', error);
        res.status(500).json({ error: 'Failed to fetch sensor values' });
    }
});

// routes.js



router.get('/api/:tablename', getData);



export default router;