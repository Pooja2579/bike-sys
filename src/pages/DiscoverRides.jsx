import { useEffect, useState } from 'react'

export default function DiscoverRides({ api, user, showToast }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('2026-06-01')
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRides = async () => {
    setLoading(true)
    try {
      const response = await api.get('/rides', { params: { from, to, date } })
      setRides(response.data.rides)
    } catch (error) {
      showToast('Unable to load rides.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRides()
  }, [])

  const handleBook = async (rideId) => {
    if (!user) {
      showToast('Verify your phone before booking.')
      return
    }
    try {
      const response = await api.post('/book', {
        token: user.token,
        rideId,
        passengerName: user.name
      })
      showToast(response.data.message)
      fetchRides()
    } catch (error) {
      showToast(error?.response?.data?.message || 'Booking failed.')
    }
  }

  return (
    <section className="page-grid">
      <div className="form-card">
        <h2>Search available rides</h2>
        <p>Find bike trips matching your route and date.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            fetchRides()
          }}
        >
          <label>
            From
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Start location" />
          </label>
          <label>
            To
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" />
          </label>
          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <button className="button primary" type="submit">
            Search Rides
          </button>
        </form>
      </div>

      <div className="list-card">
        <div className="list-header">
          <h2>Ride results</h2>
          <p>Tap a ride to request a seat.</p>
        </div>
        {loading ? (
          <div className="empty-state">Loading rides…</div>
        ) : rides.length === 0 ? (
          <div className="empty-state">No rides match your route yet.</div>
        ) : (
          rides.map((ride) => (
            <div className="ride-card" key={ride.id}>
              <div>
                <strong>{ride.driver}</strong>
                <p>{ride.bike}</p>
              </div>
              <div className="ride-meta">
                <p>{ride.from} → {ride.to}</p>
                <p>{ride.date} · {ride.time}</p>
                <p>{ride.seats} seats · ₹{ride.price}</p>
              </div>
              <button className="button secondary" onClick={() => handleBook(ride.id)}>
                Book seat
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
