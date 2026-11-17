import { initials } from './data.js'
import { useI18n } from './i18n.jsx'

const PATHS = {
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  back: <path d="M15 5l-7 7 7 7" />,
  check: <path d="M5 13l4 4L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  pin: (<><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  music: (<><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>),
  ticket: <path d="M3 7h18v4a2 2 0 000 4v4H3v-4a2 2 0 000-4V7z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />,
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>),
  camera: (<><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>),
  idcard: (<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M15 10h3M15 13h3" /></>),
  lock: (<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" />,
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2 20a7 7 0 0114 0" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14a5 5 0 015 6" /></>),
  flag: <path d="M5 21V4M5 4h12l-2 4 2 4H5" />,
  refresh: <path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" />,
  share: (<><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 11l7.6-4M8.2 13l7.6 4" /></>),
  glass: <path d="M5 4h14l-7 9-7-9zM12 13v7M8 20h8" />,
  heart: <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" />,
  film: (<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>),
  gift: (<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8c-3 0-4-4-1.5-4S12 8 12 8zm0 0c3 0 4-4 1.5-4S12 8 12 8z" /></>),
  store: <path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0M10 20v-6h4v6" />,
}

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}

// Replace public/logo.svg to change the logo (header, splash and browser tab icon).
export function Logo({ size = 'md' }) {
  const big = size === 'lg'
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="" className={big ? 'h-14 w-14 rounded-2xl' : 'h-8 w-8 rounded-lg'} />
      <div className="flex flex-col items-start leading-none">
        <span className={`font-display uppercase tracking-wide text-night ${big ? 'text-4xl' : 'text-lg'}`}>Plus One</span>
        <span className={`mt-0.5 rounded-full bg-yellow font-bold uppercase text-night ${big ? 'px-3 py-0.5 text-xs tracking-[0.25em]' : 'px-1.5 text-[8px] tracking-[0.2em]'}`}>Cinema</span>
      </div>
    </div>
  )
}

export function Button({ children, onClick, variant = 'primary', disabled, className = '', icon }) {
  const styles = {
    primary: 'bg-maroon text-white hover:bg-maroon/90 disabled:bg-line disabled:text-muted',
    yellow: 'bg-yellow text-night hover:bg-yellow/90 disabled:bg-line disabled:text-muted',
    ghost: 'border-2 border-night/15 bg-white text-night hover:bg-panel2',
    soft: 'bg-panel2 text-night hover:bg-line',
    danger: 'border-2 border-red-700/30 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition active:scale-[0.98] disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  )
}

export function Chip({ children, active, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`min-h-[40px] rounded-full border-2 px-4 text-sm font-semibold transition active:scale-95 ${
        active ? 'border-maroon bg-yellow text-night' : 'border-line bg-white text-night hover:bg-panel2'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-line bg-panel p-5 ${className}`}>{children}</div>
}

export function VerifiedBadge() {
  const { t } = useI18n()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
      <Icon name="check" size={13} /> {t('verified')}
    </span>
  )
}

export function LangSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="inline-flex rounded-full border-2 border-line bg-white p-0.5 text-xs font-bold">
      {['en', 'es'].map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-label={l === 'en' ? 'English' : 'Español'} className={`min-h-[32px] rounded-full px-3 ${lang === l ? 'bg-maroon text-white' : 'text-muted'}`}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

// One-tap language toggle for the header: shows the language you would switch to.
export function LangToggle() {
  const { lang, setLang } = useI18n()
  const next = lang === 'en' ? 'es' : 'en'
  return (
    <button onClick={() => setLang(next)} aria-label={next === 'es' ? 'Español' : 'English'} className="flex h-9 min-w-[40px] items-center justify-center rounded-full border-2 border-maroon/40 bg-white px-2 text-xs font-bold text-maroon">
      {next.toUpperCase()}
    </button>
  )
}

export function Avatar({ name, color, size = 56 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display text-white"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: size * 0.46 }}
    >
      {initials(name)}
    </div>
  )
}

export function Toggle({ on, onChange, label, sub }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-4 text-left">
      <span>
        <span className="block font-semibold text-night">{label}</span>
        {sub && <span className="mt-0.5 block text-sm text-muted">{sub}</span>}
      </span>
      <span className={`relative h-8 w-14 shrink-0 rounded-full transition ${on ? 'bg-maroon' : 'bg-line'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? 'left-7' : 'left-1'}`} />
      </span>
    </button>
  )
}

// Bold uppercase headline. Put the key word in [square brackets] to sit it on a yellow block;
// with no brackets the last word is highlighted.
export function Headline({ children, className = '' }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>
  let pre, hl, post
  const m = children.match(/^(.*?)\[(.+?)\](.*)$/)
  if (m) { [, pre, hl, post] = m } else {
    const i = children.lastIndexOf(' ')
    pre = i >= 0 ? children.slice(0, i + 1) : ''
    hl = i >= 0 ? children.slice(i + 1) : children
    post = ''
  }
  return (
    <span className={`font-display uppercase leading-[1.15] tracking-wide ${className}`}>
      {pre}<mark className="rounded-md bg-yellow px-2 text-night [box-decoration-break:clone]">{hl}</mark>{post}
    </span>
  )
}

export function Title({ children, sub }) {
  return (
    <div className="mb-5">
      <h1 className="text-[2rem] text-night"><Headline>{children}</Headline></h1>
      {sub && <p className="mt-3 text-base text-muted">{sub}</p>}
    </div>
  )
}

export function Poster({ film, className = '' }) {
  const { lang } = useI18n()
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${film.grad[0]}, ${film.grad[1]})` }}>
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20" />
      <div className="absolute -bottom-8 left-4 h-24 w-24 rounded-full bg-black/15" />
      <div className="relative flex h-full flex-col justify-end p-4">
        <span className="font-display text-2xl uppercase leading-tight tracking-wide text-white drop-shadow">{film.title[lang]}</span>
      </div>
    </div>
  )
}

export function SimBanner({ children }) {
  return (
    <div className="rounded-2xl border border-yellow bg-yellow/25 px-4 py-3 text-sm text-night">{children}</div>
  )
}
