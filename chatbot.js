document.addEventListener("DOMContentLoaded", function () {
  /// ------- 변수 및 선택자 정의부 ---------
  const inputBox = document.querySelector(".input-box");
  const voiceButton = document.querySelector(".voice-button");
  const chatContainer = document.querySelector(".chat__container");
  const chatWrapper = document.querySelector(".chat__wrapper");
  const sendButton = document.querySelector(".send-button");
  const categorySelect = document.querySelectorAll(".category-dropdown-select");
  const warningText = document.querySelectorAll(".warning-text");
  const chatSelectDoneButton = document.querySelectorAll(
    ".chat__select-done-button"
  );
  const doneButton = document.querySelector(".button-container__button.done");
  const editButton = document.querySelector(".edit-button__container button");
  const continueButton = document.querySelector(
    ".button-container__button.continue"
  );
  /// 자주쓰는 ui 변수화
  const beforeHomeBtn = `
    <button class="chat__reset-button prev">
      <span>이전으로</span
      ><svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 8L3.29289 8.70711L2.58579 8L3.29289 7.29289L4 8ZM9 20C8.44772 20 8 19.5523 8 19C8 18.4477 8.44772 18 9 18L9 20ZM8.29289 13.7071L3.29289 8.70711L4.70711 7.29289L9.70711 12.2929L8.29289 13.7071ZM3.29289 7.29289L8.29289 2.29289L9.70711 3.70711L4.70711 8.70711L3.29289 7.29289ZM4 7L14.5 7L14.5 9L4 9L4 7ZM14.5 20L9 20L9 18L14.5 18L14.5 20ZM21 13.5C21 17.0898 18.0898 20 14.5 20L14.5 18C16.9853 18 19 15.9853 19 13.5L21 13.5ZM14.5 7C18.0899 7 21 9.91015 21 13.5L19 13.5C19 11.0147 16.9853 9 14.5 9L14.5 7Z"
          fill="#33363F"
        />
      </svg>
    </button>
    <button class="chat__reset-button home">
      <span>처음으로</span
      ><svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.27446 10.1262C5 10.7229 5 11.4018 5 12.7595V16.9999C5 18.8856 5 19.8284 5.58579 20.4142C6.11733 20.9457 6.94285 20.9949 8.5 20.9995V16C8.5 14.8954 9.39543 14 10.5 14H13.5C14.6046 14 15.5 14.8954 15.5 16V20.9995C17.0572 20.9949 17.8827 20.9457 18.4142 20.4142C19 19.8284 19 18.8856 19 16.9999V12.7595C19 11.4018 19 10.7229 18.7255 10.1262C18.4511 9.52943 17.9356 9.08763 16.9047 8.20401L15.9047 7.34687C14.0414 5.74974 13.1098 4.95117 12 4.95117C10.8902 4.95117 9.95857 5.74974 8.09525 7.34687L7.09525 8.20401C6.06437 9.08763 5.54892 9.52943 5.27446 10.1262ZM13.5 20.9999V16H10.5V20.9999H13.5Z"
          fill="#222222"
        />
      </svg>
    </button>
    `;
  const staticUrlAvatar = `<img src='./images/avatar.png' alt="avatar"/>`;

  /// url에서 비자 카테고리읽어오기
  // 현재 URL 경로를 가져옴
  const path = window.location.pathname;
  // URL 경로를 '/' 기준으로 분할
  const pathSegments = path.split("/");
  // 마지막 세그먼트(즉, category_id)를 변수에 저장
  const initCategoryId = pathSegments[pathSegments.length - 2];
  // console.log('categoryId', categoryId, typeof categoryId)

  /// 받아온 api 데이터 전역 관리용 변수
  let lastPickedCategoryId; // 5단계선택시 categoryId 저장할 전역변수
  let lastPickedWork; // 5단계에서 선택한 업무

  /// ----- 함수 정의부 -----
  // 시작 시 최초 접속 메시지 및 1단계 표시
  loadNextCategory(2, initCategoryId); // 첫 데이터가져오기 (첫 데이터는 categoryId까지 전달해야되서 걍 함수 새로 뺌)
  showInitialMessage(); // 첫 메시지 UI가져오기
  // 시작시부터  있는 2단계 다음 버튼클릭시 하위 카테고리 로드
  document
    .querySelector("#step3btn")
    .addEventListener("click", async function () {
      const selectedValue = document.querySelector(
        ".search-bar__category-dropdown-select.step3"
      ).value;
      // const selectedValue = 1
      if (selectedValue !== "업무를 선택해 주세요") {
        await loadNextCategory(3, selectedValue); // 하위 카테고리 로드
      }
    });

  // 시작 시 채팅창 맨 아래로 이동
  // chatContainer.scrollTop = chatContainer.scrollHeight;

  // 버튼 클릭 이벤트 처리
  document.addEventListener("click", function (event) {
    // 버튼 공통 처리들
    if (event.target.classList.contains("chat__select-done-button")) {
      const parentSelect = event.target
        .closest(".chat__select")
        .querySelector("select");
      const selectedValue = parentSelect.value;
      // 선택된 option 태그를 가져옴
      const selectedOption = parentSelect.options[parentSelect.selectedIndex];
      // 선택된 option 태그의 텍스트를 가져옴
      const selectedText = selectedOption.text;

      // 카테고리에 선택된 값이 없을 경우 1초간 빨간색으로 경고
      if (selectedValue === "업무를 선택해 주세요") {
        const warningText = event.target
          .closest(".chat__select")
          .querySelector(".warning-text");
        warningText.style.color = "red";

        setTimeout(() => {
          warningText.style.color = "";
        }, 1000);

        return;
      }

      // 매 스탭마다 선택한 option을 사용자 메시지로 보내기
      sendMessage(selectedText);
      // sendCategory(selectedValue); // 카테고리 전송 API 호출

      // 단계별 버튼 클릭시 다음 단계 로드 (동적으로 생성되는 태그라 이렇게 부모요소에 이벤트리스터 설정 후 이벤트위임함)
      if (event.target.id === "step3btn") {
        showStep(3);
      }
      if (event.target.id === "step4btn") {
        showStep(4);
      }
      if (event.target.id === "step5btn") {
        showStep(5);
      }
    }

    // '처음으로' 버튼 클릭 시 초기상태로
    if (
      event.target.classList.contains("chat__reset-button") &&
      event.target.classList.contains("home")
    ) {
      resetToInitial();
    }

    // '이전으로' 버튼 클릭 시 바로 전 상태로
    if (
      event.target.classList.contains("chat__reset-button") &&
      event.target.classList.contains("prev")
    ) {
      returnToBefore();
    }

    // '서류작성 신청', '업무대행 신청' 버튼 클릭 후 입력폼 나오게하기
    if (event.target.classList.contains("last-step__button")) {
      showWriteDocuments();
    }

    // 서류작성에서 '취소' 버튼 클릭 시 바로 전 상태로
    if (
      event.target.classList.contains("button-container__button") &&
      event.target.classList.contains("cancel")
    ) {
      returnToBefore();
    }

    // 서류작성에서 '완료' 버튼 클릭 시 확인창으로
    if (
      event.target.classList.contains("button-container__button") &&
      event.target.classList.contains("done")
    ) {
      // 두 필수 입력값을 가져오기
      const nameInput = document.querySelector('input[name="name"]');
      const phoneNumberInput = document.querySelector(
        'input[name="phoneNumber"]'
      );

      // 인풋 값이 비어있지 않은지 확인
      if (
        nameInput.value.trim() !== "" &&
        phoneNumberInput.value.trim() !== ""
      ) {
        showWriteDocumentsCheck();
      } else {
        // 값이 비어있을 때의 처리 (선택 사항)
        alert("필수 입력 정보를 모두 입력해 주세요.");
      }
    }

    // 서류작성 - 완료 - 신청진행 버튼 클릭 시 입금확인 띄우기
    if (
      event.target.classList.contains("button-container__button") &&
      event.target.classList.contains("continue")
    ) {
      showCheckDeposit();
    }

    // 서류작성 - 완료 - 신청진행 - 입금완료 버튼 클릭 시 최종메시지 띄우기
    if (
      event.target.classList.contains("button-container__button") &&
      event.target.classList.contains("complete")
    ) {
      showCompleteDeposit();
    }

    // 서류작성 - 완료 - 수정하기 버튼 클릭시 span태그 input로
    if (event.target.closest(".edit-button__container button")) {
      const chatSelect = event.target.closest(".chat__select");
      const filledTexts = chatSelect.querySelectorAll(
        ".filled-text, input[type='text']"
      );

      filledTexts.forEach((element) => {
        if (element.tagName.toLowerCase() === "span") {
          // span을 input으로 변환
          const input = document.createElement("input");
          input.type = "text";
          input.value = element.textContent;
          input.classList.add("filled-text"); // 추가한 클래스 유지
          element.parentNode.replaceChild(input, element);
        } else if (element.tagName.toLowerCase() === "input") {
          // input을 span으로 변환
          const span = document.createElement("span");
          span.classList.add("filled-text"); // 기존 클래스 유지
          span.textContent = element.value;
          element.parentNode.replaceChild(span, element);
        }
      });
    }

    // "수정하기" 버튼의 텍스트를 "수정완료"로 변경
    // editButton = event.target
    //   .closest(".edit-button__container")
    //   .querySelector("button");
    // editButton.innerHTML = `
    // 수정완료<svg class="info-down-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    // <path d="M18 9L12 15L6 9" stroke="#fff" stroke-width="3"/>
    // </svg>
    // `;
  });

  // 채팅창 초기화 및 초기 메시지 표시
  function resetToInitial() {
    chatContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // chatbots NodeList의 길이가 1보다 큰 경우만 실행(즉 첫 메시지 빼고 삭제)
    const chatChatbots = document.querySelectorAll(".chat__chatbot");
    if (chatChatbots.length > 1) {
      // 첫 번째 .chat__chatbot 요소를 제외한 나머지 요소를 삭제
      for (let i = 1; i < chatChatbots.length; i++) {
        chatChatbots[i].remove();
      }
    }
    // 모든 유저 메시지 삭제
    const chatUsers = document.querySelectorAll(".chat__user");
    chatUsers.forEach(function (user) {
      user.remove(); // 각각의 .chat__user 요소를 삭제
    });
  }

  // 이전 채팅창으로 돌리기
  function returnToBefore() {
    // 가장 마지막 .chat__chatbot 요소를 선택하고 삭제
    const chatChatbots = document.querySelectorAll(".chat__chatbot");
    if (chatChatbots.length > 0) {
      const lastChatbot = chatChatbots[chatChatbots.length - 1];
      lastChatbot.remove();
    }

    // 가장 마지막 .chat__user 요소를 선택하고 삭제
    const chatUsers = document.querySelectorAll(".chat__user");
    if (chatUsers.length > 0) {
      const lastUser = chatUsers[chatUsers.length - 1];
      lastUser.remove();
    }
  }

  // 메시지 서버통신
  async function server_chat(userMessage) {
    // 더미 데이터
    let data = {
      assistant_message: "HI",
    };

    // 서버 통신 구현 부분

    if (data && userMessage) {
      // AI 챗봇 메시지 가져오기
      const aiMessage = data.assistant_message;

      if (aiMessage !== "") {
        return aiMessage;
      } else {
        console.log("aiMessage가 없습니다.");
        return null;
      }
    } else {
      console.error("Error response");
      return null;
    }
  }

  // 클라이언트 메시지 전송 및 서버 응답 채팅창에 표시
  async function sendMessage(text) {
    const messageText = text || inputBox.value.trim();

    if (messageText !== "") {
      // 사용자 메시지 생성
      const userInput = messageText;

      const userMessage = document.createElement("div");
      userMessage.classList.add("chat__user");

      const userMessageContainer = document.createElement("div");
      userMessageContainer.classList.add("chat__user-text-container");

      const userMessageText = document.createElement("div");
      userMessageText.classList.add("chat__user-text");
      userMessageText.textContent = userInput;

      userMessageContainer.appendChild(userMessageText);
      userMessage.appendChild(userMessageContainer);

      chatWrapper.appendChild(userMessage);

      const aiMessage = await server_chat(userInput);
    }

    // 입력창 초기화
    inputBox.value = "";

    // 스크롤 맨 아래로 이동
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // 최초 접속 메시지 표시하는 함수
  function showInitialMessage() {
    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    const avatarImage = document.createElement("div");

    avatarImage.innerHTML = staticUrlAvatar;

    const chatText = document.createElement("div");
    chatText.classList.add("chat__text");
    chatText.innerHTML = `<span
    >VISA24입니다. 무엇을 도와드릴까요? 아래 비자 업무를
    선택하거나 궁금한 사항을 입력해 주세요.</span
  >`;

    const firstStep = document.createElement("div");
    firstStep.classList.add("chat__text");
    firstStep.innerHTML = `
        <div class="chat__text">
                <div class="chat__select">
                  <span class="chat__select-text"
                    >2단계 아래의 VISA 코드를 선택해 주세요.</span
                  >
                  <div class="divCol">
                    <!-- 카테고리 드롭다운 -->
                    <div class="category-dropdown">
                      <select
                        id="categorySelect"
                        class="search-bar__category-dropdown-select step3"
                      >
                      </select>
                      <svg
                        class="category-dropdown-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.8079 14.7695L8.09346 10.3121C7.65924 9.79109 8.02976 9 8.70803 9L15.292 9C15.9702 9 16.3408 9.79108 15.9065 10.3121L12.1921 14.7695C12.0921 14.8895 11.9079 14.8895 11.8079 14.7695Z"
                          fill="#1b3133"
                        />
                      </svg>
                    </div>
                    <span class="warning-text"
                      >* 카테고리를 선택 후 입력해 주세요.</span
                    >
                  </div>
                  <button
                    class="chat__select-done-button"
                    id="step3btn"
                  >
                    다음
                  </button>
                </div>
              </div>
    `;
    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(chatText);
    chatTextContainer.appendChild(firstStep);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);
  }

  // N단계 표시함수
  function showStep(level) {
    console.log("showStep 시작");
    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    // 아바타 이미지 생성
    const avatarImage = document.createElement("div");
    avatarImage.innerHTML = staticUrlAvatar;

    // 텍스트 생성
    const step = document.createElement("div");
    step.classList.add("chat__text");
    step.innerHTML = `
    <div class="chat__select">
    <span class="chat__select-text"
      >${level} 단계 아래의 VISA 코드를 선택해 주세요.</span
    >
    <div class="divCol">
      <!-- 카테고리 드롭다운 -->
      <div class="category-dropdown">
        <select
          id="categorySelect"
          class="search-bar__category-dropdown-select step${level + 1}"
        >
          <option
            value="업무를 선택해 주세요"
            selected
            hidden
          >
            업무를 선택해 주세요
          </option>
        </select>
        <svg
          class="category-dropdown-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.8079 14.7695L8.09346 10.3121C7.65924 9.79109 8.02976 9 8.70803 9L15.292 9C15.9702 9 16.3408 9.79108 15.9065 10.3121L12.1921 14.7695C12.0921 14.8895 11.9079 14.8895 11.8079 14.7695Z"
            fill="#1b3133"
          />
        </svg>
      </div>
      <span class="warning-text">* 카테고리를 선택 후 입력해 주세요.</span>
    </div>
    <button
      class="chat__select-done-button"
      id="step${level + 1}btn"
    >
      다음
    </button>
  </div>
    `;

    // 이전, 처음으로 버튼
    const chatReset = document.createElement("div");
    chatReset.classList.add("chat__reset");
    chatReset.innerHTML = beforeHomeBtn;

    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(step);
    chatTextContainer.appendChild(chatReset);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);

    // '다음' 버튼클릭시 하위 카테고리 로드 되도록 처리
    document
      .querySelector(`#step${level + 1}btn`)
      .addEventListener("click", async function () {
        console.log("#stepbtn 클릭됨");
        const selectedValue = document.querySelector(
          `.search-bar__category-dropdown-select.step${level + 1}`
        ).value;
        console.log("selectedValue", selectedValue);
        lastPickedCategoryId = selectedValue;
        if (selectedValue !== "업무를 선택해 주세요") {
          await loadNextCategory(level + 1, selectedValue); // 하위 카테고리 로드
          // 5단계까지 완료시 서류 정보 데이터 호출
          if (level === 5) {
            // fetchDocumentDetails(selectedValue) // 서류정보 api 데이터가져오기
            showDocuments(selectedValue, initCategoryId); // 서류정보 채팅 UI

            const chatContainer = document.querySelector(".chat__container");
            chatContainer.scrollTop = chatContainer.scrollHeight; // 스크롤 하단으로
          }
        }
      });
  }

  // 서류정보 채팅 표기함수
  function showDocuments(categoryId, initCategoryId) {
    console.log("showDocuments 시작");

    fetchDocumentDetails(categoryId); // 서류정보 api 데이터가져와서 ui로 바꾸기

    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    // 아바타 이미지 생성
    const avatarImage = document.createElement("div");
    avatarImage.innerHTML = staticUrlAvatar;

    // 텍스트 생성
    const step = document.createElement("div");
    step.classList.add("chat__text");

    // 업무대행 버튼은 VISA(해외) 일때 없애기
    console.log("initCategoryId", initCategoryId);
    const agentButton =
      initCategoryId !== "2"
        ? '<button class="last-step__button">업무대행 신청</button>'
        : "";

    step.innerHTML = `
        <div class="chat__select last-content">                        
            <span>요청하신 [업무]의 준비 서류는 아래와 같습니다.</span>
            <span>1. 출입국외국인청 신청 시 준비하셔야 할 양식서류</span>
            <p>
                • 표기가 있는 버튼은 클릭 시 양식 다운로드 가능합니다.
            </p>
            
            <div data-api="templates"></div>                        
            
            <div class="docsDiv" data-api="docsDiv">
                <span>2. 출입국외국인청 신청 시 준비하셔야 할 첨부서류</span>
<!--                여기에 첨부서류 리스트 들어감.-->
            </div>
            <div class="agentDiv">
                <span>3. 대행 신청</span>
                <span>• 서류 작성 신청</span>
                <p>- 양식 서류를 대신하여 작성해 드립니다.</p>
                <p>- (출입국에 본인 직접 접수)</p>
                <p>
                
                <div class="d-flex">
                  <p>- 가격 :</p>                 
                  <p data-api="document_fee"></p>
                  <p>원</p>
                </div>
                
                </p>
                <span>• 업무 대행 신청</span>
                <p>- 양식 서류를 대신 작성 및 접수해 드립니다.</p>
                <p>- (행성사 접수)</p>                
                <div class="d-flex">
                  <p>- 가격(출입국 수수료 별도) : </p>                 
                  <p data-api="service_fee"></p>
                  <p>원</p>
                </div>
            </div>
            <div class="button-container">
                <button class="last-step__button">서류작성 신청</button>
                ${agentButton}
            </div>
        </div>    
    `;

    // 이전, 처음으로 버튼
    const chatReset = document.createElement("div");
    chatReset.classList.add("chat__reset");
    chatReset.innerHTML = beforeHomeBtn;

    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(step);
    chatTextContainer.appendChild(chatReset);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);
  }

  // 서류작성 신청 클릭시 입력폼 나오는 함수 (일단 업무대행도 이걸로 씀)
  function showWriteDocuments() {
    console.log("showWriteDocuments 시작");
    sendMessage("서류작성 신청");

    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    // 아바타 이미지 생성
    const avatarImage = document.createElement("div");
    avatarImage.innerHTML = staticUrlAvatar;

    // 텍스트 생성
    const step = document.createElement("div");
    step.classList.add("chat__text");
    step.innerHTML = `
       <div class="chat__select">
                        <span>서류작성 진행을 위해 개인정보가 필요합니다.<br>하단 항목에 필요한 정보를 입력해 주세요.</span>
                        <!-- 필수 입력 -->
                        <div class="chat__input-container">
                            <span>*필수 입력</span>
                            <div class="chat__input">
                                <span>*여권상 성과 이름</span>
                                <input type="text" class="input-required placeholder-red" name="name" placeholder="필수 입력 개인정보입니다.">
                            </div>
                            <div class="chat__input">
                                <span>*전화번호</span>
                                <input type="text" class="input-required placeholder-red" name="phoneNumber" placeholder="필수 입력 개인정보입니다.">
                            </div>
                        </div>
                        <!-- 선택 입력 -->
                        <div class="chat__input-container">
                            <span>선택 입력</span>
                            <div class="chat__input">
                                <span>국적</span>
                                <input type="text" name="nationality">
                            </div>
                            <div class="chat__input">
                                <span>여권번호</span>
                                <input type="text" name="passportNumber">
                            </div>
                            <div class="chat__input">
                                <span>여권발급일자</span>
                                <input type="text" name="passportIssueDate">
                            </div>
                            <div class="chat__input">
                                <span>여권유효기간</span>
                                <input type="text" name="passportExpiryDate">
                            </div>
                            <div class="chat__input">
                                <span>외국인등록번호</span>
                                <input type="text" name="alienRegistrationNumber">
                            </div>
                            <div class="chat__input">
                                <span>주소</span>
                                <input type="text" name="address">
                            </div>
                            <div class="chat__input">
                                <span>체류기간만료일자</span>
                                <input type="text" name="visaExpiryDate">
                            </div>
                            <div class="chat__input">
                                <span>VISA_TYPE</span>
                                <input type="text" name="visaType">
                            </div>
                        </div>
                        <!-- 취소/완료 버튼 -->
                        <div class="button-container">
                            <button class="button-container__button cancel">취소</button>
                            <button class="button-container__button done">완료</button>
                        </div>
                    </div>
    `;

    // 이전, 처음으로 버튼
    const chatReset = document.createElement("div");
    chatReset.classList.add("chat__reset");
    chatReset.innerHTML = beforeHomeBtn;

    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(step);
    chatTextContainer.appendChild(chatReset);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);

    // 모든 태그가 그려졌으면 스크롤 최하단으로
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // 서류작성에서 완료 클릭시 확인창 나오는 함수
  function showWriteDocumentsCheck() {
    console.log("showWriteDocumentsCheck 시작");
    sendMessage("서류작성 신청 완료");

    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    // 아바타 이미지 생성
    const avatarImage = document.createElement("div");
    avatarImage.innerHTML = staticUrlAvatar;

    // 입력된 값을 가져옴
    const name = document.querySelector('input[name="name"]').value;
    const phoneNumber = document.querySelector(
      'input[name="phoneNumber"]'
    ).value;
    const nationality = document.querySelector(
      'input[name="nationality"]'
    ).value;
    const passportNumber = document.querySelector(
      'input[name="passportNumber"]'
    ).value;
    const passportIssueDate = document.querySelector(
      'input[name="passportIssueDate"]'
    ).value;
    const passportExpiryDate = document.querySelector(
      'input[name="passportExpiryDate"]'
    ).value;
    const alienRegistrationNumber = document.querySelector(
      'input[name="alienRegistrationNumber"]'
    ).value;
    const address = document.querySelector('input[name="address"]').value;
    const visaExpiryDate = document.querySelector(
      'input[name="visaExpiryDate"]'
    ).value;
    const visaType = document.querySelector('input[name="visaType"]').value;

    // 텍스트 생성
    const step = document.createElement("div");
    step.classList.add("chat__text");
    step.innerHTML = `
        <div class="chat__select">
            <span>입력하신 개인 정보로 서류작성을 진행합니다.<br>입력하신 개인정보를 확인해주세요.<br>우측 아이콘을 클릭해 내용을 수정할 수 있습니다.</span>
            <div class="edit-button__container">
                <button>
                    수정하기
                    <svg class="info-edit-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2047 10.7957L19.0007 8.9997C19.546 8.45445 19.8186 8.18182 19.9644 7.88773C20.2416 7.32818 20.2416 6.67122 19.9644 6.11167C19.8186 5.81757 19.546 5.54495 19.0007 4.9997C18.4555 4.45445 18.1829 4.18182 17.8888 4.03609C17.3292 3.7588 16.6723 3.7588 16.1127 4.03609C15.8186 4.18182 15.546 4.45445 15.0007 4.9997L13.1821 6.81835C14.146 8.46895 15.5321 9.84451 17.2047 10.7957ZM11.7276 8.27281L4.85713 15.1433C4.43207 15.5684 4.21954 15.7809 4.0798 16.042C3.94007 16.3031 3.88112 16.5978 3.76323 17.1873L3.14784 20.2643C3.08131 20.5969 3.04805 20.7632 3.14266 20.8578C3.23727 20.9524 3.40357 20.9191 3.73618 20.8526L6.81316 20.2372C7.40262 20.1193 7.69734 20.0604 7.95844 19.9206C8.21954 19.7809 8.43207 19.5684 8.85713 19.1433L15.7465 12.2539C14.1249 11.2383 12.7532 9.87597 11.7276 8.27281Z" fill="#fff"></path>
                    </svg>
                </button>
            </div>
            <!-- 필수 입력 -->
            <div class="chat__input-container">
                <span>*필수 입력</span>
                <div class="chat__input">
                    <span>*여권상 성과 이름</span>
                    <span class="filled-text">${name}</span>
                </div>
                <div class="chat__input">
                    <span>*전화번호</span>
                    <span class="filled-text">${phoneNumber}</span>
                </div>
            </div>
            <!-- 선택 입력 -->
            <div class="chat__input-container">
                <span>선택 입력</span>
                <div class="chat__input">
                    <span>국적</span>
                    <span class="filled-text">${nationality}</span>
                </div>
                <div class="chat__input">
                    <span>여권번호</span>
                    <span class="filled-text">${passportNumber}</span>
                </div>
                <div class="chat__input">
                    <span>여권발급일자</span>
                    <span class="filled-text">${passportIssueDate}</span>
                </div>
                <div class="chat__input">
                    <span>여권유효기간</span>
                    <span class="filled-text">${passportExpiryDate}</span>
                </div>
                <div class="chat__input">
                    <span>외국인등록번호</span>
                    <span class="filled-text">${alienRegistrationNumber}</span>
                </div>
                <div class="chat__input">
                    <span>주소</span>
                    <span class="filled-text">${address}</span>
                </div>
                <div class="chat__input">
                    <span>체류기간만료일자</span>
                    <span class="filled-text">${visaExpiryDate}</span>
                </div>
                <div class="chat__input">
                    <span>VISA_TYPE</span>
                    <span class="filled-text">${visaType}</span>
                </div>
            </div>
            <span>입력하신 정보로 서류작성 신청을 진행하시겠습니까?</span>
            <!-- 취소/신청 진행 버튼 -->
            <div class="button-container">
                <button class="button-container__button cancel">취소</button>
                <button class="button-container__button continue">신청 진행</button>
            </div>
        </div> 
    `;

    // 이전, 처음으로 버튼
    const chatReset = document.createElement("div");
    chatReset.classList.add("chat__reset");
    chatReset.innerHTML = beforeHomeBtn;

    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(step);
    chatTextContainer.appendChild(chatReset);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);
  }

  // 서류작성 - 완료 - 신청진행 버튼 클릭 시 입금확인 띄우기
  function showCheckDeposit() {
    console.log("showCheckDeposit 시작");
    sendMessage("신청 진행");
    console.log("lastPickedCategoryId : ", lastPickedCategoryId);

    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    // 아바타 이미지 생성
    const avatarImage = document.createElement("div");
    avatarImage.innerHTML = staticUrlAvatar;

    // 텍스트 생성
    const step = document.createElement("div");
    step.classList.add("chat__text");
    step.innerHTML = `
        <div class="chat__select">
            <span>신청하신 업무와 행정사 정보를 확인하신 후 계좌번호로 비용을 입금해 주시기 바랍니다.</span>
            <span>입금 진행 후 아래 [입금 완료] 버튼을 클릭해 주시면 신청이 완료됩니다.</span>
            <div class="colDiv">
                <span class="bold-text">* 업무 내용 : 근무처 추가</span>
                <div class="d-flex">
                  <span>* 업무 대행 비용 : </span>                 
                  <span data-api="service_fee"></span>
                  <span>원</span>
                </div>
            </div>
            <div class="colDiv">
                <span>1. 대행 기관 행정사 정보</span>
                <span>• 기관명 : </span>
                <span>• 예금주 명 : </span>
                <span>• 계좌번호 : </span>
            </div>
            <button class="button-container__button complete">입금완료</button>
        </div>
    `;

    // 이전, 처음으로 버튼
    const chatReset = document.createElement("div");
    chatReset.classList.add("chat__reset");
    chatReset.innerHTML = beforeHomeBtn;

    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(step);
    chatTextContainer.appendChild(chatReset);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);

    // ui에 데이터 붙여넣기
    fetchDocumentCheck(lastPickedCategoryId);
  }

  // 서류작성 - 완료 - 신청진행 - 입금완료 버튼 클릭 시 최종메시지 띄우기
  function showCompleteDeposit() {
    console.log("showCompleteDeposit 시작");
    sendMessage("입금완료");

    const chatChatbot = document.createElement("div");
    chatChatbot.classList.add("chat__chatbot");

    const chatTextContainer = document.createElement("div");
    chatTextContainer.classList.add("chat__text-container");

    // 아바타 이미지 생성
    const avatarImage = document.createElement("div");
    avatarImage.innerHTML = staticUrlAvatar;

    // 텍스트 생성
    const step = document.createElement("div");
    step.classList.add("chat__text");
    step.innerHTML = `
        <div class="chat__select">
              <span>접수되었습니다.</span>
              <span>신청서류는 출입국외국인청 업무매뉴얼 기반으로 구성된 세트입니다. 신청접수시 또는 심사시 심사공무원의 재량으로 담당 행정사 확인 후 연락드리겠습니다.</span>
          </div>
    `;

    // 이전, 처음으로 버튼
    const chatReset = document.createElement("div");
    chatReset.classList.add("chat__reset");
    chatReset.innerHTML = beforeHomeBtn;

    chatChatbot.appendChild(avatarImage);
    chatTextContainer.appendChild(step);
    chatTextContainer.appendChild(chatReset);
    chatChatbot.appendChild(chatTextContainer);
    chatWrapper.appendChild(chatChatbot);
  }

  // 입력창 엔터키 이벤트
  inputBox.addEventListener("keydown", function (e) {
    if (e.isComposing) return;
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // 전송 버튼 클릭 시 메시지 전송
  sendButton.addEventListener("click", function () {
    sendMessage();
  });

  // 음성인식 버튼 클릭 시 active
  // voiceButton.addEventListener("click", function () {
  //   voiceButton.classList.toggle("active");
  // });

  // 필수 개인정보 미입력 시 경고 메시지 표시
  doneButton.addEventListener("click", function () {
    const requiredInputs = document.querySelectorAll(".input-required");

    requiredInputs.forEach((input) => {
      if (input.value.trim() === "") {
        input.placeholder = "필수 입력 개인정보입니다."; // placeholder 변경
        input.classList.add("placeholder-red"); // 빨간색 placeholder 스타일 적용
      }
    });
  });

  continueButton.addEventListener("click", function () {
    sendPersonalInfo();
  });
});

