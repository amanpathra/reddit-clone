import { Server } from 'socket.io';

let io;

const configureSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://192.168.29.205:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        // Implement your authentication logic here
        // Example: const user = await authenticateUser(socket.handshake.auth.token);
        // If authenticated, add the user to the socket
        // socket.user = user;
        next();
    });

    // const users = {};

    // io.on('connection', socket => {
    //     socket.on('new-user-joined', name => {
    //         console.log(name + " joined.");
    //         users[socket.id] = name;
    //         socket.broadcast.emit('user-joined', name);
    //     })

    //     socket.on('send', message => {
    //         socket.broadcast.emit('recieve', message);
    //     })

    //     socket.on('disconnect', () => {
    //         socket.broadcast.emit('left', users[socket.id]);
    //         delete users[socket.id];
    //     })
    // })

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle joining a chat room
        socket.on('join', chatId => {
            socket.join(chatId);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    return io;
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized. Call configureSocket first.');
    }
    return io;
};

export {configureSocket, getIO};