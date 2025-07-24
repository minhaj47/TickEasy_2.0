import Head from "next/head";

type SEOProps = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
};

export default function SEO({
  title,
  description = "TickEasy: Your Event Our Responsibility",
  image = "/tickeasy_logo_svg.svg",
  url = "https://event-grid-2-0.vercel.app",
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
