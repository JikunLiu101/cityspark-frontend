'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

interface Event {
  id: number
  title: string
  description: string
  location: string
  eventStartDt: string
  eventEndDt: string
  createdDt: string
  updatedDt: string
  status: string
  tag: { id: number, name: string }
}

interface Participation {
  person: any
  id: number
  role: string // Organizer / Attendee
  status: string
}

export default function EventPage() {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [participants, setParticipants] = useState<Participation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isOrganizer, setIsOrganizer] = useState(false)
  const [isParticipant, setIsParticipant] = useState(false)

  const personId = typeof window !== 'undefined' ? localStorage.getItem('personId') : null
  const eventId = typeof window !== 'undefined' ? localStorage.getItem('selectedEventId') : null
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null


  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) {
        router.push('/dashboard')
        return
      }

      try {
        const profileResponse = await axiosInstance.get(`/users/${userId}/profile`)
        const data = profileResponse.data
        if (data && data.personId) {
          localStorage.setItem('personId', data.personId.toString())
        }

        const [eventRes, participantsRes] = await Promise.all([
          axiosInstance.get(`/events/${eventId}`),
          axiosInstance.get(`/registrations/event/${eventId}`)
        ])

        const eventData = eventRes.data
        const participantsData = participantsRes.data

        setEvent(eventData)
        setParticipants(participantsData)

        if (personId) {
          const myParticipation = participantsData.find((p: Participation) => p.person.id === parseInt(personId))
          if (myParticipation) {
            setIsParticipant(true)
            if (myParticipation.role === 'Organizer') {
              setIsOrganizer(true)
            }
          }
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load event or participants')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId, personId, router])

  const handleParticipate = async () => {
    const eventId = typeof window !== 'undefined' ? localStorage.getItem('selectedEventId') : null
    const personId = typeof window !== 'undefined' ? localStorage.getItem('personId') : null
    console.log('personId:' ,localStorage.getItem('personId'))
  
    if (!personId || !eventId) {
      alert('Invalid person or event id. Please refresh page and try again.')
      return
    }
  
    try {
      await axiosInstance.post(`/registrations/register?personId=${personId}&eventId=${eventId}`)
      alert('Successfully registered!')
      router.refresh() // Refresh the page
    } catch (err) {
      console.error(err)
      alert('Failed to register')
    }
  }

  const handleUnregister = async () => {
    const eventId = typeof window !== 'undefined' ? localStorage.getItem('selectedEventId') : null
    const personId = typeof window !== 'undefined' ? localStorage.getItem('personId') : null
  
    if (!personId || !eventId) {
      alert('Invalid person or event id. Please refresh page and try again.')
      return
    }
  
    try {
      await axiosInstance.post(`/registrations/unregister?personId=${personId}&eventId=${eventId}`)
      alert('Successfully unregistered from the event!')
      router.refresh() // Refresh page after unregister
    } catch (err) {
      console.error(err)
      alert('Failed to unregister')
    }
  }
  
  

  if (loading) return <p>Loading event details...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!event) return <p>Event not found.</p>

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 border rounded shadow space-y-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-700">{event.description}</p>
      <p className="text-gray-600">Location: {event.location}</p>
      <p className="text-gray-600">Start: {new Date(event.eventStartDt).toLocaleString()}</p>
      <p className="text-gray-600">End: {new Date(event.eventEndDt).toLocaleString()}</p>
      <p className="text-gray-600">Status: {event.status}</p>
      <p className="text-gray-600">Category: {event.tag?.name}</p>

      {!isParticipant ? (
        <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={handleParticipate}
        >
            Participate in Event
        </button>
        ) : (
        <button
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={handleUnregister}
        >
            Unregister from Event
        </button>
      )}


      {isOrganizer && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Participants</h2>
          <div className="space-y-2">
            {participants.map((p) => (
              <div key={p.id} className="p-2 border rounded">
                <b>Participant Name:</b> {p.person.name}<br></br>
                <b>Role:</b> {p.role}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
