import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/300-italic.css";
import "@fontsource/hanken-grotesk/600.css";
import "@fontsource/hanken-grotesk/700.css";
import "@fontsource/bricolage-grotesque/400.css";
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/caveat/400.css";
import { CLIENTS, getClient } from "@/content/clients";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Collage } from "@/components/case/Collage";
import { Fiche } from "@/components/case/Fiche";
import { Branding } from "@/components/case/Branding";
import { Charte } from "@/components/case/Charte";
import { BrandCheckGame } from "@/components/case/BrandCheckGame";

export const dynamicParams = false;

export function generateStaticParams() {
  return CLIENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getClient(slug);
  if (!c) return {};
  return { title: `${c.name} · Studio Rayas`, description: `${c.name} : ${c.sector}. Branding, charte graphique et Brand OS par Studio Rayas.` };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) notFound();
  const i = CLIENTS.findIndex((c) => c.slug === client.slug);
  const next = CLIENTS[(i + 1) % CLIENTS.length];

  return (
    <main>
      <div className="case-top">
        <SiteHeader />
        <Collage client={client} />
        <Fiche client={client} />
      </div>
      <Branding client={client} />
      <Charte client={client} />
      <BrandCheckGame client={client} />
      <section className="section">
        <div className="container">
          <Link href={`/travaux/${next.slug}/`} className="next-case">
            <span className="sr-eyebrow">Cas suivant</span>
            <span>{next.name} →</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
      <SmoothScroll />
    </main>
  );
}
