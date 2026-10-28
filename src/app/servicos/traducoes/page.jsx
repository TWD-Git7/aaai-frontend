import ServiceLayout from "@/components/services/ServiceLayout";
import traducoes from "@/data/services/traducoes";
import { generateSEO } from "@/lib/seo";

export default function Page() {
  return <ServiceLayout {...traducoes} />;
}