import React, { FC, useState, ChangeEvent } from 'react';
import { Input } from '@alfalab/core-components-input';
import { Checkbox } from '@alfalab/core-components-checkbox';
import { CheckboxGroup } from '@alfalab/core-components-checkbox-group';
import qs from 'querystring';

const IconsGlyph = {};
const IconsClassic = {};
const IconsFlag = {};
const IconsLogotype = {};
const IconsCorp = {};
const IconsRocky = {};
const IconsIos = {};
const IconsAndroid= {}

const importAllIcons = (requireContext: any, Module: any) =>
    requireContext.keys().forEach((key: string) => {
        const moduleName = key.replace(/\.js$/, '').replace(/^\.\//, '');

        Module[moduleName] = requireContext(key)[moduleName];
    });

importAllIcons(require.context('@alfalab/icons/glyph/dist', false, /Icon\.js$/), IconsGlyph);
importAllIcons(require.context('@alfalab/icons/classic/dist', false, /Icon\.js$/), IconsClassic);
importAllIcons(require.context('@alfalab/icons/flag/dist', false, /Icon\.js$/), IconsFlag);
importAllIcons(require.context('@alfalab/icons/logotype/dist', false, /Icon\.js$/), IconsLogotype);
importAllIcons(require.context('@alfalab/icons/corp/dist', false, /Icon\.js$/), IconsCorp);
importAllIcons(require.context('@alfalab/icons/rocky/dist', false, /Icon\.js$/), IconsRocky);
importAllIcons(require.context('@alfalab/icons/ios/dist', false, /Icon\.js$/), IconsIos);
importAllIcons(require.context('@alfalab/icons/android/dist', false, /Icon\.js$/), IconsAndroid);

import { IconList } from './IconList';
import { IconPackageName, Packages } from './types';

export const getModule = (packageName: IconPackageName) => {
    switch (packageName) {
        case IconPackageName.GLYPH:
            return IconsGlyph;
        case IconPackageName.CLASSIC:
            return IconsClassic;
        case IconPackageName.FLAG:
            return IconsFlag;
        case IconPackageName.LOGOTYPE:
            return IconsLogotype;
        case IconPackageName.CORP:
            return IconsCorp;
        case IconPackageName.ROCKY:
            return IconsRocky;
        case IconPackageName.IOS:
            return IconsIos
        case IconPackageName.ANDROID:
            return IconsAndroid;
    }
};

export const Demo: FC = () => {
    const [value, setValue] = useState('');

    const [packages, setPackages] = useState<Packages>({
        [IconPackageName.CLASSIC]: false,
        [IconPackageName.GLYPH]: true,
        [IconPackageName.FLAG]: false,
        [IconPackageName.LOGOTYPE]: false,
        [IconPackageName.CORP]: false,
        [IconPackageName.ROCKY]: false,
        [IconPackageName.IOS]: false,
        [IconPackageName.ANDROID]: false,
    });

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const onCheckboxGroupChange = (_: any, payload?: { checked: boolean; name?: string }) => {
        const { checked, name = '' } = payload || {};

        setPackages({
            ...packages,
            [name]: checked,
        });
    };

    const { platform = 'web' } = qs.parse(document.location.search.replace(/^\?/, ''));

    return (
        <div className='root'>
            <div className='search-wrap'>
                <Input
                    value={value}
                    onChange={onChange}
                    className='search-input'
                    placeholder='Название иконки'
                    block={true}
                />

                <CheckboxGroup
                    direction='horizontal'
                    onChange={onCheckboxGroupChange}
                    className='checkbox-group'
                >
                    <Checkbox
                        label='glyph'
                        name={IconPackageName.GLYPH}
                        checked={packages.glyph}
                    />
                    <Checkbox
                        label='rocky'
                        name={IconPackageName.ROCKY}
                        checked={packages.rocky}
                    />
                    <Checkbox
                        label='ios'
                        name={IconPackageName.IOS}
                        checked={packages.ios}
                    />
                    <Checkbox
                        label='android'
                        name={IconPackageName.ANDROID}
                        checked={packages.android}
                    />
                    <Checkbox
                        label='corp'
                        name={IconPackageName.CORP}
                        checked={packages.corp}
                    />
                    <Checkbox
                        label='classic (old)'
                        name={IconPackageName.CLASSIC}
                        checked={packages.classic}
                    />
                    <Checkbox
                        label='logotype'
                        name={IconPackageName.LOGOTYPE}
                        checked={packages.logotype}
                    />
                    <Checkbox
                        label='flag'
                        name={IconPackageName.FLAG}
                        checked={packages.flag}
                    />
                </CheckboxGroup>

                {platform === 'web' && (
                    <h1 className='title'>Кликните на иконку для копирования импорта</h1>
                )}
            </div>

            <IconList
                icons={{
                    [IconPackageName.GLYPH]: IconsGlyph,
                    [IconPackageName.CLASSIC]: IconsClassic,
                    [IconPackageName.FLAG]: IconsFlag,
                    [IconPackageName.LOGOTYPE]: IconsLogotype,
                    [IconPackageName.CORP]: IconsCorp,
                    [IconPackageName.ROCKY]: IconsRocky,
                    [IconPackageName.IOS]: IconsIos,
                    [IconPackageName.ANDROID]: IconsAndroid,
                }}
                value={value}
                packages={packages}
            />
        </div>
    );
};
