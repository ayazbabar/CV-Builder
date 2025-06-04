document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cv-form");

  const updateCV = () => {
    document.getElementById("cv-name").textContent = form.name.value;
    document.getElementById("cv-title").textContent = form.title.value;
    document.getElementById("cv-profile").textContent = form.profile.value;
    document.getElementById("cv-phone").textContent = form.phone.value;
    document.getElementById("cv-email").textContent = form.email.value;
    document.getElementById("cv-address").textContent = form.address.value;
    document.getElementById("cv-volunteer").textContent = form.volunteer.value;

    const languageList = form.language.value.split("\n").filter(Boolean);
    const langEl = document.getElementById("cv-language");
    langEl.innerHTML = "";
    languageList.forEach((lang) => {
      const li = document.createElement("li");
      li.textContent = lang;
      langEl.appendChild(li);
    });

    const skillsList = form.skills.value.split("\n").filter(Boolean);
    const skillEl = document.getElementById("cv-skills");
    skillEl.innerHTML = "";
    skillsList.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      skillEl.appendChild(li);
    });

    const educationEntries = document.querySelectorAll(".education-entry");
    const cvEducation = document.getElementById("cv-education");
    cvEducation.innerHTML = "";
    educationEntries.forEach((entry) => {
      const institution = entry.querySelector(".education-institution").value;
      const degree = entry.querySelector(".education-degree").value;
      const description = entry.querySelector(".education-description").value;

      const div = document.createElement("div");
      div.innerHTML = `<strong>${institution}</strong> - ${degree}<br><span class="text-gray-600 text-sm">${description}</span>`;
      cvEducation.appendChild(div);
    });
  };

  form.addEventListener("input", updateCV);

  // Education entry handling
  const educationContainer = document.getElementById("education-container");
  const addEducationBtn = document.getElementById("add-education");

  function createEducationEntry() {
    const div = document.createElement("div");
    div.className = "education-entry space-y-1 p-4 border rounded bg-gray-50";
    div.innerHTML = `
      <input type="text" class="education-institution w-full p-2 border rounded" placeholder="Institution (e.g., University of X)" />
      <input type="text" class="education-degree w-full p-2 border rounded" placeholder="Degree or Title" />
      <textarea class="education-description w-full p-2 border rounded" placeholder="Additional info" rows="3"></textarea>
      <button type="button" class="remove-education text-red-600 hover:underline">Remove</button>
    `;
    div.querySelector(".remove-education").addEventListener("click", () => {
      div.remove();
      updateCV();
    });
    div.addEventListener("input", updateCV);
    educationContainer.insertBefore(div, addEducationBtn);
  }

  addEducationBtn.addEventListener("click", createEducationEntry);
  createEducationEntry();

  // Photo upload
  document.getElementById("photo").addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("photo-preview").src = e.target.result;
    };
    if (this.files[0]) reader.readAsDataURL(this.files[0]);
  });

  // Payment simulation (replace with real Stripe/Razorpay later)
  document.getElementById("pay-to-unlock").addEventListener("click", () => {
    const confirmPay = confirm("Simulate $3 payment? Replace with Stripe or Razorpay later.");
    if (confirmPay) {
      const btn = document.getElementById("download-btn");
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      alert("Payment successful. You can now download your CV as PDF!");
    }
  });
});

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const cvElement = document.getElementById("cv-preview");
  const canvas = await html2canvas(cvElement, { scale: 3 });
  const imgData = canvas.toDataURL("image/jpeg", 0.92);

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("my_cv.pdf");
}
