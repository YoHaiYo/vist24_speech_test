// 1. 선택자와 변수 정의 부분
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();
recognition.lang = "ko-KR"; // 음성 인식 언어 설정
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const voiceButton = document.querySelector(".voice-button");
const inputBox = document.querySelector(".input-box");

// 2. 함수 정의 부분
// 음성 인식을 시작하는 함수
function startSpeechRecognition() {
  voiceButton.classList.toggle("active");
  recognition.start();
  console.log("음성 입력을 기다리는 중...");
}

// 음성 인식 결과를 처리하는 함수
function handleSpeechResult(event) {
  const transcript = event.results[0][0].transcript;
  inputBox.value = transcript;
  console.log(`인식된 텍스트: ${transcript}`);
}

// 음성 인식 오류를 처리하는 함수
function handleSpeechError(event) {
  console.error(`오류 발생: ${event.error}`);
}

// 음성 인식이 끝났을 때의 함수
function handleSpeechEnd() {
  console.log("음성 인식 종료");
  voiceButton.classList.remove("active");
}

// 3. DOMContentLoaded 이벤트 핸들링 (간결하게)
document.addEventListener("DOMContentLoaded", function () {
  // 버튼 클릭 시 음성 인식 시작
  voiceButton.addEventListener("click", startSpeechRecognition);

  // 음성 인식 결과 및 오류 핸들링 설정
  recognition.addEventListener("result", handleSpeechResult);
  recognition.addEventListener("error", handleSpeechError);
  recognition.addEventListener("end", handleSpeechEnd);
});
