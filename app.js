const questions = [
    "em_2.2_1.png",
    "em_2.2_2.png",
    "em_2.2_3.png",
    "em_2.2_4.png",
    "em_2.2_5.png"
];

let currentQuestion = "";

let doneQuestions =
    JSON.parse(localStorage.getItem("doneQuestions")) || [];

function updateStatus() {
    const doneCount = doneQuestions.length;
    const remainCount = questions.length - doneCount;

    document.getElementById("statusText").innerText =
        `已完成 ${doneCount} 題，剩餘 ${remainCount} 題`;
}

function drawQuestion() {
    const unfinishedQuestions =
        questions.filter(q => !doneQuestions.includes(q));

    if (unfinishedQuestions.length === 0) {
        alert("全部題目都完成了！");
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * unfinishedQuestions.length);

    currentQuestion =
        unfinishedQuestions[randomIndex];

    document.getElementById("questionImage").src =
        "questions/" + currentQuestion;

    document.getElementById("questionName").innerText =
        currentQuestion;
}

function markDone() {
    if (currentQuestion === "") {
        alert("請先抽一題！");
        return;
    }

    if (!doneQuestions.includes(currentQuestion)) {
        doneQuestions.push(currentQuestion);
        localStorage.setItem("doneQuestions", JSON.stringify(doneQuestions));
    }

    updateStatus();
    alert("已標記完成！");
    drawQuestion();
}

function resetProgress() {
    if (confirm("確定要清除所有已完成紀錄嗎？")) {
        doneQuestions = [];
        localStorage.removeItem("doneQuestions");
        currentQuestion = "";
        document.getElementById("questionImage").src = "";
        document.getElementById("questionName").innerText = "";
        updateStatus();
    }
}

updateStatus();