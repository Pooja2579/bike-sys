export default function HomePage({ user }) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">Bike pooling with confidence</span>
        <h2>Find safe bike rides and offer shared trips in your city.</h2>
        <p>
          BikePool brings quick phone verification, ride matching, and live navigation into a single
          modern experience. Explore available routes, offer your bike, and share the ride.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="/discover">
            Discover Rides
          </a>
          <a className="button secondary" href="/offer">
            Offer a Ride
          </a>
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-card-header">
          <div>
            <strong>Welcome back</strong>
            <p>{user ? `Ready to ride, ${user.name}?` : 'Verify your phone to unlock booking.'}</p>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <span>120+</span>
            <p>Scheduled rides</p>
          </div>
          <div>
            <span>95%</span>
            <p>Verified riders</p>
          </div>
          <div>
            <span>8.2 km</span>
            <p>Avg route length</p>
          </div>
        </div>
      </div>
    </section>
  )
}
