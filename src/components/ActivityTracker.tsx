import React from 'react'
import styled from 'styled-components'
import { useLocalStorage } from '../hooks/userLocalStorage'
import { saveActivityRemote, isFirebaseEnabled } from '../firebase'

const Panel = styled.section`background: rgba(255,255,255,0.02); padding:16px; border-radius:12px;`

export default function ActivityTracker({persona}:{persona?:string}){
  const [activities, setActivities] = useLocalStorage<Array<{text:string, time:string, calories:number}>>('activities', [])
  const [text, setText] = React.useState('')
  const [cal, setCal] = React.useState<number | ''>('')

  const add = async ()=>{
    if(!text.trim()) return
    const calories = typeof cal === 'number' ? cal : 0
    const entry = { text, time: new Date().toISOString(), calories }
    setActivities([entry, ...activities])
    setText('')
    setCal('')
    if (isFirebaseEnabled) {
      try { await saveActivityRemote(entry) } catch(e){ console.warn(e) }
    }
  }

  return (
    <Panel className="fade-in">
      <h3 style={{marginTop:0}}>Activity Tracker</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 90px 80px',gap:8}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="e.g. 30 min walk" />
        <input value={cal as any} onChange={e=>setCal(e.target.value === '' ? '' : Number(e.target.value))} placeholder="kcal" />
        <button onClick={add}>Add</button>
      </div>
      <ul style={{marginTop:12}}>
        {activities.map((a,i)=> (
          <li key={i} style={{padding:'6px 0',borderBottom:'1px dashed rgba(255,255,255,0.02)'}}>
            {a.text} <span style={{color:'var(--muted)',marginLeft:8,fontSize:12}}>{new Date(a.time).toLocaleString()}</span>
            <div style={{float:'right',fontWeight:700}}>{a.calories} kcal</div>
          </li>
        ))}
      </ul>
      <div style={{color:'var(--muted)',marginTop:12}}>{persona?.startsWith('diabetic') ? 'Tip: short walks after meals reduce glucose spikes.' : 'Tip: combine cardio and strength for best results.'}</div>
    </Panel>
  )
}
