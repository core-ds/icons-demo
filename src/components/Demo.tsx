import React, { FC, MouseEvent, useRef, useState } from 'react';
import cn from 'classnames';
import { useVirtualizer } from '@tanstack/react-virtual';
import copy from 'copy-to-clipboard';

import { Input } from '@alfalab/core-components/input/modern';
import { Typography } from '@alfalab/core-components/typography/modern';
import { Select, SelectProps } from '@alfalab/core-components/select/modern';
import { SelectMobile } from '@alfalab/core-components/select/modern/mobile';
import { BaseOption, OptionsList } from '@alfalab/core-components/select/modern/shared';
import { useMatchMedia } from '@alfalab/core-components/mq/modern';
import { Toast } from '@alfalab/core-components/toast/modern';
import { BottomSheet } from '@alfalab/core-components/bottom-sheet/modern';
import { Popover } from '@alfalab/core-components/popover/modern';
import { CheckboxGroup } from '@alfalab/core-components/checkbox-group/modern';
import { Tag } from '@alfalab/core-components/tag/modern';
import { Plate } from '@alfalab/core-components/plate/modern';
import { IconButton } from '@alfalab/core-components/icon-button/modern';

import { useClickOutside } from '@alfalab/hooks';
import { MagnifierMIcon } from '@alfalab/icons/glyph/dist/MagnifierMIcon';
import { PlayCircleMIcon } from '@alfalab/icons-glyph/PlayCircleMIcon';

import {
    Asset,
    ClickedElement,
    CopyType,
    DeprecatedType,
    IconPackageName,
    RenderAnimationParams,
    RenderIconParams,
} from '../types';
import { BackToTopButton } from './BackToTopButton';
import {
    formatPackageName,
    getKeyParts,
    getKeys,
    getPackageNameAsset,
    noop,
} from '../shared/utils';

import animationJson from 'ui-primitives/animations/test.json';

import './Demo.css';
import LottieIcon from './LottieIcon';
import { getDeprecatedAssets } from '../shared/helpers';
import { ASSET_TO_PACKAGE_NAME } from '../shared/constants';
import { getOptionsList } from './option-list/OptionList';
import { ICON_META_FILES, ICONS } from '../shared/config';

const ASSET_OPTIONS = getKeys(Asset).map((key) => ({
    key: Asset[key],
    content: getPackageNameAsset(Asset[key], true),
}));

