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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tag, setTag] = useState('')
  const [keyword, setKeyword] = useState('')
  const [allTags, setAllTags] = useState<string[]>([])

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

    const fetchTags = async () => {
      try {
        const tagRes = await axiosInstance.get('/tags')
        setAllTags(tagRes.data.map((tag: any) => tag.name)) // assuming { id, name }
      } catch (err) {
        console.error('Failed to load tags.')
      }
    }
    
    fetchTags()
    fetchEvents()
  }, [])

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleNotificationClick = () => {
    router.push('/notification')
  }

  const handleCreateEventClick = () => {
    router.push('/events/create')
  }

  const handleEventClick = (id: number) => {
    localStorage.setItem('selectedEventId', id.toString())
    router.push('/events')
  }

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start', new Date(startDate).toISOString())
      if (endDate) params.append('end', new Date(endDate).toISOString())
      if (tag) params.append('tag', tag)
      if (keyword) params.append('keyword', keyword)
  
      const response = await axiosInstance.get(`/events/filter?${params.toString()}`)
      setEvents(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to search events')
    }
  }

  const handleReset = async () => {
    setStartDate('')
    setEndDate('')
    setTag('')
    setKeyword('')
    try {
      const response = await axiosInstance.get('/events')
      setEvents(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to reload events.')
    }
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
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              onClick={handleNotificationClick}
            >
              Notification
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-gray-700"
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

        <form
          onSubmit={e => {
            e.preventDefault()
            handleSearch()
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border"
        >
          <input
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="p-2 rounded text-black bg-gray-300"
            placeholder="Start Date"
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="p-2 rounded text-black bg-gray-300"
            placeholder="End Date"
          />
          <select
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="p-2 rounded text-black bg-gray-300"
          >
            <option value="">All Tags</option>
            {allTags.map(tagName => (
              <option key={tagName} value={tagName}>{tagName}</option>
            ))}
          </select>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="p-2 rounded text-black bg-gray-300"
            placeholder="Keyword"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 md:col-span-2"
          >
            Search Events
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 md:col-span-2"
          >
            Reset Filters
          </button>
        </form>

        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded hover:bg-blue-900 cursor-pointer"
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
