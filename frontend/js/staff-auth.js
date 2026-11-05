const API=window.GMARG_API_BASE||"/api";
document.getElementById("staffLoginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const notice=document.getElementById("loginNotice");
  const button=form.querySelector("button[type='submit']");
  button.disabled=true;
  try{
    const data=Object.fromEntries(new FormData(form));
    const res=await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({...data,role:"staff"})});
    const result=await res.json();
    if(res.ok&&result.user.role==="staff"){
      location.href="staff-dashboard.html";
    }
    else{notice.textContent=result.message||"Login failed";notice.classList.add("show")}
  }catch(error){
    notice.textContent="Unable to connect to the server.";
    notice.classList.add("show");
  }finally{button.disabled=false}
});

const loginPanel=document.getElementById("staffLoginPanel");
const forgotPanel=document.getElementById("forgotPasswordPanel");
const forgotNotice=document.getElementById("forgotNotice");
let recoveryPhone="";

document.getElementById("forgotPasswordLink").addEventListener("click",e=>{
  e.preventDefault();
  loginPanel.hidden=true;
  forgotPanel.hidden=false;
  forgotNotice.className="notice";
  forgotNotice.textContent="";
});
document.getElementById("backToStaffLogin").addEventListener("click",e=>{
  e.preventDefault();
  forgotPanel.hidden=true;
  loginPanel.hidden=false;
});

document.getElementById("staffPhoneForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const button=form.querySelector("button");
  recoveryPhone=new FormData(form).get("phone").trim();
  button.disabled=true;
  try{
    const res=await fetch(`${API}/auth/staff/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:recoveryPhone})});
    const result=await res.json();
    forgotNotice.className="notice show";
    if(res.ok){
      forgotNotice.textContent=result.message||"OTP sent to the staff member's number";
      form.hidden=true;
      document.getElementById("staffOtpForm").hidden=false;
    }else forgotNotice.textContent=result.message||"Unable to send OTP";
  }catch(error){
    forgotNotice.textContent="Unable to connect to the server.";
    forgotNotice.className="notice show";
  }finally{button.disabled=false}
});

let recoveryOtp="";

document.getElementById("staffOtpForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  recoveryOtp=new FormData(form).get("otp").trim();
  const button=form.querySelector("button");
  button.disabled=true;
  try{
    const res=await fetch(`${API}/auth/staff/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:recoveryPhone,otp:recoveryOtp})});
    const result=await res.json();
    forgotNotice.className="notice show";
    forgotNotice.textContent=result.message||"OTP verification failed";
    if(res.ok){
      form.hidden=true;
      document.getElementById("staffResetForm").hidden=false;
      document.querySelector('#staffResetForm input[name="password"]').focus();
    }
  }catch(error){
    forgotNotice.textContent="Unable to connect to the server.";
    forgotNotice.className="notice show";
  }finally{button.disabled=false}
});

document.getElementById("staffResetForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const data=Object.fromEntries(new FormData(form));
  const button=form.querySelector("button");
  if(data.password!==data.confirmPassword){
    forgotNotice.textContent="Passwords do not match";
    forgotNotice.className="notice show";
    return;
  }
  button.disabled=true;
  try{
    const res=await fetch(`${API}/auth/staff/reset-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:recoveryPhone,otp:recoveryOtp,password:data.password})});
    const result=await res.json();
    forgotNotice.className="notice show";
    forgotNotice.textContent=result.message||"Password reset failed";
    if(res.ok){
      form.hidden=true;
      setTimeout(()=>{forgotPanel.hidden=true;loginPanel.hidden=false},1400);
    }
  }catch(error){
    forgotNotice.textContent="Unable to connect to the server.";
    forgotNotice.className="notice show";
  }finally{button.disabled=false}
});
