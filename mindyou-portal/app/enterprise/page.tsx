import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/auth/portal-placeholder";

export const metadata: Metadata = {
  title: "Enterprise Portal | Mind You",
};

export default function Page() {
  return <PortalPlaceholder type="enterprise" />;
}
