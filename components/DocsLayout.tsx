import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface NavItem {
    title: string
    href: string
    children?: NavItem[]
}

const navigation: NavItem[] = [
    {
        title: 'Introduction',
        href: '/docs/introduction',
        children: [
            { title: 'What is OpenMemory', href: '/docs/introduction' },
            { title: 'Standalone vs Backend', href: '/docs/standalone' },
        ]
    },
    {
        title: 'Getting Started',
        href: '/docs/getting-started',
        children: [
            { title: 'Install', href: '/docs/installation' },
            { title: 'Quick Start (Standalone)', href: '/docs/quick-start' },
            { title: 'Quick Start (Backend)', href: '/docs/quick-start-backend' },
        ]
    },
    {
        title: 'SDKs',
        href: '/docs/sdks',
        children: [
            { title: 'JavaScript', href: '/docs/sdks/javascript' },
            { title: 'Python', href: '/docs/sdks/python' },
        ]
    },
    {
        title: 'API Reference',
        href: '/docs/api',
        children: [
            { title: 'API Routes', href: '/docs/api/routes' },
            { title: 'Add Memory', href: '/docs/api/add-memory' },
            { title: 'Query Memory', href: '/docs/api/query' },
        ]
    },
    {
        title: 'Core Concepts',
        href: '/docs/concepts',
        children: [
            { title: 'Sectors', href: '/docs/concepts/sectors' },
            { title: 'Decay', href: '/docs/concepts/decay' },
            { title: 'Salience', href: '/docs/concepts/salience' },
            { title: 'Associations', href: '/docs/concepts/associations' },
            { title: 'Temporal Graph', href: '/docs/concepts/temporal-graph' },
        ]
    },
    {
        title: 'Advanced',
        href: '/docs/advanced',
        children: [
            { title: 'Embeddings', href: '/docs/advanced/embedding-modes' },
            { title: 'Ingestion', href: '/docs/advanced/ingestion' },
            { title: 'MCP Server', href: '/docs/integrations/mcp' },
            { title: 'LangGraph Mode', href: '/docs/advanced/langgraph' },
        ]
    },
    {
        title: 'Examples',
        href: '/docs/examples',
        children: [
            { title: 'Agents', href: '/docs/examples/agents' },
            { title: 'Claude Desktop', href: '/docs/examples/claude' },
            { title: 'Python Chatbot', href: '/docs/examples/python-chatbot' },
            { title: 'Node.js Assistant', href: '/docs/examples/nodejs-assistant' },
        ]
    },
    {
        title: 'Deployment',
        href: '/docs/deployment',
        children: [
            { title: 'Backend Setup', href: '/docs/deployment/backend' },
            { title: 'Docker', href: '/docs/deployment/docker' },
            { title: 'Vercel / Railway', href: '/docs/deployment/cloud' },
        ]
    },
    {
        title: 'Migration',
        href: '/docs/migration',
        children: [
            { title: 'From Mem0', href: '/docs/migration/mem0' },
            { title: 'From Supermemory', href: '/docs/migration/supermemory' },
            { title: 'From Zep', href: '/docs/migration/zep' },
        ]
    },
]

interface LayoutProps {
    children: ReactNode
}

export default function DocsLayout({ children }: LayoutProps) {
    const router = useRouter()

    const isActive = (href: string) => {
        return router.pathname === href || router.pathname.startsWith(href + '/')
    }

    const isSectionActive = (section: NavItem) => {
        if (section.children) {
            return section.children.some(child => isActive(child.href))
        }
        return isActive(section.href)
    }

    return (
        <div className="min-h-screen bg-black text-gray-100">
            <div className="bg-gradient-radial"></div>
            {/* Header */}
            <header className="sticky top-0 z-50 navbar-glass">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <span className="text-lg font-semibold text-white">OpenMemory</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/3">
                            Home
                        </Link>
                        <Link href="/docs/introduction" className="px-3 py-2 text-sm font-medium text-primary-400 transition-colors rounded-md">
                            Docs
                        </Link>
                        <a
                            href="https://github.com/caviraoss/openmemory"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex gap-8 lg:gap-12">
                    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-4">
                        <nav className="space-y-8">
                            {navigation.map((section) => (
                                <div key={section.href}>
                                    <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 px-3 transition-colors ${isSectionActive(section)
                                        ? 'text-primary-400'
                                        : 'text-gray-600'
                                        }`}>
                                        {section.title}
                                    </h3>
                                    {section.children && (
                                        <ul className="space-y-1">
                                            {section.children.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${isActive(item.href)
                                                            ? 'bg-primary-500/10 text-primary-100 border-l-2 border-primary-400 pl-2.5 font-semibold'
                                                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/3'
                                                            }`}
                                                    >
                                                        {isActive(item.href) && (
                                                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-500 rounded-r-full"></span>
                                                        )}
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1 min-w-0 py-8 max-w-4xl">
                        <article className="prose prose-lg max-w-none">
                            <div className="p-8 lg:p-12 rounded-2xl">
                                {children}
                            </div>
                        </article>

                        <div className="mt-12 pt-6 border-t border-dark-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500">
                                <div>
                                    © 2025 OpenMemory · MIT License
                                </div>
                                <div className="flex space-x-6">
                                    <a href="https://github.com/caviraoss/openmemory/issues" className="hover:text-primary-400 transition-colors">
                                        Report Issue
                                    </a>
                                    <a href="https://github.com/caviraoss/openmemory" className="hover:text-primary-400 transition-colors">
                                        Edit on GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
