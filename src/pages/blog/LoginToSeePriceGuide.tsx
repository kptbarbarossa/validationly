import React from 'react';
import { SEOHead } from '../../components/SEOHead';

const LoginToSeePriceGuide: React.FC = () => {
    return (
        <>
            <SEOHead
                title="Login to See Price | Hide Prices App for Shopify"
                description="Increase customer signups by hiding prices from guests. Shopify 'Login to See Price' app for B2B, wholesale, and membership stores."
                keywords="Shopify app, hide price, login to see price, B2B, wholesale, membership, pricing visibility, price hiding, login to see prices, hide price guest, wholesale pricing, members only pricing, b2b pricing, add to cart hiding"
            />
            
            <div className="relative text-white overflow-hidden">
                {/* Decorative Background Shapes */}
                <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="pointer-events-none absolute top-20 -right-20 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative container mx-auto px-6 py-16">
                    {/* Header */}
                    <header className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Login to See Price
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            The Ultimate Shopify App for B2B, Wholesale, and Membership Stores
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {[
                                'price hiding',
                                'login to see prices', 
                                'hide price guest',
                                'wholesale pricing',
                                'members only pricing',
                                'b2b pricing',
                                'add to cart hiding'
                            ].map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-slate-300 border border-white/20">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* What is Login to See Price */}
                        <section className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-2xl">🔒</span>
                                What is Login to See Price?
                            </h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                <strong>Login to See Price</strong> is a powerful Shopify app that allows store owners to hide product prices and "Add to Cart" buttons from visitors who aren't logged in. This creates a compelling reason for potential customers to create accounts, significantly boosting your customer database and conversion rates.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Perfect for B2B stores, wholesale businesses, and membership-based e-commerce sites, this app gives you complete control over pricing visibility while maintaining a professional shopping experience.
                            </p>
                        </section>

                        {/* Key Features */}
                        <section className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-2xl">✨</span>
                                Key Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Price Hiding</h3>
                                            <p className="text-sm text-slate-400">Hide product prices from non-logged-in users</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Add to Cart Control</h3>
                                            <p className="text-sm text-slate-400">Restrict cart functionality until login</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">B2B Optimization</h3>
                                            <p className="text-sm text-slate-400">Perfect for wholesale and business customers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Membership Support</h3>
                                            <p className="text-sm text-slate-400">Ideal for members-only stores</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Custom Messages</h3>
                                            <p className="text-sm text-slate-400">Personalize "Login to See Price" messages</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Analytics Dashboard</h3>
                                            <p className="text-sm text-slate-400">Track conversion improvements</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Use Cases */}
                        <section className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                Perfect For These Business Types
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-3xl mb-3">🏢</div>
                                    <h3 className="font-semibold text-white mb-2">B2B Stores</h3>
                                    <p className="text-sm text-slate-400">Wholesale businesses that need customer verification</p>
                                </div>
                                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-3xl mb-3">👥</div>
                                    <h3 className="font-semibold text-white mb-2">Membership Sites</h3>
                                    <p className="text-sm text-slate-400">Exclusive content and pricing for members only</p>
                                </div>
                                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-3xl mb-3">💰</div>
                                    <h3 className="font-semibold text-white mb-2">Premium Brands</h3>
                                    <p className="text-sm text-slate-400">Luxury items with restricted access</p>
                                </div>
                            </div>
                        </section>

                        {/* Benefits */}
                        <section className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-2xl">📈</span>
                                Business Benefits
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Increased Customer Registrations</h3>
                                        <p className="text-slate-300">By hiding prices, you create a compelling reason for visitors to create accounts, expanding your customer database significantly.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Better Lead Generation</h3>
                                        <p className="text-slate-300">Capture visitor information before they see pricing, allowing for better follow-up and conversion strategies.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🛡️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Pricing Control</h3>
                                        <p className="text-slate-300">Maintain control over who sees your pricing, perfect for B2B negotiations and wholesale agreements.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SEO Keywords Section */}
                        <section className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-2xl">🔍</span>
                                SEO Keywords & Search Terms
                            </h2>
                            <div className="space-y-4">
                                <p className="text-slate-300">
                                    This app is optimized for these key search terms that Shopify store owners commonly use:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        'price hiding',
                                        'login to see prices',
                                        'hide price guest',
                                        'wholesale pricing',
                                        'members only pricing',
                                        'b2b pricing',
                                        'add to cart hiding',
                                        'restricted pricing'
                                    ].map((keyword, index) => (
                                        <div key={index} className="p-3 bg-white/5 rounded-xl text-center">
                                            <span className="text-sm text-slate-300">#{keyword}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* CTA */}
                        <section className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur rounded-3xl p-8 border border-purple-500/30 text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to Boost Your Customer Registrations?</h2>
                            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                                Join thousands of Shopify store owners who are already using Login to See Price to increase their customer base and improve conversion rates.
                            </p>
                            <a 
                                href="https://apps.shopify.com/shhhh-pricing" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
                            >
                                Get Login to See Price App →
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginToSeePriceGuide;
