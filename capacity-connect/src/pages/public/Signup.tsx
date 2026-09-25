import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, Clock, GraduationCap, UserCog, ShieldCheck } from 'lucide-react'
import { GovLayout } from '../../components/layout/GovLayout'
import { PageBanner } from '../../components/gov/PageBanner'
import { Captcha } from '../../components/gov/Captcha'
import { Card, CardHeader, Button, TextInput, Medallion } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { usePrefs } from '../../context/PrefsContext'
import { newCaptcha, PASSWORD_RULES, passwordScore } from '../../lib/auth'
import type { Role } from '../../types'

const ROLE_OPTIONS: { value: Role; label: string; text: string; icon: typeof GraduationCap }[] = [
  { value: 'trainee', label: 'Trainee', text: 'Enrol in courses, access material, take assessments', icon: GraduationCap },
  { value: 'trainer', label: 'Trainer', text: 'Upload material, set questionnaires, track trainees', icon: UserCog },
  { value: 'admin', label: 'Administrator', text: 'Requires approval by an existing administrator', icon: ShieldCheck },
]

const STRENGTH = ['Very weak', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLOR = ['#b91c1c', '#b91c1c', '#c2410c', '#a16207', '#15803d', '#138808']

export function Signup() {
  const navigate = useNavigate()
  const { signup, users } = useAppData()
  const { t } = usePrefs()
  const [role, setRole] = useState<Role>('trainee')
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [captcha, setCaptcha] = useState(() => newCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [declared, setDeclared] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const score = passwordScore(password)

  const submit = async () => {
    setError('')
    if (score < PASSWORD_RULES.length) return setError('Password does not meet the password policy.')
    if (password !== confirm) return setError('Passwords do not match.')
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return setError('An account with this email already exists.')
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptcha(newCaptcha())
      setCaptchaInput('')
      return setError('The security code does not match. Please try again.')
    }
    if (!declared) return setError('Please accept the declaration to continue.')
    await signup({ name: name.trim(), email, role, password, employeeId: employeeId.trim(), department: department.trim() })
    setDone(true)
  }

  return (
    <GovLayout>
      <PageBanner title="New User Registration" subtitle="Registrations are activated after approval by the administrator" crumbs={[{ label: t('navHome'), to: '/' }, { label: t('register') }]} scene="training" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {done ? (
          <Card>
            <div className="p-8 text-center">
              <CheckCircle2 size={48} className="text-indiagreen mx-auto" />
              <h2 className="font-serif text-xl font-bold text-navy mt-3">Registration submitted</h2>
              <p className="text-sm text-slate-600 mt-2">
                Your {ROLE_OPTIONS.find((r) => r.value === role)?.label.toLowerCase()} registration is in the administrator's approval queue.
                You can log in once it is approved.
              </p>
              <p className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2">
                <Clock size={16} /> Status: Pending approval
              </p>
              <div className="mt-6"><Button onClick={() => navigate('/login')}>Go to Login</Button></div>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader title="Registration Form" subtitle="All fields marked * are mandatory" />
            <form
              className="p-6 space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                void submit()
              }}
            >
              <fieldset className="min-w-0">
                <legend className="font-serif font-semibold text-navy border-b border-rule w-full pb-1 mb-3">1. Register as</legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map((r) => (
                    <label
                      key={r.value}
                      className={`flex gap-3 p-3 border-2 cursor-pointer ${role === r.value ? 'border-navy bg-navy-50' : 'border-rule hover:border-slate-400'}`}
                    >
                      <input type="radio" name="role" className="sr-only" checked={role === r.value} onChange={() => setRole(r.value)} />
                      <Medallion icon={r.icon} size={36} tone={r.value === 'admin' ? 'saffron' : 'navy'} />
                      <span>
                        <span className="block font-semibold text-slate-800 text-sm">{r.label}</span>
                        <span className="block text-xs text-slate-600 leading-snug">{r.text}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="min-w-0">
                <legend className="font-serif font-semibold text-navy border-b border-rule w-full pb-1 mb-3">2. Official details</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput label="Full Name" value={name} onChange={setName} required autoComplete="name" />
                  <TextInput label="Employee ID" value={employeeId} onChange={setEmployeeId} placeholder="e.g. IMD-20431" required />
                  <TextInput label="Official Email ID" type="email" value={email} onChange={setEmail} placeholder="name@gov.in" required autoComplete="email" />
                  <TextInput label="Department / Office" value={department} onChange={setDepartment} placeholder="e.g. Regional Met Centre, Chennai" required />
                </div>
              </fieldset>

              <fieldset className="min-w-0">
                <legend className="font-serif font-semibold text-navy border-b border-rule w-full pb-1 mb-3">3. Set password</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <TextInput label="Password" type="password" value={password} onChange={setPassword} required autoComplete="new-password" />
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1" aria-hidden="true">
                          {PASSWORD_RULES.map((_, i) => (
                            <span key={i} className="h-1.5 flex-1" style={{ background: i < score ? STRENGTH_COLOR[score] : '#e2e8f0' }} />
                          ))}
                        </div>
                        <p className="text-xs font-semibold mt-1" style={{ color: STRENGTH_COLOR[score] }}>Strength: {STRENGTH[score]}</p>
                      </div>
                    )}
                  </div>
                  <TextInput label="Confirm Password" type="password" value={confirm} onChange={setConfirm} required autoComplete="new-password" />
                </div>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs" aria-label="Password policy">
                  {PASSWORD_RULES.map((r) => {
                    const ok = r.test(password)
                    return (
                      <li key={r.label} className={`flex items-center gap-1.5 ${ok ? 'text-indiagreen' : 'text-slate-500'}`}>
                        {ok ? <CheckCircle2 size={13} /> : <Circle size={13} />} {r.label}
                      </li>
                    )
                  })}
                </ul>
              </fieldset>

              <fieldset className="min-w-0">
                <legend className="font-serif font-semibold text-navy border-b border-rule w-full pb-1 mb-3">4. Verification</legend>
                <div className="max-w-md">
                  <Captcha code={captcha} onRefresh={() => { setCaptcha(newCaptcha()); setCaptchaInput('') }} value={captchaInput} onChange={setCaptchaInput} />
                </div>
                <label className="flex items-start gap-2 mt-4 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#0a3d62]" />
                  I hereby declare that the information furnished above is true to the best of my knowledge, and I agree to the Terms of Use of this portal.
                </label>
              </fieldset>

              {error && <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2" role="alert">{error}</p>}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-rule">
                <Button type="submit" className="min-w-44">Submit Registration</Button>
                <span className="text-sm text-slate-600">Already registered? <Link to="/login" className="text-navy font-semibold underline">{t('login')}</Link></span>
              </div>
            </form>
          </Card>
        )}
      </div>
    </GovLayout>
  )
}
