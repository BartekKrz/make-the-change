/**
 * Next.js 15.3+ Client Instrumentation
 * Setup monitoring and analytics before app loads
 */

export async function register() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  // Initialize performance monitoring
  if (typeof window !== 'undefined') {
    // Client-side instrumentation
    console.log('🔧 Client instrumentation initialized')
    
    // TODO: Add your monitoring setup here
    // Examples:
    // - Sentry.init()
    // - Analytics initialization
    // - Performance monitoring
    // - Error tracking
    
    // Performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Track performance metrics
            const value = (entry as any).value || entry.duration || 0
            console.log(`📊 ${entry.name}: ${value}ms`)
          }
        })
        
        observer.observe({ 
          type: 'measure', 
          buffered: true 
        })
      } catch (error) {
        console.warn('Performance observer not available:', error)
      }
    }
  } else {
    // Server-side instrumentation
    console.log('🔧 Server instrumentation initialized')
    
    // TODO: Add server-side monitoring
    // Examples:
    // - Database connection monitoring
    // - API response time tracking
    // - Memory usage monitoring
  }
}