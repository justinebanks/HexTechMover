
// Class For Managing MQTT Connection
export class MqttConnector {
    constructor(username, password, pubTopic) {
        this.client = mqtt.connect("ws://mqtt.hextronics.cloud:8083/mqtt", { username, password });
        this.user = user

        this.client.on( 'connect', () => console.log('CONNECTED') );
    }

    publishMessage(msg) {
        this.client.publish(pubTopic, msg);
    }
}


// Canvas Code for the Speed Meter UI
export class SpeedUI {
    constructor(context, x, y) {
        this.ctx = context;
        this.angle = 45;
        this.x = x;
        this.y = y;
    }

    static getEndPoint(startPosition, angle, length) {
        const [x, y] = startPosition;
        angle = (90 - angle) * (Math.PI / 180);
        return [x-(length*Math.sin(angle)), y-(length*Math.cos(angle))];
    }

    draw(angle) {
        const lineLength = 350/2;
        const lineStart = [this.x + lineLength, this.y + 200]
        const lineEnd = SpeedUI.getEndPoint(lineStart, angle, lineLength);

        // Border
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(this.x, this.y, 350, 200);

        // Arc
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath()
        this.ctx.arc(lineStart[0], lineStart[1], lineLength, Math.PI, Math.PI*2);
        this.ctx.closePath();
        this.ctx.stroke();

        const paramsFromAngle = (num, deg) => 
            [
                num,
                SpeedUI.getEndPoint(lineStart, deg, lineLength - this.ctx.measureText(num).width)[0] - 10,
                SpeedUI.getEndPoint(lineStart, deg, lineLength - this.ctx.measureText(num).width)[1]
            ];

        // Numbers
        this.ctx.font = "normal 20px arial";
        this.ctx.strokeText(...paramsFromAngle("0", 0));
        this.ctx.strokeText(...paramsFromAngle("25", 45));
        this.ctx.strokeText(...paramsFromAngle("50", 90));
        this.ctx.strokeText(...paramsFromAngle("75", 135));
        this.ctx.strokeText(...paramsFromAngle("100", 180));

        // Speed-Indicating Line
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(lineStart[0], lineStart[1]);
        this.ctx.lineTo(lineEnd[0], lineEnd[1]);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    update() {
        this.draw(this.angle); 
    }

    setSpeed(val) {
        // Update 'this.angle' to Corresponding Angle
    }
}