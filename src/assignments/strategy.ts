// Strategy Pattern (행위 패턴)
// 실행 중에 알고리즘을 선택할 수 있게 하는 패턴

export interface PaymentStrategy {
  pay(amount: number): string;
  getName(): string;
  getIcon(): string;
}

export class CreditCardStrategy implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cardHolder: string
  ) {}

  pay(amount: number): string {
    const masked = this.cardNumber.slice(-4).padStart(this.cardNumber.length, '*');
    return `💳 신용카드 (${masked})로 ${amount.toLocaleString()}원 결제 완료\n카드 소유자: ${this.cardHolder}`;
  }

  getName(): string {
    return '신용카드';
  }

  getIcon(): string {
    return '💳';
  }
}

export class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): string {
    return `🅿️ PayPal (${this.email})로 ${amount.toLocaleString()}원 결제 완료`;
  }

  getName(): string {
    return 'PayPal';
  }

  getIcon(): string {
    return '🅿️';
  }
}

export class BankTransferStrategy implements PaymentStrategy {
  constructor(
    private bankName: string,
    private accountNumber: string
  ) {}

  pay(amount: number): string {
    const masked = this.accountNumber.slice(-4).padStart(this.accountNumber.length, '*');
    return `🏦 ${this.bankName} 계좌 (${masked})로 ${amount.toLocaleString()}원 이체 완료`;
  }

  getName(): string {
    return '계좌이체';
  }

  getIcon(): string {
    return '🏦';
  }
}

export class CryptoStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): string {
    const masked = this.walletAddress.substring(0, 6) + '...' + this.walletAddress.slice(-4);
    return `₿ 암호화폐 지갑 (${masked})으로 ${amount.toLocaleString()}원 상당 결제 완료`;
  }

  getName(): string {
    return '암호화폐';
  }

  getIcon(): string {
    return '₿';
  }
}

// Context
export class PaymentContext {
  private strategy?: PaymentStrategy;

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  executePayment(amount: number): string {
    if (!this.strategy) {
      throw new Error('결제 방법을 선택해주세요.');
    }
    return this.strategy.pay(amount);
  }

  getCurrentStrategy(): PaymentStrategy | undefined {
    return this.strategy;
  }
}