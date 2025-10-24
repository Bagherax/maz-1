import { useState, useEffect, RefObject } from 'react';

/**
 * A custom hook that determines if an element is visible on the screen.
 * @param ref Ref to the element to observe.
 * @param rootMargin Margin around the root. Can be used to trigger earlier/later.
 * @returns A boolean indicating if the element is intersecting with the viewport.
 */
export function useOnScreen(ref: RefObject<Element>, rootMargin: string = '0px'): boolean {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
            { rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [ref, rootMargin]);

    return isIntersecting;
}
