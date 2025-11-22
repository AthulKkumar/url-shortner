// Redirect Route Handler for /:code
// This handles the actual URL shortening redirect

import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

// GET /:code - Redirect to original URL
export async function GET(request, { params }) {
    try {
        const { code } = await params

        // Validate code format (6-8 alphanumeric)
        if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
            return NextResponse.json(
                { error: 'Invalid code format' },
                { status: 404 }
            )
        }

        const link = await prisma.link.findUnique({
            where: { code },
        })


        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            )
        }


        await prisma.link.update({
            where: { code },
            data: {
                clicks: { increment: 1 },
                lastClicked: new Date(),
            },
        })


        return NextResponse.redirect(link.targetUrl, 302)
    } catch (error) {
        console.error('Redirect error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}