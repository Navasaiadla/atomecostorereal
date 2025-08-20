'use client'

import React from 'react'

interface CancelShipmentButtonProps {
	awb: string
	disabled?: boolean
}

export function CancelShipmentButton({ awb, disabled }: CancelShipmentButtonProps) {
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		const ok = window.confirm('Are you sure you want to cancel this shipment?')
		if (!ok) e.preventDefault()
	}

	return (
		<form action={`/api/shipments/${encodeURIComponent(awb)}/cancel`} method="POST" onSubmit={onSubmit}>
			<button
				className="px-3 py-1.5 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
				title="Cancel Shipment"
				type="submit"
				disabled={disabled}
			>
				Cancel Shipment
			</button>
		</form>
	)
}


