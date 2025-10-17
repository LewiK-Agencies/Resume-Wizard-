const supabaseUrl = 'https://YOUR-PROJECT.supabase.co';
const supabaseKey = 'PUBLIC-ANON-KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Auth functions
async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else {
    await supabase.from('users').insert([{ id: data.user.id, email, full_name: fullName }]);
    alert('Sign up successful! Please log in.');
  }
}

async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    document.getElementById('user-email').textContent = data.user.email;
    document.getElementById('user-email').classList.remove('hidden');
    document.getElementById('logout-btn').classList.remove('hidden');
    document.getElementById('login-btn').classList.add('hidden');
    document.getElementById('signup-btn').classList.add('hidden');
    loadSavedResumes(data.user.id);
  }
}

async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
  else location.reload();
}

// Save Resume
async function saveResume(userId, resumeData, templateStyle) {
  const { data, error } = await supabase.from('resumes').insert([{ 
    user_id: userId, 
    resume_data: resumeData,
    template_style: templateStyle
  }]);
  if (error) console.error(error);
}

// Retrieve Resumes
async function loadSavedResumes(userId) {
  const { data, error } = await supabase.from('resumes').select('*').eq('user_id', userId);
  if (error) console.error(error);
  else {
    // Load latest or list them (for simplicity, load latest)
    if (data.length > 0) {
      const latest = data[data.length - 1];
      resumeData = latest.resume_data;
      renderPreview();
    }
  }
}

// Log Payment
async function logPayment(userId, status, reference) {
  const { error } = await supabase.from('payments').insert([{ 
    user_id: userId, 
    product_type: 'Resume',
    amount: 119,
    status,
    reference
  }]);
  if (error) console.error(error);
}
