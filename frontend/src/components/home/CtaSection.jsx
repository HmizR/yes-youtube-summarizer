import { Zap, Play } from 'lucide-react';

export default function CtaSection() {
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubscriptionStatus('success');
            setEmail('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Saving Time Today
        </h2>
        <p className="text-xl text-white/90 mb-8">
            Join thousands of users who have already saved over 50,000 hours
            of video watching time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-red-600 font-bold text-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-2xl"
            >
            <Zap className="mr-3 h-5 w-5" />
            Get Started Free
            </a>
            <a
            href="/demo"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
            <Play className="mr-3 h-5 w-5" />
            Watch Demo
            </a>
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
                Stay Updated
            </h3>
            <p className="text-white/80 mb-6">
                Get tips, updates, and exclusive content about AI summarization.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
                </div>
                
                {subscriptionStatus === 'success' && (
                <div className="text-green-300 text-sm">
                    Thanks for subscribing! Check your email for confirmation.
                </div>
                )}
                
                <p className="text-white/60 text-sm">
                No spam, unsubscribe anytime.
                </p>
            </form>
            </div>
        </div>
        </div>
    </div>
    );
}