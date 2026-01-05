import { AppContent } from '../../../domain/entities/AppContent';

export interface IContentRepository {
  getAppContent(): Promise<AppContent>;
}