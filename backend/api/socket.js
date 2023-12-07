import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://192.168.29.205:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const users = {};

io.on('connection', socket => {
    // socket.on('new-user-joined', name => {
    //     console.log(name + " joined.");
    //     users[socket.id] = name;
    //     console.log(users);
    //     socket.broadcast.emit('user-joined', name);
    // });

    console.log(socket)

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message })
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});