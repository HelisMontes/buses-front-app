import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.NUXT_API_BASE_URL,
        }
    },
    modules: ['@pinia/nuxt'],
})
