import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-13',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Add a test function to verify the client
export async function testSanityConnection() {
  try {
    const result = await client.fetch('*[_type == "product"][0]')
    console.log('Sanity connection test successful:', result)
    return true
  } catch (error) {
    console.error('Sanity connection test failed:', error)
    return false
  }
}