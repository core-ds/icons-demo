import React, { FC, useRef, useState } from 'react';
import { useVirtual } from 'react-virtual';
import json from '@alfalab/icons/search.json';
import decamelize from 'decamelize';
import { useMatchMedia } from '@alfalab/core-components/mq/modern';
import { Typography } from '@alfalab/core-components/typography/modern';
import { Popover } from '@alfalab/core-components/popover/modern';
import { BaseOption, OptionsList } from '@alfalab/core-components/select/modern';
import { Toast } from '@alfalab/core-components/toast/modern';
import { BottomSheet } from '@alfalab/core-components/bottom-sheet/modern';
import { CopyLineMIcon } from '@alfalab/icons-glyph/CopyLineMIcon';
import { useClickOutside } from '@alfalab/hooks';
import cn from 'classnames';

import { ClickedElement, CopyType, IconListProps, IconPackageName, SearchResult } from './types';

const PACKAGE_ALIAS: { [key: string]: string } = {
    classic: 'icon',
};

const noop = () => {};

const getOptionContent = (text: string) => (
    <div className='option-content'>
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

export const getPackageName = (iconPrefix: string) => PACKAGE_ALIAS[iconPrefix] || iconPrefix;

const getModule = (packageName: IconPackageName) => {
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
            return IconsIos;
        case IconPackageName.ANDROID:
            return IconsAndroid;
    }
};

const IconsGlyph = {};
const IconsClassic = {};
const IconsFlag = {};
const IconsLogotype = {};
const IconsCorp = {};
const IconsRocky = {};
const IconsIos = {};
const IconsAndroid = {};

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

const ICONS = {
    [IconPackageName.GLYPH]: IconsGlyph,
    [IconPackageName.CLASSIC]: IconsClassic,
    [IconPackageName.FLAG]: IconsFlag,
    [IconPackageName.LOGOTYPE]: IconsLogotype,
    [IconPackageName.CORP]: IconsCorp,
    [IconPackageName.ROCKY]: IconsRocky,
    [IconPackageName.IOS]: IconsIos,
    [IconPackageName.ANDROID]: IconsAndroid,
};

const estimateDesktopSize = () => 192;
const estimateMobileSize = () => 196;

const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

