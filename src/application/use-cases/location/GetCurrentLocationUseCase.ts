import { ILocationService, LocationData } from '../../ports/services/ILocationService';

export class GetCurrentLocationUseCase {
    constructor(private locationService: ILocationService) { }

    async execute(): Promise<LocationData> {
        return await this.locationService.getCurrentLocation();
    }
}
