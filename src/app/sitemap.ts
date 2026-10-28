import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://apoioimigrantes.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servicos`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contactos`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/atendimento`,
      lastModified: new Date(),
    },

    // Serviços
    {
      url: `${baseUrl}/servicos/vistos`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servicos/traducoes`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servicos/apoio-juridico`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servicos/reagrupamento-familiar`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servicos/consultoria-migratoria`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servicos/emprego-integracao`,
      lastModified: new Date(),
    },
  ];
}