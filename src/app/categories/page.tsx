import Link from "next/link";
import Layout from "../../components/Layout";

interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
}

interface StrapiResponse {
    data: Category[];
}

async function getCategories(): Promise<StrapiResponse> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/categories?sort=name:asc`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch categories:", res.status);
            return { data: [] };
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { data: [] };
    }
}

export default async function CategoriesPage() {
    const { data: categories } = await getCategories();

    return (
        <Layout>
            {/* Header */}
            <section className="bg-paper py-16 px-6 border-b-2 border-ink/10">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-ink mb-4">
                        Explore Our <span className="text-primary">Topics</span>
                    </h1>
                    <p className="text-xl text-ink/70 max-w-2xl mx-auto">
                        Discover actionable guides and inspiring stories across different areas of community impact.
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    {categories.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group"
                                >
                                    <div
                                        className="bg-paper border-2 border-ink rounded-2xl p-8 shadow-[shadow-sketch] hover:shadow-[shadow-sketchHover] hover:-translate-y-1 transition-all h-full"
                                        style={{ borderLeftWidth: '8px', borderLeftColor: category.color }}
                                    >
                                        {/* Icon */}
                                        <div
                                            className="w-16 h-16 rounded-xl border-2 border-ink flex items-center justify-center mb-6 text-4xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            {category.icon}
                                        </div>

                                        {/* Content */}
                                        <h2 className="text-2xl font-bold text-ink mb-3 group-hover:text-primary transition-colors">
                                            {category.name}
                                        </h2>
                                        <p className="text-ink/70 leading-relaxed">
                                            {category.description || `Explore articles about ${category.name.toLowerCase()}`}
                                        </p>

                                        {/* Arrow */}
                                        <div className="mt-6 flex items-center gap-2 font-bold text-primary group-hover:gap-4 transition-all">
                                            View Articles
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-ink/60">
                            <p className="text-xl">No categories yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
