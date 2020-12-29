const express = require('express');
const app = express();
const cors = require('cors');
vonst axios = require('axios');
const bodyParser = require('body-parser'); // what does bodyparser ? ?
const { randomBytes } = require('crypto');
app.use(bodyParser.json());
const posts = {};
app.use(cors()); // what does the mehtod use ? ?
app.get('/posts', (req, res) => {
    res.send(posts);
}); // route handler

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id,title
    }
    await axios.post('http://localhost:4005/events', { type: 'PostCreated', data: { id, title } });
    res.status(201).send(posts[id]);
}) // route handler
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
})
app.listen(4000, () => {
    console.log('listening on 4000');
});