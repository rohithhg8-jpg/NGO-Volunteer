const opportunities = [
  {
    category: "Community",
    title: "Community garden morning",
    organization: "Green Corner Collective",
    schedule: "Saturday · 9:00 AM",
    color: "mint",
  },
  {
    category: "Education",
    title: "Homework club mentor",
    organization: "Open Doors Learning",
    schedule: "Wednesday · 4:30 PM",
    color: "lavender",
  },
  {
    category: "Food access",
    title: "Pack neighborhood pantry boxes",
    organization: "Good Table Network",
    schedule: "Friday · 10:00 AM",
    color: "peach",
  },
];

function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="VolunteerHub home">
          <span className="brand-mark" aria-hidden="true">
            v
          </span>
          <span>VolunteerHub</span>
        </a>
        <span className="topbar-note">Small acts. Stronger communities.</span>
      </header>

      <section className="hero" aria-labelledby="welcome-heading">
        <div className="hero-copy">
          <p className="eyebrow">YOUR COMMUNITY, YOUR IMPACT</p>
          <h1 id="welcome-heading">
            Good things happen
            <br />
            when we <span>show up.</span>
          </h1>
          <p className="hero-description">
            Find a cause you care about and meet the people making a
            difference, right in your neighborhood.
          </p>
          <a className="primary-button" href="#opportunities">
            Explore opportunities <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-sun" />
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-center">community</div>
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✳</span>
          <span className="art-dot dot-one" />
          <span className="art-dot dot-two" />
        </div>
      </section>

      <section
        className="opportunities"
        id="opportunities"
        aria-labelledby="opportunities-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">A PLACE TO START</p>
            <h2 id="opportunities-heading">Find your kind of good.</h2>
          </div>
          <span className="section-note">A few ways to get involved</span>
        </div>

        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <article
              className={`opportunity-card ${opportunity.color}`}
              key={opportunity.title}
            >
              <span className="card-category">{opportunity.category}</span>
              <div className="card-icon" aria-hidden="true">
                ✳
              </div>
              <h3>{opportunity.title}</h3>
              <p className="organization">{opportunity.organization}</p>
              <div className="card-footer">
                <span>{opportunity.schedule}</span>
                <span className="card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="page-footer">
        <span>VolunteerHub</span>
        <span>Made for people who care.</span>
      </footer>
    </main>
  );
}

export default App;
