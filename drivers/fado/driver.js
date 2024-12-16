'use strict';

const { Driver } = require('homey');

class MyDriver extends Driver {


    async onInit() {
        this.log('MyDriver has been initialized');

        this.addAction('pulse-color', async ({ device, color, interval, iterations }) => {

            let payload = {};
            payload.animation = 'pulse';
            payload.color = color
            payload.interval = interval * 1000;
            payload.iterations = iterations;

            await device.publish(payload);
        });

        this.addAction('pulse-color-name', async ({ device, color, interval, iterations }) => {

            let payload = {};
            payload.animation = 'pulse';
            payload.color = color
            payload.interval = interval * 1000;
            payload.iterations = iterations;

            await device.publish(payload);
        });

        this.addAction('blink-color', async ({ device, color, interval, iterations }) => {

            let payload = {};
            payload.animation = 'pulse';
            payload.color = color
            payload.interval = interval * 1000;
            payload.iterations = iterations;

            await device.publish(payload);
        });


        this.addAction('blink-color-name', async ({ device, color, interval, iterations }) => {

            let payload = {};
            payload.animation = 'pulse';
            payload.color = color
            payload.interval = interval * 1000;
            payload.iterations = iterations;

            await device.publish(payload);
        });

        this.addAction('color', async ({device, color}) => {
            let payload = {};
            payload.animation = 'color';
            payload.color = color;

            await device.publish(payload);
        });

        this.addAction('color-hsl', async ({ device, hue, saturation, lightness }) => {
            let payload = {};
            payload.animation = 'color';
            payload.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            await device.publish(payload);
        });

        this.addAction('color-name', async ({ device, color }) => {
            let payload = {};
            payload.animation = 'color';
            payload.color = color;

            await device.publish(payload);
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
            name: 'Fado One',
            data: {
                id: 'fado-one',
            },
            settings: {
                mqtt: {
                    topic:'fado/fado-one'
                }
            }
        },
        {
            name: 'Fado Two',
            data: {
                id: 'fado-two',
            },
            settings: {
                mqtt: {
                    topic:'fado/fado-two'
                }
            }
        },
        {
            name: 'Fado Three',
            data: {
                id: 'fado-three',
            },
            settings: {
                mqtt: {
                    topic: 'fado/fado-three'
                }
            }
        }

    ];
  }

}

module.exports = MyDriver;
