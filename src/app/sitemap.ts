import { MetadataRoute } from 'next';

const BASE_URL = 'https://howtohelp.in';

async function getArticles() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?fields[0]=slug&fields[1]=publishedAt&pagination[pageSize]=1000`, {
            next: { revalidate: 60 },
        });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Sitemap: Error fetching articles', error);
        return [];
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/categories?fields[0]=slug&pagination[pageSize]=1000`, {
            next: { revalidate: 60 },
        });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Sitemap: Error fetching categories', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = await getArticles();
    const categories = await getCategories();

    const articleEntries: MetadataRoute.Sitemap = articles.map((article: any) => ({
        url: `${BASE_URL}/articles/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
        url: `${BASE_URL}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...categoryEntries,
        ...articleEntries,
    ];
}
