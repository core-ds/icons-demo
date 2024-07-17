import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import Lottie, { AnimationItem } from 'lottie-web/build/player/lottie_light';

export function LottieIcon({
    animationData,
    className,
    name,
}: {
    animationData: any;
    className?: string;
    name?: string;
}) {
    const ref = useRef(null);
    const animationItem = useRef<AnimationItem>();

    const handleAnimationPlay = () => {
        if (!animationItem.current) {
            return;
        }
        
        animationItem.current.play();
    };

    const handleAnimationPause = () => {
        if (!animationItem.current) {
            return;
        }

        animationItem.current.pause();
    };

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
            loop: true,
            autoplay: false,
            animationData,
            name,
        });

        animationItem.current = animation;

        return () => {
            if (!animationItem.current) {
                return;
            }

            animationItem.current.destroy();
        };
    }, [animationData]);

    return (
        <div
            onMouseOver={handleAnimationPlay}
            onMouseOut={handleAnimationPause}
            className={cn('lottie-animation', className)}
            ref={ref}
            onTouchStart={handleAnimationPlay}
            onTouchEnd={handleAnimationPause}
        />
    );
}

export default LottieIcon;
