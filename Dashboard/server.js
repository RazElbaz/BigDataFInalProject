const express = require('express')
const app = express();
const socketIO = require('socket.io');
const path = require('path')
const kafka = require('../kafka/dashConsumer');

const {setInitialData, setFlavorAmount, deleteStores} = require('./models/stores')

const inventoryRouter = require('./routes/inventory')
const storesRouter = require('./routes/stores')
const train_model_Router = require('./routes/train_model')

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

// Routes
app.use('/', inventoryRouter);
app.use('/dashboard/stores', storesRouter);
app.use('/dashboard/train_model', train_model_Router);


const server = express()
  .use(app)
  .listen(3000, () => {
    console.log(`Listening Socket on http://localhost:3000`)
  });

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected!`);
});

kafka.init(io);
