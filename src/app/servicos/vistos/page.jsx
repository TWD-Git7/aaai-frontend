import ServiceLayout from "@/components/services/ServiceLayout";
import vistos from "@/data/services/vistos";
import { generateSEO } from "@/lib/seo";

export const metadata = {
  title: `${vistos.title} | AAAI`,
  description: vistos.subtitle,
  openGraph: {
    title: vistos.title,
    description: vistos.subtitle,
    images: [
      {
        url: `https://api.satori.vercel.app/og?title=${encodeURIComponent(vistos.title)}`,
      },
    ],
  },
};

export default function Page() {
  return <ServiceLayout {...vistos} />;
}
