export function formatEventData(event) {
    const data = event.data.toJSON()
    const fields = event.meta.fields.toJSON()
    return fields.reduce((record, { name, typeName: type }, index) => {
        record[name ?? `arg${index}`] = { value: data[index], type }
        return record
    })
}
