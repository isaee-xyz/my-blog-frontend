import Link from "next/link";
import Layout from "../components/Layout";
import SketchyButton from "../components/SketchyButton";

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
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
  category?: Category;
}

interface StrapiResponse {
  data: Article[];
}

async function getArticles(): Promise<StrapiResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate[0]=category&sort=publishedAt:desc&pagination[limit]=5`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch articles:", res.status);
      return { data: [] };
    }

    const data = await res.json();
    console.log(`Fetched ${data.data?.length} articles`);
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { data: [] };
  }
}

const WORKSHOP_APPROACH = [
  {
    title: "Early Age Education",
    desc: "We believe in catching them young. By engaging students in their formative years, we instill a lifelong commitment to proactive citizenship."
  },
  {
    title: "School-Based Workshops",
    desc: "We bring impactful 6-hour workshops directly to classrooms, making vital knowledge accessible to all students."
  },
  {
    title: "Comprehensive Curriculum",
    desc: "Covering crucial topics from health and civic responsibility to environmental sustainability and personal safety."
  },
  {
    title: "Actionable Knowledge",
    desc: "We focus on practical skills and real-world applications, empowering students to take meaningful action."
  },
  {
    title: "Holistic Development",
    desc: "We foster a sense of responsibility towards oneself, society, and nature, encouraging students to become well-rounded individuals."
  }
];

export default async function Home() {
  const { data: articles } = await getArticles();
  const featuredPost = articles[0];
  const smallPosts = articles.slice(1, 5);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-paper py-20 px-6 border-b-2 border-ink/10 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/20 rounded-full blur-xl"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-block bg-secondary/30 px-4 py-1 rounded-full border border-secondary text-sm font-bold tracking-wide uppercase mb-2">
            Empowering Youth • Transforming Communities
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-ink">
            Planting Seeds of <span className="text-primary underline decoration-wavy decoration-secondary">Change</span>
          </h1>
          <p className="text-2xl md:text-3xl text-ink/80 max-w-2xl mx-auto font-medium">
            We believe in catching them young. Instilling a lifelong commitment to proactive citizenship.
          </p>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-ink">Our Approach</h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WORKSHOP_APPROACH.map((item, index) => (
              <div key={index} className="bg-paper p-8 border-2 border-ink rounded-2xl shadow-[shadow-sketch] hover:-translate-y-1 hover:shadow-[shadow-sketchHover] transition-all group">
                <div className="w-14 h-14 bg-white rounded-xl border-2 border-ink flex items-center justify-center mb-6 text-2xl font-bold text-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-ink">{item.title}</h3>
                <p className="text-lg leading-relaxed opacity-80 text-ink">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-20 px-6 bg-paper border-t-2 border-ink/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-ink">Impact Stories & Guides</h2>
              <p className="text-xl opacity-70 text-ink">Knowledge is the foundation of empowerment.</p>
            </div>
            <Link href="/categories">
              <SketchyButton variant="secondary">View Library</SketchyButton>
            </Link>
          </div>

          {articles.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Big Featured Post */}
              {featuredPost && (
                <div className="lg:col-span-2 group cursor-pointer">
                  <Link href={`/articles/${featuredPost.slug || featuredPost.id}`}>
                    <div className="border-2 border-ink rounded-xl overflow-hidden shadow-[shadow-sketch] h-full bg-white hover:shadow-[shadow-sketchHover] transition-all relative">
                      <div className="absolute top-4 left-4 z-10 bg-accent text-ink px-3 py-1 rounded-md border border-ink text-sm font-bold shadow-sm uppercase tracking-wider">
                        Featured
                      </div>
                      <div className="p-8">
                        {featuredPost.category && (
                          <span className="text-primary font-bold text-sm uppercase tracking-wider">
                            {featuredPost.category.icon} {featuredPost.category.name}
                          </span>
                        )}
                        <h3 className="text-3xl font-bold mt-2 mb-4 group-hover:text-primary transition-colors leading-tight text-ink">
                          {featuredPost.title}
                        </h3>
                        <p className="text-xl opacity-80 mb-6 text-ink">
                          {featuredPost.excerpt || featuredPost.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-ink/60">
                          <span>{featuredPost.readTime || 5} min read</span>
                          <span>•</span>
                          <span>{featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Small Posts List */}
              <div className="flex flex-col gap-6">
                {smallPosts.map((post) => (
                  <Link href={`/articles/${post.slug || post.id}`} key={post.id} className="flex-1 group">
                    <div className="bg-white border-2 border-ink rounded-xl p-5 shadow-[shadow-sketch] hover:shadow-[shadow-sketchHover] hover:translate-x-1 transition-all h-full flex flex-col justify-center border-l-8 border-l-secondary">
                      {post.category && (
                        <span className="text-xs font-bold text-ink/50 uppercase mb-1">
                          {post.category.icon} {post.category.name}
                        </span>
                      )}
                      <h4 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors text-ink">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-ink/60">
              <p className="text-xl">No articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-primary text-white border-t-2 border-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-6 backdrop-blur-sm border border-white/30">
            <span className="text-5xl">❤️</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-md">
            Ready to Make a Difference?
          </h2>
          <p className="text-2xl mb-10 font-medium max-w-2xl mx-auto opacity-90">
            Whether you want to bring a workshop to your school or volunteer your time, we'd love to hear from you.
          </p>
        </div>
      </section>
    </Layout>
  );
}
