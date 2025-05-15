import React from 'react';

export enum Asset {
    ICONS = 'icons',
    LOGOTYPE = 'logotype',
    FLAG = 'flag',
    ANIMATION = 'animation',
}

export enum IconPackageName {
    GLYPH = 'glyph',
    ROCKY = 'rocky',
    IOS = 'ios',
    ANDROID = 'android',
    CORP = 'corp',
    INVEST = 'invest',
    SITE = 'site',
    FLAG = 'flag',
    LOGO = 'logo',
    LOGOTYPE = 'logotype',
    LOGO_AM = 'logo-am',
    CLASSIC = 'classic',
}

export type ClickedElement = {
    webName: string;
    svgIconName: string;
    androidName: string;
    iosName: string;
    packageName: string;
    middleName: string;
    cdnName: string;
    cdnUrl: string;
    base64Icon: string;
};

export enum CopyType {
    WEB_NAME = 'web_name',
    WEB_COMPONENT = 'web_component',
    ANDROID_NAME = 'android_name',
    IOS_NAME = 'ios_name',
    MIDDLE_NAME = 'middle_name',
    CDN_NAME = 'cdn_name',
    CDN_URL = 'cdn_url',
    BASE_64_ICON = 'base_64_icon',
}

export type IconsInfo = Record<IconPackageName, Record<string, IconInfo>>;

export type IconInfo = {
    figmaDescription: string;
    figmaIconName: string;
    reactIconName: string;
    svgIconName: string;
    /** androidName и iosName формируем самостоятельно после получения данных из search.json */
    androidName: string;
    iosName: string;
};

export type AnyIcon = Record<string, React.FC<Record<string, unknown>>>;

export type RenderIconParams = {
    packageName: IconPackageName;
    Icon: AnyIcon[keyof AnyIcon];
} & Pick<IconInfo, 'reactIconName' | 'androidName' | 'iosName' | 'svgIconName'>;

export type RenderAnimationParams = {
    animationName: string;
    packageName: string;
    animationData: any;
};

export type DeprecatedAssets = Record<string, { replacement: string; date: string }>;

export enum DeprecatedType {
    DEPRECATED = 'deprecated',
    NO_REPLACE = 'no_replace',
}
