// 1. Target 인터페이스 (클라이언트 기대 인터페이스)
export interface OldPaymentProcessor {
  pay(amount: number): void;
}

// 2. Adaptee (새로운 클래스, 호환 불가)
export class NewPaymentGateway {
  makePayment(value: number): void {
    console.log(`${value}원을 새 결제 게이트웨이로 처리함`);
  }
}

// 3. Adapter (Target 인터페이스 구현 + Adaptee를 내부에서 호출)
export class PaymentAdapter implements OldPaymentProcessor {
  private gateway: NewPaymentGateway;
  
  constructor(gateway: NewPaymentGateway) {
    this.gateway = gateway;
  }
  
  pay(amount: number): void {
    // 내부적으로 새로운 API 호출
    this.gateway.makePayment(amount);
  }
}

// 4. 클라이언트 코드
export function processPayment(processor: OldPaymentProcessor, amount: number) {
  processor.pay(amount);
}