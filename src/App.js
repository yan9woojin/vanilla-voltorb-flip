import Game from "./Game";
import { ROWS, COLS } from "./constants";

class App {
  game = new Game(ROWS, COLS);

  init() {
    const howToPlayBtn = document.getElementById("howToPlayBtn");
    const playBtn = document.getElementById("playBtn");
    const boardEl = document.getElementById("board");

    howToPlayBtn.addEventListener("click", this.#handleHowToPlayBtnClick.bind(this));
    playBtn.addEventListener("click", this.#handlePlayBtnClick.bind(this));
    boardEl.addEventListener("keydown", this.#handleBoardKeydown.bind(this));
  }

  // 게임 방법 버튼 클릭 이벤트 핸들러
  #handleHowToPlayBtnClick() {
    const howToPlayModal = document.getElementById("howToPlayModal");
    howToPlayModal.showModal();
  }

  // 게임 시작 버튼 클릭 이벤트 핸들러
  #handlePlayBtnClick() {
    this.#toggleUI();
    this.game.start();
  }

  // 게임 키다운 이벤트 핸들러
  #handleBoardKeydown(e) {
    e.preventDefault();

    const key = e.key;
    const isRefreshKey = ((e.ctrlKey || e.metaKey) && key === "r") || key === "F5";

    if (isRefreshKey) {
      location.reload();
      return;
    }

    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);

    const card = this.game.findCard(row, col);

    switch (key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        this.game.moveFocus(key, row, col);
        break;
      case " ":
        this.game.flipCard(card);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
        card.toggleMemo(key);
        break;
      case "Escape":
        card.clearMemo();
        break;
    }
  }

  // 화면을 전환하는 메서드
  #toggleUI() {
    const menuEl = document.getElementById("menu");
    const statusEl = document.getElementById("status");
    const boardEl = document.getElementById("board");

    menuEl.classList.toggle("hide");
    statusEl.classList.toggle("hide");
    boardEl.classList.toggle("hide");
  }
}

const app = new App();
app.init();
