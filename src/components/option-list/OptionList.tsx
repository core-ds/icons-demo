import React from 'react';

import { ClickedElement, DeprecatedAssets, DeprecatedType } from '../../types';
import { OptionContentCopy } from './components/option-content-copy';
import { OptionContentDeprecated } from './components/option-content-deprecated';
import { MetaInfo } from '../../shared/config/icon-meta-files';

type Key = Exclude<keyof MetaInfo, 'description' | 'basename'>;

const OPTIONS_MAP: Record<Key, JSX.Element> = {
    web: <OptionContentCopy text='Веб имя иконки' />,
    webComponent: <OptionContentCopy text='Веб компонент' />,
    android: <OptionContentCopy text='Android имя иконки' />,
    ios: <OptionContentCopy text='iOS имя иконки' />,
    middle: <OptionContentCopy text='Мидл имя иконки' />,
    cdn: <OptionContentCopy text='CDN имя иконки' />,
    url: <OptionContentCopy text='URL иконки' />,
};

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

const generateOptionList = (clickedElem: ClickedElement) => {
    return Object.keys(clickedElem)
        .filter((item) => !['packageName', 'basename'].includes(item))
        .map((item) => {
            const key = item as Key;
            return { key, content: OPTIONS_MAP[key] };
        });
};

export function getOptionsList(
    iconName: string,
    deprecatedIcons: DeprecatedAssets,
    clickedElem: ClickedElement | null,
) {
    if (!deprecatedIcons.hasOwnProperty(iconName)) {
        if (clickedElem) {
            return generateOptionList(clickedElem);
        }
        return null;
    } else if (deprecatedIcons[iconName].replacement) {
        return DEPRECATED_OPTION_WITH_REPLACE;
    } else {
        return DEPRECATED_OPTION_WITHOUT_REPLACE;
    }
}
