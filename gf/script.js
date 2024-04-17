// JSON 파일에서 데이터를 불러오는 함수
async function loadDataFromJSON() {
    try {
        const responses = await fetch('./responses.json').then(response => response.json());
        const patterns = await fetch('./patterns.json').then(response => response.json());
        return { responses, patterns };
    } catch (error) {
        console.error("JSON 파일 로딩 오류:", error);
        return null;
    }
}

// 메시지를 전송하고 응답을 생성하는 함수
async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") {
        return;
    }

    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("p");
    userMessage.innerText = "You: " + userInput;
    chatBox.appendChild(userMessage);

    // JSON 데이터 불러오기
    const data = await loadDataFromJSON();
    if (data === null) {
        const botMessage = document.createElement("p");
        botMessage.innerText = "여자친구: 데이터 로딩 오류가 발생했습니다.";
        chatBox.appendChild(botMessage);
        return;
    }

    const { responses, patterns } = data;

    // 감정 상태 조절
    adjustEmotion(userInput);

    // 응답 생성
    const botMessage = document.createElement("p");
    botMessage.innerText = "여자친구: " + generateResponse(userInput, responses, patterns);
    chatBox.appendChild(botMessage);
    document.getElementById("user-input").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 감정 상태 및 카운트 전역 변수
let emotion = "neutral";
let count = 0;

// 감정 상태 조절 함수
function adjustEmotion(input) {
    // 입력에 따라 감정 상태를 결정하는 조건
    const emotionPatterns = {
        happy: /사랑해|좋아해|고마워|행복해|기뻐/,
        sad: /미안해|죄송해|슬퍼|상처/,
        angry: /화나|싫어|짜증/,
        surprised: /놀랐어|놀랍다/,
        calm: /차분해|평온해/
    };

    for (const [newEmotion, regex] of Object.entries(emotionPatterns)) {
        if (regex.test(input)) {
            emotion = newEmotion;
            console.log(`감정 상태: ${emotion}`);
            return;
        }
    }

    // 대화 횟수에 따라 감정 상태 초기화
    count++;
    if (count >= 10) {
        emotion = "neutral";
        count = 0;
        console.log("감정 상태 초기화: neutral");
    }
}

// 응답 생성 함수
function generateResponse(input, responses, patterns) {
    const cleanedInput = filterKoreanPostpositions(input);

    // 패턴에 따른 응답 선택
    for (const [category, patternList] of Object.entries(patterns)) {
        for (const pattern of patternList) {
            const regex = new RegExp(pattern);
            if (regex.test(cleanedInput)) {
                console.log(`매칭된 패턴: ${category}`);

                const responseCategory = responses[emotion] || responses['neutral'];
                const responseOptions = responseCategory[category] || responseCategory['neutral'];

                // 응답 선택 및 반환
                return responseOptions[Math.floor(Math.random() * responseOptions.length)];
            }
        }
    }

    // 매칭되지 않는 경우 기본 응답 반환
    return "이해하지 못했어요.";
}

// 한국어에서 조사를 제거하는 함수
function removeKoreanPostpositions(input) {
    const postpositions = /[은는이가를의으로에도고]/g;
    return input.replace(postpositions, "").trim();
}

// 한국어 조사를 식별하고 제거하는 함수
function filterKoreanPostpositions(input) {
    // 한국어 조사 목록
    const postpositions = [
        '은', '는', '이', '가', '를', '의',
        '으로', '에도', '고', '와', '와서',
        '부터', '까지'
    ];
    
    // 입력 문자열을 공백을 기준으로 단어 토큰화
    const tokens = input.split(/\s+/);
    
    // 조사를 제거하고 필터링된 결과를 저장할 리스트
    const filteredTokens = tokens.filter(token => {
        // 토큰이 조사 목록에 포함되지 않으면 필터링된 결과에 추가
        return !postpositions.includes(token);
    });
    
    // 필터링된 결과를 하나의 문자열로 합침
    const filteredInput = filteredTokens.join(" ");
    console.log(filteredInput);
    return filteredInput;
}
