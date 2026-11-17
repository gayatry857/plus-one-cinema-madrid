import { useState } from 'react'
import { useI18n } from './i18n.jsx'
import { Button, Card, Icon, SimBanner, Title } from './ui.jsx'
import { SharePlan } from './flow.jsx'

const SAFETY = [['idcard', 1], ['users', 2], ['shield', 3], ['pin', 4]]

export function Safety({ c }) {
  const { t } = useI18n()
  const [emName, setEmName] = useState('')
  const [emSaved, setEmSaved] = useState(false)
  const [done, setDone] = useState(null)
  const who = c.lead ? c.lead.person.name : t('saf.lastMatch')
  const input = 'min-h-[48px] w-full rounded-2xl border-2 border-line bg-white px-4 text-night placeholder:text-muted focus:border-maroon focus:outline-none'
  return (
    <div>
      <Title sub={t('saf.sub')}>{t('saf.head')}</Title>
      <div className="space-y-3">
        {SAFETY.map(([ic, n]) => (
          <Card key={n} className="flex gap-4 !border-sky bg-sky">
            <span className="mt-0.5 text-blue"><Icon name={ic} size={26} /></span>
            <div><div className="font-bold text-night">{t(`saf.${n}.t`)}</div><div className="mt-1 text-sm text-night/80">{t(`saf.${n}.s`)}</div></div>
          </Card>
        ))}

        <SharePlan c={c} />

        <Card>
          <div className="mb-1 flex items-center gap-3 font-bold text-night"><span className="text-maroon"><Icon name="phone" /></span>{t('saf.em')}</div>
          <p className="mb-3 text-sm text-muted">{t('saf.emSub')}</p>
          {emSaved ? (
            <div className="pop rounded-2xl bg-emerald-100 p-3 text-sm text-emerald-800">{t('saf.emDone', { name: emName || t('saf.emDefault') })}</div>
          ) : (
            <><input className={input} placeholder={t('saf.emPh')} value={emName} onChange={(e) => setEmName(e.target.value.slice(0, 20))} />
              <div className="mt-3"><Button variant="soft" onClick={() => setEmSaved(true)}>{t('saf.emSave')}</Button></div></>
          )}
        </Card>

        <Card>
          <div className="mb-1 flex items-center gap-3 font-bold text-night"><span className="text-red-700"><Icon name="flag" /></span>{t('saf.rb')}</div>
          <p className="mb-4 text-sm text-muted">{t('saf.rbSub')}</p>
          {done ? (
            <div className="pop rounded-2xl bg-panel2 p-4 text-sm text-night">{done === 'block' ? t('saf.blocked', { who }) : t('saf.reported', { who })}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="danger" onClick={() => setDone('report')}>{t('saf.reportTap', { who })}</Button>
              <Button variant="danger" onClick={() => setDone('block')}>{t('saf.blockTap', { who })}</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export function Premium({ c }) {
  const { t } = useI18n()
  const [on, setOn] = useState(false)
  const perks = [['heart', 1], ['star', 2], ['ticket', 3]]
  return (
    <div>
      <div className="mb-6 rounded-3xl bg-maroon p-6 text-white">
        <div className="text-sm font-bold uppercase tracking-widest text-yellow">{t('prem.name')}</div>
        <div className="mt-2 font-display text-6xl tracking-wide text-yellow">{t('money.4.n')}<span className="font-sans text-lg font-semibold text-white"> {t('prem.month')}</span></div>
        <div className="mt-1 text-sm">{t('prem.cancel')}</div>
        {c.popcorn && <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-yellow px-3 py-1 text-sm font-bold text-night"><Icon name="gift" size={16} />{t('prem.free')}</div>}
      </div>
      <div className="space-y-3">
        {perks.map(([ic, n]) => (
          <Card key={n} className="flex gap-4"><span className="text-maroon"><Icon name={ic} size={26} /></span><div><div className="font-bold text-night">{t(`prem.${n}.t`)}</div><div className="text-sm text-muted">{t(`prem.${n}.s`)}</div></div></Card>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {on ? <div className="pop rounded-2xl bg-emerald-100 p-4 text-center font-bold text-emerald-800">{t('prem.on')}</div> : <Button onClick={() => setOn(true)}>{t('prem.start')}</Button>}
        <Button variant="ghost" onClick={() => c.back()}>{t('prem.later')}</Button>
      </div>
      <div className="mt-4"><SimBanner>{t('prem.demo')}</SimBanner></div>
    </div>
  )
}

export function Partners() {
  const { t } = useI18n()
  return (
    <div>
      <Title sub={t('pt.sub')}>{t('pt.title')}</Title>
      <div className="space-y-4">
        {[['film', 'c'], ['glass', 'b']].map(([ic, k]) => (
          <Card key={k} className="space-y-3">
            <div className="flex items-center gap-3 font-display text-2xl uppercase tracking-wide text-night"><span className="text-maroon"><Icon name={ic} size={26} /></span>{t(`pt.${k}.t`)}</div>
            {[1, 2].map((n) => <div key={n} className="flex gap-3 text-sm text-night"><span className="mt-0.5 text-emerald-700"><Icon name="check" size={18} /></span>{t(`pt.${k}.${n}`)}</div>)}
            <div className="rounded-2xl bg-yellow/30 p-3 text-sm font-semibold text-night">{t(`pt.${k}.pay`)}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function Money() {
  const { t } = useI18n()
  return (
    <div>
      <Title sub={t('money.sub')}>{t('money.title')}</Title>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <Card key={n} className="flex gap-4">
            <div className="flex h-14 min-w-[4.75rem] items-center justify-center rounded-2xl bg-yellow px-2 text-center font-display text-2xl tracking-wide text-night">{t(`money.${n}.n`)}</div>
            <div className="flex-1">
              <div className="font-bold text-night">{n}. {t(`money.${n}.t`)}</div>
              <div className="mt-1 text-sm text-muted">{t(`money.${n}.s`)}</div>
              {n === 2 && (
                <div className="mt-3 flex h-6 overflow-hidden rounded-full text-[11px] font-bold">
                  <div className="flex w-[10%] min-w-[2.2rem] items-center justify-center bg-yellow text-night">€1</div>
                  <div className="flex flex-1 items-center justify-center bg-maroon text-white">€9</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">{t('money.foot')}</p>
    </div>
  )
}
