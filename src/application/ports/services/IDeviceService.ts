export type BehaviorType = 'MEDICAL' | 'DANGER' | 'FIRE' | 'TRAFFIC' | 'PREVENTIVE';

export interface IDeviceService {
    triggerBehavior(type: BehaviorType): Promise<void>;
    stopBehaviors(): Promise<void>;
}
