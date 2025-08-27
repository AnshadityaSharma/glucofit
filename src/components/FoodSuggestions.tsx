// src/components/FoodSuggestions.tsx  (replace entire file)
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import foods from '../data/foods.json'
import { useLocalStorage } from '../hooks/userLocalStorage'

const Panel = styled.section`background: rgba(255,255,255,0.02); padding:16px; border-radius:12px;`

export default function FoodSuggestions({persona}:{persona:string}){
  const [q,setQ] = useState('')
  const [foodLog, setFoodLog] = useLocalStorage<Array<{name:string, calories:number, time:string}>>('foodLog', [])
  const [hideNotRecommended, setHideNotRecommended] = useState<boolean>(persona.startsWith('diabetic') ? true : false)

  const list = useMemo(()=> foods as Array<any>,[])
  // search-only filter; recommendation filter applied after so we can choose to show warnings
  const searched = useMemo(()=> list.filter(f => f.name.toLowerCase().includes(q.toLowerCase())), [q, list])

  // optionally hide not recommended if toggle enabled
  const results = useMemo(()=> {
    if (!hideNotRecommended) return searched
    return searched.filter(f=> persona.startsWith('diabetic') ? f.diabeticSafe : true)
  }, [searched, hideNotRecommended, persona])

  const addToDay = (f:any)=>{
    // if not recommended for diabetic persona, confirm before adding
    if (persona.startsWith('diabetic') && !f.diabeticSafe) {
      const ok = window.confirm(`${f.name} is not recommended for people with diabetes. Add anyway?`)
      if (!ok) return
    }
    const entry = { name: f.name, calories: f.calories, time: new Date().toISOString() }
    setFoodLog([entry, ...foodLog])
  }

  return (
    <Panel className="fade-in" aria-label="Food suggestions">
      <h3 style={{marginTop:0}}>Food Checker</h3>
      <p style={{color:'var(--muted)'}}>Type a food to check quick suitability for the selected persona.</p>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
        <input aria-label="food search" style={{flex:1}} value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Brown rice, Ice cream" />
        <label style={{display:'flex',alignItems:'center',gap:6,color:'var(--muted)'}}>
          <input type="checkbox" checked={hideNotRecommended} onChange={e=>setHideNotRecommended(e.target.checked)} />
          Hide not recommended
        </label>
      </div>

      <div style={{marginTop:12}}>
        <ul>
          {results.map((r)=> {
            const notRecommended = persona.startsWith('diabetic') && !r.diabeticSafe
            return (
              <li key={r.name} style={{padding:'8px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <strong>{r.name}</strong> — {r.calories} kcal • <span style={{color:'var(--muted)'}}>{r.tags.join(', ')}</span>
                  {notRecommended && <span style={{marginLeft:8}} className="badge warn">Not recommended</span>}
                </div>
                <div>
                  <button onClick={()=>addToDay(r)} aria-label={`Add ${r.name} to today`}>Add</button>
                </div>
              </li>
            )
          })}
        </ul>
        {results.length===0 && <div style={{color:'var(--muted)',marginTop:8}}>No matches</div>}
      </div>

      <div style={{marginTop:12}}>
        <h4 style={{marginBottom:6}}>Today's foods</h4>
        <ul>
          {foodLog.slice(0,6).map((f,i)=> (
            <li key={i} style={{padding:'6px 0'}}>{f.name} — {f.calories} kcal <span style={{color:'var(--muted)',marginLeft:8,fontSize:12}}>{new Date(f.time).toLocaleTimeString()}</span></li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
