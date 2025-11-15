// Basic dataset for countries/states/cities and phone codes
const data = {
  "India": {
    code: "+91",
    states: {
      "Uttar Pradesh": ["Lucknow","Kanpur","Varanasi"],
      "Maharashtra": ["Mumbai","Pune","Nagpur"]
    }
  },
  "United States": {
    code: "+1",
    states: {
      "California": ["San Francisco","Los Angeles","San Diego"],
      "New York": ["New York City","Buffalo","Albany"]
    }
  },
  "Canada": {
    code: "+1",
    states: {
      "Ontario": ["Toronto","Ottawa"],
      "British Columbia": ["Vancouver","Victoria"]
    }
  }
};

const disposableDomains = ["tempmail.com","10minutemail.com","mailinator.com","guerrillamail.com","maildrop.cc"];

const $ = (id) => document.getElementById(id);
const form = $("regForm");
const submitBtn = $("submitBtn");
const topMessages = $("top-messages");

function populateCountries(){
  const countrySelect = $("country");
  countrySelect.innerHTML = `<option value="">Select</option>` + Object.keys(data).map(c => `<option value="${c}">${c}</option>`).join("");
  populateStates();
}

function populateStates(){
  const country = $("country").value;
  const stateSelect = $("state");
  stateSelect.innerHTML = `<option value="">Select</option>`;
  $("city").innerHTML = `<option value="">Select</option>`;
  if(!country || !data[country]) return;
  const states = Object.keys(data[country].states);
  stateSelect.innerHTML += states.map(s => `<option value="${s}">${s}</option>`).join("");
}

function populateCities(){
  const country = $("country").value;
  const state = $("state").value;
  const citySelect = $("city");
  citySelect.innerHTML = `<option value="">Select</option>`;
  if(!country || !state) return;
  const cities = data[country].states[state] || [];
  citySelect.innerHTML += cities.map(c => `<option value="${c}">${c}</option>`).join("");
}

function showTopError(msg){ topMessages.innerHTML = `<div class="top-error">${msg}</div>`; }
function showTopSuccess(msg){ topMessages.innerHTML = `<div class="top-success">${msg}</div>`; setTimeout(()=> topMessages.innerHTML="",5000); }

function markInvalid(el, msg){
  if(!el) return;
  el.classList.add("invalid");
  const id = el.id || el.name;
  const err = $("err-" + id) || null;
  if(err) err.textContent = msg || "";
}

function clearInvalid(el){
  if(!el) return;
  el.classList.remove("invalid");
  const id = el.id || el.name;
  const err = $("err-" + id) || null;
  if(err) err.textContent = "";
}

