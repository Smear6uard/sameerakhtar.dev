import { Link as TanStackLink } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type AnchorAttrs = Omit<ComponentProps<"a">, "href" | "ref">;

interface LinkProps extends AnchorAttrs {
  href: string;
  children: ReactNode;
}

const EXTERNAL_RE = /^(https?:|mailto:|tel:)/i;

export function Link({ href, children, ...rest }: LinkProps) {
  if (EXTERNAL_RE.test(href) || href.endsWith(".pdf")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  const [pathPart, hashPart] = href.split("#");
  const to = pathPart || "/";

  return (
    <TanStackLink to={to} hash={hashPart} {...(rest as ComponentProps<typeof TanStackLink>)}>
      {children}
    </TanStackLink>
  );
}
