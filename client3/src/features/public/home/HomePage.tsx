import { Button } from '@/components/ui/button'
import { useAuth } from '../../../../../client/contexts/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user || token) {
      setLoading(false)
    }
  }, [user, token])

  return (
    <div>
      <h1>HomePage</h1>
      <Button>Bouton qui clic</Button>
    </div>
  )
}
