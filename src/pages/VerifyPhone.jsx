import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function VerifyPhone({ api, onVerified, showToast, user }) {
  const [stage, setStage] = useState('request')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [serverOtp, setServerOtp] = useState('')

  const handleRequestOtp = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post('/auth/request-otp', { phone })
      setServerOtp(response.data.otp)
      setStage('verify')
      showToast('OTP generated. Use it to verify your phone.')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Unable to request OTP.')
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp, name })
      onVerified(response.data.user)
      showToast('Phone verified. You are ready to ride!')
    } catch (error) {
      showToast(error?.response?.data?.message || 'OTP verification failed.')
    }
  }

  if (user) {
    return <Navigate replace to="/profile" />
  }

  return (
    <section className="form-card">
      <h2>Secure phone verification</h2>
      <p>Enter your phone number so you can book rides and share your route safely.</p>
      <form onSubmit={stage === 'request' ? handleRequestOtp : handleVerifyOtp}>
        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          Phone number
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 712345678"
          />
        </label>

        {stage === 'verify' && (
          <label>
            Enter OTP
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
            />
          </label>
        )}

        <button className="button primary" type="submit">
          {stage === 'request' ? 'Send OTP' : 'Verify & Continue'}
        </button>
      </form>

      {stage === 'verify' && (
        <div className="info-panel">
          <p>
            Demo OTP: <strong>{serverOtp}</strong>
          </p>
          <p>If you are on mobile, use the same code to simulate quick verification.</p>
        </div>
      )}
    </section>
  )
}