const IconList: FC<IconListProps> = ({ value, packages }) => {
    const result = {} as SearchResult;

    const [clickedElem, setClickedElem] = useState<ClickedElement | null>(null);
    const [toastParams, setToastParams] = useState({ open: false, text: '' });

    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverAnchorRef = useRef<HTMLDivElement>();
    const parentRef = useRef<HTMLDivElement>(null);

    const [mobile] = useMatchMedia('--mobile');
    const [tablet] = useMatchMedia('--tablet');

    const handleCopyDropdownClose = () => setClickedElem(null);

    useClickOutside(popoverRef, handleCopyDropdownClose);

    const copyStr = (str = '') => {
        void navigator.clipboard.writeText(str);
    };

    const onIconClick = (elem: ClickedElement) => {
        setClickedElem(elem);
    };

    const handleCopy = (type: CopyType) => {
        if (clickedElem) {
            switch (type) {
                case CopyType.NAME:
                    copyStr(clickedElem.iconName);
                    break;

                case CopyType.REACT_NAME:
                    copyStr(clickedElem.reactIconName);
                    break;

                case CopyType.IMPORT_CODE:
                    copyStr(
                        `import { ${clickedElem.reactIconName} } from '@alfalab/icons-${clickedElem.packageName}/${clickedElem.reactIconName}';`,
                    );
                    break;
            }

            setToastParams({
                open: true,
                text: type === CopyType.IMPORT_CODE ? 'Код скопирован' : 'Имя скопировано',
            });
            handleCopyDropdownClose();
        }
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

    const columnsAmount = mobile ? 1 : tablet ? 3 : 4;

    Object.keys(ICONS).forEach((str) => {
        let packageName = str as IconPackageName;

        if (packages.includes(packageName)) {
            Object.keys(ICONS[packageName]).forEach((Icon) => {
                const searchValue = value.toLowerCase();
                const iconName = Icon.toLowerCase();
                // @ts-ignore
                let iconInfo = json[packageName] && json[packageName][Icon];

                if (!iconInfo) {
                    const arr = decamelize(Icon.replace(/Icon$/, '')).split('_');

                    let lastElem = arr[arr.length - 1];

                    let color = '';
                    let name;
                    let size;

                    if (sizes.includes(lastElem)) {
                        size = lastElem;
                        name = arr.slice(0, arr.length - 1).join('-');
                    } else {
                        color = lastElem;
                        size = arr[arr.length - 2];
                        name = arr.slice(0, arr.length - 2).join('-');
                    }

                    let svgIconName = `${name}_${size}${color ? `_${color}` : ''}`;

                    if (packageName !== 'ios' && packageName !== 'android') {
                        svgIconName = `${getPackageName(packageName)}_${svgIconName}`;
                    }

                    iconInfo = { svgIconName };

                    // @ts-ignore
                    if (json[packageName] && json[packageName][Icon]) {
                        // @ts-ignore
                        json[packageName][Icon] = iconInfo;
                    }
                }

                const iconDescription =
                    iconInfo && iconInfo.figmaDescription
                        ? iconInfo.figmaDescription.toLowerCase()
                        : '';

                const iconPrimitiveName = (iconInfo && iconInfo.svgIconName) ?? '';

                const matchByName =
                    iconName.includes(searchValue) || iconPrimitiveName.includes(searchValue);
                const matchByDescription = iconDescription && iconDescription.includes(searchValue);

                if (matchByName || matchByDescription) {
                    const module = getModule(packageName);
                    // @ts-ignore
                    const IconComponent = module[Icon];

                    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
                        popoverAnchorRef.current = e.currentTarget as HTMLDivElement;
                        onIconClick({
                            reactIconName: Icon,
                            iconName: iconPrimitiveName,
                            packageName,
                            cdnLink: iconPrimitiveName
                                ? `https://alfabank.gcdn.co/icons/${iconPrimitiveName}.svg`
                                : '',
                        });
                    };

                    const IconWrap = (
                        <div
                            className={cn('icon-wrap', `icon-wrap-column-${columnsAmount}`, {
                                'icon-wrap_dark': iconName.includes('white'),
                            })}
                            onClick={onClick}
                            key={`${packageName}-${iconName}`}
                        >
                            {IconComponent ? <IconComponent className='icon' /> : null}
                            <Typography.Text
                                view='primary-small'
                                color={
                                    iconName.includes('white') ? 'secondary-inverted' : 'secondary'
                                }
                                className='icon-primitive-name'
                            >
                                {iconPrimitiveName}
                            </Typography.Text>
                        </div>
                    );

                    if (!result[packageName]) {
                        result[packageName] = {
                            matchByDescriptionArr: [],
                            matchByNameArr: [],
                        };
                    }

                    if (matchByName) {
                        result[packageName].matchByNameArr.push(IconWrap);
                    } else {
                        result[packageName].matchByDescriptionArr.push(IconWrap);
                    }
                }
            });
        }
    });

    let resultArray: JSX.Element[] = [];

    Object.keys(result).forEach((str) => {
        let packageName = str as IconPackageName;

        resultArray = [
            ...resultArray,
            ...result[packageName].matchByNameArr,
            ...result[packageName].matchByDescriptionArr,
        ];
    });

    let resultGrid = resultArray.reduce((acc, curr, index) => {
        const columnIndex = Math.floor(index / columnsAmount);

        if (!acc[columnIndex]) {
            acc[columnIndex] = [];
        }

        acc[columnIndex].push(curr);

        return acc;
    }, [] as JSX.Element[][]);

    const rowVirtualizer = useVirtual({
        size: resultGrid.length,
        parentRef,
        overscan: 5,
        estimateSize: mobile ? estimateMobileSize : estimateDesktopSize,
    });

    return (
        <>
            <div ref={parentRef} className='list-scroller'>
                <div className='icons-list' style={{ height: `${rowVirtualizer.totalSize}px` }}>
                    {rowVirtualizer.virtualItems.map((virtualRow) => {
                        const rowItems = resultGrid[virtualRow.index];

                        return (
                            rowItems && (
                                <div
                                    key={virtualRow.index}
                                    className='list-row'
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {rowItems.map((item) => item)}
                                </div>
                            )
                        );
                    })}
                </div>
            </div>

            <Toast
                open={toastParams.open}
                onClose={() => setToastParams((prev) => ({ ...prev, open: false }))}
                style={{ left: '50%', transform: 'translateX(-50%)' }}
            >
                {toastParams.text}
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
        </>
    );
};

export default IconList;
