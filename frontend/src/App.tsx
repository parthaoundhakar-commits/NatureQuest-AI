import { useMemo, useState, type ChangeEvent } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  CloudOff,
  Compass,
  Footprints,
  Leaf,
  Map,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trees,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react'
import type { JournalEntry, Mission, Observation, TabKey } from './types'

const navItems: { label: TabKey; icon: typeof Compass }[] = [
  { label: 'Home', icon: Compass },
  { label: 'Discover', icon: Sparkles },
  { label: 'Nature Missions', icon: Footprints },
  { label: 'Identify Nature', icon: Camera },
  { label: 'Biodiversity Map', icon: Map },
  { label: 'Eco Community', icon: Users },
  { label: 'Nature Journal', icon: NotebookPen },
  { label: 'Nature AI Lab', icon: Bot },
  { label: 'Settings', icon: ShieldCheck },
]

const baseMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Leaf Edge Match',
    description: 'Find two leaves with different edge patterns and compare how they feel and look.',
    learningObjective: 'Observe leaf morphology and habitat clues.',
    estimatedDuration: 15,
    difficulty: 'beginner',
    completionCriteria: 'Identify at least two different leaf edges and note the difference.',
    safetyGuidance: 'Stay on marked paths and avoid touching unknown plants or mushrooms.',
    ecoXp: 25,
    source: 'local_fallback',
  },
  {
    id: 'mission-2',
    title: 'Bird Watch from Respectful Distance',
    description: 'Listen for calls and watch one bird without approaching it.',
    learningObjective: 'Learn to notice behavior and habitat without disturbance.',
    estimatedDuration: 20,
    difficulty: 'intermediate',
    completionCriteria: 'Record one bird behavior and one habitat clue.',
    safetyGuidance: 'Keep a respectful distance and never feed, corner, or chase wildlife.',
    ecoXp: 30,
    source: 'local_ai',
  },
]

const defaultJournal: JournalEntry[] = [
  {
    id: 'entry-1',
    title: 'Morning tree check',
    notes: 'The neem tree had fresh leaves and a humming bee was navigating the warm morning light.',
    location: 'Campus garden',
    category: 'Trees',
    date: '2026-10-11',
  },
]

const defaultObservations: Observation[] = [
  { id: 'obs-1', label: 'Japanese maple', type: 'Tree', confidence: 'High', status: 'synced', location: 'North park', notes: 'Strong autumn color' },
  { id: 'obs-2', label: 'Monarch butterfly', type: 'Insect', confidence: 'Medium', status: 'pending', location: 'Wildflower patch', notes: 'Visited nectar-rich flowers' },
  { id: 'obs-3', label: 'Clover patch', type: 'Plant', confidence: 'High', status: 'failed', location: 'Community garden', notes: 'Needs better photo evidence' },
]

