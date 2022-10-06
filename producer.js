// we use https://www.cloudkarafka.com/

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const simu = require('../simu/simulator.js');



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

//Produce data
producer.on("ready", function(arg) {
  console.log(`producer is ready.`);
  simu.simulator(publish);
  console.log(publish);
});
producer.connect();

function publish(msg)
{   
  //Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
  m=JSON.stringify(msg);
  //Send to KAFKA
  producer.produce(topic, -1, genMessage(m), uuid.v4());  
  //producer.disconnect();   
}