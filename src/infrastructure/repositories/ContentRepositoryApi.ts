import { IContentRepository } from '../../application/ports/repositories/IContentRepository';
import { AppContent } from '../../domain/entities/AppContent';
import api from '../http/client';

export class ContentRepositoryApi implements IContentRepository {
  async getAppContent(): Promise<AppContent> {
    const response = await api.get('/contenido_app/obtener');
    return response.data;
  }
}