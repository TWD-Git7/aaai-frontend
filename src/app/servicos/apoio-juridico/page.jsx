import ServiceLayout from "@/components/services/ServiceLayout";
import apoioJuridico from "@/data/services/apoio-juridico";
import { generateSEO } from "@/lib/seo";

export default function Page() {
  return <ServiceLayout {...apoioJuridico} />;
}