import { notFound } from "next/navigation";

interface Article {
    id: number;
    attributes: {
        title: string;
        description: string;
        content: string;
        publishedAt: string;
        slug: string;
    };
}

interface ArticleResponse {
    data: Article[];
}

async function getArticle(slug: string): Promise<Article | null> {
    try {
        // Try fetching by slug first
        let res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
            {
                next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
            }
        );

        let data: ArticleResponse = await res.json();

        // If no article found by slug, try by ID
        if (!data.data || data.data.length === 0) {
            res = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles/${slug}?populate=*`,
                {
                    next: { revalidate: 60 },
                }
            );

            if (!res.ok) {
                return null;
            }

            const singleData = await res.json();
            return singleData.data || null;
        }

        return data.data[0] || null;
    } catch (error) {
        console.error("Error fetching article:", error);
        return null;
    }
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <a
                        href="/"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Blog
                    </a>
                </div>
            </header>

            {/* Article Content */}
            <main className="container mx-auto px-4 py-12">
                <article className="max-w-3xl mx-auto">
                    {/* Article Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 mb-4">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <time dateTime={article.attributes.publishedAt}>
                                {new Date(article.attributes.publishedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </time>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-gray-100 mb-4">
                            {article.attributes.title}
                        </h1>

                        {article.attributes.description && (
                            <p className="text-xl text-slate-600 dark:text-gray-400">
                                {article.attributes.description}
                            </p>
                        )}
                    </header>

                    {/* Article Body */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div
                            className="article-content bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-gray-700"
                            dangerouslySetInnerHTML={{ __html: article.attributes.content }}
                        />
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-20">
                <div className="container mx-auto px-4 py-6 text-center text-slate-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} HowToHelp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
