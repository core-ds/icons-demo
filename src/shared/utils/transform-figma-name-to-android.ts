/**
 * Преобразуем имя для android платформ glyph_a-scores-circle_m => glyph_a_scores_circle_m
 */
export const transformFigmaNameToAndroid = (svgIconName: string) => {
    return svgIconName.replaceAll('-', '_');
};
