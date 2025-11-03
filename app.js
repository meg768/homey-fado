'use strict';

const Homey = require('homey');
const Mqtt = require('mqtt');
const MqttAsync = require('mqtt-async');

class MyApp extends Homey.App {

    

	async onInit() {

        if (!Homey.env || !Homey.env.mqtt) {
            throw new Error('No MQTT configuration found in environment variables. Create an env.json with the MQTT settings to enable MQTT functionality.');
        }

        let options = Homey.env.mqtt;

        this.mqtt = MqttAsync(
			Mqtt.connect(options.host, {
				username: options.username,
				password: options.password,
				port: options.port,
			})
		);
	}
}

module.exports = MyApp;
