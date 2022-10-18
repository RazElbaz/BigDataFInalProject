const net = require('net');

const server = net.createServer(function (socket) {
    socket.on('data', (data) => {
        const string = data.toString()
        console.log(string);
    });
});

server.listen(5000, () => console.log('Server listening on port 5000...'));
