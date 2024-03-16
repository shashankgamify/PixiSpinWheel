import { Loader, AnimatedSprite, Assets, Sprite } from 'pixi.js';

export default class CoinShower {

    private coins: AnimatedSprite[] = [];
    private animationStopped: boolean = false;
    private loader: Loader;
    app;
    constructor(app) {

        this.app = app;
        // Create a new instance of Loader
        this.onAssetsLoaded();
     

    }

    async onAssetsLoaded() {
        // Retrieve the coin texture atlas (sprite sheet) from the loader resources
        const coinSheet = await this.createSprite('coin_anim.json');
        // Create coins and add them to the stage
        for (let i = 0; i < 50; i++) {
            const coin = new AnimatedSprite(coinSheet['coin_anim']);
            coin.anchor.set(0.5);
            coin.x = Math.random() * this.app.screen.width;
            coin.y = -50;
            coin.scale.set(0.5);
            coin.animationSpeed = 0.2; // Adjust animation speed as needed
            coin.play();
            this.app.stage.addChild(coin);
            this.coins.push(coin);
        }

        // Start the animation loop
        this.app.ticker.add(this.animateCoins.bind(this));
    }
    async createSprite(url) {
        const texture = await Assets.load(`assets/aminations/coin-anim/${url}`);
        const image = new Sprite(texture);
        image.anchor.set(0.5);
        return image;
    }
    animateCoins(delta: number): void {
        // Move coins downwards
        let allCoinsAtBottom = true;
        this.coins.forEach((coin) => {
            if (!this.animationStopped) {
                coin.y += 5 * delta; // Adjust the falling speed as needed
                // Check if a coin has reached the bottom of the screen
                if (coin.y < this.app.screen.height) {
                    allCoinsAtBottom = false;
                }
                if (coin.y > this.app.screen.height) {
                    coin.y = -50; // Reset the coin position to the top
                    coin.x = Math.random() * this.app.screen.width; // Randomize the horizontal position
                }
            }
        });

        // Stop the animation if all coins are at the bottom
        if (allCoinsAtBottom) {
            this.animationStopped = true;
            this.app.ticker.stop();
            console.log('Coin shower animation stopped.');
        }
    }
}


