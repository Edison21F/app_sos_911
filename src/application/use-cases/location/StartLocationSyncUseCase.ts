import { ILocationService } from '../../ports/services/ILocationService';

export class StartLocationSyncUseCase {
    constructor(private locationService: ILocationService) { }

    async execute(userId: string): Promise<void> {
        return this.locationService.startLocationSync(userId);
    }
}
