import { useEffect, useState } from 'react'
import { GENRES, FAVOURITES, LANGUAGES, POPCORN, TALK, DRINKS, PEOPLE } from './data.js'
import { useI18n } from './i18n.jsx'
import { Avatar, Button, Card, Chip, Headline, Icon, LangSwitch, Logo, Title, Toggle, VerifiedBadge } from './ui.jsx'

export const QUESTIONS = [
  { key: 'film', options: FAVOURITES.map((f) => f.id), label: (t, v) => t.fav(v, FAVOURITES), chips: true },
  { key: 'genre', options: GENRES, label: (t, v) => t.genre(v), chips: true },
  { key: 'popcorn', options: POPCORN, label: (t, v) => t('popcorn.' + v) },
  { key: 'talk', options: TALK, label: (t, v) => t('talk.' + v) },
  { key: 'drink', options: DRINKS, label: (t, v) => t('drink.' + v) },
]

export function Splash({ c }) {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="mb-2 self-end"><LangSwitch /></div>
      <div className="relative mb-6 flex h-36 w-36 items-center justify-center">
        <span className="pulse-ring absolute h-28 w-28 rounded-full border-2 border-maroon" />
        <span className="pulse-ring absolute h-28 w-28 rounded-full border-2 border-maroon" style={{ animationDelay: '1s' }} />
        <img src="/logo.svg" alt="Plus One Cinema logo" className="h-24 w-24 rounded-3xl shadow-xl" />
      </div>
      <Logo size="lg" />
      <h1 className="mt-6 text-4xl text-night"><Headline>{t('splash.head')}</Headline></h1>
      <p className="mt-4 text-lg font-semibold text-maroon">{t('splash.tag')}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {['social', 'curious', 'safe', 'cinephile', 'spontaneous'].map((k) => (
          <span key={k} className="rounded-full border-2 border-line bg-white px-3 py-1 text-xs font-semibold text-night">{t('attr.' + k)}</span>
        ))}
      </div>
      <div className="mt-8 w-full">
        <Button onClick={() => c.go('intro')}>{t('splash.start')}</Button>
        <p className="mt-4 text-sm font-semibold text-blue">{t('splash.hash')}</p>
        <p className="mt-1 text-sm text-muted">{t('splash.madrid')}</p>
      </div>
    </div>
  )
}

const SLIDE_ICONS = ['users', 'ticket', 'heart']

export function Intro({ c }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  return (
    <div className="flex min-h-[74vh] flex-col">
      <div key={i} className="screen-enter flex flex-1 flex-col justify-center">
        {i !== 1 && (
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow text-night"><Icon name={SLIDE_ICONS[i]} size={46} /></div>
        )}
        <h1 className="text-4xl text-night"><Headline>{t(`intro.${i + 1}.t`)}</Headline></h1>
        {i === 1 ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-4 rounded-3xl border border-line bg-white p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon font-display text-xl text-white">{n}</span>
                <div><div className="font-bold text-night">{t('step.' + n)}</div><div className="text-sm text-muted">{t(`step.${n}s`)}</div></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-xl font-semibold leading-snug text-night">{t(`intro.${i + 1}.${i === 0 ? 's' : 's'}`)}</p>
        )}
        {i === 2 && <p className="mt-4 text-lg font-bold text-blue">{t('splash.hash')}</p>}
      </div>
      <div className="mb-5 mt-6 flex justify-center gap-2">
        {SLIDE_ICONS.map((_, k) => (
          <span key={k} className={`h-2 rounded-full transition-all ${k === i ? 'w-8 bg-maroon' : 'w-2 bg-line'}`} />
        ))}
      </div>
      <Button onClick={() => (i < 2 ? setI(i + 1) : c.go('signup'))}>{i < 2 ? t('intro.next') : t('intro.build')}</Button>
      {i < 2 && <button onClick={() => c.go('signup')} className="mt-3 w-full py-2 text-sm font-semibold text-muted">{t('intro.skip')}</button>}
    </div>
  )
}

