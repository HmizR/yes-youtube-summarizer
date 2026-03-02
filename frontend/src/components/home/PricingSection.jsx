import { CheckCircle } from  'lucide-react';

export default function PricingSection() {
    // Pricing plans
    const plans = [
        {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
            "50 summaries per month",
            "Basic AI summarization",
            "Text export only",
            "Community support",
            "Up to 30 min videos"
        ],
        cta: "Get Started Free",
        popular: false,
        highlight: false
        },
        {
        name: "Pro",
        price: "$9",
        period: "per month",
        features: [
            "500 summaries per month",
            "Advanced AI (GPT-4 & Ollama)",
            "All export formats",
            "Priority support",
            "Up to 4 hour videos",
            "Batch processing (5 videos)",
            "Advanced analytics"
        ],
        cta: "Start Free Trial",
        popular: true,
        highlight: true
        },
        {
        name: "Business",
        price: "$29",
        period: "per month",
        features: [
            "5000 summaries per month",
            "Team collaboration",
            "Custom AI models",
            "API access",
            "Dedicated support",
            "No video length limit",
            "Batch processing (unlimited)",
            "Custom branding"
        ],
        cta: "Contact Sales",
        popular: false,
        highlight: false
        }
    ];

    return (

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Simple, Transparent</span>
              <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? 'border-red-500 bg-gradient-to-b from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 shadow-2xl'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-purple-600 text-white text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.name === 'Business' ? '/contact' : '/register'}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Free trial notice */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Need a custom plan?{' '}
              <a href="/contact" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
    );
}