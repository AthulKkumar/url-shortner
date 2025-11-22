import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

// ADD THIS LINE - Forces runtime rendering, not build-time
export const dynamic = 'force-dynamic'

// GET /api/links/:code - Get stats for a single link
export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { code } = params

    const link = await prisma.link.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        targetUrl: true,
        clicks: true,
        lastClicked: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error fetching link:', error)
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 }
    )
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(request: NextRequest, { params }: { params: any }) {
  try {
    const { code } = params

    const existing = await prisma.link.findUnique({ where: { code } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    await prisma.link.delete({ where: { code } })

    return NextResponse.json(
      { message: 'Link deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    )
  }
}