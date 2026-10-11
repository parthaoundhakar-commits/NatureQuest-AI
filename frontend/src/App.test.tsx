import { render, screen } from '@testing-library/react'
import App from './App'

describe('NatureQuest app shell', () => {
  it('renders the main app landing content', () => {
    render(<App />)

    expect(screen.getByText(/NatureQuest AI/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start adventure/i })).toBeInTheDocument()
  })
})
