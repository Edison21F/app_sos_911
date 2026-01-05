import { IPreferencesService } from '../../ports/services/IPreferencesService';

/**
 * CAPA DE APLICACIÓN: Caso de Uso
 * 
 * RESPONSABILIDAD:
 * Alternar (toggle) el estado de la configuración de auto-login.
 * 
 * FLUJO:
 * Presentation (ViewModel) → Este Caso de Uso → IPreferencesService (Puerto)
 */
export class ToggleAutoLoginSettingUseCase {
    constructor(private preferencesService: IPreferencesService) { }

    /**
     * Ejecuta el caso de uso para cambiar el estado de auto-login.
     * @param currentValue - Valor actual del auto-login.
     * @returns Promise<boolean> - El nuevo valor después de alternar.
     */
    async execute(currentValue: boolean): Promise<boolean> {
        const newValue = !currentValue;
        await this.preferencesService.setAutoLoginEnabled(newValue);
        return newValue;
    }
}
