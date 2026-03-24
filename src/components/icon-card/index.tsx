import React, { FC, Fragment, useRef, useState, ReactNode } from 'react';
import cn from 'classnames';

import { Typography } from '@alfalab/core-components/typography';
import { Popover } from '@alfalab/core-components/popover';
import { useClickOutside } from '@alfalab/hooks';

import { COLUMNS_AMOUNT } from '../../const/columns';
import { IconPackageName, RenderIconParams } from '../../types';
import { MetaInfo } from '../../shared/config/types';

interface Props extends Pick<MetaInfo, 'middle'>, Pick<RenderIconParams, 'Icon'> {
    isWhite: boolean;
    packageName: IconPackageName;
    isDeprecatedIcon: boolean;
    children: (fn: () => void) => ReactNode;
}

export const IconCard: FC<Props> = (props) => {
    const { isWhite, packageName, isDeprecatedIcon, middle, Icon, children } = props;

    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverAnchorRef = useRef<HTMLDivElement>(null);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    useClickOutside(popoverRef, () => setPopoverOpen(false));

    const handleClick = () => {
        setPopoverOpen(true);
    };

    const handleSelect = () => {
        setPopoverOpen(false);
    };

    return (
        <Fragment>
            <div
                ref={popoverAnchorRef}
                className={cn('icon-wrap', `icon-wrap-column-${COLUMNS_AMOUNT}`, {
                    'icon-wrap_dark': isWhite,
                })}
                key={`${packageName}-${middle}`}
                onClick={handleClick}
            >
                {isDeprecatedIcon && (
                    <Typography.Text
                        tag='div'
                        view='primary-small'
                        color={isWhite ? 'tertiary-inverted' : 'tertiary'}
                        className={cn('deprecated', {
                            deprecated_dark: isWhite,
                        })}
                    >
                        deprecated
                    </Typography.Text>
                )}
                {Icon && (
                    <Icon
                        className='icon'
                        color={
                            isDeprecatedIcon
                                ? 'var(--color-light-graphic-tertiary)'
                                : 'var(--color-light-graphic-primary)'
                        }
                    />
                )}
                <Typography.Text
                    view='primary-small'
                    color={isWhite ? 'secondary-inverted' : 'secondary'}
                    className='icon-primitive-name'
                >
                    {middle}
                </Typography.Text>
            </div>
            <Popover
                open={popoverOpen}
                useAnchorWidth={true}
                anchorElement={popoverAnchorRef.current || null}
                popperClassName='desktop-copy-dropdown-inner'
                position='bottom'
                offset={[0, 4]}
                preventFlip={false}
                ref={popoverRef}
            >
                <div className='popover-options-list'>{children(handleSelect)}</div>
            </Popover>
        </Fragment>
    );
};
