import React, { FC, useRef, useState } from 'react';
import cn from 'classnames';
import { useVirtualizer } from '@tanstack/react-virtual';
import copy from 'copy-to-clipboard';

import { Input } from '@alfalab/core-components/input/modern';
import { Typography } from '@alfalab/core-components/typography/modern';
import {
    Select,
    BaseOption,
    SelectMobile,
    SelectProps,
    OptionsList,
} from '@alfalab/core-components/select/modern';
import { useMatchMedia } from '@alfalab/core-components/mq/modern';
import { Toast } from '@alfalab/core-components/toast/modern';
import { BottomSheet } from '@alfalab/core-components/bottom-sheet/modern';
import { Popover } from '@alfalab/core-components/popover/modern';
import { useClickOutside } from '@alfalab/hooks';
import { MagnifierMIcon } from '@alfalab/icons/glyph/dist/MagnifierMIcon';
import { CopyLineMIcon } from '@alfalab/icons/glyph/dist/CopyLineMIcon';

import {
    AnyIcon,
    ClickedElement,
    CopyType,
    IconPackageName,
    IconsInfo,
    RenderIconParams,
} from '../types';
import { BackToTopButton } from './BackToTopButton';
import { fillIconInfo, getKeys, noop, importAllIcons, formatPackageName } from '../utils';

import iconsInfo from '@alfalab/icons/search.json';

import './Demo.css';

const ICON_OPTIONS = getKeys(IconPackageName).map((key) => ({
    key: IconPackageName[key],
    content: formatPackageName(IconPackageName[key]),
}));

const getOptionContent = (text: string) => (
    <div className='copy-option-content'>
        <Typography.Text view='component' color='primary'>
            {text}
        </Typography.Text>

        <CopyLineMIcon />
    </div>
);

const COPY_OPTIONS = [
    { key: CopyType.NAME, content: getOptionContent('Имя иконки') },
    { key: CopyType.REACT_NAME, content: getOptionContent('Имя реакт компонента') },
    { key: CopyType.IMPORT_CODE, content: getOptionContent('Код для импорта') },
];

const IconsGlyph: AnyIcon = {};
const IconsRocky: AnyIcon = {};
const IconsIos: AnyIcon = {};
const IconsAndroid: AnyIcon = {};
const IconsCorp: AnyIcon = {};
const IconsLogotype: AnyIcon = {};
const IconsFlag: AnyIcon = {};
const IconsClassic: AnyIcon = {};
const IconsInvest: AnyIcon = {};

importAllIcons(require.context('@alfalab/icons/glyph/dist', false, /Icon\.js$/), IconsGlyph);
importAllIcons(require.context('@alfalab/icons/rocky/dist', false, /Icon\.js$/), IconsRocky);
importAllIcons(require.context('@alfalab/icons/ios/dist', false, /Icon\.js$/), IconsIos);
importAllIcons(require.context('@alfalab/icons/android/dist', false, /Icon\.js$/), IconsAndroid);
importAllIcons(require.context('@alfalab/icons/corp/dist', false, /Icon\.js$/), IconsCorp);
importAllIcons(require.context('@alfalab/icons/logotype/dist', false, /Icon\.js$/), IconsLogotype);
importAllIcons(require.context('@alfalab/icons/flag/dist', false, /Icon\.js$/), IconsFlag);
importAllIcons(require.context('@alfalab/icons/classic/dist', false, /Icon\.js$/), IconsClassic);
importAllIcons(require.context('@alfalab/icons/invest/dist', false, /Icon\.js$/), IconsInvest);

const ICONS = {
    [IconPackageName.GLYPH]: IconsGlyph,
    [IconPackageName.ROCKY]: IconsRocky,
    [IconPackageName.IOS]: IconsIos,
    [IconPackageName.ANDROID]: IconsAndroid,
    [IconPackageName.CORP]: IconsCorp,
    [IconPackageName.LOGOTYPE]: IconsLogotype,
    [IconPackageName.FLAG]: IconsFlag,
    [IconPackageName.CLASSIC]: IconsClassic,
    [IconPackageName.INVEST]: IconsInvest,
};

const ICONS_INFO = fillIconInfo(ICONS, (iconsInfo as unknown) as IconsInfo);

const isHeader = (idx: number) => idx === 0;
const isPackageName = (element: JSX.Element) => Boolean(element.props['data-package-title']);
const isEmptySearchResult = (element: JSX.Element) => Boolean(element.props['data-empty-search']);

const estimateDesktopSize = () => 192;
const estimateMobileSize = () => 196;

