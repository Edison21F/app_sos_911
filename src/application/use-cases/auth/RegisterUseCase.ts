import { IAuthRepository, RegisterData } from '../../ports/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';

export class RegisterUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(data: RegisterData): Promise<User> {
        return this.authRepository.register(data);
    }
}
