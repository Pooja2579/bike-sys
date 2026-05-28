import { useState } from 'react'

export default function OfferRide({ api, user, showToast }) {
  const [driver, setDriver] = useState(user?.name || '')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('2026-06-01')
  const [time, setTime] = useState('08:00')
  const [seats, setSeats] = useState(2)
  const [price, setPrice] = useState(40)
  const [bike, setBike] = useState('Standard Bike')

  const handleOffer = async (event) => {
    event.preventDefault()
    if (!user) {
      showToast('Please verify your phone before offering a ride.')
      return
    }
    try {
      const response = await api.post('/offer', {
        token: user.token,
        driver,
        from,
        to,
        date,
        time,
        seats,
        price,
        bike
      })
      showToast(`Ride offered: ${response.data.ride.from} → ${response.data.ride.to}`)
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to create a ride offer.')
    }
  }

  return (
    <section className="form-card">
      <h2>Offer your bike trip</h2>
      <p>Create a shared ride and let other users book a seat.</p>
      <form onSubmit={handleOffer}>
        <label>
          Driver name
          <input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Driver name" />
        </label>
        <label>
          From
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Start location" />
        </label>
        <label>
          To
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" />
        </label>
        <div className="inline-grid">
          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>
        <div className="inline-grid">
          <label>
            Seats
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              min="10"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
        </div>
        <label>
          Bike type
          <input value={bike} onChange={(e) => setBike(e.target.value)} placeholder="Bike model" />
        </label>
        <button className="button primary" type="submit">
          Publish ride
        </button>
      </form>
    </section>
  )
}
