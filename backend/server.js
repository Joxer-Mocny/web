const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pre parsovanie JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statické súbory (index.html, delete.html)
app.use(express.static(path.join(__dirname, 'public')));

// Získanie prihlasovacích údajov z environmentálnych premenných na Heroku
const validUsername = process.env.USERNAME; // Používateľské meno z environmentálnej premennej
const validPassword = process.env.PASSWORD; // Heslo z environmentálnej premennej

// API endpoint pre prihlasovanie
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Overenie mena a hesla z environmentálnych premenných
    if (username === validUsername && password === validPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Nesprávne prihlasovacie údaje' });
    }
});

// Načítanie stránky prihlasovania na /prihlasenie
app.get('/prihlasenie', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'prihlasenie.html'));
});

// Načítanie stránky delete.html po prihlásení
app.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'delete.html'));
});

// Štart servera
app.listen(port, () => {
    console.log(`Server beží na porte ${port}`);
});
