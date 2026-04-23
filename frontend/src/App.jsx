import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([])
  const API_URL = import.meta.env.VITE_API_URL 

  useEffect(() => {
    fetch(`${API_URL}/records`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("API Error:", err))
  }, [API_URL])

  return (
    <div>
      <h1>Music Store API Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App