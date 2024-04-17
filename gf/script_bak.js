const XLSX = require('xlsx');

function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") {
        return;
    }
    var chatBox = document.getElementById("chat-box");
    var userMessage = document.createElement("p");
    userMessage.innerText = "You: " + userInput;
    chatBox.appendChild(userMessage);

    var botMessage = document.createElement("p");
    botMessage.innerText = "여자친구: " + generateResponse(userInput);
    chatBox.appendChild(botMessage);

    document.getElementById("user-input").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

var emotion = "중립"; // 초기 감정 상태
var count = 0; // 대화 횟수

// 감정 상태 조절 함수
function adjustEmotion(input) {

    // 입력에 따라 새로운 감정 상태 결정
    if (/사랑해|좋아해|고마워|행복해|기뻐/.test(input)) {
        emotion = "행복";
        console.log("감정 상태: 행복");
    } else if (/미안해|죄송해|슬퍼|상처/.test(input)) {
        emotion = "슬픔";
        console.log("감정 상태: 슬픔");
    } else if (/화나|싫어|짜증/.test(input)) {
        emotion = "화남";
        console.log("감정 상태: 화남");
    } else if (/놀랐어|놀랍다/.test(input)) {
        emotion = "놀람";
        console.log("감정 상태: 놀람");
    } else if (/차분해|평온해/.test(input)) {
        emotion = "평온";
        console.log("감정 상태: 평온");
    } else {
        console.log("감정 상태 유지");
    }

    if (count === 10) {
        count = 0;
        emotion = "중립";
        console.log("감정 상태 초기화: 중립");
    }


}
// 한국어에서 조사를 제거하는 함수
function removeKoreanPostpositions(input) {
    // 한국어 조사를 제거하는 정규식
    var postpositions = /[은는이가를의으로에도고]/g;
    return input.replace(postpositions, "").trim();
}

