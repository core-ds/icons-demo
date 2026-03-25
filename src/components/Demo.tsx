import React, { FC, useRef, useState } from 'react';
import cn from 'classnames';
import { useVirtualizer } from '@tanstack/react-virtual';
import copy from 'copy-to-clipboard';

import { Input } from '@alfalab/core-components/input/modern';
import { Typography } from '@alfalab/core-components/typography/modern';
import { SelectDesktop, SelectDesktopProps } from '@alfalab/core-components/select/desktop';
import { BaseOption } from '@alfalab/core-components/select/modern/shared';
import { Toast } from '@alfalab/core-components/toast/modern';
import { CheckboxGroup } from '@alfalab/core-components/checkbox-group/modern';
import { Tag } from '@alfalab/core-components/tag/modern';

import { MagnifierMIcon } from '@alfalab/icons/glyph/dist/MagnifierMIcon';

import styles from './index.module.css';

import { Asset, CopyType, DeprecatedType, IconPackageName } from '../types';
import { BackToTopButton } from './BackToTopButton';
import { formatPackageName, getKeys, getPackageNameAsset } from '../shared/utils';

import './Demo.css';
import { ASSET_TO_PACKAGE_NAME } from '../shared/constants';
import { COLUMNS_AMOUNT } from '../const/columns';
import { IconCard } from './icon-card';
import { IconCardOptionsList } from './option-list';
import { buildGrid } from './build-grid';
import { PackageName } from './package-name';

const ASSET_OPTIONS = getKeys(Asset).map((key) => ({
    key: Asset[key],
    content: getPackageNameAsset(Asset[key], true),
}));

const initialState: Record<IconPackageName, boolean> = {
    [IconPackageName.GLYPH]: false,
    [IconPackageName.GLYPH_26]: false,
    [IconPackageName.ROCKY]: false,
    [IconPackageName.IOS]: false,
    [IconPackageName.ANDROID]: false,
    [IconPackageName.CORP]: false,
    [IconPackageName.FLAG]: false,
    [IconPackageName.SITE]: false,
    [IconPackageName.INVEST]: false,
    [IconPackageName.LOGOTYPE]: false,
    [IconPackageName.LOGO]: false,
    [IconPackageName.LOGO_AM]: false,
    [IconPackageName.LOGO_CORP]: false,
};

const estimateDesktopSize = () => 192;

