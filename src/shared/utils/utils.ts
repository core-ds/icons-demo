import { AnyIcon, Asset, IconInfo, IconPackageName, IconsInfo } from '../../types';
import decamelize from 'decamelize';
import { transformFigmaNameToAndroid } from './transform-figma-name-to-android';
import { transformFigmaNameToIOS } from './transform-figma-name-to-ios';

export const noop = () => {};

export const importAllIcons = (requireContext: any, Module: any) =>
    requireContext.keys().forEach((key: string) => {
        const moduleName = key.replace(/\.js$/, '').replace(/^\.\//, '');

        Module[moduleName] = requireContext(key)[moduleName];
    });

const PACKAGE_ALIAS: { [key: string]: string } = {
    classic: 'icon',
};

const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

const getPackageName = (iconPrefix: string) => PACKAGE_ALIAS[iconPrefix] || iconPrefix;

export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const fillIconInfo = (packages: Record<IconPackageName, AnyIcon>, iconsInfo: IconsInfo) => {
    return getKeys(packages).reduce((result, packageName) => {
        const icons = packages[packageName];

        result[packageName] = getKeys(icons).reduce((infoRes, iconName) => {
            let info = iconsInfo[packageName] && iconsInfo[packageName][iconName];

            if (!info) {
                const primitiveName = iconName
                    .replace(/Icon$/, '')
                    .replace(/\d+/g, (match) => `-${match}`);
                const arr = decamelize(primitiveName).split('_');

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

                info = {
                    svgIconName,
                    figmaIconName: '',
                    reactIconName: '',
                    figmaDescription: '',
                    androidName: '',
                    iosName: '',
                };
            }

            info = {
                ...info,
                androidName: transformFigmaNameToAndroid(info.svgIconName),
                iosName: transformFigmaNameToIOS(info.svgIconName),
            };

            infoRes[iconName] = info;

            return infoRes;
        }, {} as Record<string, IconInfo>);

        return result;
    }, {} as IconsInfo);
};

export const formatPackageName = (packageName: IconPackageName | Asset) => {
    const name = packageName.toLowerCase();
    let suffix = '';

    if (name === IconPackageName.CLASSIC) {
        suffix = ' (deprecated)';
    }

    if (name === Asset.ANIMATION) {
        suffix = ' (test)';
    }

    if (packageName === IconPackageName.IOS) {
        return 'iOS';
    }

    return name.charAt(0).toUpperCase() + name.slice(1) + suffix;
};

export const getKeyParts = (key: string) => key.split('-').slice(1).join('-');

export const getPackageNameAsset = (asset: Asset, ru?: boolean): string => {
    switch (asset) {
        case Asset.LOGOTYPE:
            return ru ? 'Логотипы' : 'logo';
        case Asset.FLAG:
            return ru ? 'Флажки' : 'flag';
        case Asset.ANIMATION:
            return ru ? 'Анимация' : 'animation';
        default:
            return ru ? 'Иконки' : 'glyph';
    }
};
