'use client';

import { useState, ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
    className?: string;
}

/**
 * Client-side FAQ accordion with interactive open/close.
 * Static content is passed from server component.
 */
export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className={className}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`group border-b border-white/10 last:border-0 transition-colors duration-300 ${openIndex === index ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                        }`}
                >
                    <button
                        onClick={() => setOpenIndex(index === openIndex ? null : index)}
                        className="w-full py-8 px-6 flex items-start justify-between text-left gap-4"
                    >
                        <span
                            className={`text-xl font-medium transition-colors duration-300 ${openIndex === index ? 'text-[#F5D061]' : 'text-white'
                                }`}
                        >
                            {item.question}
                        </span>
                        <span
                            className={`shrink-0 mt-1 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#F5D061]' : 'text-gray-500'
                                }`}
                        >
                            {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                        </span>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <p className="px-6 pb-8 text-gray-400 leading-relaxed text-lg">
                            {item.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
