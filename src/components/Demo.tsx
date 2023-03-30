import React, { FC, useState } from 'react';
import { Input } from '@alfalab/core-components/input/modern';
import { Typography } from '@alfalab/core-components/typography/modern';
import {
    Select,
    BaseOption,
    SelectMobile,
    SelectProps,
} from '@alfalab/core-components/select/modern';
import { Spinner } from '@alfalab/core-components/spinner/modern';
import { useMatchMedia } from '@alfalab/core-components/mq/modern';
import MagnifierMIcon from '@alfalab/icons/glyph/dist/MagnifierMIcon';

import { IconPackageName, IconPackageNameKeys } from './types';

const IconList = React.lazy(() => import('./IconList'));

const ICON_OPTIONS = Object.keys(IconPackageName).map((key) => {
    const typedKey = key as IconPackageNameKeys;
    const lcName = typedKey.toLowerCase();

    return {
        key: IconPackageName[typedKey],
        content: lcName.charAt(0).toUpperCase() + lcName.slice(1),
    };
});

export const Demo: FC = () => {
    const [value, setValue] = useState('');

    const [packages, setPackages] = useState<IconPackageName[]>([IconPackageName.GLYPH]);

    const [isMobile] = useMatchMedia('--mobile');

    const handlePackageChange: SelectProps['onChange'] = ({ selectedMultiple }) => {
        setPackages(selectedMultiple.map((option) => option.key as IconPackageName));
    };

    const Title = isMobile ? Typography.TitleMobile : Typography.Title;
    const SelectComponent = isMobile ? SelectMobile : Select;

    return (
        <div className='root'>
            <div className='header-wrapper'>
                <Title tag='h1' view='xlarge' font='styrene' className='header-title'>
                    Витрина иконок
                </Title>

                <div className='search-wrapper'>
                    <div className='bundle-select-wrapper'>
                        <SelectComponent
                            options={ICON_OPTIONS}
                            selected={packages}
                            Option={BaseOption}
                            multiple={true}
                            block={true}
                            placeholder='Bundle'
                            allowUnselect={true}
                            size='s'
                            onChange={handlePackageChange}
                        />
                    </div>

                    <Input
                        value={value}
                        className='search-input'
                        placeholder='Поиск по названию'
                        block={true}
                        leftAddons={<MagnifierMIcon />}
                        clear={true}
                        onChange={(e) => setValue(e.target.value)}
                        onClear={() => setValue('')}
                    />
                </div>
            </div>

            <React.Suspense
                fallback={
                    <div className='fallback-spinner'>
                        <Spinner visible={true} size='m' />
                    </div>
                }
            >
                <IconList value={value} packages={packages} />
            </React.Suspense>
        </div>
    );
};
