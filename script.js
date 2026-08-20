document.addEventListener("DOMContentLoaded", () => {

  console.log("Team NOX website loaded");


  /* =========================
     SCROLL REVEAL
  ========================== */

  const sections = document.querySelectorAll(".section-inner");


  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

        }

      });

    },

    {
      threshold: 0.12
    }
  );


  sections.forEach((section) => {

    observer.observe(section);

  });


  /* =========================
     SMOOTH NAV LINKS
  ========================== */

  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );


  navLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");


      if (
        targetId === "#" ||
        targetId.length <= 1
      ) {

        return;

      }


      const target = document.querySelector(targetId);


      if (target) {

        event.preventDefault();


        target.scrollIntoView({

          behavior: "smooth",

          block: "start"

        });

      }

    });

  });

});

//Sponsor Page
/* =====================================================
   SPONSOR INTERACTION
===================================================== */

const sponsorCards =
  document.querySelectorAll(
    ".sponsor-company-card"
  );

const sponsorTierSections =
  document.querySelectorAll(
    ".sponsor-tier-section"
  );


/* =====================================================
   OPEN SPONSOR DETAILS
===================================================== */

function openSponsorDetails(card) {

  const section =
    card.closest(
      ".sponsor-tier-section"
    );

  const grid =
    card.closest(
      ".tier-sponsor-grid"
    );

  const detailPanel =
    grid.querySelector(
      ".sponsor-detail-panel"
    );

  const tier =
    section.dataset.tier;

  const name =
    card.dataset.name;

  const contribution =
    card.dataset.contribution;

  const description =
    card.dataset.description;

  const website =
    card.dataset.website;


  /* =================================================
     REMOVE OLD ACTIVE CARD
  ================================================= */

  grid
    .querySelectorAll(
      ".sponsor-company-card"
    )
    .forEach((item) => {

      item.classList.remove(
        "active"
      );

    });


  /* =================================================
     SET CURRENT CARD ACTIVE
  ================================================= */

  card.classList.add(
    "active"
  );


  /* =================================================
     BUILD DETAIL PANEL
  ================================================= */

  detailPanel.innerHTML = `

    <div class="sponsor-detail-content">


      <div class="detail-logo">

        LOGO

      </div>



      <div class="detail-company">


        <span class="detail-company-label">

          ${tier} SPONSOR

        </span>


        <h3>

          ${name}

        </h3>


        <p>

          ${description}

        </p>


        <a
          href="${website}"
          target="_blank"
          rel="noopener noreferrer"
          class="detail-learn-more"
        >

          <span>
            LEARN MORE
          </span>

          <span>
            ↗
          </span>

        </a>


      </div>



      <div class="detail-stats">


        <div class="detail-stat">

          <span>
            CONTRIBUTION
          </span>

          <strong>

            ${contribution}

          </strong>

        </div>


        <div class="detail-stat">

          <span>
            SPONSOR TIER
          </span>

          <strong>

            ${tier}

          </strong>

        </div>


      </div>


    </div>

  `;


  /* =================================================
     OPEN PANEL
  ================================================= */

  detailPanel.classList.add(
    "open"
  );

}


/* =====================================================
   CARD EVENTS
===================================================== */

sponsorCards.forEach((card) => {


  /* HOVER */

  card.addEventListener(
    "mouseenter",
    () => {

      openSponsorDetails(
        card
      );

    }
  );


  /* CLICK
     useful for phones/tablets
  */

  card.addEventListener(
    "click",
    () => {

      openSponsorDetails(
        card
      );

    }
  );


});


/* =====================================================
   CLOSE WHEN HOVERING AWAY FROM ENTIRE TIER
===================================================== */

sponsorTierSections.forEach((section) => {

  let closeTimer;


  /* =================================================
     CURSOR ENTERS TIER
     cancel closing
  ================================================= */

  section.addEventListener(
    "mouseenter",
    () => {

      clearTimeout(
        closeTimer
      );

    }
  );


  /* =================================================
     CURSOR LEAVES TIER
  ================================================= */

  section.addEventListener(
    "mouseleave",
    () => {

      closeTimer =
        setTimeout(() => {


          const detailPanel =
            section.querySelector(
              ".sponsor-detail-panel"
            );


          const activeCards =
            section.querySelectorAll(
              ".sponsor-company-card.active"
            );


          /* CLOSE PANEL */

          if (detailPanel) {

            detailPanel.classList.remove(
              "open"
            );

          }


          /* REMOVE ACTIVE CARD */

          activeCards.forEach(
            (card) => {

              card.classList.remove(
                "active"
              );

            }
          );


        }, 180);

    }
  );


});