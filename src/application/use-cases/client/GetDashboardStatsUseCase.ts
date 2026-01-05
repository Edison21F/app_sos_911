import { IClientRepository, DashboardStats } from '../../ports/repositories/IClientRepository';

/**
 * CAPA DE APLICACIÓN: Caso de Uso
 * 
 * RESPONSABILIDAD:
 * Ejecutar la lógica de negocio para obtener las estadísticas del dashboard.
 * 
 * FLUJO:
 * 1. Recibe el ID del cliente.
 * 2. Solicita los datos al Repositorio (Capa de Interfaces).
 * 3. Devuelve los datos puros a la Vista.
 */
export class GetDashboardStatsUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async execute(clientId: string): Promise<DashboardStats> {
        return await this.clientRepository.getDashboardStats(clientId);
    }
}
