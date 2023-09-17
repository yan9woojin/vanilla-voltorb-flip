/* 레벨을 관리하는 데 사용되는 클래스 */
class LevelCounter {
  element;
  minLevel;
  maxLevel;
  level;

  constructor(id, minLevel, maxLevel) {
    this.element = document.getElementById(id);
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
    this.level = minLevel;
  }

  // 레벨을 1 증가시키는 메서드
  increase() {
    this.level = Math.min(this.level + 1, this.maxLevel);
    this.#updateText();
  }

  // 레벨을 1 감소시키는 메서드
  decrease() {
    this.level = Math.max(this.level - 1, this.minLevel);
    this.#updateText();
  }

  // 레벨의 텍스트를 업데이트하는 메서드
  #updateText() {
    this.element.textContent = this.level + 1;
  }
}

export default LevelCounter;
