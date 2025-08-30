# KYC Service - Make the CHANGE

**🔐 Service:** `KYCService` | **📍 Priority:** ⭐️⭐️⭐️ CRITICAL | **🗓️ Week:** 1-2

## Overview

Complete Know Your Customer (KYC) service integrating Stripe Identity for compliance with EU regulations. Handles progressive verification levels based on transaction thresholds and maintains audit trails for regulatory requirements.

## 🏗️ Service Architecture

### Core Components
```typescript
interface KYCService {
  identity: IdentityVerification
  compliance: ComplianceEngine
  thresholds: ThresholdManager
  audit: AuditTrail
  notifications: KYCNotifications
}

interface IdentityVerification {
  initiateVerification(userId: string, level: KYCLevel): Promise<VerificationSession>
  processVerificationResult(sessionId: string, result: VerificationResult): Promise<KYCUpdate>
  getVerificationStatus(userId: string): Promise<KYCStatus>
  retryVerification(userId: string, level: KYCLevel): Promise<VerificationSession>
}

interface ComplianceEngine {
  checkTransactionThreshold(userId: string, amount: number): Promise<KYCRequirement>
  validateDocuments(documents: Document[]): Promise<DocumentValidation>
  performAMLCheck(userData: UserData): Promise<AMLResult>
  generateComplianceReport(userId: string): Promise<ComplianceReport>
}
```

## 🔐 KYC Levels Implementation

### Threshold Configuration
```typescript
export const KYC_THRESHOLDS = {
  BASIC: {
    maxAmount: 99, // €0-99
    verification: 'email_only',
    requirements: ['email_verification'],
    timeLimit: 'immediate',
  },
  
  LIGHT: {
    maxAmount: 999, // €100-999
    verification: 'identity_basic',
    requirements: ['full_name', 'date_of_birth', 'address'],
    timeLimit: '5_minutes',
    stripeIdentityLevel: 'light',
  },
  
  COMPLETE: {
    maxAmount: 'unlimited', // €1000+
    verification: 'identity_full',
    requirements: [
      'government_id', 
      'selfie_verification', 
      'proof_of_address',
      'aml_screening'
    ],
    timeLimit: '24_hours',
    stripeIdentityLevel: 'full',
  }
} as const

export type KYCLevel = keyof typeof KYC_THRESHOLDS
export type KYCStatus = 'pending' | 'light' | 'complete' | 'failed' | 'expired'
```

## 🔧 Business Logic Implementation

