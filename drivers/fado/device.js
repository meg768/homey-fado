"use strict";

let Color = require("color");

const { Device } = require("homey");

class MyDevice extends Device {
    async onInit() {
        this.debug = this.log;
        this.app = this.homey.app;
        this.mqtt = this.app.mqtt;
        this.onoff = false;
        this.hue = 0;
        this.lightness = 0.5;
        this.saturation = 1;

        let capabilities = ["onoff", "dim", "light_hue", "light_saturation"];

        this.registerMultipleCapabilityListener(capabilities, async (args) => {
            await this.setState(args);
        });
        await this.setCapabilityValue("onoff", this.onoff);
        await this.setCapabilityValue("dim", this.lightness);
        await this.setCapabilityValue("light_hue", this.hue);
        await this.setCapabilityValue("light_saturation", this.saturation);

        await this.setState({ onoff: false, dim: this.lightness, light_hue: this.hue, light_saturation: this.saturation });
    }

    getCurrentColor() {
        return this.onoff ? `hsl(${this.hue * 360}, ${this.saturation * 100}%, ${this.lightness * 100}%)` : "black";
    }

    async pulse({ color, interval, iterations }) {
        let payload = {};
        payload.animation = "pulse";
        payload.color = color;
        payload.interval = interval * 1000;
        payload.iterations = iterations;
        payload.priority = "!";

        await this.publish(payload);

        payload = {};
        payload.animation = "color";
        payload.color = this.getCurrentColor();
        payload.fade = 200;
        payload.duration = -1;

        await this.publish(payload);
    }

    async blink({ color, interval, iterations }) {
        let payload = {};
        payload.animation = "blink";
        payload.color = color;
        payload.interval = interval * 1000;
        payload.iterations = iterations;
        payload.priority = "!";

        await this.publish(payload);

        payload = {};
        payload.animation = "color";
        payload.color = this.getCurrentColor();
        payload.fade = 200;
        payload.duration = -1;

        await this.publish(payload);
    }

    async setState({ onoff, dim, light_hue, light_saturation }) {

        if (onoff != undefined) {
            this.onoff = onoff;
        }

        if (dim != undefined) {
            this.lightness = dim;
        }

        if (light_hue != undefined) {
            this.hue = light_hue;
        }

        if (light_saturation != undefined) {
            this.saturation = light_saturation;
        }


        let payload = {};
        payload.animation = "color";
        payload.priority = "!";
        payload.color = this.getCurrentColor();
        payload.duration = -1;


        await this.publish(payload);


    }

    async publish(payload) {
        await this.mqtt.publish(`${this.getSetting("mqtt").topic}`, JSON.stringify(payload), { retain: true });
    }

    async onUninit() {
        await this.homey.app.unregisterDevice(this);
    }
}

module.exports = MyDevice;
