let currentQuestion = null;

let customChapters =
    JSON.parse(localStorage.getItem("customChapters")) || [];

let doneQuestions =
    JSON.parse(localStorage.getItem("doneQuestions")) || [];

function getSelectedChapter() {
    return document.getElementById("chapterSelect").value;
}

function getFilteredQuestions() {
    const allChapters = [...new Set(questions.map(q => q.chapter))];

    if (
        customChapters.length > 0 &&
        customChapters.length < allChapters.length
    ) {
        return questions.filter(q =>
            customChapters.includes(q.chapter)
        );
    }

    const selectedChapter = getSelectedChapter();

    if (selectedChapter === "全部章節") {
        return questions;
    }

    return questions.filter(q => q.chapter === selectedChapter);
}
function initChapterSelect() {
    const chapterSelect = document.getElementById("chapterSelect");

    const chapters = [...new Set(questions.map(q => q.chapter))];

    chapters.forEach(chapter => {
        const option = document.createElement("option");
        option.value = chapter;
        option.textContent = chapter;
        chapterSelect.appendChild(option);
    });
}

function updateStatus() {
    const filteredQuestions = getFilteredQuestions();

    const doneCount = filteredQuestions.filter(q =>
        doneQuestions.includes(q.file)
    ).length;

    const remainCount = filteredQuestions.length - doneCount;

    let rangeText = getSelectedChapter();

const allChapters = [...new Set(questions.map(q => q.chapter))];

if (
    customChapters.length > 0 &&
    customChapters.length < allChapters.length
) {
    rangeText = "特定章節：" + customChapters.join("、");
}

document.getElementById("statusText").innerText =
`目前範圍：${rangeText}｜已完成 ${doneCount} 題，剩餘 ${remainCount} 題，共 ${filteredQuestions.length} 題`;

    updateChapterProgress();
}


function updateChapterProgress() {
    const progressDiv = document.getElementById("chapterProgress");

    const chapters = [...new Set(questions.map(q => q.chapter))];

    let html = "<h3>各章節完成進度</h3>";

    chapters.forEach(chapter => {
        const chapterQuestions = questions.filter(q => q.chapter === chapter);

        const doneCount = chapterQuestions.filter(q =>
            doneQuestions.includes(q.file)
        ).length;

        const totalCount = chapterQuestions.length;

        const percent =
            totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

        const filledBlocks = Math.round(percent / 10);
        const emptyBlocks = 10 - filledBlocks;

        const bar =
            "■".repeat(filledBlocks) + "□".repeat(emptyBlocks);

        html += `
            <p>
                ${chapter}<br>
                ${bar} ${percent}%（${doneCount}/${totalCount}）
            </p>
        `;
    });

    progressDiv.innerHTML = html;
}

function drawQuestion() {
    const filteredQuestions = getFilteredQuestions();

    const unfinishedQuestions =
        filteredQuestions.filter(q => !doneQuestions.includes(q.file));

    if (unfinishedQuestions.length === 0) {
        alert("這個範圍的題目都完成了！");
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * unfinishedQuestions.length);

    currentQuestion =
        unfinishedQuestions[randomIndex];

    document.getElementById("questionImage").src =
        currentQuestion.file;

    document.getElementById("questionName").innerText = "";
}

function markDone() {
    if (currentQuestion === null) {
        alert("請先抽一題！");
        return;
    }

    if (!doneQuestions.includes(currentQuestion.file)) {
        doneQuestions.push(currentQuestion.file);
        localStorage.setItem("doneQuestions", JSON.stringify(doneQuestions));
    }

    updateStatus();
    alert("已標記完成！");
    drawQuestion();
}

function showChapter() {
    if (currentQuestion === null) {
        alert("請先抽一題！");
        return;
    }

    alert("這題來自：" + currentQuestion.chapter);
}

