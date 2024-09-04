/* 1. 선택자와 변수 정의 부분 */
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();
recognition.lang = "ko-KR"; // 음성 인식 언어 설정
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// 음성 인식 활성 상태를 추적하는 변수
let isRecognitionActive = false; // 음성 인식이 진행 중인지 여부를 저장

const voiceButton = document.querySelector(".voice-button");
const inputBoxSelect = document.querySelector(".input-box-select");

/* 2. 함수 정의 부분 */
// 음성 인식을 시작하는 함수
function startSpeechRecognition() {
  recognition.start();
  isRecognitionActive = true; // 음성 인식이 시작됨을 표시
  console.log("음성 입력을 기다리는 중...");
}

// 음성 인식을 종료하는 함수
function stopSpeechRecognition() {
  recognition.stop();
  isRecognitionActive = false; // 음성 인식이 종료됨을 표시
  console.log("음성 입력을 중단함...");
}

// 음성 음식 버튼 활성화 토글
function voiceButtonActiveToggle() {
  voiceButton.classList.toggle("active");
}

// 음성 인식 결과를 처리하는 함수
function handleSpeechResult(event) {
  const transcript = event.results[0][0].transcript;
  inputBoxSelect.value = transcript;
  console.log(`인식된 텍스트: ${transcript}`);
}

// 음성 인식 오류를 처리하는 함수
function handleSpeechError(event) {
  console.error(`오류 발생: ${event.error}`);
}

// 음성 인식이 끝났을 때의 함수
function handleSpeechEnd() {
  console.log("음성 인식 종료");
  isRecognitionActive = false; // 음성 인식 종료 상태로 업데이트
}

/* 3. DOMContentLoaded 이벤트 핸들링 */
document.addEventListener("DOMContentLoaded", function () {
  // 버튼 클릭 시 음성 인식 시작 또는 종료
  voiceButton.addEventListener("click", function () {
    if (isRecognitionActive) {
      stopSpeechRecognition(); // 음성 인식이 활성 상태라면 종료
    } else {
      startSpeechRecognition(); // 비활성 상태라면 시작
    }
  });
  voiceButton.addEventListener("click", voiceButtonActiveToggle);

  // 음성 인식 결과 및 오류 핸들링 설정
  recognition.addEventListener("result", handleSpeechResult);
  recognition.addEventListener("error", handleSpeechError);
  recognition.addEventListener("end", handleSpeechEnd);
});
