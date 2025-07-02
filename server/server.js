const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Booking = require('./Models/Booking');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).json({ message: 'Booking saved successfully' });

    const mailOptions = {
      from: `"Booking Notification" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: 'New Booking Received',
      text: `
New booking details:

Trip Category: ${booking.tripCategory}
Destination: ${booking.destination}
Start Date: ${booking.startDate}
End Date: ${booking.endDate}
Travelers: ${booking.travelers}
Package Type: ${booking.packageType}
Full Name: ${booking.fullName}
Email: ${booking.email}
Phone: ${booking.phone}
State: ${booking.state}
Special Request: ${booking.specialRequest}
      `
    };

    console.log('Sending booking notification email...');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending booking notification email:', error);
      } else {
        console.log('Booking notification email sent:', info.response);
      }
    });

  } catch (err) {
    res.status(400).json({ message: "Submission failed: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
