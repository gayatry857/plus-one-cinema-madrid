import { useEffect, useMemo, useState } from 'react'
import { PEOPLE, itemFor, rankMatches } from './data.js'
import { LangContext, makeT } from './i18n.jsx'
import { Icon, LangSwitch, LangToggle, Logo } from './ui.jsx'
import { Splash, Intro, SignUp, Verify, Questions, Prefs, Profile } from './onboarding.jsx'
import { Films, Showtimes, Matching, Match, Seats, Pay, Confirm, Checkin, Mood, Bar, BarDetail, Afterglow, After, currentSeats, useBars } from './flow.jsx'
import { Safety, Premium, Partners, Money } from './info.jsx'

// Pre-filled demo user: Camille, 23, an architecture student who recently moved to Madrid.
const DEFAULT_PROFILE = {
  name: 'Camille', age: 23, gender: 'woman', ageMin: 22, ageMax: 30,
  answers: { film: 'Amélie', genre: 'Drama', popcorn: 'salty', talk: 'silent', drink: 'vermut' },
  languages: [], mode: 'one', womenOnly: false, interestedIn: 'everyone', voseOnly: false, verified: false,
}

const SCREENS = {
  splash: Splash, intro: Intro, signup: SignUp, verify: Verify, questions: Questions, prefs: Prefs, profile: Profile,
  films: Films, showtimes: Showtimes, matching: Matching, match: Match, seats: Seats, pay: Pay, confirm: Confirm,
  checkin: Checkin, mood: Mood, bar: Bar, barDetail: BarDetail, afterglow: Afterglow, after: After,
  safety: Safety, premium: Premium, partners: Partners, money: Money,
}
const NEEDS_SEL = ['matching', 'match', 'seats', 'pay', 'confirm', 'checkin', 'mood', 'bar', 'barDetail', 'afterglow', 'after']
const NEEDS_LEAD = ['seats', 'pay', 'confirm', 'checkin', 'mood', 'bar', 'barDetail', 'afterglow', 'after']
const NEEDS_MOOD = ['bar', 'barDetail', 'afterglow', 'after']

