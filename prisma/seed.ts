import prisma from '../lib/prisma'

async function main() {
  console.log('Testing database connection...')
  
  try {
    // Test creating a sample link
    const link = await prisma.link.create({
      data: {
        code: 'test123',
        targetUrl: 'https://example.com',
      }
    })
    
    console.log('Created test link:', link)
    
    // Clean up
    await prisma.link.delete({
      where: { id: link.id }
    })
    
    console.log('Test completed successfully!')
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()