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

	async addCondition(name, fn) {
		let condition = this.homey.flow.getConditionCard(name);
		condition.registerRunListener(fn);

		this.conditions.push(condition);
	}

	async addAction(name, fn) {
		let action = this.homey.flow.getActionCard(name);
		action.registerRunListener(fn);

		this.actions.push(action);
	}

	async trigger(name, args) {
		if (args) {
			this.log(`Triggering '${name}' with parameters ${JSON.stringify(args)}`);
		} else {
			this.log(`Triggering '${name}'}`);
		}
		const triggerCard = this.homey.flow.getDeviceTriggerCard(name);
		await triggerCard.trigger(this, args);
	}

	async onSettings({ oldSettings, newSettings, changedKeys }) {
		this.log('MyDevice settings where changed');
	}


}

module.exports = MyDevice;
