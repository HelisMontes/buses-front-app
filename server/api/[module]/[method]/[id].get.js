import endpoint from "~~/utils/endpoint"


export default defineEventHandler(async (event) => {
    const { module: modulePath, method = '', id = null } = event.context.params
    return endpoint.get(`/api/${modulePath}/${method}/${id}`, useQuery(event))
})
