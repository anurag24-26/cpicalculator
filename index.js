let number_ofsubjects; // Declare number_ofsubjects as a global variable

function createInputs() {
    number_ofsubjects = parseInt(document.getElementById("number_ofsubjects").value);

    if (!isNaN(number_ofsubjects) && number_ofsubjects > 0) {
        const subjectInputs = document.getElementById("subjectInputs");
        subjectInputs.innerHTML = ""; // Clear previous inputs

        for (let i = 1; i <= number_ofsubjects; i++) {
            const nameLabel = document.createElement("label");
            nameLabel.textContent = `Subject ${i}`;

            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.placeholder = `Enter name for Subject ${i}`;
            nameInput.id = `name_${i}`;
            nameInput.style.width = "80%";

            const creditsLabel = document.createElement("label");
            creditsLabel.textContent = `Credits ${nameInput.value}:`;

            const creditsInput = document.createElement("input");
            creditsInput.type = "number";
            creditsInput.placeholder = `Enter credits for ${nameInput.value}`;
            creditsInput.id = `credits_${i}`;
            creditsInput.style.maxWidth="30%"

            const gradeLabel = document.createElement("label");
            gradeLabel.textContent = `Grades ${nameInput.value}:`;

            const gradeDropdown = document.createElement("select");
            gradeDropdown.id = `grades_${i}`;
            gradeDropdown.style.maxWidth="30%"

            // Add options to the dropdown
            const gradeOptions = ["O", "A+", "A", "B+", "B", "C"];
            for (const option of gradeOptions) {
                const gradeOption = document.createElement("option");
                gradeOption.value = option;
                gradeOption.text = option;
                gradeDropdown.appendChild(gradeOption);
            }

            subjectInputs.appendChild(nameLabel);
            subjectInputs.appendChild(nameInput);
            subjectInputs.appendChild(document.createElement("br"));
            subjectInputs.appendChild(creditsLabel);
            subjectInputs.appendChild(creditsInput);
            subjectInputs.appendChild(gradeLabel);
            subjectInputs.appendChild(gradeDropdown);
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
            const grades = document.getElementById(`grades_${i}`).value; // Use dropdown value

            if (!isNaN(credits)) {
                totalCredits += credits;
                totalGrades += credits * getNumericGrade(grades); // Convert grade to numeric value

                // Append row to the table
                resultTable += `<tr><td>${name}</td><td>${credits}</td><td>${grades}</td></tr>`;
            } else {
                alert(`Please enter valid numeric values for credits for ${name}.`);
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

// Function to convert grade to numeric value
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
