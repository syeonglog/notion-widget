// 툴팁, 그리드, 남은 일수, 퍼센트 표시 요소 가져오기
const tooltip = document.getElementById("tooltip");
const grid = document.getElementById("grid");
const remainingText = document.getElementById("remaining");
const percentText = document.getElementById("percent");
// 오늘 날짜 객체 생성
const today = new Date();

// 퍼센트 숫자를 애니메이션처럼 증가시키는 함수
function animatePercent(target){
    let current = 0;

    const interval = setInterval(() => {

        percentText.innerText = current + "%";

        current++;

        if(current > target){
            clearInterval(interval);
        } // 목표 퍼센트에 도달하면 애니메이션 종료

    },15); // 15ms 간격으로 증가
}

// 날짜 칸(그리드) 생성하는 함수
function createGrid(startDate, totalDays){

    grid.innerHTML=""; // 초기화

    for(let i=0;i<totalDays;i++){ // 전체 날짜 수만큼 반복

        const date = new Date(startDate); // 시작일 기준 날짜 계산
        date.setDate(startDate.getDate()+i);

        // 날짜 칸 div 생성
        const day = document.createElement("div");
        day.classList.add("day");

        const text = `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`; // 툴팁 표시용 문자열 생성

        // 툴팁 표시 및 숨김 이벤트
        day.addEventListener("mousemove", (e)=>{
            tooltip.innerText = text;
            tooltip.style.left = e.pageX + 10 + "px"; // 마우스 옆에 표시
            tooltip.style.top = e.pageY + 10 + "px";
            tooltip.style.opacity = 1;
        });

        day.addEventListener("mouseleave", ()=>{
            tooltip.style.opacity = 0;
        });

        // 요일 가져오기 (0=일요일, 6=토요일)
        const dayIndex = date.getDay();

        if(dayIndex==0 || dayIndex==6){ // 주말이면 'weekend' 클래스 추가
            day.classList.add("weekend");
        }

        if(date < today){ // 지난 날짜는 'passed' 클래스 추가
            setTimeout(() => { // 애니메이션 효과
                day.classList.add("passed");
            }, i * 20);
        }

        if(date.toDateString() === today.toDateString()){ // 오늘 날짜라면 'today' 클래스 추가
            setTimeout(() => {
                day.classList.add("today");
            }, i * 20 + 50);
        }

        grid.appendChild(day); // 그리드에 날짜 칸 추가
    }

    const passed = Math.floor((today-startDate)/(1000*60*60*24)); // 지난 날짜 계산
    const remain = totalDays - passed; // 남은 날짜 계산

    const percent = Math.min(100,Math.round((passed/totalDays)*100)); // 진행률 계산

    remainingText.innerText = `${remain} days left`;
    animatePercent(percent);
}

// 월별 기준 위젯 표시
function showMonth(){
    const year = today.getFullYear();
    const month = today.getMonth();

    const start = new Date(year,month,1); // 해당 월 시작일
    const totalDays = new Date(year,month+1,0).getDate(); // 해당 월 총 일수 계산

    createGrid(start,totalDays);
}

// 분기별 기준 위젯 표시
function showQuarter(){
    const year = today.getFullYear();
    const month = today.getMonth();

    const quarterStartMonth = Math.floor(month/3)*3; // 분기 시작 월 계산
    const start = new Date(year,quarterStartMonth,1);
    const end = new Date(year,quarterStartMonth+3,0);
    const totalDays = Math.floor((end-start)/(1000*60*60*24))+1;

    createGrid(start,totalDays);
}

// 버튼 클릭 이벤트
document.getElementById("monthBtn").onclick=showMonth;
document.getElementById("quarterBtn").onclick=showQuarter;

// 페이지 로드 시 월별 기준 위젯 표시
showMonth();