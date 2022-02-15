import {defineConfig} from 'vite'
import {createVuePlugin} from 'vite-plugin-vue2'
import path from "path";

export default defineConfig({
    plugins: [createVuePlugin()],
    build: {
        outDir: path.resolve(__dirname, "dist/lib"),
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "HaloEditor",
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
        sourcemap: false,
    },
})