const Demo: FC = () => {
    const [value, setValue] = useState('');
    const [packages, setPackages] = useState<Record<string, boolean>>({
        ...initialState,
        [IconPackageName.GLYPH]: true,
    });
    const [asset, setAsset] = useState<Asset>(Asset.ICONS);

    const [toastParams, setToastParams] = useState({ open: false, text: '' });

    const scrollerRef = useRef<HTMLDivElement>(null);

    const query = value.toLowerCase();

    const handleOptionItemClick = (type: string, value: string) => {
        if (type === DeprecatedType.DEPRECATED && value) {
            setValue(value);

            const replacePackage = value.split('_')[0] as IconPackageName;

            if (!packages[replacePackage]) {
                setPackages({ ...packages, [replacePackage]: true });
            }

            return;
        }

        copy(value);

        setToastParams({
            open: true,
            text: type === CopyType.WEB_COMPONENT ? 'Код скопирован' : 'Имя скопировано',
        });
    };

    const handleOptionsListClick = (key: string, value: string, callback: () => void) => {
        handleOptionItemClick(key, value);
        callback();
    };

    const handlePackageChange = (payload: { checked: boolean; name?: string }) => {
        if (!payload.name) return;
        setPackages({ ...packages, [payload.name]: payload.checked });
    };

    const handleAssetChange: SelectDesktopProps['onChange'] = ({ selected }) => {
        const packageName = getPackageNameAsset(selected?.key as Asset);
        setPackages({ ...initialState, [packageName]: true });
        setAsset(selected?.key as Asset);
    };

    const renderHeader = () => {
        return (
            <div className={styles.header}>
                <Typography.Title tag='h1' view='xlarge' font='styrene' className='header-title'>
                    Витрина ассетов
                </Typography.Title>

                <div className='search-wrapper'>
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
                    <div className='asset-select-wrapper'>
                        <SelectDesktop
                            options={ASSET_OPTIONS}
                            selected={asset}
                            Option={BaseOption}
                            block={true}
                            placeholder='Bundle'
                            size='s'
                            onChange={handleAssetChange}
                        />
                    </div>
                </div>

                {['icons', 'logotype'].includes(asset) ? (
                    <CheckboxGroup
                        onChange={(_, payload) => handlePackageChange(payload)}
                        direction='horizontal'
                        type='tag'
                        className='bundle-group-wrapper'
                    >
                        {ASSET_TO_PACKAGE_NAME[asset].map((assetItem) => (
                            <Tag
                                name={assetItem.value}
                                checked={packages[assetItem.value]}
                                shape='rectangular'
                                value={assetItem.value}
                                key={assetItem.value}
                                view='filled'
                                size='xxs'
                            >
                                {assetItem.label}
                            </Tag>
                        ))}
                    </CheckboxGroup>
                ) : null}
            </div>
        );
    };

    const renderEmptySearchResult = () => (
        <Typography.Text
            key='emtpty-result'
            view='primary-small'
            color='secondary'
            className='empty-search-result'
            data-empty-search
        >
            Ничего не нашлось, попробуйте изменить запрос
        </Typography.Text>
    );

    const grid = buildGrid({ packages, query });

    const virtualizer = useVirtualizer({
        count: grid.length,
        getScrollElement: () => scrollerRef.current,
        overscan: 5,
        estimateSize: estimateDesktopSize,
    });

    const items = virtualizer.getVirtualItems();

    return (
        <div className='root'>
            <div ref={scrollerRef} className='list-scroller'>
                {renderHeader()}

                <div className='list-scroller-inner' style={{ height: virtualizer.getTotalSize() }}>
                    <div
                        className='icons-list'
                        style={{ transform: `translateY(${items[0]?.start ?? 0}px)` }}
                    >
                        {items.map((virtualRow) => {
                            const row = grid[virtualRow.index];
                            const isTitleRow = row.type === 'title';
                            const isIconsRow = row.type === 'icons';
                            const isEmptyRow = row.type === 'empty';

                            return (
                                <div
                                    key={row.key}
                                    className={cn({
                                        ['list-package-name']: isTitleRow,
                                        ['list-row']: isIconsRow,
                                        [`list-row-${COLUMNS_AMOUNT}`]: isIconsRow,
                                        ['empty-search-result']: isEmptyRow,
                                    })}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                >
                                    {isTitleRow && <PackageName packageName={row.packageName} />}
                                    {isEmptyRow && renderEmptySearchResult()}
                                    {isIconsRow &&
                                        row.items.map(
                                            ({ middle, packageName, Icon, dropDownData }) => (
                                                <IconCard
                                                    key={middle}
                                                    packageName={packageName}
                                                    middle={middle}
                                                    Icon={Icon}
                                                >
                                                    {(onClose) => (
                                                        <IconCardOptionsList
                                                            data={dropDownData}
                                                            onClick={(key, value) =>
                                                                handleOptionsListClick(
                                                                    key,
                                                                    value,
                                                                    onClose,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </IconCard>
                                            ),
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Toast
                title={toastParams.text}
                open={toastParams.open}
                onClose={() => setToastParams((prev) => ({ ...prev, open: false }))}
                style={{ left: '50%', transform: 'translateX(-53%)' }}
            />

            <BackToTopButton
                visible={items.length > 0 && items[0].index !== 0}
                onClick={() => scrollerRef.current?.scrollTo({ behavior: 'smooth', top: 0 })}
            />
        </div>
    );
};

export default Demo;
