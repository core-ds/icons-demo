import React, { FC, useState, ComponentType } from 'react';
import { useVirtual } from 'react-virtual';
import json from '@alfalab/icons/search.json';
import Modal, { Styles } from 'react-modal';
import Highlight from 'react-highlight';
import { CopyLineMIcon, CheckmarkHeavyMIcon } from '@alfalab/icons/glyph/dist';

import 'highlight.js/styles/tomorrow-night.css';

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

const COLUMNS_COUNT = 4;

Modal.setAppElement('#root');

const modalStyles: Styles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '500px',
        padding: '0',
        borderRadius: '10px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
};

export const IconList: FC<IconListProps> = ({ icons, value, packages }) => {
    // @ts-ignore
    const result: SearchResult = {};

    const [clickedElem, setClickedElem] = useState<ClickedElement | null>(null);
    const [copyed, setCopyed] = useState('');

    const onIconClick = (elem: ClickedElement) => {
        setClickedElem(elem);
    };

    const copyStr = (str: string, name: string) => {
        navigator.clipboard.writeText(str).then(() => {
            setCopyed(name);

            setTimeout(() => {
                setCopyed('');
            }, 2000);
        });
    };

    const getItemClassName = (iconName: string) => {
        let className = 'icon-wrap';

        if (iconName.includes('white')) {
            className += ' icon-wrap_dark';
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
                const iconInfo = json[packageName] && json[packageName][Icon];

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

                    const className = getItemClassName(iconName);

                    const onClick = () => {
                        onIconClick({
                            iconName: Icon,
                            packageName,
                            cdnLink: iconPrimitiveName
                                ? `https://alfabank.st/icons/${iconPrimitiveName}.svg`
                                : '',
                        });
                    };

                    const IconWrap = (
                        <div
                            className={className}
                            onClick={onClick}
                            key={`${packageName}-${iconName}`}
                        >
                            <IconComponent className='icon' />
                            <span className='icon-name'>{Icon}</span>
                            <span className='icon-name'>{iconPrimitiveName}</span>
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
        estimateSize: React.useCallback(() => 260, []),
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

            <Modal
                isOpen={Boolean(clickedElem)}
                onRequestClose={() => {
                    setClickedElem(null);
                    setCopyed('');
                }}
                style={modalStyles}
            >
                <div className='modal-header'>
                    <div className='modal-close-icon' onClick={() => setClickedElem(null)} />
                </div>

                {clickedElem && (
                    <div className='modal-body'>
                        <div className='highlight'>
                            <Highlight className='typescript'>
                                {`import { ${clickedElem.iconName} } from '@alfalab/icons-${clickedElem.packageName}';`}
                            </Highlight>

                            {copyed === 'react' ? (
                                <CheckmarkHeavyMIcon className='ok-icon' />
                            ) : (
                                <CopyLineMIcon
                                    className='modal-copy-icon'
                                    onClick={() => {
                                        copyStr(
                                            `import { ${clickedElem.iconName} } from '@alfalab/icons-${clickedElem.packageName}';`,
                                            'react',
                                        );
                                    }}
                                />
                            )}
                        </div>

                        {clickedElem.cdnLink && (
                            <div className='highlight'>
                                <pre className='highlight-link'>{clickedElem.cdnLink}</pre>

                                {copyed === 'link' ? (
                                    <CheckmarkHeavyMIcon className='ok-icon' />
                                ) : (
                                    <CopyLineMIcon
                                        className='modal-copy-icon'
                                        onClick={() => {
                                            copyStr(clickedElem.cdnLink || '', 'link');
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};
