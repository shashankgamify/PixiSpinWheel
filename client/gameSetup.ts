import { TextStyle, Text, Container, Graphics } from 'pixi.js';
import TWEEN from 'tween.js';

export default class GameSetup {

    winAmountContainer:Container;
    container;
    app;
    isFadedOut = false;
    tweenArr: TWEEN.Tween[] = [];
    overlay;
    winText: Text;
    

    constructor(app) {
        this.app = app;
        this.winAmountContainer = new Container();
        this.container=new Container();  
        this.app.stage.addChild(this.container);
    }

    addText(winAmount: number) {
        const size = { width: this.app.screen.width, height: this.app.screen.height };
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
        creditText.anchor.set(.5);
        creditText.x = size.width/2-50;
        creditText.y = size.height/1.35;
        this.app.stage.addChild(creditText);

        this.winText = new Text(winAmount, style);
        this.winText.anchor.set(.5);
        this.winText.x = size.width/1.5-80;
        this.winText.y = size.height/1.35;
        this.app.stage.addChild(this.winText);

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
        titleText.anchor.set(.5);
        titleText.x = size.width/2;
        titleText.y = size.height/10;
        this.container.addChild(titleText)
    }

    updateWinAmountText(winAmount) {
        let targetNumber = parseInt(this.winText.text) + parseInt(winAmount);
        const startNumber = parseInt(this.winText.text);
        let self = this;
        let winText = this.winText;
        const tween = new TWEEN.Tween({ number: startNumber })
            .to({ number: targetNumber }, 4000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function onUpdate(obj) {
                winText.text = Math.round(this.number).toString();
                if (obj == 1) {
                    self.tweenArr.pop();
                }
            })
            .start();
        this.tweenArr.push(tween);


    }

    addWiningTextAmount(winAmount) {
        const size = { width: this.app.screen.width, height: this.app.screen.height };
              
        this.winAmountContainer.x = size.width/2-120;
        this.winAmountContainer.y = size.height/2.8;
        this.app.stage.addChild(this.winAmountContainer);
        
        const styleNorml = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: ['#ff0051'], // gradient
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',

        });
        const backgroundRect = new Graphics();
        backgroundRect.beginFill(0x000000, 0.9); // Background color and opacity
        backgroundRect.drawRect(0, 0, 250, 25); // Rectangle dimensions
        backgroundRect.endFill();
        this.winAmountContainer.addChild(backgroundRect);

        const winTextAmount = new Text('YOU WON ' + winAmount + ' CREDITS!', styleNorml);
        winTextAmount.x=2.5;
        winTextAmount.y=0;
        this.winAmountContainer.addChild(winTextAmount);
    }

    removeWinningText() {
        this.app.stage.removeChild(this.winAmountContainer);
    }


    addClickButton() {
        const size = { width: this.app.screen.width, height: this.app.screen.height };
        // Create a button container
        const buttonContainer = new Container();
        
        buttonContainer.x = size.width/2-100;
        buttonContainer.y = size.height/2.5;

        this.container.addChild(buttonContainer);
        // Create a button shape
        const buttonShape = new Graphics();
        buttonShape.beginFill(0x66CCFF); // Fill color
        buttonShape.drawRoundedRect(0, 0, 200, 50, 15); // Draw a rectangle for the button
        buttonShape.endFill();

        buttonContainer.addChild(buttonShape);

        // Create text for the button
        const buttonText = new Text('PRESS TO SPIN', { fontFamily: 'Arial', fontSize: 18, fill: 0xffffff });
        buttonText.anchor.set(0.5); // Center the text
        buttonText.x = buttonShape.width / 2;
        buttonText.y = buttonShape.height / 2;
        buttonContainer.addChild(buttonText);

        // Enable interaction on the button container
        buttonContainer.interactive = true;

        // Add click event listener to the button container
        buttonContainer.on('click', () => {
            this.hide();
        });
    }

    show() {
        this.overlay.interactive = true;
        let self = this;
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
        this.overlay.interactive = false;
        this.isFadedOut = true;
        let self = this;
        let container = this.container;
        let final = 1;

        let tween = new TWEEN.Tween({ opcity: 1 })
            .to({ opcity: 0 }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate((obj) => {
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
        this.overlay.drawRect(0, 0, window.outerWidth, window.outerHeight);
        this.overlay.endFill();
        // Add the overlay to the stage
        this.container.addChild(this.overlay);

    }
}
