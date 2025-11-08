<template>
  <div class="pattern-container">
    <div class="pattern-header">
      <h2>💳 Strategy Pattern (행위 패턴)</h2>
      <p class="description">실행 중에 알고리즘(결제 방법)을 선택할 수 있게 하는 패턴</p>
    </div>

    <div class="content-grid">
      <!-- 상품 선택 -->
      <div class="product-section">
        <h3>🛍️ 상품 선택</h3>
        <div class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
            :class="{ selected: selectedProduct?.id === product.id }"
            @click="selectedProduct = product"
          >
            <div class="product-icon">{{ product.icon }}</div>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">{{ product.price.toLocaleString() }}원</div>
          </div>
        </div>
      </div>

      <!-- 결제 방법 선택 -->
      <div class="payment-section" v-if="selectedProduct">
        <h3>💰 결제 방법 선택</h3>
        <div class="payment-methods">
          <div 
            v-for="method in paymentMethods" 
            :key="method.type"
            class="payment-method"
            :class="{ selected: selectedMethod === method.type }"
            @click="selectPaymentMethod(method.type)"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>

        <!-- 결제 정보 입력 -->
        <div class="payment-form" v-if="selectedMethod">
          <div v-if="selectedMethod === 'credit'" class="form-group">
            <label>카드 번호</label>
            <input v-model="creditCard.number" type="text" placeholder="1234-5678-9012-3456" />
            <label>카드 소유자</label>
            <input v-model="creditCard.holder" type="text" placeholder="홍길동" />
          </div>

          <div v-if="selectedMethod === 'paypal'" class="form-group">
            <label>PayPal 이메일</label>
            <input v-model="paypal.email" type="email" placeholder="email@example.com" />
          </div>

          <div v-if="selectedMethod === 'bank'" class="form-group">
            <label>은행명</label>
            <input v-model="bank.name" type="text" placeholder="국민은행" />
            <label>계좌번호</label>
            <input v-model="bank.account" type="text" placeholder="123-456-789012" />
          </div>

          <div v-if="selectedMethod === 'crypto'" class="form-group">
            <label>지갑 주소</label>
            <input v-model="crypto.wallet" type="text" placeholder="0x1234...abcd" />
          </div>

          <button @click="processPayment" class="pay-btn">
            {{ selectedProduct.price.toLocaleString() }}원 결제하기
          </button>
        </div>
      </div>

      <!-- 결제 결과 -->
      <div class="result-section" v-if="paymentResult">
        <h3>✅ 결제 완료</h3>
        <div class="result-box">
          <div class="result-product">
            <span class="result-icon">{{ selectedProduct?.icon }}</span>
            <span class="result-name">{{ selectedProduct?.name }}</span>
          </div>
          <div class="result-details">
            {{ paymentResult }}
          </div>
          <div class="result-time">{{ paymentTime }}</div>
        </div>
        <button @click="resetPayment" class="reset-btn">새로운 결제</button>
      </div>

      <!-- 에러 -->
      <div class="error-section" v-if="error">
        <p class="error-message">❌ {{ error }}</p>
      </div>

      <!-- 결제 내역 -->
      <div class="history-section" v-if="paymentHistory.length > 0">
        <h3>📜 결제 내역</h3>
        <div class="history-list">
          <div v-for="(item, index) in paymentHistory" :key="index" class="history-item">
            <div class="history-header">
              <span class="history-product">{{ item.product }}</span>
              <span class="history-amount">{{ item.amount.toLocaleString() }}원</span>
            </div>
            <div class="history-method">{{ item.method }}</div>
            <div class="history-time">{{ item.time }}</div>
          </div>
        </div>
      </div>

      <!-- 설명 -->
      <div class="info-section">
        <h3>ℹ️ Strategy 패턴 특징</h3>
        <ul>
          <li>✅ <strong>알고리즘 캡슐화:</strong> 각 결제 방법이 독립적인 전략 객체</li>
          <li>✅ <strong>런타임 교체:</strong> 실행 중 원하는 결제 방법으로 변경 가능</li>
          <li>✅ <strong>개방-폐쇄 원칙:</strong> 새로운 결제 방법 추가가 쉬움</li>
          <li>✅ <strong>조건문 제거:</strong> if-else 대신 전략 객체 사용</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  PaymentContext,
  CreditCardStrategy,
  PayPalStrategy,
  BankTransferStrategy,
  CryptoStrategy
} from '@/assignments/strategy';

interface Product {
  id: number;
  name: string;
  price: number;
  icon: string;
}

const products: Product[] = [
  { id: 1, name: '노트북', price: 1500000, icon: '💻' },
  { id: 2, name: '스마트폰', price: 1200000, icon: '📱' },
  { id: 3, name: '태블릿', price: 800000, icon: '📱' },
  { id: 4, name: '무선 이어폰', price: 300000, icon: '🎧' },
  { id: 5, name: '스마트워치', price: 450000, icon: '⌚' },
  { id: 6, name: '게이밍 키보드', price: 250000, icon: '⌨️' }
];

