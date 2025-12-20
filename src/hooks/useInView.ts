import { useState, useEffect, useRef, RefObject } from 'react';

export function useInView(threshold = 0.1): [RefObject<any>, boolean] {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<any>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    // Якщо анімація має спрацювати лише один раз:
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            { threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    return [ref, isInView];
}