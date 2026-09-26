import { Medallion } from '../ui'
import { subjectIcon } from '../../lib/subjects'
import { subjectPhoto } from '../../lib/photos'

export function SubjectCover({
  subject,
  className = '',
  medallionSize = 34,
  vertical = false,
}: {
  subject: string
  className?: string
  medallionSize?: number
  vertical?: boolean
}) {
  const photo = subjectPhoto(subject)
  const layout = vertical ? 'flex md:flex-col items-center md:justify-center gap-3' : 'flex items-center gap-3'
  const label = 'text-[0.7rem] font-bold uppercase tracking-wide leading-tight'

  if (!photo) {
    return (
      <div className={`${layout} px-4 py-3 bg-navy-50 ${className}`}>
        <Medallion icon={subjectIcon(subject)} size={medallionSize} />
        <p className={`${label} text-slate-600 ${vertical ? 'md:text-center' : ''}`}>{subject}</p>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-navy ${className}`}>
      <img src={photo.src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/45 to-navy/5" aria-hidden="true" />
      <div className={`relative h-full flex gap-3 px-4 py-3 ${vertical ? 'items-center md:flex-col md:justify-end' : 'items-end'}`}>
        <Medallion icon={subjectIcon(subject)} size={medallionSize} />
        <p className={`${label} text-white ${vertical ? 'md:text-center' : ''}`}>{subject}</p>
      </div>
    </div>
  )
}
