const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const {setFlavorAmount} = require('../Dashboard/models/stores')

//Kafka details to connection
const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094, dory-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "bik2bf96",
    "sasl.password": "4AcnrUolr7guCOa9CTYHHanC5dZmugEb",
    "debug": "generic,broker,security"
  };
  
  const prefix = "bik2bf96-";
  const topic = `${prefix}test`; // send the events to this topic
  const producer = new Kafka.Producer(kafkaConf);
  
  const genMessage = data => new Buffer.alloc(data.length,data);

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.on("error", function(err) {
  console.error(err);
});
consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

//Consume new data
exports.init = (io) => {
    consumer.on("data", function(data) {
        console.log('some data')
        io.emit('KafkaConsumerResponse', data.value.toString());

        // Update redis db with new store's stock amount
        const dataJSON = JSON.parse(data.value.toString())
        setFlavorAmount(`${dataJSON['city']}-${dataJSON['branch']}`, dataJSON['Ice_cream_flavor'], dataJSON['amount'])
    });
}
//Prints to stdout with newline
consumer.on('event.log', function(log) {
  console.log(log);
});
//The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code
consumer.on("disconnected", function(arg) {
  process.exit();
});
consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});

consumer.connect();