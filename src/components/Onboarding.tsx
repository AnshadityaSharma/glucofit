import React from 'react'
import styled from 'styled-components'

// Lightweight onboarding that pre-fills sensible targets & sample meals.
// onApply is called with { target: number, sampleMeals: Array<...> }

const Panel = styled.section`background: rgba(255,255,255,0.02); padding:16px; border-radius:12px;`

export default function Onboarding({persona, onApply}:{persona:string, onApply:(payload:{target:number, sampleMeals:any[]})=>void}){
  // simple heuristics for target kcal by persona
  const guess = {
    'diabetic-male': 2000,
    'diabetic-female': 1700,
    'normal-male': 2400,
    'normal-female': 1900
  } as Record<string,number>

  const sampleMeals = [
    { name: 'Moong dal chilla + salad', cals: 220 },
    { name: 'Grilled chicken + veggies', cals: 320 },
    { name: 'Paneer tikka + salad', cals: 280 }
  ]

  return (
    <Panel>
      <h3>Quick Onboarding</h3>
      <p style={{color:'var(--muted)'}}>We’ll pre-fill a daily calorie target and sample meals you can use immediately. You can always edit later.</p>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{fontWeight:700}}>Suggested target:</div>
        <div>{guess[persona] ?? 2000} kcal/day</div>
      </div>

      <div style={{marginTop:10}}>
        <div style={{fontWeight:700}}>Sample meals:</div>
        <ul>
          {sampleMeals.map(s=> <li key={s.name}>{s.name} — {s.cals} kcal</li>)}
        </ul>
      </div>

      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button onClick={()=> onApply({target: guess[persona] ?? 2000, sampleMeals})}>Apply suggested</button>
        <button onClick={()=> onApply({target: 2000, sampleMeals})}>Apply default</button>
      </div>
    </Panel>
  )
}
