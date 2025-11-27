import Link from "next/link";

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

interface StrapiResponse {
  data: Article[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

async function getArticles(): Promise<StrapiResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*&sort=publishedAt:desc`,
      {
        next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch articles:", res.status);
      return { data: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { data: [] };
  }
}

export default async function Home() {
  const { data: articles } = await getArticles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HowToHelp Blog
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">
            Guides and resources to make a difference
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-gray-200 mb-2">
              No Articles Yet
            </h2>
            <p className="text-slate-600 dark:text-gray-400 mb-4">
              Get started by creating your first article in the Strapi admin panel.
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Admin Panel
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-200 mb-8">
              Latest Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 mb-3">
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
                      {new Date(article.attributes.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.attributes.title}
                    </h3>

                    <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {article.attributes.description}
                    </p>

                    <Link
                      href={`/articles/${article.attributes.slug || article.id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:gap-2 transition-all"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
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

