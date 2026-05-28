import { useEffect, useState } from 'react'

export default function ProfilePage({ api, user, showToast }) {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await api.get('/profile', { params: { token: user.token } })
      setProfile(response.data.profile)
      setHistory(response.data.history)
    } catch (error) {
      showToast('Unable to load profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  if (!profile) {
    return <div className="empty-state">Loading profile…</div>
  }

  return (
    <section className="page-grid">
      <div className="form-card">
        <h2>Your rider profile</h2>
        <p>Manage your verified phone account and ride history.</p>
        <div className="profile-card">
          <div>
            <strong>{profile.name}</strong>
            <p>{profile.phone}</p>
          </div>
          <div className="profile-badge">Verified</div>
        </div>
        <div className="profile-summary">
          <div>
            <span>{history.length}</span>
            <p>Completed bookings</p>
          </div>
          <div>
            <span>{profile.offers || 0}</span>
            <p>Offers created</p>
          </div>
        </div>
      </div>

      <div className="list-card">
        <div className="list-header">
          <h2>Ride history</h2>
          <p>Past and current bookings linked to your account.</p>
        </div>
        {history.length === 0 ? (
          <div className="empty-state">You have no booking history yet.</div>
        ) : (
          history.map((entry) => (
            <div className="ride-card" key={entry.id}>
              <div>
                <strong>{entry.ride.driver}</strong>
                <p>{entry.ride.bike}</p>
              </div>
              <div className="ride-meta">
                <p>{entry.ride.from} → {entry.ride.to}</p>
                <p>{entry.ride.date} · {entry.ride.time}</p>
                <p>Booked with {entry.passengerName}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
