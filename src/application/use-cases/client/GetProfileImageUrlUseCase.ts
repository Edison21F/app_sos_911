import { IClientRepository } from '../../ports/repositories/IClientRepository';

/**
 * CAPA DE APLICACIÓN: Caso de Uso
 * 
 * RESPONSABILIDAD:
 * Construir la URL completa de la imagen de perfil del cliente.
 * 
 * FLUJO:
 * Presentation (ViewModel) → Este Caso de Uso → IClientRepository (Puerto)
 */
export class GetProfileImageUrlUseCase {
    constructor(private clientRepository: IClientRepository) { }

    /**
     * Ejecuta el caso de uso para obtener la URL de la imagen de perfil.
     * @param imagePath - Ruta o nombre de la imagen de perfil.
     * @returns string | null - URL completa de la imagen o null si no existe.
     */
    execute(imagePath: string | undefined): string | null {
        if (!imagePath) return null;
        return this.clientRepository.getProfileImageUrl(imagePath);
    }
}
