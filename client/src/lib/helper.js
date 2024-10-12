export const playPopUpSound = () => {
  const audio = new Audio('/messageNotify.mp3')
      audio.volume = 0.7;
      // Play the audio
      setTimeout(() => {
        audio.play();
      }, 0);
}
export const playPopUpSound2 = () => {
  const audio = new Audio('/livechat-129007.mp3')
      audio.volume = 0.3;
      // Play the audio
      setTimeout(() => {
        audio.play();
      }, 0);
}