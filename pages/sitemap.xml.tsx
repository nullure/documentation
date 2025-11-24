import { GetServerSideProps } from 'next'
import fs from 'fs'
import path from 'path'

// This generates a sitemap.xml file dynamically
function generateSiteMap(pages: string[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages
            .map((page) => {
                return `    <url>
        <loc>https://openmemory.cavira.app${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${page === '/' ? 'daily' : 'weekly'}</changefreq>
        <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>`
            })
            .join('\n')}
</urlset>`
}

function getAllMarkdownFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
        const filePath = path.join(dirPath, file)
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllMarkdownFiles(filePath, arrayOfFiles)
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            arrayOfFiles.push(filePath)
        }
    })

    return arrayOfFiles
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const baseUrl = 'https://openmemory.cavira.app'

    // Static pages
    const staticPages = [
        '/',
    ]

    // Get all documentation pages from content directory
    const contentDir = path.join(process.cwd(), 'content')
    let docPages: string[] = []

    try {
        const markdownFiles = getAllMarkdownFiles(contentDir)
        docPages = markdownFiles.map((file) => {
            const relativePath = file
                .replace(contentDir, '')
                .replace(/\\/g, '/')
                .replace(/\.mdx?$/, '')
            return `/docs${relativePath}`
        })
    } catch (error) {
        console.error('Error reading content directory:', error)
    }

    // Combine all pages
    const allPages = [...staticPages, ...docPages]

    // Generate the XML sitemap
    const sitemap = generateSiteMap(allPages)

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
    res.write(sitemap)
    res.end()

    return {
        props: {},
    }
}

export default SiteMap
