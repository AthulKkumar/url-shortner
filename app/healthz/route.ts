
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      version: '1.0',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        ok: false,
        version: '1.0',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}