let currentStep = 1;
let resumeData = {};
let photoUrl = null;

// Auto-save to localStorage
function autoSave() {
  localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

// Load from localStorage
window.onload = () => {
  const saved = localStorage.getItem('resumeData');
  if (saved) resumeData = JSON.parse(saved);
  // Check if user is logged in
  const { data: { user } } = supabase.auth.getUser();
  if (user) loadSavedResumes(user.id);
  renderPreview(); // Initial preview if data exists
  addEventListeners();
};

function addEventListeners() {
  document.getElementById('login-btn').onclick = () => {
    const email = prompt('Email:');
    const password = prompt('Password:');
    logIn(email, password);
  };
  document.getElementById('signup-btn').onclick = () => {
    const email = prompt('Email:');
    const password = prompt('Password:');
    const fullName = prompt('Full Name:');
    signUp(email, password, fullName);
  };
  document.getElementById('logout-btn').onclick = logOut;

  // Photo upload
  document.getElementById('photo').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => photoUrl = event.target.result;
      reader.readAsDataURL(file);
    }
  };

  // References option change
  document.getElementById('references-option').onchange = (e) => {
    document.getElementById('references-form').classList.toggle('hidden', e.target.value !== 'yes');
  };
}

// Dynamic add functions (example for work)
let workCount = 0;
function addWorkExperience() {
  workCount++;
  const div = document.createElement('div');
  div.id = `work-${workCount}`;
  div.innerHTML = `
    <input type="text" placeholder="Job Title" class="border p-2 mb-2 w-full rounded">
    <input type="text" placeholder="Company Name" class="border p-2 mb-2 w-full rounded">
    <input type="date" placeholder="Start Date" class="border p-2 mb-2 w-full rounded">
    <input type="date" placeholder="End Date" class="border p-2 mb-2 w-full rounded">
    <textarea placeholder="Description" class="border p-2 mb-2 w-full rounded"></textarea>
    <button type="button" class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteEntry('work-${workCount}')">Delete</button>
  `;
  document.getElementById('work-experiences').appendChild(div);
}

// Similar for addEducation, addCertification, addReference, etc.

// Add Skill
function addSkill() {
  const input = document.getElementById('new-skill');
  if (input.value) {
    const tag = document.createElement('span');
    tag.className = 'bg-gray-200 px-2 py-1 rounded mr-2 mb-2';
    tag.innerHTML = `${input.value} <button onclick="this.parentNode.remove()">x</button>`;
    document.getElementById('skills').appendChild(tag);
    input.value = '';
  }
}

// Delete entry
function deleteEntry(id) {
  document.getElementById(id).remove();
}

// Generate Summary (placeholder)
function generateSummary() {
  document.getElementById('summary').value = "Dynamic and detail-oriented professional seeking to contribute skills and experience to achieve organizational goals.";
}

// Navigation
function showStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
  document.getElementById(`step-${step}`).classList.remove('hidden');
  currentStep = step;
}

function saveAndContinue(step) {
  saveData(step);
  showStep(step + 1);
  autoSave();
  renderPreview();
}

function back(step) {
  showStep(step - 1);
}

function skip(step) {
  showStep(step + 1);
}

// Save data per step (example for step 1)
function saveData(step) {
  if (step === 1) {
    resumeData.contact = {
      photo: photoUrl,
      firstName: document.getElementById('first-name').value,
      surname: document.getElementById('surname').value,
      title: document.getElementById('professional-title').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      nationality: document.getElementById('nationality').value,
      dob: document.getElementById('dob').value
    };
  }
  // Similar for other steps: collect from forms into resumeData.work, .education, etc.
  // For dynamic, loop through children and collect.

  // For logged in user, save to Supabase
  const { data: { user } } = supabase.auth.getUser();
  if (user) saveResume(user.id, resumeData, document.getElementById('template-style')?.value || '1');
}

// Render Preview (ATS-compliant, simple HTML)
function renderPreview() {
  const preview = document.getElementById('resume-preview');
  preview.innerHTML = ''; // Clear
  // Build HTML structure based on resumeData and selected template
  // For simplicity, assume Template 1: Basic layout
  let html = `
    <div class="font-serif text-black">
      <h1>${resumeData.contact?.firstName || ''} ${resumeData.contact?.surname || ''}</h1>
      <p>${resumeData.contact?.title || ''}</p>
      <!-- Add icons: <img src="assets/icons/phone.svg"> ${phone} -->
      <!-- Similarly for other sections -->
    </div>
  `;
  // Add work, education, etc.
  preview.innerHTML = html;
  // Apply color theme
  preview.style.color = document.getElementById('color-theme')?.value || 'black';
}

// Edit CV: Go back to step 1
function editCV() {
  showStep(1);
}

// Download PDF
function downloadPDF() {
  const element = document.getElementById('resume-preview');
  html2pdf().from(element).save('resume.pdf');
  // Log payment if not already
}
