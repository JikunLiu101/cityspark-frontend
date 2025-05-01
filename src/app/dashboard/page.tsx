'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import CitySparkHeader from '@/component.tsx/CitySparkHeader'

interface Event {
  id: number
  title: string
  description: string
  location: string
  eventStartDt: string
  status: string
  tagId: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events')
        setEvents(response.data)
        const profileResponse = await axiosInstance.get(`/users/${userId}/profile`)
        const data = profileResponse.data
        if (data && data.personId) {
          localStorage.setItem('personId', data.personId.toString())
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch events.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleCreateEventClick = () => {
    router.push('/events/create')
  }

  const handleEventClick = (id: number) => {
    localStorage.setItem('selectedEventId', id.toString())
    router.push('/events')
  }
  

  if (loading) return <p>Loading events...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-black p-6 text-white">
      <CitySparkHeader />
      <div className="max-w-4xl mx-auto mt-12 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              onClick={handleProfileClick}
            >
              Profile
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleCreateEventClick}
            >
              Create Event
            </button>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <h2 className="text-xl font-semibold text-white drop-shadow-[0_0_1px_black]">{event.title}</h2>
              <p className="text-white drop-shadow-[0_0_1px_black]">{event.description}</p>
              <p className="text-white text-sm drop-shadow-[0_0_1px_black]">{event.location} — {new Date(event.eventStartDt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
