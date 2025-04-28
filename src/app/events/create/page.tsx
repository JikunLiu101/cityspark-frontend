'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

export default function CreateEventPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventStartDt, setEventStartDt] = useState(() => new Date().toISOString().slice(0, 16))
  const [eventEndDt, setEventEndDt] = useState(() => {
    const end = new Date()
    end.setHours(end.getHours() + 1)
    return end.toISOString().slice(0, 16)
  })
  const [tag, setTag] = useState('')
  const [error, setError] = useState('')
  const [personId, setPersonId] = useState<number | null>(null)

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  useEffect(() => {
    const fetchPersonId = async () => {
      if (!userId) {
        router.push('/login')
        return
      }

      try {
        const response = await axiosInstance.get(`/users/${userId}/profile`)
        if (response.data && response.data.personId) {
          setPersonId(response.data.personId)
        } else {
          console.error('No person profile found.')
          setError('No person profile found. Please create your profile first.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load profile.')
      }
    }

    fetchPersonId()
  }, [userId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personId || !tag.trim()) return

    try {
      await axiosInstance.post(`/events?creatorPersonId=${personId}`, {
        title,
        description,
        location,
        eventStartDt,
        eventEndDt,
        tag: tag.trim()
      })
      alert('Event created successfully')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Failed to create event')
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 border rounded shadow">
        <h1 className="text-xl font-bold text-red-500">{error}</h1>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 border rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">Create Event</h1>
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
            placeholder="Enter a tag for your event"
            required
          />
        </div>
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Create Event
        </button>
      </form>
    </div>
  )
}
