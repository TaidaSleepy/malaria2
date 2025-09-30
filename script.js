// MalariaHealthWebsite: Main app class for user authentication and dashboard logic
class MalariaHealthWebsite {
    constructor() {
       
        this.currentUser = null;
      
        this.medications = JSON.parse(localStorage.getItem('medications')) || [];
      
        this.activePatients = 2; 
      
        this.patientList = [
            { name: "Donald J Trump", dob: "2024-10-12", status: "Under treatment" },
            { name: "Samuel Gordon", dob: "2027-11-19", status: "Its over for you chief" }
        ];
       
        window.app = this;
       
        this.init();
    }

    // Set up event listeners for all buttons, forms, and navigation
    init() {
        this.setupEventListeners();
        this.checkExistingLogin();
    }


    setupEventListeners() {
        // Login role selection buttons
        document.querySelectorAll('.login-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRoleSelection(e));
        });

  
        document.getElementById('backToRole')?.addEventListener('click', () => this.showRoleSelection());

        // Login form 
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));

       
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());

        // Navigation buttons for all sections of the website
        document.getElementById('homeBtn')?.addEventListener('click', () => this.showSection('home'));
        document.getElementById('symptomBtn')?.addEventListener('click', () => this.showSection('symptom'));
        document.getElementById('medicationBtn')?.addEventListener('click', () => this.showSection('medication'));
        document.getElementById('providerBtn')?.addEventListener('click', () => this.showSection('provider'));
        document.getElementById('communityBtn')?.addEventListener('click', () => this.showSection('community'));
        document.getElementById('adminBtn')?.addEventListener('click', () => this.showSection('admin'));

        // Medication add/cancel buttons as well as form submission and frequency change
        document.getElementById('addMedicationBtn')?.addEventListener('click', () => this.showMedicationForm());
        document.getElementById('cancelMedication')?.addEventListener('click', () => this.hideMedicationForm());
        document.getElementById('enableNotificationsBtn')?.addEventListener('click', () => this.enableNotifications());
        document.getElementById('newMedicationForm')?.addEventListener('submit', (e) => this.addMedication(e));
        document.getElementById('medFrequency')?.addEventListener('change', (e) => this.generateTimeInputs(e.target.value));

    
        document.getElementById('symptomForm')?.addEventListener('submit', (e) => this.handleSymptomCheck(e));

     
        document.getElementById('patientRegistration')?.addEventListener('submit', (e) => this.registerPatient(e));
    }

    // Show login for chosen role and set correct role for demo accounts
    handleRoleSelection(e) {
        let role = e.currentTarget.dataset.role;
        // Map 'provider' to 'provider' for demoAccounts
        if (role === "provider") role = "provider";
        document.querySelector('.login-options').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('loginTitle').textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
        document.getElementById('loginForm').dataset.role = role;
    }

 
    showRoleSelection() {
        document.querySelector('.login-options').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    }

    // Handle login form submission and authentication
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginForm').dataset.role;
        // Demo accounts for testing
        const demoAccounts = {
            'patient@gmail.com': { password: '1234567890', role: 'patient', name: 'Bartholemew Patient' },
            'doctor@gmail.com': { password: '1234567890', role: 'provider', name: 'Dr. Samuel' }
        };
        const acc = demoAccounts[email];
       
        if (acc && acc.password === password && acc.role === role) {
            this.currentUser = { email, role: acc.role, name: acc.name };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showMainApp();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    // Check if already logged in
    checkExistingLogin() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        }
    }

    // Logout returns you to login screen
    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLoginScreen();
        this.showNotification('Logged out successfully', 'success');
    }

    // Show login modal, hide all dashboard and sections
    showLoginScreen() {
        document.getElementById('loginModal').classList.remove('hidden');
        document.querySelector('header').classList.add('hidden');
        document.querySelector('main').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
        this.showRoleSelection();
    }

    // Show main app after login, update dashboard and navigation
    showMainApp() {
        document.getElementById('loginModal').classList.add('hidden');
        document.querySelector('header').classList.remove('hidden');
        document.querySelector('main').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        this.updateUserInterface();
        this.showSection('home');
        this.displayMedications();
        this.updateActivePatients();
        this.renderPatientList();
    }

    // Update nav and dashboard for patient/provider role
    updateUserInterface() {
        document.getElementById('userGreeting').textContent = this.currentUser.name;
        document.getElementById('userInfo').textContent = `Logged in as ${this.currentUser.role} - ${this.currentUser.email}`;
        // Show/hide nav buttons and dashboard cards based on role
        const patientFeatures = document.getElementById('medicationBtn');
        const providerFeatures = document.getElementById('providerBtn');
        const communityBtn = document.getElementById('communityBtn');
        const adminBtn = document.getElementById('adminBtn');
        if (this.currentUser.role === 'patient') {
            patientFeatures.style.display = 'block';
            providerFeatures.style.display = 'none';
            communityBtn.classList.add('hidden');
            adminBtn.classList.add('hidden');
            document.getElementById('patientDashboard').classList.remove('hidden');
            document.getElementById('providerDashboard').classList.add('hidden');
        } else {
            patientFeatures.style.display = 'none';
            providerFeatures.style.display = 'block';
            communityBtn.classList.remove('hidden');
            adminBtn.classList.remove('hidden');
            document.getElementById('patientDashboard').classList.add('hidden');
            document.getElementById('providerDashboard').classList.remove('hidden');
        }
        this.updateActivePatients();
    }

    // Show a section (home, symptom, medication, etc.)
    showSection(sectionId) {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
    
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
        }
        // Highlight active nav button
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
        const navBtnId = sectionId + 'Btn';
        const navBtn = document.getElementById(navBtnId);
        if (navBtn) navBtn.classList.add('active');
        // Update medications view if needed
        if (sectionId === 'medication') this.displayMedications();
        if (sectionId === 'provider') this.renderPatientList();
    }

    // Show the medication form for adding a new medication
    showMedicationForm() {
        document.getElementById('medicationForm').classList.remove('hidden');
        document.getElementById('addMedicationBtn').classList.add('hidden');
        this.generateTimeInputs(1);
    }

    hideMedicationForm() {
        document.getElementById('medicationForm').classList.add('hidden');
        document.getElementById('addMedicationBtn').classList.remove('hidden');
        document.getElementById('newMedicationForm').reset();
    }

    // Create time inputs for medication, based on frequency
    generateTimeInputs(count) {
        const container = document.getElementById('timeInputs');
        container.innerHTML = '';
        count = Number(count) || 1;
        for (let i = 0; i < count; i++) {
            const timeGroup = document.createElement('div');
            timeGroup.className = 'time-input-group';
            timeGroup.innerHTML = `<label>Time ${i + 1}:</label><input type="time" class="med-time" required>`;
            container.appendChild(timeGroup);
        }
    }

    // Add a new medication, update localStorage and UI
    addMedication(e) {
        e.preventDefault();
        const name = document.getElementById('medName').value;
        const dosage = document.getElementById('medDosage').value;
        const startDate = document.getElementById('medStartDate').value;
        const duration = parseInt(document.getElementById('medDuration').value);
        const frequency = parseInt(document.getElementById('medFrequency').value);
        // Get times from time inputs
        const times = Array.from(document.getElementsByClassName('med-time'))
            .map(input => input.value)
            .filter(time => time);
        // Create medication object
        const medication = {
            id: Date.now(),
            name, dosage, startDate, duration, frequency, times, completed: [], createdAt: new Date().toISOString()
        };
        this.medications.push(medication);
        this.saveMedications();
        this.displayMedications();
        this.hideMedicationForm();
        this.showNotification('Medication added successfully!', 'success');
    }

    // Render all medications for the patient
    displayMedications() {
        const container = document.getElementById('medicationsContainer');
        if (!container) return;
        if (this.medications.length === 0) {
            container.innerHTML = '<p>No medications scheduled. Click "Add Medication" to get started.</p>';
            return;
        }
        container.innerHTML = this.medications.map(med => `
            <div class="medication-item">
                <div class="medication-info">
                    <h4>${med.name} (${med.dosage})</h4>
                    <div class="medication-times">
                        Times: ${med.times.join(', ')} | Duration: ${med.duration} days
                    </div>
                    <small>Started: ${new Date(med.startDate).toLocaleDateString()}</small>
                </div>
                <div class="medication-actions">
                    <button class="btn btn-success btn-sm" onclick="app.markMedicationTaken(${med.id})">Mark Taken</button>
                    <button class="btn btn-danger btn-sm" onclick="app.removeMedication(${med.id})">Remove</button>
                </div>
            </div>
        `).join('');
        this.updateMedicationStats();
    }

    // Tracks medication taken that day
    markMedicationTaken(medId) {
        const medication = this.medications.find(med => med.id === medId);
        if (medication) {
            const now = new Date();
            const today = now.toDateString();
            if (!medication.completed.includes(today)) {
                medication.completed.push(today);
                this.saveMedications();
                this.displayMedications();
                this.showNotification('Medication marked as taken!', 'success');
            } else {
                this.showNotification('Medication already taken today!', 'warning');
            }
        }
    }

    // Remove a medication from the schedule
    removeMedication(medId) {
        this.medications = this.medications.filter(med => med.id !== medId);
        this.saveMedications();
        this.displayMedications();
        this.showNotification('Medication removed!', 'success');
    }

    // Update stats for medication schedule (compliance, next med time)
    updateMedicationStats() {
        const today = new Date().toDateString();
        // Find all today's meds and compliance
        const todayMeds = this.medications.filter(med => 
            new Date(med.startDate) <= new Date() && 
            new Date(med.startDate).getTime() + (med.duration * 24 * 60 * 60 * 1000) >= new Date().getTime()
        );
        const takenToday = todayMeds.filter(med => med.completed.includes(today)).length;
        const totalToday = todayMeds.reduce((sum, med) => sum + med.frequency, 0);
        document.getElementById('medicationsToday').textContent = `${takenToday}/${totalToday}`;
        document.getElementById('complianceRate').textContent = totalToday > 0 ? 
            `${Math.round((takenToday / totalToday) * 100)}%` : '0%';
        // Find next medication time
        const nextMed = this.getNextMedicationTime();
        document.getElementById('nextMedication').textContent = nextMed || '--:--';
    }

    // Find the next scheduled medication time for today
    getNextMedicationTime() {
        const now = new Date();
        let nextTime = null;
        this.medications.forEach(med => {
            med.times.forEach(time => {
                const [hours, minutes] = time.split(':');
                const medDate = new Date();
                medDate.setHours(Number(hours), Number(minutes), 0, 0);
                if (medDate > now && (!nextTime || medDate < nextTime)) {
                    nextTime = medDate;
                }
            });
        });
        return nextTime ? nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    }

  
    saveMedications() {
        localStorage.setItem('medications', JSON.stringify(this.medications));
    }

    // Symptom checker: show risk based on user answers
    handleSymptomCheck(e) {
        e.preventDefault();
        const fever = e.target.fever.value;
        const chills = e.target.chills.value;
        const travel = e.target.travel.value;
        let risk = 0;
        if (fever === 'yes') risk++;
        if (chills === 'yes') risk++;
        if (travel === 'yes') risk++;
        let message;
        // Display risk assessment
        if (risk >= 2) {
            message = '<span style="color:#ea4335"><b>High risk for malaria! Please visit a health facility.</b></span>';
        } else if (risk === 1) {
            message = '<span style="color:#fbbc04"><b>Moderate risk. Monitor symptoms and seek care if worsens.</b></span>';
        } else {
            message = '<span style="color:#34a853"><b>Low risk for malaria.</b></span>';
        }
        document.getElementById('symptomResult').innerHTML = message;
    }

    // Show notification (success, error, etc)
    showNotification(msg, type = "info") {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        const div = document.createElement('div');
        div.className = `notification ${type}`;
        div.textContent = msg;
        container.appendChild(div);
        setTimeout(() => div.remove(), 3500);
    }
    enableNotifications() {
        this.showNotification('Notifications are enabled! (Simulated)', 'success');
    }

    // Provider Portal: Register a new patient and update UI
    registerPatient(e) {
        e.preventDefault();
      
        const name = document.getElementById('patientName').value.trim();
        const dob = document.getElementById('patientDOB').value;
        const notes = document.getElementById('caseNotes').value.trim();
   
        if (!name || !dob || !notes) {
            this.showNotification('Please fill all patient details!', 'error');
            return;
        }
    
        this.patientList.push({ name, dob, status: "Under treatment" });
        this.activePatients++;
        this.renderPatientList();
        this.updateActivePatients();
        document.getElementById('patientRegistration').reset();
        this.showNotification(`Patient ${name} registered!`, 'success');
    }

    // Provider Portal: Render the patient list in the UI
    renderPatientList() {
        const ul = document.getElementById('registeredPatients');
        if (!ul) return;
        ul.innerHTML = this.patientList.map(
            p => `<li>${p.name}, ${p.dob}, <span class="status">${p.status}</span></li>`
        ).join('');
    }

    // Provider Dashboard: Update the active patients stat card
    updateActivePatients() {
        const el = document.getElementById('activePatients');
        if (el) el.textContent = this.activePatients;
    }
}

// Initialize app on page load
window.onload = () => {
    new MalariaHealthWebsite();
};
