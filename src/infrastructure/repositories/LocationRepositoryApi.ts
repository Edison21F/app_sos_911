import { ILocationRepository } from '../../application/ports/repositories/ILocationRepository';
import { SavedLocation } from '../../domain/entities/SavedLocation';
import api from '../http/client';

export class LocationRepositoryApi implements ILocationRepository {
  async getSavedLocations(clienteId: string): Promise<SavedLocation[]> {
    console.log('LocationRepositoryApi: Fetching for clienteId:', clienteId);

    // 1. Obtener datos crudos
    const response = await api.get('/ubicaciones_clientes/listar');

    // 2. Mapear (Traducir) ANTES de filtrar
    // Convertimos de snake_case (Backend) a camelCase (Domain)
    const allLocations: SavedLocation[] = response.data.map((d: any) => ({
      id: d.id || d._id, // Ajusta según tu backend
      clienteId: (d.cliente_id || d.clienteId || '').toString(), // Clave: Convertir a String para comparar
      latitud: parseFloat(d.latitud),
      longitud: parseFloat(d.longitud),
      nombre: d.nombre, // <-- Mapeamos nombre
      marca_tiempo: d.marca_tiempo || d.createdAt,
      estado: d.estado || 'activo'
    }));

    // 3. Filtrar ahora que los datos están limpios
    const filtered = allLocations.filter(loc => loc.clienteId === clienteId);

    console.log(`Encontradas ${filtered.length} ubicaciones para el usuario ${clienteId}`);
    return filtered;
  }

  async saveLocation(location: Omit<SavedLocation, 'id'>): Promise<SavedLocation> {
    // A la inversa: Traducir de Domain a Backend
    const payload = {
      clienteId: location.clienteId, // Updated to camelCase for Hexagonal Backend
      latitud: location.latitud,
      longitud: location.longitud,
      nombre: location.nombre,
      marca_tiempo: location.marca_tiempo,
      estado: location.estado
    };

    const response = await api.post('/ubicaciones_clientes/crear', payload);
    return response.data;
  }

  async updateLocation(location: SavedLocation): Promise<void> {
    const payload = {
      latitud: location.latitud,
      longitud: location.longitud,
      nombre: location.nombre,
      marca_tiempo: location.marca_tiempo,
      estado: location.estado
    };
    await api.put(`/ubicaciones_clientes/actualizar/${location.id}`, payload);
  }

  async deleteLocation(locationId: string): Promise<void> {
    await api.delete(`/ubicaciones_clientes/eliminar/${locationId}`);
  }
}
