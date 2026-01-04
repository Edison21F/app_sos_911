import { ILocationService } from '../../ports/services/ILocationService';

/**
 * CAPA DE APLICACIÓN: Caso de Uso
 * 
 * RESPONSABILIDAD:
 * Detener la sincronización de ubicación en segundo plano.
 * Esto sucede típicamente cuando el usuario cierra sesión.
 */
export class StopLocationSyncUseCase {
    constructor(private locationService: ILocationService) { }

    async execute(): Promise<void> {
        return this.locationService.stopLocationSync();
    }
}
