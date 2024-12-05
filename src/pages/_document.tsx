import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="relative antialiased">
        <div className="absolute inset-0 -z-50 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
