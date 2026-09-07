import type { ReactNode } from "react";
import { isMasterEnabled } from "@/lib/master-access";
import { notFound } from "next/navigation";

export default function MasterLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isMasterEnabled()) notFound();
  return children;
}