export function SignUp({ c }) {
  const { t } = useI18n()
  const p = c.profile
  return (
    <div>
      <Title sub={t('su.sub')}>{t('su.title')}</Title>
      <NameAge profile={p} setProfile={c.setProfile} />
      <div className="mt-8"><Button onClick={() => c.go('verify')}>{t('taste.continue')}</Button></div>
    </div>
  )
}

function NameAge({ profile, setProfile }) {
  const { t } = useI18n()
  const set = (patch) => setProfile((p) => ({ ...p, ...patch }))
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 font-bold text-night">{t('form.name')}</h2>
        <input value={profile.name} onChange={(e) => set({ name: e.target.value.slice(0, 20) })} placeholder={t('form.namePh')}
          className="min-h-[52px] w-full rounded-2xl border-2 border-line bg-white px-4 text-base text-night placeholder:text-muted focus:border-maroon focus:outline-none" />
      </section>
      <section>
        <h2 className="mb-3 font-bold text-night">{t('form.gender')}</h2>
        <div className="flex flex-wrap gap-2">
          {['woman', 'man', 'nonbinary', 'private'].map((g) => <Chip key={g} active={profile.gender === g} onClick={() => set({ gender: g })}>{t('gender.' + g)}</Chip>)}
        </div>
      </section>
      <section>
        <h2 className="mb-3 font-bold text-night">{t('form.age')}</h2>
        <div className="flex items-center gap-4">
          <button aria-label="-" onClick={() => set({ age: Math.max(18, profile.age - 1) })} className="h-12 w-12 rounded-full border-2 border-line bg-white text-2xl text-night">-</button>
          <span className="w-16 text-center font-display text-5xl text-maroon">{profile.age}</span>
          <button aria-label="+" onClick={() => set({ age: Math.min(99, profile.age + 1) })} className="h-12 w-12 rounded-full border-2 border-line bg-white text-2xl text-night">+</button>
          <span className="text-sm text-muted">{t('form.age18')}</span>
        </div>
      </section>
    </div>
  )
}

