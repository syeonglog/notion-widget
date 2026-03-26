// ----------------
//     DOM 요소
// ----------------
const calendar = document.getElementById("calendar");
const emojiInput = document.getElementById("emojiInput");
const saveBtn = document.getElementById("saveBtn");
const tooltip = document.getElementById("tooltip");

const selectedDateText = document.getElementById("datefont");
const datePicker = document.getElementById("datePicker");
const monthText = document.getElementById("monthText");
const calendarIcon = document.getElementById("calendarIcon");

// ----------------
//     상태 변수
// ----------------
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

let selectedDate = new Date(); // 입력 기준 날짜

/* localStorage에서 데이터 로드 */
let data = JSON.parse(localStorage.getItem("emojiCalendar")) || {};


// ==================
//  날짜/입력 관련 함수
// ==================

// 선택 날짜 텍스트 업데이트
function updateSelectedDate(){
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth()+1;
    const d = selectedDate.getDate();

    selectedDateText.innerText = `${y}.${m}.${d}`;
}

// 입력창 값 업데이트
function updateInputValue(){
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth()+1;
    const d = selectedDate.getDate();

    const key = `${y}-${m}-${d}`;
    emojiInput.value = data[key] || "";
}

// 데이터 저장
function saveData(){
    localStorage.setItem("emojiCalendar", JSON.stringify(data));
}


// ==================
//     달력 렌더링
// ==================
function render(){
    calendar.innerHTML = "";
    monthText.innerText = `${currentYear}년 ${currentMonth+1}월`;

    const days = new Date(currentYear, currentMonth+1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 1일의 요일 구하기
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate(); // 이전달 마지막 날짜

    // ---- 이전 달 ----
    for(let i=firstDay-1; i>=0; i--){
        const cell = document.createElement("div");
        cell.className = "day other-month";

        const date = prevLastDate - i;
        // 실제 날짜 객체 생성
        const prevDate = new Date(currentYear, currentMonth - 1, date);

        const y = prevDate.getFullYear();
        const m = prevDate.getMonth() + 1;
        const d = prevDate.getDate();
        const key = `${y}-${m}-${d}`;

        // 이모지 표시
        if(data[key]){
            cell.innerText = data[key];
        }
        // 클릭 시 해당 달로 이동
        cell.addEventListener("click", () => {
            currentYear = y;
            currentMonth = m - 1;
            selectedDate = new Date(y, m - 1, d);

            updateSelectedDate();
            updateInputValue();
            render();
        });

        calendar.appendChild(cell);
    }


    // ---- 이번 달 ----
    for(let i=1; i<=days; i++){
        const cell = document.createElement("div");
        cell.className = "day";

        const key = `${currentYear}-${currentMonth+1}-${i}`;
        if(data[key]){
            cell.innerText = data[key];
        }

        const today = new Date();

        const isToday =
            i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

        const isSelected =
            i === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear();

        if(isToday){
            cell.classList.add("today");
        } else if(isSelected){
            cell.classList.add("selected");
        }

        // 툴팁
        cell.addEventListener("mousemove",(e)=>{
            tooltip.style.opacity = 1;
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY + 10 + "px";
            tooltip.innerText = `${currentYear}.${currentMonth+1}.${i}`;
        });
        cell.addEventListener("mouseleave",()=>{
            tooltip.style.opacity = 0;
        });

        // 클릭 → 날짜 선택
        cell.addEventListener("click",()=>{
            selectedDate = new Date(currentYear, currentMonth, i);
            updateSelectedDate();
            updateInputValue();
            render();
        });

        calendar.appendChild(cell);
    }

    // ---- 다음 달 ----
    const totalCells = calendar.children.length;
    const nextDays = (7 - (totalCells % 7)) % 7; // 7칸 기준으로 맞추기

    for(let i=1; i<=nextDays; i++){
        const cell = document.createElement("div");
        cell.className = "day other-month";

        // 실제 날짜
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        const y = nextDate.getFullYear();
        const m = nextDate.getMonth() + 1;
        const d = nextDate.getDate();
        const key = `${y}-${m}-${d}`;

        // 이모지 표시
        if(data[key]){
            cell.innerText = data[key];
        }

        // 클릭 시 이동
        cell.addEventListener("click", () => {
            currentYear = y;
            currentMonth = m - 1;
            selectedDate = new Date(y, m - 1, d);

            updateSelectedDate();
            updateInputValue();
            render();
        });

        calendar.appendChild(cell);
    }
}


// ==================
//       이벤트
// ==================

// 달력 아이콘 클릭 → 날짜 선택기 열기
calendarIcon.addEventListener("click",()=>{
    datePicker.showPicker(); // 핵심🔥
});

// 저장 버튼
saveBtn.addEventListener("click",()=>{
    const emoji = emojiInput.value;
    if(!emoji) return;

    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth()+1;
    const d = selectedDate.getDate();
    const key = `${y}-${m}-${d}`;

    data[key] = emoji;
    saveData();

    emojiInput.value = "";
    updateInputValue();
    render();
});

// 날짜 선택 (달력 input)
datePicker.addEventListener("change",(e)=>{
    selectedDate = new Date(e.target.value);
    updateSelectedDate();
    updateInputValue();
    render();
});

// 이전 달 버튼
document.getElementById("prevBtn").addEventListener("click",()=>{
    currentMonth--;

    if(currentMonth < 0){
        currentMonth = 11;
        currentYear--;
    }
    selectedDate = new Date(currentYear, currentMonth, 1);
    updateSelectedDate();
    updateInputValue();
    render();
});

// 다음 달 버튼
document.getElementById("nextBtn").addEventListener("click",()=>{
    currentMonth++;

    if(currentMonth > 11){
        currentMonth = 0;
        currentYear++;
    }
    selectedDate = new Date(currentYear, currentMonth, 1);
    updateSelectedDate();
    updateInputValue();
    render();
});


// ==================
//     초기 실행
// ==================
updateSelectedDate();
updateInputValue();
render();