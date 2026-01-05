import { ILocationRepository } from '../../ports/repositories/ILocationRepository';

export class DeleteLocationUseCase {
  constructor(private locationRepository: ILocationRepository) { }

  async execute(locationId: string): Promise<void> {
    return this.locationRepository.deleteLocation(locationId);
  }
}