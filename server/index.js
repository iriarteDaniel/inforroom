import express from 'express';
import logger from 'morgan';

import { Server } from 'socket.io';
import { createServer } from 'http';
let users = 0;


const PORT = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});


io.on('connection', (socket) => {
    users++;
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users--;
    });
    socket.on('chat message', (message, name) => {
        io.emit('chat message', message, name);
        io.emit('user count', users);
    //    console.log(users);
    });  
});

app.use(logger('dev'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 