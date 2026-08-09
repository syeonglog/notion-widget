// ----------------
//     DOM 요소
// ----------------

// ----------------
//    Supabase
// ----------------
const supabaseUrl = "https://mlvbqllykkqakthcskef.supabase.co";
const supabaseKey = "sb_publishable_0mD3ijnurE5FHXo005lAKQ_2W3tZyXg";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

const TABLE_NAME = "emoji_calendar";

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

// Supabase에서 불러온 데이터를
// 기존 달력 코드가 사용하는 객체 형태로 저장
let data = {};


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

// ==================
//   Supabase 데이터
// ==================

// DB의 날짜 형식을 기존 객체의 key 형식으로 변환
function makeKey(date) {
    const [y, m, d] = date.split("-");
    return `${Number(y)}-${Number(m)}-${Number(d)}`;
}

// Supabase → 기존 data 객체로 변환
async function loadData() {
    const { data: rows, error } = await supabaseClient
        .from(TABLE_NAME)
        .select("id, date, emoji, created_at");

    if (error) {
        console.error("데이터 불러오기 실패:", error);
        return;
    }

    data = {};

    rows.forEach(row => {
        const key = makeKey(row.date);
        data[key] = row.emoji;
    });

    updateInputValue();
    render();
}

// 기존 data 객체 → Supabase 행으로 저장
async function saveData(date, emoji) {

    const { data: existing, error: selectError } = await supabaseClient
        .from(TABLE_NAME)
        .select("id")
        .eq("date", date)
        .maybeSingle();

    if (selectError) {
        console.error("기존 데이터 확인 실패:", selectError);
        return;
    }

    // 이미 해당 날짜의 데이터가 있으면 수정
    if (existing) {

        const { error } = await supabaseClient
            .from(TABLE_NAME)
            .update({ emoji: emoji })
            .eq("id", existing.id);

        if (error) {
            console.error("데이터 수정 실패:", error);
        }

    // 없으면 새로 추가
    } else {

        const { error } = await supabaseClient
            .from(TABLE_NAME)
            .insert({
                date: date,
                emoji: emoji
            });

        if (error) {
            console.error("데이터 저장 실패:", error);
        }
    }
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
saveBtn.addEventListener("click", async () => {
    const emoji = emojiInput.value;
    if (!emoji) return;

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");

    const date = `${y}-${m}-${d}`;
    const key = `${y}-${Number(m)}-${Number(d)}`;

    // 화면에서 바로 보이도록 객체에도 저장
    data[key] = emoji;

    // Supabase에 저장
    await saveData(date, emoji);

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
render();
loadData();