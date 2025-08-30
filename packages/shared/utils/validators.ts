/**
 * Utilitaires de validation pour Make the CHANGE
 */

import { z } from 'zod';

// Validation email
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

// Validation téléphone français
export const isValidFrenchPhone = (phone: string): boolean => {
  const frenchPhoneRegex = /^(?:(?:\+33|0)[1-9])(?:[0-9]{8})$/;
  return frenchPhoneRegex.test(phone.replace(/\s/g, ''));
};

// Validation IBAN (pour SEPA selon votre doc Stripe)
export const isValidIBAN = (iban: string): boolean => {
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
  return ibanRegex.test(iban.replace(/\s/g, ''));
};

// Validation âge minimum (18 ans pour KYC)
export const isValidAge = (dateOfBirth: Date, minAge = 18): boolean => {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
};

// Validation montant d'investissement selon vos règles
export const isValidInvestmentAmount = (
  amount: number,
  minInvestment: number,
  maxInvestment?: number
): boolean => {
  if (amount < minInvestment) return false;
  if (maxInvestment && amount > maxInvestment) return false;
  return true;
};

// Validation points suffisants
export const hasEnoughPoints = (availablePoints: number, requiredPoints: number): boolean => {
  return availablePoints >= requiredPoints;
};

// Validation niveau utilisateur pour action
export const canUserPerformAction = (
  userLevel: 'EXPLORATEUR' | 'PROTECTEUR' | 'AMBASSADEUR',
  requiredLevel: 'EXPLORATEUR' | 'PROTECTEUR' | 'AMBASSADEUR'
): boolean => {
  const levels = {
    'EXPLORATEUR': 1,
    'PROTECTEUR': 2,
    'AMBASSADEUR': 3,
  };
  
  return levels[userLevel] >= levels[requiredLevel];
};

// Validation code postal français
export const isValidFrenchPostalCode = (postalCode: string): boolean => {
  const frenchPostalCodeRegex = /^[0-9]{5}$/;
  return frenchPostalCodeRegex.test(postalCode);
};
