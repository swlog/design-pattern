<template>
  <div class="pattern-demo">
    <h2>🏭 Factory Pattern</h2>
    <p class="description">
      팩토리 패턴은 객체 생성 로직을 캡슐화하여 서브클래스가 어떤 클래스의 인스턴스를 생성할지 결정하도록 합니다.
    </p>
    
    <div class="demo-section">
      <div class="controls">
        <div class="control-group">
          <label>운영체제 선택:</label>
          <select v-model="selectedOS" class="select">
            <option value="Windows">Windows</option>
            <option value="Mac">Mac</option>
          </select>
        </div>
        
        <button @click="runClientApp" class="btn btn-primary">
          clientApp("{{ selectedOS }}") 실행
        </button>
      </div>
      
      <div v-if="logs.length > 0" class="result-box">
        <h3>📋 실행 결과:</h3>
        <div v-for="(log, index) in logs" :key="index" class="log-section">
          <div class="log-header">
            <span class="log-number">실행 #{{ index + 1 }}</span>
            <span class="log-os">{{ log.osType }}</span>
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
            <strong>Factory Method 패턴</strong>은 객체 생성을 서브클래스에 위임합니다.
          </p>
          <ul>
            <li><code>Dialog</code>: Creator 추상 클래스 (팩토리 메서드 정의)</li>
            <li><code>WindowsDialog / MacDialog</code>: 구체적인 Creator</li>
            <li><code>WindowsButton / MacButton</code>: 구체적인 Product</li>
            <li>클라이언트는 구체적인 버튼 클래스를 몰라도 됨!</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { clientApp } from '../patterns/factory';

interface LogMessage {
  icon: string;
  text: string;
}

interface LogEntry {
  osType: string;
  messages: LogMessage[];
}

const selectedOS = ref('Windows');
const logs = ref<LogEntry[]>([]);

const runClientApp = () => {
  const messages: LogMessage[] = [];
  
  // console.log 오버라이드하여 메시지 캡처
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const message = args.join(' ');
    if (message.includes('렌더링')) {
      messages.push({ icon: '🎨', text: message });
    } else if (message.includes('클릭')) {
      messages.push({ icon: '🖱️', text: message });
    } else {
      messages.push({ icon: '📝', text: message });
    }
    originalLog(...args);
  };
  
  // clientApp 실행
  const dialog = clientApp(selectedOS.value);
  dialog.renderDialog();
  
  // console.log 복원
  console.log = originalLog;
  
  logs.value.push({
    osType: selectedOS.value,
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

.select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
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
  background: #e67e22;
  color: white;
}

.btn-primary:hover {
  background: #d35400;
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
  border-left: 4px solid #e67e22;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e67e22;
}

.log-number {
  font-weight: 600;
  color: #2c3e50;
}

.log-os {
  padding: 0.25rem 0.75rem;
  background: #e67e22;
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
  background: #fff8e1;
  border-radius: 8px;
  border-left: 4px solid #e67e22;
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
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #e67e22;
}
</style>