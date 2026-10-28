export function generateSEO({ title, description }) {
  return {
    title: `${title} | AAAI`,
    description,
    openGraph: {
      title: `${title} | AAAI`,
      description,
      type: "website",
    },
  };
}