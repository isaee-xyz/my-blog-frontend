'use client';

import React, { useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import SketchyButton from './SketchyButton';

const LeadCaptureModal: React.FC = () => {
    const { isOpen, closeModal } = useModal();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrate with Strapi to save leads
        console.log('Lead captured:', { name, email });
        setSubmitted(true);
        setTimeout(() => {
            closeModal();
            setSubmitted(false);
            setName('');
            setEmail('');
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-paper border-2 border-ink rounded-2xl p-8 max-w-md w-full shadow-[shadow-sketchHover] relative slide-in-from-top-2">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-ink/60 hover:text-ink text-2xl"
                >
                    ×
                </button>

                {!submitted ? (
                    <>
                        <h2 className="text-3xl font-bold text-ink mb-2">Join the Movement! 🌟</h2>
                        <p className="text-ink/70 mb-6">
                            Get updates on workshops, impact stories, and ways you can make a difference in your community.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-3 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <SketchyButton type="submit" className="w-full">
                                Count Me In!
                            </SketchyButton>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-ink">Welcome Aboard!</h3>
                        <p className="text-ink/70 mt-2">We'll be in touch soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadCaptureModal;
