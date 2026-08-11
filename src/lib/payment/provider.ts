/**
 * Payment Provider Interface
 * Defines the contract for all payment providers (EcoCash, etc.)
 */

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  providerTransactionId?: string;
  merchantReference?: string;
  redirectUrl?: string;
  authorizationUrl?: string;
  error?: string;
  message?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED';
  providerTransactionId?: string;
  amount?: number;
  currency?: string;
  error?: string;
  message?: string;
  completedAt?: Date;
}

export interface VerificationResult {
  valid: boolean;
  status: string;
  amountMatches: boolean;
  currencyMatches: boolean;
  merchantMatches: boolean;
  error?: string;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  error?: string;
  message?: string;
}

export interface PaymentProvider {
  name: string;
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  getPaymentStatus(providerTransactionId: string): Promise<PaymentStatusResponse>;
  verifyPayment(providerTransactionId: string, expectedAmount: number, expectedCurrency: string): Promise<VerificationResult>;
  handleWebhook?(data: any, signature?: string): Promise<void>;
  refundPayment?(request: RefundRequest): Promise<RefundResponse>;
}
