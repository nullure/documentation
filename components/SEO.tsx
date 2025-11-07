import Head from 'next/head'

interface SEOProps {
    title?: string
    description?: string
    canonical?: string
    ogImage?: string
    ogType?: 'website' | 'article'
    article?: {
        publishedTime?: string
        modifiedTime?: string
        author?: string
        section?: string
        tags?: string[]
    }
    noindex?: boolean
    structuredData?: object
}

export default function SEO({
    title = 'OpenMemory - Long-term Memory for AI Agents',
    description = 'Production-ready long-term memory system for AI agents. Multi-sector embeddings, intelligent decay, and graph-based knowledge retrieval. Deploy in minutes.',
    canonical = 'https://openmemory.ai',
    ogImage = 'https://openmemory.ai/og-image.png',
    ogType = 'website',
    article,
    noindex = false,
    structuredData
}: SEOProps) {
    const fullTitle = title.includes('OpenMemory') ? title : `${title} | OpenMemory`

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="OpenMemory" />
            <meta property="og:locale" content="en_US" />

            {/* Article Meta Tags */}
            {article && (
                <>
                    {article.publishedTime && (
                        <meta property="article:published_time" content={article.publishedTime} />
                    )}
                    {article.modifiedTime && (
                        <meta property="article:modified_time" content={article.modifiedTime} />
                    )}
                    {article.author && (
                        <meta property="article:author" content={article.author} />
                    )}
                    {article.section && (
                        <meta property="article:section" content={article.section} />
                    )}
                    {article.tags && article.tags.map(tag => (
                        <meta key={tag} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:creator" content="@openmemory" />
            <meta name="twitter:site" content="@openmemory" />

            {/* Additional SEO Meta Tags */}
            <meta name="keywords" content="AI memory, long-term memory, AI agents, vector database, embeddings, hierarchical memory, RAG, retrieval augmented generation, semantic search, knowledge graph, autonomous agents, LLM memory, chatbot memory" />
            <meta name="author" content="OpenMemory Team" />
            <meta name="publisher" content="OpenMemory" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="distribution" content="global" />
            <meta name="rating" content="general" />

            {/* Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="format-detection" content="telephone=no" />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
        </Head>
    )
}

// Helper function to generate structured data for organization
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "OpenMemory",
        "url": "https://openmemory.ai",
        "logo": "https://openmemory.ai/logo.png",
        "description": "Production-ready long-term memory system for AI agents",
        "sameAs": [
            "https://twitter.com/openmemory",
            "https://github.com/openmemory",
            "https://linkedin.com/company/openmemory"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "support@openmemory.ai"
        }
    }
}

// Helper function to generate structured data for software application
export function generateSoftwareSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "OpenMemory",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Cross-platform",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
        },
        "description": "Production-ready long-term memory system for AI agents with multi-sector embeddings, intelligent decay, and graph-based knowledge retrieval"
    }
}

// Helper function to generate breadcrumb structured data
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    }
}

// Helper function for article structured data
export function generateArticleSchema(article: {
    headline: string
    description: string
    author: string
    datePublished: string
    dateModified?: string
    image?: string
    url: string
}) {
    return {
        "@context": "https://schema.org",
        "@type": "TechnicalArticle",
        "headline": article.headline,
        "description": article.description,
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "datePublished": article.datePublished,
        "dateModified": article.dateModified || article.datePublished,
        "image": article.image || "https://openmemory.ai/og-image.png",
        "url": article.url,
        "publisher": {
            "@type": "Organization",
            "name": "OpenMemory",
            "logo": {
                "@type": "ImageObject",
                "url": "https://openmemory.ai/logo.png"
            }
        }
    }
}
