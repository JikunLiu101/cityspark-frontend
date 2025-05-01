'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import CitySparkHeader from '@/component.tsx/CitySparkHeader'

export default function ProfilePage() {
  const router = useRouter()
  const [contactNo, setContactNo] = useState('')
  const [description, setDescription] = useState('')
  const [birthday, setBirthday] = useState('')
  const [imageId, setImageId] = useState<number | null>(null)
  const [preferences, setPreferences] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState('')
  const [allTags, setAllTags] = useState<string[]>([]) // for showing available preferences
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  useEffect(() => {
    if (!userId) {
      router.push('/login')
      return
    }

    const fetchProfileAndTags = async () => {
      try {
        // 1. Fetch user profile
        const profileResponse = await axiosInstance.get(`/users/${userId}/profile`)
        const data = profileResponse.data
        setName(data.name || '')
        setContactNo(data.contactNo || '')
        setDescription(data.description || '')
        setBirthday(data.birthday || '')
        setImageId(data.imageId || null)
        setPreferences(data.preferences || [])
        if (data && data.personId) {
          localStorage.setItem('personId', data.personId.toString()) // ✅ Store globally
        }

        // 2. Fetch all available tags (preference options)
        const tagsResponse = await axiosInstance.get(`/tags`)
        const tagsData = tagsResponse.data
        setAllTags(tagsData.map((tag: any) => tag.name)) // Assuming tag object has 'name'
      } catch (err: any) {
        if (err.response?.status === 404) {
          // No profile yet, allow creating new
          // Fetch tags anyway
          const tagsResponse = await axiosInstance.get(`/tags`)
          const tagsData = tagsResponse.data
          setAllTags(tagsData.map((tag: any) => tag.name))
        } else {
          setError('Failed to fetch profile or tags.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndTags()
  }, [userId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
  
    try {
      await axiosInstance.put(`/users/${userId}/profile`, {
        name,
        contactNo,
        description,
        birthday,
        imageId,
        preferences
      })
      alert('Profile saved successfully')
      setError('') // ✅ Clear any previous error
    } catch (err) {
      setError('Failed to save profile')
    }
  }
  

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value)
    setPreferences(selectedOptions)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-black p-6 text-white">
          <CitySparkHeader />
    <div className="max-w-2xl mx-auto mt-12 p-6 border rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
        />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={contactNo}
            onChange={e => setContactNo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            required
          />
        </div>
        <div>
            <label className="block text-sm font-medium">Preferences</label>
            <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
                    setPreferences([...preferences, newPreference.trim()])
                    setNewPreference('')
                    }
                }
                }}
                placeholder="Type a preference and press Enter"
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {preferences.map((pref, idx) => (
                <div key={idx} className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                    <span>{pref}</span>
                    <button
                    type="button"
                    className="ml-2 text-red-600"
                    onClick={() => setPreferences(preferences.filter((p) => p !== pref))}
                    >
                    ×
                    </button>
                </div>
                ))}
            </div>
        </div>
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Save Profile
        </button>
      </form>
    </div>
    </div>
  )
}
