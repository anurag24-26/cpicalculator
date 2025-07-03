let number_ofsubjects = 0; // Global variable to track number of subjects

// Utility: Grade mapping
const gradeMap = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5
};

// Create dynamic subject input fields
function createInputs() {
  const numInput = document.getElementById("number_ofsubjects");
  number_ofsubjects = parseInt(numInput.value);

  const subjectInputs = document.getElementById("subjectInputs");
  subjectInputs.innerHTML = ""; // Clear previous

  if (!isNaN(number_ofsubjects) && number_ofsubjects > 0) {
    for (let i = 1; i <= number_ofsubjects; i++) {
      // Container
      const wrapper = document.createElement("div");
      wrapper.className = "mb-6 p-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-lg transition-all";

      // Subject Name
      wrapper.appendChild(makeLabel(`Subject ${i}`, "block mb-1 font-semibold text-gray-700 dark:text-gray-200"));
      wrapper.appendChild(makeInput(`name_${i}`, "text", `Enter name for Subject ${i}`, "w-full mb-3 p-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"));

      // Credits
      wrapper.appendChild(makeLabel("Credits:", "block mt-2 font-medium text-gray-700 dark:text-gray-200"));
      wrapper.appendChild(makeInput(`credits_${i}`, "number", "Enter credits", "w-full p-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"));

      // Grade
      wrapper.appendChild(makeLabel("Grade:", "block mt-2 font-medium text-gray-700 dark:text-gray-200"));
      wrapper.appendChild(makeSelect(`grades_${i}`, gradeMap, "w-full p-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"));

      subjectInputs.appendChild(wrapper);
    }
  } else {
    alert("Please enter a valid number of subjects.");
  }
}

// Helper: Create label
function makeLabel(text, className) {
  const label = document.createElement("label");
  label.textContent = text;
  label.className = className;
  return label;
}

// Helper: Create input
function makeInput(id, type, placeholder, className) {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  input.id = id;
  input.className = className;
  if (type === "number") input.min = "0";
  return input;
}

// Helper: Create select dropdown
function makeSelect(id, options, className) {
  const select = document.createElement("select");
  select.id = id;
  select.className = className;
  for (const key in options) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.text = key;
    select.appendChild(opt);
  }
  return select;
}

// Calculate and display CPI
function calculateCPI() {
  if (!number_ofsubjects) {
    alert("Please enter the number of subjects first.");
    return;
  }

  let totalCredits = 0, totalGrades = 0;
  let tableRows = "";

  for (let i = 1; i <= number_ofsubjects; i++) {
    const name = document.getElementById(`name_${i}`).value.trim() || `Subject ${i}`;
    const credits = parseFloat(document.getElementById(`credits_${i}`).value);
    const grade = document.getElementById(`grades_${i}`).value;

    if (isNaN(credits) || credits <= 0) {
      alert(`Please enter a valid number for credits for ${name}.`);
      return;
    }

    totalCredits += credits;
    totalGrades += credits * (gradeMap[grade] || 0);

    tableRows += `
      <tr class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <td class="px-4 py-2">${name}</td>
        <td class="px-4 py-2">${credits}</td>
        <td class="px-4 py-2">${grade}</td>
      </tr>
    `;
  }

  const cpi = totalCredits ? (totalGrades / totalCredits).toFixed(2) : "0.00";

  document.getElementById("result").innerHTML = `
    <div class="overflow-x-auto mt-6">
      <table class="w-full text-sm text-left text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-2">Subject Name</th>
            <th class="px-4 py-2">Credits</th>
            <th class="px-4 py-2">Grades</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
        Total CPI: <span class="text-blue-700 dark:text-blue-300">${cpi}</span>
      </div>
    </div>
  `;
}

// Robust dark mode logic with persistence and initial state
(function() {
  // Set initial mode from localStorage or system preference
  function setInitialMode() {
    const userPref = localStorage.getItem('theme');
    if (userPref === 'dark' || (!userPref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Toggle dark mode and persist
  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    setInitialMode();
    const toggleBtn = document.getElementById('dark-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleDarkMode);
    }
  });
})();
