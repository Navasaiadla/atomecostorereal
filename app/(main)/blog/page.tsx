import Image from 'next/image'
import Link from 'next/link'

const blogPosts = [
  {
    id: 'zero-waste-kitchen',
    title: '10 Easy Ways to Create a Zero-Waste Kitchen',
    excerpt: 'Transform your kitchen into an eco-friendly haven with these simple tips that will help reduce waste and save money.',
    author: 'Sarah Green',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Lifestyle',
    image: '/products/bamboo-utensils.svg'
  },
  {
    id: 'sustainable-fashion',
    title: 'The Impact of Fast Fashion on Our Planet',
    excerpt: 'Discover how your clothing choices affect the environment and learn about sustainable fashion alternatives.',
    author: 'Mike Eco',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Fashion',
    image: '/products/bamboo-utensils.svg'
  },
  {
    id: 'plastic-alternatives',
    title: 'Best Plastic-Free Alternatives for Everyday Use',
    excerpt: 'Explore innovative and practical alternatives to single-use plastics that are better for you and the environment.',
    author: 'Emma Sustainable',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Products',
    image: '/products/bamboo-utensils.svg'
  },
  {
    id: 'eco-friendly-cleaning',
    title: 'Natural Cleaning Solutions for a Healthier Home',
    excerpt: 'Learn how to make your own cleaning products using natural ingredients that are safe for your family and the planet.',
    author: 'Dr. Clean',
    date: '2023-12-28',
    readTime: '8 min read',
    category: 'Home',
    image: '/products/bamboo-utensils.svg'
  },
  {
    id: 'sustainable-gifting',
    title: 'Eco-Friendly Gift Ideas for Every Occasion',
    excerpt: 'Make your gift-giving more meaningful and sustainable with these thoughtful eco-friendly gift suggestions.',
    author: 'Gift Guru',
    date: '2023-12-20',
    readTime: '4 min read',
    category: 'Lifestyle',
    image: '/products/bamboo-utensils.svg'
  },
  {
    id: 'energy-saving-tips',
    title: 'Simple Energy-Saving Tips That Actually Work',
    excerpt: 'Reduce your carbon footprint and energy bills with these practical and effective energy-saving strategies.',
    author: 'Energy Expert',
    date: '2023-12-15',
    readTime: '6 min read',
    category: 'Energy',
    image: '/products/bamboo-utensils.svg'
  }
]

const categories = [
  'All Posts',
  'Lifestyle',
  'Fashion',
  'Products',
  'Home',
  'Energy'
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Sustainability Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover tips, insights, and stories about sustainable living. Learn how small changes 
          can make a big impact on our planet.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-[#2B5219] hover:text-white transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      <div className="mb-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full">
              <Image
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-green-100 text-[#2B5219] px-3 py-1 rounded-full text-sm">
                  {blogPosts[0].category}
                </span>
                <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{blogPosts[0].title}</h2>
              <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">By {blogPosts[0].author}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                </div>
                <Link href={`/blog/${blogPosts[0].id}`}>
                  <button className="bg-[#2B5219] text-white px-6 py-2 rounded-lg hover:bg-[#1a3110] transition-colors">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-green-100 text-[#2B5219] px-2 py-1 rounded-full text-xs">
                  {post.category}
                </span>
                <span className="text-gray-500 text-xs">{post.readTime}</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  By {post.author} • {new Date(post.date).toLocaleDateString()}
                </div>
                <Link href={`/blog/${post.id}`}>
                  <button className="text-[#2B5219] hover:underline text-sm font-medium">
                    Read More →
                  </button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-green-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Get the latest sustainability tips and eco-friendly product updates delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219]"
          />
          <button className="bg-[#2B5219] text-white px-6 py-2 rounded-lg hover:bg-[#1a3110] transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
} 