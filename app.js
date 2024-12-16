'use strict';

const Homey = require('homey');
const Mqtt = require('mqtt');
const MqttAsync = require('mqtt-async');

class MyApp extends Homey.App {

    

	async onInit() {
		this.log('MyApp has been initialized');

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
