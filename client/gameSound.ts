import { Howl, HowlerError } from 'howler';

export default class SoundManager {
    private sounds: Howl[] = []; // Array to store loaded sounds

    soundFiles = [ // Array containing file paths of sound files to be loaded
        'assets/sounds/credits-rollup.wav',
        'assets/sounds/wheel-click.wav',
        'assets/sounds/wheel-landing.wav',
    ];

    /**
     * Loads all the sound files asynchronously
     * @returns A promise that resolves when all sounds are loaded
     */
    public async loadSounds(): Promise<void> {
        return new Promise<void>((resolve) => {
            let count = 0;
            this.soundFiles.forEach((filePath) => {
                const sound = new Howl({
                    src: [filePath],
                    volume: 1,
                    loop: false,
                    preload: true,
                    onload: () => {
                        ++count;
                        if (count === this.soundFiles.length) {
                            resolve(); // Resolve the promise when all sounds are loaded
                        }
                    },
                    onloaderror: (error: HowlerError) => {
                        console.error(`Error loading sound ${filePath}:`, error);
                    },
                });

                this.sounds.push(sound); // Add the loaded sound to the array
            });
        });
    }

    /**
     * Plays the sound specified by index
     * @param index Index of the sound in the sounds array
     * @param loop Whether to loop the sound
     */
    playSound(index: number, loop: boolean = false): void {
        if (index >= 0 && index < this.sounds.length) {
            const sound = this.sounds[index];
            sound.loop(loop); // Set loop mode dynamically
            sound.play(); // Play the sound
        } else {
            console.error('Invalid sound index');
        }
    }

    /**
     * Stops the sound specified by index
     * @param index Index of the sound in the sounds array
     */
    stopSound(index: number): void {
        if (index >= 0 && index < this.sounds.length) {
            const sound = this.sounds[index];
            sound.stop(); // Stop the sound
        } else {
            console.error('Invalid sound index');
        }
    }
}
