const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());
app.use(express.urlencoded({ extended: true })); //  Parse URL-encoded bodies
app.use(express.json());

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Serve static files (if needed)
app.use(express.static('public'));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Handle form submissions
app.post('/api/submit-form', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Debugging: Log the received data
        console.log('Received form data:', { name, email, message });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'New Contact Form Submission - LONK',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error submitting form: ' + error.message });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Form submitted successfully' });
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error submitting form' });
    }
});

const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
