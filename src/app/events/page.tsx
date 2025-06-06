'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import CitySparkHeader from '@/component.tsx/CitySparkHeader'
import BackButton from '@/component.tsx/BackButton'

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

  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [notifMessage, setNotifMessage] = useState('')


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
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-black p-6 text-white">
          <CitySparkHeader />
    <div className="max-w-4xl mx-auto mt-12 p-6 border rounded shadow space-y-6">
      <BackButton />
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-white">{event.description}</p>
      <p className="text-white">Location: {event.location}</p>
      <p className="text-white">Start: {new Date(event.eventStartDt).toLocaleString()}</p>
      <p className="text-white">End: {new Date(event.eventEndDt).toLocaleString()}</p>
      <p className="text-white">Status: {event.status}</p>
      <p className="text-white">Category: {event.tag?.name}</p>

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
        <>
        <div className="mt-10 border-t pt-6"></div>
          <h2 className="text-2xl font-semibold mb-4">Send Notification</h2>
            {notifMessage && <p className="text-green-400">{notifMessage}</p>}
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                await axiosInstance.post('/notifications/event', null, {
                  params: {
                    organizerId: personId,
                    eventId: eventId,
                    subject,
                    content,
                  },
                })
                setNotifMessage('Notification sent successfully!')
                setSubject('')
                setContent('')
              } catch (err) {
                console.error(err)
                alert('Failed to send notification')
              }
            } }
            className="space-y-4"
          >
          <div>
            <label className="block mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded text-black border border-white bg-opacity-90"
              required />
          </div>
          <div>
            <label className="block mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded text-black border border-white bg-opacity-90"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Send Notification
          </button>
          </form>
        <div className="mt-10 border-t pt-6"></div>
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
        </>
      )}
    </div>
    </div>
  )
}
