import { Howl } from 'howler';

export default class SoundManager {
    private sounds: Howl[] = [];

    constructor(private soundFiles: string[]) {
        this.loadSounds();
    }

    private loadSounds(): void {
        this.soundFiles.forEach((filePath) => {
            const sound = new Howl({
                src: [filePath],
                volume: 1,
                loop: false,
                preload: true,
                onload: () => {
                    console.log(`Sound ${filePath} loaded`);
                },
                onloaderror: (error) => {
                    console.error(`Error loading sound ${filePath}:`, error);
                }
            });

            this.sounds.push(sound);
        });
    }

    playSound(index: number, loop: boolean = false): void {
        if (index >= 0 && index < this.sounds.length) {
            const sound = this.sounds[index];
            sound.loop(loop); // Set loop mode dynamically
            sound.play();
        } else {
            console.error('Invalid sound index');
        }
    }

    stopSound(index: number): void {
        if (index >= 0 && index < this.sounds.length) {
            const sound = this.sounds[index];
            sound.stop();
        } else {
            console.error('Invalid sound index');
        }
    }
}

