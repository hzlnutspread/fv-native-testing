export function filterExtrinsicEvents(events, eventFilters) {
    if (!events) {
        throw new Error("assertion failed")
    }
    return eventFilters.map(function (eventFilter) {
        var event = events.find(function (_a) {
            var event = _a.event
            var name =
                event.section[0].toUpperCase() +
                event.section.slice(1) +
                "." +
                event.method
            if (typeof eventFilter === "string") return name === eventFilter
            if (name !== eventFilter.name) return
            var eventData = formatEventData(event)
            return (
                JSON.stringify(eventData[eventFilter.key]) ===
                JSON.stringify(eventFilter.data)
            )
        })
        assert(event)
        return event
    })
}
