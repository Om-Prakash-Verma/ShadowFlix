import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
  children: ReactNode;
};

export function AppLink({ children, prefetch = false, ...props }: AppLinkProps) {
  return (
    <Link {...props} prefetch={prefetch}>
      {children}
    </Link>
  );
}