### Initiate KYC Verification
```typescript
export async function initiateKyc(
  input: { level: KYCLevel },
  ctx: Context
): Promise<{ success: boolean; sessionUrl?: string }> {
  const { level } = input
  const userId = ctx.user.id
  
  // 1. Check current KYC status
  const currentStatus = await ctx.db.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true, kycLevel: true }
  })
  
  if (!currentStatus) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
  }
  
  // 2. Check if already verified at this level or higher
  const currentLevel = getKYCLevelNumber(currentStatus.kycStatus)
  const requestedLevel = getKYCLevelNumber(level)
  
  if (currentLevel >= requestedLevel) {
    return {
      success: true,
      message: 'Already verified at this level or higher'
    }
  }
  
  // 3. Create Stripe Identity Verification Session
  const verificationSession = await ctx.stripe.identity.verificationSessions.create({
    type: level === 'light' ? 'document' : 'id_number',
    metadata: {
      userId,
      level,
      timestamp: Date.now().toString(),
    },
    options: {
      document: level === 'complete' ? {
        allowed_types: ['passport', 'id_card', 'driving_license'],
        require_id_number: true,
        require_live_capture: true,
        require_matching_selfie: true,
      } : {
        allowed_types: ['passport', 'id_card'],
        require_id_number: false,
        require_live_capture: false,
      }
    },
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/kyc/result?session_id={VERIFICATION_SESSION_ID}`,
  })
  
  // 4. Update user status to pending verification
  await ctx.db.user.update({
    where: { id: userId },
    data: {
      kycStatus: 'pending',
      updatedAt: new Date(),
    }
  })
  
  // 5. Create audit trail
  await ctx.db.auditLog.create({
    data: {
      tableName: 'users',
      recordId: userId,
      action: 'KYC_INITIATED',
      newValues: { level, sessionId: verificationSession.id },
      userId,
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
    }
  })
  
  // 6. Track analytics
  await ctx.analytics.track('kyc_initiated', {
    userId,
    level,
    sessionId: verificationSession.id,
  })
  
  return {
    success: true,
    sessionUrl: verificationSession.url,
  }
}
```

### Process KYC Webhook Result
```typescript
export async function processKycResult(
  input: { sessionId: string; event: string },
  ctx: Context
): Promise<{ success: boolean }> {
  const { sessionId, event } = input
  
  // 1. Retrieve verification session from Stripe
  const verificationSession = await ctx.stripe.identity.verificationSessions.retrieve(sessionId)
  
  if (!verificationSession.metadata?.userId) {
    throw new TRPCError({ 
      code: 'BAD_REQUEST', 
      message: 'Invalid verification session' 
    })
  }
  
  const userId = verificationSession.metadata.userId
  const level = verificationSession.metadata.level as KYCLevel
  
  // 2. Process verification result
  let newKycStatus: KYCStatus
  let newKycLevel: number
  
  switch (verificationSession.status) {
    case 'verified':
      newKycStatus = level === 'light' ? 'light' : 'complete'
      newKycLevel = level === 'light' ? 1 : 2
      break
      
    case 'requires_input':
      // User needs to provide additional information
      newKycStatus = 'pending'
      newKycLevel = 0
      break
      
    case 'canceled':
    case 'processing':
      // Keep current status, don't update
      return { success: true }
      
    default:
      newKycStatus = 'failed'
      newKycLevel = 0
  }
  
  // 3. Update user KYC status
  const updatedUser = await ctx.db.user.update({
    where: { id: userId },
    data: {
      kycStatus: newKycStatus,
      kycLevel: newKycLevel,
      updatedAt: new Date(),
    }
  })
  
  // 4. Create audit trail
  await ctx.db.auditLog.create({
    data: {
      tableName: 'users',
      recordId: userId,
      action: `KYC_${verificationSession.status.toUpperCase()}`,
      oldValues: { kycStatus: ctx.user.kycStatus },
      newValues: { 
        kycStatus: newKycStatus, 
        kycLevel: newKycLevel,
        sessionId,
        verificationDetails: verificationSession.verified_outputs 
      },
      userId,
    }
  })
  
  // 5. Send notification to user
  if (newKycStatus === 'light' || newKycStatus === 'complete') {
    await ctx.notificationService.sendKYCSuccess({
      userId,
      level: newKycStatus,
      newLimits: KYC_THRESHOLDS[level.toUpperCase()].maxAmount,
    })
  } else if (newKycStatus === 'failed') {
    await ctx.notificationService.sendKYCFailed({
      userId,
      reason: verificationSession.last_error?.reason || 'verification_failed',
      retryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/profile/verification`,
    })
  }
  
  // 6. Track analytics
  await ctx.analytics.track('kyc_processed', {
    userId,
    level,
    status: newKycStatus,
    sessionId,
    processingTime: Date.now() - parseInt(verificationSession.metadata.timestamp),
  })
  
  return { success: true }
}
```

### KYC Status Check
```typescript
export async function getKycStatus(
  userId: string,
  ctx: Context
): Promise<KYCStatusResponse> {
  const user = await ctx.db.user.findUnique({
    where: { id: userId },
    select: {
      kycStatus: true,
      kycLevel: true,
      updatedAt: true,
    }
  })
  
  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
  }
  
  const currentThreshold = getCurrentThreshold(user.kycStatus)
  const nextThreshold = getNextThreshold(user.kycStatus)
  
  return {
    status: user.kycStatus,
    level: user.kycLevel,
    currentLimits: {
      maxInvestment: currentThreshold.maxAmount,
      maxWithdrawal: Math.floor(currentThreshold.maxAmount * 0.5),
    },
    nextLevelRequirements: nextThreshold ? {
      level: nextThreshold.verification,
      requirements: nextThreshold.requirements,
      maxAmount: nextThreshold.maxAmount,
    } : null,
    lastUpdated: user.updatedAt,
  }
}
```

## 🔒 Compliance & Security

### EU Regulatory Requirements
```typescript
export const EU_COMPLIANCE_REQUIREMENTS = {
  AMLD5: {
    description: 'Anti-Money Laundering Directive 5',
    requirements: [
      'customer_identification',
      'beneficial_ownership_verification',
      'ongoing_monitoring',
      'record_keeping_5_years',
    ]
  },
  
  PSD2: {
    description: 'Payment Services Directive 2',
    requirements: [
      'strong_customer_authentication',
      'transaction_monitoring',
      'fraud_prevention',
    ]
  },
  
  GDPR: {
    description: 'General Data Protection Regulation',
    requirements: [
      'explicit_consent',
      'data_minimization',
      'right_to_erasure',
      'data_portability',
    ]
  }
} as const
```

### Data Retention Policy
```typescript
export const KYC_DATA_RETENTION = {
  verificationDocuments: '5_years_post_relationship',
  auditTrail: '7_years_minimum',
  biometricData: 'immediate_deletion_post_verification',
  personalData: '5_years_or_user_deletion_request',
  
  // Auto-cleanup implementation
  scheduleDataCleanup: async (userId: string) => {
    const retentionDate = new Date()
    retentionDate.setFullYear(retentionDate.getFullYear() + 5)
    
    await scheduleJob('kyc_data_cleanup', {
      userId,
      executeAt: retentionDate,
      action: 'delete_kyc_data',
    })
  }
}
```

## 🚨 Error Handling

### KYC Error Codes
```typescript
export const KYC_ERROR_CODES = {
  // Verification errors
  VERIFICATION_FAILED: 'Identity verification failed',
  DOCUMENT_INVALID: 'Provided documents are invalid or unreadable',
  DOCUMENT_EXPIRED: 'Provided documents have expired',
  SELFIE_MISMATCH: 'Selfie does not match provided ID',
  
  // Process errors
  SESSION_EXPIRED: 'Verification session has expired',
  SESSION_NOT_FOUND: 'Verification session not found',
  ALREADY_VERIFIED: 'User already verified at this level',
  
  // Threshold errors
  THRESHOLD_EXCEEDED: 'Transaction amount exceeds current KYC limit',
  VERIFICATION_REQUIRED: 'Higher KYC level required for this transaction',
  
  // Service errors
  STRIPE_IDENTITY_ERROR: 'Identity verification service temporarily unavailable',
  RATE_LIMIT_EXCEEDED: 'Too many verification attempts',
} as const
```

## 📊 Analytics & Monitoring

### KYC Metrics
```typescript
interface KYCMetrics {
  verification: {
    initiationRate: number // % users who start verification when prompted
    completionRate: number // % users who complete verification
    successRate: number // % verifications that succeed
    averageCompletionTime: number // minutes
  }
  
  compliance: {
    thresholdBreaches: number // transactions blocked due to KYC limits
    documentRejectionRate: number // % documents rejected
    manualReviewRate: number // % requiring manual review
    appealSuccessRate: number // % successful appeals
  }
  
  business: {
    conversionImpact: number // % revenue lost due to KYC friction
    retentionImpact: number // % users retained post-verification
    upgradeRate: number // % users upgrading limits after verification
  }
}
```

## 🔄 Workflow Integration

### Transaction Threshold Check
```typescript
export async function checkKYCRequirement(
  userId: string,
  transactionAmount: number,
  transactionType: 'investment' | 'subscription' | 'withdrawal'
): Promise<KYCRequirement> {
  const user = await getUserKYCStatus(userId)
  const currentLimit = KYC_THRESHOLDS[user.kycStatus.toUpperCase()].maxAmount
  
  if (transactionAmount <= currentLimit) {
    return {
      required: false,
      currentLevel: user.kycStatus,
      currentLimit,
    }
  }
  
  const requiredLevel = transactionAmount <= 999 ? 'light' : 'complete'
  
  return {
    required: true,
    currentLevel: user.kycStatus,
    currentLimit,
    requiredLevel,
    requiredBy: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h grace period
    blockTransaction: transactionAmount > currentLimit * 1.1, // 10% grace
  }
}
```

### Auto-Verification Triggers
```typescript
export async function triggerKYCIfNeeded(
  userId: string, 
  plannedAmount: number
): Promise<KYCTriggerResult> {
  const requirement = await checkKYCRequirement(userId, plannedAmount, 'investment')
  
  if (requirement.required) {
    // Auto-suggest KYC upgrade
    await ctx.notificationService.sendKYCUpgradePrompt({
      userId,
      currentLimit: requirement.currentLimit,
      requiredLevel: requirement.requiredLevel,
      plannedAmount,
      upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/profile/verification?level=${requirement.requiredLevel}`,
    })
    
    return {
      triggered: true,
      level: requirement.requiredLevel,
      reason: 'transaction_threshold_exceeded',
    }
  }
  
  return { triggered: false }
}
```

## 🗄️ Database Integration

### KYC Tables Extension
```sql
-- KYC verification sessions tracking
CREATE TABLE kyc_verification_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
    level VARCHAR(20) NOT NULL, -- 'light', 'complete'
    status VARCHAR(20) DEFAULT 'pending', -- pending, verified, failed, expired
    initiated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verification_data JSONB DEFAULT '{}', -- Stripe verification outputs
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- KYC compliance audit trail
CREATE TABLE kyc_compliance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- verification_initiated, document_uploaded, verification_completed
    event_data JSONB NOT NULL,
    compliance_level VARCHAR(20) NOT NULL,
    risk_score DECIMAL(3,2), -- 0.00-1.00 risk assessment
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_kyc_sessions_user ON kyc_verification_sessions(user_id, status);
CREATE INDEX idx_kyc_sessions_stripe ON kyc_verification_sessions(stripe_session_id);
CREATE INDEX idx_kyc_compliance_user ON kyc_compliance_events(user_id, created_at DESC);
CREATE INDEX idx_kyc_compliance_type ON kyc_compliance_events(event_type, created_at DESC);
```

## 🚨 Error Recovery & Resilience

### Retry Logic
```typescript
export async function retryFailedVerification(
  userId: string,
  sessionId: string
): Promise<RetryResult> {
  const session = await ctx.db.kycVerificationSession.findUnique({
    where: { stripeSessionId: sessionId, userId }
  })
  
  if (!session || session.retryCount >= 3) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Maximum retry attempts exceeded'
    })
  }
  
  // Create new verification session
  const newSession = await initiateKyc({ level: session.level }, ctx)
  
  // Update retry count
  await ctx.db.kycVerificationSession.update({
    where: { id: session.id },
    data: { retryCount: session.retryCount + 1 }
  })
  
  return {
    success: true,
    newSessionUrl: newSession.sessionUrl,
    remainingRetries: 3 - session.retryCount - 1,
  }
}
```

## ✅ Testing Strategy

### Unit Tests
```typescript
describe('KYC Service', () => {
  describe('initiateKyc', () => {
    it('should create light verification session', async () => {
      const result = await kycService.initiateKyc({ level: 'light' }, mockContext)
      expect(result.success).toBe(true)
      expect(result.sessionUrl).toContain('verify.stripe.com')
    })
    
    it('should prevent duplicate verification for same level', async () => {
      mockContext.user.kycStatus = 'light'
      const result = await kycService.initiateKyc({ level: 'light' }, mockContext)
      expect(result.success).toBe(true)
      expect(result.sessionUrl).toBeUndefined()
    })
  })
  
  describe('processKycResult', () => {
    it('should update user status on successful verification', async () => {
      const mockSession = createMockVerificationSession({ status: 'verified' })
      mockStripe.identity.verificationSessions.retrieve.mockResolvedValue(mockSession)
      
      const result = await kycService.processKycResult({
        sessionId: 'vs_123',
        event: 'identity.verification_session.verified'
      }, mockContext)
      
      expect(result.success).toBe(true)
      expect(mockContext.db.user.update).toHaveBeenCalledWith({
        where: { id: mockSession.metadata.userId },
        data: expect.objectContaining({
          kycStatus: 'light',
          kycLevel: 1,
        })
      })
    })
  })
  
  describe('checkKYCRequirement', () => {
    it('should require light KYC for €500 investment', async () => {
      mockContext.user.kycStatus = 'pending'
      const result = await checkKYCRequirement('user_123', 500, 'investment')
      
      expect(result.required).toBe(true)
      expect(result.requiredLevel).toBe('light')
    })
    
    it('should allow €50 investment without KYC', async () => {
      const result = await checkKYCRequirement('user_123', 50, 'investment')
      expect(result.required).toBe(false)
    })
  })
})
```

### Integration Tests
```typescript
describe('KYC Integration', () => {
  it('should complete full KYC verification flow', async () => {
    // 1. Initiate verification
    const initiateResult = await testClient.users.kyc.initiate.mutate({ level: 'light' })
    expect(initiateResult.success).toBe(true)
    
    // 2. Simulate Stripe webhook
    const webhookResult = await testClient.users.kyc.process.mutate({
      sessionId: 'vs_test_123',
      event: 'identity.verification_session.verified'
    })
    expect(webhookResult.success).toBe(true)
    
    // 3. Verify status updated
    const statusResult = await testClient.users.kyc.status.query()
    expect(statusResult.status).toBe('light')
  })
})
```

## 🔗 Dependencies

### External Services
- **Stripe Identity** - Primary verification provider
- **Notification Service** - KYC status updates
- **Analytics Service** - Compliance tracking
- **Audit Service** - Regulatory trail

### Internal Dependencies
- User management system
- Transaction monitoring
- Risk assessment engine
- Compliance reporting

---

**⚡ Implementation Priority:** CRITICAL - Legal compliance required
**🧪 Test Coverage Target:** 98% - Regulatory compliance critical
**📈 Performance Target:** <500ms P95 verification initiation
**🔒 Security Level:** Maximum - Identity verification foundation
**⚖️ Compliance:** EU AMLD5, PSD2, GDPR compliant
