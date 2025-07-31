// js/script.js content

let listElement = document.getElementById("myUL");

// Load tasks from localStorage on page load
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(item => {
    createTask(item.text, item.checked);
  });
};

function saveTasks() {
  const items = document.querySelectorAll("li");
  const data = [];
  items.forEach(li => {
    const text = li.childNodes[0].nodeValue;
    const checked = li.classList.contains("checked");
    if (text) {
      data.push({ text, checked });
    }
  });
  localStorage.setItem("tasks", JSON.stringify(data));
}

function createTask(text, isChecked = false) {
  let li = document.createElement("li");
  li.textContent = text;

  if (isChecked) {
    li.classList.add("checked");
  }

  let close = document.createElement("span");
  close.className = "close";
  close.textContent = "\u00D7";
  close.onclick = function () {
    this.parentElement.remove();
    saveTasks();
  };
  li.appendChild(close);

  let edit = document.createElement("span");
  edit.className = "editBtn";
  edit.textContent = "Edit";
  edit.onclick = function () {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "listInput";
    input.value = li.firstChild.nodeValue;
    li.innerHTML = "";
    li.appendChild(input);
    input.focus();

    input.onblur = finishEdit;
    input.onkeydown = function (e) {
      if (e.key === "Enter") finishEdit();
    };

    function finishEdit() {
      if (input.value.trim() === "") {
        alert("Task cannot be empty.");
        return;
      }
      li.textContent = input.value;
      li.appendChild(close);
      li.appendChild(edit);
      saveTasks();
    }
  };
  li.appendChild(edit);

  li.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      this.classList.toggle("checked");
      saveTasks();
    }
  });

  listElement.appendChild(li);
  saveTasks();
}

function newElement() {
  let input = document.getElementById("myInput");
  let value = input.value.trim();
  if (!value) {
    alert("You must write something!");
    return;
  }
  createTask(value);
  input.value = "";
}
