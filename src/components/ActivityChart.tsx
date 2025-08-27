import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useLocalStorage } from '../hooks/userLocalStorage'

function formatDateKey(iso:string){ const d = new Date(iso); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}` }

export default function ActivityChart(){
  const [activities] = useLocalStorage<Array<{text:string,time:string,calories:number}>>('activities', [])

  const data = useMemo(()=>{
    const map = new Map<string, number>()
    const now = new Date()
    for(let i=6;i>=0;i--){ const d = new Date(); d.setDate(now.getDate()-i); map.set(formatDateKey(d.toISOString()), 0) }
    activities.forEach(a=>{
      const key = formatDateKey(a.time)
      if(map.has(key)) map.set(key, (map.get(key)||0) + (a.calories||0))
    })
    return Array.from(map.entries()).map(([k,v])=>({date:k.split('-').slice(1).join('/'), kcal:v}))
  }, [activities])

  return (
    <div style={{marginTop:18, background:'rgba(255,255,255,0.02)', padding:12, borderRadius:12}}>
      <h4 style={{marginTop:0}}>Activity (last 7 days)</h4>
      <div style={{width:'100%', height:200}}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="kcal" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
