const server = require('net').createServer();

server.on('connection', socker => {
    console.log('Client connect');
    socker.write('Welcome new Client!\n');
    socket.on('data', data =>{
        socket.write(data);
    });

});

server.listen(5000, () => console.log('Server bound'));