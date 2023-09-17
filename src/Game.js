import CoinCounter from "./CoinCounter";
import LevelCounter from "./LevelCounter";
import Card from "./Card";
import { getRandomInt, getAudioUrl } from "./utils";
import {
  VOLTORB,
  MIN_VOLTORB_COUNT,
  MIN_COIN,
  MAX_COIN,
  MIN_LEVEL,
  MAX_LEVEL,
  CARD_FLIP_DELAY,
} from "./constants";

class Game {
  bgm = document.getElementById("bgm");
  totalCoin = new CoinCounter("totalCoin", Number(localStorage.getItem("totalCoin")));
  currentCoin = new CoinCounter("currentCoin", 0);
  currentLevel = new LevelCounter("currentLevel", MIN_LEVEL, MAX_LEVEL);
  pause = false;
  cards = [];
  rows;
  cols;

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.#createCards();
    this.#renderCards();
  }

  // 게임을 시작하는 메서드
  start() {
    this.#playBGM();
    this.#setVoltorb();
    this.#setCoin();
    this.#renderInfo();
    this.findCard(0, 0).focus();
  }

  // row행 col열에 있는 카드를 반환하는 메서드
  findCard(row, col) {
    return this.cards.find((card) => card.row === row && card.col === col);
  }

  // key에 따라 카드 포커스를 변경하는 메서드
  moveFocus(key, row, col) {
    if (this.pause) return;

    switch (key) {
      case "ArrowUp":
        row--;
        break;
      case "ArrowDown":
        row++;
        break;
      case "ArrowLeft":
        col--;
        break;
      case "ArrowRight":
        col++;
        break;
    }

    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.findCard(row, col).focus();
    }
  }

  // 카드를 뒤집는 메서드
  flipCard(card) {
    if (card.isFlipped || this.pause) return;

    card.flip();
    this.#checkGameStatus(card);
  }

  // 카드를 생성하는 메서드
  #createCards() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cards.push(new Card(row, col));
      }
    }
  }

  // 카드를 렌더링하는 메서드
  #renderCards() {
    const cardTemplate = document.getElementById("card-template");
    const infoEls = document.querySelectorAll("[data-info]");

    this.cards.forEach((card) => {
      const cardFragment = cardTemplate.content.cloneNode(true);
      const cardEl = cardFragment.querySelector(".card");

      const { row, col } = card;

      cardEl.setAttribute("data-row", row);
      cardEl.setAttribute("data-col", col);

      card.element = cardEl;

      infoEls[row].insertAdjacentElement("beforebegin", cardEl);
    });
  }

  // 카드에 찌리리공을 세팅하는 메서드
  #setVoltorb() {
    let voltorbCount = MIN_VOLTORB_COUNT + this.currentLevel.level;

    while (voltorbCount > 0) {
      const randomIdx = getRandomInt(this.cards.length);
      const randomCard = this.cards[randomIdx];

      if (randomCard.value === null) {
        randomCard.value = VOLTORB;
        voltorbCount--;
      }
    }
  }

  // 카드에 코인을 세팅하는 메서드
  #setCoin() {
    this.cards.forEach((card) => {
      if (card.value === null) {
        const randomCoin = getRandomInt(MAX_COIN) + MIN_COIN;
        card.value = randomCoin;
      }
    });
  }

  // 행과 열의 카드 정보를 계산하는 메서드
  #calculateInfo() {
    const coin = {
      row: new Array(this.rows).fill(0),
      col: new Array(this.cols).fill(0),
    };

    const voltorb = {
      row: new Array(this.rows).fill(0),
      col: new Array(this.cols).fill(0),
    };

    this.cards.forEach((card) => {
      const { row, col, value } = card;

      if (value === VOLTORB) {
        voltorb.row[row]++;
        voltorb.col[col]++;
      } else {
        coin.row[row] += value;
        coin.col[col] += value;
      }
    });

    const coinInfo = [...coin.row, ...coin.col];
    const voltorbInfo = [...voltorb.row, ...voltorb.col];

    return [coinInfo, voltorbInfo];
  }

  // 행과 열 정보를 렌더링하는 메서드
  #renderInfo() {
    const coinInfoEls = document.querySelectorAll("[data-coin-info]");
    const voltorbInfoEls = document.querySelectorAll("[data-voltorb-info]");

    const [coinInfo, voltorbInfo] = this.#calculateInfo();

    coinInfoEls.forEach((coinInfoEl, idx) => {
      coinInfoEl.textContent = String(coinInfo[idx]).padStart(2, "0");
    });

    voltorbInfoEls.forEach((voltorbInfoEl, idx) => {
      voltorbInfoEl.textContent = voltorbInfo[idx];
    });
  }

  // 게임 상태를 확인하는 메서드
  #checkGameStatus(card) {
    const isGameOVer = card.value === VOLTORB;
    if (isGameOVer) {
      this.#handleGameOver();
      return;
    }

    const isGameClear = this.cards.every((card) => card.isFlipped || card.value === VOLTORB);
    if (isGameClear) {
      this.#handleGameClear(card);
      return;
    }

    this.#playCoinSound();
    this.currentCoin.addCoin(card.value);
  }

  // 게임이 끝났을 때 실행되는 메서드
  #handleGameOver() {
    this.#playFailureSound();
    this.currentLevel.decrease();
    this.currentCoin.resetCoin();
    this.#restart();
  }

  // 게임을 클리어했을 때 실행되는 메서드
  #handleGameClear(card) {
    this.#playSuccessSound();
    this.currentCoin.addCoin(card.value);
    this.totalCoin.addCoin(this.currentCoin.coin);
    this.currentLevel.increase();
    this.currentCoin.resetCoin();
    this.#restart();
  }

  // 게임을 재시작하는 메서드
  async #restart() {
    this.pause = true;
    await this.#flipAllCards();
    await this.#resetCards();
    this.start();
    this.pause = false;
  }

  // 모든 카드를 뒤집는 메서드
  #flipAllCards() {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        this.cards.forEach((card) => card.flip());
        resolve();
      }, CARD_FLIP_DELAY);
    });
  }

  // 카드를 초기화하는 메서드
  #resetCards() {
    return new Promise((resolve, _) => {
      const initialDelay = 1400;

      for (let col = 0; col < this.cols; col++) {
        setTimeout(() => {
          this.cards.forEach((card) => {
            if (card.col === col) card.reset();
          });
          if (col === this.cols - 1) {
            setTimeout(resolve, CARD_FLIP_DELAY);
          }
        }, initialDelay + CARD_FLIP_DELAY * 0.6 * col);
      }
    });
  }

  // BGM을 재생하는 메서드
  #playBGM() {
    this.bgm.play();
  }

  // 코인 사운드를 플레이하는 메서드
  #playCoinSound() {
    const coinSound = new Audio(getAudioUrl("coin.mp3"));
    coinSound.volume = 0.2;
    coinSound.play();
  }

  // 게임 성공 사운드를 플레이하는 메서드
  #playSuccessSound() {
    this.bgm.pause();

    const successSound = new Audio(getAudioUrl("success.mp3"));
    successSound.volume = 0.5;
    successSound.play();

    successSound.addEventListener("ended", () => {
      this.bgm.play();
    });
  }

  // 게임 실패 사운드를 플레이하는 메서드
  #playFailureSound() {
    this.bgm.pause();

    const failureSound = new Audio(getAudioUrl("failure.mp3"));
    failureSound.play();

    failureSound.addEventListener("ended", () => {
      this.bgm.play();
    });
  }
}

export default Game;
