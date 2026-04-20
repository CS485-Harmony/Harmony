// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)

export interface OpenGraphTags {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;
}

export interface TwitterCardTags {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author?: object;
  datePublished?: string;
  dateModified?: string;
  mainEntity?: object;
  breadcrumb?: object;
}

export interface MetaTagSet {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: OpenGraphTags;
  twitter: TwitterCardTags;
  structuredData: StructuredData;
  keywords: string[];
  needsRegeneration?: boolean;
}

export interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  sentiment: string;
  readingLevel: string;
}

export interface IMetaTagGenerator {
  generate(): MetaTagSet;
  validate(): boolean;
}

export interface ChannelContext {
  id: string;
  name: string;
  slug: string;
  topic?: string | null;
  serverName: string;
  serverSlug: string;
  canonicalUrl: string;
}

export interface MessageContext {
  content: string;
  createdAt: Date;
  authorDisplayName?: string;
}