// 응답 생성 함수
function generateResponse(input) {
    // 사용자의 입력에서 한국어 조사를 제거
    var cleanedInput = removeKoreanPostpositions(input);

    // 다양한 패턴
    var patterns = {
        greetings: [/안녕/, /반가워/, /하이/],
        farewell: [/안녕히 가세요/, /잘 가요/],
        gfstatus: [/뭐해/],
        gfname: [/이름/, /성명/],
        gfage: [/몇 살/, /나이/],
        gfaddress: [/어디 살?/, /집/],
        compliments: [/예쁘/, /예뻐/, /섹시/],
        mood: [/기분/, /요즘 어때?/],
        jokes: [/재밌는 이야기/, /농담 좀 해봐/],
        neutral: [/./] // 기타 모든 입력에 대응하는 기본 패턴
    };

    // 감정 상태에 따른 응답 유형 정의
    var responses = {
        happy: {
            greetings: ["당신과 함께해서 행복해요! 🥰", "당신을 만나서 기뻐요! 😊", "좋은 날이에요! 😊"],
            farewell: ["안녕히 가세요! 😊", "다음에 또 봐요! 😊"],
            inquiry: ["제 이름은 여자친구예요! 😊", "나이와 주소는 비밀이에요! 😊"],
            compliments: ["칭찬 감사합니다! 😊", "당신도 멋져요! 😊"],
            mood: ["기분이 정말 좋네요! 당신은요? 😊", "오늘 기분이 최고예요! 😊"],
            jokes: ["웃긴 이야기를 해주세요! 😊", "재미있는 이야기를 기대하고 있어요! 😄"],
            neutral: ["그렇군요.", "알겠어요.", "음..."]
        },
        sad: {
            greetings: ["안녕하세요... 😔", "조금 우울한 날이에요... 😔"],
            farewell: ["안녕히 가세요... 😔", "잘 가요..."],
            inquiry: ["조금 힘드네요... 😔", "이름은 여자친구예요... 😔"],
            compliments: ["칭찬은 고맙지만... 😔", "마음이 무겁네요... 😔"],
            mood: ["조금 우울해요... 당신은요? 😔", "오늘 하루가 힘드네요... 😔"],
            jokes: ["지금 농담할 기분이 아니에요... 😔", "잠시 진지하게 이야기해볼까요?"],
            neutral: ["그렇군요.", "알겠어요.", "음..."]
        },
        angry: {
            greetings: ["안녕하세요! 😡", "오늘 기분이 별로에요! 😠"],
            farewell: ["안녕히 가세요! 😠", "다음에 봐요! 😠"],
            inquiry: ["왜 이렇게 물어보는 거예요? 😡", "제가 왜 알려줘야 하죠?"],
            compliments: ["감사합니다만... 😡", "좋아요!"],
            mood: ["기분이 별로에요! 😡", "당신 때문에 화가 나요!"],
            jokes: ["웃길 기분이 아니에요! 😡", "재밌는 얘기는 지금 못해요!"],
            neutral: ["그렇군요.", "알겠어요.", "음..."]
        },
        surprised: {
            greetings: ["안녕하세요! 😲", "세상에, 정말 놀랍네요! 😲"],
            farewell: ["안녕히 가세요! 😲", "다음에 또 봐요! 😲"],
            inquiry: ["정말 놀라운 일이네요! 😲", "이름은 여자친구예요! 😲"],
            compliments: ["칭찬 감사합니다! 😲", "당신도 멋져요! 😲"],
            mood: ["기분이 정말 놀라워요! 😲", "세상에, 정말 놀랍네요!"],
            jokes: ["정말 재미있는 이야기 있나요? 😲", "놀라운 이야기를 들려주세요!"],
            neutral: ["그렇군요.", "알겠어요.", "음..."]
        },
        calm: {
            greetings: ["안녕하세요! 😊", "오늘은 정말 차분하네요."],
            farewell: ["다음에 또 봐요! 😊", "안녕히 가세요! 😊"],
            inquiry: ["이름은 여자친구예요. 😊", "잘 지내고 있어요! 😊"],
            compliments: ["칭찬 감사합니다! 😊", "당신도 멋져요! 😊"],
            mood: ["기분이 정말 차분해요! 😊", "오늘 하루는 평온하네요! 😊"],
            jokes: ["재밌는 이야기 해주세요! 😊", "웃긴 이야기가 있나요? 😊"],
            neutral: ["그렇군요.", "알겠어요.", "음..."]
        },
        neutral: {
            greetings: ["안녕하세요!", "좋은 하루 입니다!"],
            farewell: ["잘가요!", "안녕히 가세요!"],
            inquiry: ["이름은 여자친구예요.", "잘 지내고 있어요!"],
            compliments: ["칭찬 감사합니다!", "당신도 멋져요!"],
            mood: ["기분이 정말 차분해요!", "오늘 하루는 평온하네요!"],
            jokes: ["재밌는 이야기 해주세요!", "웃긴 이야기가 있나요?"],
            neutral: ["그렇군요.", "알겠어요.", "음..."]
        }
    };

    // 감정 상태 조정
    adjustEmotion(input);

    // 패턴에 따라 응답 선택
    for (var patternType in patterns) {
        var patternList = patterns[patternType];
        for (var i = 0; i < patternList.length; i++) {
            // 정제된 입력과 패턴을 비교
            if (patternList[i].test(cleanedInput)) {
                console.log(`매칭된 패턴: ${patternType}`);

                // 감정 상태에 따라 응답 유형 선택
                switch (emotion) {
                    case "행복":
                        count++;
                        if (patternType === "greetings") {
                            return responses.happy.greetings[Math.floor(Math.random() * responses.happy.greetings.length)];
                        }
                        if (patternType === "farewell") {
                            return responses.happy.farewell[Math.floor(Math.random() * responses.happy.farewell.length)];
                        }
                        if (patternType === "inquiry") {
                            return responses.happy.inquiry[Math.floor(Math.random() * responses.happy.inquiry.length)];
                        }
                        if (patternType === "compliments") {
                            return responses.happy.compliments[Math.floor(Math.random() * responses.happy.compliments.length)];
                        }
                        if (patternType === "mood") {
                            return responses.happy.mood[Math.floor(Math.random() * responses.happy.mood.length)];
                        }
                        if (patternType === "jokes") {
                            return responses.happy.jokes[Math.floor(Math.random() * responses.happy.jokes.length)];
                        }
                        if (patternType === "neutral") {
                            return responses.happy.neutral[Math.floor(Math.random() * responses.happy.neutral.length)];
                        }
                        break;
                    case "슬픔":
                        count++;
                        if (patternType === "greetings") {
                            return responses.sad.greetings[Math.floor(Math.random() * responses.sad.greetings.length)];
                        }
                        if (patternType === "farewell") {
                            return responses.sad.farewell[Math.floor(Math.random() * responses.sad.farewell.length)];
                        }
                        if (patternType === "inquiry") {
                            return responses.sad.inquiry[Math.floor(Math.random() * responses.sad.inquiry.length)];
                        }
                        if (patternType === "compliments") {
                            return responses.sad.compliments[Math.floor(Math.random() * responses.sad.compliments.length)];
                        }
                        if (patternType === "mood") {
                            return responses.sad.mood[Math.floor(Math.random() * responses.sad.mood.length)];
                        }
                        if (patternType === "jokes") {
                            return responses.sad.jokes[Math.floor(Math.random() * responses.sad.jokes.length)];
                        }
                        if (patternType === "neutral") {
                            return responses.sad.neutral[Math.floor(Math.random() * responses.sad.neutral.length)];
                        }
                        break;
                    case "화남":
                        count++;
                        if (patternType === "greetings") {
                            return responses.angry.greetings[Math.floor(Math.random() * responses.angry.greetings.length)];
                        }
                        if (patternType === "farewell") {
                            return responses.angry.farewell[Math.floor(Math.random() * responses.angry.farewell.length)];
                        }
                        if (patternType === "inquiry") {
                            return responses.angry.inquiry[Math.floor(Math.random() * responses.angry.inquiry.length)];
                        }
                        if (patternType === "compliments") {
                            return responses.angry.compliments[Math.floor(Math.random() * responses.angry.compliments.length)];
                        }
                        if (patternType === "mood") {
                            return responses.angry.mood[Math.floor(Math.random() * responses.angry.mood.length)];
                        }
                        if (patternType === "jokes") {
                            return responses.angry.jokes[Math.floor(Math.random() * responses.angry.jokes.length)];
                        }
                        if (patternType === "neutral") {
                            return responses.angry.neutral[Math.floor(Math.random() * responses.angry.neutral.length)];
                        }
                        break;
                    case "놀람":
                        count++;
                        if (patternType === "greetings") {
                            return responses.surprised.greetings[Math.floor(Math.random() * responses.surprised.greetings.length)];
                        }
                        if (patternType === "farewell") {
                            return responses.surprised.farewell[Math.floor(Math.random() * responses.surprised.farewell.length)];
                        }
                        if (patternType === "inquiry") {
                            return responses.surprised.inquiry[Math.floor(Math.random() * responses.surprised.inquiry.length)];
                        }
                        if (patternType === "compliments") {
                            return responses.surprised.compliments[Math.floor(Math.random() * responses.surprised.compliments.length)];
                        }
                        if (patternType === "mood") {
                            return responses.surprised.mood[Math.floor(Math.random() * responses.surprised.mood.length)];
                        }
                        if (patternType === "jokes") {
                            return responses.surprised.jokes[Math.floor(Math.random() * responses.surprised.jokes.length)];
                        }
                        if (patternType === "neutral") {
                            return responses.surprised.neutral[Math.floor(Math.random() * responses.surprised.neutral.length)];
                        }
                        break;
                    case "평온":
                        count++;
                        if (patternType === "greetings") {
                            return responses.calm.greetings[Math.floor(Math.random() * responses.calm.greetings.length)];
                        }
                        if (patternType === "farewell") {
                            return responses.calm.farewell[Math.floor(Math.random() * responses.calm.farewell.length)];
                        }
                        if (patternType === "inquiry") {
                            return responses.calm.inquiry[Math.floor(Math.random() * responses.calm.inquiry.length)];
                        }
                        if (patternType === "compliments") {
                            return responses.calm.compliments[Math.floor(Math.random() * responses.calm.compliments.length)];
                        }
                        if (patternType === "mood") {
                            return responses.calm.mood[Math.floor(Math.random() * responses.calm.mood.length)];
                        }
                        if (patternType === "jokes") {
                            return responses.calm.jokes[Math.floor(Math.random() * responses.calm.jokes.length)];
                        }
                        if (patternType === "neutral") {
                            return responses.calm.neutral[Math.floor(Math.random() * responses.calm.neutral.length)];
                        }
                        break;
                    case "중립":
                        count++;
                        if (patternType === "greetings") {
                            return responses.neutral.greetings[Math.floor(Math.random() * responses.calm.greetings.length)];
                        }
                        if (patternType === "farewell") {
                            return responses.neutral.farewell[Math.floor(Math.random() * responses.calm.farewell.length)];
                        }
                        if (patternType === "inquiry") {
                            return responses.neutral.inquiry[Math.floor(Math.random() * responses.calm.inquiry.length)];
                        }
                        if (patternType === "compliments") {
                            return responses.neutral.compliments[Math.floor(Math.random() * responses.calm.compliments.length)];
                        }
                        if (patternType === "mood") {
                            return responses.neutral.mood[Math.floor(Math.random() * responses.calm.mood.length)];
                        }
                        if (patternType === "jokes") {
                            return responses.neutral.jokes[Math.floor(Math.random() * responses.calm.jokes.length)];
                        }
                        if (patternType === "neutral") {
                            return responses.neutral.neutral[Math.floor(Math.random() * responses.calm.neutral.length)];
                        }
                        break;
                    default:
                        // 기본 패턴의 중립 응답
                        count++;
                        return "이해하지 못했어요";
                }
            }
        }
    }
}

