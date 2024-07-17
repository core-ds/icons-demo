import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import Lottie, { AnimationItem } from 'lottie-web/build/player/lottie_light';

export function LottieIcon({
    animationData,
    className,
    name,
    play,
    changeAnimationName,
}: {
    animationData: any;
    className?: string;
    name?: string;
    play?: boolean;
    changeAnimationName: (name: string | null) => void;
}) {
    const ref = useRef(null);
    const animationItem = useRef<AnimationItem>();

    useEffect(() => {
        if (!ref.current) {
            return () => {};
        }

        if (!ref.current) {
            return;
        }
        const animation = Lottie.loadAnimation({
            container: ref.current,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData,
            name,
        });

        animationItem.current = animation;

        if (play && animationItem.current) {
            animationItem.current.play();
        }

        animationItem.current.addEventListener('complete', () => {
            if (play) {
                changeAnimationName(null);
            }
        });

        return () => {
            if (!animationItem.current) {
                return;
            }

            animationItem.current.destroy();
        };
    }, [animationData, play]);

    return <div className={cn('lottie-animation', className)} ref={ref} />;
}

export default LottieIcon;
