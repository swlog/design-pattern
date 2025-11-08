// visitor.ts

// 공통 인터페이스들
export interface Visitor {
  visitFile(file: FileElement): void
  visitFolder(folder: FolderElement): void
}

export interface Element {
  accept(visitor: Visitor): void
}

// FileElement 클래스
export class FileElement implements Element {
  name: string
  size: number

  constructor(name: string, size: number) {
    this.name = name
    this.size = size
  }

  accept(visitor: Visitor): void {
    visitor.visitFile(this)
  }
}

// FolderElement 클래스
export class FolderElement implements Element {
  name: string
  children: Element[]

  constructor(name: string, children: Element[] = []) {
    this.name = name
    this.children = children
  }

  accept(visitor: Visitor): void {
    visitor.visitFolder(this)
  }
}

// 파일 크기를 계산하는 Visitor
export class SizeCalculator implements Visitor {
  private totalSize = 0

  visitFile(file: FileElement): void {
    this.totalSize += file.size
  }

  visitFolder(folder: FolderElement): void {
    for (const child of folder.children) {
      child.accept(this)
    }
  }

  getTotalSize(): number {
    return this.totalSize
  }
}

// 이름을 출력하는 Visitor
export class NamePrinter implements Visitor {
  visitFile(file: FileElement): void {
    console.log(`📄 파일: ${file.name}`)
  }

  visitFolder(folder: FolderElement): void {
    console.log(`📁 폴더: ${folder.name}`)
    for (const child of folder.children) {
      child.accept(this)
    }
  }
}

// Vue에서 쓸 수 있게 묶어서 export
export const VisitorAPI = {
  FileElement,
  FolderElement,
  SizeCalculator,
  NamePrinter,
}
export default VisitorAPI
