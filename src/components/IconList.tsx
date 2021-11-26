import React, { FC, useState, ComponentType } from 'react';
import { useVirtual } from 'react-virtual';
import json from '@alfalab/icons/search.json';
import Modal, { Styles } from 'react-modal';
import Highlight from 'react-highlight';
import decamelize from 'decamelize';
import { CopyLineMIcon } from '@alfalab/icons/glyph/dist/CopyLineMIcon';
import { CheckmarkHeavyMIcon } from '@alfalab/icons/glyph/dist/CheckmarkHeavyMIcon';
import { useMatchMedia } from '@alfalab/core-components-mq';
import qs from 'querystring';
import cn from 'classnames';

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

Modal.setAppElement('#root');

const PACKAGE_ALIAS: { [key: string]: string } = {
    classic: 'icon',
};

export const getPackageName = (iconPrefix: string) => PACKAGE_ALIAS[iconPrefix] || iconPrefix;

const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export const IconList: FC<IconListProps> = ({ icons, value, packages }) => {
    // @ts-ignore
    const result: SearchResult = {};

    const [clickedElem, setClickedElem] = useState<ClickedElement | null>(null);
    const [copyed, setCopyed] = useState('');

    const { platform = 'web' } = qs.parse(document.location.search.replace(/^\?/, ''));

    const onIconClick = (elem: ClickedElement) => {
        if (platform === 'web') {
            setClickedElem(elem);
        }
    };

    const copyStr = (str: string, name: string) => {
        navigator.clipboard.writeText(str).then(() => {
            setCopyed(name);

            setTimeout(() => {
                setCopyed('');
            }, 2000);
        });
    };

    Object.keys(icons).forEach((str) => {
        let packageName = str as IconPackageName;

        if (packages[packageName]) {
            Object.keys(icons[packageName]).forEach((Icon) => {
                const searchValue = value.toLowerCase();
                const iconName = Icon.toLowerCase();
                // @ts-ignore
                let iconInfo = json[packageName] && json[packageName][Icon];

                if (!iconInfo) {
                    const arr = decamelize(Icon.replace(/Icon$/, '')).split('_');

                    let lastElem = arr[arr.length - 1];

                    let color = '';
                    let name = '';
                    let size = '';

                    if (sizes.includes(lastElem)) {
                        size = lastElem;
                        name = arr.slice(0, arr.length - 1).join('-');
                    } else {
                        color = lastElem;
                        size = arr[arr.length - 2];
                        name = arr.slice(0, arr.length - 2).join('-');
                    }

                    const svgIconName = `${getPackageName(packageName)}_${name}_${size}${
                        color ? `_${color}` : ''
                    }`;

                    iconInfo = { svgIconName };

                    // @ts-ignore
                    json[packageName][Icon] = iconInfo;
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
                            className={cn('icon-wrap', {
                                'icon-wrap_dark': iconName.includes('white'),
                                'icon-wrap_interactive': platform === 'web',
                            })}
                            onClick={onClick}
                            key={`${packageName}-${iconName}`}
                        >
                            {IconComponent ? <IconComponent className='icon' /> : null}
                            {platform === 'web' && <span className='icon-name'>{Icon}</span>}
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

    const [mobile] = useMatchMedia('--mobile');
    const [tablet] = useMatchMedia('--tablet');

    const columnsAmount = mobile ? 1 : tablet ? 2 : 4;

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
        estimateSize: React.useCallback(() => 260, []),
    });

    const modalStyles: Styles = {
        content: {
            width: mobile || tablet ? '100%' : 'auto',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '0',
            borderRadius: '10px',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
    };

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
                                {`import { ${clickedElem.iconName} } from '@alfalab/icons-${clickedElem.packageName}/${clickedElem.iconName}';`}
                            </Highlight>

                            <div
                                className='copy-button-wrapper'
                                onClick={() => {
                                    copyStr(
                                        `import { ${clickedElem.iconName} } from '@alfalab/icons-${clickedElem.packageName}';`,
                                        'react',
                                    );
                                }}
                            >
                                {copyed === 'react' ? (
                                    <CheckmarkHeavyMIcon className='ok-icon' />
                                ) : (
                                    <CopyLineMIcon className='modal-copy-icon' />
                                )}
                            </div>
                        </div>

                        {clickedElem.cdnLink && (
                            <div className='highlight'>
                                <pre className='highlight-link'>{clickedElem.cdnLink}</pre>

                                <div
                                    className='copy-button-wrapper'
                                    onClick={() => {
                                        copyStr(clickedElem.cdnLink || '', 'link');
                                    }}
                                >
                                    {copyed === 'link' ? (
                                        <CheckmarkHeavyMIcon className='ok-icon' />
                                    ) : (
                                        <CopyLineMIcon className='modal-copy-icon' />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};
