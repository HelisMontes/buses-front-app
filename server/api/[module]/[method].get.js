import endpoint from "~~/utils/endpoint"


export default defineEventHandler(async (event) => {
    const { module: modulePath, method = '' } = event.context.params
    return endpoint.get(`/api/${modulePath}/${method}`, useQuery(event))
})
