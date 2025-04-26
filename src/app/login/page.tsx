'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import { API } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post(API.auth.login, { email, password })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userId', user.id.toString())

      router.push('/dashboard')
    } catch (err: any) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Log In
        </button>
      </form>
    </div>
  )
}
