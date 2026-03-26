import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { IconButton } from '@alfalab/core-components/icon-button/modern';
import { ArrowUpMIcon } from '@alfalab/icons/glyph/dist/ArrowUpMIcon';

import style from './index.module.css';

type BackToTopProps = {
    onClick: () => void;
    visible: boolean;
};

export const BackToTopButton: React.FC<BackToTopProps> = ({ onClick, visible }) => {
    const [show, setShow] = useState(visible);
    const [transitionClass, setTransitionClass] = useState<boolean>(false);
    const timeoutRef = useRef<number>();

    useEffect(() => {
        if (visible) {
            setShow(true);
            timeoutRef.current = window.setTimeout(() => setTransitionClass(true), 50);
        } else {
            timeoutRef.current = window.setTimeout(() => setShow(false), 300);
            setTransitionClass(false);
        }

        return () => clearTimeout(timeoutRef.current);
    }, [visible]);

    return show ? (
        <IconButton
            icon={ArrowUpMIcon}
            className={cn(style.button, {
                [style.appear]: transitionClass,
            })}
            colors='inverted'
            onClick={onClick}
        />
    ) : null;
};
