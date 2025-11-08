<template>
  <div class="pattern-demo">
    <h2>🔌 Adapter Pattern</h2>
    <p class="description">
      어댑터 패턴은 호환되지 않는 인터페이스를 가진 클래스들이 함께 작동할 수 있도록 해주는 패턴입니다.
    </p>
    
    <div class="demo-section">
      <div class="controls">
        <div class="control-group">
          <label>결제 금액 (원):</label>
          <input 
            v-model.number="amount" 
            type="number" 
            class="input"
            placeholder="금액 입력"
            min="0"
          />
        </div>
        
        <button @click="runProcessPayment" class="btn btn-primary">
          processPayment(adapter, {{ amount }}) 실행
        </button>
      </div>
      
      <div v-if="logs.length > 0" class="result-box">
        <h3>📋 실행 결과:</h3>
        <div v-for="(log, index) in logs" :key="index" class="log-section">
          <div class="log-header">
            <span class="log-number">실행 #{{ index + 1 }}</span>
            <span class="log-amount">{{ log.amount }}원</span>
          </div>
          <div class="log-messages">
            <div v-for="(message, msgIndex) in log.messages" :key="msgIndex" class="log-item">
              <span class="log-icon">{{ message.icon }}</span>
              <span class="log-message">{{ message.text }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <h4>💡 패턴 설명</h4>
          <p>
            <strong>Adapter 패턴</strong>은 호환되지 않는 인터페이스를 연결합니다.
          </p>
          <ul>
            <li><code>OldPaymentProcessor</code>: 클라이언트가 기대하는 인터페이스 (Target)</li>
            <li><code>NewPaymentGateway</code>: 호환되지 않는 새로운 클래스 (Adaptee)</li>
            <li><code>PaymentAdapter</code>: 둘을 연결하는 어댑터</li>
            <li>클라이언트는 기존 인터페이스만 사용하면 됨!</li>
          </ul>
          <div class="flow-diagram">
            <div class="flow-item">Client</div>
            <div class="flow-arrow">→</div>
            <div class="flow-item">PaymentAdapter</div>
            <div class="flow-arrow">→</div>
            <div class="flow-item">NewPaymentGateway</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  NewPaymentGateway, 
  PaymentAdapter, 
  processPayment 
} from '../patterns/adapter';

interface LogMessage {
  icon: string;
  text: string;
}

interface LogEntry {
  amount: number;
  messages: LogMessage[];
}

const amount = ref<number>(5000);
const logs = ref<LogEntry[]>([]);

const runProcessPayment = () => {
  const messages: LogMessage[] = [];
  
  // console.log 오버라이드하여 메시지 캡처
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const message = args.join(' ');
    messages.push({ icon: '💳', text: message });
    originalLog(...args);
  };
  
  // Adapter 패턴 실행
  const newGateway = new NewPaymentGateway();
  const adapter = new PaymentAdapter(newGateway);
  
  // 클라이언트는 여전히 OldPaymentProcessor 인터페이스만 사용
  processPayment(adapter, amount.value);
  
  // console.log 복원
  console.log = originalLog;
  
  logs.value.push({
    amount: amount.value,
    messages
  });
};
</script>

<style scoped>
.pattern-demo {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.control-group label {
  font-weight: 600;
  color: #2c3e50;
}

.input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #9b59b6;
  color: white;
}

.btn-primary:hover {
  background: #8e44ad;
}

.result-box {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.log-section {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #9b59b6;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #9b59b6;
}

.log-number {
  font-weight: 600;
  color: #2c3e50;
}

.log-amount {
  padding: 0.25rem 0.75rem;
  background: #9b59b6;
  color: white;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.log-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-item {
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
}

.log-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.log-message {
  flex: 1;
  color: #555;
}

.info-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f3e5f5;
  border-radius: 8px;
  border-left: 4px solid #9b59b6;
}

.info-box p {
  margin: 0.5rem 0;
  color: #555;
  line-height: 1.6;
}

.info-box ul {
  margin: 1rem 0 0 1.5rem;
  color: #555;
}

.info-box li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.info-box code {
  background: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #9b59b6;
  font-weight: 600;
}

.flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.flow-item {
  padding: 0.75rem 1.5rem;
  background: #9b59b6;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.flow-arrow {
  font-size: 1.5rem;
  color: #9b59b6;
  font-weight: bold;
}
</style>