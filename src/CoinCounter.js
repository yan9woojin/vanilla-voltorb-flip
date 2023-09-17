/* 코인을 관리하는 데 사용되는 클래스 */
class CoinCounter {
  id;
  element;
  coin;

  constructor(id, coin) {
    this.id = id;
    this.element = document.getElementById(id);
    this.coin = coin;
    this.#updateText();
  }

  // 현재 코인에 coin만큼 추가하는 메서드
  addCoin(coin) {
    this.coin += coin;
    this.#saveCoinInStorage();
    this.#updateText();
  }

  // 현재 코인을 0으로 초기화하는 메서드
  resetCoin() {
    this.coin = 0;
    this.#saveCoinInStorage();
    this.#updateText();
  }

  // 코인의 텍스트를 업데이트하는 메서드
  #updateText() {
    this.element.textContent = String(this.coin).padStart(5, "0");
  }

  // 로컬 스토리지에 코인을 저장하는 메서드
  #saveCoinInStorage() {
    localStorage.setItem(this.id, this.coin);
  }
}

export default CoinCounter;
