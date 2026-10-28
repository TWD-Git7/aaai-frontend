import ServiceLayout from "@/components/services/ServiceLayout";
import empregoIntegracao from "@/data/services/emprego-integracao";
import { generateSEO } from "@/lib/seo";

export default function Page() {
  return <ServiceLayout {...empregoIntegracao} />;
}