import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// Validate URL format
function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Validate short code format: 6-8 alphanumeric characters
function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code)
}

// Generate random short code (6 characters)
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET /api/links - List all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }, 
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}

// POST /api/links - Create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, code: customCode } = body

    console.log('Received request body:', body)


    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }


    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Must be a valid HTTP/HTTPS URL.' },
        { status: 400 }
      )
    }


    let code: string
    if (customCode) {

      if (!isValidCode(customCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        )
      }
      code = customCode
    } else {

      code = generateCode()

      while (await prisma.link.findUnique({ where: { code } })) {
        code = generateCode()
      }
    }

    console.log('Creating link with code:', code, 'and URL:', url)

    if (customCode) {
      const existing = await prisma.link.findUnique({ where: { code } })
      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        )
      }
    }

    const link = await prisma.link.create({
      data: {
        code,
        targetUrl: url,
      },
    })

    console.log('Created link:', link)

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    )
  }
}