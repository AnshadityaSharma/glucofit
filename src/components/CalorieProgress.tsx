import React, { useMemo } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { useLocalStorage } from '../hooks/userLocalStorage'

export default function CalorieProgress({target}:{target:number | null}){
  const [foodLog] = useLocalStorage<Array<{name:string,calories:number,time:string}>>('foodLog', [])

  const todayKey = useMemo(()=>{
    const d = new Date(); 
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
  },[])

  const todayCalories = useMemo(()=> 
    foodLog.reduce((s,f)=>{
      const ft = new Date(f.time); 
      const key = `${ft.getFullYear()}-${ft.getMonth()+1}-${ft.getDate()}`
      return s + (key===todayKey ? f.calories : 0)
    }, 0)
  , [foodLog, todayKey])

  const percent = target ? Math.min(100, Math.round((todayCalories / target) * 100)) : 0
  const data = [{ name: 'Consumed', value: percent }]

  return (
    <div style={{background:'rgba(255,255,255,0.02)', padding:12, borderRadius:12}}>
      <h4 style={{marginTop:0}}>Calorie Progress (today)</h4>
      <div style={{width:'100%', height:220}}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}   // negative makes it clockwise
          >
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              fill="#34d399"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div style={{marginTop:8}}>
        <div style={{fontWeight:700}}>{todayCalories} kcal</div>
        <div style={{color:'var(--muted)'}}>target: {target ?? '—'} kcal</div>
      </div>
    </div>
  )
}
