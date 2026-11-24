import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const legacyRoutes = {
  '/agendamento': '/agendar',
  '/atendimento': '/agendar',
  '/consulta': '/consultar-processo',
  '/guia-dire-vistos': '/guia',
  '/sobrenos': '/sobre',
};

const config: NextConfig = {
  async redirects() {
    return Object.entries(legacyRoutes).map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(config);
