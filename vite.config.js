import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// Unique per build; used to bust the browser cache of /public/locales/*.json after each deploy.
const BUILD_ID = process.env.VITE_BUILD_ID || Date.now().toString(36);

const chunkGroups = [
    ['quill', /node_modules\/(quill|react-quill-new|parchment|quill-delta|eventemitter3|lodash-es)\//],
    ['antd', /node_modules\/(antd|@ant-design|rc-[^/]+|@rc-component)\//],
    ['react', /node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser|turbo-stream|react-redux|@reduxjs|redux|redux-thunk|reselect|immer|use-sync-external-store)\//],
    // Small libraries every public page needs; anything else is left to Rollup so
    // admin-only / page-only dependencies stay in their lazy chunks.
    ['vendor', /node_modules\/(i18next[^/]*|react-i18next|html-parse-stringify|void-elements|react-toastify|clsx|js-cookie|react-responsive|hyphenate-style-name|matchmediaquery|css-mediaquery|shallow-equal|lucide-react)\//],
];

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.VITE_BUILD_ID': JSON.stringify(BUILD_ID),
    },
    server: {
        host: true,
        port: 3000,
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Rollup's CommonJS interop helpers are needed by almost every vendor chunk;
                    // keep them in the core chunk to avoid circular chunk imports.
                    if (id.includes('commonjsHelpers')) return 'react';
                    // Global CSS (antd reset, toastify) is bundled with the app stylesheet.
                    if (!id.includes('node_modules') || /\.css$/.test(id)) return undefined;
                    const normalized = id.replace(/\\/g, '/');
                    for (const [name, pattern] of chunkGroups) {
                        if (pattern.test(normalized)) return name;
                    }
                    return undefined;
                },
            },
        },
    },
})
