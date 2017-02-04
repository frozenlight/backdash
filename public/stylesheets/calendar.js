//

// Start script when the DOM is ready
$(document).ready(function(){

    var events = $.get("https://online.ntnu.no/api/v1/events/?format=json")

    $.when(events).done(function(){

        // When the objects are returned from the Async GET request, they come with more of the HTTP response than we need, we only use the resposeText
        // We cant get the response in the variable declaration because the request is asyncronous, so we get it after the requests are done
        // Since the response is stored as text (string) we need to parse it back into JSON to use it
        events = JSON.parse(events.responseText)

        
        // Render fullcalendar
        $('#calendar').fullCalendar({

            // Add parsed events to the calendar
            events:events,
            weekNumberCalculation:"ISO",
            timeFormat: 'H:mm'
        })
    })
})
