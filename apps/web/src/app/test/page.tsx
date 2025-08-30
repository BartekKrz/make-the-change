import { SupabaseTest } from '../../components/SupabaseTest'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        🧪 Supabase Authentication Testing
      </h1>
      <SupabaseTest />
    </div>
  )
}
