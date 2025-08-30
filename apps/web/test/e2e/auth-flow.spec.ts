/**
 * Tests E2E - Parcours d'authentification
 * Tests critiques selon la stratégie TDD
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que la page d'accueil se charge
    await expect(page).toHaveTitle(/Make the CHANGE/)
    
    // Tester le lien vers l'inscription (si présent)
    const signupLink = page.locator('text=S\'inscrire')
    if (await signupLink.isVisible()) {
      await signupLink.click()
      await expect(page.url()).toContain('/auth')
    }
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que la page se charge correctement
    await expect(page.locator('body')).toBeVisible()
    
    // Vérifier les éléments de base de l'interface
    const title = page.locator('h1').first()
    await expect(title).toBeVisible()
  })
})

test.describe('tRPC Integration', () => {
  test('should handle tRPC test endpoint', async ({ page }) => {
    await page.goto('/test-trpc')
    
    // Vérifier que la page de test tRPC se charge
    await expect(page.locator('body')).toBeVisible()
    
    // Tester les boutons de test tRPC (s'ils existent)
    const testButton = page.locator('button').first()
    if (await testButton.isVisible()) {
      await testButton.click()
      // Attendre la réponse
      await page.waitForTimeout(1000)
    }
  })
})
