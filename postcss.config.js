module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-preset-env')({
            stage: 3,
            features: {
                'nesting-rules': true,
                'custom-properties': false,
            },
        }),
        require('postcss-mixins'),
    ],
};
