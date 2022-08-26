const path = require('path');
const fs = require('fs');

const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const avatars = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'];

const filePath = path.join(__dirname, 'data', 'contacts.json');

function getImage(array) {
    const index = Math.floor(Math.random() * array.length);
    return `/img/${array[index]}.png`;
};

function createId(email) {
    const number = Math.floor(Math.random() * 10000);
    const text = email.slice(0, 2);
    return `${text}${number}`;
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/auth', (req, res) => {
    const data = req.body;
    const returnData = {
        isLogin: data.login === 'user',
        isPassword: data.password === 'user123',
    };
    res.send(returnData);
});

app.get('/contacts', (req, res) => {
    const data = fs.readFileSync(filePath);
    res.send(data);
});

app.post('/contacts', (req, res) => {
    if (req.body.action === 'add') {
        const newContact = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            img: getImage(avatars),
            id: createId(req.body.email),
        };
        const fileData = fs.readFileSync(filePath);
        const contacts = JSON.parse(fileData);
    
        contacts.push(newContact);
    
        fs.writeFileSync(filePath, JSON.stringify(contacts));
    };

    if (req.body.action === 'delete') {
        const fileData = fs.readFileSync(filePath);
        const contacts = JSON.parse(fileData);

        const newContacts = contacts.filter(contact => contact.id !== req.body.id);

        fs.writeFileSync(filePath, JSON.stringify(newContacts));
        res.send(newContacts);
    };
});

app.listen(3003);