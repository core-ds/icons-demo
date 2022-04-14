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
                        label='icons-glyph'
                        name={IconPackageName.GLYPH}
                        checked={packages.glyph}
                    />
                    <Checkbox
                        label='icons-classic'
                        name={IconPackageName.CLASSIC}
                        checked={packages.classic}
                    />
                    <Checkbox
                        label='icons-flag'
                        name={IconPackageName.FLAG}
                        checked={packages.flag}
                    />
                    <Checkbox
                        label='icons-logotype'
                        name={IconPackageName.LOGOTYPE}
                        checked={packages.logotype}
                    />
                    <Checkbox
                        label='icons-corp'
                        name={IconPackageName.CORP}
                        checked={packages.corp}
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
                }}
                value={value}
                packages={packages}
            />
        </div>
    );
};
