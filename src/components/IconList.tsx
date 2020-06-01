import React, { FC, useState, ComponentType } from 'react';
import json from '@alfalab/icons/search.json';

import { getModule } from './Demo';

import { IconPackageName, Packages, ClickedElement } from './types';

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
                        <div key={`${packageName}-${Icon}`} className={className} onClick={onClick}>
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

    // TODO: добавить виртуальный список
    return (
        <div className='icons-list'>
            {Object.keys(result).map((str) => {
                let packageName = str as IconPackageName;
                return result[packageName].matchByNameArr;
            })}

            {Object.keys(result).map((str) => {
                let packageName = str as IconPackageName;
                return result[packageName].matchByDescriptionArr;
            })}
        </div>
    );
};
