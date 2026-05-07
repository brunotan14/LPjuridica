/**
 * Seed inicial — cria escritório do Dr. Leandro + usuário Titular.
 * Executar: npx tsx scripts/seed.ts
 * Requer: SUPABASE_SERVICE_ROLE_KEY no .env.local
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('🌱 Iniciando seed...')

  // TODO M2: criar escritório e usuário Titular após migrations do Supabase

  console.log('✅ Seed concluído.')
}

seed().catch(console.error)
