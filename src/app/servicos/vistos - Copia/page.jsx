import ServiceLayout from "@/components/services/ServiceLayout";
import vistos from "@/data/services/vistos";

export default function Page() {
  return <ServiceLayout {...vistos} />;
}