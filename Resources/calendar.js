/* =========================================================
   TEAM NOX
   LIVE GOOGLE CALENDAR
========================================================= */


/* =========================================================
   DOM
========================================================= */

const calendarGrid =
  document.getElementById("calendarGrid");

const monthTitle =
  document.getElementById("monthTitle");

const prevMonthButton =
  document.getElementById("prevMonth");

const nextMonthButton =
  document.getElementById("nextMonth");

const todayButton =
  document.getElementById("todayButton");

const upcomingList =
  document.getElementById("upcomingList");

const filters =
  document.querySelectorAll(".calendar-filter");



/* MODAL */

const eventModal =
  document.getElementById("eventModal");

const eventModalClose =
  document.getElementById("eventModalClose");

const modalCategory =
  document.getElementById("modalCategory");

const modalTitle =
  document.getElementById("modalTitle");

const modalDate =
  document.getElementById("modalDate");

const modalTime =
  document.getElementById("modalTime");

const modalLocation =
  document.getElementById("modalLocation");

const modalDescription =
  document.getElementById("modalDescription");



/* =========================================================
   STATE
========================================================= */

let events = [];

let activeFilter = "all";

let currentDate = new Date();



const monthNames = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER"
];



/* =========================================================
   LOAD GOOGLE CALENDAR
========================================================= */

async function loadCalendar() {

  try {

    const response =
      await fetch("/api/calendar");


    if (!response.ok) {

      throw new Error(
        "Unable to load calendar."
      );

    }


    const icsText =
      await response.text();


    events =
      parseICS(icsText);


    renderCalendar();

  }

  catch (error) {

    console.error(
      "Calendar error:",
      error
    );


    calendarGrid.innerHTML = `

      <div class="calendar-error">
        CALENDAR CURRENTLY UNAVAILABLE
      </div>

    `;

  }

}



/* =========================================================
   PARSE ICS
========================================================= */

function parseICS(icsText) {

  const normalized =
    icsText.replace(
      /\r?\n[ \t]/g,
      ""
    );


  const eventBlocks =
    normalized.match(
      /BEGIN:VEVENT[\s\S]*?END:VEVENT/g
    ) || [];


  return eventBlocks.map(
    (block, index) => {


      const summary =
        getICSValue(
          block,
          "SUMMARY"
        );


      const location =
        getICSValue(
          block,
          "LOCATION"
        );


      const description =
        getICSValue(
          block,
          "DESCRIPTION"
        );


      const startRaw =
        getICSDateValue(
          block,
          "DTSTART"
        );


      const endRaw =
        getICSDateValue(
          block,
          "DTEND"
        );


      if (!startRaw) {

        return null;

      }


      const startDate =
        parseGoogleDate(
          startRaw.value,
          startRaw.allDay
        );


      const endDate =
        endRaw
          ? parseGoogleDate(
              endRaw.value,
              endRaw.allDay
            )
          : null;


      return {

        id:
          index + 1,

        title:
          cleanICS(summary)
          || "Team Nox Event",

        startDate,

        endDate,

        allDay:
          startRaw.allDay,

        location:
          cleanICS(location)
          || "Location TBD",

        description:
          cleanICS(description)
          || "No additional event details.",

        category:
          detectCategory(summary)

      };

    }

  ).filter(Boolean);

}



/* =========================================================
   ICS HELPERS
========================================================= */

function getICSValue(
  block,
  property
) {

  const regex =
    new RegExp(
      `^${property}(?:;[^:]*)?:(.*)$`,
      "mi"
    );


  const match =
    block.match(regex);


  return match
    ? match[1]
    : "";

}



function getICSDateValue(
  block,
  property
) {

  const regex =
    new RegExp(
      `^${property}([^:]*)?:(.*)$`,
      "mi"
    );


  const match =
    block.match(regex);


  if (!match) {

    return null;

  }


  const params =
    match[1] || "";


  return {

    value:
      match[2],

    allDay:
      params.includes(
        "VALUE=DATE"
      )

  };

}



function cleanICS(text) {

  if (!text) {

    return "";

  }


  return text

    .replace(/\\n/g, "\n")

    .replace(/\\,/g, ",")

    .replace(/\\;/g, ";")

    .replace(/\\\\/g, "\\")

    .trim();

}



/* =========================================================
   GOOGLE DATE PARSER
========================================================= */

