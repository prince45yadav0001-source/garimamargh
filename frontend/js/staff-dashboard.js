const API=window.GMARG_API_BASE||"/api";
async function api(path,options={}){const res=await fetch(API+path,{credentials:"include",...options});if(res.status===401||res.status===403){location.href="staff-login.html";throw new Error("Unauthorized")}return res.json()}
async function load(){const inquiries=await api("/staff/inquiries");document.getElementById("inquiryRows").innerHTML=inquiries.map(i=>`<tr><td>${i.id}</td><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.email)}</td><td>${escapeHtml(i.message)}</td><td><span class="status">${i.status}</span></td><td><select onchange="updateStatus(${i.id},this.value)"><option ${i.status==="new"?"selected":""}>new</option><option ${i.status==="in_progress"?"selected":""}>in_progress</option><option ${i.status==="completed"?"selected":""}>completed</option></select></td></tr>`).join("")}
async function updateStatus(id,status){await api(`/staff/inquiries/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});load()}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c])}
document.getElementById("logoutBtn").addEventListener("click",async()=>{await fetch(`${API}/auth/logout`,{method:"POST",credentials:"include"});location.href="login.html"});
load().catch(()=>{});
