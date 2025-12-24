import { IAuthRepository } from '../../ports/repositories/IAuthRepository';

export class LogoutUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(): Promise<void> {
        return this.authRepository.logout();
    }
}