function parseGoogleDate(
  value,
  allDay
) {

  if (allDay) {

    const year =
      Number(
        value.slice(0, 4)
      );

    const month =
      Number(
        value.slice(4, 6)
      ) - 1;

    const day =
      Number(
        value.slice(6, 8)
      );


    return new Date(
      year,
      month,
      day
    );

  }


  const year =
    Number(
      value.slice(0, 4)
    );

  const month =
    Number(
      value.slice(4, 6)
    ) - 1;

  const day =
    Number(
      value.slice(6, 8)
    );

  const hour =
    Number(
      value.slice(9, 11)
    );

  const minute =
    Number(
      value.slice(11, 13)
    );


  if (
    value.endsWith("Z")
  ) {

    return new Date(
      Date.UTC(
        year,
        month,
        day,
        hour,
        minute
      )
    );

  }


  return new Date(
    year,
    month,
    day,
    hour,
    minute
  );

}



/* =========================================================
   EVENT CATEGORY
========================================================= */

function detectCategory(title) {

  const name =
    (title || "")
      .toLowerCase();


  if (
    name.includes("frc")
  ) {

    return "frc";

  }


  if (
    name.includes("ftc")
  ) {

    return "ftc";

  }


  if (
    name.includes("outreach")
    ||
    name.includes("community")
  ) {

    return "outreach";

  }


  return "general";

}



function formatCategory(category) {

  const categories = {

    frc:
      "FRC",

    ftc:
      "FTC",

    outreach:
      "OUTREACH",

    general:
      "GENERAL"

  };


  return categories[category]
    || "TEAM EVENT";

}



/* =========================================================
   DATE HELPERS
========================================================= */

function dateKey(date) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return (
    `${year}-${month}-${day}`
  );

}



function formatTime(date) {

  if (!date) {

    return "";

  }


  return date.toLocaleTimeString(
    "en-US",
    {
      hour:
        "numeric",

      minute:
        "2-digit"
    }
  );

}



/* =========================================================
   FILTER EVENTS
========================================================= */

function getFilteredEvents() {

  if (
    activeFilter === "all"
  ) {

    return events;

  }


  return events.filter(
    event =>
      event.category
      === activeFilter
  );

}



/* =========================================================
   RENDER MONTH
========================================================= */

function renderCalendar() {

  calendarGrid.innerHTML = "";


  const year =
    currentDate.getFullYear();


  const month =
    currentDate.getMonth();


  monthTitle.textContent =
    `${monthNames[month]} ${year}`;


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const previousMonthDays =
    new Date(
      year,
      month,
      0
    ).getDate();


  const filteredEvents =
    getFilteredEvents();


  for (
    let cell = 0;
    cell < 42;
    cell++
  ) {

    const dayCell =
      document.createElement(
        "div"
      );


    dayCell.className =
      "calendar-day";


    let displayDay;

    let cellMonth =
      month;

    let cellYear =
      year;



    /* PREVIOUS MONTH */

    if (
      cell < firstDay
    ) {

      displayDay =
        previousMonthDays
        - firstDay
        + cell
        + 1;


      cellMonth--;


      if (
        cellMonth < 0
      ) {

        cellMonth = 11;

        cellYear--;

      }


      dayCell.classList.add(
        "other-month"
      );

    }



    /* NEXT MONTH */

    else if (
      cell >=
      firstDay
      + daysInMonth
    ) {

      displayDay =
        cell
        - firstDay
        - daysInMonth
        + 1;


      cellMonth++;


      if (
        cellMonth > 11
      ) {

        cellMonth = 0;

        cellYear++;

      }


      dayCell.classList.add(
        "other-month"
      );

    }



    /* CURRENT MONTH */

    else {

      displayDay =
        cell
        - firstDay
        + 1;

    }



    const date =
      new Date(
        cellYear,
        cellMonth,
        displayDay
      );


    const dayNumber =
      document.createElement(
        "span"
      );


    dayNumber.className =
      "day-number";


    dayNumber.textContent =
      displayDay;


    dayCell.appendChild(
      dayNumber
    );



    /* TODAY */

    const today =
      new Date();


    if (
      dateKey(date)
      ===
      dateKey(today)
    ) {

      dayCell.classList.add(
        "today"
      );

    }



    /* EVENTS */

    const key =
      dateKey(date);


    const dayEvents =
      filteredEvents.filter(
        event =>
          dateKey(
            event.startDate
          ) === key
      );


    dayEvents.forEach(
      event => {

        const eventButton =
          document.createElement(
            "button"
          );


        eventButton.className =
          `calendar-event ${event.category}`;


        const time =
          event.allDay
            ? "ALL DAY"
            : formatTime(
                event.startDate
              );


        eventButton.innerHTML = `

          <span class="calendar-event-title">
            ${event.title}
          </span>

          <span class="calendar-event-time">
            ${time}
          </span>

        `;


        eventButton
          .addEventListener(
            "click",
            () =>
              openEvent(event)
          );


        dayCell.appendChild(
          eventButton
        );

      }
    );


    calendarGrid.appendChild(
      dayCell
    );

  }


  renderUpcoming();

}



