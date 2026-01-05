import { IPreferencesService } from '../../ports/services/IPreferencesService';

/**
 * CAPA DE APLICACIÓN: Caso de Uso
 * 
 * RESPONSABILIDAD:
 * Obtener el estado actual de la configuración de auto-login.
 * 
 * FLUJO:
 * Presentation (ViewModel) → Este Caso de Uso → IPreferencesService (Puerto)
 */
export class GetAutoLoginSettingUseCase {
    constructor(private preferencesService: IPreferencesService) { }

    /**
     * Ejecuta el caso de uso para obtener la preferencia de auto-login.
     * @returns Promise<boolean> - true si auto-login está habilitado, false en caso contrario.
     */
    async execute(): Promise<boolean> {
        return this.preferencesService.getAutoLoginEnabled();
    }
}
