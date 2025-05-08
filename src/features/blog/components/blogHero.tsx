"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface BlogHeroProps {
  title: string;
  /** e.g. [{ href: "/blog", label: "Blog" }, …] */
  breadcrumb?: { href: string; label: string }[];
  render?: ReactNode;
}

export function BlogHero({ title, breadcrumb, render }: BlogHeroProps) {
  const pathname = usePathname();
  
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => ({
      href: '/' + array.slice(0, index + 1).join('/'),
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    }));

  const combinedBreadcrumb = breadcrumb || pathSegments;

  return (
    <header className="w-full bg-gradient-to-br from-primary to-primary/5 py-10 px-8 text-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-16">
        {combinedBreadcrumb.length > 0 && (
          <nav className="mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                {combinedBreadcrumb.map((item, i) => (
                  <React.Fragment key={i}>
                    <BreadcrumbItem>
                      {item.href === pathname ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>
        )}
        <h1 className="text-4xl font-extrabold leading-tight mb-4">{title}</h1>
        {render && <div className="mt-8">{render}</div>}
      </div>
    </header>
  );
}
