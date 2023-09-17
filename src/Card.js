import { CARD_FLIP_DELAY } from "./constants";

/* 카드를 생성하는 클래스 */
class Card {
  element = null;
  value = null;
  isFlipped = false;
  row;
  col;

  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  // 카드에 메모를 토글하는 메서드
  toggleMemo(memo) {
    const memoEl = this.element.querySelector(`[data-memo="${memo}"]`);
    memoEl.classList.toggle("hide");
  }

  // 카드에 메모를 전부 숨기는 메서드
  clearMemo() {
    const memoEls = this.element.querySelectorAll("[data-memo]");
    memoEls.forEach((memoEl) => memoEl.classList.add("hide"));
  }

  // 카드를 뒤집는 메서드
  flip() {
    this.element.classList.add("card__flipped");
    this.element.setAttribute("data-card", this.value);
    this.isFlipped = true;
  }

  // 카드를 포커스하는 메서드
  focus() {
    this.element.focus();
  }

  // 카드를 초기화하는 메서드
  reset() {
    this.clearMemo();
    this.element.classList.remove("card__flipped");
    setTimeout(() => {
      this.element.removeAttribute("data-card", this.value);
      this.value = null;
      this.isFlipped = false;
    }, CARD_FLIP_DELAY);
  }
}

export default Card;
