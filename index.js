let number_ofsubjects; // Declare number_ofsubjects as a global variable

function createInputs() {
    number_ofsubjects = parseInt(document.getElementById("number_ofsubjects").value);

    if (!isNaN(number_ofsubjects) && number_ofsubjects > 0) {
        const subjectInputs = document.getElementById("subjectInputs");
        subjectInputs.innerHTML = ""; // Clear previous inputs

        for (let i = 1; i <= number_ofsubjects; i++) {
            const wrapper = document.createElement("div");
            wrapper.className = "mb-6 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02] duration-300";

            const nameLabel = document.createElement("label");
            nameLabel.textContent = `Subject ${i}`;
            nameLabel.className = "block mb-1 font-semibold text-gray-700 dark:text-gray-200";

            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.placeholder = `Enter name for Subject ${i}`;
            nameInput.id = `name_${i}`;
            nameInput.className = "w-full mb-3 p-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white";

            const creditsLabel = document.createElement("label");
            creditsLabel.textContent = `Credits:`;
            creditsLabel.className = "block mt-2 font-medium text-gray-700 dark:text-gray-200";

            const creditsInput = document.createElement("input");
            creditsInput.type = "number";
            creditsInput.placeholder = `Enter credits`;
            creditsInput.id = `credits_${i}`;
            creditsInput.className = "w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white";

            const gradeLabel = document.createElement("label");
            gradeLabel.textContent = `Grade:`;
            gradeLabel.className = "block mt-2 font-medium text-gray-700 dark:text-gray-200";

            const gradeDropdown = document.createElement("select");
            gradeDropdown.id = `grades_${i}`;
            gradeDropdown.className = "w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white";

            const gradeOptions = ["O", "A+", "A", "B+", "B", "C"];
            for (const option of gradeOptions) {
                const gradeOption = document.createElement("option");
                gradeOption.value = option;
                gradeOption.text = option;
                gradeDropdown.appendChild(gradeOption);
            }

            wrapper.appendChild(nameLabel);
            wrapper.appendChild(nameInput);
            wrapper.appendChild(creditsLabel);
            wrapper.appendChild(creditsInput);
            wrapper.appendChild(gradeLabel);
            wrapper.appendChild(gradeDropdown);

            subjectInputs.appendChild(wrapper);
        }
    } else {
        alert("Please enter a valid number of subjects.");
    }
}

function calculateCPI() {
    if (number_ofsubjects) {
        let totalCredits = 0;
        let totalGrades = 0;

        let resultTable = `
            <div class="overflow-x-auto mt-6">
            <table class="w-full text-sm text-left text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg">
              <thead class="bg-gradient-to-r from-blue-700 to-purple-600 text-white">
                <tr>
                  <th class="px-4 py-2">Subject Name</th>
                  <th class="px-4 py-2">Credits</th>
                  <th class="px-4 py-2">Grades</th>
                </tr>
              </thead>
              <tbody>
        `;

        for (let i = 1; i <= number_ofsubjects; i++) {
            const name = document.getElementById(`name_${i}`).value;
            const credits = parseFloat(document.getElementById(`credits_${i}`).value);
            const grades = document.getElementById(`grades_${i}`).value;

            if (!isNaN(credits)) {
                totalCredits += credits;
                totalGrades += credits * getNumericGrade(grades);

                resultTable += `
                  <tr class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800">
                    <td class="px-4 py-2">${name}</td>
                    <td class="px-4 py-2">${credits}</td>
                    <td class="px-4 py-2">${grades}</td>
                  </tr>
                `;
            } else {
                alert(`Please enter valid numeric values for credits for ${name || `Subject ${i}`}.`);
                return;
            }
        }

        const cpi = (totalGrades / totalCredits).toFixed(2);

        resultTable += `
              </tbody>
            </table>
            <div class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Total CPI: <span class="text-blue-700 dark:text-blue-300">${cpi}</span>
            </div>
          </div>
        `;

        document.getElementById("result").innerHTML = resultTable;
    } else {
        alert("Please enter the number of subjects first.");
    }
}

function getNumericGrade(grade) {
    switch (grade) {
        case "O": return 10;
        case "A+": return 9;
        case "A": return 8;
        case "B+": return 7;
        case "B": return 6;
        case "C": return 5;
        default: return 0;
    }
}

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dark-toggle').addEventListener('click', toggleDarkMode);
});
