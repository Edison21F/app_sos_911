import { IAuthRepository } from '../../ports/repositories/IAuthRepository';

export class GetCsrfTokenUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(): Promise<string | null> {
        return this.authRepository.getCsrfToken();
    }
}
