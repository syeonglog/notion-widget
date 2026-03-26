const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");
const toggleBtn = document.getElementById("toggleFormat");

const nycTimeEl = document.getElementById("NYC-time");
const lonTimeEl = document.getElementById("LON-time");
const tyoTimeEl = document.getElementById("TYO-time");

const quotes = [
    "해피엔딩은 몰라도 회피엔딩은 싫으니까! 🐹",
    "이제는 나도 지나간 불행은 지나간 자리에 남겨 두는 연습을 해야지 🖐🏻",
    "일의 우선순위 정하는 법❔지금 제일 스트레스 받고 피하고 싶은 일",
    "의무를 다하는 것이 기분을 관리하는 최고의 방법이다 🗞️",
    "긍정적 마인드! 그것은 완전무결한 작전 💨",
    "운명 따위는 태어난 날보다 고른 옷으로 정해지는 거야 🧣"
];

let is24Hour = true;

// 버튼 클릭 → 12/24시간 전환
toggleBtn.addEventListener("click", () => {
    is24Hour = !is24Hour;
});

function updateClock() {
    const now = new Date();

    const realHours = now.getHours(); // 실제 시간 (메시지용)
    let hours = realHours;
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // 12시간제 변환
    if (!is24Hour) {
        hours = hours % 12 || 12;
    }

    // 시간 표시 (AM/PM 없음)
    timeEl.innerText =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;

    // 날짜 표시
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    dateEl.innerText = now.toLocaleDateString('ko-KR', options);

    updateWorldClock();

}
/* 메시지(quote) */
function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    messageEl.innerText = quotes[randomIndex];
}

/* 세계 시간 */
function updateWorldClock() {
    const now = new Date();

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
    };

    nycTimeEl.innerText = now.toLocaleTimeString('en-US', {
        ...options,
        timeZone: 'America/New_York'
    });

    lonTimeEl.innerText = now.toLocaleTimeString('en-GB', {
        ...options,
        timeZone: 'Europe/London'
    });

    tyoTimeEl.innerText = now.toLocaleTimeString('ja-JP', {
        ...options,
        timeZone: 'Asia/Tokyo'
    });
}

// 1초마다 업데이트
setInterval(updateClock, 1000);
updateClock();
setRandomQuote();