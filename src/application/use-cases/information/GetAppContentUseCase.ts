import { IContentRepository } from '../../ports/repositories/IContentRepository';
import { AppContent } from '../../../domain/entities/AppContent';

export class GetAppContentUseCase {
  constructor(private contentRepository: IContentRepository) { }

  async execute(): Promise<AppContent> {
    return this.contentRepository.getAppContent();
  }
}