const Demo: FC = () => {
    const [value, setValue] = useState('');
    const [packages, setPackages] = useState<IconPackageName[]>([IconPackageName.GLYPH]);
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

    const handleCopyDropdownClose = () => setClickedElem(null);

    useClickOutside(popoverRef, handleCopyDropdownClose);

    const handleCopy = (type: CopyType) => {
        if (clickedElem) {
            if (type === CopyType.NAME) {
                copy(clickedElem.iconName);
            }
            if (type === CopyType.REACT_NAME) {
                copy(clickedElem.reactIconName);
            }
            if (type === CopyType.IMPORT_CODE) {
                copy(
                    `import { ${clickedElem.reactIconName} } from '@alfalab/icons-${clickedElem.packageName}/${clickedElem.reactIconName}';`,
                );
            }

            setToastParams({
                open: true,
                text: type === CopyType.IMPORT_CODE ? 'Код скопирован' : 'Имя скопировано',
            });
            handleCopyDropdownClose();
        }
    };

    const handlePackageChange: SelectProps['onChange'] = ({ selectedMultiple }) => {
        setPackages(selectedMultiple.map((option) => option.key as IconPackageName));
    };

    const renderHeader = () => {
        return (
            <div key='header'>
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
        );
    };

    const renderCopyDropdown = () => {
        return (
            <OptionsList
                nativeScrollbar={true}
                options={COPY_OPTIONS}
                Option={BaseOption}
                setSelectedItems={noop}
                toggleMenu={noop}
                getOptionProps={(option, index) => ({
                    Checkmark: null,
                    index,
                    option,
                    mobile,
                    className: 'copy-option',
                    innerProps: {
                        id: option.key,
                        onClick: () => handleCopy(option.key as CopyType),
                        onMouseDown: noop,
                        onMouseMove: noop,
                        role: 'option',
                    },
                })}
            />
        );
    };

    const renderIcon = ({
        reactIconName,
        iconPrimitiveName,
        packageName,
        Icon,
    }: RenderIconParams) => {
        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            popoverAnchorRef.current = e.currentTarget as HTMLDivElement;
            setClickedElem({
                reactIconName,
                iconName: iconPrimitiveName,
                packageName,
                cdnLink: iconPrimitiveName
                    ? `https://alfabank.gcdn.co/icons/${iconPrimitiveName}.svg`
                    : '',
            });
        };

        const isWhite = iconPrimitiveName.includes('white');

        return (
            <div
                className={cn('icon-wrap', `icon-wrap-column-${columnsAmount}`, {
                    'icon-wrap_dark': isWhite,
                })}
                onClick={handleClick}
                key={`${packageName}-${iconPrimitiveName}`}
            >
                {Icon ? <Icon className='icon' /> : null}

                <Typography.Text
                    view='primary-small'
                    color={isWhite ? 'secondary-inverted' : 'secondary'}
                    className='icon-primitive-name'
                >
                    {iconPrimitiveName}
                </Typography.Text>
            </div>
        );
    };

    const renderPackageTitle = (packageName: IconPackageName) => {
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

    getKeys(ICONS).forEach((packageName) => {
        if (packages.includes(packageName)) {
            const module = ICONS[packageName];

            if (!query) {
                result.push(renderPackageTitle(packageName));
            }

            getKeys(module).forEach((reactIconName) => {
                const iconName = reactIconName.toLowerCase();
                const iconInfo = ICONS_INFO[packageName][reactIconName];
                const iconDescription = iconInfo.figmaDescription.toLowerCase();
                const iconPrimitiveName = iconInfo.svgIconName;

                const isMatch =
                    !query ||
                    iconName.includes(query) ||
                    iconPrimitiveName.includes(query) ||
                    iconDescription.includes(query);

                if (isMatch) {
                    const IconComponent = module[reactIconName];

                    result.push(
                        renderIcon({
                            reactIconName,
                            iconPrimitiveName,
                            packageName,
                            Icon: IconComponent,
                        }),
                    );
                }
            });
        }
    });

    const { grid } = result.reduce(
        (acc, curr, index) => {
            if (!acc.grid[acc.rowIndex]) {
                acc.grid[acc.rowIndex] = [];
            }

            if (isHeader(index) || isPackageName(curr)) {
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
                            const emptySearchResult =
                                virtualRow.index === 1 && isEmptySearchResult(rowItems[0]);
                            const listRow = !emptySearchResult && !header && !packageName;

                            return (
                                <div
                                    key={virtualRow.index}
                                    className={cn({
                                        ['list-package-name']: packageName,
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
                open={toastParams.open}
                onClose={() => setToastParams((prev) => ({ ...prev, open: false }))}
                style={{ left: '50%', transform: 'translateX(-50%)' }}
            >
                <Typography.Text view='component'>{toastParams.text}</Typography.Text>
            </Toast>
            {mobile ? (
                <BottomSheet
                    open={Boolean(clickedElem)}
                    onClose={handleCopyDropdownClose}
                    contentClassName='mobile-copy-dropdown'
                >
                    {renderCopyDropdown()}
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
                    <div className='popover-options-list'>{renderCopyDropdown()}</div>
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
