const memoInput = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const memoList = document.getElementById("memoList");

const STORAGE_KEY = "memos2";
let memos2 = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editIndex = -1;

function renderMemos() {
    memoList.innerHTML = "";

    memos2.forEach((memo, index) => {
        const item = document.createElement("div");
        item.className = "memo-item";

        const memoText = document.createElement("span");
        memoText.className = "memo-text";
        memoText.textContent = memo;
        
        memoText.addEventListener("click", () => {
            memoInput.value = memo;
            memoInput.focus();

            editIndex = index;

            // addBtn.textContent = "#";
            memoInput.placeholder = "Edit memo . . .";
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "-"

        deleteBtn.addEventListener("click", () => {
            memos2.splice(index, 1);
            saveMemos();
            renderMemos();
        });

        item.appendChild(memoText);
        item.appendChild(deleteBtn);

        memoList.appendChild(item);
    });
}

function saveMemos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos2));
}

addBtn.addEventListener("click", () => {
    const text = memoInput.value.trim();
    if(text === "") return;

    if (editIndex === -1) {
        // 새 메모
        memos2.push(text);
    } else {
        // 수정
        memos2[editIndex] = text;
        editIndex = -1;
    }
    saveMemos();
    memoInput.value = "";
    // addBtn.textContent = "+";
    memoInput.placeholder = "Don't forget - write it down !";

    renderMemos();
});

memoInput.addEventListener("keydown", (e)=>{
    if(e.key==="Enter") {
        addBtn.click();
    }
});

memoInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        editIndex = -1;
        memoInput.value = "";
        addBtn.textContent = "+";
        memoInput.placeholder = "Don't forget - write it down !";
    }
});

renderMemos();