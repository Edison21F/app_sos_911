import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { AppContent } from '../../domain/entities/AppContent';

// Hardcoded content as fallback
const HARDCODED_APP_CONTENT: AppContent = {
  gradientStart: '#2b0505',
  gradientEnd: '#0f0f0f',
  fontFamily: 'System',
  mainTitle: 'Un toque para tu seguridad',
  sections: [
    {
      key: 'howItWorks',
      title: 'Cómo Funciona',
      content: 'Presiona el botón de pánico 3 veces para enviar una alerta instantánea a nuestra central, a la comunidad cercana y a tus contactos de emergencia.'
    },
    {
      key: 'mission',
      title: 'Nuestra Misión',
      content: 'Proporcionar una herramienta de respuesta rápida que conecte a personas en emergencia con ayuda inmediata, fortaleciendo la seguridad y la colaboración ciudadana a través de la tecnología.'
    },
    {
      key: 'vision',
      title: 'Nuestra Visión',
      content: 'Ser la plataforma de seguridad colaborativa líder, creando vecindarios más seguros y resilientes donde cada miembro de la comunidad se sienta protegido y respaldado en todo momento.'
    }
  ]
};

export const useInformationViewModel = () => {
  const [content, setContent] = useState<AppContent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      setLoading(true);
      const appContent = await container.getAppContentUseCase.execute();
      // Validate that the response has the required structure
      if (appContent && appContent.sections && Array.isArray(appContent.sections)) {
        setContent(appContent);
      } else {
        console.warn('API returned invalid content structure, using fallback');
        setContent(HARDCODED_APP_CONTENT);
      }
    } catch (error) {
      console.error('Error loading app content:', error);
      // Fallback to hardcoded content
      setContent(HARDCODED_APP_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return {
    content,
    loading,
    isLoaded: !loading && !!content
  };
};