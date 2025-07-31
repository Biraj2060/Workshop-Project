document.addEventListener("DOMContentLoaded", () => {
  const listElement = document.getElementById("myUL");
  const addBtn = document.getElementById("addBtn");
  const input = document.getElementById("myInput");

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(item => createTask(item.text, item.checked));

  addBtn.onclick = () => {
    const value = input.value.trim();
    if (!value) {
      alert("You must write something!");
      return;
    }
    createTask(value);
    input.value = "";
  };

  function saveTasks() {
    const items = document.querySelectorAll("li");
    const data = [];
    items.forEach(li => {
      const taskText = li.querySelector(".task-text");
      if (taskText) {
        data.push({
          text: taskText.textContent,
          checked: li.classList.contains("checked")
        });
      }
    });
    localStorage.setItem("tasks", JSON.stringify(data));
  }

  function createTask(text, isChecked = false) {
    const li = document.createElement("li");

    // ✅ Create text container
    const spanText = document.createElement("span");
    spanText.className = "task-text";
    spanText.textContent = text;
    li.appendChild(spanText);

    if (isChecked) {
      li.classList.add("checked");
    }

    // ❌ Don't overwrite the content! Always append children
    const close = document.createElement("span");
    close.className = "close";
    close.textContent = "×";
    close.onclick = () => {
      li.remove();
      saveTasks();
    };
    li.appendChild(close);

    const edit = document.createElement("span");
    edit.className = "editBtn";
    edit.textContent = "Edit";
    edit.onclick = () => {
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.className = "listInput";
      inputField.value = spanText.textContent;
      li.innerHTML = ""; // clear li content temporarily
      li.appendChild(inputField);
      inputField.focus();

      inputField.onblur = finishEdit;
      inputField.onkeydown = (e) => {
        if (e.key === "Enter") finishEdit();
      };

      function finishEdit() {
        const val = inputField.value.trim();
        if (!val) {
          alert("Task cannot be empty.");
          return;
        }
        li.innerHTML = "";

        // Rebuild the item after edit
        const newSpan = document.createElement("span");
        newSpan.className = "task-text";
        newSpan.textContent = val;
        li.appendChild(newSpan);
        li.appendChild(close);
        li.appendChild(edit);
        saveTasks();
      }
    };
    li.appendChild(edit);

    li.addEventListener("click", function (e) {
      if (e.target === li || e.target.className === "task-text") {
        li.classList.toggle("checked");
        saveTasks();
      }
    });

    listElement.appendChild(li);
    saveTasks();
  }
});
