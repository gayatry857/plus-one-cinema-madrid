import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { FILMS, DAYS, CINEMAS, MOODS, TICKET_PRICE, BOOKING_FEE, rankBars, addMinutes } from './data.js'
import { useI18n } from './i18n.jsx'
import { Avatar, Button, Card, Chip, Headline, Icon, Poster, Title, Toggle, VerifiedBadge } from './ui.jsx'
import { QUESTIONS } from './onboarding.jsx'

function useMoney() {
  const { lang } = useI18n()
  return (n) => (lang === 'es' ? n.toFixed(2).replace('.', ',') + ' €' : '€' + n.toFixed(2))
}

/* ---------- seat helpers ---------- */
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F']
const COLS = 10

function isTaken(row, col, seed) {
  const n = (row * 7 + col * 13 + seed * 5) % 11
  return n === 0 || n === 3 || (row === 5 && col % 3 === 1)
}

function seatBlocks(filmId, party) {
  const seed = Number(filmId.replace('f', '')) || 1
  const out = []
  for (let r = 0; r < ROWS.length; r++) {
    for (const [from, to] of [[0, 4], [5, 9]]) {
      for (let s = from; s + party - 1 <= to; s++) {
        let free = true
        for (let k = 0; k < party; k++) if (isTaken(r, s + k, seed)) free = false
        if (free) out.push({ row: r, start: s, party, dist: Math.abs(r - 2.5) + Math.abs(s + (party - 1) / 2 - 4.5) / 2 })
      }
    }
  }
  return out.sort((a, b) => a.dist - b.dist)
}

export function currentSeats(filmId, party, opt) {
  const blocks = seatBlocks(filmId, party)
  if (!blocks.length) return null
  return blocks[opt % blocks.length]
}

export function seatLabel(b) {
  if (!b) return ''
  return Array.from({ length: b.party }, (_, k) => ROWS[b.row] + (b.start + k + 1)).join(', ')
}

function versionLabel(t, sel) {
  return sel.version === 'VOSE' ? t('ver.vose', { lang: t.lang(sel.audio) }) : t.lang(sel.audio)
}

/* ---------- share my plan ---------- */
function buildPlan(t, c) {
  const real = !!(c.sel && c.lead)
  const sel = c.sel || { film: FILMS[0], cinema: 'renoir', time: '20:05', date: '2026-11-09', audio: 'Spanish', version: 'Spanish' }
  const lead = c.lead || { person: { name: 'Lucía', age: 27 } }
  const seats = real && c.seats ? seatLabel(c.seats) : 'D4, D5'
  const cinema = CINEMAS[sel.cinema]
  const lines = [
    t('plan.head'),
    t('plan.film', { v: `${t.l(sel.film.title)} (${versionLabel(t, sel)})` }),
    t('plan.where', { v: `${cinema.name}, ${cinema.address}` }),
    t('plan.when', { v: t.when(sel) }),
    t('plan.seats', { v: seats }),
    t('plan.with', { names: [lead, ...(real ? c.others : [])].map((o) => `${o.person.name} (${o.person.age})`).join(', ') }),
  ]
  if (real && c.barId && c.agStatus === 'confirmed') {
    const picked = c.bars.find((b) => b.bar.id === c.barId)
    if (picked) lines.push(t('plan.bar', { bar: picked.bar.name, area: picked.bar.area, t: addMinutes(sel.time, sel.film.runtime + 25) }))
  }
  lines.push(t('plan.by', { name: c.profile.name || t('plan.me') }))
  return { real, text: lines.join('\n') }
}

const enc = encodeURIComponent
const SHARE_APPS = [
  { id: 'whatsapp', key: 'share.whatsapp', color: '#25D366', url: (x) => 'https://wa.me/?text=' + enc(x.text) },
  { id: 'telegram', key: 'share.telegram', color: '#2AABEE', url: (x) => 'https://t.me/share/url?url=' + enc(window.location.origin) + '&text=' + enc(x.text) },
  { id: 'sms', key: 'share.sms', color: '#34C759', url: (x) => 'sms:?&body=' + enc(x.text) },
  { id: 'email', key: 'share.email', color: '#6366F1', url: (x) => 'mailto:?subject=' + enc(x.subject) + '&body=' + enc(x.text) },
]

