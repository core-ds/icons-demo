import React from 'react';

import { CopyType, DeprecatedAssets, DeprecatedType, IconPackageName } from '../../types';
import { OptionContentCopy } from './components/option-content-copy';
import { OptionContentDeprecated } from './components/option-content-deprecated';

const COPY_OPTIONS = [
    { key: CopyType.WEB_NAME, content: <OptionContentCopy text='Веб имя иконки' /> },
    { key: CopyType.WEB_COMPONENT, content: <OptionContentCopy text='Веб компонент' /> },
    { key: CopyType.ANDROID_NAME, content: <OptionContentCopy text='Android имя иконки' /> },
    { key: CopyType.IOS_NAME, content: <OptionContentCopy text='iOS имя иконки' /> },
    { key: CopyType.MIDDLE_NAME, content: <OptionContentCopy text='Мидл имя иконки' /> },
    { key: CopyType.CDN_NAME, content: <OptionContentCopy text='CDN имя иконки' /> },
    { key: CopyType.CDN_URL, content: <OptionContentCopy text='URL иконки' /> },
    { key: CopyType.BASE_64_ICON, content: <OptionContentCopy text='Base64 иконка' /> },
];

const DEPRECATED_OPTION_WITH_REPLACE = [
    {
        key: DeprecatedType.DEPRECATED,
        content: <OptionContentDeprecated text='Перейти к замене' replace={true} />,
    },
];

const DEPRECATED_OPTION_WITHOUT_REPLACE = [
    {
        key: DeprecatedType.NO_REPLACE,
        content: (
            <OptionContentDeprecated
                text='Замены нет. Попробуйте найти другую иконку, подходящую под вашу задачу.'
                replace={false}
            />
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
