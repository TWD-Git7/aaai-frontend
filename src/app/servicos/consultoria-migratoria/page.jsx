import ServiceLayout from "@/components/services/ServiceLayout";
import consultoriaMigratoria from "@/data/services/consultoria-migratoria";
import { generateSEO } from "@/lib/seo";

export default function Page() {
  return <ServiceLayout {...consultoriaMigratoria} />;
}