export function SharePlan({ c, compact }) {
  const { t } = useI18n()
  const [opened, setOpened] = useState(null)
  const { real, text } = buildPlan(t, c)
  const subject = t('plan.head')
  const canNative = typeof navigator !== 'undefined' && !!navigator.share
  const open = (app) => {
    const url = app.url({ text, subject })
    setOpened(t(app.key))
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener')
    else window.location.href = url
  }
  const more = async () => {
    try { await navigator.share({ title: subject, text }); setOpened(t('share.more')) } catch { /* cancelled */ }
  }
  return (
    <Card>
      <div className="mb-1 flex items-center gap-3 font-semibold text-night"><span className="text-maroon"><Icon name="share" /></span>{t('share.title')}</div>
      <p className="mb-3 text-sm text-muted">{real ? t('share.intro') : t('share.example')}</p>
      <div className="whitespace-pre-line rounded-2xl bg-panel2 p-4 text-sm text-night">{text}</div>
      {!compact && <p className="mt-2 text-xs text-muted">{t('share.note')}</p>}
      <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">{t('share.via')}</div>
      <div className="grid grid-cols-3 gap-2">
        {SHARE_APPS.map((a) => (
          <button key={a.id} onClick={() => open(a)} className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-line bg-panel2 text-sm font-semibold text-night transition active:scale-95">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-white" style={{ background: a.color }}>{t(a.key).slice(0, 1)}</span>
            {t(a.key)}
          </button>
        ))}
        {canNative && (
          <button onClick={more} className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-line bg-panel2 text-sm font-semibold text-night transition active:scale-95">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-line text-night"><Icon name="share" size={18} /></span>
            {t('share.more')}
          </button>
        )}
      </div>
      {opened && <div className="pop mt-3 rounded-2xl bg-emerald-100 p-3 text-center text-sm font-semibold text-emerald-700">{t('share.opened', { app: opened })}</div>}
    </Card>
  )
}

/* ---------- films ---------- */
const TODAY_LANGS = [...new Set(FILMS.flatMap((f) => f.showings.map((s) => s.audio)))]

