const habits = document.querySelectorAll(".habit");
const resetAllBtn = document.querySelector(".reset-all-btn");

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getDayDiff(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

habits.forEach(habit => {

    const id = habit.dataset.id;

    const streakEl = habit.querySelector(".streak");
    const totalEl = habit.querySelector(".total");
    const checkBtn = habit.querySelector(".check-btn");
    const floating = habit.querySelector(".floating-text");

    let data = JSON.parse(localStorage.getItem(id));

    if (!data) {
        data = {
            streak: 0,
            total: 0,
            lastCheck: null
        };
    }

    init();

    function init() {

        updateUI();

        if (data.lastCheck === getToday()) {

            checkBtn.textContent = "✔";
            checkBtn.classList.add("checked");
            habit.classList.add("completed");

        } else {

            checkBtn.textContent = "○";
            checkBtn.classList.remove("checked");
            habit.classList.remove("completed");

        }

    }

    checkBtn.addEventListener("click", () => {

        const today = getToday();

        if (data.lastCheck === today) return;

        // ---------------- 체크 ----------------

        if (data.lastCheck) {

            const diff = getDayDiff(data.lastCheck, today);

            if (diff === 1) {
                data.streak++;
            } else {
                data.streak = 1;
            }

        } else {

            data.streak = 1;

        }

        data.total++;
        data.lastCheck = today;

        localStorage.setItem(id, JSON.stringify(data));

        updateUI();

        checkBtn.textContent = "✔";
        checkBtn.classList.add("checked");
        checkBtn.classList.add("success");

        habit.classList.add("completed");

        floating.textContent = "+1🧋";
        floating.classList.add("show");

        setTimeout(() => {
            floating.classList.remove("show");
            checkBtn.classList.remove("success");
        }, 800);

    });

    function updateUI() {

        streakEl.textContent = data.streak;
        totalEl.textContent = data.total;

    }

});


// ---------------- 전체 초기화 ----------------

resetAllBtn.addEventListener("click", () => {

    if (!confirm("모든 습관을 초기화하시겠습니까?"))
        return;

    habits.forEach(habit => {

        const id = habit.dataset.id;

        localStorage.removeItem(id);

    });

    location.reload();

});