'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-black/10 to-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        About <span className="text-[#DAA520]">ASR Aviation</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Leading the future of luxury aviation with premium services and exceptional customer care.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        <div className="bg-gradient-to-br from-[#DAA520]/10 to-transparent p-8 rounded-lg border border-[#DAA520]/20">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To provide world-class aviation services that redefine luxury travel. We're committed to
                                delivering exceptional experiences through our modern fleet, professional crew, and
                                uncompromising commitment to safety and customer satisfaction.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-[#DAA520]/10 to-transparent p-8 rounded-lg border border-[#DAA520]/20">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To be the preferred choice for premium aviation services globally. We envision a future where
                                luxury travel is seamless, accessible, and sets new standards for excellence in the aviation industry.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        Our <span className="text-[#DAA520]">Core Values</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Excellence', description: 'Highest standards in every service' },
                            { title: 'Safety', description: 'Your well-being is our priority' },
                            { title: 'Integrity', description: 'Transparency and honesty always' },
                            { title: 'Innovation', description: 'Continuous improvement and modernization' }
                        ].map((value, idx) => (
                            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 text-[#DAA520] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                        <p className="text-gray-600">{value.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        Why Choose <span className="text-[#DAA520]">ASR Aviation</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Premium Fleet',
                                description: 'Modern, well-maintained aircraft with latest technology and amenities'
                            },
                            {
                                title: 'Expert Crew',
                                description: 'Highly trained pilots and staff committed to your comfort and safety'
                            },
                            {
                                title: '24/7 Support',
                                description: 'Round-the-clock customer service for all your aviation needs'
                            },
                            {
                                title: 'Flexible Scheduling',
                                description: 'Tailored flight schedules that fit your business and personal needs'
                            },
                            {
                                title: 'Competitive Pricing',
                                description: 'Premium services at competitive rates with transparent billing'
                            },
                            {
                                title: 'Global Network',
                                description: 'Access to airports worldwide with extensive international routes'
                            }
                        ].map((item, idx) => (
                            <Card key={idx} className="p-6 border-l-4 border-l-[#DAA520] hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="py-16 px-6 bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '500+', label: 'Flights Annually' },
                            { number: '15+', label: 'Aircraft Fleet' },
                            { number: '10K+', label: 'Satisfied Clients' },
                            { number: '20+', label: 'Years Experience' }
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <p className="text-5xl font-bold text-[#DAA520] mb-2">{stat.number}</p>
                                <p className="text-lg text-gray-300">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        Our <span className="text-[#DAA520]">Leadership Team</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Anmol Singh', role: 'CEO & Founder', bio: 'Leading ASR Aviation with vision and expertise' },
                            { name: 'Operations Director', role: 'Chief Operations Officer', bio: 'Ensuring safety and efficiency' },
                            { name: 'Fleet Manager', role: 'Chief Pilot', bio: 'Managing our premium aircraft fleet' }
                        ].map((member, idx) => (
                            <Card key={idx} className="p-8 text-center hover:shadow-lg transition-shadow">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#DAA520] to-gray-700 rounded-full mx-auto mb-4"></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-[#DAA520] font-semibold mb-3">{member.role}</p>
                                <p className="text-gray-600">{member.bio}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Our Commitment to You
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                        At ASR Aviation, we believe that luxury aviation should be accessible, reliable, and exceptional.
                        Every flight is an opportunity to exceed expectations. Our dedicated team works tirelessly to ensure
                        that your journey is comfortable, safe, and memorable. We're not just providing flights; we're creating
                        experiences that matter.
                    </p>
                    <div className="bg-[#DAA520]/10 border border-[#DAA520]/30 rounded-lg p-8">
                        <p className="text-lg text-gray-900 font-semibold">
                            "Excellence is not an act, but a habit." - Aristotle
                        </p>
                        <p className="text-gray-600 mt-2">This philosophy guides everything we do at ASR Aviation.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
