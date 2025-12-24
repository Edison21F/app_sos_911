import { IAuthRepository, LoginCredentials } from '../../ports/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';

export class LoginUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(credentials: LoginCredentials): Promise<User> {
        // Here we could add domain validation logic if needed
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }
        return this.authRepository.login(credentials);
    }
}
