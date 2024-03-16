import { TextStyle, Text, Container, Graphics } from 'pixi.js';
import TWEEN from 'tween.js';
import { PixiWheel } from '.';

// Reference to the water overlay.
export default class GameText {

    mainClass: PixiWheel
    container;
    app;
    isFadedOut = false;

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

        const winAmountStyle = new TextStyle({
            fontFamily: 'Arial',
            dropShadow: true,
            dropShadowAlpha: 0.8,
            dropShadowAngle: 2.1,
            dropShadowBlur: 4,
            dropShadowColor: '0x111111',
            dropShadowDistance: 10,
            fill: ['#ffffff'],
            stroke: '#004620',
            fontSize: 60,
            fontWeight: 'lighter',
            lineJoin: 'round',
            strokeThickness: 12,
        });

        const winText = new Text(winAmount, winAmountStyle);

        winText.anchor.set(0.5, 0.5);
        winText.x = 420;
        winText.y = 450;

        this.app.stage.addChild(winText);
    }

    addClickButton() {

        const size = { width: this.app.screen.width, height: this.app.screen.height };

        // Create a button container
        const buttonContainer = new Container();
        // buttonContainer.x = 0;
        // buttonContainer.y = 200;
        buttonContainer.x = size.width / 2;
        buttonContainer.y = size.height / 2 + 130;

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

            if (this.isFadedOut)
                return;

            this.isFadedOut = true;

            console.log(" guioytyogftf8try8uo");

            let container = this.container;
            let final = 1;
            let stage = this.app.stage;
            let mainClass = this.mainClass;

            let tween = new TWEEN.Tween({ opcity: 1 })
                .to({ opcity: 0 }, 1000)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function onUpdate(obj) {
                    /// alpha = 1 - 0.2 * 1;
                    container.alpha = final - (final * obj)
                    if (obj == 1) {
                        this.isFadedOut = true;
                        // stage.removeChild(this.container);
                        let indx = mainClass.tweenArr.findIndex((value, ind) => {
                            return value == tween;
                        });
                        mainClass.tweenArr.splice(indx, 1);
                    }
                })
                .start();
            mainClass.tweenArr.push(tween);
        });
    }

    update() {

    }

    overlayGrahpics() {
        const overlay = new Graphics();
        overlay.beginFill(0x808080, 1);// End with fully transparent black
        overlay.drawRect(0, 0, this.app.renderer.height, this.app.renderer.width);
        overlay.endFill();
        // Add the overlay to the stage
        this.container.addChild(overlay);

    }
}





