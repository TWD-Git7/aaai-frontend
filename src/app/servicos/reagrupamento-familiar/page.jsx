import ServiceLayout from "@/components/services/ServiceLayout";
import reagrupamentoFamiliar from "@/data/services/reagrupamento-familiar";
import { generateSEO } from "@/lib/seo";

export default function Page() {
  return <ServiceLayout {...reagrupamentoFamiliar} />;
}