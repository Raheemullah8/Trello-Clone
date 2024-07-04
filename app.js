// DOM elements ko select karne ke liye variables declare kiye gaye hain.
const main = document.querySelector("#main");
const addCardBtn = document.querySelector("#addCard");

// Function jo task ko add karta hai
const addTask = (event) => {
  event.preventDefault(); // Form submit ka default behavior rokna

  const currentForm = event.target; // Form element ko target kiya gaya hai
  const value = currentForm.elements[0].value.trim(); // Form ke input field se value ko extract kiya gaya hai aur whitespace trim kiya gaya hai
  const parent = currentForm.parentElement; // Form ke parent element ko target kiya gaya hai (div.column)

  // Check if value is empty
  if (!value) {
    return; // Agar input field khali hai toh function se bahar nikal jao
  }

  const h3Value = parent.children[0].innerText; // Parent element se h3 ka text nikala gaya hai

  // Check if the value already exists in savedTasks under the current heading
  if (savedTasks[h3Value] && savedTasks[h3Value].includes(value)) {
    alert("Task value already exists in this card!");
    return;
  }

  const ticket = createTicket(value); // Ticket create kiya gaya hai jo ek new task represent karta hai

  parent.insertBefore(ticket, currentForm); // Naya ticket form ke pehle insert kiya gaya hai

  if (!Array.isArray(savedTasks[h3Value])) {
    savedTasks[h3Value] = []; // Agar savedTasks me current heading ka array nahi hai toh ek khali array set kiya gaya hai
  }

  savedTasks[h3Value].push(value); // Naye task ko savedTasks me push kiya gaya hai

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks)); // Local storage me updated savedTasks ko store kiya gaya hai

  currentForm.reset(); // Form ko clear kiya gaya hai
};

// Function jo naya card create karta hai
const myCreateCard = (cardTitle) => {
  const myDiv = document.createElement("div"); // Ek naya div element create kiya gaya hai
  const myH3 = document.createElement("h3"); // Ek naya h3 element create kiya gaya hai
  const myForm = document.createElement("form"); // Ek naya form element create kiya gaya hai
  const myInput = document.createElement("input"); // Ek naya input element create kiya gaya hai

  const h3Text = document.createTextNode(cardTitle); // Card title se ek text node create kiya gaya hai

  // Element ko attributes assign kiye gaye hain
  myDiv.setAttribute("class", "column");
  myInput.setAttribute("type", "text");
  myInput.setAttribute("placeholder", "add task");

  // Text node ko h3 element me append kiya gaya hai
  myH3.appendChild(h3Text);
  // Input element ko form me append kiya gaya hai
  myForm.appendChild(myInput);
  // H3 element ko div me append kiya gaya hai
  myDiv.appendChild(myH3);
  // Form ko div me append kiya gaya hai
  myDiv.appendChild(myForm);

  // Form par submit event listener add kiya gaya hai
  myForm.addEventListener("submit", addTask);

  // Enable drag-and-drop functionality for tasks
  myDiv.addEventListener("dragstart", handleDragStart);
  myDiv.addEventListener("dragover", handleDragOver);
  myDiv.addEventListener("dragenter", handleDragEnter);
  myDiv.addEventListener("dragleave", handleDragLeave);
  myDiv.addEventListener("drop", handleDrop);
  myDiv.addEventListener("dragend", handleDragEnd);

  return myDiv; // Banaya gaya div return kiya gaya hai
};

// Function jo ek naya ticket (task) create karta hai
const createTicket = (value) => {
  const ticket = document.createElement("p"); // Ek naya p (paragraph) element create kiya gaya hai
  const elementText = document.createTextNode(value); // Value se ek text node create kiya gaya hai

  ticket.setAttribute("draggable", "true"); // Ticket ko draggable set kiya gaya hai
  ticket.setAttribute("class", "task-ticket"); // Add class for styling purposes
  ticket.setAttribute("data-task", value); // Set custom data attribute to identify the task
  ticket.appendChild(elementText); // Text node ko ticket element me append kiya gaya hai

  // Enable drag-and-drop functionality for tasks
  ticket.addEventListener("dragstart", handleDragStart);
  ticket.addEventListener("dragend", handleDragEnd);

  return ticket; // Ticket element return kiya gaya hai
};

