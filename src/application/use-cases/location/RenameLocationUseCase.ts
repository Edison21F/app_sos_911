import { ILocationRepository } from '../../ports/repositories/ILocationRepository';
import { SavedLocation } from '../../../domain/entities/SavedLocation';

export class RenameLocationUseCase {
  constructor(private locationRepository: ILocationRepository) { }

  async execute(location: SavedLocation, newName: string): Promise<void> {
    const updatedLocation = { ...location, nombre: newName };
    return this.locationRepository.updateLocation(updatedLocation);
  }
}
