const API_BASE_URL = process.env.NUXT_API_BASE_URL || 'http://localhost:3000'


export default {
    get: async (url, params) => {
        try {
            const result = await $fetch(API_BASE_URL + url + (params ? '?' + new URLSearchParams(params) : ''))
            console.log('get', result)
            return result
        }catch({data, message}){
            return {data, message}
        }
    },
    post: async (url, body = {}) => {
        const API_BASE_URL = process.env.NUXT_API_BASE_URL || 'http://localhost:3000'
        try {
            return await $fetch(
                API_BASE_URL + url,
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                },
            )
        }catch({ data }){
            // console.log('post', data)
            return Promise.reject(JSON.stringify({
                message: data.message,
            }))
        }
    },
}
