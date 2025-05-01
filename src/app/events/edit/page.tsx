'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import CitySparkHeader from '@/component.tsx/CitySparkHeader'
import BackButton from '@/component.tsx/BackButton'

export default function EditEventPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventStartDt, setEventStartDt] = useState('')
  const [eventEndDt, setEventEndDt] = useState('')
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      const eventId = localStorage.getItem('selectedEventId')
      if (!eventId) {
        router.push('/dashboard')
        return
      }

      try {
        const response = await axiosInstance.get(`/api/events/${eventId}`)
        const event = response.data
        setTitle(event.title || '')
        setDescription(event.description || '')
        setLocation(event.location || '')
        setEventStartDt(event.eventStartDt?.slice(0, 16) || '')
        setEventEndDt(event.eventEndDt?.slice(0, 16) || '')
        setTag(event.tag?.name || '')
      } catch (err) {
        console.error(err)
        setError('Failed to fetch event details.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const eventId = localStorage.getItem('selectedEventId')
    if (!eventId) return

    try {
      await axiosInstance.put(`/events/${eventId}`, {
        title,
        description,
        location,
        eventStartDt,
        eventEndDt,
        tag: tag.trim()
      })
      alert('Event updated successfully')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Failed to update event')
    }
  }

  if (loading) return <p>Loading event details for editing...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-black p-6 text-white">
          <CitySparkHeader />
    <div className="max-w-2xl mx-auto mt-12 p-6 border rounded shadow space-y-6">
      <BackButton />
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event Start Date</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={eventStartDt}
            onChange={(e) => setEventStartDt(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event End Date</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={eventEndDt}
            onChange={(e) => setEventEndDt(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tag</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Update Event
        </button>
      </form>
    </div>
    </div>
  )
}