function initialLang() {
  try {
    const saved = localStorage.getItem('plusone.lang')
    if (saved === 'es' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en'
}

export default function App() {
  const [lang, setLangState] = useState(initialLang)
  const setLang = (l) => {
    setLangState(l)
    try { localStorage.setItem('plusone.lang', l) } catch { /* ignore */ }
  }
  const t = useMemo(() => makeT(lang), [lang])
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const [stack, setStack] = useState(['splash'])
  const screen = stack[stack.length - 1]
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [sel, setSel] = useState(null)
  const [pickFilm, setPickFilm] = useState(null)
  const [leadId, setLeadId] = useState(null)
  const [buddyId, setBuddyId] = useState(null)
  const [buddies, setBuddies] = useState([])
  const [deckIdx, setDeckIdx] = useState(0)
  const [seatOpt, setSeatOpt] = useState(0)
  const [mood, setMood] = useState(null)
  const [barId, setBarId] = useState(null)
  const [agStatus, setAgStatus] = useState(null)
  const [payMethod, setPayMethod] = useState(null)
  const [popcorn, setPopcorn] = useState(false)
  const [menu, setMenu] = useState(false)

  const go = (s, replace = false) => {
    setMenu(false)
    setStack((st) => (replace ? [...st.slice(0, -1), s] : [...st, s]))
  }
  const back = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st))
  const restart = () => {
    setMenu(false)
    setStack(['splash']); setProfile(DEFAULT_PROFILE); setSel(null); setPickFilm(null)
    setLeadId(null); setBuddyId(null); setBuddies([]); setDeckIdx(0); setSeatOpt(0); setMood(null)
    setBarId(null); setAgStatus(null); setPayMethod(null); setPopcorn(false)
  }
  const toggleBuddy = (id) => setBuddies((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]))

  const matches = useMemo(() => rankMatches(profile), [profile])
  // The one best match shown now: a film buddy you chose to book again, otherwise the next best by taste and age.
  const buddyPerson = buddyId ? PEOPLE.find((p) => p.id === buddyId) : null
  const shown = buddyPerson ? itemFor(profile, buddyPerson) : matches.length ? matches[deckIdx % matches.length] : null
  const groupOf = (item) => {
    if (!item || profile.mode !== 'group') return []
    const pool = matches.filter((m) => m.person.id !== item.person.id)
    return pool.slice(0, pool.length > 1 ? 2 : pool.length)
  }
  const others = groupOf(shown)
  const leadPerson = leadId ? PEOPLE.find((p) => p.id === leadId) : null
  const lead = leadPerson ? itemFor(profile, leadPerson) : null
  const party = 2 + (lead ? others.length : 0)
  const seats = sel ? currentSeats(sel.film.id, party, seatOpt) : null
  const bars = useBars(sel, mood, lead)

  const c = {
    profile, setProfile, sel, setSel, pickFilm, setPickFilm, leadId, setLeadId, buddyId, setBuddyId, buddies, toggleBuddy,
    deckIdx, setDeckIdx, seatOpt, setSeatOpt, mood, setMood, barId, setBarId, agStatus, setAgStatus, payMethod, setPayMethod,
    popcorn, setPopcorn, matches, shown, others, lead, party, seats, bars, go, back, restart,
  }

  useEffect(() => { window.scrollTo({ top: 0 }) }, [screen])

  let key = screen
  if (key === 'showtimes' && !pickFilm) key = 'films'
  if (NEEDS_SEL.includes(key) && !sel) key = 'films'
  if (NEEDS_LEAD.includes(key) && !lead) key = 'match'
  if (NEEDS_MOOD.includes(key) && !mood) key = 'mood'
  const Screen = SCREENS[key]

  const menuItems = [
    ['user', 'menu.profile', 'profile'],
    ['shield', 'menu.safety', 'safety'],
    ['star', 'menu.premium', 'premium'],
    ['store', 'menu.partners', 'partners'],
    ['film', 'menu.money', 'money'],
  ]

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="flex min-h-full justify-center">
        <div className="relative min-h-screen w-full max-w-md bg-paper shadow-[0_0_60px_rgba(110,26,49,0.12)] md:border-x md:border-line">
          {screen !== 'splash' && (
            <header className="sticky top-0 z-30 flex items-center gap-1.5 border-b border-line bg-paper/95 px-4 py-2.5 backdrop-blur">
              {stack.length > 1 && (
                <button onClick={back} aria-label={t('back')} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-line bg-white text-night"><Icon name="back" size={20} /></button>
              )}
              <div className="min-w-0 flex-1"><Logo /></div>
              <button onClick={() => go('safety')} aria-label={t('menu.safety')} className="flex h-9 items-center gap-1 rounded-full bg-sky px-2.5 text-xs font-bold text-blue">
                <Icon name="shield" size={18} /> {t('safety')}
              </button>
              <LangToggle />
              <button onClick={() => setMenu(true)} aria-label={t('menu')} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-line bg-white text-night"><Icon name="menu" size={20} /></button>
            </header>
          )}

          <main key={key} className="screen-enter px-5 pb-6 pt-6">
            <Screen c={c} />
          </main>

          <footer className="flex items-center justify-between px-5 pb-8 text-xs text-muted">
            <span className="rounded-full border-2 border-line px-3 py-1">{t('demo')}</span>
            <button onClick={restart} className="flex items-center gap-1.5 rounded-full px-3 py-2 font-bold text-maroon"><Icon name="refresh" size={15} /> {t('restart')}</button>
          </footer>

          {menu && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setMenu(false)}>
              <aside className="drawer h-full w-[82%] max-w-xs bg-paper p-5" onClick={(e) => e.stopPropagation()}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-display text-2xl uppercase tracking-wide text-night">{t('menu')}</span>
                  <button onClick={() => setMenu(false)} aria-label={t('close')} className="flex h-10 w-10 items-center justify-center rounded-full bg-panel2 text-night"><Icon name="x" /></button>
                </div>
                <div className="space-y-2">
                  {menuItems.map(([ic, k, s]) => (
                    <button key={s} onClick={() => go(s)} className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-left font-semibold text-night"><span className="text-maroon"><Icon name={ic} /></span> {t(k)}</button>
                  ))}
                  <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 font-semibold text-night"><span>{t('menu.language')}</span><LangSwitch /></div>
                  <button onClick={restart} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-maroon py-4 font-bold text-white"><Icon name="refresh" size={18} /> {t('restart')}</button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </LangContext.Provider>
  )
}
