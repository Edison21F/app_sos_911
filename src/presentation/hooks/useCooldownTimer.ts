import { useState, useEffect, useCallback } from 'react';

/**
 * CAPA DE PRESENTACIÓN: Hook de UI
 * 
 * RESPONSABILIDAD:
 * Manejar la lógica del temporizador de cooldown para el botón SOS.
 * Extrae la lógica de tiempo de la View para mantenerla limpia.
 * 
 * Este hook no tiene lógica de negocio, solo maneja estado de UI.
 */

interface CooldownTimerResult {
    /** Indica si el cooldown está activo */
    isCooldownActive: boolean;
    /** Segundos restantes del cooldown */
    cooldownTime: number;
    /** Inicia el cooldown con una duración específica */
    startCooldown: (durationSeconds: number) => void;
    /** Cancela el cooldown manualmente */
    cancelCooldown: () => void;
    /** Formatea el tiempo en formato mm:ss */
    formatTime: (seconds: number) => string;
}

export const useCooldownTimer = (): CooldownTimerResult => {
    const [isCooldownActive, setIsCooldownActive] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isCooldownActive && cooldownTime > 0) {
            interval = setInterval(() => {
                setCooldownTime(prev => {
                    if (prev <= 1) {
                        setIsCooldownActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCooldownActive, cooldownTime]);

    const startCooldown = useCallback((durationSeconds: number) => {
        setCooldownTime(durationSeconds);
        setIsCooldownActive(true);
    }, []);

    const cancelCooldown = useCallback(() => {
        setIsCooldownActive(false);
        setCooldownTime(0);
    }, []);

    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    return {
        isCooldownActive,
        cooldownTime,
        startCooldown,
        cancelCooldown,
        formatTime
    };
};
