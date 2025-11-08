<template>
  <div class="pattern-demo">
    <h2>🔒 Singleton Pattern</h2>
    <p class="description">
      싱글톤 패턴은 클래스의 인스턴스가 단 하나만 생성되도록 보장하는 패턴입니다.
    </p>
    
    <div class="demo-section">
      <div class="button-group">
        <button @click="getInstance1" class="btn btn-primary">
          인스턴스 1 가져오기
        </button>
        <button @click="getInstance2" class="btn btn-secondary">
          인스턴스 2 가져오기
        </button>
        <button @click="callSayHello" class="btn btn-success">
          sayHello() 호출
        </button>
        <button @click="checkEquality" class="btn btn-info">
          인스턴스 비교 (s1 === s2)
        </button>
      </div>
      
      <div v-if="logs.length > 0" class="result-box">
        <h3>📋 실행 결과:</h3>
        <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
          <span class="log-icon">{{ log.icon }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
        
        <div class="info-box">
          <h4>💡 핵심 포인트</h4>
          <p>
            <strong>s1 === s2:</strong> 
            <span :class="{'text-success': isEqual, 'text-danger': isEqual === false}">
              {{ isEqual !== null ? (isEqual ? 'true ✅' : 'false ❌') : '(아직 비교 안 함)' }}
            </span>
          </p>
          <p class="highlight">
            {{ isEqual ? '✅ 두 변수가 동일한 싱글톤 인스턴스를 참조합니다!' : '먼저 인스턴스를 가져오고 비교해보세요.' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Singleton } from '../patterns/singleton';

interface LogEntry {
  message: string;
  icon: string;
  type: string;
}

const logs = ref<LogEntry[]>([]);
const isEqual = ref<boolean | null>(null);
let s1: Singleton | null = null;
let s2: Singleton | null = null;

const getInstance1 = () => {
  s1 = Singleton.getInstance();
  logs.value.push({
    message: 'const s1 = Singleton.getInstance() 실행됨',
    icon: '🔵',
    type: 'info'
  });
};

const getInstance2 = () => {
  s2 = Singleton.getInstance();
  logs.value.push({
    message: 'const s2 = Singleton.getInstance() 실행됨',
    icon: '🟢',
    type: 'info'
  });
};

const callSayHello = () => {
  if (s1) {
    s1.sayHello();
    logs.value.push({
      message: 's1.sayHello() 호출: "안녕하세요! 저는 싱글톤 인스턴스입니다 👋"',
      icon: '💬',
      type: 'success'
    });
  } else {
    logs.value.push({
      message: '⚠️ 먼저 "인스턴스 1 가져오기"를 실행하세요',
      icon: '⚠️',
      type: 'warning'
    });
  }
};

const checkEquality = () => {
  if (s1 && s2) {
    const result = s1 === s2;
    isEqual.value = result;
    logs.value.push({
      message: `s1 === s2 비교 결과: ${result} ${result ? '(항상 같은 인스턴스)' : ''}`,
      icon: result ? '✅' : '❌',
      type: result ? 'success' : 'error'
    });
  } else {
    logs.value.push({
      message: '⚠️ 먼저 두 인스턴스를 모두 가져오세요 (인스턴스 1, 2)',
      icon: '⚠️',
      type: 'warning'
    });
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

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  font-weight: 500;
}

.btn-primary {
  background: #3498db;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-success {
  background: #27ae60;
}

.btn-success:hover {
  background: #229954;
}

.btn-info {
  background: #e67e22;
}

.btn-info:hover {
  background: #d35400;
}

.result-box {
  margin-top: 1.5rem;
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

.log-item {
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
}

.log-item.info {
  background: #e8f4f8;
  border-left: 4px solid #3498db;
}

.log-item.success {
  background: #d5f4e6;
  border-left: 4px solid #27ae60;
}

.log-item.warning {
  background: #fff3cd;
  border-left: 4px solid #f39c12;
}

.log-item.error {
  background: #f8d7da;
  border-left: 4px solid #e74c3c;
}

.log-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.log-message {
  flex: 1;
}

.info-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #3498db;
}

.info-box p {
  margin: 0.75rem 0;
  font-size: 1.05rem;
}

.text-success {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.1rem;
}

.text-danger {
  color: #e74c3c;
  font-weight: bold;
}

.highlight {
  color: #27ae60;
  font-weight: bold;
  margin-top: 1rem;
  padding: 1rem;
  background: #d5f4e6;
  border-radius: 4px;
}
</style>