export function Films({ c }) {
  const { t } = useI18n()
  const [vose, setVose] = useState(c.profile.voseOnly)
  const [langs, setLangs] = useState(c.profile.languages)
  const toggleLang = (l) => setLangs((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]))
  const list = FILMS.filter((f) => f.showings.some((s) => (langs.length === 0 || langs.includes(s.audio)) && (!vose || s.version === 'VOSE')))
  const open = (film) => { c.setPickFilm(film); c.go('showtimes') }
  return (
    <div>
      <Title sub={t('films.sub')}>{t('films.title')}</Title>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t('films.lang')}</div>
      <div className="mb-2 flex flex-wrap gap-2">
        <Chip active={langs.length === 0} onClick={() => setLangs([])}>{t('films.any')}</Chip>
        {TODAY_LANGS.map((l) => <Chip key={l} active={langs.includes(l)} onClick={() => toggleLang(l)}>{t.lang(l)}</Chip>)}
      </div>
      <p className="mb-3 text-xs text-muted">{t('films.langNote')}</p>
      <div className="mb-5"><Chip active={vose} onClick={() => setVose(!vose)}>{t('films.vose')}</Chip></div>
      {list.length === 0 && (
        <Card className="space-y-3 text-center">
          <p className="text-muted">{t('films.empty')}</p>
          <Button variant="ghost" onClick={() => { setLangs([]); setVose(false) }}>{t('films.emptyBtn')}</Button>
        </Card>
      )}
      <div className="space-y-5">
        {list.map((f) => {
          const tags = [...new Set(f.showings.map((s) => t.lang(s.audio) + (s.version === 'VOSE' ? ' (' + t('films.vo') + ')' : '')))]
          return (
            <div key={f.id} className="overflow-hidden rounded-3xl border border-line bg-panel">
              <button onClick={() => open(f)} className="block w-full text-left" aria-label={t.l(f.title)}><Poster film={f} className="h-32" /></button>
              <div className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span className="rounded-full bg-panel2 px-2.5 py-0.5 text-night">{t.genre(f.genre)}</span>
                  <span>{Math.floor(f.runtime / 60)}h {f.runtime % 60}m</span>
                  {tags.map((x) => <span key={x} className="rounded-full border border-line px-2.5 py-0.5 text-xs">{x}</span>)}
                </div>
                <p className="mb-3 text-sm text-muted">{t.l(f.blurb)}</p>
                <Button onClick={() => open(f)}>{t('films.choose')}</Button>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-center text-xs text-muted">{t('films.foot')}</p>
    </div>
  )
}

export function Showtimes({ c }) {
  const { t } = useI18n()
  const film = c.pickFilm
  const [dayIdx, setDayIdx] = useState(0)
  const date = DAYS[dayIdx]
  const choose = (s, time) => {
    c.setSel({ film, cinema: s.cinema, time, date, audio: s.audio, version: s.version })
    c.setLeadId(null); c.setDeckIdx(0); c.setSeatOpt(0); c.setMood(null); c.setBarId(null); c.setAgStatus(null)
    c.go('matching')
  }
  return (
    <div>
      <Poster film={film} className="mb-5 h-28 rounded-3xl" />
      <Title sub={t('st.pick')}>{t('st.title')}</Title>
      <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {DAYS.map((d, i) => (
          <button key={d} onClick={() => setDayIdx(i)} className={`flex min-h-[64px] min-w-[60px] shrink-0 flex-col items-center justify-center rounded-2xl border text-sm font-semibold transition ${i === dayIdx ? 'border-maroon bg-yellow text-night' : 'border-line bg-panel text-night'}`}>
            <span className="text-xs font-medium uppercase">{t.weekday(d)}</span>
            <span className="font-display text-xl">{t.dayNum(d)}</span>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {film.showings.map((s) => (
          <Card key={s.cinema + s.version}>
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-night"><Icon name="pin" size={16} className="text-maroon" />{CINEMAS[s.cinema].name}</div>
            <div className="mb-3 text-sm text-muted">{CINEMAS[s.cinema].address}. {t.lang(s.audio)}{s.version === 'VOSE' ? ', ' + t('films.vo') : ''}</div>
            <div className="flex flex-wrap gap-2">
              {s.times.map((tm) => <Chip key={tm} className="!min-h-[48px] !px-5 !text-base" onClick={() => choose(s, tm)}>{tm}</Chip>)}
            </div>
          </Card>
        ))}
      </div>
      <button
        onClick={() => { const s = film.showings[film.showings.length - 1]; choose(s, s.times[s.times.length - 1]) }}
        className="mt-4 w-full rounded-2xl border border-dashed border-maroon/50 py-3 text-sm font-semibold text-maroon transition hover:bg-yellow/25"
      >
        {t('films.pickTime')}
      </button>
      {dayIdx > 0 && <p className="mt-4 text-center text-xs text-muted">{t('st.sample')}</p>}
    </div>
  )
}

/* ---------- matching ---------- */
export function Matching({ c }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  useEffect(() => {
    const a = setInterval(() => setI((n) => Math.min(n + 1, 3)), 900)
    const b = setTimeout(() => c.go('match', true), 3800)
    return () => { clearInterval(a); clearTimeout(b) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex min-h-[72vh] flex-col items-center justify-center text-center">
      <div className="relative mb-10 flex h-44 w-44 items-center justify-center">
        {[0, 0.7, 1.4].map((d) => <span key={d} className="pulse-ring absolute h-32 w-32 rounded-full border-2 border-maroon" style={{ animationDelay: d + 's' }} />)}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow text-night"><Icon name="heart" size={44} /></div>
      </div>
      <h1 className="text-3xl text-night"><Headline>{t('mt.title')}</Headline></h1>
      <p key={i} className="screen-enter mt-4 text-muted">{t('mt.' + (i + 1))}</p>
      <p className="mt-6 text-sm text-muted">{t('mt.for', { film: t.l(c.sel.film.title), time: t.when(c.sel) })}</p>
    </div>
  )
}

function answerLabel(t, k, v) {
  const q = QUESTIONS.find((x) => x.key === k)
  return t('ans.' + k, { v: q.label(t, v) })
}

function useListNames() {
  const { lang } = useI18n()
  const fmt = new Intl.ListFormat(lang === 'es' ? 'es' : 'en', { style: 'long', type: 'conjunction' })
  return (arr) => fmt.format(arr)
}

export function Match({ c }) {
  const { t } = useI18n()
  const list = useListNames()
  const { shown, others, matches } = c
  if (!shown) {
    return (
      <div className="pt-8 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-panel2 text-muted"><Icon name="users" size={44} /></div>
        <Title sub={t('swipe.none')}>{t('mc.title')}</Title>
        <div className="space-y-3">
          <Button onClick={() => c.go('profile')}>{t('swipe.widen')}</Button>
          <Button variant="ghost" onClick={() => c.go('films')}>{t('swipe.otherFilm')}</Button>
        </div>
      </div>
    )
  }
  const p = shown.person
  const isBuddy = c.buddyId === p.id
  const group = others.length > 0
  const other = () => {
    if (!isBuddy) c.setDeckIdx(c.deckIdx + 1)
    c.setBuddyId(null)
  }
  return (
    <div>
      <Title sub={t('swipe.sub', { film: t.l(c.sel.film.title), time: t.when(c.sel) })}>{t('mc.title')}</Title>
      <div key={p.id} className="screen-enter overflow-hidden rounded-3xl border border-line bg-white">
        <div className="bg-maroon px-5 pb-12 pt-6 text-center">
          <div className="font-display text-6xl uppercase leading-none tracking-wide text-yellow">{t('mc.pct', { n: shown.score })}</div>
        </div>
        <div className="-mt-9 px-5 pb-5">
          <div className="flex justify-center"><div className="rounded-full border-4 border-white"><Avatar name={p.name} color={p.color} size={84} /></div></div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <h2 className="font-display text-3xl uppercase tracking-wide text-night">{p.name}, {p.age}</h2>
            <VerifiedBadge />
          </div>
          {isBuddy && <div className="mt-1 text-center text-sm font-bold text-blue">{t('mc.buddy')}</div>}
          <div className="mt-1 text-center text-sm text-muted">{t('swipe.watches', { l: p.langs.map((l) => t.lang(l)).join(', ') })}</div>
          <div className="mt-5 text-xs font-bold uppercase tracking-wide text-muted">{t('mc.shared')}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {shown.shared.length
              ? shown.shared.map((k) => <span key={k} className="rounded-full bg-yellow px-3 py-1 text-sm font-semibold text-night">{answerLabel(t, k, p[k])}</span>)
              : <span className="text-sm text-night">{t('mc.noShared')}</span>}
          </div>
          <div className="mt-4 rounded-2xl bg-panel2 p-4">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-maroon">{t('swipe.ice')}</div>
            <p className="text-night">"{t.l(p.ice)}"</p>
          </div>
          {group && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-line p-3">
              <div className="flex -space-x-3">{others.map((o) => <div key={o.person.id} className="rounded-full border-2 border-white"><Avatar name={o.person.name} color={o.person.color} size={40} /></div>)}</div>
              <span className="text-sm text-muted">{t('mc.group', { n: 1 + 1 + others.length, names: list(others.map((o) => `${o.person.name}, ${o.person.age}`)) })}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <Button onClick={() => { c.setLeadId(p.id); c.go('seats') }}>{t('mc.go')}</Button>
        <Button variant="ghost" icon="refresh" onClick={other}>{t('mc.other')}</Button>
      </div>
      <p className="mt-4 text-center text-xs text-muted">{t('mc.count', { n: matches.length })}</p>
    </div>
  )
}

/* ---------- seats and payment ---------- */
export function Seats({ c }) {
  const { t } = useI18n()
  const block = c.seats
  const seed = Number(c.sel.film.id.replace('f', '')) || 1
  const cinema = CINEMAS[c.sel.cinema]
  return (
    <div>
      <Title sub={`${t.l(c.sel.film.title)}, ${cinema.name}, ${t.when(c.sel)}`}>{t('seats.title')}</Title>
      <Card>
        <div className="mx-auto mb-6 h-2 w-4/5 rounded-full bg-gradient-to-r from-transparent via-yellow to-transparent" />
        <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted">{t('seats.screen')}</p>
        <div className="space-y-2">
          {ROWS.map((r, ri) => (
            <div key={r} className="flex items-center justify-center gap-1.5">
              <span className="w-4 text-xs text-muted">{r}</span>
              {Array.from({ length: COLS }, (_, ci) => {
                const mine = block && block.row === ri && ci >= block.start && ci < block.start + block.party
                const taken = isTaken(ri, ci, seed)
                return (
                  <span key={ci} className={`flex items-center justify-center ${ci === 4 ? 'mr-3' : ''}`}>
                    <span className={`flex h-7 w-6 items-center justify-center rounded-t-lg rounded-b-sm text-[10px] font-bold sm:h-8 sm:w-7 ${mine ? 'bg-yellow text-night ring-2 ring-maroon' : taken ? 'bg-night/30' : 'border border-line bg-white'}`}>{mine ? ci + 1 : ''}</span>
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-yellow" />{t('seats.yours')}</span>
          <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm border border-line bg-white" />{t('seats.free')}</span>
          <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-night/30" />{t('seats.taken')}</span>
        </div>
      </Card>
      <p className="my-4 text-center text-night">{block ? t('seats.label', { s: seatLabel(block) }) : <span className="text-muted">{t('seats.none')}</span>}</p>
      <div className="space-y-3">
        <Button disabled={!block} onClick={() => c.go('pay')}>{t('seats.pay')}</Button>
        <Button variant="ghost" onClick={() => c.setSeatOpt(c.seatOpt + 1)}>{t('seats.other')}</Button>
      </div>
    </div>
  )
}

const METHODS = [
  { id: 'card', k: 'pay.card', sub: 'pay.cardSub', icon: 'idcard' },
  { id: 'apple', k: 'pay.apple', sub: 'pay.appleSub', icon: 'phone' },
  { id: 'bizum', k: 'pay.bizum', sub: 'pay.bizumSub', icon: 'phone' },
]

function priceLines(c) {
  const feeEach = c.popcorn ? 0 : BOOKING_FEE
  const tickets = TICKET_PRICE * c.party
  const feeFull = BOOKING_FEE * c.party
  const fee = feeEach * c.party
  return { tickets, feeFull, fee, total: tickets + fee }
}

function PriceRows({ c, eur }) {
  const { t } = useI18n()
  const p = priceLines(c)
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-muted"><span>{t('pay.tickets', { n: c.party, p: eur(TICKET_PRICE) })}</span><span>{eur(p.tickets)}</span></div>
      <div className={`flex justify-between font-semibold ${c.popcorn ? 'text-muted line-through' : 'text-maroon'}`}><span>{t('pay.fee', { n: c.party, p: eur(BOOKING_FEE) })}</span><span>{eur(p.feeFull)}</span></div>
      {c.popcorn && <div className="flex justify-between font-semibold text-emerald-700"><span>{t('pay.free')}</span><span>{eur(0)}</span></div>}
      <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-night"><span>{t('pay.total')}</span><span>{eur(p.total)}</span></div>
    </div>
  )
}

export function Pay({ c }) {
  const { t } = useI18n()
  const eur = useMoney()
  const [method, setMethod] = useState('card')
  const [phase, setPhase] = useState('choose')
  const total = priceLines(c).total
  const pay = () => {
    setPhase('processing')
    setTimeout(() => setPhase('done'), 2000)
    setTimeout(() => { c.setPayMethod(method); c.go('confirm', true) }, 3200)
  }
  if (phase !== 'choose') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        {phase === 'processing' ? (
          <><div className="spin mb-8 h-16 w-16 rounded-full border-4 border-line border-t-maroon" /><h1 className="text-3xl text-night"><Headline>{t('pay.processing')}</Headline></h1></>
        ) : (
          <><div className="pop mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="check" size={52} /></div><h1 className="text-3xl text-night"><Headline>{t('pay.received', { amt: eur(total) })}</Headline></h1></>
        )}
      </div>
    )
  }
  return (
    <div>
      <Title sub={t('pay.sub')}>{t('pay.title')}</Title>
      <Card className="mb-5 space-y-3">
        <div>
          <div className="font-display text-xl uppercase tracking-wide text-night">{t.l(c.sel.film.title)}</div>
          <div className="text-sm text-muted">{CINEMAS[c.sel.cinema].name}, {t.when(c.sel)}, {t('conf.seats', { s: seatLabel(c.seats) })}</div>
        </div>
        <div className="border-t border-line pt-3"><PriceRows c={c} eur={eur} /></div>
        <div className="text-xs text-muted">{t('pay.direct')}</div>
      </Card>
      <div className="mb-5 space-y-3">
        {METHODS.map((m) => (
          <button key={m.id} onClick={() => setMethod(m.id)} className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${method === m.id ? 'border-maroon bg-yellow/25' : 'border-line bg-white'}`}>
            <span className="text-maroon"><Icon name={m.icon} size={26} /></span>
            <span className="flex-1"><span className="block font-bold text-night">{t(m.k)}</span><span className="text-sm text-muted">{t(m.sub)}</span></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${method === m.id ? 'border-maroon bg-maroon text-white' : 'border-line'}`}>{method === m.id && <Icon name="check" size={14} />}</span>
          </button>
        ))}
      </div>
      <Button onClick={pay}>{t('pay.btn', { amt: eur(total) })}</Button>
      <p className="mt-3 text-center text-xs text-muted">{t('pay.demo')}</p>
    </div>
  )
}

export function Confirm({ c }) {
  const { t } = useI18n()
  const eur = useMoney()
  const list = useListNames()
  const cinema = CINEMAS[c.sel.cinema]
  const total = priceLines(c).total
  const method = METHODS.find((m) => m.id === c.payMethod) || METHODS[0]
  const people = [c.lead, ...c.others]
  return (
    <div>
      <div className="pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="check" size={44} /></div>
      <Title sub={t('conf.sub', { amt: eur(total), method: t(method.k) })}>{t('conf.title')}</Title>
      <Card className="space-y-4">
        <div>
          <div className="font-display text-2xl uppercase tracking-wide text-night">{t.l(c.sel.film.title)}</div>
          <div className="text-sm text-muted">{cinema.name}, {cinema.address}</div>
          <div className="text-sm text-muted">{t('conf.when', { time: t.when(c.sel), version: versionLabel(t, c.sel) })}</div>
        </div>
        <div className="flex items-center gap-3 border-t border-line pt-4">
          <div className="flex -space-x-3">{people.map((o) => <div key={o.person.id} className="rounded-full border-2 border-white"><Avatar name={o.person.name} color={o.person.color} size={40} /></div>)}</div>
          <div className="text-sm text-night">{t('conf.withGroup', { names: list(people.map((o) => `${o.person.name}, ${o.person.age}`)) })}<br /><span className="text-muted">{t('conf.seats', { s: seatLabel(c.seats) })}</span></div>
        </div>
        <div className="border-t border-line pt-4"><PriceRows c={c} eur={eur} /></div>
      </Card>
      <div className="mt-4"><SharePlan c={c} compact /></div>
      <div className="mt-5"><Button onClick={() => c.go('checkin')}>{t('conf.ticket')}</Button></div>
    </div>
  )
}

/* ---------- check-in ---------- */
export function Checkin({ c }) {
  const { t } = useI18n()
  const [qr, setQr] = useState('')
  const [state, setState] = useState('idle')
  const cinema = CINEMAS[c.sel.cinema]
  useEffect(() => {
    QRCode.toDataURL('PLUSONE-DEMO-' + c.sel.film.id + '-' + seatLabel(c.seats).replace(/, /g, '-'), { margin: 1, width: 360, color: { dark: '#0d0909', light: '#ffffff' } })
      .then(setQr).catch(() => {})
  }, [c.sel, c.seats])
  useEffect(() => {
    if (state !== 'waiting') return
    const id = setTimeout(() => setState('both'), 1800)
    return () => clearTimeout(id)
  }, [state])
  return (
    <div>
      <Title sub={t('ci.sub')}>{t('ci.title')}</Title>
      <div className="overflow-hidden rounded-3xl bg-white text-night">
        <div className="p-5" style={{ background: `linear-gradient(135deg, ${c.sel.film.grad[0]}, ${c.sel.film.grad[1]})` }}>
          <div className="font-display text-xl font-bold text-white">{t.l(c.sel.film.title)}</div>
          <div className="text-sm text-white/85">{cinema.name}</div>
        </div>
        <div className="flex items-center justify-between border-b-2 border-dashed border-night/20 px-5 py-4 text-sm">
          <div><div className="text-xs text-night/60">{t('ci.time')}</div><b>{t('ci.timeVal', { time: t.when(c.sel) })}</b></div>
          <div className="text-right"><div className="text-xs text-night/60">{t('ci.seats')}</div><b>{seatLabel(c.seats)}</b></div>
        </div>
        <div className="flex justify-center p-5">{qr ? <img src={qr} alt="QR" className="h-48 w-48" /> : <div className="h-48 w-48" />}</div>
      </div>
      <Card className="mt-4 space-y-3">
        <div className="flex items-center justify-between"><span className="text-night">{t('ci.you')}</span><span className={state === 'idle' ? 'text-muted' : 'text-emerald-700'}>{state === 'idle' ? t('ci.not') : t('ci.in')}</span></div>
        <div className="flex items-center justify-between"><span className="text-night">{c.lead.person.name}</span><span className={state === 'both' ? 'text-emerald-700' : 'text-muted'}>{state === 'both' ? t('ci.in') : state === 'waiting' ? t('ci.arriving') : t('ci.yet')}</span></div>
        {state === 'both' && <div className="pop rounded-2xl bg-emerald-100 py-3 text-center font-semibold text-emerald-700">{t('ci.both')}</div>}
      </Card>
      <div className="mt-5">
        {state === 'idle' && <Button onClick={() => setState('waiting')}>{t('ci.btn')}</Button>}
        {state === 'waiting' && <Button disabled>{t('ci.wait')}</Button>}
        {state === 'both' && <Button onClick={() => c.go('mood')}>{t('ci.over')}</Button>}
      </div>
    </div>
  )
}

/* ---------- afterglow ---------- */
export function Mood({ c }) {
  const { t } = useI18n()
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (!c.mood) { setRevealed(false); return }
    const id = setTimeout(() => setRevealed(true), 1300)
    return () => clearTimeout(id)
  }, [c.mood])
  const theirs = c.lead.person.mood
  return (
    <div>
      <Title sub={t('mood.sub')}>{t('mood.title')}</Title>
      <div className="flex flex-wrap gap-3">
        {MOODS.map((m) => <Chip key={m} active={c.mood === m} className="!min-h-[52px] !px-6 !text-base" onClick={() => c.setMood(m)}>{t.mood(m)}</Chip>)}
      </div>
      {c.mood && (
        <Card className="screen-enter mt-6">
          <div className="flex items-center gap-3">
            <Avatar name={c.lead.person.name} color={c.lead.person.color} size={44} />
            <div className="text-night">{revealed ? <>{t('mood.feels', { name: c.lead.person.name, mood: '' })}<b className="text-maroon">{t.mood(theirs).toLowerCase()}</b></> : <>{c.lead.person.name} <span className="text-muted">{t('mood.choosing')}</span></>}</div>
          </div>
        </Card>
      )}
      <div className="mt-6"><Button disabled={!revealed} onClick={() => c.go('bar')}>{t('mood.show')}</Button></div>
    </div>
  )
}

function whyFits(t, c, bar) {
  const theirs = c.lead.person.mood
  const feel = c.mood === theirs
    ? t('why.same', { mood: t.mood(c.mood).toLowerCase() })
    : t('why.diff', { mine: t.mood(c.mood).toLowerCase(), name: c.lead.person.name, theirs: t.mood(theirs).toLowerCase() })
  return `${feel} ${t('why.tail', { genre: t.genre(c.sel.film.genre).toLowerCase() })} ${t.l(bar.vibe)}`
}

export function Bar({ c }) {
  const { t } = useI18n()
  const area = CINEMAS[c.sel.cinema].area
  return (
    <div>
      <Title sub={t('bars.sub', { cinema: CINEMAS[c.sel.cinema].name })}>{t('bars.title')}</Title>
      <div className="space-y-3">
        {c.bars.map(({ bar, walk }, i) => (
          <button key={bar.id} onClick={() => { c.setBarId(bar.id); c.go('barDetail') }} className={`w-full rounded-3xl border p-4 text-left transition active:scale-[0.99] ${i === 0 ? 'border-maroon bg-yellow/25' : 'border-line bg-panel'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg font-bold text-night">{bar.name}</div>
                <div className="text-sm text-muted">{bar.area}</div>
              </div>
              {i === 0 ? <span className="shrink-0 rounded-full bg-yellow px-2.5 py-1 text-xs font-bold text-night">{t('bars.best')}</span> : <span className="shrink-0 text-sm text-muted">{t('bars.walk', { n: walk })}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {i === 0 && <span className="rounded-full bg-panel2 px-2.5 py-1 text-night">{t('bars.walk', { n: walk })}</span>}
              <span className="flex items-center gap-1 rounded-full bg-panel2 px-2.5 py-1 text-night"><Icon name="music" size={12} />{t.music(bar.music)}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">{t('bars.open', { t: bar.closes })}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">{t('bars.foot', { area })}</p>
    </div>
  )
}

export function BarDetail({ c }) {
  const { t } = useI18n()
  const picked = c.bars.find((b) => b.bar.id === c.barId) || c.bars[0]
  const { bar, walk } = picked
  const table = addMinutes(c.sel.time, c.sel.film.runtime + 25)
  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="relative flex h-32 items-end p-5" style={{ background: 'linear-gradient(135deg, #7c2d12, #f5a524)' }}>
          <div className="absolute right-5 top-5 text-white/80"><Icon name="glass" size={40} /></div>
          <div><div className="font-display text-2xl font-bold text-white">{bar.name}</div><div className="text-sm text-white/90">{bar.area}</div></div>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-panel2 p-3"><Icon name="pin" size={18} className="mb-1 text-maroon" /><div className="font-semibold text-night">{t('bars.walk', { n: walk })}</div><div className="text-muted">{t('bd.about', { n: walk * 80 })}</div></div>
            <div className="rounded-2xl bg-panel2 p-3"><Icon name="music" size={18} className="mb-1 text-maroon" /><div className="font-semibold text-night">{t.music(bar.music)}</div><div className="text-muted">{t('bars.open', { t: bar.closes })}</div></div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-maroon">{t('bd.why')}</div>
            <p className="text-night">{whyFits(t, c, bar)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
            <div className="font-semibold text-emerald-700">{t('bd.table', { t: table })}</div>
            <div className="text-sm text-muted">{t('bd.held')}</div>
          </div>
          <div className="rounded-2xl border border-dashed border-maroon/60 p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-muted">{t('bd.voucher')}</div>
            <div className="my-1 font-display text-2xl font-bold text-maroon">PLUS1-{bar.id.toUpperCase()}-2DRK</div>
            <div className="text-sm text-muted">{t('bd.drink', { drink: t('drink.' + c.profile.answers.drink).toLowerCase() })}</div>
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <Button onClick={() => { c.setAgStatus('confirmed'); c.go('afterglow') }}>{t('bd.confirm')}</Button>
        <Button variant="ghost" onClick={() => c.back()}>{t('bd.back')}</Button>
      </div>
    </div>
  )
}

export function Afterglow({ c }) {
  const { t } = useI18n()
  const [asking, setAsking] = useState(false)
  const picked = c.bars.find((b) => b.bar.id === c.barId) || c.bars[0]
  const { bar } = picked
  const table = addMinutes(c.sel.time, c.sel.film.runtime + 25)
  const drink = t('drink.' + c.profile.answers.drink).toLowerCase()
  const voucher = (
    <div className="rounded-2xl border-2 border-dashed border-maroon/50 p-3 text-center">
      <div className="text-xs uppercase tracking-widest text-muted">{t('bd.voucher')}</div>
      <div className="font-display text-2xl tracking-wide text-maroon">PLUS1-{bar.id.toUpperCase()}-2DRK</div>
      <div className="text-sm text-muted">{t('bd.drink', { drink })}</div>
    </div>
  )
  if (c.agStatus === 'cancelled') {
    return (
      <div className="pt-6 text-center">
        <div className="pop mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-panel2 text-muted"><Icon name="x" size={48} /></div>
        <Title sub={t('ag.cancelledSub', { bar: bar.name, name: c.lead.person.name })}>{t('ag.cancelled')}</Title>
        <div className="space-y-3">
          <Button onClick={() => { c.setAgStatus(null); c.go('bar', true) }}>{t('ag.another')}</Button>
          <Button variant="ghost" onClick={() => c.restart()}>{t('ag.finish')}</Button>
        </div>
      </div>
    )
  }
  if (c.agStatus === 'here') {
    return (
      <div>
        <div className="pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="glass" size={40} /></div>
        <Title sub={t('ag.hereSub', { bar: bar.name })}>{t('ag.hereTitle')}</Title>
        <Card className="mb-5 space-y-3">
          <div><div className="font-display text-2xl uppercase tracking-wide text-night">{bar.name}</div><div className="text-sm text-muted">{bar.area}, {t.music(bar.music)}</div></div>
          {voucher}
        </Card>
        <Button onClick={() => c.go('after')}>{t('ag.end')}</Button>
      </div>
    )
  }
  return (
    <div>
      <div className="pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="glass" size={40} /></div>
      <Title sub={t('ag.sub', { name: c.lead.person.name })}>{t('ag.title')}</Title>
      <Card className="mb-4 space-y-3">
        <div><div className="font-display text-2xl uppercase tracking-wide text-night">{bar.name}</div><div className="text-sm text-muted">{bar.area}, {t('bars.walk', { n: picked.walk })}, {t.music(bar.music)}</div></div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{t('bd.table', { t: table })}</div>
        {voucher}
      </Card>
      <SharePlan c={c} compact />
      <div className="mt-5 space-y-3">
        <Button variant="yellow" icon="pin" onClick={() => c.setAgStatus('here')}>{t('ag.here')}</Button>
        <p className="text-center text-xs text-muted">{t('ag.partner', { bar: bar.name })}</p>
        {asking ? (
          <Card className="border-red-300">
            <p className="mb-3 text-night">{t('ag.ask', { bar: bar.name })}</p>
            <div className="space-y-2">
              <Button variant="danger" onClick={() => { c.setAgStatus('cancelled'); setAsking(false) }}>{t('ag.yes')}</Button>
              <Button variant="ghost" onClick={() => setAsking(false)}>{t('ag.no')}</Button>
            </div>
          </Card>
        ) : (
          <Button variant="danger" onClick={() => setAsking(true)}>{t('ag.cancel')}</Button>
        )}
      </div>
    </div>
  )
}

export function After({ c }) {
  const { t } = useI18n()
  const [nps, setNps] = useState(null)
  const [safe, setSafe] = useState(null)
  const [sent, setSent] = useState(false)
  const name = c.lead.person.name
  const saved = c.buddies.includes(c.lead.person.id)
  if (sent) {
    return (
      <div className="pt-6 text-center">
        <div className="pop mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow text-night"><Icon name="heart" size={44} /></div>
        <Title sub={t('af.thanksSub')}>{t('af.thanks')}</Title>
        <div className="space-y-3">
          {saved && <Button onClick={() => { c.setBuddyId(c.lead.person.id); c.go('films', true) }}>{t('af.again', { name })}</Button>}
          <Button variant="ghost" onClick={() => c.restart()}>{t('ag.finish')}</Button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Title>{t('af.title')}</Title>
      <Card className="mb-4">
        <h2 className="mb-3 font-bold text-night">{t('af.nps')}</h2>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 11 }, (_, n) => (
            <button key={n} onClick={() => setNps(n)} className={`min-h-[44px] rounded-xl border-2 font-display text-lg transition active:scale-95 ${nps === n ? 'border-maroon bg-yellow text-night' : 'border-line bg-white text-night'}`}>{n}</button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted"><span>{t('af.nps0')}</span><span>{t('af.nps10')}</span></div>
      </Card>
      <Card className="mb-4 bg-sky !border-sky">
        <h2 className="mb-3 font-bold text-night">{t('af.safe')}</h2>
        <div className="flex flex-wrap gap-2">
          {[['yes', 'af.safeYes'], ['mostly', 'af.safeMostly'], ['no', 'af.safeNo']].map(([k, l]) => <Chip key={k} active={safe === k} onClick={() => setSafe(k)}>{t(l)}</Chip>)}
        </div>
        {safe === 'no' && (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-night">{t('af.safeNoMsg')}</p>
            <Button variant="danger" icon="shield" onClick={() => c.go('safety')}>{t('menu.safety')}</Button>
          </div>
        )}
      </Card>
      <Card className="mb-5">
        <Toggle on={saved} onChange={() => c.toggleBuddy(c.lead.person.id)} label={t('af.buddy', { name })} sub={saved ? t('af.buddySaved', { name }) : t('af.buddySub')} />
      </Card>
      <Button disabled={nps === null || !safe} onClick={() => setSent(true)}>{t('af.submit')}</Button>
    </div>
  )
}

export function useBars(sel, mood, lead) {
  return useMemo(() => {
    if (!sel || !mood || !lead) return []
    return rankBars(sel.film, CINEMAS[sel.cinema].area, mood, lead.person.mood)
  }, [sel, mood, lead])
}
