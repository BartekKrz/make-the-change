#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configuration depuis .env.local
const SUPABASE_URL = 'https://ebmjxinsyyjwshnynwwu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWp4aW5zeXlqd3Nobnlud3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjUxOTE5MSwiZXhwIjoyMDcyMDk1MTkxfQ.dMVSLWbhJXqLtoWNX9mkWzPacN2y68mvMtkAFX72SSU';

async function resetAdminPassword() {
  console.log('🔄 Initialisation du client Supabase avec service role...');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const email = 'krynskibartosz08@gmail.com';
  const newPassword = 'BartoszDevReact8';

  try {
    console.log('🔍 Vérification de l\'existence de l\'utilisateur...');

    // Vérifier que l'utilisateur existe
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', fetchError);
      return;
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error('❌ Utilisateur non trouvé:', email);
      return;
    }

    console.log('✅ Utilisateur trouvé:', user.email, 'ID:', user.id);

    console.log('🔄 Mise à jour du mot de passe...');

    // Mettre à jour le mot de passe
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });

    if (error) {
      console.error('❌ Erreur lors de la mise à jour du mot de passe:', error);
      return;
    }

    console.log('✅ Mot de passe mis à jour avec succès!');
    console.log('📧 Email:', email);
    console.log('🔐 Nouveau mot de passe:', newPassword);
    console.log('🆔 User ID:', user.id);

    // Vérifier que la mise à jour a fonctionné
    console.log('🔄 Vérification de la mise à jour...');
    const { data: updatedUser, error: verifyError } = await supabase.auth.admin.getUserById(user.id);

    if (verifyError) {
      console.error('❌ Erreur lors de la vérification:', verifyError);
      return;
    }

    console.log('✅ Vérification terminée. Utilisateur mis à jour à:', updatedUser.user.updated_at);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

resetAdminPassword().catch(console.error);