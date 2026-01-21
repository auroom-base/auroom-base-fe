'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    animation?: 'fadeUp' | 'fadeIn' | 'scaleUp';
    delay?: number;
    duration?: number;
    stagger?: number;
    triggerStart?: string;
}

/**
 * Client-side animation wrapper using GSAP ScrollTrigger.
 * Wrap any content that needs scroll-triggered animations.
 */
export function AnimatedSection({
    children,
    className = '',
    animation = 'fadeUp',
    delay = 0,
    duration = 0.8,
    stagger = 0.1,
    triggerStart = 'top 80%',
}: AnimatedSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.children;

        const animations = {
            fadeUp: { y: 50, opacity: 0 },
            fadeIn: { opacity: 0 },
            scaleUp: { scale: 0.9, opacity: 0 },
        };

        gsap.fromTo(
            elements,
            animations[animation],
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration,
                delay,
                stagger,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: triggerStart,
                },
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
