// Create a Pixi.js application

import { Application, Assets, Container, Sprite, Text, Graphics, TextStyle } from 'pixi.js';
import TWEEN from 'tween.js';
import GameSetup from './gameSetup';
import SoundManager from './gameSound';
import CoinShower from './coinShower';

let credits;
let wheelSpinWeight;


export class PixiWheel {
    tweenArr = [];
    isSpinPressed: Boolean = false;
    gameSetup: GameSetup;
    buttonText: Text;
    soundManager: SoundManager;
    coinShower: CoinShower;
    app;
    wheel_container: Container;
    selectedItem: number = -1;
    totalWinAmount: number = 2000;

    constructor() {
        this.initCanvas();
    }

    async preload() {
        const assets = [
            { alias: 'background', src: 'assets/images/background.png' },
            { alias: 'pointer', src: 'assets/images/pointer.png' },
            { alias: 'wheel-center', src: 'assets/images/wheel-center.png' },
            { alias: 'wheel-slice', src: 'assets/images/wheel-slice.png' },
            { alias: 'button', src: 'assets/images/button.png' },
            { alias: 'coin-json', src: 'assets/aminations/coin-anim/coin-anim.json' },
            { alias: 'config', src: 'assets/config.json' }
        ];
        await Assets.load(assets);
    }

    async initCanvas() {

        await this.preload();

        this.app = new Application({ background: '#000000', width: 1280, height: 720 });
        globalThis.__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view);
       
        const size = { width: this.app.screen.width, height: this.app.screen.height };

        const background = this.createSprite('background');
        this.addChild(background);
        background.x = size.width / 2;
        background.y = size.height / 2;

        let data = Assets.get('config');
        credits = data.credits;
        wheelSpinWeight = data.weight;

        this.soundManager = new SoundManager();
        await this.soundManager.loadSounds();

        await this.addSpinWheel();
        await this.addSpinButton();
        await this.addDropDown();

        this.gameSetup = new GameSetup(this.app);
        this.gameSetup.overlayGrahpics();
        this.gameSetup.addText(this.totalWinAmount);
        this.gameSetup.addClickButton();
        this.coinShower = new CoinShower(this.app);
        this.coinShower.callback = this.onCoinShowerFinish.bind(this);

