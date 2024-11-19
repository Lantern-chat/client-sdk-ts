module.exports = {
    targets: "> 15% in US and node 15",
    presets: [
        [
            '@babel/preset-env',
            {
                loose: false,
                modules: false,
            },
        ],
        ['@babel/preset-typescript', {
            optimizeConstEnums: true,
        }],
    ],
    plugins: [

        [require.resolve('babel-plugin-module-resolver'), {
            root: ["./src"],
            extensions: [".js", ".jsx", ".es", ".es6", ".mjs", ".ts", ".tsx"]
        }]
    ]
};