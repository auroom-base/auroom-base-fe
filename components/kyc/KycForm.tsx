'use client'

import { useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import { useKycLevel } from '@/hooks/contracts/useIdentityRegistryV2'

interface KycFormProps {
    targetLevel: 1 | 2
    onSuccess: (txHash: string, newLevel: number) => void
}

type FormState = 'idle' | 'submitting' | 'processing' | 'success' | 'error'

const OCCUPATIONS = ['Employee', 'Self-employed', 'Business owner', 'Student', 'Other']
const INCOMES = ['< 5 juta/bulan', '5–20 juta/bulan', '20–50 juta/bulan', '> 50 juta/bulan']

export function KycForm({ targetLevel, onSuccess }: KycFormProps) {
    const { address } = useAccount()
    const { refetch } = useKycLevel()

    const [state, setState] = useState<FormState>('idle')
    const [error, setError] = useState('')

    // L1 fields
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [selfie, setSelfie] = useState<File | null>(null)

    // L2 extra fields
    const [nik, setNik] = useState('')
    const [dob, setDob] = useState('')
    const [addr, setAddr] = useState('')
    const [occupation, setOcc] = useState('')
    const [income, setIncome] = useState('')
    const [ktpPhoto, setKtp] = useState<File | null>(null)
    const [selfieId, setSelfieId] = useState<File | null>(null)

    const selfieRef = useRef<HTMLInputElement>(null)
    const ktpRef = useRef<HTMLInputElement>(null)
    const selfieIdRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!address) return

        setState('submitting')
        setError('')

        try {
            const form = new FormData()
            form.append('walletAddress', address)
            form.append('targetLevel', String(targetLevel))
            form.append('fullName', fullName)
            form.append('phone', phone)
            form.append('email', email)
            if (selfie) form.append('selfie', selfie)

            if (targetLevel === 2) {
                form.append('nik', nik)
                form.append('dob', dob)
                form.append('address', addr)
                form.append('occupation', occupation)
                form.append('income', income)
                if (ktpPhoto) form.append('ktpPhoto', ktpPhoto)
                if (selfieId) form.append('selfieWithId', selfieId)
            }

            setState('processing')
            const res = await fetch('/api/kyc/submit', { method: 'POST', body: form })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Submission failed')

            setState('success')
            refetch()
            onSuccess(data.txHash, data.newLevel)
        } catch (err: any) {
            setState('error')
            setError(err.message)
        }
    }

    const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
    const labelClass = "block text-xs text-zinc-400 mb-1.5"
    const fileClass = "w-full bg-zinc-800/50 border border-dashed border-zinc-600 rounded-xl px-4 py-3 text-zinc-400 text-sm cursor-pointer hover:border-amber-500 transition-colors text-center"

    if (state === 'success') return null // Parent handles success state

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Level 1 Fields ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Full Name *</label>
                    <input className={inputClass} placeholder="John Doe" value={fullName}
                        onChange={e => setFullName(e.target.value)} required minLength={3} />
                </div>
                <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input className={inputClass} placeholder="+6281234567890" value={phone}
                        onChange={e => setPhone(e.target.value)} required />
                </div>
            </div>

            <div>
                <label className={labelClass}>Email Address *</label>
                <input className={inputClass} type="email" placeholder="you@email.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
                <label className={labelClass}>Selfie Photo *</label>
                <div className={fileClass} onClick={() => selfieRef.current?.click()}>
                    {selfie ? `📷 ${selfie.name}` : 'Click to upload selfie (JPG/PNG, max 5MB)'}
                </div>
                <input ref={selfieRef} type="file" accept="image/jpeg,image/png" className="hidden"
                    onChange={e => setSelfie(e.target.files?.[0] ?? null)} />
            </div>

            {/* ── Level 2 Extra Fields ── */}
            {targetLevel === 2 && (
                <>
                    <hr className="border-zinc-700" />
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Enhanced KYC Details</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>NIK (ID Number) *</label>
                            <input className={inputClass} placeholder="16-digit national ID" value={nik}
                                onChange={e => setNik(e.target.value)} maxLength={16} required />
                        </div>
                        <div>
                            <label className={labelClass}>Date of Birth *</label>
                            <input className={inputClass} type="date" value={dob}
                                onChange={e => setDob(e.target.value)} required />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Full Address *</label>
                        <textarea className={`${inputClass} min-h-[80px] resize-none`}
                            placeholder="Street, City, Province, Postal Code"
                            value={addr} onChange={e => setAddr(e.target.value)} required minLength={20} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Occupation *</label>
                            <select className={inputClass} value={occupation}
                                onChange={e => setOcc(e.target.value)} required>
                                <option value="">Select occupation</option>
                                {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Monthly Income *</label>
                            <select className={inputClass} value={income}
                                onChange={e => setIncome(e.target.value)} required>
                                <option value="">Select income range</option>
                                {INCOMES.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>KTP / ID Card Photo *</label>
                            <div className={fileClass} onClick={() => ktpRef.current?.click()}>
                                {ktpPhoto ? `🪪 ${ktpPhoto.name}` : 'Upload front of KTP/ID'}
                            </div>
                            <input ref={ktpRef} type="file" accept="image/jpeg,image/png,application/pdf"
                                className="hidden" onChange={e => setKtp(e.target.files?.[0] ?? null)} />
                        </div>
                        <div>
                            <label className={labelClass}>Selfie with ID Card *</label>
                            <div className={fileClass} onClick={() => selfieIdRef.current?.click()}>
                                {selfieId ? `🤳 ${selfieId.name}` : 'Upload selfie holding your ID'}
                            </div>
                            <input ref={selfieIdRef} type="file" accept="image/jpeg,image/png"
                                className="hidden" onChange={e => setSelfieId(e.target.files?.[0] ?? null)} />
                        </div>
                    </div>
                </>
            )}

            {/* Error */}
            {state === 'error' && (
                <div className="rounded-xl bg-red-900/30 border border-red-700 px-4 py-3 text-red-300 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                disabled={state === 'submitting' || state === 'processing'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
                {state === 'submitting' && '📤 Submitting KYC...'}
                {state === 'processing' && '⛓  Setting up on-chain...'}
                {(state === 'idle' || state === 'error') && `Submit Level ${targetLevel} KYC`}
            </button>

            <p className="text-center text-xs text-zinc-600">
                This is a demo — files are accepted as-is, no real verification occurs.
            </p>
        </form>
    )
}
