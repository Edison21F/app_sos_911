import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class RespondToContactRequestUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(requestId: number, response: 'ACEPTAR' | 'RECHAZAR'): Promise<void> {
        await this.contactRepository.respondToRequest(requestId, response);
    }
}
