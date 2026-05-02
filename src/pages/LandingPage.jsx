import OrbitParticles from "../components/OrbitParticles";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <strong>Yojan<span>Mitra</span></strong>
        <div>
          <a href="#languages">Languages</a>
          <a href="/category.html">Dashboard</a>
          <a href="/category.html">Schemes</a>
          <a className="landing-nav__launch" href="#languages">Launch App</a>
        </div>
      </nav>
      <section className="landing-hero">
        <OrbitParticles count={20} />
        <div className="landing-hero__content">
          <p className="landing-hero__badge">India's Smartest Welfare Engine</p>
          <h1>YOJANMITRA</h1>
          <p>हर योजना, आपके साथ</p>
          <p>Every Scheme • For Every Indian</p>
          <div className="landing-hero__line" aria-hidden="true" />
          <div className="landing-hero__stats">
            <span><strong>70+</strong>Schemes</span>
            <span><strong>22</strong>Languages</span>
          </div>
          <div className="landing-hero__actions">
            <a href="#languages">Get Started →</a>
            <a href="/category.html">Explore Schemes</a>
          </div>
        </div>
      </section>
    </main>
  );
}
