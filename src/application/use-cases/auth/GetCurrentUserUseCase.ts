import { IAuthRepository } from '../../ports/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';

export class GetCurrentUserUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(): Promise<User | null> {
        return this.authRepository.getCurrentUser();
    }
}
