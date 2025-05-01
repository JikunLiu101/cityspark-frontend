'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react' // Optional icon lib

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="flex items-center text-white hover:text-blue-400 transition"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back
    </button>
  )
}
