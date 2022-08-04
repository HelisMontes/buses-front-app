import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: ["@/assets/styles/main.sass"],
    vite: {
        css: {
            preprocessorOptions: {
                sass: {
                    additionalData: '@import "@/assets/styles/_variables.sass"',
                },
            },
        },
    },
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.NUXT_API_BASE_URL,
        }
    },
    modules: ['@pinia/nuxt'],
})
