
// Class For Managing MQTT Connection
export class MqttConnector {
    constructor(username, password, pubTopic) {
        this.client = mqtt.connect("ws://mqtt.hextronics.cloud:8083/mqtt", { username, password });
        this.pubTopic = pubTopic;

        this.client.on( 'connect', () => console.log('CONNECTED') );
    }

    publishMessage(msg) {
        this.client.publish(this.pubTopic, msg);
    }
}
