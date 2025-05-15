import { DeprecatedAssets } from '../../types';

import deprecatedIcons from '../config/deprecated-icons.json';
import deprecatedLogos from '../config/deprecated-logos.json';
import deprecatedFlags from '../config/deprecated-flags.json';

export const getDeprecatedAssets = (): DeprecatedAssets => {
    return {
        ...deprecatedIcons,
        ...deprecatedLogos,
        ...deprecatedFlags,
    };
};
