import React, { ComponentType } from 'react';

export enum IconPackageName {
    GLYPH = 'glyph',
    ROCKY = 'rocky',
    IOS = 'ios',
    ANDROID = 'android',
    CORP = 'corp',
    LOGOTYPE = 'logotype',
    FLAG = 'flag',
    CLASSIC = 'classic',
}

export type ClickedElement = {
    reactIconName: string;
    iconName: string;
    packageName: string;
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

export type IconsInfo = Record<IconPackageName, Record<string, IconInfo>>;

export type IconInfo = {
    figmaDescription: string;
    figmaIconName: string;
    reactIconName: string;
    svgIconName: string;
};

export type AnyIcon = Record<string, React.FC<Record<string, unknown>>>;

export type RenderIconParams = {
    reactIconName: string;
    iconPrimitiveName: string;
    packageName: string;
    Icon: AnyIcon[keyof AnyIcon];
};
