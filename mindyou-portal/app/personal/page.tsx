import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/auth/portal-placeholder";

export const metadata: Metadata = {
  title: "Personal Portal | Mind You",
};

export default function Page() {
  return <PortalPlaceholder type="personal" />;
}
