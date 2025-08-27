import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'

const Panel = styled.section`background: rgba(255,255,255,0.02); padding:16px; border-radius:12px;`

function calcBMI(h:number,w:number){ if(!h||!w) return null; const m=h/100; return +(w/(m*m)).toFixed(1) }
function calcBMR(sex:'male'|'female',age:number,h:number,w:number){ const s = sex==='female' ? -161 : 5; return Math.round(10*w + 6.25*h - 5*age + s) }

export default function Calculator({persona, onTargetChange}:{persona:string, onTargetChange:(v:number|null)=>void}){
  const defaults = persona.includes('female') ? {age:30,sex:'female',h:160,w:68} : {age:30,sex:'male',h:172,w:78}
  const [age,setAge] = useState(defaults.age)
  const [sex,setSex] = useState<'male'|'female'>(defaults.sex as 'male'|'female')
  const [height,setHeight] = useState(defaults.h)
  const [weight,setWeight] = useState(defaults.w)
  const [activity,setActivity] = useState<'sedentary'|'light'|'moderate'|'active'>('light')
  const [goal,setGoal] = useState<'cut-15'|'maintain'|'gain-10'>('cut-15')

  const bmi = useMemo(()=> calcBMI(height,weight), [height,weight])
  const bmr = useMemo(()=> calcBMR(sex,age,height,weight), [sex,age,height,weight])
  const tdee = useMemo(()=> Math.round(bmr * ({sedentary:1.2,light:1.375,moderate:1.55,active:1.725}[activity]||1.2)), [bmr,activity])
  const target = useMemo(()=> Math.round(tdee * ({'cut-15':0.85,'maintain':1,'gain-10':1.1}[goal])), [tdee,goal])

  useEffect(()=>{ onTargetChange(target) }, [target, onTargetChange])

  return (
    <Panel className="fade-in" aria-label="Calculator">
      <h3 style={{marginTop:0}}>Personal Calculator</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        <input aria-label="age" type="number" value={age} onChange={e=>setAge(Math.max(12,Math.min(100,Number(e.target.value)||12)))} />
        <select aria-label="sex" value={sex} onChange={e=>setSex(e.target.value as any)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select aria-label="activity" value={activity} onChange={e=>setActivity(e.target.value as any)}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
        </select>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:10}}>
        <div>
          <label>Height (cm)</label>
          <input type="number" value={height} onChange={e=>setHeight(Number(e.target.value||0))} />
        </div>
        <div>
          <label>Weight (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value||0))} />
        </div>
      </div>

      <div style={{display:'flex',gap:10,marginTop:12,alignItems:'center'}}>
        <select value={goal} onChange={e=>setGoal(e.target.value as any)}>
          <option value="cut-15">Lose 15%</option>
          <option value="maintain">Maintain</option>
          <option value="gain-10">Gain 10%</option>
        </select>

        <div style={{flex:1,textAlign:'right'}}>
          <div style={{fontSize:20,fontWeight:700}}>{bmi ?? '—'}</div>
          <div style={{color:'var(--muted)'}}>BMI</div>
        </div>
        <div style={{width:120,textAlign:'right'}}>
          <div style={{fontSize:18,fontWeight:700}}>{bmr}</div>
          <div style={{color:'var(--muted)'}}>BMR</div>
        </div>
        <div style={{width:120,textAlign:'right'}}>
          <div style={{fontSize:18,fontWeight:700}}>{target}</div>
          <div style={{color:'var(--muted)'}}>Target kcal/day</div>
        </div>
      </div>
    </Panel>
  )
}