export function QuestionField({ q, profile, setProfile, showTitle = true }) {
  const { t } = useI18n()
  const val = profile.answers[q.key]
  const pick = (v) => setProfile((p) => ({ ...p, answers: { ...p.answers, [q.key]: v } }))
  return (
    <section>
      {showTitle && <h2 className="mb-3 font-bold text-night">{t('q.' + q.key)}</h2>}
      {q.chips ? (
        <div className="flex flex-wrap gap-2">{q.options.map((o) => <Chip key={o} active={val === o} onClick={() => pick(o)}>{q.label(t, o)}</Chip>)}</div>
      ) : (
        <div className="space-y-2">
          {q.options.map((o) => (
            <button key={o} onClick={() => pick(o)} className={`flex min-h-[56px] w-full items-center justify-between rounded-2xl border-2 px-5 text-left text-base font-semibold transition active:scale-[0.99] ${val === o ? 'border-maroon bg-yellow text-night' : 'border-line bg-white text-night'}`}>
              {q.label(t, o)}
              {val === o && <Icon name="check" size={20} />}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export function Questions({ c }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const q = QUESTIONS[i]
  return (
    <div>
      <div className="mb-6 flex gap-2">{QUESTIONS.map((_, n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= i ? 'bg-maroon' : 'bg-line'}`} />)}</div>
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">{t('q.progress', { n: i + 1 })}</p>
      <h1 className="mb-6 text-[2rem] text-night"><Headline>{t('q.' + q.key)}</Headline></h1>
      <div key={i} className="screen-enter"><QuestionField q={q} profile={c.profile} setProfile={c.setProfile} showTitle={false} /></div>
      <div className="sticky bottom-0 -mx-5 mt-6 flex gap-3 bg-gradient-to-t from-paper via-paper to-transparent px-5 pb-4 pt-6">
        {i > 0 && <Button variant="ghost" className="!w-auto" onClick={() => setI(i - 1)}>{t('back')}</Button>}
        <Button onClick={() => (i < QUESTIONS.length - 1 ? setI(i + 1) : c.go('prefs'))}>{i < QUESTIONS.length - 1 ? t('q.next') : t('q.done')}</Button>
      </div>
    </div>
  )
}

function DualRange({ min, max, lo, hi, onChange }) {
  const pct = (v) => ((v - min) / (max - min)) * 100
  return (
    <div>
      <div className="dual-range">
        <div className="absolute left-0 right-0 top-[16px] h-1.5 rounded-full bg-line" />
        <div className="absolute top-[16px] h-1.5 rounded-full bg-maroon" style={{ left: pct(lo) + '%', right: 100 - pct(hi) + '%' }} />
        <input type="range" min={min} max={max} value={lo} aria-label="Minimum age" onChange={(e) => onChange(Math.min(Number(e.target.value), hi - 1), hi)} />
        <input type="range" min={min} max={max} value={hi} aria-label="Maximum age" onChange={(e) => onChange(lo, Math.max(Number(e.target.value), lo + 1))} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted"><span>{min}</span><span>{max}+</span></div>
    </div>
  )
}

export function PrefsForm({ profile, setProfile }) {
  const { t } = useI18n()
  const set = (patch) => setProfile((p) => ({ ...p, ...patch }))
  const toggleLang = (l) => setProfile((p) => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter((x) => x !== l) : [...p.languages, l] }))
  return (
    <div className="space-y-7">
      <section>
        <h2 className="mb-1 font-bold text-night">{t('form.range')}</h2>
        <p className="mb-2 text-sm text-muted">{t('form.rangeText', { a: profile.ageMin, b: profile.ageMax })}</p>
        <DualRange min={18} max={65} lo={profile.ageMin} hi={profile.ageMax} onChange={(a, b) => set({ ageMin: a, ageMax: b })} />
      </section>
      <section>
        <h2 className="mb-3 font-bold text-night">{t('pf.mode')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[['one', 'pf.one', 'pf.oneS'], ['group', 'pf.group', 'pf.groupS']].map(([k, a, b]) => (
            <button key={k} onClick={() => set({ mode: k })} className={`rounded-2xl border-2 p-4 text-left transition ${profile.mode === k ? 'border-maroon bg-yellow' : 'border-line bg-white'}`}>
              <span className="block font-bold text-night">{t(a)}</span>
              <span className="text-sm text-night/70">{t(b)}</span>
            </button>
          ))}
        </div>
      </section>
      {profile.gender !== 'woman' && (
        <section>
          <h2 className="mb-1 font-bold text-night">{t('form.show')}</h2>
          <p className="mb-3 text-sm text-muted">{t('form.showSub')}</p>
          <div className="grid grid-cols-3 gap-2">
            {['women', 'men', 'everyone'].map((k) => (
              <button key={k} onClick={() => set({ interestedIn: k })} className={`min-h-[52px] rounded-2xl border-2 font-bold transition ${profile.interestedIn === k ? 'border-maroon bg-yellow text-night' : 'border-line bg-white text-night'}`}>{t('form.' + k)}</button>
            ))}
          </div>
        </section>
      )}
      <Card className="space-y-5">
        {profile.gender === 'woman' && (
          <>
            <Toggle on={profile.womenOnly} onChange={(v) => set({ womenOnly: v })} label={t('pf.women')} sub={t('pf.womenS')} />
            <div className="border-t border-line" />
          </>
        )}
        <Toggle on={profile.voseOnly} onChange={(v) => set({ voseOnly: v })} label={t('pf.vose')} sub={t('pf.voseS')} />
      </Card>
      <section>
        <h2 className="mb-1 font-bold text-night">{t('form.langs')}</h2>
        <p className="mb-3 text-sm text-muted">{t('form.langsHint')}</p>
        <div className="flex flex-wrap gap-2">{LANGUAGES.map((l) => <Chip key={l} active={profile.languages.includes(l)} onClick={() => toggleLang(l)}>{t.lang(l)}</Chip>)}</div>
      </section>
    </div>
  )
}

export function Prefs({ c }) {
  const { t } = useI18n()
  return (
    <div>
      <Title sub={t('pf.sub')}>{t('pf.title')}</Title>
      <PrefsForm profile={c.profile} setProfile={c.setProfile} />
      <div className="mt-8"><Button onClick={() => c.go('films', true)}>{t('ver.pick')}</Button></div>
    </div>
  )
}

function PopcornCode({ c }) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  return (
    <Card>
      <div className="mb-1 flex items-center gap-3 font-bold text-night"><span className="text-maroon"><Icon name="gift" /></span>{t('pc.title')}</div>
      <p className="mb-3 text-sm text-muted">{t('pc.sub')}</p>
      {c.popcorn ? (
        <div className="pop space-y-2 rounded-2xl bg-emerald-100 p-4 text-emerald-800">
          <div className="font-bold">{t('pc.done')}</div>
          <div className="flex items-center gap-2 text-sm"><Icon name="check" size={16} />{t('pc.perk1')}</div>
          <div className="flex items-center gap-2 text-sm"><Icon name="check" size={16} />{t('pc.perk2')}</div>
        </div>
      ) : (
        <>
          <input value={code} onChange={(e) => setCode(e.target.value.slice(0, 20))} placeholder={t('pc.ph')} className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white px-4 text-night placeholder:text-muted focus:border-maroon focus:outline-none" />
          <div className="mt-3"><Button variant="yellow" disabled={!code.trim()} onClick={() => c.setPopcorn(true)}>{t('pc.btn')}</Button></div>
        </>
      )}
    </Card>
  )
}

export function Profile({ c }) {
  const { t } = useI18n()
  const p = c.profile
  const buddies = c.buddies.map((id) => PEOPLE.find((x) => x.id === id)).filter(Boolean)
  return (
    <div>
      <Title sub={t('profile.sub')}>{t('profile.title')}</Title>
      <Card className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-bold text-night">{p.name || t('profile.you')}, {p.age}</div>
          <div className="text-sm text-muted">{p.verified ? t('profile.checked') : t('profile.not')}</div>
        </div>
        {p.verified ? <VerifiedBadge /> : <button onClick={() => c.go('verify')} className="rounded-full bg-maroon px-4 py-2 text-sm font-bold text-white">{t('profile.verify')}</button>}
      </Card>

      <div className="space-y-7">
        <NameAge profile={p} setProfile={c.setProfile} />
        <div className="space-y-6">
          <h2 className="font-display text-2xl uppercase tracking-wide text-night">{t('q.title').replace(/[[\]]/g, '')}</h2>
          {QUESTIONS.map((q) => <QuestionField key={q.key} q={q} profile={p} setProfile={c.setProfile} />)}
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wide text-night">{t('pf.title').replace(/[[\]]/g, '')}</h2>
          <PrefsForm profile={p} setProfile={c.setProfile} />
        </div>

        <section>
          <h2 className="mb-3 font-display text-2xl uppercase tracking-wide text-night">{t('profile.buddies')}</h2>
          {buddies.length === 0 ? (
            <Card className="text-sm text-muted">{t('profile.noBuddies')}</Card>
          ) : (
            <div className="space-y-3">
              {buddies.map((b) => (
                <Card key={b.id} className="flex items-center gap-3 !p-4">
                  <Avatar name={b.name} color={b.color} size={44} />
                  <div className="flex-1 font-bold text-night">{b.name}, {b.age}</div>
                  <button onClick={() => { c.setBuddyId(b.id); c.go('films') }} className="rounded-full bg-maroon px-4 py-2 text-sm font-bold text-white">{t('profile.again')}</button>
                </Card>
              ))}
            </div>
          )}
        </section>

        <PopcornCode c={c} />
      </div>
      <div className="mt-8"><Button onClick={() => c.back()}>{t('profile.save')}</Button></div>
    </div>
  )
}

const DOCS = ['id', 'passport', 'licence']

export function Verify({ c }) {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [doc, setDoc] = useState('id')
  const [busy, setBusy] = useState(false)
  const [idDone, setIdDone] = useState(false)
  const [selfieDone, setSelfieDone] = useState(false)
  const [checks, setChecks] = useState(0)

  const simulate = (setter) => {
    setBusy(true)
    setTimeout(() => { setBusy(false); setter(true) }, 1600)
  }

  useEffect(() => {
    if (step !== 3) return
    setChecks(0)
    const timers = [1, 2, 3].map((n) => setTimeout(() => setChecks(n), n * 1000))
    const done = setTimeout(() => { c.setProfile((p) => ({ ...p, verified: true })); setStep(4) }, 3600)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const dots = (
    <div className="mb-6 flex gap-2">
      {[1, 2, 3].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= Math.min(step, 3) ? 'bg-maroon' : 'bg-line'}`} />)}
    </div>
  )
  const scan = busy && <span className="scan-line absolute left-4 right-4 h-0.5 bg-maroon shadow-[0_0_12px_#6E1A31]" />

  if (step === 1) return (
    <div>
      {dots}
      <Title sub={t('ver.sub')}>{t('ver.title')}</Title>
      <h2 className="mb-3 font-bold text-night">{t('ver.step1')}</h2>
      <div className="mb-5 flex flex-wrap gap-2">{DOCS.map((d) => <Chip key={d} active={doc === d} onClick={() => setDoc(d)}>{t('doc.' + d)}</Chip>)}</div>
      <div className="relative mx-auto mb-6 flex h-52 w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-maroon/50 bg-white">
        {['left-3 top-3 border-l-4 border-t-4', 'right-3 top-3 border-r-4 border-t-4', 'left-3 bottom-3 border-b-4 border-l-4', 'right-3 bottom-3 border-b-4 border-r-4'].map((k) => (
          <span key={k} className={`absolute h-7 w-7 rounded-sm border-maroon ${k}`} />
        ))}
        {scan}
        {idDone ? (
          <div className="pop flex flex-col items-center text-emerald-700"><Icon name="check" size={48} /><span className="mt-2 font-bold">{t('ver.captured', { doc: t('doc.' + doc) })}</span></div>
        ) : (
          <div className="flex flex-col items-center text-muted"><Icon name="idcard" size={48} /><span className="mt-2 text-sm">{busy ? t('ver.scanning') : t('ver.place')}</span></div>
        )}
      </div>
      {idDone ? <Button onClick={() => setStep(2)}>{t('ver.next')}</Button> : <Button disabled={busy} icon="camera" onClick={() => simulate(setIdDone)}>{busy ? t('ver.scanning') : t('ver.capture')}</Button>}
    </div>
  )

  if (step === 2) return (
    <div>
      {dots}
      <Title sub={t('ver.step2sub')}>{t('ver.step2')}</Title>
      <div className="relative mx-auto mb-6 flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-4 border-maroon/60 bg-white">
        {scan}
        {selfieDone ? (
          <div className="pop flex flex-col items-center text-emerald-700"><Icon name="check" size={56} /><span className="mt-2 font-bold">{t('ver.selfieDone')}</span></div>
        ) : (
          <div className="flex flex-col items-center text-muted"><Icon name="user" size={84} /><span className="mt-1 text-sm">{busy ? t('ver.hold') : t('ver.centre')}</span></div>
        )}
      </div>
      {selfieDone ? <Button onClick={() => setStep(3)}>{t('ver.check')}</Button> : <Button disabled={busy} icon="camera" onClick={() => simulate(setSelfieDone)}>{busy ? t('ver.hold') : t('ver.take')}</Button>}
    </div>
  )

  if (step === 3) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="spin mb-8 h-16 w-16 rounded-full border-4 border-line border-t-maroon" />
      <Title>{t('ver.checking')}</Title>
      <div className="w-full space-y-3 text-left">
        {['ver.c1', 'ver.c2', 'ver.c3'].map((k, n) => (
          <div key={k} className={`flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 transition ${checks > n ? 'text-night' : 'text-muted'}`}>
            <span className={checks > n ? 'text-emerald-700' : 'text-line'}><Icon name="check" size={20} /></span>{t(k)}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="pop mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="shield" size={64} /></div>
      <VerifiedBadge />
      <h1 className="mt-4 text-4xl text-night"><Headline>{t('ver.done')}</Headline></h1>
      <p className="mt-3 max-w-sm text-muted">{t('ver.doneText')}</p>
      <div className="mt-8 w-full"><Button onClick={() => c.go('questions', true)}>{t('step.1')}</Button></div>
    </div>
  )
}
