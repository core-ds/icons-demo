import React from 'react';

import { ClickedElement, DeprecatedAssets, DeprecatedType } from '../../types';
import { OptionContentCopy } from './components/option-content-copy';
import { OptionContentDeprecated } from './components/option-content-deprecated';
import { exhaustiveCheck } from '../../shared/utils';
import { MetaInfo } from '../../shared/config/types';

type OptionKey = Exclude<keyof MetaInfo, 'description' | 'basename'>;

const getOption = (key: OptionKey) => {
    switch (key) {
        case 'web':
            return <OptionContentCopy text='Веб имя иконки' />;
        case 'webComponent':
            return <OptionContentCopy text='Веб компонент' />;
        case 'android':
            return <OptionContentCopy text='Android имя иконки' />;
        case 'ios':
            return <OptionContentCopy text='iOS имя иконки' />;
        case 'middle':
            return <OptionContentCopy text='Мидл имя иконки' />;
        case 'cdn':
            return <OptionContentCopy text='CDN имя иконки' />;
        case 'url':
            return <OptionContentCopy text='URL иконки' />;
        default:
            return exhaustiveCheck(key);
    }
};

const getDeprecatedOptionWithReplace = (replaceValue: string) => {
    return [
        {
            key: DeprecatedType.DEPRECATED,
            content: <OptionContentDeprecated text='Перейти к замене' replace={true} />,
            value: replaceValue,
        },
    ];
};

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
            const key = item as OptionKey;
            return {
                key,
                content: getOption(key),
                value: clickedElem[key],
            };
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
        return getDeprecatedOptionWithReplace(deprecatedIcons[iconName].replacement);
    } else {
        return DEPRECATED_OPTION_WITHOUT_REPLACE;
    }
}
