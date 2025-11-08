<template>
  <div class="visitor-demo">
    <h2>🎯 Visitor Pattern Demo</h2>
    <p class="description">
      Visitor 패턴은 객체 구조를 변경하지 않고 새로운 연산을 추가할 수 있게 해주는 패턴입니다.
    </p>

    <div class="demo-section">
      <h3>🔍 Visitor 실행</h3>
      <div class="button-group">
        <button @click="calculateSize" class="btn btn-primary">
          💾 전체 크기 계산
        </button>
        <button @click="printNames" class="btn btn-secondary">
          📝 이름 출력
        </button>
        <button @click="reset" class="btn btn-reset">
          🔄 초기화
        </button>
      </div>

      <div v-if="result" class="result-box">
        <h4>{{ result.title }}</h4>
        <div class="result-content">
          <pre v-if="result.type === 'size'">총 크기: {{ result.data }}KB</pre>
          <pre v-else>{{ result.data }}</pre>
        </div>
      </div>
    </div>

    <div class="explanation">
      <h3>💡 패턴 설명</h3>
      <ul>
        <li><strong>Element (요소):</strong> Visitor를 받아들이는 accept() 메서드 제공</li>
        <li><strong>Visitor (방문자):</strong> 각 요소 타입에 대한 visit 메서드 구현</li>
        <li><strong>장점:</strong> 새로운 연산 추가가 쉽고, 관련 동작을 한 곳에 모을 수 있음</li>
        <li><strong>단점:</strong> 새로운 Element 타입 추가 시 모든 Visitor 수정 필요</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileElement, FolderElement, SizeCalculator, NamePrinter } from '../patterns/visitor'

interface Result {
  title: string
  type: 'size' | 'names'
  data: string | number
}

const result = ref<Result | null>(null)

// 파일 시스템 구조 생성
const createFileSystem = () => {
  const file1 = new FileElement('a.txt', 10)
  const file2 = new FileElement('b.txt', 20)
  const folder = new FolderElement('docs', [file1, file2])

  return folder
}

const calculateSize = () => {
  const folder = createFileSystem()
  const sizeVisitor = new SizeCalculator()
  
  folder.accept(sizeVisitor)
  const totalSize = sizeVisitor.getTotalSize()

  result.value = {
    title: '📊 크기 계산 결과',
    type: 'size',
    data: totalSize
  }
}

const printNames = () => {
  const folder = createFileSystem()
  const nameVisitor = new NamePrinter()
  
  // console.log를 캡처하기 위한 배열
  const logs: string[] = []
  const originalLog = console.log
  console.log = (...args: any[]) => {
    logs.push(args.join(' '))
  }

  folder.accept(nameVisitor)

  // console.log 복원
  console.log = originalLog

  result.value = {
    title: '📋 이름 출력 결과',
    type: 'names',
    data: logs.join('\n')
  }
}

const reset = () => {
  result.value = null
}
</script>

<style scoped>
.visitor-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

h3 {
  color: #34495e;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.file-tree {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e1e8ed;
  font-family: 'Courier New', monospace;
}

.folder {
  margin: 0.5rem 0;
}

.indent {
  margin-left: 2rem;
  border-left: 2px solid #e1e8ed;
  padding-left: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: #2ecc71;
  color: white;
}

.btn-secondary:hover {
  background: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.3);
}

.btn-reset {
  background: #95a5a6;
  color: white;
}

.btn-reset:hover {
  background: #7f8c8d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(149, 165, 166, 0.3);
}

.result-box {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-box h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
}

.result-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.result-content pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  color: #2c3e50;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.explanation {
  background: #e8f4f8;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.explanation ul {
  margin: 0;
  padding-left: 1.5rem;
}

.explanation li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
  color: #2c3e50;
}

.explanation strong {
  color: #2980b9;
}
</style>