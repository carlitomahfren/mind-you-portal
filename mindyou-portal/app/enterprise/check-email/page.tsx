import type { Metadata } from "next";
import { CheckEmailView } from "@/components/auth/check-email-view";

export const metadata: Metadata = {
  title: "Check your email | Mind You",
};

export default function Page() {
  return <CheckEmailView type="enterprise" />;
}
