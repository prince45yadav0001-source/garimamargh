const API=window.GMARG_API_BASE||"/api";
document.getElementById("clientLoginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const notice=document.getElementById("loginNotice");
  const button=form.querySelector("button[type='submit']");
  button.disabled=true;
  try{
    const data=Object.fromEntries(new FormData(form));
    const res=await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({...data,role:"client"})});
    const result=await res.json();
    if(res.ok&&result.user.role==="client"){
      location.href="client-dashboard.html";
    }
    else{notice.textContent=result.message||"Login failed";notice.classList.add("show")}
  }catch(error){
    notice.textContent="Unable to connect to the server.";
    notice.classList.add("show");
  }finally{button.disabled=false}
});

const loginPanel=document.getElementById("clientLoginPanel");
const registerPanel=document.getElementById("clientRegisterPanel");
const forgotPanel=document.getElementById("clientForgotPanel");

function showPanel(panel){
  loginPanel.hidden=true;
  registerPanel.hidden=true;
  forgotPanel.hidden=true;
  panel.hidden=false;
}

document.getElementById("showRegisterLink").addEventListener("click",e=>{
  e.preventDefault();
  showPanel(registerPanel);
});
document.getElementById("backToClientLogin").addEventListener("click",e=>{
  e.preventDefault();
  showPanel(loginPanel);
});
document.getElementById("clientForgotLink").addEventListener("click",e=>{
  e.preventDefault();
  document.getElementById("clientForgotNotice").textContent="Client password recovery requires OTP delivery integration and is not currently enabled.";
  document.getElementById("clientForgotNotice").classList.add("show");
  showPanel(forgotPanel);
});
document.getElementById("backFromClientForgot").addEventListener("click",e=>{
  e.preventDefault();
  showPanel(loginPanel);
});

document.getElementById("clientRegisterForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const notice=document.getElementById("registerNotice");
  const button=form.querySelector("button[type='submit']");
  const data=Object.fromEntries(new FormData(form));
  notice.className="notice";
  notice.textContent="";
  if(data.password!==data.confirmPassword){
    notice.textContent="Passwords do not match";
    notice.classList.add("show");
    return;
  }
  button.disabled=true;
  try{
    const res=await fetch(`${API}/auth/client/register`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    const result=await res.json();
    notice.textContent=result.message||"Registration failed";
    notice.classList.add("show");
    if(res.ok){
      form.reset();
      setTimeout(()=>showPanel(loginPanel),1200);
    }
  }catch(error){
    notice.textContent="Unable to connect to the server.";
    notice.classList.add("show");
  }finally{
    button.disabled=false;
  }
});
