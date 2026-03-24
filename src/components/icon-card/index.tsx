import React, { FC, MouseEventHandler } from 'react';
import cn from 'classnames';
import { Typography } from '@alfalab/core-components/typography';
import { COLUMNS_AMOUNT } from '../../const/columns';
import { IconPackageName, RenderIconParams } from '../../types';

import { MetaInfo } from '../../shared/config/types';

interface Props extends Pick<MetaInfo, 'middle'>, Pick<RenderIconParams, 'Icon'> {
    isWhite: boolean;
    packageName: IconPackageName;
    isDeprecatedIcon: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export const IconCard: FC<Props> = (props) => {
    const { isWhite, packageName, isDeprecatedIcon, middle, Icon, onClick } = props;

    return (
        <div
            className={cn('icon-wrap', `icon-wrap-column-${COLUMNS_AMOUNT}`, {
                'icon-wrap_dark': isWhite,
            })}
            onClick={onClick}
            key={`${packageName}-${middle}`}
        >
            {isDeprecatedIcon ? (
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
            ) : null}
            {Icon ? (
                <Icon
                    className='icon'
                    color={
                        isDeprecatedIcon
                            ? 'var(--color-light-graphic-tertiary)'
                            : 'var(--color-light-graphic-primary)'
                    }
                />
            ) : null}
            <Typography.Text
                view='primary-small'
                color={isWhite ? 'secondary-inverted' : 'secondary'}
                className='icon-primitive-name'
            >
                {middle}
            </Typography.Text>
        </div>
    );
};
