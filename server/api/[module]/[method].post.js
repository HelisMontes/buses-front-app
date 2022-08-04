import endpoint from "~~/utils/endpoint"


export default defineEventHandler(async (event) => {
    const { module: modulePath, method = '' } = event.context.params
    return endpoint.post(`/api/${modulePath}/${method}`, await useBody(event))
})
