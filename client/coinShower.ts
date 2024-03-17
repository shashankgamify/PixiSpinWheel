import { AnimatedSprite, Assets, Sprite } from 'pixi.js';

export default class CoinShower {

    callback: Function;
    private coins: AnimatedSprite[] = [];
    private animationStopped: boolean = true;
    app;
    gravity = 5;

    constructor(app) {
        this.app = app;
        this.onAssetsLoaded();
    }

    async onAssetsLoaded() {
        // Retrieve the coin texture atlas (sprite sheet) from the loader resources
        // Create coins and add them to the stage
        const animations = await this.createSprite();
        for (let i = 0; i < 50; i++) {

            let texture = [];
            animations['coin-anim'].forEach(element => {
                texture.push(Sprite.from(element).texture);
            });

            const coin = new AnimatedSprite(texture);
            coin.anchor.set(0.5);
            coin.scale.set(0.4);
            coin.animationSpeed = this.getMinMax(0.2, 0.8);
            coin.play();
            this.app.stage.addChild(coin);
            this.coins.push(coin);
        }
        this.resetCoins();
        this.animationStopped = true;
    }

    async createSprite() {
        const animations = Assets.cache.get(`coin-json`);
        return animations.data.animations;
    }

    animateCoins(): void {
        this.resetCoins();
        // Start the animation loop
        this.animationStopped = false;
    }

    update(delta: number) {
        if (this.animationStopped)
            return;

        let allCoinsAtBottom = true;
        this.coins.forEach((coin) => {
            if (!this.animationStopped) {
                coin.y += this.gravity * delta; 
                // Check if a coin has reached the bottom of the screen
                if (coin.y < (this.app.screen.height + 100)) {
                    allCoinsAtBottom = false;
                }
            }
        });

        // Stop the animation if all coins are at the bottom
        if (allCoinsAtBottom) {
            this.animationStopped = true;
            this.callback && this.callback();            
        }
    }

    resetCoins() {
        this.coins.forEach((coin) => {
            coin.y = -this.getMinMax(100, 700);
            coin.x = Math.random() * this.app.screen.width;
        });
    }

    getMinMax(min, max) {
        return Math.random() * (max - min) + min;
    }
}