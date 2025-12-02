let Color = require('color');

let { Device } = require('homey');
let Chroma = require('chroma-js');

class MyDevice extends Device {
	async onInit() {
		this.debug = this.log;
		this.app = this.homey.app;
		this.mqtt = this.app.mqtt;

		this.state = {};
		this.state.onoff = false; // true/false
		this.state.dim = 0.5; // 0..1
		this.state.light_hue = 0.5; // 0..1
		this.state.light_temperature = 0.5; // 0..1
		this.state.light_saturation = 0.5; // 0..1
		this.state.light_mode = 'color'; // 'color' or 'temperature'

		let capabilities = ['onoff', 'dim', 'light_hue', 'light_saturation', 'light_temperature', 'light_mode'];

		this.registerMultipleCapabilityListener(capabilities, async state => {
			await this.setState(state);
		});

		await this.setState(this.state);
	}

	getCurrentColor() {
		let state = { ...this.state };

		let color = 'black';

		if (state.onoff) {
			color = `hsl(${state.light_hue * 360}, ${state.light_saturation * 100}%, ${state.dim * 100}%)`;
		}

		return color;
	}

	async pulse({ color, interval, iterations }) {
		let payload = {};
		payload.animation = 'pulse';
		payload.color = color;
		payload.interval = interval * 1000;
		payload.iterations = iterations;
		payload.priority = '!';

		await this.publish(payload);

		payload = {};
		payload.animation = 'color';
		payload.color = this.getCurrentColor();
		payload.fade = 200;
		payload.duration = -1;

		await this.publish(payload);
	}

	async blink({ color, interval, iterations }) {
		let payload = {};
		payload.animation = 'blink';
		payload.color = color;
		payload.interval = interval * 1000;
		payload.iterations = iterations;
		payload.priority = '!';

		await this.publish(payload);

		payload = {};
		payload.animation = 'color';
		payload.color = this.getCurrentColor();
		payload.fade = 200;
		payload.duration = -1;

		await this.publish(payload);
	}

	async setOnOff(value) {
		this.state.onoff = value;
		await this.setCapabilityValue('onoff', this.state.onoff);
	}

	async setHue(value) {
		this.state.light_hue = value;
		await this.setCapabilityValue('light_hue', this.state.light_hue);
	}
	async setTemperature(value) {
		// Convert Homey temperature (0..1) to kelvin
		this.state.light_temperature = value;
		await this.setCapabilityValue('light_temperature', this.state.light_temperature);
	}
	async setMode(value) {
		// Convert existing color to new mode
		this.state.light_mode = value;
		await this.setCapabilityValue('light_mode', this.state.light_mode);
	}
	async setState(args) {
		this.debug(`Setting state ${JSON.stringify(args)}`);

		let state = { ...args };

		// If changing to color mode, derive hue/sat from temperature
		if (state.light_temperature != undefined) {
			let hsl = Chroma.temperature(2000 + (1 - state.light_temperature) * 4000).hsl();
			state.light_hue = hsl[0] / 360;
			state.light_saturation = hsl[1];
			state.dim = hsl[2];
		}


		if (state.onoff != undefined && this.state.onoff != state.onoff) {
			await this.setCapabilityValue('onoff', state.onoff);
		}
		if (state.dim != undefined && this.state.dim != state.dim) {
			await this.setCapabilityValue('dim', state.dim);
		}
		if (state.light_hue != undefined && this.state.light_hue != state.light_hue) {
			await this.setCapabilityValue('light_hue', state.light_hue);
		}
		if (state.light_saturation != undefined && this.state.light_saturation != state.light_saturation) {
			await this.setCapabilityValue('light_saturation', state.light_saturation);
		}
		if (state.light_mode != undefined && this.state.light_mode != state.light_mode) {
			await this.setCapabilityValue('light_mode', state.light_mode);
		}
		if (state.light_temperature != undefined && this.state.light_temperature != state.light_temperature) {
			await this.setCapabilityValue('light_temperature', state.light_temperature);
		}

        // Remember new state
		this.state = { ...this.state, ...state };

        // Publish new state to device
		let payload = {};
		payload.animation = 'color';
		payload.priority = '!';
		payload.color = this.getCurrentColor();
		payload.duration = -1;

		await this.publish(payload);

	}

	async publish(payload) {
		await this.mqtt.publish(`${this.getSetting('mqtt').topic}`, JSON.stringify(payload), { retain: true });
	}

	async onUninit() {
		await this.homey.app.unregisterDevice(this);
	}
}

module.exports = MyDevice;