function resetProgress() {
    if (confirm("確定要清除所有已完成紀錄嗎？")) {
        doneQuestions = [];
        localStorage.removeItem("doneQuestions");
        currentQuestion = null;
        document.getElementById("questionImage").src = "";
        document.getElementById("questionName").innerText = "";
        updateStatus();
    }
}

function openManualEdit() {
    const manualArea = document.getElementById("manualEditArea");
    manualArea.style.display = "block";

    initManualChapterSelect();
}

function closeManualEdit() {
    document.getElementById("manualEditArea").style.display = "none";
}

function initManualChapterSelect() {

    const select =
        document.getElementById("manualChapterSelect");

    select.innerHTML =
        '<option value="">請選擇章節</option>';

    const chapters =
        [...new Set(questions.map(q => q.chapter))];

    chapters.forEach(chapter => {

        const option =
            document.createElement("option");

        option.value = chapter;
        option.textContent = chapter;

        select.appendChild(option);
    });

    document.getElementById("manualQuestionList").innerHTML = "";
}

function showManualQuestionList() {

    const chapter =
        document.getElementById("manualChapterSelect").value;

    const listDiv =
        document.getElementById("manualQuestionList");

    if (chapter === "") {

        listDiv.innerHTML = "";
        return;
    }

    const chapterQuestions =
        questions.filter(q => q.chapter === chapter);

    let html = "<h3>題目清單</h3>";

    chapterQuestions.forEach(q => {

        const checked =
            doneQuestions.includes(q.file)
                ? "checked"
                : "";

        const fileName =
            q.file.split("/").pop();

        html += `
            <label style="display:block;margin:5px 0;">
                <input
                    type="checkbox"
                    class="manualCheckbox"
                    value="${q.file}"
                    ${checked}
                >
                ${fileName}
            </label>
        `;
    });

    listDiv.innerHTML = html;
}

function saveManualEdit() {

    const chapter =
        document.getElementById("manualChapterSelect").value;

    if (chapter === "") {

        alert("請先選擇章節！");
        return;
    }

    const chapterQuestions =
        questions.filter(q => q.chapter === chapter);

    const chapterFiles =
        chapterQuestions.map(q => q.file);

    doneQuestions =
        doneQuestions.filter(
            file => !chapterFiles.includes(file)
        );

    const checkedBoxes =
        document.querySelectorAll(
            ".manualCheckbox:checked"
        );

    checkedBoxes.forEach(box => {

        doneQuestions.push(box.value);
    });

    localStorage.setItem(
        "doneQuestions",
        JSON.stringify(doneQuestions)
    );

    updateStatus();

    document.getElementById("manualEditArea").style.display = "none";

    alert("儲存成功！");
}

function openCustomChapter() {
    document.getElementById("customChapterArea").style.display = "block";
    initCustomChapterList();
}

function closeCustomChapter() {
    document.getElementById("customChapterArea").style.display = "none";
}

function initCustomChapterList() {
    const listDiv = document.getElementById("customChapterList");

    const chapters = [...new Set(questions.map(q => q.chapter))];

    let html = "";

    chapters.forEach(chapter => {
        const checked =
            customChapters.includes(chapter) ? "checked" : "";

        html += `
            <label style="display:block; margin:6px 0;">
                <input type="checkbox"
                       class="customChapterCheckbox"
                       value="${chapter}"
                       ${checked}>
                ${chapter}
            </label>
        `;
    });

    listDiv.innerHTML = html;
}

function saveCustomChapter() {
    const checkedBoxes =
        document.querySelectorAll(".customChapterCheckbox:checked");

    customChapters = [];

    checkedBoxes.forEach(box => {
        customChapters.push(box.value);
    });

    localStorage.setItem(
        "customChapters",
        JSON.stringify(customChapters)
    );

    updateStatus();

    document.getElementById("customChapterArea").style.display = "none";

    alert("特定章節設定已儲存！");
}

initChapterSelect();
updateStatus();