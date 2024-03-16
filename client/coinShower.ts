import { Loader, AnimatedSprite, Assets, Sprite } from 'pixi.js';

export default class CoinShower {

    private coins: AnimatedSprite[] = [];
    private animationStopped: boolean = true;
    app;
    constructor(app) {
        this.app = app;
        this.onAssetsLoaded();
    }

    async onAssetsLoaded() {
        // Retrieve the coin texture atlas (sprite sheet) from the loader resources
        // Create coins and add them to the stage
        const animations = await this.createSprite('coin_anim.json');
        for (let i = 0; i < 50; i++) {

            let texture = [];
            animations['coin-anim'].forEach(element => {
                texture.push(Sprite.from(element).texture);
            });

            const coin = new AnimatedSprite(texture);
            coin.anchor.set(0.5);
            coin.x = Math.random() * this.app.screen.width;
            coin.y = -50;
            coin.scale.set(0.5);
            coin.animationSpeed = 0.5; // Adjust animation speed as needed
            coin.play();
            this.app.stage.addChild(coin);
            this.coins.push(coin);
        }
        this.animationStopped = true;
        this.app.ticker.add(this.update.bind(this));
    }
    async createSprite(url) {
        // const animations = Assets.cache.get(`assets/aminations/coin-anim/${url}`);
        const animations = Assets.cache.get(`coin-json`);
        // const character = PIXI.AnimatedSprite.fromFrames(animations["character/walk"]);
        // const image = new Sprite(texture);
        // image.anchor.set(0.5);
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
                coin.y += 5 * delta; // Adjust the falling speed as needed
                // Check if a coin has reached the bottom of the screen
                if (coin.y < (this.app.screen.height + 100)) {
                    allCoinsAtBottom = false;
                }
            }
        });

        // Stop the animation if all coins are at the bottom
        if (allCoinsAtBottom) {
            this.animationStopped = true;
            // this.app.ticker.stop();
            console.log('Coin shower animation stopped.');
        }
    }

    resetCoins() {
        this.coins.forEach((coin) => {
            coin.y = -Math.random() * (700 - 100) + 100;
            coin.x = Math.random() * this.app.screen.width;
        });
    }
}


