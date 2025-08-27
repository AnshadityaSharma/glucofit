import React from 'react'
import styled from 'styled-components'

type Persona = 'diabetic-male' | 'diabetic-female' | 'normal-male' | 'normal-female'

const personas: { id: Persona; label: string }[] = [
  { id: 'diabetic-male', label: 'Diabetic Male' },
  { id: 'diabetic-female', label: 'Diabetic Female' },
  { id: 'normal-male', label: 'Normal Male' },
  { id: 'normal-female', label: 'Normal Female' },
]

const TabsContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 18px;
`

const TabButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &[aria-selected='true'] {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text);
    border-color: var(--border);
  }

  &:hover:not([aria-selected='true']) {
    background-color: rgba(255, 255, 255, 0.02);
  }
`

interface PersonaTabsProps {
  value: Persona
  onChange: (newValue: Persona) => void
}

export default function PersonaTabs({ value, onChange }: PersonaTabsProps) {
  return (
    <TabsContainer role="tablist" aria-label="Select a persona">
      {personas.map((p) => (
        <TabButton key={p.id} role="tab" aria-selected={value === p.id} onClick={() => onChange(p.id)}>
          {p.label}
        </TabButton>
      ))}
    </TabsContainer>
  )
}
