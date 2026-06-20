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
      wrapper.className = "mb-5 p-4 border border-[var(--line)] rounded";

      // Subject Name
      wrapper.appendChild(makeLabel(`Subject ${i}`, "block mb-2 text-xs uppercase tracking-wider text-[var(--muted)]"));
      wrapper.appendChild(makeInput(`name_${i}`, "text", `Enter name for Subject ${i}`, "field w-full mb-3 px-3 py-2 text-sm"));

      // Credits
      wrapper.appendChild(makeLabel("Credits", "block mb-2 text-xs uppercase tracking-wider text-[var(--muted)]"));
      wrapper.appendChild(makeInput(`credits_${i}`, "number", "Enter credits", "field w-full mb-3 px-3 py-2 text-sm"));

      // Grade
      wrapper.appendChild(makeLabel("Grade", "block mb-2 text-xs uppercase tracking-wider text-[var(--muted)]"));
      wrapper.appendChild(makeSelect(`grades_${i}`, gradeMap, "field w-full px-3 py-2 text-sm"));

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
      <tr class="border-b border-[var(--line)]">
        <td class="px-4 py-2 text-left">${name}</td>
        <td class="px-4 py-2 text-left">${credits}</td>
        <td class="px-4 py-2 text-left">${grade}</td>
      </tr>
    `;
  }

  const cpi = totalCredits ? (totalGrades / totalCredits).toFixed(2) : "0.00";

  document.getElementById("result").innerHTML = `
    <div class="mt-6 text-left">
      <table class="w-full text-sm border border-[var(--line)] rounded overflow-hidden">
        <thead>
          <tr class="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--muted)]">
            <th class="px-4 py-2 text-left">Subject</th>
            <th class="px-4 py-2 text-left">Credits</th>
            <th class="px-4 py-2 text-left">Grade</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="mt-5 text-center text-base">
        Total CPI: <span class="font-semibold">${cpi}</span>
      </div>
    </div>
  `;
}