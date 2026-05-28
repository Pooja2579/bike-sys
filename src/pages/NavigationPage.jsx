import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const knownLocations = {
  'Station Square': [12.9718, 77.5946],
  'Tech Park': [12.9352, 77.6245],
  'City Mall': [12.9857, 77.6054],
  'North Campus': [13.0012, 77.5684],
  Riverfront: [12.9546, 77.6408]
}

function getCoordinates(location) {
  return knownLocations[location] || [12.9718, 77.5946]
}

export default function NavigationPage({ api, user, showToast }) {
  const [from, setFrom] = useState('Station Square')
  const [to, setTo] = useState('Tech Park')
  const [navigation, setNavigation] = useState(null)
  const [loading, setLoading] = useState(false)

  const fromCoord = useMemo(() => getCoordinates(from), [from])
  const toCoord = useMemo(() => getCoordinates(to), [to])
  const routePoints = useMemo(() => [fromCoord, toCoord], [fromCoord, toCoord])

  const handleNavigate = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.get('/navigation', { params: { from, to } })
      setNavigation(response.data.navigation)
      showToast('Navigation loaded. Follow the route steps.')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Unable to load navigation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-grid">
      <div className="form-card">
        <h2>Real-time ride navigation</h2>
        <p>Simulate a guided route with map directions and ETA.</p>
        <form onSubmit={handleNavigate}>
          <label>
            From
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Start location" />
          </label>
          <label>
            To
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" />
          </label>
          <button className="button primary" type="submit">
            {loading ? 'Loading…' : 'View Route'}
          </button>
        </form>
      </div>

      <div className="list-card">
        <div className="list-header">
          <h2>Route preview</h2>
          <p>Review route distance, ETA, and the map guidance.</p>
        </div>

        {navigation ? (
          <div className="route-panel">
            <div className="route-summary">
              <h3>{navigation.from}</h3>
              <p>to</p>
              <h3>{navigation.to}</h3>
              <span>{navigation.distance} · {navigation.eta}</span>
            </div>
            <div className="map-frame">
              <MapContainer center={fromCoord} zoom={13} scrollWheelZoom={false} className="leaflet-map">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={routePoints} pathOptions={{ color: '#f7c948', weight: 5 }} />
                <CircleMarker center={fromCoord} pathOptions={{ color: '#ffc947' }} radius={8} />
                <CircleMarker center={toCoord} pathOptions={{ color: '#ffc947' }} radius={8} />
              </MapContainer>
            </div>
            <ol className="route-steps">
              {navigation.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="empty-state">Enter a route to see the live guidance card.</div>
        )}
      </div>
    </section>
  )
}
