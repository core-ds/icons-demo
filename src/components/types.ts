import { ComponentType } from 'react';

export enum IconPackageName {
    GLYPH = 'glyph',
    CLASSIC = 'classic',
    FLAG = 'flag',
    LOGOTYPE = 'logotype',
    CORP = 'corp',
    ROCKY = 'rocky',
    IOS = 'ios',
    ANDROID = 'android',
}

export type IconPackageNameKeys = keyof typeof IconPackageName;

export type SearchResult = {
    [key in IconPackageName]: {
        matchByNameArr: JSX.Element[];
        matchByDescriptionArr: JSX.Element[];
    };
};

export type ClickedElement = {
    reactIconName?: string;
    iconName?: string;
    packageName?: string;
    cdnLink?: string;
};

export type IconPackage = {
    [key: string]: ComponentType;
};

export type IconListProps = {
    value: string;
    packages: IconPackageName[];
};

export enum CopyType {
    NAME = 'name',
    REACT_NAME = 'react_name',
    IMPORT_CODE = 'import_code',
}
