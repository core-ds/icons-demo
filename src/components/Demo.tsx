import React, { FC, useState, ChangeEvent } from 'react';
import { Input } from '@alfalab/core-components-input';
import { Checkbox } from '@alfalab/core-components-checkbox';
import { CheckboxGroup } from '@alfalab/core-components-checkbox-group';
import qs from 'querystring';

import * as IconsGlyph from '@alfalab/icons/glyph/dist';
import * as IconsClassic from '@alfalab/icons/classic/dist';
import * as IconsFlag from '@alfalab/icons/flag/dist';
import * as IconsLogotype from '@alfalab/icons/logotype/dist';

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
    }
};

export const Demo: FC = () => {
    const [value, setValue] = useState('');
    const [packages, setPackages] = useState<Packages>({
        [IconPackageName.CLASSIC]: false,
        [IconPackageName.GLYPH]: true,
        [IconPackageName.FLAG]: false,
        [IconPackageName.LOGOTYPE]: false,
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
                }}
                value={value}
                packages={packages}
            />
        </div>
    );
};
