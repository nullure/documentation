import { GetStaticProps, GetStaticPaths } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import DocsLayout from '@/components/DocsLayout'
import SEO, { generateBreadcrumbSchema, generateArticleSchema } from '@/components/SEO'
import { getDocBySlug, getAllDocSlugs, DocMeta } from '@/lib/mdx'

interface DocPageProps {
    meta: DocMeta
    source: MDXRemoteSerializeResult
}

const components = {
    h1: (props: any) => <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-50 tracking-tight" {...props} />,
    h2: (props: any) => <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-4 text-gray-50 pb-2 border-b border-dark-700" {...props} />,
    h3: (props: any) => <h3 className="text-2xl md:text-3xl font-semibold mt-10 mb-3 text-gray-100" {...props} />,
    h4: (props: any) => <h4 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-gray-200" {...props} />,
    p: (props: any) => <p className="mb-5 text-gray-300 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-300" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300" {...props} />,
    li: (props: any) => <li className="text-gray-300 leading-relaxed" {...props} />,
    a: (props: any) => <a className="text-primary-400 hover:text-primary-300 font-medium transition-colors" {...props} />,
    code: (props: any) => {
        if (props.className) {
            return <code className={`${props.className} text-sm`} {...props} />
        }
        return <code className="px-2 py-1 bg-primary-500/15 text-primary-300 rounded border border-primary-500/25 text-sm font-mono" {...props} />
    },
    pre: (props: any) => (
        <pre className="bg-dark-850/60 border border-dark-700 rounded-lg p-4 overflow-x-auto mb-6" {...props} />
    ),
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-primary-500/40 pl-4 py-2 my-6 italic text-gray-400 bg-primary-500/5 rounded-r" {...props} />
    ),
    table: (props: any) => (
        <div className="overflow-x-auto mb-6 rounded-lg border border-dark-700">
            <table className="min-w-full divide-y divide-dark-700" {...props} />
        </div>
    ),
    thead: (props: any) => <thead className="bg-dark-800/30" {...props} />,
    tbody: (props: any) => <tbody className="divide-y divide-dark-700" {...props} />,
    tr: (props: any) => <tr className="hover:bg-dark-800/30" {...props} />,
    th: (props: any) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100" {...props} />,
    td: (props: any) => <td className="px-4 py-3 text-sm text-gray-300" {...props} />,
}

export default function DocPage({ meta, source }: DocPageProps) {
    // Generate breadcrumb items from slug
    const slugParts = typeof meta.slug === 'string' ? meta.slug.split('/') : []
    const breadcrumbItems = [
        { name: 'Home', url: 'https://openmemory.ai' },
        { name: 'Documentation', url: 'https://openmemory.ai/docs' },
        ...slugParts.map((part: string, index: number) => ({
            name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
            url: `https://openmemory.ai/docs/${slugParts.slice(0, index + 1).join('/')}`
        }))
    ]

    // Generate structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            generateBreadcrumbSchema(breadcrumbItems),
            generateArticleSchema({
                headline: String(meta.title),
                description: String(meta.description || ''),
                author: 'OpenMemory Team',
                datePublished: new Date().toISOString(),
                dateModified: new Date().toISOString(),
                url: `https://openmemory.ai/docs/${meta.slug}`
            })
        ]
    }

    const pageUrl = `https://openmemory.ai/docs/${meta.slug}`
    const pageTitle = `${String(meta.title)} - OpenMemory Documentation`
    const pageDescription = String(meta.description || `Learn about ${String(meta.title)} in OpenMemory's comprehensive documentation. Production-ready long-term memory for AI agents.`)

    return (
        <DocsLayout>
            <SEO
                title={pageTitle}
                description={pageDescription}
                canonical={pageUrl}
                ogType="article"
                ogImage="https://openmemory.ai/og-docs.png"
                article={{
                    publishedTime: new Date().toISOString(),
                    modifiedTime: new Date().toISOString(),
                    author: 'OpenMemory Team',
                    section: slugParts[0] ? slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1) : 'Documentation',
                    tags: slugParts.map((s: string) => s.replace(/-/g, ' '))
                }}
                structuredData={structuredData}
            />

            <div className="mb-8 pb-6 border-b border-dark-700">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-50 mb-4 tracking-tight">{String(meta.title)}</h1>
                {meta.description && (
                    <p className="text-lg text-gray-400 leading-relaxed">{String(meta.description)}</p>
                )}
            </div>

            <MDXRemote {...source} components={components} />
        </DocsLayout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = getAllDocSlugs()

    return {
        paths: slugs.map((slug) => ({
            params: { slug },
        })),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string[]

    if (!slug) {
        return { notFound: true }
    }

    const doc = await getDocBySlug(slug)

    if (!doc) {
        return { notFound: true }
    }

    return {
        props: {
            meta: doc.meta,
            source: doc.source,
        },
    }
}
