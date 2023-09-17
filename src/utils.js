/* 0 이상 max 미만의 랜덤한 정수를 반환하는 함수 */
export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export const getAudioUrl = (path) => {
  return new URL(`/assets/audios/${path}`, import.meta.url).href;
};
