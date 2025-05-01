'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/lib/axiosInstance'
import { API } from '@/lib/api'
import CitySparkHeader from '@/component.tsx/CitySparkHeader'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      const response = await axiosInstance.post(API.auth.register, { email, password })
      localStorage.setItem('token', response.data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError('Registration failed. ' + (err.response?.data?.message || ''))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-black p-6 text-white">
          <CitySparkHeader />
    <div className="max-w-md mx-auto mt-24 p-6 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
      </div>
    </div>
    </div>
  )
}
