import { ILocationRepository } from '../../ports/repositories/ILocationRepository';
import { SavedLocation } from '../../../domain/entities/SavedLocation';

export class SaveLocationUseCase {
  constructor(private locationRepository: ILocationRepository) { }

  async execute(location: Omit<SavedLocation, 'id'>): Promise<SavedLocation> {
    return this.locationRepository.saveLocation(location);
  }
}