const paymentMethods = [
  { type: 'credit', name: '신용카드', icon: '💳' },
  { type: 'paypal', name: 'PayPal', icon: '🅿️' },
  { type: 'bank', name: '계좌이체', icon: '🏦' },
  { type: 'crypto', name: '암호화폐', icon: '₿' }
];

const paymentContext = new PaymentContext();

const selectedProduct = ref<Product | null>(null);
const selectedMethod = ref<string>('');
const paymentResult = ref<string>('');
const paymentTime = ref<string>('');
const error = ref<string>('');

const creditCard = ref({ number: '', holder: '' });
const paypal = ref({ email: '' });
const bank = ref({ name: '', account: '' });
const crypto = ref({ wallet: '' });

const paymentHistory = ref<Array<{
  product: string;
  amount: number;
  method: string;
  time: string;
}>>([]);

const selectPaymentMethod = (method: string) => {
  selectedMethod.value = method;
  error.value = '';
};

const processPayment = () => {
  if (!selectedProduct.value) {
    error.value = '상품을 선택해주세요.';
    return;
  }

  error.value = '';

  try {
    switch (selectedMethod.value) {
      case 'credit':
        if (!creditCard.value.number || !creditCard.value.holder) {
          throw new Error('카드 정보를 모두 입력해주세요.');
        }
        paymentContext.setStrategy(
          new CreditCardStrategy(creditCard.value.number, creditCard.value.holder)
        );
        break;
      case 'paypal':
        if (!paypal.value.email) {
          throw new Error('PayPal 이메일을 입력해주세요.');
        }
        paymentContext.setStrategy(new PayPalStrategy(paypal.value.email));
        break;
      case 'bank':
        if (!bank.value.name || !bank.value.account) {
          throw new Error('은행 정보를 모두 입력해주세요.');
        }
        paymentContext.setStrategy(
          new BankTransferStrategy(bank.value.name, bank.value.account)
        );
        break;
      case 'crypto':
        if (!crypto.value.wallet) {
          throw new Error('지갑 주소를 입력해주세요.');
        }
        paymentContext.setStrategy(new CryptoStrategy(crypto.value.wallet));
        break;
      default:
        throw new Error('결제 방법을 선택해주세요.');
    }

    paymentResult.value = paymentContext.executePayment(selectedProduct.value.price);
    paymentTime.value = new Date().toLocaleString('ko-KR');

    // 결제 내역 추가
    const strategy = paymentContext.getCurrentStrategy();
    paymentHistory.value.push({
      product: selectedProduct.value.name,
      amount: selectedProduct.value.price,
      method: strategy ? strategy.getName() : '',
      time: paymentTime.value
    });
  } catch (e) {
    error.value = (e as Error).message;
  }
};

const resetPayment = () => {
  selectedProduct.value = null;
  selectedMethod.value = '';
  paymentResult.value = '';
  paymentTime.value = '';
  error.value = '';
  creditCard.value = { number: '', holder: '' };
  paypal.value = { email: '' };
  bank.value = { name: '', account: '' };
  crypto.value = { wallet: '' };
};
</script>

<style scoped>
.pattern-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pattern-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pattern-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.description {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.content-grid {
  display: grid;
  gap: 2rem;
}

.product-section, .payment-section, .result-section, .error-section, .history-section, .info-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.product-card {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card.selected {
  border-color: #3498db;
  background: #e3f2fd;
}

.product-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.product-price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.1rem;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-method {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: #2ecc71;
  background: #f0fdf4;
}

.payment-method.selected {
  border-color: #2ecc71;
  background: #dcfce7;
}

.method-icon {
  font-size: 1.5rem;
}

.method-name {
  font-weight: 600;
  color: #2c3e50;
}

.payment-form {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  color: #34495e;
  font-weight: 500;
}

.form-group label:first-child {
  margin-top: 0;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #2ecc71;
}

.pay-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s;
}

.pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
}

.result-box {
  padding: 1.5rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.result-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.result-icon {
  font-size: 2rem;
}

.result-details {
  color: #155724;
  margin-bottom: 0.5rem;
  white-space: pre-line;
  line-height: 1.6;
}

.result-time {
  color: #6c757d;
  font-size: 0.9rem;
}

.reset-btn {
  width: 100%;
  padding: 0.75rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #5a6268;
}

.error-message {
  color: #e74c3c;
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.history-list {
  display: grid;
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.history-product {
  font-weight: 600;
  color: #2c3e50;
}

.history-amount {
  color: #e74c3c;
  font-weight: 700;
}

.history-method {
  color: #495057;
  margin-bottom: 0.25rem;
}

.history-time {
  color: #6c757d;
  font-size: 0.9rem;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
</style>