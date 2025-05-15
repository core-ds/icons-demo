/**
 * Преобразуем имя для android платформ glyph_a-scores-circle_m => glyph_aScoresCircle_m
 */
export const transformFigmaNameToIOS = (svgIconName: string) => {
    const regexp = /-(\w)/g;
    return svgIconName.replace(regexp, (_, letter) => letter.toUpperCase());
};
