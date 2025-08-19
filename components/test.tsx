import React, { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)

  const onClick = () => {
    setCount(count + 1)
  }
  return (
    <div>
      <h1>Hello World</h1>
      <div style={{display: 'flex', gap: '10px'}}>
        <span>Count: {count}</span>
        <button type="button" onClick={onClick}> + 1</button>
      </div>
    </div>
  )
}