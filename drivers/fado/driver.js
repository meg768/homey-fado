"use strict";

const { Driver } = require("homey");
const Color = require("color");

class MyDriver extends Driver {
    async onInit() {
        this.addAction("pulse-color", async ({ device, color, interval, iterations }) => {
            await device.pulse({ color, interval, iterations });
        });

        this.addAction("pulse-color-name", async ({ device, color, interval, iterations }) => {
            await device.pulse({ color, interval, iterations });
        });

        this.addAction("blink-color", async ({ device, color, interval, iterations }) => {
            await device.blink({ color, interval, iterations });
        });

        this.addAction("blink-color-name", async ({ device, color, interval, iterations }) => {
            await device.blink({ color, interval, iterations });
        });

        this.addAction("color", async ({ device, color }) => {
            let hsl = Color(color).hsl().array();
            await device.setState({ onoff: true, light_hue: hsl[0] / 360, light_saturation: hsl[1] / 100, dim: hsl[2] / 100 });
        });

        this.addAction("color-hsl", async ({ device, hue, saturation, lightness }) => {
            await device.setState({ onoff: true, light_hue: hue / 360, light_saturation: saturation / 100, dim: lightness / 100 });
        });

        this.addAction("color-name", async ({ device, color }) => {
            let hsl = Color(color).hsl().array();
            await device.setState({ onoff: true, light_hue: hsl[0] / 360, light_saturation: hsl[1] / 100, dim: hsl[2] / 100 });
        });
    }

    async addAction(name, fn) {
        let action = this.homey.flow.getActionCard(name);
        action.registerRunListener(fn);
    }

    /**
     * onPairListDevices is called when a user is adding a device
     * and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
    async onPairListDevices() {
        return [
            {
                name: "Fado One",
                data: {
                    id: "fado-one",
                },
                settings: {
                    mqtt: {
                        topic: "fado/fado-one",
                    },
                },
            },
            {
                name: "Fado Two",
                data: {
                    id: "fado-two",
                },
                settings: {
                    mqtt: {
                        topic: "fado/fado-two",
                    },
                },
            },
            {
                name: "Fado Three",
                data: {
                    id: "fado-three",
                },
                settings: {
                    mqtt: {
                        topic: "fado/fado-three",
                    },
                },
            },
        ];
    }
}

module.exports = MyDriver;
