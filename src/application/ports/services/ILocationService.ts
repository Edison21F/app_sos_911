export interface LocationData {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
}

export interface ILocationService {
    startLocationSync(userId: string): Promise<void>;
    stopLocationSync(): Promise<void>;
    getCurrentLocation(): Promise<LocationData>;
}
