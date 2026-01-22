(()=>{document.addEventListener("DOMContentLoaded",function(){function r(){let e=document.querySelectorAll(".event-item"),t=new Date;e.forEach(a=>{new Date(a.dataset.eventDate)<t&&a.classList.add("past-event")})}r();function f(){return window.innerWidth<768}function p(e,t,a,o){let n=`
            <div class="event-details-content">
                <h3 class="event-title">${e}</h3>
                <p class="event-date">${t}</p>
                <div class="event-location">
                    <p>${a}</p>
                </div>
        `;return o&&o.trim()!==""&&(n+=`
                <div class="event-full-details">
                    <p>${o}</p>
                </div>
            `),n+="</div>",n}function L(e,t,a,o){let n=document.querySelector(".popup-modal#eventModal");if(!n)return;let l=n.querySelector(".modal-event-title"),i=n.querySelector(".modal-event-date"),s=n.querySelector(".modal-event-location"),c=n.querySelector(".modal-event-details");l&&(l.textContent=e),i&&(i.textContent=t),s&&(s.textContent=a),c&&(o&&o.trim()!==""?(c.textContent=o,c.style.display="block"):c.style.display="none"),n.classList.add("active"),document.body.style.overflow="hidden"}function v(){let e=document.querySelector(".popup-modal#eventModal");e&&(e.classList.remove("active"),document.body.style.overflow="")}document.body.addEventListener("click",function(e){var m,y;let t=e.target.closest(".event-item");if(!t)return;document.querySelectorAll(".event-item").forEach(q=>q.classList.remove("active")),t.classList.add("active");let o=t.querySelector(".event-item-title"),n=t.querySelector(".event-item-date"),l=t.querySelector(".event-item-data");if(!o||!n||!l)return;let i=o.textContent,s=n.textContent,c=((m=l.querySelector(".event-location"))==null?void 0:m.textContent)||"",u=((y=l.querySelector(".event-details"))==null?void 0:y.textContent)||"",d=document.querySelector(".event-details");f()?L(i,s,c,u):d&&(d.style.opacity="0",setTimeout(()=>{d.innerHTML=p(i,s,c,u),d.style.opacity="1"},200))}),document.body.addEventListener("click",function(e){(e.target.matches(".event-modal-close")||e.target.matches(".event-modal-overlay"))&&v()}),document.addEventListener("keydown",function(e){let t=document.querySelector(".popup-modal#eventModal");e.key==="Escape"&&t&&t.classList.contains("active")&&v()}),window.addEventListener("eventsDataLoaded",function(){r()})});})();
