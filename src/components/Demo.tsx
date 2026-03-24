import React, { FC, MouseEvent, useRef, useState } from 'react';
import cn from 'classnames';
import { useVirtualizer } from '@tanstack/react-virtual';
import copy from 'copy-to-clipboard';

import { Input } from '@alfalab/core-components/input/modern';
import { Typography } from '@alfalab/core-components/typography/modern';
import { SelectDesktop, SelectDesktopProps } from '@alfalab/core-components/select/desktop';
import { BaseOption, OptionsList } from '@alfalab/core-components/select/modern/shared';
import { Toast } from '@alfalab/core-components/toast/modern';
import { Popover } from '@alfalab/core-components/popover/modern';
import { CheckboxGroup } from '@alfalab/core-components/checkbox-group/modern';
import { Tag } from '@alfalab/core-components/tag/modern';

import { useClickOutside } from '@alfalab/hooks';
import { MagnifierMIcon } from '@alfalab/icons/glyph/dist/MagnifierMIcon';

import styles from './index.module.css';

import { Asset, ClickedElement, CopyType, DeprecatedType, IconPackageName } from '../types';
import { BackToTopButton } from './BackToTopButton';
import {
    formatPackageName,
    getKeyParts,
    getKeys,
    getPackageNameAsset,
    noop,
} from '../shared/utils';

