import React, { FC, useState, ComponentType } from 'react';
import { useVirtual } from 'react-virtual';
import json from '@alfalab/icons/search.json';

import { getModule } from './Demo';

import { IconPackageName, Packages, ClickedElement, SearchResult } from './types';

type IconPackage = {
    [key: string]: ComponentType;
};

type IconListProps = {
    icons: {
        [key in IconPackageName]: IconPackage;
    };
    value: string;
    packages: Packages;
};

const COLUMNS_COUNT = 5;

export const IconList: FC<IconListProps> = ({ icons, value, packages }) => {
    // @ts-ignore
    const result: SearchResult = {};

    const [clickedElem, setClickedElem] = useState<ClickedElement>({});

    const onIconClick = ({ iconName, packageName }: ClickedElement) => {
        const importStr = `import { ${iconName} } from '@alfalab/icons-${packageName}'`;

        navigator.clipboard.writeText(importStr).then(() => {
            setClickedElem({ iconName, packageName });

            setTimeout(() => {
                setClickedElem({});
            }, 2000);
        });
    };

    const getItemClassName = (iconName: string, clicked: boolean) => {
        let className = 'icon-wrap';

        if (iconName.includes('white')) {
            className += ' icon-wrap_dark';
        }

        if (clicked) {
            className += ' icon-wrap_clicked';
        }

        return className;
    };

    Object.keys(icons).forEach((str) => {
        let packageName = str as IconPackageName;

        if (packages[packageName]) {
            Object.keys(icons[packageName]).forEach((Icon) => {
                const searchValue = value.toLowerCase();
                const iconName = Icon.toLowerCase();
                // @ts-ignore
                const iconInfo = json[packageName][Icon];
                const iconDescription =
                    iconInfo && iconInfo.figmaDescription
                        ? iconInfo.figmaDescription.toLowerCase()
                        : '';

                const matchByName = iconName.includes(searchValue);
                const matchByDescription = iconDescription && iconDescription.includes(searchValue);

                if (matchByName || matchByDescription) {
                    const module = getModule(packageName);
                    // @ts-ignore
                    const IconComponent = module[Icon];
                    const clicked =
                        packageName === clickedElem.packageName && Icon === clickedElem.iconName;

                    const className = getItemClassName(iconName, clicked);

                    const onClick = () => {
                        onIconClick({ iconName: Icon, packageName });
                    };

                    const IconWrap = (
                        <div
                            className={className}
                            onClick={onClick}
                            key={`${packageName}-${iconName}`}
                        >
                            <IconComponent className='icon' />
                            <span className='icon-name'>{clicked ? 'Скопировано!' : Icon}</span>
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

        resultArray = [...resultArray, ...result[packageName].matchByNameArr];
    });

    Object.keys(result).forEach((str) => {
        let packageName = str as IconPackageName;

        resultArray = [...resultArray, ...result[packageName].matchByDescriptionArr];
    });

    const parentRef = React.useRef<HTMLDivElement>(null);

    let resultGrid = resultArray.reduce((acc, curr, index) => {
        const columnIndex = Math.floor(index / COLUMNS_COUNT);

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
        estimateSize: React.useCallback(() => 200, []),
    });

    return (
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
    );
};
