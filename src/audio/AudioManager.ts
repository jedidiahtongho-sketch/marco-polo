import { Howl } from 'howler'

class AudioManager {
  private sounds: Map<string, Howl> = new Map()
  private activeSounds: Map<string, number> = new Map()

  loadSound(key: string, src: string, options?: any) {
    const sound = new Howl({
      src: [src],
      ...options
    })
    this.sounds.set(key, sound)
    return sound
  }

  play(key: string, scaryOptions?: {
    pitch?: number
    volume?: number
    distortion?: number
    reverb?: number
    echo?: boolean
  }) {
    const sound = this.sounds.get(key)
    if (sound) {
      try {
        const id = sound.play()

        // Apply scary effects
        if (scaryOptions) {
          if (scaryOptions.pitch) {
            sound.rate(scaryOptions.pitch, id)
          }
          if (scaryOptions.volume !== undefined) {
            sound.volume(scaryOptions.volume, id)
          }
          // Add distortion effect by manipulating the sound
          if (scaryOptions.distortion) {
            // Simulate distortion by rapidly changing volume
            this.applyDistortion(sound, id, scaryOptions.distortion)
          }
        }

        // Store active sound ID for cleanup
        this.activeSounds.set(`${key}_${id}`, id)

        return id
      } catch (error) {
        console.warn(`Failed to play audio "${key}":`, error)
        return undefined
      }
    } else {
      console.warn(`Audio "${key}" not loaded`)
      return undefined
    }
  }

  private applyDistortion(sound: Howl, id: number, intensity: number) {
    // Create a distortion effect by rapidly modulating volume
    const baseVolume = sound.volume();
    let distortionCount = 0;
    const maxDistortions = Math.floor(5 + intensity * 15); // Use intensity to control distortion duration

    const distortInterval = setInterval(() => {
      if (distortionCount >= maxDistortions) {
        clearInterval(distortInterval);
        sound.volume(baseVolume, id);
        return;
      }

      const distortedVolume = baseVolume * (0.3 + Math.random() * 0.7);
      sound.volume(distortedVolume, id);
      distortionCount++;
    }, 50);
  }

  playScaryMarco(position: [number, number, number]) {
    // Play a terrifying marco call with random scary effects - 1000x scarier
    const scaryEffects = {
      pitch: 0.3 + Math.random() * 0.4, // 0.3 to 0.7 - very low and distorted
      volume: 1.5 + Math.random() * 1.0, // 1.5 to 2.5 - extremely loud
      distortion: 0.8 + Math.random() * 0.4, // Heavy distortion
    };

    // Play multiple overlapping marco calls for maximum terror
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.play('marco', {
          ...scaryEffects,
          pitch: scaryEffects.pitch + (i * 0.1),
          volume: scaryEffects.volume * (1 - i * 0.1)
        })
      }, i * 150)
    }

    // Add terrifying echo effects
    setTimeout(() => {
      this.play('marco', {
        pitch: 0.1,
        volume: 2.5,
        distortion: 1.0
      })
    }, 1000)

    // Trigger immediate jump scare sound
    this.play('jumpscare', { volume: 3.0 })

    // Add demonic whispers
    setTimeout(() => {
      this.play('whispers', { volume: 2.0, pitch: 0.5 })
    }, 500)

    const id = this.play('marco', scaryEffects);
    if (id !== undefined) {
      this.set3DPosition('marco', position[0], position[1], position[2]);
    }
    return id;
  }

  playTerrifyingHeartbeat(intensity: number = 1) {
    // Play heartbeat with increasing intensity
    const volume = 0.3 + (intensity * 0.7); // 0.3 to 1.0
    const rate = 1 + (intensity * 0.5); // 1.0 to 1.5 (faster when more intense)

    const sound = this.sounds.get('heartbeat');
    if (sound) {
      sound.rate(rate);
      sound.volume(volume);
      return sound.play();
    }
    return undefined;
  }

  playJumpscare() {
    // Play jumpscare with maximum terror
    return this.play('jumpscare', {
      volume: 1.5,
      pitch: 0.8 + Math.random() * 0.4,
      distortion: 0.8
    });
  }

  stop(key: string) {
    const sound = this.sounds.get(key)
    if (sound) {
      sound.stop()
    }
  }

  fadeOut(key: string, duration: number = 1000) {
    const sound = this.sounds.get(key)
    if (sound && sound.playing()) {
      sound.fade(sound.volume(), 0, duration)
    }
  }

  setVolume(key: string, volume: number) {
    const sound = this.sounds.get(key)
    if (sound) {
      sound.volume(volume)
    }
  }

  set3DPosition(key: string, x: number, y: number, z: number) {
    const sound = this.sounds.get(key)
    if (sound) {
      sound.pos(x, y, z)
    }
  }
}

export const audioManager = new AudioManager()

// Initialize game sounds
export function initializeAudio() {
  // Background ambiance
  audioManager.loadSound('ambiance', '/audio/ambiance.mp3', {
    loop: true,
    volume: 0.3
  })

  // Marco call
  audioManager.loadSound('marco', '/audio/marco.mp3', {
    volume: 0.8,
    spatial: true
  })

  // Polo response
  audioManager.loadSound('polo', '/audio/polo.mp3', {
    volume: 0.6
  })

  // Footsteps
  audioManager.loadSound('footsteps', '/audio/footsteps.mp3', {
    loop: true,
    volume: 0.4,
    spatial: true
  })

  // Heart beat
  audioManager.loadSound('heartbeat', '/audio/heartbeat.mp3', {
    loop: true,
    volume: 0
  })

  // Jump scare
  audioManager.loadSound('jumpscare', '/audio/jumpscare.mp3', {
    volume: 1.0
  })
}