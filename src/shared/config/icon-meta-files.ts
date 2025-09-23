import glyph from '@alfalab/icons/meta_glyph.json';
import rocky from '@alfalab/icons/meta_rocky.json';
import ios from '@alfalab/icons/meta_ios.json';
import android from '@alfalab/icons/meta_android.json';
import corp from '@alfalab/icons/meta_corp.json';
import invest from '@alfalab/icons/meta_invest.json';
import site from '@alfalab/icons/meta_site.json';
import flag from '@alfalab/icons/meta_flag.json';
import logo from '@alfalab/icons/meta_logo.json';
import logotype from '@alfalab/icons/meta_logotype.json';
import logo_am from '@alfalab/icons/meta_logo-am.json';
import logo_corp from '@alfalab/icons/meta_logo-corp.json';

import { IconPackageName } from '../../types';

export type MetaInfo = {
    description: string;
    middle: string;
    web?: string;
    webComponent?: string;
    android?: string;
    ios?: string;
    cdn?: string;
    url?: string;
};

export const ICON_META_FILES: Record<IconPackageName, Record<string, MetaInfo>> = {
    [IconPackageName.GLYPH]: glyph,
    [IconPackageName.ROCKY]: rocky,
    [IconPackageName.IOS]: ios,
    [IconPackageName.ANDROID]: android,
    [IconPackageName.CORP]: corp,
    [IconPackageName.INVEST]: invest,
    [IconPackageName.SITE]: site,
    [IconPackageName.FLAG]: flag,
    [IconPackageName.LOGO]: logo,
    [IconPackageName.LOGOTYPE]: logotype,
    [IconPackageName.LOGO_AM]: logo_am,
    [IconPackageName.LOGO_CORP]: logo_corp,
} as const;