const initialState = {
    [IconPackageName.GLYPH]: false,
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

const isHeader = (idx: number) => idx === 0;
const isPackageName = (element: JSX.Element) => Boolean(element.props['data-package-title']);
const isWarning = (element: JSX.Element) => Boolean(element.props['data-package-warning']);
const isEmptySearchResult = (element: JSX.Element) => Boolean(element.props['data-empty-search']);

const estimateDesktopSize = () => 192;
const estimateMobileSize = () => 196;

const Demo: FC = () => {
    const [value, setValue] = useState('');
    const [packages, setPackages] = useState<Record<string, boolean>>({
        ...initialState,
        [IconPackageName.GLYPH]: true,
    });
    const [asset, setAsset] = useState<Asset>(Asset.ICONS);
    const [playAnimation, setPlayAnimation] = useState<string | null>(null);

    const [clickedElem, setClickedElem] = useState<ClickedElement | null>(null);
    const [toastParams, setToastParams] = useState({ open: false, text: '' });

    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverAnchorRef = useRef<HTMLDivElement>();
    const scrollerRef = useRef<HTMLDivElement>(null);

    const [mobile] = useMatchMedia('--mobile');
    const [tablet] = useMatchMedia('--tablet');

    const query = value.toLowerCase();
    const Title = mobile ? Typography.TitleMobile : Typography.Title;
    const SelectComponent = mobile ? SelectMobile : Select;

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

    const handleAssetChange: SelectProps['onChange'] = ({ selected }) => {
        const packageName = getPackageNameAsset(selected?.key as Asset);
        setPackages({ ...initialState, [packageName]: true });
        setAsset(selected?.key as Asset);
    };

    const renderHeader = () => {
        return (
            <div key='header'>
                <Title tag='h1' view='xlarge' font='styrene' className='header-title'>
                    Витрина ассетов
                </Title>

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
                        <SelectComponent
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
                    mobile,
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

    const renderIcon = (params: RenderIconParams) => {
        const { Icon, packageName, middle, ...rest } = params;
        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            popoverAnchorRef.current = e.currentTarget as HTMLDivElement;
            setClickedElem({ middle, packageName, ...rest });
        };

        const isWhite = middle.includes('white');
        const isDeprecatedIcon = getDeprecatedAssets().hasOwnProperty(middle);

        return (
            <div
                className={cn('icon-wrap', `icon-wrap-column-${columnsAmount}`, {
                    'icon-wrap_dark': isWhite,
                })}
                onClick={handleClick}
                key={`${packageName}-${middle}`}
            >
                {isDeprecatedIcon ? (
                    <Typography.Text
                        tag='div'
                        view='primary-small'
                        color={isWhite ? 'tertiary-inverted' : 'tertiary'}
                        className={cn('deprecated', {
                            deprecated_dark: isWhite,
                        })}
                    >
                        deprecated
                    </Typography.Text>
                ) : null}
                {Icon ? (
                    <Icon
                        className='icon'
                        color={
                            isDeprecatedIcon
                                ? 'var(--color-light-graphic-tertiary)'
                                : 'var(--color-light-graphic-primary)'
                        }
                    />
                ) : null}
                <Typography.Text
                    view='primary-small'
                    color={isWhite ? 'secondary-inverted' : 'secondary'}
                    className='icon-primitive-name'
                >
                    {middle}
                </Typography.Text>
            </div>
        );
    };

    const renderAnimation = ({
        animationName,
        packageName,
        animationData,
    }: RenderAnimationParams) => {
        const handleClick = () => {
            copy(JSON.stringify(animationData));
            setToastParams({
                open: true,
                text: 'JSON скопирован',
            });
        };

        const changeAnimationName = (name: string | null) => setPlayAnimation(name);

        const handleClickAnimation = (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            changeAnimationName(animationName);
        };

        const isWhite = animationName.includes('white');

        return (
            <div
                className={cn('animation-wrap', {
                    'animation-wrap_dark': isWhite,
                })}
                onClick={handleClick}
                key={`${packageName}-${animationName}`}
            >
                <IconButton
                    onClick={handleClickAnimation}
                    className='animation-icon'
                    view='tertiary'
                    size={48}
                    icon={PlayCircleMIcon}
                />
                {animationData ? (
                    <LottieIcon
                        name={animationName}
                        className='animation'
                        animationData={animationData}
                        play={playAnimation === animationName}
                        changeAnimationName={changeAnimationName}
                    />
                ) : null}

                <Typography.Text
                    view='primary-small'
                    color={isWhite ? 'secondary-inverted' : 'secondary'}
                    className='animation-primitive-name'
                >
                    {animationName}
                </Typography.Text>
            </div>
        );
    };

    const renderPackageTitle = (packageName: IconPackageName | Asset) => {
        return (
            <Title
                tag='h3'
                view='small'
                className='package-title'
                data-package-title
                key={packageName}
            >
                {formatPackageName(packageName)}
            </Title>
        );
    };

    const renderWarning = () => {
        return (
            <Plate
                data-package-warning
                key='animation'
                view='attention'
                title='Не для прода'
                limitContentWidth={false}
                border={false}
            >
                Примеры анимаций подготовлены для тестирования витрины ассетов, пожалуйста, не
                тяните их на прод
            </Plate>
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

    const columnsAmount = mobile ? 1 : tablet ? 3 : 4;

    const result: JSX.Element[] = [renderHeader()];

    const iconsByPackage: Record<IconPackageName | Asset.ANIMATION, JSX.Element[]> = {
        glyph: [],
        rocky: [],
        ios: [],
        android: [],
        corp: [],
        invest: [],
        logotype: [],
        flag: [],
        site: [],
        logo: [],
        'logo-am': [],
        'logo-corp': [],
        animation: [],
    };

    getKeys(ICONS).forEach((packageName) => {
        if (packages[packageName]) {
            const module = ICONS[packageName];

            if (!query) {
                iconsByPackage[packageName].push(renderPackageTitle(packageName));
            }

            getKeys(module).forEach((reactIconName) => {
                const iconName = reactIconName.toLowerCase();
                const iconInfo = ICON_META_FILES[packageName][reactIconName];

                const { description, ...rest } = iconInfo;

                const isMatch = !query || iconName.includes(query) || description.includes(query);

                if (isMatch) {
                    const IconComponent = module[reactIconName];

                    iconsByPackage[packageName].push(
                        renderIcon({
                            Icon: IconComponent,
                            packageName,
                            ...rest,
                        }),
                    );
                }
            });

            iconsByPackage[packageName].sort((a, b) => {
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

            result.push(...iconsByPackage[packageName]);
        }
    });

    if (asset === 'animation') {
        if (!query) {
            iconsByPackage[asset].push(renderPackageTitle(asset));
            iconsByPackage[asset].push(renderWarning());
        }

        getKeys(animationJson).forEach((animationName) => {
            const animationData = animationJson[animationName].animationData;

            const isMatch = !query || animationName.includes(query);

            if (isMatch) {
                iconsByPackage[asset].push(
                    renderAnimation({
                        animationName,
                        packageName: asset,
                        animationData,
                    }),
                );
            }
        });

        iconsByPackage[asset].sort((a, b) => {
            const keyA = a.key as string;
            const keyB = b.key as string;
            const keyPartsA = getKeyParts(keyA);
            const keyPartsB = getKeyParts(keyB);

            if (keyPartsA.toLowerCase() < keyPartsB.toLowerCase()) {
                return -1;
            }
            if (keyPartsA.toLowerCase() > keyPartsB.toLowerCase()) {
                return 1;
            }
            return 0;
        });

        result.push(...iconsByPackage[asset]);
    }

    const { grid } = result.reduce(
        (acc, curr, index) => {
            if (!acc.grid[acc.rowIndex]) {
                acc.grid[acc.rowIndex] = [];
            }

            if (isHeader(index) || isPackageName(curr) || isWarning(curr)) {
                if (acc.grid[acc.rowIndex].length) {
                    acc.rowIndex += 1;

                    if (!acc.grid[acc.rowIndex]) {
                        acc.grid[acc.rowIndex] = [];
                    }
                }

                acc.grid[acc.rowIndex].push(curr);
                acc.rowIndex += 1;
            } else {
                acc.grid[acc.rowIndex].push(curr);
            }

            if (acc.grid[acc.rowIndex]?.length === columnsAmount) {
                acc.rowIndex += 1;
            }

            return acc;
        },
        { grid: [] as JSX.Element[][], rowIndex: 0 },
    );

    //Только заголовок, т.е ничего не найдено
    if (query && grid.length === 1) {
        grid.push([renderEmptySearchResult()]);
    }

    const virtualizer = useVirtualizer({
        count: grid.length,
        getScrollElement: () => scrollerRef.current,
        overscan: 5,
        estimateSize: mobile ? estimateMobileSize : estimateDesktopSize,
    });

    const items = virtualizer.getVirtualItems();

    return (
        <div className='root'>
            <div ref={scrollerRef} className='list-scroller'>
                <div className='list-scroller-inner' style={{ height: virtualizer.getTotalSize() }}>
                    <div
                        className='icons-list'
                        style={{ transform: `translateY(${items[0].start}px)` }}
                    >
                        {items.map((virtualRow) => {
                            const rowItems = grid[virtualRow.index];
                            const header = isHeader(virtualRow.index);
                            const packageName = isPackageName(rowItems[0]);
                            const warning = isWarning(rowItems[0]);
                            const emptySearchResult =
                                virtualRow.index === 1 && isEmptySearchResult(rowItems[0]);
                            const listRow =
                                !emptySearchResult && !header && !packageName && !warning;

                            return (
                                <div
                                    key={virtualRow.index}
                                    className={cn({
                                        ['list-package-name']: packageName,
                                        ['list-warning']: warning,
                                        ['list-header-gap']: query && header,
                                        ['list-row']: listRow,
                                        [`list-row-${columnsAmount}`]: listRow,
                                        ['empty-search-result']: emptySearchResult,
                                    })}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                >
                                    {rowItems.map((item) => item)}
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
            {mobile ? (
                <BottomSheet
                    open={Boolean(clickedElem)}
                    onClose={handleDropdownClose}
                    contentClassName='mobile-copy-dropdown'
                >
                    {renderDropdown(clickedElem)}
                </BottomSheet>
            ) : (
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
            )}

            <BackToTopButton
                visible={items[0].index !== 0}
                onClick={() => scrollerRef.current?.scrollTo({ behavior: 'smooth', top: 0 })}
            />
        </div>
    );
};

export default Demo;
