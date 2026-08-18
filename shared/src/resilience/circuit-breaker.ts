// @ts-ignore
import CircuitBreaker from 'opossum';

export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  action: T,
  fallbackAction?: T,
  options?: any
): any {
  const defaultOptions = {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    ...options
  };

  const breaker = new CircuitBreaker(action, defaultOptions);

  if (fallbackAction) {
    breaker.fallback(fallbackAction);
  }

  breaker.on('open', () => console.warn(`⚠️ Circuit Breaker OPENED for ${action.name || 'action'}`));
  breaker.on('halfOpen', () => console.log(`🔄 Circuit Breaker HALF-OPEN for ${action.name || 'action'}`));
  breaker.on('close', () => console.log(`✅ Circuit Breaker CLOSED for ${action.name || 'action'}`));

  return breaker;
}
