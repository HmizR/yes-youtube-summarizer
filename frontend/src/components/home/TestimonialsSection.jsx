import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    // Testimonials data
    const testimonials = [
        {
        name: "Sarah Chen",
        role: "Research Scientist",
        company: "TechCorp AI",
        content: "This tool has transformed how I consume educational content. I save 10+ hours weekly!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 5
        },
        {
        name: "Marcus Rodriguez",
        role: "Engineering Manager",
        company: "StartupXYZ",
        content: "Our engineering team uses this daily for staying updated with tech talks. Game changer!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        rating: 5
        },
        {
        name: "Priya Patel",
        role: "Product Manager",
        company: "GrowthLabs",
        content: "From 2-hour meetings to 5-minute summaries. Our productivity has skyrocketed.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        rating: 5
        }
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Loved by</span>
              <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Thousands of Users
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join students, researchers, and professionals who save hours every week.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:shadow-xl"
              >
                {/* Stars */}
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company logos */}
          <div className="mt-20">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Google</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Microsoft</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Stanford</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">MIT</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">GitHub</div>
            </div>
          </div>
        </div>
    );
}