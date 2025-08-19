import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function parseList(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Accept both shapes (avatar_url is ignored if provided by clients):
    // 1) { user: { id, email, user_metadata: { full_name } } }
    // 2) { user_id, email, full_name }
    const user = body?.user || {
      id: body?.user_id,
      email: body?.email,
      user_metadata: { full_name: body?.full_name },
    }

    if (!user?.id || !user?.email) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      )
    }

    const adminEmails = parseList(process.env.ADMIN_EMAILS)
    const sellerEmails = parseList(process.env.SELLER_EMAILS)
    const emailLc = String(user.email).toLowerCase()

    const desiredRole: 'admin' | 'seller' | 'customer' = adminEmails.includes(emailLc)
      ? 'admin'
      : sellerEmails.includes(emailLc)
      ? 'seller'
      : 'customer'

    const supabase = createAdminClient()

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email, role, full_name')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      // If role differs and we have a desired elevated role, update it
      if (existingProfile.role !== desiredRole) {
        const { data: updated, error: updateErr } = await supabase
          .from('profiles')
          .update({ role: desiredRole })
          .eq('id', user.id)
          .select('id, email, role')
          .single()
        if (updateErr) {
          console.error('Error updating profile role:', updateErr)
          // Do not fail auth flow; return existing
          return NextResponse.json({ message: 'Profile exists', profile: existingProfile }, { status: 200 })
        }
        return NextResponse.json({ message: 'Profile updated', profile: updated }, { status: 200 })
      }

      // Optionally refresh name if changed or missing
      const incomingFullName = user?.user_metadata?.full_name || null
      const needsMetaUpdate = (!!incomingFullName && incomingFullName !== existingProfile.full_name)
      if (needsMetaUpdate) {
        const { data: updatedMeta } = await supabase
          .from('profiles')
          .update({ full_name: incomingFullName })
          .eq('id', user.id)
          .select('id, email, role, full_name')
          .single()
        return NextResponse.json(
          { message: 'Profile metadata refreshed', profile: updatedMeta },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { message: 'Profile already exists', profile: existingProfile },
        { status: 200 }
      )
    }

    // Create new profile with mapped role
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        role: desiredRole,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 