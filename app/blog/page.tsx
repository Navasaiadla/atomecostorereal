import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    id: 'sustainable-living-tips',
    title: '10 Simple Ways to Live More Sustainably',
    excerpt: 'Discover easy and practical tips to reduce your environmental impact and live a more eco-friendly lifestyle.',
    author: 'Eco Team',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Lifestyle',
    image: '/bags.png'
  },
  {
    id: 'plastic-free-kitchen',
    title: 'Creating a Plastic-Free Kitchen: A Complete Guide',
    excerpt: 'Transform your kitchen into a plastic-free zone with these essential swaps and sustainable alternatives.',
    author: 'Green Living',
    date: '2024-01-10',
    readTime: '8 min read',
    category: 'Home',
    image: '/cupsandspoons.png'
  },
  {
    id: 'supporting-local-artisans',
    title: 'Why Supporting Local Artisans Matters',
    excerpt: 'Learn about the importance of supporting local craftspeople and how it benefits both communities and the environment.',
    author: 'Community',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Community',
    image: '/tshirt.webp'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Sustainability Blog</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Stay informed about sustainable living, eco-friendly tips, and stories from our community of conscious consumers.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id}
                className="group"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-[#2B5219] text-white text-xs px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#2B5219] transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-4 flex items-center text-[#2B5219] font-medium text-sm">
                      Read More
                      <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Want to contribute to our blog?
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-[#2B5219] text-white px-8 py-3 rounded-lg hover:bg-[#1a3110] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 