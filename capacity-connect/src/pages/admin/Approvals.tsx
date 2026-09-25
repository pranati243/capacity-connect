import { useState } from 'react'
import { Check, X, Search } from 'lucide-react'
import { Card, CardHeader, Button, Badge, Avatar, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import type { Role, UserStatus } from '../../types'

const STATUS_TONE: Record<UserStatus, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
}

export function Approvals() {
  const { users, currentUser, approveUser, rejectUser, changeUserRole } = useAppData()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all')

  const pending = users.filter((u) => u.status === 'pending')
  const visible = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (statusFilter !== 'all' && u.status !== statusFilter) return false
    const q = query.trim().toLowerCase()
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader title={`Pending approval (${pending.length})`} />
        <div className="divide-y divide-rule">
          {pending.length === 0 && <EmptyState text="All caught up — no pending registrations." />}
          {pending.map((u) => (
            <div key={u.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar name={u.name} color={u.avatarColor} />
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email} · Registered {u.joinedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Requested</span>
                <Badge tone="info">{u.role}</Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => approveUser(u.id)}>
                  <span className="flex items-center gap-1.5"><Check size={16} /> Approve</span>
                </Button>
                <Button variant="secondary" onClick={() => rejectUser(u.id)}>
                  <span className="flex items-center gap-1.5"><X size={16} /> Reject</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="All users" subtitle="Change a user's role or re-approve a rejected account" />
        <div className="p-4 flex flex-col md:flex-row gap-3 border-b border-rule">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              aria-label="Search users"
              className="w-full border border-slate-400 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)} aria-label="Filter by role" className="border border-slate-400 px-3 py-2 text-sm bg-white">
            <option value="all">All roles</option>
            <option value="trainee">Trainee</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} aria-label="Filter by status" className="border border-slate-400 px-3 py-2 text-sm bg-white">
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left border-b border-rule">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {visible.length === 0 && <tr><td colSpan={5}><EmptyState text="No users match." /></td></tr>}
              {visible.map((u) => {
                const isSelf = u.id === currentUser?.id
                return (
                  <tr key={u.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.avatarColor} size={30} />
                        <div>
                          <p className="font-medium text-slate-800">{u.name}{isSelf && <span className="text-slate-400 font-normal"> (you)</span>}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{u.joinedAt}</td>
                    <td className="px-5 py-3"><Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge></td>
                    <td className="px-5 py-3">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                        aria-label={`Role for ${u.name}`}
                        className="border border-slate-400 px-2 py-1 text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="trainee">Trainee</option>
                        <option value="trainer">Trainer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.status !== 'approved' && (
                        <Button variant="ghost" onClick={() => approveUser(u.id)}>Approve</Button>
                      )}
                      {u.status === 'approved' && !isSelf && (
                        <Button variant="ghost" onClick={() => rejectUser(u.id)}>Revoke</Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
