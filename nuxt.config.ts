import tailwindcss from "@tailwindcss/vite";
import viteSvgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
      viteSvgLoader()
    ],
  },
  modules: [
    '@pinia/nuxt',
  ],
  pinia: {
    storesDirs: ['~/stores/**'],
  },
})