import './Demo.css';
import { getDeprecatedAssets } from '../shared/helpers';
import { ASSET_TO_PACKAGE_NAME } from '../shared/constants';
import { getOptionsList } from './option-list/OptionList';
import { ICON_META_FILES, ICONS } from '../shared/config';
import { COLUMNS_AMOUNT } from '../const/columns';
import { IconCard } from './icon-card';
import { MetaInfo } from '../shared/config/types';

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

    const [clickedElem, setClickedElem] = useState<ClickedElement | null>(null);
    const [toastParams, setToastParams] = useState({ open: false, text: '' });

    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverAnchorRef = useRef<HTMLDivElement>();
    const scrollerRef = useRef<HTMLDivElement>(null);

    const query = value.toLowerCase();

    const handleDropdownClose = () => setClickedElem(null);

    useClickOutside(popoverRef, handleDropdownClose);

    const handleOptionAction = (type: DeprecatedType | CopyType, newName?: string) => {
        if (clickedElem) {
            if (Object.values(CopyType).includes(type as CopyType)) {
                if (type === CopyType.WEB_NAME && clickedElem.web) {
                    copy(clickedElem.web);
                }
                if (type === CopyType.WEB_COMPONENT && clickedElem.webComponent) {
                    copy(clickedElem.webComponent);
                }
                if (type === CopyType.ANDROID_NAME && clickedElem.android) {
                    copy(clickedElem.android);
                }
                if (type === CopyType.IOS_NAME && clickedElem.ios) {
                    copy(clickedElem.ios);
                }
                if (type === CopyType.MIDDLE_NAME) {
                    copy(clickedElem.middle);
                }
                if (type === CopyType.CDN_NAME && clickedElem.cdn) {
                    copy(clickedElem.cdn);
                }
                if (type === CopyType.CDN_URL && clickedElem.url) {
                    copy(clickedElem.url);
                }

                setToastParams({
                    open: true,
                    text: type === CopyType.WEB_COMPONENT ? 'Код скопирован' : 'Имя скопировано',
                });
            }

            if (type === DeprecatedType.DEPRECATED && newName) {
                setValue(newName);
                const replacePackage = newName.split('_')[0] as IconPackageName;
                if (!packages[replacePackage]) {
                    setPackages({ ...packages, [replacePackage]: true });
                }
            }

            handleDropdownClose();
        }
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

    const renderDropdown = (clickedElem: ClickedElement | null) => {
        const allDeprecatedIcons = getDeprecatedAssets();
        const { middle } = clickedElem || ({} as ClickedElement);
        const newName = allDeprecatedIcons[middle]?.replacement || '';
        const options = getOptionsList(middle, allDeprecatedIcons, clickedElem) || [];

        return (
            <OptionsList
                nativeScrollbar={true}
                options={options}
                Option={BaseOption}
                setSelectedItems={noop}
                toggleMenu={noop}
                getOptionProps={(option, index) => ({
                    Checkmark: null,
                    index,
                    option,
                    className: 'option',
                    innerProps: {
                        id: option.key,
                        onClick: () =>
                            handleOptionAction(option.key as CopyType | DeprecatedType, newName),
                        onMouseDown: noop,
                        onMouseMove: noop,
                        role: 'option',
                    },
                })}
            />
        );
    };

    const handleIconCardClick = (metaInfo: ClickedElement) => (e: MouseEvent) => {
        popoverAnchorRef.current = e.currentTarget as HTMLDivElement;
        setClickedElem({ ...metaInfo });
    };

    const renderPackageTitle = (packageName: IconPackageName | Asset) => {
        return (
            <Typography.Title
                tag='h3'
                view='small'
                className='package-title'
                data-package-title
                key={packageName}
            >
                {formatPackageName(packageName)}
            </Typography.Title>
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

    const result: {
        render?: JSX.Element;
        middle?: MetaInfo['middle'];
        packageName?: IconPackageName;
        Icon?: React.FC<Record<string, unknown>>;
        metaInfo?: ClickedElement;
        key: string;
        isTitle: boolean;
        isEmpty: boolean;
    }[] = [];

    getKeys(ICONS).forEach((packageName) => {
        if (packages[packageName]) {
            const module = ICONS[packageName];

            if (!query) {
                result.push({
                    render: renderPackageTitle(packageName),
                    isTitle: true,
                    isEmpty: false,
                    key: packageName,
                });
            }

            getKeys(module).forEach((reactIconName) => {
                const iconName = reactIconName.toLowerCase();
                const iconInfo = ICON_META_FILES[packageName][reactIconName];

                const { description, middle, ...rest } = iconInfo;

                const isMatch =
                    !query ||
                    iconName.includes(query) ||
                    middle.includes(query) ||
                    description.includes(query);

                if (isMatch) {
                    const IconComponent = module[reactIconName];

                    result.push({
                        middle,
                        packageName,
                        Icon: IconComponent,
                        metaInfo: {
                            packageName,
                            middle,
                            ...rest,
                        },
                        key: `${packageName}-${middle}`,
                        isTitle: false,
                        isEmpty: false,
                    });
                }
            });

            result.sort((a, b) => {
                const keyA = a.key as string;
                const keyB = b.key as string;
                const keyPartsA = getKeyParts(keyA);
                const keyPartsB = getKeyParts(keyB);
                const allDeprecatedIcons = getDeprecatedAssets();

                if (allDeprecatedIcons[keyPartsA]) {
                    return 1;
                } else if (allDeprecatedIcons[keyPartsB]) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    });

    const { grid } = result.reduce<{ grid: typeof result[]; rowIndex: number }>(
        (acc, current, index) => {
            if (!acc.grid[acc.rowIndex]) {
                acc.grid[acc.rowIndex] = [];
            }

            if (current.isTitle) {
                if (acc.grid[acc.rowIndex].length) {
                    acc.rowIndex += 1;

                    if (!acc.grid[acc.rowIndex]) {
                        acc.grid[acc.rowIndex] = [];
                    }
                }

                acc.grid[acc.rowIndex].push(current);
                acc.rowIndex += 1;
            } else {
                acc.grid[acc.rowIndex].push(current);
            }

            if (acc.grid[acc.rowIndex]?.length === COLUMNS_AMOUNT) {
                acc.rowIndex += 1;
            }

            return acc;
        },
        { grid: [], rowIndex: 0 },
    );

    //Только заголовок, т.е ничего не найдено
    if (query && grid.length === 0) {
        grid.push([
            {
                render: renderEmptySearchResult(),
                isTitle: false,
                isEmpty: true,
                key: 'empty-result',
            },
        ]);
    }

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
                            const rowItems = grid[virtualRow.index];
                            const packageName = rowItems[0].isTitle;
                            const listRow = !packageName;

                            return (
                                <div
                                    key={virtualRow.index}
                                    className={cn({
                                        ['list-package-name']: packageName,
                                        ['list-row']: listRow,
                                        [`list-row-${COLUMNS_AMOUNT}`]: listRow,
                                        ['empty-search-result']: rowItems[0].isEmpty,
                                    })}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                >
                                    {rowItems.map((item) => {
                                        const { middle, packageName, Icon, metaInfo } = item;

                                        if (middle && packageName && Icon && metaInfo) {
                                            const isWhite = middle.includes('white');
                                            const isDeprecatedIcon = getDeprecatedAssets().hasOwnProperty(
                                                middle,
                                            );

                                            return (
                                                <IconCard
                                                    key={middle}
                                                    isWhite={isWhite}
                                                    packageName={packageName}
                                                    isDeprecatedIcon={isDeprecatedIcon}
                                                    middle={middle}
                                                    Icon={Icon}
                                                    onClick={handleIconCardClick({
                                                        ...metaInfo,
                                                    })}
                                                />
                                            );
                                        }

                                        if (item.render) {
                                            return item.render;
                                        }

                                        return null;
                                    })}
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

            <Popover
                open={Boolean(clickedElem)}
                useAnchorWidth={true}
                anchorElement={popoverAnchorRef.current || null}
                popperClassName='desktop-copy-dropdown-inner'
                position='bottom'
                offset={[0, 4]}
                preventFlip={false}
                ref={popoverRef}
            >
                <div className='popover-options-list'>{renderDropdown(clickedElem)}</div>
            </Popover>

            <BackToTopButton
                visible={items.length > 0 && items[0].index !== 0}
                onClick={() => scrollerRef.current?.scrollTo({ behavior: 'smooth', top: 0 })}
            />
        </div>
    );
};

export default Demo;
