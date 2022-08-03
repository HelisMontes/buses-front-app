import endpoint from "~~/utils/endpoint"


export default defineEventHandler(async (event) => {
    const { module: modulePath, method = '' } = event.context.params
    console.log('get', modulePath, method)
    return endpoint.get(`/api/${modulePath}/${method}`, useQuery(event))
})
