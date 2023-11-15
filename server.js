const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // dotenv csomag beolvasása

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/sendEmail', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Nézd meg a környezeti változók értékeit
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  // Logika az email küldéséhez a 'nodemailer' csomaggal
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: user, // Saját e-mail címed
      pass: pass // Saját jelszavad
    }
  });

  const mailOptions = {
    from: user, // Az e-mail küldő címe
    to: 'cimzett.email@example.com', // A címzett e-mail címe
    subject: 'Új üzenet a weboldalról',
    text: `Név: ${name}\nE-mail: ${email}\nTelefonszám: ${phone}\n\nÜzenet: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Hiba történt az e-mail küldése közben' });
    } else {
      console.log('E-mail elküldve:', info.response);
      res.status(200).json({ message: 'Köszönjük megkeresését. 24 órán belül felvesszük Önnel a kapcsolatot.' });
    }
  });
});

app.listen(port, () => {
  console.log(`A REST API fut a ${port}-es porton.`);
});