/* =========================================================
   UPCOMING EVENTS
========================================================= */

function renderUpcoming() {

  upcomingList.innerHTML = "";


  const now =
    new Date();


  const futureEvents =
    getFilteredEvents()

      .filter(
        event =>
          event.startDate >= now
      )

      .sort(
        (a, b) =>
          a.startDate
          - b.startDate
      )

      .slice(
        0,
        6
      );



  if (
    futureEvents.length === 0
  ) {

    upcomingList.innerHTML = `

      <div class="calendar-empty">
        NO UPCOMING EVENTS
      </div>

    `;

    return;

  }



  futureEvents.forEach(
    event => {

      const item =
        document.createElement(
          "article"
        );


      item.className =
        "upcoming-item";


      const timeText =
        event.allDay
          ? "ALL DAY"
          : `${formatTime(event.startDate)}${
              event.endDate
                ? ` – ${formatTime(event.endDate)}`
                : ""
            }`;


      item.innerHTML = `

        <div>

          <span class="upcoming-category">
            ${formatCategory(event.category)}
          </span>

          <h3 class="upcoming-title">
            ${event.title}
          </h3>

          <span class="upcoming-time">
            ${timeText}
          </span>

          <span class="upcoming-location">
            ${event.location}
          </span>

        </div>


        <div class="upcoming-date">

          <span class="upcoming-month">
            ${monthNames[
              event.startDate
                .getMonth()
            ].slice(0, 3)}
          </span>

          <span class="upcoming-day">
            ${String(
              event.startDate
                .getDate()
            ).padStart(
              2,
              "0"
            )}
          </span>

          <span class="upcoming-weekday">
            ${event.startDate
              .toLocaleDateString(
                "en-US",
                {
                  weekday:
                    "short"
                }
              )
              .toUpperCase()}
          </span>

        </div>

      `;


      item.addEventListener(
        "click",
        () =>
          openEvent(event)
      );


      upcomingList.appendChild(
        item
      );

    }
  );

}



/* =========================================================
   EVENT MODAL
========================================================= */

function openEvent(event) {

  modalCategory.textContent =
    formatCategory(
      event.category
    );


  modalTitle.textContent =
    event.title;


  modalDate.textContent =
    event.startDate
      .toLocaleDateString(
        "en-US",
        {
          weekday:
            "long",

          month:
            "long",

          day:
            "numeric",

          year:
            "numeric"
        }
      );


  modalTime.textContent =
    event.allDay
      ? "All Day"
      : `${formatTime(event.startDate)}${
          event.endDate
            ? ` – ${formatTime(event.endDate)}`
            : ""
        }`;


  modalLocation.textContent =
    event.location;


  modalDescription.textContent =
    event.description;


  eventModal.classList.add(
    "open"
  );


  document.body.style.overflow =
    "hidden";

}



function closeEvent() {

  eventModal.classList.remove(
    "open"
  );


  document.body.style.overflow =
    "";

}



eventModalClose
  .addEventListener(
    "click",
    closeEvent
  );


eventModal
  .querySelector(
    ".event-modal-backdrop"
  )
  .addEventListener(
    "click",
    closeEvent
  );



/* =========================================================
   MONTH BUTTONS
========================================================= */

prevMonthButton
  .addEventListener(
    "click",
    () => {

      currentDate =
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );


      renderCalendar();

    }
  );



nextMonthButton
  .addEventListener(
    "click",
    () => {

      currentDate =
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );


      renderCalendar();

    }
  );



todayButton
  .addEventListener(
    "click",
    () => {

      const today =
        new Date();


      currentDate =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );


      renderCalendar();

    }
  );



/* =========================================================
   FILTER BUTTONS
========================================================= */

filters.forEach(
  filter => {

    filter.addEventListener(
      "click",
      () => {

        filters.forEach(
          button =>
            button.classList.remove(
              "active"
            )
        );


        filter.classList.add(
          "active"
        );


        activeFilter =
          filter.dataset.filter;


        renderCalendar();

      }
    );

  }
);



/* =========================================================
   LOAD
========================================================= */

loadCalendar();