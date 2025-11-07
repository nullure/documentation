import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Favicon and Icons */}
                <link rel="icon" href="/icon.png" />
                <link rel="apple-touch-icon" href="/icon.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
                <link rel="manifest" href="/site.webmanifest" />

                {/* SEO Meta Tags */}
                <meta name="theme-color" content="#8b5cf6" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <meta name="bingbot" content="index, follow" />

                {/* Preconnect for Performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

                {/* Canonical URL - will be overridden per page */}
                <link rel="canonical" href="https://openmemory.ai" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
