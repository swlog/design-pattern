// Observer 인터페이스
export interface Observer {
  update(price: number): void;
}

// Subject 인터페이스
export interface Subject {
  register(observer: Observer): void;
  unregister(observer: Observer): void;
  notify(): void;
}

// Concrete Subject (주체)
export class Stock implements Subject {
  private observers: Observer[] = [];
  private price: number = 0;
  
  register(observer: Observer): void {
    this.observers.push(observer);
  }
  
  unregister(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }
  
  setPrice(newPrice: number): void {
    this.price = newPrice;
    this.notify(); // 상태 변화 시 자동 알림
  }
  
  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.price);
    }
  }
  
  getPrice(): number {
    return this.price;
  }
}

// Concrete Observers (관찰자들)
export class PriceDisplay implements Observer {
  private lastPrice: number = 0;
  
  update(price: number): void {
    this.lastPrice = price;
    console.log(`📺 화면에 표시: 현재 주가 = ${price}`);
  }
  
  getLastPrice(): number {
    return this.lastPrice;
  }
}

export class PriceAlert implements Observer {
  private lastPrice: number = 0;
  
  update(price: number): void {
    this.lastPrice = price;
    if (price > 100) {
      console.log(`🚨 알림: 주가 ${price} 초과!`);
    }
  }
  
  getLastPrice(): number {
    return this.lastPrice;
  }
}