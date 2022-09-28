// https://www.cloudkarafka.com/

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const simu = require('../simu/simulator.js');



//------------ Kafka details to connection------------
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

//------------ Produce data------------
producer.on("ready", function(arg) {
  console.log(`producer is ready.`);
  simu.simulator(publish);
  console.log(publish);
});
producer.connect();

function publish(msg)
{   
  m=JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());  //Send to KAFKA
  //producer.disconnect();   
}