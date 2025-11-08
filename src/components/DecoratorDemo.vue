<template>
  <div class="pattern-demo">
    <h2>🎨 Decorator Pattern</h2>
    <p class="description">
      데코레이터 패턴은 객체에 동적으로 새로운 기능을 추가할 수 있게 해주는 패턴입니다.
    </p>
    
    <div class="demo-section">
      <div class="notifier-builder">
        <h3>알림 설정</h3>
        
        <div class="base-notifier">
          <p><strong>기본 알림:</strong> ✅ BaseNotifier (항상 포함)</p>
        </div>
        
        <div class="decorators">
          <h4>추가 알림 채널 선택:</h4>
          <div class="decorator-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="decorators.email" />
              <span>📧 Email 알림</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="decorators.sms" />
              <span>📱 SMS 알림</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="decorators.slack" />
              <span>💬 Slack 알림</span>
            </label>
          </div>
        </div>
        
        <div class="message-input">
          <label>알림 메시지:</label>
          <input 
            v-model="message" 
            type="text" 
            class="input"
            placeholder="메시지를 입력하세요"
          />
        </div>
        
        <button @click="sendNotification" class="btn btn-primary">
          notifier.send("{{ message }}") 실행
        </button>
      </div>
      
      <div v-if="logs.length > 0" class="result-box">
        <h3>📋 실행 결과:</h3>
        <div v-for="(log, index) in logs" :key="index" class="log-section">
          <div class="log-header">
            <span class="log-number">실행 #{{ index + 1 }}</span>
            <span class="log-message-title">{{ log.messageText }}</span>
          </div>
          
          <div class="decorator-chain">
            <h4>데코레이터 체인:</h4>
            <div class="chain-items">
              <div class="chain-item base">BaseNotifier</div>
              <template v-if="log.chain.length > 0">
                <div v-for="(decorator, dIndex) in log.chain" :key="dIndex" class="chain-wrapper">
                  <div class="chain-arrow">→</div>
                  <div class="chain-item">{{ decorator }}</div>
                </div>
              </template>
            </div>
          </div>
          
          <div class="log-messages">
            <div v-for="(msg, msgIndex) in log.messages" :key="msgIndex" class="log-item">
              <span class="log-icon">{{ msg.icon }}</span>
              <span class="log-text">{{ msg.text }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <h4>💡 패턴 설명</h4>
          <p>
            <strong>Decorator 패턴</strong>은 기능을 런타임에 동적으로 조합합니다.
          </p>
          <ul>
            <li><code>Notifier</code>: Component 인터페이스</li>
            <li><code>BaseNotifier</code>: 기본 기능을 가진 Concrete Component</li>
            <li><code>NotifierDecorator</code>: 데코레이터 추상 클래스</li>
            <li><code>EmailNotifier, SMSNotifier, SlackNotifier</code>: 구체적인 데코레이터들</li>
            <li>각 데코레이터는 이전 객체를 감싸면서 기능을 추가!</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { 
  BaseNotifier, 
  EmailNotifier, 
  SMSNotifier, 
  SlackNotifier,
  type Notifier
} from '../patterns/decorator';

interface LogMessage {
  icon: string;
  text: string;
}

interface LogEntry {
  messageText: string;
  chain: string[];
  messages: LogMessage[];
}

const decorators = reactive({
  email: false,
  sms: false,
  slack: false
});

const message = ref('긴급 서버 장애 발생!');
const logs = ref<LogEntry[]>([]);

const sendNotification = () => {
  const messages: LogMessage[] = [];
  const chain: string[] = [];
  
  // console.log 오버라이드하여 메시지 캡처
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const text = args.join(' ');
    let icon = '📢';
    
    if (text.includes('기본 알림')) {
      icon = '📢';
    } else if (text.includes('이메일')) {
      icon = '📧';
    } else if (text.includes('SMS')) {
      icon = '📱';
    } else if (text.includes('Slack')) {
      icon = '💬';
    }
    
    messages.push({ icon, text });
    originalLog(...args);
  };
  
  // 데코레이터 패턴 실행
  let notifier: Notifier = new BaseNotifier();
  
  // 기능을 런타임에서 동적으로 조합
  if (decorators.email) {
    notifier = new EmailNotifier(notifier);
    chain.push('EmailNotifier');
  }
  if (decorators.sms) {
    notifier = new SMSNotifier(notifier);
    chain.push('SMSNotifier');
  }
  if (decorators.slack) {
    notifier = new SlackNotifier(notifier);
    chain.push('SlackNotifier');
  }
  
  notifier.send(message.value);
  
  // console.log 복원
  console.log = originalLog;
  
  logs.value.push({
    messageText: message.value,
    chain,
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

.notifier-builder {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

h4 {
  color: #2c3e50;
  margin: 1rem 0 0.5rem 0;
  font-size: 1rem;
}

.base-notifier {
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #27ae60;
}

.base-notifier p {
  margin: 0;
  color: #555;
}

.decorator-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: #e0e0e0;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 1rem;
}

.message-input {
  margin: 1.5rem 0;
}

.message-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.btn-primary {
  background: #16a085;
  color: white;
}

.btn-primary:hover {
  background: #138f75;
}

.result-box {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.log-section {
  margin: 1rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #16a085;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #16a085;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.log-number {
  font-weight: 600;
  color: #2c3e50;
}

.log-message-title {
  padding: 0.25rem 0.75rem;
  background: #16a085;
  color: white;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.decorator-chain {
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.chain-items {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.chain-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chain-item {
  padding: 0.5rem 1rem;
  background: #16a085;
  color: white;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

.chain-item.base {
  background: #27ae60;
}

.chain-arrow {
  font-size: 1.2rem;
  color: #16a085;
  font-weight: bold;
}

.log-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
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

.log-text {
  flex: 1;
  color: #555;
}

.info-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #d5f4e6;
  border-radius: 8px;
  border-left: 4px solid #16a085;
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
  color: #16a085;
  font-weight: 600;
}
</style>