const badgeCatalog = ['First Adventure', 'Leaf Detective', 'Bird Observer', 'Pollinator Protector', 'Offline Explorer', 'Community Scientist', 'Seven-Day Explorer']

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('Home')
  const [darkMode, setDarkMode] = useState(false)
  const [missions, setMissions] = useState<Mission[]>(baseMissions)
  const [journal, setJournal] = useState<JournalEntry[]>(defaultJournal)
  const [observations, setObservations] = useState<Observation[]>(defaultObservations)
  const [xp, setXp] = useState(620)
  const [selectedMission, setSelectedMission] = useState<Mission>(baseMissions[0])
  const [generatedQuest, setGeneratedQuest] = useState<Mission | null>(baseMissions[0])
  const [screenFreeMode, setScreenFreeMode] = useState(false)
  const [screenFreeMinutes, setScreenFreeMinutes] = useState(10)
  const [screenFreeReflection, setScreenFreeReflection] = useState('')
  const [targetCategory, setTargetCategory] = useState('flowers')
  const [imageName, setImageName] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [identification, setIdentification] = useState({
    commonName: 'Wildflower cluster',
    scientificName: 'Unknown',
    confidence: 'Moderate',
    explanation: 'The petals and leaf arrangement suggest a flower with bright pollinator appeal, but the exact species remains uncertain without a closer image.',
    alternatives: ['Dandelion', 'Buttercup', 'Lantana'],
  })
  const [offlineStatus, setOfflineStatus] = useState<'online' | 'offline'>('online')
  const [backendStatus, setBackendStatus] = useState<'ready' | 'unavailable'>('ready')
  const [aiStatus, setAiStatus] = useState<'ready' | 'fallback'>('ready')
  const [journalTitle, setJournalTitle] = useState('')
  const [journalNotes, setJournalNotes] = useState('')
  const [journalLocation, setJournalLocation] = useState('Local park')
  const [statusMessage, setStatusMessage] = useState('Everything is ready for an outdoor session.')

  const level = useMemo(() => Math.max(1, Math.floor(xp / 150) + 1), [xp])
  const badgeCount = useMemo(() => badgeCatalog.slice(0, Math.min(3, Math.max(1, Math.floor(xp / 200)))).length, [xp])

  const generateLocalFallback = (time = 15, interest = 'plants'): Mission => ({
    id: `quest-${Date.now()}`,
    title: `${interest[0].toUpperCase()}${interest.slice(1)} pattern search`,
    description: `Spend a few mindful minutes exploring a ${interest} pattern near you and record what changes across the area.`,
    learningObjective: 'Practice careful observation and compare microhabitats in a local green space.',
    estimatedDuration: time,
    difficulty: 'beginner',
    completionCriteria: 'Record at least three clues and make one comparison between two nearby spots.',
    safetyGuidance: 'Stay on paths and do not disturb wildlife or handle unknown plants.',
    ecoXp: 30,
    source: 'local_fallback',
  })

  const handleGenerateQuest = async () => {
    const payload = {
      time: '20',
      difficulty: 'beginner',
      interest: 'plants',
      environment: 'park',
      age_group: 'adult',
      accessibility: 'easy_access',
      group_mode: 'solo',
    }

    try {
      const response = await fetch('http://localhost:8000/api/quests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Quest generation failed')
      }

      const quest = await response.json()
      setGeneratedQuest(quest)
      setSelectedMission(quest)
      setAiStatus('ready')
      setBackendStatus('ready')
      setStatusMessage('Local AI quest generated successfully.')
      setActiveTab('Nature Missions')
      return
    } catch {
      const fallback = generateLocalFallback(20, 'plants')
      setGeneratedQuest(fallback)
      setSelectedMission(fallback)
      setAiStatus('fallback')
      setBackendStatus('unavailable')
      setStatusMessage('The local backend is unavailable, so the offline quest library has been used instead.')
      setActiveTab('Nature Missions')
    }
  }

  const completeMission = (missionId: string) => {
    const target = missions.find((mission) => mission.id === missionId)
    if (!target) return

    setMissions((current) =>
      current.map((mission) =>
        mission.id === missionId ? { ...mission, completed: true } : mission,
      ),
    )

    setXp((current) => current + target.ecoXp)
    setStatusMessage(`${target.title} completed. Eco XP has been added to your local progress.`)

    setJournal((current) => [
      {
        id: `journal-${Date.now()}`,
        title: target.title,
        notes: `Completed in ${target.estimatedDuration} minutes. Reflection: I noticed a new pattern and practiced careful observation.`,
        location: 'Local nature walk',
        category: 'Quest',
        date: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ])
  }

  const saveJournalEntry = () => {
    if (!journalTitle || !journalNotes) return

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title: journalTitle,
      notes: journalNotes,
      location: journalLocation,
      category: targetCategory,
      date: new Date().toISOString().slice(0, 10),
    }

    setJournal((current) => [entry, ...current])
    setJournalTitle('')
    setJournalNotes('')
    setStatusMessage('A new journal entry has been saved privately on this device.')
  }

  const runIdentification = () => {
    const map: Record<string, { commonName: string; scientificName: string; confidence: string; explanation: string; alternatives: string[] }> = {
      flowers: {
        commonName: 'Wild daisy',
        scientificName: 'Bellis perennis',
        confidence: 'Moderate',
        explanation: 'Round flower heads and a low-growing habit fit common daisy-like blooms, but a close look is still required for a confident identification.',
        alternatives: ['Dandelion', 'Aster', 'Chamomile'],
      },
      leaves: {
        commonName: 'Maple leaf',
        scientificName: 'Acer spp.',
        confidence: 'Low',
        explanation: 'The lobed shape matches common maple leaves, but the sample may also come from other broadleaf trees.',
        alternatives: ['Sycamore', 'Sweetgum', 'Ash'],
      },
      birds: {
        commonName: 'Robin',
        scientificName: 'Turdus migratorius',
        confidence: 'Moderate',
        explanation: 'A rounded body shape and warm breast color suggest a robin, but habitat context matters here.',
        alternatives: ['Thrush', 'Blackbird', 'Myna'],
      },
      insects: {
        commonName: 'Butterfly',
        scientificName: 'Unknown',
        confidence: 'Low',
        explanation: 'Wing shape and flight ease match a butterfly, though the image quality is not high enough to confirm the exact species.',
        alternatives: ['Moth', 'Skipper', 'Bee'],
      },
    }

    const result = map[targetCategory] ?? map.flowers
    setIdentification(result)
    setStatusMessage('Identification has been estimated with caution. The app is keeping uncertainty visible and grounded in observable traits.')
  }

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)
  }

  const handleScreenFreeProceed = () => {
    setScreenFreeMode(true)
    setStatusMessage('The screen is now intentionally minimized. Lock the device and explore for your selected time window.')
  }

  const saveScreenFreeReflection = () => {
    if (!screenFreeReflection.trim()) return
    setJournal((current) => [
      {
        id: `screen-free-${Date.now()}`,
        title: 'Screen-free reflection',
        notes: screenFreeReflection,
        location: 'Outdoor observation',
        category: 'Reflection',
        date: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ])
    setObservations((current) => [
      {
        id: `obs-${Date.now()}`,
        label: 'Screen-free reflection',
        type: 'Reflection',
        confidence: 'User report',
        status: 'synced',
        location: 'Outdoor session',
        notes: screenFreeReflection.slice(0, 120),
      },
      ...current,
    ])
    setXp((current) => current + 20)
    setScreenFreeMode(false)
    setScreenFreeReflection('')
    setStatusMessage('Your reflective observation has been saved locally and added to your Eco XP.')
  }

  const renderPanel = () => {
    switch (activeTab) {
      case 'Discover':
        return (
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Forest patterns', 'Look for contrast between shade and sunlight to spot microhabitats.', '15 min'],
              ['Pollinator signs', 'Look for movement on flowers without approaching or touching them.', '10 min'],
              ['Sound mapping', 'Listen for three distinct nature sounds and note where they carry best.', '12 min'],
            ].map(([title, text, time]) => (
              <div key={title} className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between">
                  <Leaf className="h-5 w-5 text-emerald-700" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{time}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        )
      case 'Nature Missions':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 text-white shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Today’s mission</p>
                  <h3 className="mt-2 text-2xl font-semibold">{generatedQuest?.title ?? 'Leaf Edge Match'}</h3>
                </div>
                <button type="button" onClick={handleScreenFreeProceed} className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">Start Screen-Free Adventure</button>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-emerald-50">{generatedQuest?.description}</p>
            </div>

            {screenFreeMode ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-950/40">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-700">Screen-free mode</p>
                <div className="mb-3 flex items-center gap-3">
                  <TimerReset className="h-5 w-5 text-amber-700" />
                  <span className="text-xl font-semibold text-amber-900 dark:text-amber-200">{screenFreeMinutes}-minute quiet walk</span>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <label className="text-sm font-medium text-amber-800 dark:text-amber-200">Duration</label>
                  <select value={screenFreeMinutes} onChange={(event) => setScreenFreeMinutes(Number(event.target.value))} className="rounded-full border border-amber-300 bg-white px-3 py-1 text-sm text-slate-900">
                    <option value={5}>5 min</option>
                    <option value={10}>10 min</option>
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                  </select>
                </div>
                <p className="mb-4 text-sm text-amber-700 dark:text-amber-200">Close or lock the screen, explore slowly, and return when ready to record what you noticed.</p>
                <textarea value={screenFreeReflection} onChange={(event) => setScreenFreeReflection(event.target.value)} placeholder="What did you observe and learn?" className="w-full rounded-2xl border border-amber-300 bg-white p-3 text-sm text-slate-900 outline-none ring-0" rows={4} />
                <button type="button" onClick={saveScreenFreeReflection} className="mt-3 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500">Save reflection</button>
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              {missions.map((mission) => (
                <div key={mission.id} className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">{mission.difficulty}</span>
                    <span className="text-sm font-medium text-slate-500">{mission.estimatedDuration} min</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{mission.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{mission.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p><strong>Objective:</strong> {mission.learningObjective}</p>
                    <p><strong>Complete:</strong> {mission.completionCriteria}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-semibold text-emerald-700">+{mission.ecoXp} Eco XP</span>
                    <button type="button" onClick={() => { setSelectedMission(mission); completeMission(mission.id) }} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">{mission.completed ? 'Completed' : 'Complete mission'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'Identify Nature':
        return (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Choose the object category</label>
              <select value={targetCategory} onChange={(event) => setTargetCategory(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                <option value="flowers">Flowers</option>
                <option value="leaves">Leaves</option>
                <option value="birds">Birds</option>
                <option value="insects">Insects</option>
              </select>

              <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                <input type="file" accept="image/*" capture="environment" onChange={handleFileInput} className="block w-full text-sm" />
                {imageName ? <p className="mt-2 text-xs font-medium">Selected image: {imageName}</p> : null}
              </div>

              {imagePreview ? (
                <img src={imagePreview} alt="Nature preview" className="mt-5 aspect-[4/3] w-full rounded-2xl object-cover" />
              ) : null}

              <div className="mt-5 flex gap-3">
                <button type="button" onClick={runIdentification} className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">Run identification</button>
                <button type="button" onClick={() => setImagePreview(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200">Retake</button>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Identification</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">{identification.confidence}</span>
              </div>
              <p className="text-sm text-slate-500">Suggested common name</p>
              <h4 className="text-2xl font-bold text-forest dark:text-emerald-200">{identification.commonName}</h4>
              <p className="mt-2 text-sm italic text-slate-500">Scientific name: {identification.scientificName}</p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{identification.explanation}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Similar-looking alternatives</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {identification.alternatives.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <p className="mt-4 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300"><AlertTriangle className="mt-0.5 h-4 w-4" /> Identification uncertain — a closer, well-lit image and expert verification are recommended.</p>
            </div>
          </div>
        )
      case 'Biodiversity Map':
        return (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Biodiversity map</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Offline fallback</span>
              </div>
              <div className="flex h-72 items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_center,_rgba(79,134,77,0.38),_rgba(21,61,46,0.18)_35%,_rgba(15,23,42,0.9)_100%)]">
                <div className="rounded-2xl border border-white/20 bg-slate-950/40 px-5 py-4 text-center text-white backdrop-blur-sm">
                  <Map className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Map unavailable offline</p>
                  <p className="mt-2 text-sm text-slate-200">Showing the locally cached observation list while base map tiles are unavailable.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Local observations</p>
              <div className="mt-4 space-y-3">
                {observations.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">{entry.label}</p>
                      <span className="text-xs uppercase tracking-[0.16em] text-emerald-700">{entry.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{entry.type} · {entry.confidence}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'Eco Community':
        return (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500">Community stats</p>
              <p className="mt-2 text-3xl font-bold text-forest dark:text-emerald-200">128</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Local observations this week</p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500">Sync queue</p>
              <p className="mt-2 text-3xl font-bold text-forest dark:text-emerald-200">3</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Pending community uploads</p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500">Impact dashboard</p>
              <p className="mt-2 text-3xl font-bold text-forest dark:text-emerald-200">12</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Verified habitat observations</p>
            </div>
          </div>
        )
      case 'Nature Journal':
        return (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">New journal entry</h3>
              <input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} placeholder="Entry title" className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              <input value={journalLocation} onChange={(event) => setJournalLocation(event.target.value)} placeholder="Location" className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              <textarea value={journalNotes} onChange={(event) => setJournalNotes(event.target.value)} placeholder="Describe what you observed." rows={5} className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              <button type="button" onClick={saveJournalEntry} className="mt-4 rounded-full bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">Save entry</button>
            </div>
            <div className="space-y-3">
              {journal.map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{entry.title}</h4>
                    <span className="text-xs uppercase tracking-[0.2em] text-emerald-700">{entry.category}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.notes}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{entry.location}</span>
                    <span>{entry.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'Nature AI Lab':
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Model status</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p><strong>Provider:</strong> Local Ollama-compatible adapter</p>
                <p><strong>Configured model:</strong> llama3.1:8b</p>
                <p><strong>Capability:</strong> Quest generation and explanation fallback</p>
                <p><strong>Inference health:</strong> {aiStatus === 'ready' ? 'Healthy' : 'Fallback mode'}</p>
              </div>
              <button type="button" onClick={handleGenerateQuest} className="mt-5 rounded-full bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">Run quest generation</button>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Local comparison</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>llama3.1:8b · good general-purpose local questing</li>
                <li>mistral-nemo:12b · more verbose and slower</li>
                <li>qwen2.5vl:7b · compatible for vision when supported</li>
              </ul>
            </div>
          </div>
        )
      case 'Settings':
        return (
          <div className="space-y-5">
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Preferences</h3>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Dark mode</p>
                  <p className="text-sm text-slate-500">Use a calmer night palette.</p>
                </div>
                <button type="button" onClick={() => setDarkMode((current) => !current)} className="rounded-full bg-forest px-3 py-2 text-xs font-medium text-white">{darkMode ? 'On' : 'Off'}</button>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Offline mode</p>
                  <p className="text-sm text-slate-500">Keep mission history and journal synced locally.</p>
                </div>
                <button type="button" onClick={() => setOfflineStatus((current) => current === 'online' ? 'offline' : 'online')} className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-medium text-white">{offlineStatus === 'online' ? 'Live' : 'Offline'}</button>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 p-8 text-white shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-100">Less scrolling. More exploring.</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">NatureQuest AI</h1>
              <p className="mt-4 max-w-xl text-emerald-50">Build a mindful outdoor routine, complete nature missions, capture useful observations, and keep your progress local-first.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => setActiveTab('Nature Missions')} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-forest hover:bg-emerald-50">Start adventure</button>
                <button type="button" onClick={() => setActiveTab('Identify Nature')} className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Identify nature</button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500">Offline readiness</p>
                <div className="mt-3 flex items-center gap-3">
                  {offlineStatus === 'online' ? <Wifi className="h-5 w-5 text-emerald-600" /> : <WifiOff className="h-5 w-5 text-amber-600" />}
                  <span className="font-medium text-slate-900 dark:text-white">{offlineStatus === 'online' ? 'Connected and ready' : 'Offline mode active'}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500">Eco XP</p>
                <p className="mt-2 text-3xl font-bold text-forest dark:text-emerald-200">{xp}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Level {level}</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-sand text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row">
            <aside className="w-full rounded-[28px] border border-emerald-200 bg-white/75 p-3 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 lg:max-w-[260px]">
              <div className="mb-5 flex items-center gap-3 px-3 py-2">
                <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                  <Trees className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">NatureQuest</p>
                  <p className="font-semibold text-slate-900 dark:text-white">Explorer</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map(({ label, icon: Icon }) => (
                  <button type="button" key={label} onClick={() => setActiveTab(label)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${activeTab === label ? 'bg-emerald-700 text-white shadow-soft' : 'text-slate-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            <main className="flex-1 space-y-5">
              <header className="rounded-[28px] border border-emerald-200 bg-white/80 p-4 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Good morning, explorer</p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready for your next nature mission?</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                      {backendStatus === 'ready' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />}
                      {backendStatus === 'ready' ? 'Backend ready' : 'Fallback mode'}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Activity className="h-3.5 w-3.5" /> {aiStatus === 'ready' ? 'Local AI healthy' : 'Offline library active'}
                    </div>
                  </div>
                </div>
              </header>

              <section className="grid gap-5 md:grid-cols-4">
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500">XP balance</p>
                  <p className="mt-3 text-3xl font-bold text-forest dark:text-emerald-200">{xp}</p>
                </div>
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500">Current level</p>
                  <p className="mt-3 text-3xl font-bold text-forest dark:text-emerald-200">{level}</p>
                </div>
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500">Badges</p>
                  <p className="mt-3 text-3xl font-bold text-forest dark:text-emerald-200">{badgeCount}</p>
                </div>
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500">Status message</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{statusMessage}</p>
                </div>
              </section>

              {renderPanel()}

              <section className="rounded-[28px] border border-emerald-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Next challenge</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{selectedMission.title}</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab('Nature Missions')} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">Open mission <ArrowRight className="h-4 w-4" /></button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
