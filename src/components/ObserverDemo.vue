<template>
  <div class="pattern-demo">
    <h2>👁️ Observer Pattern</h2>
    <p class="description">
      옵저버 패턴은 객체의 상태 변화를 관찰하는 옵저버들의 목록을 객체에 등록하여, 상태 변화가 있을 때마다 자동으로 통지하도록 하는 패턴입니다.
    </p>
    
    <div class="demo-section">
      <div class="stock-manager">
        <h3>📈 주식 관리 시스템</h3>
        
        <div class="price-control">
          <label>주가 설정:</label>
          <div class="price-input-group">
            <input 
              v-model.number="newPrice" 
              type="number" 
              class="input"
              min="0"
              step="10"
            />
            <span class="unit">원</span>
            <button @click="updatePrice" class="btn btn-primary">
              stock.setPrice({{ newPrice }}) 실행
            </button>
          </div>
        </div>
        
        <div class="observers-control">
          <h4>옵저버 등록 관리:</h4>
          <div class="observer-toggles">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                v-model="activeObservers.display"
                @change="toggleObserver('display')"
              />
              <span>📺 PriceDisplay (화면 표시)</span>
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox" 
                v-model="activeObservers.alert"
                @change="toggleObserver('alert')"
              />
              <span>🚨 PriceAlert (가격 알림, 100원 초과 시)</span>
            </label>
          </div>
        </div>
      </div>
      
      <div v-if="updates.length > 0" class="result-box">
        <h3>📋 업데이트 기록:</h3>
        <div class="updates-list">
          <div v-for="(update, index) in updates" :key="index" class="update-item">
            <div class="update-header">
              <span class="update-time">{{ update.time }}</span>
              <span class="update-price">{{ update.price }}원</span>
            </div>
            <div class="update-messages">
              <div v-for="(msg, msgIndex) in update.messages" :key="msgIndex" class="message-item">
                <span class="message-icon">{{ msg.icon }}</span>
                <span class="message-text">{{ msg.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="observers-box">
        <h3>현재 옵저버 상태:</h3>
        <div class="observers-grid">
          <div 
            class="observer-card"
            :class="{ inactive: !activeObservers.display }"
          >
            <div class="observer-icon">📺</div>
            <div class="observer-name">PriceDisplay</div>
            <div class="observer-price">
              {{ activeObservers.display && displayObserver ? displayObserver.getLastPrice() : '--' }}원
            </div>
            <div class="observer-status">
              {{ activeObservers.display ? '🟢 등록됨' : '⚪ 미등록' }}
            </div>
          </div>
          
          <div 
            class="observer-card"
            :class="{ inactive: !activeObservers.alert }"
          >
            <div class="observer-icon">🚨</div>
            <div class="observer-name">PriceAlert</div>
            <div class="observer-price">
              {{ activeObservers.alert && alertObserver ? alertObserver.getLastPrice() : '--' }}원
            </div>
            <div class="observer-status">
              {{ activeObservers.alert ? '🟢 등록됨' : '⚪ 미등록' }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-box">
        <h4>💡 패턴 설명</h4>
        <p>
          <strong>Observer 패턴</strong>은 일대다 의존 관계를 정의합니다.
        </p>
        <ul>
          <li><code>Subject</code>: 상태를 가지고 있으며 옵저버들을 관리</li>
          <li><code>Observer</code>: Subject의 상태 변화를 관찰</li>
          <li><code>Stock</code>: Concrete Subject (주가 관리)</li>
          <li><code>PriceDisplay, PriceAlert</code>: Concrete Observers</li>
          <li>주가가 변경되면 등록된 모든 옵저버에게 자동 통지!</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Stock, PriceDisplay, PriceAlert } from '../patterns/observer';

interface UpdateMessage {
  icon: string;
  text: string;
}

interface UpdateEntry {
  time: string;
  price: number;
  messages: UpdateMessage[];
}

const newPrice = ref(90);
const stock = new Stock();
const displayObserver = new PriceDisplay();
const alertObserver = new PriceAlert();

const activeObservers = reactive({
  display: false,
  alert: false
});

const updates = ref<UpdateEntry[]>([]);

const toggleObserver = (observerKey: 'display' | 'alert') => {
  if (observerKey === 'display') {
    if (activeObservers.display) {
      stock.register(displayObserver);
    } else {
      stock.unregister(displayObserver);
    }
  } else if (observerKey === 'alert') {
    if (activeObservers.alert) {
      stock.register(alertObserver);
    } else {
      stock.unregister(alertObserver);
    }
  }
};

const updatePrice = () => {
  const messages: UpdateMessage[] = [];
  
  // console.log 오버라이드하여 메시지 캡처
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const text = args.join(' ');
    let icon = '📝';
    
    if (text.includes('📺')) {
      icon = '📺';
    } else if (text.includes('🚨')) {
      icon = '🚨';
    }
    
    messages.push({ icon, text });
    originalLog(...args);
  };
  
  // 주가 업데이트 (자동으로 notify 호출됨)
  stock.setPrice(newPrice.value);
  
  // console.log 복원
  console.log = originalLog;
  
  updates.value.unshift({
    time: new Date().toLocaleTimeString(),
    price: newPrice.value,
    messages
  });
  
  // 최대 10개의 업데이트만 표시
  if (updates.value.length > 10) {
    updates.value = updates.value.slice(0, 10);
  }
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

.stock-manager {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

h4 {
  color: #2c3e50;
  margin: 1.5rem 0 1rem 0;
}

.price-control label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.price-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.2rem;
  width: 120px;
}

.unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: #555;
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
  background: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
}

.observer-toggles {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-label:hover {
  background: #e0e0e0;
}

.toggle-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.result-box {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.updates-list {
  max-height: 400px;
  overflow-y: auto;
}

.update-item {
  padding: 1rem;
  margin: 0.5rem 0;
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  border-radius: 4px;
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.update-time {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.update-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
}

.update-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-item {
  padding: 0.5rem 0.75rem;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
}

.message-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.message-text {
  flex: 1;
  color: #555;
}

.observers-box {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.observers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.observer-card {
  padding: 1.5rem;
  background: #e8f5e9;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid #27ae60;
}

.observer-card.inactive {
  background: #f5f5f5;
  opacity: 0.6;
  border-color: #ccc;
}

.observer-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.observer-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.observer-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0.75rem 0;
}

.observer-status {
  font-size: 0.9rem;
  color: #666;
}

.info-box {
  background: #fff3e0;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
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
  color: #e74c3c;
  font-weight: 600;
}
</style>