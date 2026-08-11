/**
 * EcoCash SMS Parser
 * 
 * Parses EcoCash transaction confirmation SMS messages
 * Configurable pattern matching for different SMS formats
 */

export interface ParsedEcoCashTransaction {
  transactionReference: string;
  amount: number;
  currency: string;
  senderPhone: string;
  merchantNumber: string;
  merchantName?: string;
  transactionDate: Date;
  transactionTime: string;
  rawMessage: string;
}

export interface ParseResult {
  success: boolean;
  transaction?: ParsedEcoCashTransaction;
  error?: string;
}

export class EcoCashSmsParser {
  /**
   * Parse an EcoCash SMS message
   * 
   * Example SMS formats (configurable):
   * "You have received $850.00 from 0771234567. Ref: EC123456789. Merchant: iPhone Hub"
   * "EcoCash: Transfer of $850.00 from 0771234567 completed. Ref: EC123456789"
   */
  static parseSms(rawMessage: string): ParseResult {
    try {
      // Remove extra whitespace
      const message = rawMessage.trim();
      
      // Try different parsing patterns
      const parsers = [
        this.parseFormat1,
        this.parseFormat2,
        this.parseFormat3,
      ];
      
      for (const parser of parsers) {
        const result = parser(message);
        if (result.success && result.transaction) {
          return result;
        }
      }
      
      return {
        success: false,
        error: 'Unable to parse SMS message. Unknown format.',
      };
    } catch (error) {
      return {
        success: false,
        error: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Format 1: "You have received $850.00 from 0771234567. Ref: EC123456789. Merchant: iPhone Hub"
   */
  private static parseFormat1(message: string): ParseResult {
    // Pattern: Amount from phone. Ref: reference. Merchant: name
    const amountPattern = /\$?(\d+\.?\d*)/;
    const phonePattern = /from\s+(\d{10,15})/i;
    const refPattern = /ref:\s*([a-zA-Z0-9]+)/i;
    const merchantPattern = /merchant:\s*([^\n.]+)/i;
    
    const amountMatch = message.match(amountPattern);
    const phoneMatch = message.match(phonePattern);
    const refMatch = message.match(refPattern);
    const merchantMatch = message.match(merchantPattern);
    
    if (!amountMatch || !phoneMatch || !refMatch) {
      return { success: false };
    }
    
    const transaction: ParsedEcoCashTransaction = {
      transactionReference: refMatch[1],
      amount: parseFloat(amountMatch[1]),
      currency: 'USD',
      senderPhone: phoneMatch[1],
      merchantNumber: '', // Will be set from config
      merchantName: merchantMatch ? merchantMatch[1].trim() : undefined,
      transactionDate: new Date(),
      transactionTime: new Date().toLocaleTimeString(),
      rawMessage: message,
    };
    
    return { success: true, transaction };
  }
  
  /**
   * Format 2: "EcoCash: Transfer of $850.00 from 0771234567 completed. Ref: EC123456789"
   */
  private static parseFormat2(message: string): ParseResult {
    const amountPattern = /transfer of\s+\$?(\d+\.?\d*)/i;
    const phonePattern = /from\s+(\d{10,15})/i;
    const refPattern = /ref:\s*([a-zA-Z0-9]+)/i;
    
    const amountMatch = message.match(amountPattern);
    const phoneMatch = message.match(phonePattern);
    const refMatch = message.match(refPattern);
    
    if (!amountMatch || !phoneMatch || !refMatch) {
      return { success: false };
    }
    
    const transaction: ParsedEcoCashTransaction = {
      transactionReference: refMatch[1],
      amount: parseFloat(amountMatch[1]),
      currency: 'USD',
      senderPhone: phoneMatch[1],
      merchantNumber: '',
      transactionDate: new Date(),
      transactionTime: new Date().toLocaleTimeString(),
      rawMessage: message,
    };
    
    return { success: true, transaction };
  }
  
  /**
   * Format 3: Generic fallback with configurable patterns
   * This can be extended with actual production SMS formats
   */
  private static parseFormat3(message: string): ParseResult {
    // Generic pattern: Look for common EcoCash keywords
    if (!message.toLowerCase().includes('ecocash') && 
        !message.toLowerCase().includes('received') &&
        !message.toLowerCase().includes('transfer')) {
      return { success: false };
    }
    
    // Try to extract reference number (usually alphanumeric)
    const refPattern = /(?:ref|reference|transaction|tx):?\s*([a-zA-Z0-9]{6,20})/i;
    const refMatch = message.match(refPattern);
    
    // Try to extract amount
    const amountPattern = /\$?(\d+\.?\d*)/;
    const amountMatch = message.match(amountPattern);
    
    // Try to extract phone number
    const phonePattern = /(\d{10,15})/;
    const phoneMatch = message.match(phonePattern);
    
    if (!refMatch) {
      return { success: false, error: 'Could not extract transaction reference' };
    }
    
    const transaction: ParsedEcoCashTransaction = {
      transactionReference: refMatch[1],
      amount: amountMatch ? parseFloat(amountMatch[1]) : 0,
      currency: 'USD',
      senderPhone: phoneMatch ? phoneMatch[1] : '',
      merchantNumber: '',
      transactionDate: new Date(),
      transactionTime: new Date().toLocaleTimeString(),
      rawMessage: message,
    };
    
    return { success: true, transaction };
  }
  
  /**
   * Validate parsed transaction
   */
  static validateTransaction(transaction: ParsedEcoCashTransaction): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!transaction.transactionReference || transaction.transactionReference.length < 6) {
      errors.push('Invalid transaction reference');
    }
    
    if (transaction.amount <= 0 || transaction.amount > 100000) {
      errors.push('Invalid amount');
    }
    
    if (!transaction.senderPhone || transaction.senderPhone.length < 10) {
      errors.push('Invalid sender phone number');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
