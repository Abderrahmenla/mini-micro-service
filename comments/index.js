const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const {
    randomBytes
} = require('crypto');
const app = express();
app.use(bodyParser.json());
const commentsByPostId = {} 
app.use(cors());
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments',async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({
        id: commentId,
        content,
        status:'pending'
    });
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.idf,
            status:'pending'
        }
    })
    commentsByPostId[req.params.id] = comments;
    res.status(201).send(comments);

})
app.post('/events',async (req, res) => {
    console.log('Received Event', req.body.type);
    if (type==='CommentModerated') {
        const { postId, id, status } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id
        });
        comment.status = status;
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,status,postId,content
            }
        })
    }
    res.send({});
})
app.listen(4001, () => {
    console.log('listening on 4001');
});