function validateEmail(email){
  if(!email) return false;
  const parts = email.split("@");
  if(parts.length !== 2) return false;
  if(disposableDomains.includes(parts[1].toLowerCase())) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function passwordStrength(pass){
  let score = 0;
  if(!pass) return {score:0,label:""};
  if(pass.length >= 8) score++;
  if(/[A-Z]/.test(pass)) score++;
  if(/[0-9]/.test(pass)) score++;
  if(/[^A-Za-z0-9]/.test(pass)) score++;
  let label = "Weak";
  if(score >= 3) label = "Medium";
  if(score >= 4) label = "Strong";
  return {score,label};
}

function validatePhone(phone, country){
  if(!phone) return false;
  // must start with + and digits
  if(!/^\+\d{6,15}$/.test(phone)) return false;
  if(country && data[country]){
    const code = data[country].code;
    if(!phone.startsWith(code)) return false;
  }
  return true;
}

function checkFormValidity(){
  // required fields
  let ok = true;
  const first = $("firstName"), last = $("lastName"), email = $("email"), phone = $("phone"), terms = $("terms");
  const gender = document.querySelector('input[name="gender"]:checked');
  if(!first.value.trim()){ markInvalid(first,"First name required"); ok=false; } else clearInvalid(first);
  if(!last.value.trim()){ markInvalid(last,"Last name required"); ok=false; } else clearInvalid(last);
  if(!validateEmail(email.value.trim())){ markInvalid(email,"Invalid email or disposable domain not allowed"); ok=false; } else clearInvalid(email);
  if(!validatePhone(phone.value.trim(), $("country").value)){ markInvalid(phone,"Invalid phone or missing country code"); ok=false; } else clearInvalid(phone);
  if(!gender){ showInline("err-gender","Please select gender"); ok=false; } else showInline("err-gender","");
  if(!terms.checked){ showInline("err-terms","You must accept terms"); ok=false; } else showInline("err-terms","");
  // password match if filled
  const pw = $("password").value, cpw = $("confirmPassword").value;
  if(pw || cpw){
    if(pw.length < 6){ markInvalid($("password"),"Password too short"); ok=false; } else clearInvalid($("password"));
    if(pw !== cpw){ markInvalid($("confirmPassword"),"Passwords do not match"); ok=false; } else clearInvalid($("confirmPassword"));
  } else { clearInvalid($("password")); clearInvalid($("confirmPassword")); }

  submitBtn.disabled = !ok;
  return ok;
}

function showInline(id, msg){ const el = $(id); if(el) el.textContent = msg; }

// Event listeners
document.addEventListener("DOMContentLoaded", ()=>{
  populateCountries();
  document.querySelectorAll("input,textarea,select").forEach(el=>{
    el.addEventListener("input", checkFormValidity);
    el.addEventListener("change", checkFormValidity);
  });
  $("country").addEventListener("change", ()=>{ populateStates(); populateCities(); checkFormValidity(); });
  $("state").addEventListener("change", ()=>{ populateCities(); checkFormValidity(); });
  $("password").addEventListener("input", ()=>{
    const pw = $("password").value;
    const meter = $("password-strength-meter");
    const txt = $("password-strength-text");
    const s = passwordStrength(pw);
    meter.value = s.score;
    txt.textContent = s.label ? `${s.label} password` : "";
    checkFormValidity();
  });

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    // final validation
    if(!checkFormValidity()){
      showTopError("Please fix errors before submitting.");
      return;
    }
    // simulate success
    showTopSuccess("Registration Successful! Your profile has been submitted successfully.");
    // reset form after success
    form.reset();
    $("password-strength-meter").value = 0;
    $("password-strength-text").textContent = "";
    submitBtn.disabled = true;
  });
});

// small helper to expose some API for automated tests
window.__testHelpers = {
  fill: function(data){
    if(data.firstName !== undefined) $("firstName").value = data.firstName;
    if(data.lastName !== undefined) $("lastName").value = data.lastName;
    if(data.email !== undefined) $("email").value = data.email;
    if(data.phone !== undefined) $("phone").value = data.phone;
    if(data.age !== undefined) $("age").value = data.age;
    if(data.gender !== undefined){
      const g = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
      if(g) g.checked = true;
    }
    if(data.address !== undefined) $("address").value = data.address;
    if(data.country !== undefined){ $("country").value = data.country; populateStates(); }
    if(data.state !== undefined){ $("state").value = data.state; populateCities(); }
    if(data.city !== undefined) $("city").value = data.city;
    if(data.password !== undefined) $("password").value = data.password;
    if(data.confirmPassword !== undefined) $("confirmPassword").value = data.confirmPassword;
    if(data.terms !== undefined) $("terms").checked = data.terms;
    // trigger input events
    document.querySelectorAll("input,textarea,select").forEach(el=> el.dispatchEvent(new Event('input')) );
    document.querySelectorAll("input,textarea,select").forEach(el=> el.dispatchEvent(new Event('change')) );
  },
  getTopMessage: function(){ return topMessages.innerText || ""; },
  isSubmitEnabled: function(){ return !submitBtn.disabled; }
};
