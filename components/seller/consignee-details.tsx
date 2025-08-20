'use client'

import React, { useState } from 'react'

interface ConsigneeDetailsProps {
	name?: string | null
	phone?: string | null
	email?: string | null
	address?: string | null
	city?: string | null
	state?: string | null
	pincode?: string | null
}

function maskPhone(phone?: string | null): string {
	if (!phone) return '—'
	const digits = String(phone).replace(/\D/g, '')
	if (digits.length < 4) return '••••'
	return `••••••${digits.slice(-4)}`
}

function maskEmail(email?: string | null): string {
	if (!email) return '—'
	const [u, d] = String(email).split('@')
	if (!d) return '—'
	const head = u?.slice(0, 2) || ''
	return `${head}•••@${d}`
}

export function ConsigneeDetails({ name, phone, email, address, city, state, pincode }: ConsigneeDetailsProps) {
	const [revealed, setRevealed] = useState(false)
	const phoneOut = revealed ? (phone || '—') : maskPhone(phone)
	const emailOut = revealed ? (email || '—') : maskEmail(email)

	return (
		<div>
			<p className="text-sm font-medium text-gray-900 leading-tight">Customer</p>
			<p className="text-sm text-gray-700 leading-tight">{name || '—'}</p>
			<p className="text-xs text-gray-500 leading-tight">{phoneOut} {emailOut !== '—' ? `· ${emailOut}` : ''}</p>
			{(phone || email) && (
				<button
					onClick={() => setRevealed(v => !v)}
					className="mt-1 text-[11px] text-blue-700 hover:underline"
					type="button"
				>
					{revealed ? 'Hide contact' : 'Show contact'}
				</button>
			)}
			<div className="mt-2">
				<p className="text-sm font-medium text-gray-900 leading-tight">Address</p>
				<p className="text-sm text-gray-700 leading-tight">
					{address || '—'}{city ? `, ${city}` : ''}{state ? `, ${state}` : ''}{pincode ? ` - ${pincode}` : ''}
				</p>
			</div>
		</div>
	)
}


