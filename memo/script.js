const memoInput = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const memoList = document.getElementById("memoList");

let memos = JSON.parse(localStorage.getItem("memos")) || [];
let editIndex = -1;

function renderMemos() {
    memoList.innerHTML = "";

    memos.forEach((memo, index) => {
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
            memos.splice(index, 1);
            saveMemos();
            renderMemos();
        });

        item.appendChild(memoText);
        item.appendChild(deleteBtn);

        memoList.appendChild(item);
    });
}

function saveMemos() {
    localStorage.setItem("memos", JSON.stringify(memos));
}

addBtn.addEventListener("click", () => {
    const text = memoInput.value.trim();
    if(text === "") return;

    if (editIndex === -1) {
        // 새 메모
        memos.push(text);
    } else {
        // 수정
        memos[editIndex] = text;
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