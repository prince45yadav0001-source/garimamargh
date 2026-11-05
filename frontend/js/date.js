const el=document.getElementById("currentDate");if(el)el.textContent=`आजको मिति: ${new Intl.DateTimeFormat("ne-NP",{dateStyle:"medium"}).format(new Date())}`;