// Drag-and-Drop Functionality
let draggedItem = null;

const handleDragStart = (event) => {
  draggedItem = event.target; // Set the dragged item when drag starts
  event.dataTransfer.setData('text/plain', event.target.dataset.task); // Set data for the drag operation
  setTimeout(() => {
    event.target.style.display = 'none'; // Hide the dragged item after starting the drag operation
  }, 0);
};

const handleDragEnd = (event) => {
  event.target.style.display = 'block'; // Restore display of the dragged item after drag ends
  draggedItem = null; // Reset dragged item to null
};

const handleDragOver = (event) => {
  event.preventDefault(); // Prevent default behavior
};

const handleDragEnter = (event) => {
  event.preventDefault(); // Prevent default behavior
};

const handleDragLeave = (event) => {
  // Optional: add styling for visual feedback (e.g., highlight drop target)
};

const handleDrop = (event) => {
  event.preventDefault(); // Prevent default behavior

  if (event.target.classList.contains('column')) {
    const currentCard = event.target;
    const droppedTask = event.dataTransfer.getData('text/plain'); // Get dropped task data
    const h3Value = currentCard.querySelector('h3').innerText; // Get heading text of the column

    // Check if the dropped task already exists
    if (savedTasks[h3Value] && savedTasks[h3Value].includes(droppedTask)) {
      alert('Task value already exists in this card!');
      return;
    }

    const ticket = createTicket(droppedTask); // Create ticket for dropped task
    currentCard.insertBefore(ticket, currentCard.lastElementChild); // Insert ticket into the column

    if (!Array.isArray(savedTasks[h3Value])) {
      savedTasks[h3Value] = []; // If savedTasks array for this heading doesn't exist, create an empty array
    }

    savedTasks[h3Value].push(droppedTask); // Push dropped task into savedTasks array
    localStorage.setItem('savedTasks', JSON.stringify(savedTasks)); // Update savedTasks in localStorage

    // Remove the task from the original card
    const originalCard = draggedItem.closest('.column');
    const originalH3Value = originalCard.querySelector('h3').innerText;
    const taskIndex = savedTasks[originalH3Value].indexOf(droppedTask);
    if (taskIndex !== -1) {
      savedTasks[originalH3Value].splice(taskIndex, 1); // Remove task from savedTasks array
      originalCard.removeChild(draggedItem); // Remove task element from DOM
      localStorage.setItem('savedTasks', JSON.stringify(savedTasks)); // Update localStorage
    }
  }
};

let savedTasks = JSON.parse(localStorage.getItem("savedTasks")); // Local storage se savedTasks fetch kiya gaya hai aur parse kiya gaya hai

if (!savedTasks) {
  savedTasks = {}; // Agar savedTasks null ya undefined hai toh ek khali object set kiya gaya hai
}

// Local storage se fetch ki gayi tasks ko display kiya gaya hai
for (const title in savedTasks) {
  const card = myCreateCard(title); // Har saved task ke liye ek naya card create kiya gaya hai

  const arrayOfTasks = savedTasks[title];

  for (let i = 0; i < arrayOfTasks.length; i++) {
    const p = createTicket(arrayOfTasks[i]); // Har task ke liye ek naya ticket (paragraph) create kiya gaya hai

    card.insertBefore(p, card.lastElementChild); // Card ke last child se pehle naya ticket insert kiya gaya hai
  }

  main.insertBefore(card, addCardBtn); // Card ko main element ke pehle addCardBtn se pehle insert kiya gaya hai
}

// Add card button par click hone par ek prompt show hota hai jisme card ka title enter kiya ja sakta hai
addCardBtn.addEventListener("click", () => {
  const cardTitle = prompt("enter card name?"); // User se card ka title input liya gaya hai

  const yourDiv = myCreateCard(cardTitle); // Naya card create kiya gaya hai

  main.insertBefore(yourDiv, addCardBtn); // Naya card ko addCardBtn se pehle insert kiya gaya hai
});
