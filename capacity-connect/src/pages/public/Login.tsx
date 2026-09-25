import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Info, KeyRound } from 'lucide-react'
import { GovLayout } from '../../components/layout/GovLayout'
import { PageBanner } from '../../components/gov/PageBanner'
import { Captcha } from '../../components/gov/Captcha'
import { TrainingScene } from '../../components/gov/Illustrations'
import { Card, CardHeader, Button, TextInput } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { resetDemoData } from '../../context/storage'
import { usePrefs } from '../../context/PrefsContext'
import { newCaptcha, DEMO_PASSWORD, MAX_LOGIN_ATTEMPTS, LOCKOUT_SECONDS } from '../../lib/auth'
import type { Role } from '../../types'

const ROLES: { value: Role; label: string; demoEmail: string }[] = [
  { value: 'trainee', label: 'Trainee', demoEmail: 'ritu.trainee@demo.gov.in' },
  { value: 'trainer', label: 'Trainer', demoEmail: 'anjali.trainer@demo.gov.in' },
  { value: 'admin', label: 'Administrator', demoEmail: 'admin@demo.gov.in' },
]

const REASON_TEXT = {
  not_found: 'Invalid email or password.',
  bad_password: 'Invalid email or password.',
  pending: 'Your registration is awaiting approval by the administrator.',
  rejected: 'Your registration was not approved. Please contact the training helpdesk.',
}

export function Login() {
  const navigate = useNavigate()
  const { loginWithPassword, loginDemoAccount, logout } = useAppData()
  const { t } = usePrefs()
  const [role, setRole] = useState<Role>('trainee')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captcha, setCaptcha] = useState(() => newCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [error, setError] = useState('')
  const [failures, setFailures] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [busy, setBusy] = useState(false)

  const lockedFor = Math.max(0, Math.ceil((lockedUntil - now) / 1000))
  useEffect(() => {
    if (!lockedFor) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [lockedFor])

  const refreshCaptcha = () => {
    setCaptcha(newCaptcha())
    setCaptchaInput('')
  }

  const submit = async () => {
    setError('')
    if (lockedFor) return
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setError('The security code does not match. Please try again.')
      refreshCaptcha()
      return
    }
    setBusy(true)
    const result = await loginWithPassword(email, password)
    setBusy(false)
    refreshCaptcha()
    if (!result.ok) {
      if (result.reason === 'not_found' || result.reason === 'bad_password') {
        const n = failures + 1
        setFailures(n)
        if (n >= MAX_LOGIN_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000)
          setNow(Date.now())
          setFailures(0)
          setError(`Too many failed attempts. Login is locked for ${LOCKOUT_SECONDS} seconds.`)
          return
        }
        setError(`${REASON_TEXT[result.reason]} ${MAX_LOGIN_ATTEMPTS - n} attempt(s) left.`)
      } else {
        setError(REASON_TEXT[result.reason])
      }
      return
    }
    if (result.user.role !== role) {
      logout()
      const actual = ROLES.find((r) => r.value === result.user.role)?.label
      setError(`This account is registered as ${actual}. Select "${actual}" under "Login as" and try again.`)
      return
    }
    navigate(`/${result.user.role}/dashboard`)
  }

  const quickLogin = (demoEmail: string) => {
    const user = loginDemoAccount(demoEmail)
    if (user) navigate(`/${user.role}/dashboard`)
  }

  return (
    <GovLayout>
      <PageBanner title={t('login')} subtitle="Sign in with your official email ID" crumbs={[{ label: t('navHome'), to: '/' }, { label: t('login') }]} scene="training" />
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-5 order-2 lg:order-1">
          <div className="border border-rule bg-white p-2">
            <TrainingScene tone="color" className="w-full h-auto aspect-[15/8]" title="Illustration of a training session" />
          </div>
          <Card>
            <CardHeader title="Important Instructions" />
            <ul className="p-5 space-y-2 text-sm text-slate-700 list-disc pl-9">
              <li>Use the official email ID registered with your office.</li>
              <li>New users must <Link to="/signup" className="text-navy font-semibold underline">register</Link> and wait for administrator approval.</li>
              <li>Login locks for {LOCKOUT_SECONDS} seconds after {MAX_LOGIN_ATTEMPTS} failed attempts.</li>
              <li>Never share your password. Officials will never ask for it.</li>
              <li>Always log out after use on shared computers.</li>
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2 space-y-5">
          <Card>
            <CardHeader title="Secure Login" subtitle="All fields marked * are mandatory" action={<Lock size={18} className="text-navy" />} />
            <form
              className="p-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                void submit()
              }}
            >
              <fieldset className="min-w-0">
                <legend className="text-sm font-semibold text-slate-800">Login as <span className="text-red-700">*</span></legend>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  {ROLES.map((r) => (
                    <label key={r.value} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="accent-[#0a3d62] w-4 h-4" />
                      {r.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <TextInput label="Official Email ID" value={email} onChange={setEmail} placeholder="name@gov.in" type="email" required autoComplete="username" />
              <div>
                <span className="text-sm font-semibold text-slate-800">Password <span className="text-red-700">*</span></span>
                <div className="mt-1 flex">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                    className="flex-1 min-w-0 border border-slate-400 px-3 py-2 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="px-3 border border-l-0 border-slate-400 text-slate-600 hover:bg-slate-50" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Captcha code={captcha} onRefresh={refreshCaptcha} value={captchaInput} onChange={setCaptchaInput} />
              {error && <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2" role="alert">{error}</p>}
              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={busy || lockedFor > 0} className="min-w-40">
                  {lockedFor ? `Locked (${lockedFor}s)` : busy ? 'Verifying…' : t('login')}
                </Button>
                <span className="text-sm text-slate-600">
                  New user? <Link to="/signup" className="text-navy font-semibold underline">{t('register')}</Link>
                </span>
              </div>
            </form>
          </Card>

          <Card className="border-dashed border-saffron">
            <div className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-saffron-ink">
                <Info size={16} /> Prototype demo access
              </p>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <KeyRound size={13} /> All demo accounts use the password <code className="bg-slate-100 border border-rule px-1 font-semibold">{DEMO_PASSWORD}</code>, or sign in directly:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {ROLES.map((r) => (
                  <Button key={r.value} variant="secondary" onClick={() => quickLogin(r.demoEmail)}>
                    {r.label}
                  </Button>
                ))}
              </div>
              <button type="button" onClick={resetDemoData} className="text-xs text-slate-500 hover:text-slate-800 mt-3 underline">
                Reset demo data
              </button>
            </div>
          </Card>
        </div>
      </div>
    </GovLayout>
  )
}
