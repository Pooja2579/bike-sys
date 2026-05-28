import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

if (!db.data) {
  db.data = {
    users: [],
    rides: [
      {
        id: 1,
        driver: 'Asha',
        from: 'Station Square',
        to: 'Tech Park',
        date: '2026-06-01',
        time: '09:00',
        seats: 2,
        price: 35,
        bike: 'E-Bike',
        status: 'open'
      },
      {
        id: 2,
        driver: 'Ravi',
        from: 'City Mall',
        to: 'North Campus',
        date: '2026-06-01',
        time: '07:45',
        seats: 3,
        price: 28,
        bike: 'Speedster',
        status: 'open'
      },
      {
        id: 3,
        driver: 'Neha',
        from: 'Tech Park',
        to: 'Riverfront',
        date: '2026-06-01',
        time: '18:15',
        seats: 1,
        price: 40,
        bike: 'Classic Cruiser',
        status: 'open'
      }
    ],
    bookings: [],
    otpStore: {}
  }
  await db.write()
}

export default db
