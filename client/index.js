// Create a Pixi.js application
const credits = [5000, 200, 1000, 400, 2000, 200, 1000, 400];
const wheelSpinWeight = [4, 100, 20, 50, 10, 100, 20, 50];

const maxSpeed = 10;
class PixiWheel {

    tweenArr = [];
    isSpinPressed = false;

    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600 });
        document.body.appendChild(this.app.view);

        const size = { width: this.app.screen.width, height: this.app.screen.height };

        const background = this.createSprite('background.png');
        this.addChild(background);
        background.x = size.width / 2;
        background.y = size.height / 2;

        this.update(.22);
        this.addSpinWheel();
        this.addSpinButton();
    }

    addSpinWheel() {
        const size = { width: this.app.screen.width, height: this.app.screen.height };
        const pointer = this.createSprite('pointer.png');
        this.addChild(pointer);
        pointer.x = size.width / 2;
        pointer.y = size.height / 2 - 140;

        this.wheel_container = new PIXI.Container();
        this.addChild(this.wheel_container);
        this.wheel_container.x = size.width / 2;
        this.wheel_container.y = size.height / 2;

        const wheel = this.createSprite('wheel-center.png');
        wheel.tint = 0x00FF00;
        this.wheel_container.addChild(wheel);

        let diff_angle = 45;
        for (let index = 0; index < 8; index++) {
            const element = credits[index];

            const slice_cont = new PIXI.Container();
            const slice = this.createSprite('wheel-slice.png');

            slice.anchor.set(0.5, 1);
            let text = new PIXI.Text(`${element}`, { fontFamily: 'Arial', fontSize: 80, fill: 0xff1010, align: 'center' });
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
    }


    addSpinButton() {
        // Create the bunny sprite
        const size = { width: this.app.screen.width, height: this.app.screen.height };
        const btn_spin = this.createSprite('button.png')
        btn_spin.x = size.width / 2;
        btn_spin.y = size.height / 2 + 200;
        btn_spin.scale.set(0.2);
        btn_spin.cursor = 'pointer';
        btn_spin.interactive = true;
        btn_spin.buttonMode = true;
        btn_spin.on('pointerdown', this.onButtonCLick.bind(this));
        this.addChild(btn_spin);
    }

    onButtonCLick() {
        if (!this.isSpinPressed) {
            this.isSpinPressed = true;

            let indx = this.getRandWeight(wheelSpinWeight);
            // indx = 2;
            console.log('weight', wheelSpinWeight[indx]);
            console.log('creds', credits[indx]);
            console.log(indx);

            this.spinWheel(indx);
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
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(function onUpdate(obj, arm) {
                wheelc.angle = cur_angle + final * obj;
                if (obj == 1) {
                    self.isSpinPressed = false;
                    self.tweenArr.pop();
                }
            })
            .start();
        this.tweenArr.push(tween);
    }

    createSprite(url) {
        let image = PIXI.Sprite.from(`assets/${url}`);
        image.anchor.set(0.5);
        return image;
    }

    addChild(child) {
        this.app.stage.addChild(child);
    }

    update(time) {
        this.tweenArr.forEach(tween => tween.update(time));
        // this.tween.update(timestamp);
        requestAnimationFrame(this.update.bind(this));
    }
}

new PixiWheel();