/// ---------- api 관련 함수들 ------------
// 다음 카테고리를 로드하는 함수
async function loadNextCategory(level, parentId = null) {
  const url = parentId
    ? `/api/categories/${level}/${parentId}/`
    : `/api/categories/${level}/`;

  console.log("api url : ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
    const data = await response.json();

    // const select = categorySelects[level - 1];
    // 현재 step단계를 클래스에 지정해서 선택하기
    const select = document.querySelector(
      `.search-bar__category-dropdown-select.step${level + 1}`
    );

    if (!select) return;

    select.innerHTML = `<option value="업무를 선택해 주세요" selected hidden>업무를 선택해 주세요</option>`;
    data.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("카테고리 데이터를 가져오는 중 오류 발생:", error);
  }
}

// 준비서류 단계에서 서류정보들 가져와 UI구성 함수
async function fetchDocumentDetails(categoryId) {
  try {
    const response = await fetch(`/api/documents/${categoryId}/`);
    console.log("api url : ", `/api/documents/${categoryId}/`);
    if (!response.ok) throw new Error("데이터를 가져오는 데 실패했습니다.");
    const data = await response.json();
    console.log("api data : ", data);

    // HTML 요소에 데이터 적용
    document.querySelector('[data-api="document_fee"]').textContent =
      data.document_fee;
    document.querySelector('[data-api="service_fee"]').textContent =
      data.service_fee;
    // attachments 배열을 HTML 요소에 추가
    const attachmentsElement = document.querySelector('[data-api="templates"]');
    attachmentsElement.innerHTML = ""; // 기존 내용을 지우고 시작
    // 양식 버튼 생성
    data.templates.forEach((el) => {
      // <button> 요소 생성
      const button = document.createElement("button");
      button.type = "button";
      button.className = "last-step__button";

      // <span> 요소 생성 및 attachment_name 추가
      const span = document.createElement("span");
      span.textContent = el.template_name;

      // <span>을 <button> 안에 추가
      button.appendChild(span);
      // SVG 아이콘을 <span> 다음에 추가
      // 다운로드 아이콘 (검정)
      var downloadIcon = `
            <svg class="download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14L11.2929 14.7071L12 15.4142L12.7071 14.7071L12 14ZM13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5L13 5ZM6.29289 9.70711L11.2929 14.7071L12.7071 13.2929L7.70711 8.29289L6.29289 9.70711ZM12.7071 14.7071L17.7071 9.70711L16.2929 8.29289L11.2929 13.2929L12.7071 14.7071ZM13 14L13 5L11 5L11 14L13 14Z" fill="#33363F"></path>
                <path d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16" stroke="#33363F" stroke-width="2"></path>
            </svg>`;

      // 버튼 클릭 시 파일 다운로드 기능 추가
      if (el.is_downloadable && el.file !== "") {
        button.addEventListener("click", () => {
          const link = document.createElement("a");
          link.href = `/media/${el.file}`;
          link.download = el.template_name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
        // 다운 가능할때만 다운 아이콘 추가
        button.insertAdjacentHTML("beforeend", downloadIcon);
      } else {
        // 다운로드 불가능한 파일일 경우, 버튼을 비활성화 또는 다른 처리
        button.disabled = true;
      }

      // 완성된 <button>을 attachmentsElement에 추가
      attachmentsElement.appendChild(button);
    });

    // 첨부 서류 리스트 넣기
    data.attachments.forEach((el) => {
      const p = document.createElement("p");
      p.textContent = `• ${el.attachment_name}`;
      document.querySelector('[data-api="docsDiv"]').appendChild(p);
    });
  } catch (error) {
    console.error("서류 데이터를 가져오는 중 오류 발생:", error);
  }
}

// 준비서류 - 신청진행 단계에서 서류정보들 가져와 UI구성 함수
async function fetchDocumentCheck(lastPickedCategoryId) {
  try {
    const response = await fetch(`/api/documents/${lastPickedCategoryId}/`);
    console.log("api url : ", `/api/documents/${lastPickedCategoryId}/`);
    if (!response.ok) throw new Error("데이터를 가져오는 데 실패했습니다.");
    const data = await response.json();
    console.log("api data : ", data);

    // 마지막 채팅에서 데이터 ui로 적용
    const elements = document.querySelectorAll('[data-api="service_fee"]');
    const lastElement = elements[elements.length - 1];
    lastElement.textContent = data.service_fee;
  } catch (error) {
    console.error("서류 데이터를 가져오는 중 오류 발생:", error);
  }
}

async function sendCategory(category) {
  const requestData = { category };

  // const url = "endpoint"; // 실제 API 주소 입력
  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(requestData),
    // });
    // const result = await response.json();
    console.log("카테고리 전송 완료", requestData);
  } catch (e) {
    console.error(e);
  }
}

async function sendPersonalInfo() {
  // 입력값 가져오기
  const name = document.querySelector('input[name="name"]').value;
  const phoneNumber = document.querySelector('input[name="phoneNumber"]').value;
  const nationality = document.querySelector('input[name="nationality"]').value;
  const passportNumber = document.querySelector(
    'input[name="passportNumber"]'
  ).value;
  const passportIssueDate = document.querySelector(
    'input[name="passportIssueDate"]'
  ).value;
  const passportExpiryDate = document.querySelector(
    'input[name="passportExpiryDate"]'
  ).value;
  const alienRegistrationNumber = document.querySelector(
    'input[name="alienRegistrationNumber"]'
  ).value;
  const address = document.querySelector('input[name="address"]').value;
  const visaExpiryDate = document.querySelector(
    'input[name="visaExpiryDate"]'
  ).value;
  const visaType = document.querySelector('input[name="visaType"]').value;

  const requestData = {
    name,
    phoneNumber,
    nationality,
    passportNumber,
    passportIssueDate,
    passportExpiryDate,
    alienRegistrationNumber,
    address,
    visaExpiryDate,
    visaType,
  };

  // const url = "endpoint"; // 실제 API 주소 입력
  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(requestData),
    // });
    // const result = await response.json();
    console.log("개인정보 전송 완료", requestData);
  } catch (e) {
    console.error(e);
  }
}
