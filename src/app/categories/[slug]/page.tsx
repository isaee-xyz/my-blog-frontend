import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Layout from "../../../components/Layout";

interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string;
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
    publishedAt: string;
    slug: string;
    readTime: number;
    category?: Category;
    tags?: Tag[];
}

interface ArticleResponse {
    data: Article[];
}

interface CategoryResponse {
    data: Category[];
}

async function getCategory(slug: string): Promise<Category | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/categories?filters[slug][$eq]=${slug}`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) return null;

        const data: CategoryResponse = await res.json();
        return data.data[0] || null;
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
}

async function getArticlesByCategory(slug: string): Promise<Article[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[category][slug][$eq]=${slug}&populate[0]=category&populate[1]=tags&sort=publishedAt:desc`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) return [];

        const data: ArticleResponse = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        return {
            title: "Category Not Found",
        };
    }

    return {
        title: category.name,
        description: category.description || `Articles about ${category.name}`,
        openGraph: {
            title: category.name,
            description: category.description || `Articles about ${category.name}`,
            type: "website",
        },
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const articles = await getArticlesByCategory(slug);

    return (
        <Layout>
            {/* Category Header */}
            <section
                className="py-16 px-6 border-b-2 border-ink relative overflow-hidden"
                style={{ backgroundColor: `${category.color}20` }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ backgroundColor: category.color }}></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/categories" className="inline-flex items-center gap-2 text-ink/60 hover:text-ink mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Topics
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="w-20 h-20 rounded-2xl border-2 border-ink flex items-center justify-center text-5xl bg-white shadow-[shadow-sketch]"
                            style={{ backgroundColor: `${category.color}30` }}
                        >
                            {category.icon}
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-ink">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="text-xl text-ink/70 mt-2">{category.description}</p>
                            )}
                        </div>
                    </div>

                    <p className="text-ink/60 mt-4">
                        {articles.length} {articles.length === 1 ? 'article' : 'articles'} available
                    </p>
                </div>
            </section>

            {/* Articles List */}
            <section className="py-20 px-6 bg-paper">
                <div className="max-w-6xl mx-auto">
                    {articles.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/articles/${article.slug || article.id}`}
                                    className="group"
                                >
                                    <div className="bg-white border-2 border-ink rounded-xl p-6 shadow-[shadow-sketch] hover:shadow-[shadow-sketchHover] hover:-translate-y-1 transition-all h-full flex flex-col">
                                        {/* Tags */}
                                        {article.tags && article.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {article.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="px-2 py-1 bg-secondary/20 text-secondary border border-secondary rounded-md text-xs font-bold uppercase"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h2 className="text-2xl font-bold text-ink mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-ink/70 mb-4 line-clamp-3 flex-grow">
                                            {article.excerpt || article.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-sm text-ink/60 pt-4 border-t border-ink/10">
                                            <span>{article.readTime || 5} min read</span>
                                            <span>•</span>
                                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">{category.icon}</div>
                            <h3 className="text-2xl font-bold text-ink mb-2">No articles yet</h3>
                            <p className="text-ink/60">Check back soon for content about {category.name.toLowerCase()}!</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
