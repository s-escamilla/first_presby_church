(()=>{document.addEventListener("DOMContentLoaded",function(){let a=document.querySelectorAll(".event-item"),s=document.querySelector(".event-details"),e=document.querySelector(".event-modal"),u=document.querySelector(".event-modal-overlay"),y=document.querySelector(".event-modal-close");if(!a.length)return;let m=new Date;a.forEach(t=>{new Date(t.dataset.eventDate)<m&&t.classList.add("past-event")});function f(){return window.innerWidth<768}function L(t,i,c,n){let o=`
            <div class="event-details-content">
                <h3 class="event-title">${t}</h3>
                <p class="event-date">${i}</p>
                <div class="event-location">
                    <p>${c}</p>
                </div>
        `;return n&&n.trim()!==""&&(o+=`
                <div class="event-full-details">
                    <p>${n}</p>
                </div>
            `),o+="</div>",o}function q(t,i,c,n){if(!e)return;let o=e.querySelector(".modal-event-title"),l=e.querySelector(".modal-event-date"),d=e.querySelector(".modal-event-location"),r=e.querySelector(".modal-event-details");o&&(o.textContent=t),l&&(l.textContent=i),d&&(d.textContent=c),r&&(n&&n.trim()!==""?(r.textContent=n,r.style.display="block"):r.style.display="none"),e.classList.add("active"),document.body.style.overflow="hidden"}function v(){e&&(e.classList.remove("active"),document.body.style.overflow="")}y&&y.addEventListener("click",v),u&&u.addEventListener("click",v),document.addEventListener("keydown",function(t){t.key==="Escape"&&e&&e.classList.contains("active")&&v()}),a.forEach(t=>{t.addEventListener("click",function(){a.forEach(d=>d.classList.remove("active")),this.classList.add("active");let i=this.querySelector(".event-item-title").textContent,c=this.querySelector(".event-item-date").textContent,n=this.querySelector(".event-item-data"),o=n.querySelector(".event-location").textContent,l=n.querySelector(".event-details").textContent;f()?q(i,c,o,l):s&&(s.style.opacity="0",setTimeout(()=>{s.innerHTML=L(i,c,o,l),s.style.opacity="1"},200))})})});})();
