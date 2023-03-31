import { AnyIcon, IconInfo, IconPackageName, IconsInfo } from './types';
import decamelize from 'decamelize';

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
                const arr = decamelize(iconName.replace(/Icon$/, '')).split('_');

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
                };
            }

            infoRes[iconName] = info;

            return infoRes;
        }, {} as Record<string, IconInfo>);

        return result;
    }, {} as IconsInfo);
};
