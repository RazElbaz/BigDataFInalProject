const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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
  const topic = `${prefix}test`; // send to this topic
  const producer = new Kafka.Producer(kafkaConf);
  
  const genMessage = m => new Buffer.alloc(m.length,m);

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

//------------ Consume new data------------
consumer.on("data", function(m) {
    console.log("data "+m.value.toString());

});
consumer.on("disconnected", function(arg) {
  process.exit();
});
consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function(log) {
   console.log(log);
});
consumer.connect();