        this.app.ticker.add(this.update.bind(this));
    }

    

    async addSpinWheel() {
        new Promise((resolve: Function) => {
            const size = { width: this.app.screen.width, height: this.app.screen.height };
            const pointer = this.createSprite('pointer');
            this.addChild(pointer);
            pointer.x = size.width / 2;
            pointer.y = size.height / 2 - 238;

            this.wheel_container = new Container();
            this.addChild(this.wheel_container);
            this.wheel_container.x = size.width / 2;
            this.wheel_container.y = size.height / 2 -90;

            const wheel = this.createSprite('wheel-center');
            wheel.tint = 0x00FF00;
            this.wheel_container.addChild(wheel);

            let diff_angle = 45;
            for (let index = 0; index < 8; index++) {
                const element = credits[index];

                const slice_cont = new Container();
                const slice = this.createSprite('wheel-slice');
                slice.anchor.set(0.5, 1);
                let text = new Text(`${element}`, { fontFamily: 'Arial', fontSize: 80, fill: 0xff1010, align: 'center' });
                text.x = 0;
                text.y = -200;
                text.anchor.set(0, 0.5);
                text.angle = -90;

                slice_cont.scale.set(0.25);
                slice_cont.angle = diff_angle * index;

                slice_cont.addChild(slice);
                slice_cont.addChild(text);

                this.wheel_container.addChild(slice_cont);
            }
            resolve();
        });
    }


    async addSpinButton() {
        new Promise((resolve: Function) => {

            // Create the button
            const size = { width: this.app.screen.width, height: this.app.screen.height };
            const btn_spin = this.createSprite('button')
            btn_spin.x = size.width / 2;
            btn_spin.y = size.height / 2 + 95;
            btn_spin.scale.set(0.2);
            btn_spin.cursor = 'pointer';
            btn_spin.eventMode = 'static';
            btn_spin.interactive = true;
            btn_spin.on('pointerdown', this.onButtonCLick.bind(this));
            this.addChild(btn_spin);
            resolve();
        });
    }

    onButtonCLick() {
        if (!this.isSpinPressed) {
            this.isSpinPressed = true;
            this.soundManager.playSound(1);
            let indx = this.getRandWeight(wheelSpinWeight);
            if (this.selectedItem == -1) {
                this.spinWheel(indx);
            }
            else {
                this.spinWheel(this.selectedItem)
            }
        }
    }


    getRandWeight(weights) {
        let totalWeight = 0, i, random;
        for (i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        random = Math.random() * totalWeight;
        for (i = 0; i < weights.length; i++) {
            if (random < weights[i]) {
                return i;
            }
            random -= weights[i];
        }
        return -1;
    }

    spinWheel(stopAtIndex) {
        let final = (360 - stopAtIndex * 45) + (360 * 4);
        let cur_angle = this.wheel_container.angle;
        let times = Math.floor(cur_angle / 360);
        cur_angle -= 360 * times;
        final = final - cur_angle;

        let wheelc = this.wheel_container;
        var self = this;

        let tween = new TWEEN.Tween({ angle: wheelc.angle })
            .to({ x: final }, 4000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function onUpdate(obj) {
                wheelc.angle = cur_angle + (final * obj);

                if (obj == 1) {
                    self.tweenArr.pop();
                    self.buttonText.text = "Select an item";
                    self.selectedItem = -1;
                    self.soundManager.playSound(2);
                    setTimeout(() => {
                        self.soundManager.playSound(0, true);
                    }, 500);
                    self.coinShower.animateCoins();
                    self.gameSetup.addWiningTextAmount(credits[stopAtIndex]);
                    self.gameSetup.updateWinAmountText(credits[stopAtIndex]);
                    self.totalWinAmount += parseInt(credits[stopAtIndex]);
                }
            })
            .start();

        this.tweenArr.push(tween);
    }

    createSprite(url) {
        const tex = Assets.get(url);
        const image = new Sprite(tex);
        image.anchor.set(0.5);
        return image;
    }

    addChild(child) {
        this.app.stage.addChild(child);
    }

    update(time) {
        this.gameSetup.update(time);
        this.coinShower.update(time);
        this.tweenArr.forEach((tween) => {
            tween.update(TWEEN.now());
        });
    }

    async addDropDown() {
        new Promise((resolve: Function) => {
            // Create a dropdown list container
            const size = { width: this.app.screen.width, height: this.app.screen.height };
            const dropdownContainer = new Container();

            dropdownContainer.x = size.width/1.2;
            dropdownContainer.y = size.height/10;
            this.addChild(dropdownContainer);

            // Create the dropdown button
            const button = new Graphics();
            button.beginFill(0x66CCFF); // Fill color
            button.drawRect(0, 0, 100, 20); // Draw a rectangle for the button
            button.endFill();
            dropdownContainer.addChild(button);

            // Create the dropdown items container
            const dropdownItemsContainer = new Container();
            dropdownItemsContainer.y = 40; // Adjust the position below the button
            dropdownContainer.addChild(dropdownItemsContainer);

            // Create dropdown items
            Assets.get('config').dorpdownItem.forEach((item, index) => {
                const dropdownItem = new Text(item, { fontFamily: 'Arial', fontSize: 16, fill: 0xffffff });
                dropdownItem.interactive = true;
                dropdownItem.cursor = 'pointer'; // Set cursor to 'pointer' to indicate interactivity
                dropdownItem.y = index * 30; // Adjust the position of each item
                dropdownItem.on('pointerdown', () => {
                    this.selectedItem = index;
                    this.buttonText.text = item; // Update the button text with the selected item
                    dropdownItemsContainer.visible = false; // Hide the dropdown items
                });
                dropdownItemsContainer.addChild(dropdownItem);
            });

            // Create the button text
            this.buttonText = new Text('Select an item', { fontFamily: 'Arial', fontSize: 16, fill: 0x000000 });
            this.buttonText.anchor.set(0.5);
            this.buttonText.x = button.width / 2;
            this.buttonText.y = button.height / 2;
            button.addChild(this.buttonText);

            const textStyle = new TextStyle({
                fontFamily: 'Arial',
                fontSize: 64,
                fontWeight: 'bold',
                fill: ['#ffffff', '#ff3300'], // gradient colors
                stroke: '#000000',
                strokeThickness: 6,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 600,
                align: 'center'
            });

            const bonusText = new Text('Bonus Spin',textStyle);
            bonusText.anchor.set(0.5);
            bonusText.x = size.width / 2;
            bonusText.y = size.height / 10;
            this.addChild(bonusText);
            
            
            // Hide dropdown items initially
            dropdownItemsContainer.visible = false;

            // Toggle dropdown items visibility on button click
            button.interactive = true;
            button.on('pointerdown', () => {
                dropdownItemsContainer.visible = !dropdownItemsContainer.visible;
              
            });

            resolve();
        });
    }

    onCoinShowerFinish() {
        this.gameSetup.show();
        this.soundManager.stopSound(0);
        this.gameSetup.removeWinningText();
        this.isSpinPressed = false;
    }
}

new PixiWheel();