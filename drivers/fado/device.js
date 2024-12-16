'use strict';

const { Device } = require('homey');

class MyDevice extends Device {
	async onInit() {
		this.conditions = [];
		this.actions = [];
		this.debug = this.log;
        this.app = this.homey.app;
        this.mqtt = this.app.mqtt;

	}
	
	async publish(payload) {
		this.log(payload);
		await this.mqtt.publish(`${this.getSetting('mqtt').topic}`, JSON.stringify(payload), { retain: true });

	}

	async onUninit() {
		await this.homey.app.unregisterDevice(this);
	}

 

}

module.exports = MyDevice;
