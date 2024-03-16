import { TextStyle, Text, Container, Graphics } from 'pixi.js';
import TWEEN from 'tween.js';
import { PixiWheel } from '.';

// Reference to the water overlay.
export default class GameText {

    container;
    app;
    isFadedOut = false;
    tweenArr: TWEEN.Tween[] = [];
    overlay;

    constructor(app) {
        this.app = app;
        this.container = new Container();
        this.app.stage.addChild(this.container);
    }

    addText(winAmount: number) {

        // Create a water texture object.
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });

        const creditText = new Text('Credit Balance :', style);

        creditText.x = 50;
        creditText.y = 420;

        this.app.stage.addChild(creditText);
        const winText = new Text(winAmount, style);

        winText.x = 340;
        winText.y = 420;

        this.app.stage.addChild(winText);

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

        // Create a PixiJS text object
        const titleText = new Text('Spin Play Game', textStyle);
        this.container.addChild(titleText)
    }

    addClickButton() {

        const size = { width: this.app.screen.width, height: this.app.screen.height };

        // Create a button container
        const buttonContainer = new Container();
        buttonContainer.x = 150;
        buttonContainer.y = 200;

        this.container.addChild(buttonContainer);
        // Create a button shape
        const buttonShape = new Graphics();
        buttonShape.beginFill(0x66CCFF); // Fill color
        buttonShape.drawRoundedRect(0, 0, 200, 50, 15); // Draw a rectangle for the button
        buttonShape.endFill();
        buttonContainer.addChild(buttonShape);

        // Create text for the button
        const buttonText = new Text('Click For Bouns Spin', { fontFamily: 'Arial', fontSize: 18, fill: 0xffffff });
        buttonText.anchor.set(0.5); // Center the text
        buttonText.x = buttonShape.width / 2;
        buttonText.y = buttonShape.height / 2;
        buttonContainer.addChild(buttonText);

        // Enable interaction on the button container
        buttonContainer.interactive = true;

        // Set button mode on mouseover
        // buttonContainer.on('mouseover', () => {
        //     buttonContainer.scale.set(1.1); // Scale up slightly
        // });

        // // Set default scale on mouseout
        // buttonContainer.on('mouseout', () => {
        //     buttonContainer.scale.set(1); // Restore original scale
        // });

        // Add click event listener to the button container
        buttonContainer.on('click', () => {
            this.hide();
        });
    }

    show() {
        console.log("show title scene");
        this.overlay.interactive = true;
        let self = this;
        // this.isFadedOut = false;
        let container = this.container;
        let final = 1;
        let tween = new TWEEN.Tween({ opcity: 1 })
            .to({ opcity: 0 }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function onUpdate(obj) {
                container.alpha = final * obj;
                if (obj == 1) {
                    self.isFadedOut = false;
                    self.tweenArr.pop();
                }
            })
            .start();
        self.tweenArr.push(tween);
    }

    hide() {
        if (this.isFadedOut)
            return;

        console.log("hide title scene");
        this.overlay.interactive = false;

        this.isFadedOut = true;
        let self = this;
        let container = this.container;
        let final = 1;

        let tween = new TWEEN.Tween({ opcity: 1 })
            .to({ opcity: 0 }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate((obj) => {
                /// alpha = 1 - 0.2 * 1;
                container.alpha = final - (final * obj)
                if (obj == 1) {
                    self.isFadedOut = true;
                    self.tweenArr.pop();
                }
            })
            .start();
        self.tweenArr.push(tween);
    }

    update(delta: number) {
        this.tweenArr.forEach((tween) => {
            tween.update(TWEEN.now());
        });
    }

    overlayGrahpics() {
        this.overlay = new Graphics();
        this.overlay.interactive = true;
        this.overlay.on('click', () => {
            console.log('blank overlay');
        });
        this.overlay.beginFill(0x808080, 1);// End with fully transparent black
        this.overlay.drawRect(0, 0, this.app.renderer.height, this.app.renderer.width);
        this.overlay.endFill();
        // Add the overlay to the stage
        this.container.addChild(this.overlay);

    }
}





