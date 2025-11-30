import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
}

interface Tag {
    id: number;
    documentId: string;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    documentId: string;
    title: string;
    description: string;
    excerpt: string;
    content: string;
    publishedAt: string;
    slug: string;
    readTime: number;
    author: string;
    category?: Category;
    tags?: Tag[];
    featuredImage?: {
        url: string;
        alternativeText?: string;
    };
}

interface ArticleResponse {
    data: Article[];
}

async function getArticle(slug: string): Promise<Article | null> {
    try {
        // Try fetching by slug first
        let res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[slug][$eq]=${slug}&populate[0]=category&populate[1]=tags&populate[2]=featuredImage`,
            {
                next: { revalidate: 60 },
            }
        );

        let data: ArticleResponse = await res.json();

        // If no article found by slug, try by ID
        if (!data.data || data.data.length === 0) {
            res = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles/${slug}?populate[0]=category&populate[1]=tags&populate[2]=featuredImage`,
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

async function getRelatedArticles(categorySlug?: string, currentArticleId?: number): Promise<Article[]> {
    if (!categorySlug) return [];

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[category][slug][$eq]=${categorySlug}&populate[0]=category&sort=publishedAt:desc&pagination[limit]=3`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) return [];

        const data: ArticleResponse = await res.json();
        // Filter out the current article
        return data.data.filter(article => article.id !== currentArticleId);
    } catch (error) {
        console.error("Error fetching related articles:", error);
        return [];
    }
}



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return {
            title: "Article Not Found",
        };
    }

    const imageUrl = article.featuredImage?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${article.featuredImage.url}`
        : "https://howtohelp.in/logo.png";

    return {
        title: article.title,
        description: article.description || article.excerpt,
        openGraph: {
            title: article.title,
            description: article.description || article.excerpt,
            type: "article",
            publishedTime: article.publishedAt,
            authors: [article.author || "HowToHelp"],
            tags: article.tags?.map(t => t.name),
            images: [imageUrl],
        },
    };
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

    const relatedArticles = await getRelatedArticles(article.category?.slug, article.id);

    return (
        <Layout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: article.title,
                        description: article.description || article.excerpt,
                        author: {
                            "@type": "Person",
                            name: article.author || "HowToHelp",
                        },
                        datePublished: article.publishedAt,
                        dateModified: article.publishedAt,
                        image: [article.featuredImage?.url
                            ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${article.featuredImage.url}`
                            : "https://howtohelp.in/logo.png"],
                    }),
                }}
            />
            {/* Article Header */}
            <article className="bg-paper border-b-2 border-ink/10">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-ink/60 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>→</span>
                        {article.category && (
                            <>
                                <Link href={`/categories/${article.category.slug}`} className="hover:text-primary transition-colors">
                                    {article.category.icon} {article.category.name}
                                </Link>
                                <span>→</span>
                            </>
                        )}
                        <span className="text-ink">Article</span>
                    </div>

                    {/* Category Badge */}
                    {article.category && (
                        <Link
                            href={`/categories/${article.category.slug}`}
                            className="inline-block mb-4"
                        >
                            <span
                                className="px-4 py-2 rounded-lg border-2 border-ink font-bold uppercase text-sm tracking-wider hover:shadow-[shadow-sketch] transition-all inline-flex items-center gap-2"
                                style={{ backgroundColor: `${article.category.color}30`, color: article.category.color }}
                            >
                                <span className="text-xl">{article.category.icon}</span>
                                {article.category.name}
                            </span>
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 leading-tight">
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-2xl text-ink/70 mb-6 leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-ink/60 pb-6 border-b border-ink/10">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{article.author || 'Admin'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={article.publishedAt}>
                                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{article.readTime || 5} min read</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            {article.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 bg-white border-2 border-secondary text-secondary rounded-full text-sm font-bold uppercase tracking-wider"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>

            {/* Article Content */}
            <section className="py-12 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-ink
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-ink/80 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-ink prose-strong:font-bold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-ink/80 prose-li:mb-2
            prose-code:bg-paper prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary
            prose-pre:bg-ink prose-pre:text-paper prose-pre:p-6 prose-pre:rounded-xl prose-pre:border-2 prose-pre:border-ink
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-ink/70
            prose-img:rounded-xl prose-img:border-2 prose-img:border-ink prose-img:shadow-[shadow-sketch]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-20 px-6 bg-paper border-t-2 border-ink/10">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-ink mb-12 text-center">
                            Related Articles
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/articles/${relatedArticle.slug || relatedArticle.id}`}
                                    className="group"
                                >
                                    <div className="bg-white border-2 border-ink rounded-xl p-6 shadow-[shadow-sketch] hover:shadow-[shadow-sketchHover] hover:-translate-y-1 transition-all h-full">
                                        {relatedArticle.category && (
                                            <span className="text-xs font-bold text-ink/50 uppercase mb-2 block">
                                                {relatedArticle.category.icon} {relatedArticle.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {relatedArticle.title}
                                        </h3>
                                        <p className="text-ink/70 line-clamp-3">
                                            {relatedArticle.excerpt || relatedArticle.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}
