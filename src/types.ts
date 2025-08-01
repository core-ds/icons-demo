import React from 'react';
import { MetaInfo } from './shared/config/icon-meta-files';

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
    LOGO_CORP = 'logo-corp',
}

export type ClickedElement = {
    packageName: IconPackageName;
} & Omit<MetaInfo, 'description'>;

export enum CopyType {
    WEB_NAME = 'web',
    WEB_COMPONENT = 'webComponent',
    ANDROID_NAME = 'android',
    IOS_NAME = 'ios',
    MIDDLE_NAME = 'middle',
    CDN_NAME = 'cdn',
    CDN_URL = 'url',
}

export type AnyIcon = Record<string, React.FC<Record<string, unknown>>>;

export type RenderIconParams = {
    Icon: AnyIcon[keyof AnyIcon];
} & ClickedElement;

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
