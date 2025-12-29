'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    // Prefill form from query params (e.g., coming from Deals "Book Now")
    useEffect(() => {
        const subject = searchParams.get('subject') || '';
        const message = searchParams.get('message') || '';
        setFormData(prev => ({
            ...prev,
            subject: subject || prev.subject,
            message: message || prev.message,
        }));
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-black/10 to-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Get in <span className="text-[#DAA520]">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Get in touch with our team today.
                    </p>
                </div>
            </div>

            {/* Contact Form (moved to top) */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="charter">Charter Inquiry</option>
                                            <option value="fleet">Fleet Information</option>
                                            <option value="membership">Membership</option>
                                            <option value="support">Customer Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#DAA520] hover:bg-[#c99416] text-white py-3 text-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Send Message
                                </Button>

                                {submitted && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                                        <p className="font-semibold">Thank you! Your message has been sent.</p>
                                        <p className="text-sm">We'll get back to you as soon as possible.</p>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Info */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Contact Us?</h2>
                            <div className="space-y-6">
                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Charter Inquiries</h3>
                                    <p className="text-gray-600">
                                        Looking to book a private jet? Our team can help you find the perfect aircraft for your needs.
                                    </p>
                                </Card>
                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Air Taxi Services</h3>
                                    <p className="text-gray-600">
                                        Need a quick transfer between cities? Explore our air taxi solutions for fast, convenient travel.
                                    </p>
                                </Card>
                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Air Ambulance Assistance</h3>
                                    <p className="text-gray-600">
                                        We provide critical care air transport with medical teams and specialized equipment.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            {
                                icon: <Phone className="w-8 h-8" />,
                                title: 'Phone',
                                value: '+1 (555) 123-4567',
                                details: 'Mon-Fri, 9am-6pm EST'
                            },
                            {
                                icon: <Mail className="w-8 h-8" />,
                                title: 'Email',
                                value: 'info@asraviation.com',
                                details: 'We respond within 24 hours'
                            },
                            {
                                icon: <MapPin className="w-8 h-8" />,
                                title: 'Address',
                                value: 'New York, USA',
                                details: 'Head Office'
                            },
                            {
                                icon: <Clock className="w-8 h-8" />,
                                title: 'Support',
                                value: '24/7 Available',
                                details: 'Emergency hotline'
                            }
                        ].map((contact, idx) => (
                            <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className="text-[#DAA520]">{contact.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                                <p className="text-lg font-semibold text-gray-900 mb-1">{contact.value}</p>
                                <p className="text-sm text-gray-600">{contact.details}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form and Map */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="charter">Charter Inquiry</option>
                                            <option value="fleet">Fleet Information</option>
                                            <option value="membership">Membership</option>
                                            <option value="support">Customer Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#DAA520] hover:bg-[#c99416] text-white py-3 text-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Send Message
                                </Button>

                                {submitted && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                                        <p className="font-semibold">Thank you! Your message has been sent.</p>
                                        <p className="text-sm">We'll get back to you as soon as possible.</p>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Info */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Contact Us?</h2>
                            <div className="space-y-6">
                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Charter Inquiries</h3>
                                    <p className="text-gray-600">
                                        Looking to book a private jet? Our team can help you find the perfect aircraft for your needs.
                                    </p>
                                </Card>

                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Fleet Information</h3>
                                    <p className="text-gray-600">
                                        Want to learn more about our aircraft? We're happy to provide detailed specifications and photos.
                                    </p>
                                </Card>

                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Membership Programs</h3>
                                    <p className="text-gray-600">
                                        Interested in our exclusive membership benefits? Let's discuss which program is right for you.
                                    </p>
                                </Card>

                                <Card className="p-6 border-l-4 border-l-[#DAA520]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Support & Feedback</h3>
                                    <p className="text-gray-600">
                                        Have feedback or need assistance? We're always here to help and improve our services.
                                    </p>
                                </Card>
                            </div>

                            {/* Response Time */}
                            <Card className="mt-8 p-6 bg-[#DAA520]/5 border border-[#DAA520]/20">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Response Time</h3>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                    <li>• Emails: Response within 24 hours</li>
                                    <li>• Phone: Available during business hours</li>
                                    <li>• Emergency: 24/7 support available</li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        Frequently Asked <span className="text-[#DAA520]">Questions</span>
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'How do I book a charter flight?',
                                a: 'Simply visit our Fleet page, select your preferred aircraft, and fill out the booking form. Our team will contact you to confirm details and pricing.'
                            },
                            {
                                q: 'What is your cancellation policy?',
                                a: 'We offer flexible cancellation policies. For details, please contact our customer service team directly.'
                            },
                            {
                                q: 'Do you offer ground transportation?',
                                a: 'Yes! We provide comprehensive ground transportation services. Check our Taxi page for all available options.'
                            },
                            {
                                q: 'What airports do you serve?',
                                a: 'We operate flights to major international airports worldwide. Contact us for specific route inquiries.'
                            }
                        ].map((item, idx) => (
                            <Card key={idx} className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.q}</h3>
                                <p className="text-gray-600">{item.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
