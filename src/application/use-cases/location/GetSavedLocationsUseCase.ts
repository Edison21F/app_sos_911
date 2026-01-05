import { ILocationRepository } from '../../ports/repositories/ILocationRepository';
import { SavedLocation } from '../../../domain/entities/SavedLocation';

export class GetSavedLocationsUseCase {
  constructor(private locationRepository: ILocationRepository) { }

  async execute(clienteId: string): Promise<SavedLocation[]> {
    return this.locationRepository.getSavedLocations(clienteId);
  }
}