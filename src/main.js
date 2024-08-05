import { MqttConnector } from "./classes.js";

const testLabel = document.getElementById("test-label");
const emergencyBtn = document.getElementById("emergency-stop");

// Arrows
const arrowUp = document.querySelector(".arrow-up");
const arrowDown = document.querySelector(".arrow-down");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

const keys = {
    FORWARD: 'w',
    LEFT: 'a',
    BACK: 's',
    RIGHT: 'd'
}

// Circuit Board Pin Configuration
const LEFT_FRONT = "stepper.00";
const RIGHT_FRONT = "stepper.01";
const LEFT_BACK = "stepper.02";
const RIGHT_BACK = "stepper.03";

//const speedUI = new SpeedUI(context, 50, 300);
const mqttc = new MqttConnector('hextech-justin2', 'justin2', 'hextech/hextech-justin2/commands');

let speed = 1500; // Min: ~685, Max: ~2000
const POWER = 2000; // Milliamps of Current
const IDLE_LOCK = false;


function move(direction) {
    let msg;
    let amount = 10_000;

    switch (direction) {
        case keys.FORWARD:
            console.log("FORWARD");
            arrowUp.focus();

            msg = `${LEFT_FRONT}_move_${amount};${RIGHT_FRONT}_move_-${amount};${LEFT_BACK}_move_${amount};${RIGHT_BACK}_move_-${amount}`;
            mqttc.publishMessage(msg);
            break;
        
        case keys.BACK:
            console.log("BACKWARD");
            arrowDown.focus();

            msg = `${LEFT_FRONT}_move_-${amount};${RIGHT_FRONT}_move_${amount};${LEFT_BACK}_move_-${amount};${RIGHT_BACK}_move_${amount}`;
            mqttc.publishMessage(msg);
            break;
        

        case keys.LEFT:
            console.log("LEFT");;
            arrowLeft.focus();
            
            msg = `${LEFT_FRONT}_move_-${amount};${RIGHT_FRONT}_move_-${amount};${LEFT_BACK}_move_-${amount};${RIGHT_BACK}_move_-${amount}`;
            mqttc.publishMessage(msg);
            break;
        
        case keys.RIGHT:
            console.log("RIGHT");
            arrowRight.focus();
            msg = `${LEFT_FRONT}_move_${amount};${RIGHT_FRONT}_move_${amount};${LEFT_BACK}_move_${amount};${RIGHT_BACK}_move_${amount}`;
            mqttc.publishMessage(msg);
            break;
        
        default:
            return;
    }   
}

function setSpeed(val) {
    const command = `${LEFT_FRONT}_speed_${val};${RIGHT_FRONT}_speed_${val};${LEFT_BACK}_speed_${val};${RIGHT_BACK}_speed_${val};`;
    mqttc.publishMessage(command);
    //speedUI.setSpeed(val);
    console.log("SPEED: ", command);
}

function setCurrent(val) {
    const command = `${LEFT_FRONT}_rms_${POWER};${RIGHT_FRONT}_rms_${POWER};${LEFT_BACK}_rms_${POWER};${RIGHT_BACK}_rms_${POWER}`;
    mqttc.publishMessage(command);
    console.log("CURRENT (RMS): ", command);
}

function setIdleLock(bool) {
    const value = +bool
    const command = `${LEFT_FRONT}_idleLock_${value};${RIGHT_FRONT}_idleLock_${value};${LEFT_BACK}_idleLock_${value};${RIGHT_BACK}_idleLock_${value}`;
    mqttc.publishMessage(command);
    console.log("IDLE LOCK: " + command);
}


function emergencyStop() {
    mqttc.publishMessage(`P_${LEFT_FRONT}_stop;${RIGHT_FRONT}_stop;${LEFT_BACK}_stop;${RIGHT_BACK}_stop`);   
}


window.addEventListener('keydown', (event) => {
    move(event.key);
    testLabel.innerText = event.key;
})

window.addEventListener('keyup', () => {
    console.log("KEY UP");
    emergencyStop();
    emergencyBtn.focus();
})

emergencyBtn.addEventListener("click", () => {
    console.log("EMERGENCY STOP");
    emergencyStop();
})


setCurrent(POWER);
setSpeed(speed);
setIdleLock(IDLE_LOCK);
