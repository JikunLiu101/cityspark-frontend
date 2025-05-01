'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { useRouter } from 'next/navigation'
import BackButton from '@/component.tsx/BackButton'
import CitySparkHeader from '@/component.tsx/CitySparkHeader'

interface Notification {
  id: number
  subject: string
  content: string
  status: string // "Read" or "Unread"
  createdDt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [error, setError] = useState('')
  const personId = typeof window !== 'undefined' ? localStorage.getItem('personId') : null

  const fetchNotifications = async () => {
    try {
      const url = showUnreadOnly
        ? `/notifications/person/${personId}/unread`
        : `/notifications/person/${personId}`
      const res = await axiosInstance.get(url)
      setNotifications(res.data)
    } catch (err) {
      setError('Failed to fetch notifications.')
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await axiosInstance.post(`/notifications/${id}/read`)
      fetchNotifications()
    } catch (err) {
      console.error(err)
      alert('Failed to mark notification as read.')
    }
  }

  useEffect(() => {
    if (personId) fetchNotifications()
  }, [showUnreadOnly])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-black p-6 text-white">
    <CitySparkHeader />
    <div className="max-w-4xl mx-auto mt-12 p-6 space-y-6">
    <BackButton />
    <div className="flex items-center justify-between mb-6">
    <h1 className="text-3xl font-bold">Notifications</h1>
    <label className="flex items-center space-x-2 text-white">
        <input
        type="checkbox"
        checked={showUnreadOnly}
        onChange={(e) => setShowUnreadOnly(e.target.checked)}
        className="accent-white"
        />
        <span>Show unread only</span>
    </label>
    </div>


    {error && <p className="text-red-500">{error}</p>}


    <div className="space-y-4">
    {notifications.map((n) => (
        <div className="bg-white text-black p-4 rounded-lg shadow-md space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
        <span>{new Date(n.createdDt).toLocaleString()}</span>
        <span className={`font-semibold ${n.status === 'U' ? 'text-yellow-600' : 'text-green-600'}`}>
            {n.status === 'U' ? 'Unread' : 'Read'}
        </span>
        </div>
        <h2 className="text-lg font-semibold text-purple-800">{n.subject}</h2>
        <p>{n.content}</p>
        {n.status === 'U' && (
        <button
            onClick={() => markAsRead(n.id)}
            className="text-sm text-blue-600 underline hover:text-blue-800"
        >
            Mark as Read
        </button>
        )}
    </div>        
    ))}
    </div>
    </div>
    </div>
  )
}
