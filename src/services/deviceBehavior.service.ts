import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Brightness from 'expo-brightness';
import { Platform } from 'react-native';

type AlertType = 'MEDICAL' | 'DANGER' | 'FIRE' | 'TRAFFIC' | 'PREVENTIVE';

class DeviceBehaviorService {
    private soundObject: Audio.Sound | null = null;
    private isBehaving = false;

    // Sonidos predefinidos (deberían estar en assets, usaremos placeholders o generadores)
    // Para este MVP usaremos require de archivos locales. 
    // Asegúrate de tener archivos de sonido o usar una URL remota temporalmente.
    // Usaremos valores por defecto de sistema para MVP si no hay assets.

    async triggerBehavior(type: AlertType) {
        if (this.isBehaving) this.stopBehaviors();
        this.isBehaving = true;

        console.log(`[DeviceBehavior] Triggering for ${type}`);

        switch (type) {
            case 'MEDICAL':
                await this.handleMedical();
                break;
            case 'DANGER': // Robo / Violencia
                await this.handleDanger();
                break;
            case 'FIRE':
                await this.handleFire();
                break;
            case 'TRAFFIC':
                await this.handleTraffic();
                break;
            case 'PREVENTIVE':
                await this.handlePreventive();
                break;
        }
    }



    // --- Specific Behaviors ---

    private async handleMedical() {
        // Vibración continua (Pattern)
        this.startVibrationPattern([500, 500], true);
        // Sonido Moderado (TODO: Load actual file)
        // await this.playSound(require('../../assets/sounds/medical.mp3'), true);
    }

    private async handleDanger() {
        // Silencioso, solo vibración corta inicial
        // "Modo Fantasma"
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 1000);

        // Bajar brillo para discreción
        try {
            await Brightness.setBrightnessAsync(0);
        } catch (e) { console.warn(e); }
    }

    private async handleFire() {
        // Alerta MAXIMA
        // Pantalla flash
        this.startScreenFlash();
        // Vibración Pesada
        this.startVibrationPattern([200, 100, 200, 100], true);
        // Sonido Fuerte
        // await this.playSound(require('../../assets/sounds/alarm.mp3'), true);
    }

    private async handleTraffic() {
        // Vibración Prolongada
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 500);
        // Sonido Continuo
    }

    private async handlePreventive() {
        // Muy suave
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // --- Helpers ---

    private async startVibrationPattern(pattern: number[], loop: boolean) {
        // React Native Vibration API
        const { Vibration } = require('react-native');
        Vibration.vibrate(pattern, loop);
    }



    async stopBehaviors() {
        console.log('[DeviceBehavior] Stopping all behaviors');
        this.isBehaving = false;

        // Stop Vibration
        const { Vibration } = require('react-native');
        Vibration.cancel();

        // Stop Sound
        if (this.soundObject) {
            try {
                await this.soundObject.stopAsync();
                await this.soundObject.unloadAsync();
            } catch (error) {
                console.warn('Error stopping sound', error);
            }
            this.soundObject = null;
        }

        // Restore Brightness
        try {
            await Brightness.useSystemBrightnessAsync();
        } catch (e) {
            console.warn('Error restoring brightness', e);
        }
    }

    private async startScreenFlash() {
        if (!this.isBehaving) return;
        try {
            await Brightness.setBrightnessAsync(1);
            setTimeout(async () => {
                if (!this.isBehaving) return;
                await Brightness.setBrightnessAsync(0.1);
                setTimeout(() => this.startScreenFlash(), 500);
            }, 500);
        } catch (e) { console.warn(e); }
    }

    /*
    private async playSound(source: any, loop: boolean) {
        try {
            const { sound } = await Audio.Sound.createAsync(source, { isLooping: loop });
            this.soundObject = sound;
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    }
    */
}

export default new DeviceBehaviorService();
