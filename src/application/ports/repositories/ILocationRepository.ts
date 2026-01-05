import { SavedLocation } from '../../../domain/entities/SavedLocation';

export interface ILocationRepository {
  getSavedLocations(clienteId: string): Promise<SavedLocation[]>;
  saveLocation(location: Omit<SavedLocation, 'id'>): Promise<SavedLocation>;
  deleteLocation(locationId: string): Promise<void>;
  updateLocation(location: SavedLocation): Promise<void>;
}