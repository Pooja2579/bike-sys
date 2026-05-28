import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000))
const createToken = (phone) => `token-${phone}-${Math.random().toString(36).slice(2, 8)}`

const getUserByPhone = (phone) => db.data.users.find((user) => user.phone === phone)
const getUserByToken = (token) => db.data.users.find((user) => user.token === token)
const nextId = (list) => (list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1)

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.post('/api/auth/request-otp', async (req, res) => {
  const { phone } = req.body
  if (!phone || !/^[0-9]{8,15}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Enter a valid phone number.' })
  }

  const otp = createOtp()
  db.data.otpStore[phone] = otp
  await db.write()
  res.json({ success: true, message: 'OTP sent successfully.', otp })
})

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp, name } = req.body
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required.' })
  }

  if (db.data.otpStore[phone] !== otp) {
    return res.status(401).json({ success: false, message: 'OTP did not match. Try again.' })
  }

  const token = createToken(phone)
  let user = getUserByPhone(phone)
  if (user) {
    user.name = name?.trim() || user.name
    user.token = token
  } else {
    user = {
      name: name?.trim() || 'Bike Rider',
      phone,
      token,
      createdAt: new Date().toISOString()
    }
    db.data.users.push(user)
  }

  delete db.data.otpStore[phone]
  await db.write()
  res.json({ success: true, user })
})

app.get('/api/rides', (req, res) => {
  const { from, to, date } = req.query
  const filtered = db.data.rides.filter((ride) => {
    const matchesFrom = from ? ride.from.toLowerCase().includes(from.toLowerCase()) : true
    const matchesTo = to ? ride.to.toLowerCase().includes(to.toLowerCase()) : true
    const matchesDate = date ? ride.date === date : true
    return ride.status === 'open' && matchesFrom && matchesTo && matchesDate
  })
  res.json({ success: true, rides: filtered })
})

app.post('/api/offer', async (req, res) => {
  const { token, driver, from, to, date, time, seats, price, bike } = req.body
  const user = getUserByToken(token)

  if (!user) {
    return res.status(401).json({ success: false, message: 'Verify your account before offering a ride.' })
  }

  if (!from || !to || !date || !time || !seats || !price || !bike) {
    return res.status(400).json({ success: false, message: 'All ride fields are required.' })
  }

  const newRide = {
    id: nextId(db.data.rides),
    driver: driver?.trim() || user.name,
    from,
    to,
    date,
    time,
    seats: Number(seats),
    price: Number(price),
    bike,
    status: 'open'
  }
  db.data.rides.push(newRide)
  await db.write()
  res.json({ success: true, ride: newRide })
})

app.post('/api/book', async (req, res) => {
  const { token, rideId, passengerName } = req.body
  const user = getUserByToken(token)
  if (!user) {
    return res.status(401).json({ success: false, message: 'Verify your account before booking a ride.' })
  }

  const ride = db.data.rides.find((item) => item.id === Number(rideId))
  if (!ride) {
    return res.status(404).json({ success: false, message: 'Ride not found.' })
  }
  if (ride.seats < 1) {
    return res.status(400).json({ success: false, message: 'No seats available.' })
  }

  ride.seats -= 1
  if (ride.seats === 0) {
    ride.status = 'filled'
  }

  const booking = {
    id: nextId(db.data.bookings),
    rideId: ride.id,
    passengerName: passengerName || user.name,
    phone: user.phone,
    ride,
    bookedAt: new Date().toISOString()
  }
  db.data.bookings.push(booking)
  await db.write()
  res.json({ success: true, booking, message: 'Ride booked successfully.' })
})

app.get('/api/bookings', (req, res) => {
  const { token } = req.query
  const user = getUserByToken(token)
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid user token.' })
  }
  const filtered = db.data.bookings.filter((item) => item.phone === user.phone)
  res.json({ success: true, bookings: filtered })
})

app.get('/api/profile', (req, res) => {
  const { token } = req.query
  const user = getUserByToken(token)
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid user token.' })
  }

  const history = db.data.bookings.filter((item) => item.phone === user.phone)
  const profile = {
    name: user.name,
    phone: user.phone,
    createdAt: user.createdAt,
    offers: db.data.rides.filter((ride) => ride.driver === user.name).length
  }

  res.json({ success: true, profile, history })
})

app.get('/api/navigation', (req, res) => {
  const { from, to } = req.query
  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'From and to locations are required.' })
  }

  const route = [
    `Start at ${from}`,
    'Head north for 1.2 km along Oak Street',
    'Turn right at the bike-friendly boulevard',
    'Continue straight through the park lane',
    `Arrive at ${to} with a comfortable travel time`
  ]

  res.json({
    success: true,
    navigation: {
      from,
      to,
      distance: '7.4 km',
      eta: '22 mins',
      steps: route
    }
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Bike pool server is running on http://localhost:${port}`)
})
