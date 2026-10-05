import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "药研悬案局";
const description =
  "七宗临床试验悬案：阅读证物，连接线索，击破证词，只有完整证据链才能结案。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const directHost = requestHeaders.get("host")?.split(",")[0].trim();
  const requestedHost = forwardedHost ?? directHost ?? "localhost:3000";
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(requestedHost)
    ? requestedHost
    : "localhost:3000";
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : host.startsWith("localhost")
        ? "http"
        : "https";
  const siteUrl = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", siteUrl).toString();

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: siteUrl,
      title,
      description,
      images: [
        {
          url: socialImage,
          width: 1731,
          height: 909,
          alt: "药研悬案局",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
