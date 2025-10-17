function payAndDownload() {
  const { data: { user } } = supabase.auth.getUser();
  if (!user) {
    alert('Please log in to download.');
    return;
  }
  payWithPaystack();
}

function payWithPaystack() {
  alert("Payment successful! Resume download unlocked.");
  document.getElementById('download-btn').classList.remove('hidden');
  const { data: { user } } = supabase.auth.getUser();
  logPayment(user.id, 'success', 'mock-ref');
}
