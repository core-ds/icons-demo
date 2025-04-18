import React from 'react';
import cn from 'classnames';

import { Typography } from '@alfalab/core-components/typography/modern';
import { CopyLineMIcon } from '@alfalab/icons/glyph/dist/CopyLineMIcon';
import { ArrowRightCurvedMIcon } from '@alfalab/icons-glyph/ArrowRightCurvedMIcon';

import { CopyType, DeprecatedAssets, DeprecatedType, IconPackageName } from '../types';

const getOptionContentCopy = (text: string) => (
    <div className='option-content'>
        <Typography.Text view='component-primary' color='primary'>
            {text}
        </Typography.Text>

        <CopyLineMIcon />
    </div>
);

const getOptionContentDeprecated = (text: string, replace: boolean) => (
    <div
        className={cn('option-content', {
            'option-no-replace': !replace,
        })}
    >
        <Typography.Text
            view={replace ? 'component-primary' : 'primary-small'}
            color={replace ? 'primary' : 'tertiary'}
        >
            {text}
        </Typography.Text>

        {replace && <ArrowRightCurvedMIcon color='var(--color-light-graphic-tertiary)' />}
    </div>
);

const COPY_OPTIONS = [
    { key: CopyType.NAME, content: getOptionContentCopy('Имя иконки') },
    { key: CopyType.REACT_NAME, content: getOptionContentCopy('Имя компонента') },
    { key: CopyType.IMPORT_CODE, content: getOptionContentCopy('Код для импорта') },
];

const DEPRECATED_OPTION_WITH_REPLACE = [
    {
        key: DeprecatedType.DEPRECATED,
        content: getOptionContentDeprecated('Перейти к замене', true),
    },
];

const DEPRECATED_OPTION_WITHOUT_REPLACE = [
    {
        key: DeprecatedType.NO_REPLACE,
        content: getOptionContentDeprecated(
            'Замены нет. Попробуйте найти другую иконку, подходящую под вашу задачу.',
            false,
        ),
    },
];

export function getOptionsList(
    iconName: string,
    packageName: string,
    deprecatedIcons: DeprecatedAssets,
) {
    if (packageName === IconPackageName.CLASSIC) {
        return DEPRECATED_OPTION_WITHOUT_REPLACE;
    }

    if (!deprecatedIcons.hasOwnProperty(iconName)) {
        return COPY_OPTIONS;
    } else if (deprecatedIcons[iconName].replacement) {
        return DEPRECATED_OPTION_WITH_REPLACE;
    } else {
        return DEPRECATED_OPTION_WITHOUT_REPLACE;
    }
}
