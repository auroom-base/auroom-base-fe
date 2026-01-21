'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedFadeInProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    delay?: number;
    duration?: number;
    triggerStart?: string;
    as?: 'div' | 'section' | 'article' | 'span' | 'p';
}

/**
 * Client-side fade-in animation wrapper.
 * Simpler than AnimatedSection, animates the wrapper itself.
 */
export function AnimatedFadeIn({
    children,
    className = '',
    direction = 'up',
    distance = 50,
    delay = 0,
    duration = 1,
    triggerStart = 'top 80%',
    as: Component = 'div',
}: AnimatedFadeInProps) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;

        const directions = {
            up: { y: distance },
            down: { y: -distance },
            left: { x: distance },
            right: { x: -distance },
            none: {},
        };

        gsap.from(ref.current, {
            ...directions[direction],
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ref.current,
                start: triggerStart,
            },
        });
    }, { scope: ref });

    return (
        <Component ref={ref as any} className={className}>
            {children}
        </Component>
    );
}
