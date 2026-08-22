export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // -----------------------------------------
    // GOOGLE CALENDAR API ROUTE
    // -----------------------------------------

    if (url.pathname === "/api/calendar") {
      const calendarUrl =
        "https://calendar.google.com/calendar/ical/8f283dbd87e4b9a262ab60329952855b83c6e316a19bb792905e612532740939%40group.calendar.google.com/public/basic.ics";

      try {
        const response = await fetch(calendarUrl);

        if (!response.ok) {
          return new Response(
            "Unable to load Google Calendar.",
            {
              status: 500
            }
          );
        }

        const ics = await response.text();

        return new Response(ics, {
          status: 200,

          headers: {
            "Content-Type":
              "text/calendar; charset=utf-8",

            "Cache-Control": "no-cache"
          }
        });
      }

      catch (error) {
        return new Response(
          "Calendar request failed.",
          {
            status: 500
          }
        );
      }
    }


    // -----------------------------------------
    // NORMAL WEBSITE FILES
    // -----------------------------------------

    return env.ASSETS.fetch(request);
  }
};