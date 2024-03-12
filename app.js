let number_ofsubjects; // Declare number_ofsubjects as a global variable

function createInputs() {
    number_ofsubjects = parseInt(document.getElementById("number_ofsubjects").value);

    if (!isNaN(number_ofsubjects) && number_ofsubjects > 0) {
        const subjectInputs = document.getElementById("subjectInputs");
        subjectInputs.innerHTML = ""; // Clear previous inputs

        for (let i = 1; i <= number_ofsubjects; i++) {
            const nameLabel = document.createElement("label");
            nameLabel.textContent = `Subject ${i} Name:`;

            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.placeholder = `Enter name for Subject ${i}`;
            nameInput.id = `name_${i}`;

            const creditsLabel = document.createElement("label");
            creditsLabel.textContent = `Credits for ${nameInput.value}:`;

            const creditsInput = document.createElement("input");
            creditsInput.type = "number";
            creditsInput.placeholder = `Enter credits for ${nameInput.value}`;
            creditsInput.id = `credits_${i}`;

            const gradeLabel = document.createElement("label");
            gradeLabel.textContent = `Grades for ${nameInput.value}:`;

            const gradeInput = document.createElement("input");
            gradeInput.type = "number";
            gradeInput.placeholder = `Enter grades for ${nameInput.value}`;
            gradeInput.id = `grades_${i}`;

            subjectInputs.appendChild(nameLabel);
            subjectInputs.appendChild(nameInput);
            subjectInputs.appendChild(document.createElement("br"));
            subjectInputs.appendChild(creditsLabel);
            subjectInputs.appendChild(creditsInput);
            subjectInputs.appendChild(gradeLabel);
            subjectInputs.appendChild(gradeInput);
            subjectInputs.appendChild(document.createElement("hr")); // Add horizontal line
        }
    } else {
        alert("Please enter a valid number of subjects.");
    }
}

function calculateCPI() {
    if (number_ofsubjects) {
        let totalCredits = 0;
        let totalGrades = 0;

        // Create a table
        let resultTable = "<table border='1'><tr><th>Subject Name</th><th>Credits</th><th>Grades</th></tr>";

        for (let i = 1; i <= number_ofsubjects; i++) {
            const name = document.getElementById(`name_${i}`).value;
            const credits = parseFloat(document.getElementById(`credits_${i}`).value);
            const grades = parseFloat(document.getElementById(`grades_${i}`).value);

            if (!isNaN(credits) && !isNaN(grades)) {
                totalCredits += credits;
                totalGrades += credits * grades;

                // Append row to the table
                resultTable += `<tr><td>${name}</td><td>${credits}</td><td>${grades}</td></tr>`;
            } else {
                alert(`Please enter valid numeric values for credits and grades for ${name}.`);
                return;
            }
        }

        const cpi = (totalGrades / totalCredits).toFixed(2);

        // Append total CPI to the table
        resultTable += `</table><br>Total CPI: ${cpi}`;

        document.getElementById("result").innerHTML = resultTable;
    } else {
        alert("Please enter the number of subjects first.");
    }
}
// Show loader
function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

// Hide loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}