import react from "@vitejs/plugin-react"
import * as path from "path"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: { icon: true, typescript: true },
      esbuildOptions: { loader: "tsx" },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "node-fetch": "isomorphic-fetch",
    },
  },
  build: {
    outDir: "demo",
  },
  css: {
    modules: {
      generateScopedName(name, filename, css) {
        const nameRegex = /.*\/(\w+).module.css/
        const matchGroups = filename.match(nameRegex)
        const componentName = matchGroups !== null ? matchGroups[1] : "Component"
        const hash = Buffer.from(css).toString("base64").substring(0, 5)
        return `_${componentName}_${name}_${hash}`
      },
    },
  },
})
