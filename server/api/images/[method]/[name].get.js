import endpoint from "~~/utils/endpoint"


export default defineEventHandler(async (event) => {
    const { method = '', name = '' } = event.context.params
    return endpoint.get(`/images/${method}/${name}`)
})
