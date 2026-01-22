(()=>{var d=(m,o,n)=>new Promise((e,a)=>{var s=c=>{try{r(n.next(c))}catch(t){a(t)}},v=c=>{try{r(n.throw(c))}catch(t){a(t)}},r=c=>c.done?e(c.value):Promise.resolve(c.value).then(s,v);r((n=n.apply(m,o)).next())});var u=class{constructor(o){this.apiBaseUrl=o||"/api/database",this.cache={events:null,communications:null,staff:null}}fetchCollection(o){return d(this,null,function*(){if(this.cache[o])return this.cache[o];try{let e=yield(yield fetch(`${this.apiBaseUrl}/index.php`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({functionname:"get",collection:o,arguments:{}})})).json();if(e.success)return this.cache[o]=e.result,e.result;throw new Error(e.error||"Failed to fetch collection")}catch(n){throw console.error(`Error fetching ${o}:`,n),n}})}getEvents(){return d(this,null,function*(){return this.fetchCollection("events")})}getCommunications(){return d(this,null,function*(){return this.fetchCollection("communications")})}getStaff(){return d(this,null,function*(){return this.fetchCollection("staff")})}formatDate(o){return new Date(o).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}formatDateTime(o){return new Date(o).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}parseMarkdown(o){return o?o.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}renderEvents(o=".collections-section.events"){return d(this,null,function*(){let n=document.querySelector(o);if(!n)return;let e=n.querySelector(".collections-layout.events");e&&(e.innerHTML='<div class="loading">Loading events...</div>');try{let a=yield this.getEvents();if(!a||a.length===0){e.innerHTML='<div class="no-data">No events available</div>';return}a.sort((i,l)=>new Date(i.date)-new Date(l.date));let s=a[0],v=`
                <div class="event-details">
                    <div class="event-details-content" data-event-id="0">
                        <h3 class="event-title">${s.title}</h3>
                        <p class="event-date">${this.formatDateTime(s.date)}</p>
                        <div class="event-location">
                            <p>${s.location}</p>
                        </div>
                        ${s.details?`
                            <div class="event-full-details">
                                ${this.parseMarkdown(s.details)}
                            </div>
                        `:""}
                    </div>
                </div>
            `,c=`
                <div class="event-list">
                    ${a.map((i,l)=>`
                <div class="event-item ${l===0?"active":""}" 
                     data-event-index="${l}" 
                     data-event-date="${i.date}">
                    <h4 class="event-item-title">${i.title}</h4>
                    <p class="event-item-date">${this.formatDateTime(i.date)}</p>
                    <div class="event-item-data" style="display: none;">
                        <span class="event-location">${i.location}</span>
                        <span class="event-details">${i.details||""}</span>
                    </div>
                </div>
            `).join("")}
                </div>
            `,t=`
                <div class="popup-modal" id="eventModal">
                    <div class="event-modal-overlay modal-overlay"></div>
                    <div class="popup-modal-content">
                        <button class="event-modal-close modal-close">&times;</button>
                        <div class="event-modal-body">
                            <h3 class="modal-event-title"></h3>
                            <p class="modal-event-date"></p>
                            <div class="modal-event-location"></div>
                            <div class="modal-event-details"></div>
                        </div>
                    </div>
                </div>
            `;e.innerHTML=v+c+t,window.dispatchEvent(new CustomEvent("eventsDataLoaded",{detail:{events:a}}))}catch(a){e.innerHTML=`<div class="error">Error loading events: ${a.message}</div>`}})}renderCalendarView(o=".collections-section.calendar_view"){return d(this,null,function*(){let n=document.querySelector(o);if(n)try{let e=yield this.getEvents();if(!e||e.length===0){let t=n.querySelector(".events-data");t&&(t.innerHTML='<div class="no-data">No events available</div>');let i=n.querySelector(".event-cards-container");i&&(i.innerHTML='<div class="no-data">No events available</div>');return}e.sort((t,i)=>new Date(t.date)-new Date(i.date)),window.calendarEventsData=e;let a=e.map(t=>`
                <div class="event-data-item" 
                     data-title="${t.title}"
                     data-date="${t.date}"
                     data-location="${t.location||""}"
                     data-details="${this.escapeHtml(t.details||"")}">
                </div>
            `).join(""),s=n.querySelector(".events-data");s&&(s.innerHTML=a);let v=e.map((t,i)=>{let l=new Date(t.date),h=l.getDate(),p=l.toLocaleDateString("en-US",{month:"short"}),y=l.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0});return`
                    <div class="event-card ${i>=6?"hidden-event":""}" data-event-date="${t.date}">
                        <div class="event-card-date-badge" data-date="${t.date}">
                            <div class="event-day">${h}</div>
                            <div class="event-month">${p}</div>
                        </div>
                        <div class="event-card-content">
                            <h4 class="event-card-title">${t.title}</h4>
                            <p class="event-card-time">${y}</p>
                            <p class="event-card-location">${t.location||"Location TBD"}</p>
                            ${t.details?`<p class="event-card-details">${t.details.substring(0,100)}${t.details.length>100?"...":""}</p>`:""}
                        </div>
                    </div>
                `}).join(""),r=e.length>6?`
                <button class="event-show-more">Show More Events</button>
            `:"",c=n.querySelector(".event-cards-container");c&&(c.innerHTML=v+r)}catch(e){console.error("Error loading calendar events:",e);let a=n.querySelector(".events-data");a&&(a.innerHTML=`<div class="error">Error loading events: ${e.message}</div>`);let s=n.querySelector(".event-cards-container");s&&(s.innerHTML=`<div class="error">Error loading events: ${e.message}</div>`)}})}escapeHtml(o){let n=document.createElement("div");return n.textContent=o,n.innerHTML}renderCommunications(o=".collections-section.communications"){return d(this,null,function*(){let n=document.querySelector(o);if(!n)return;let e=n.querySelector(".communication-list");e&&(e.innerHTML='<div class="loading">Loading communications...</div>');try{let a=yield this.getCommunications();if(!a||a.length===0){e.innerHTML='<div class="no-data">No communications available</div>';return}a.sort((t,i)=>new Date(i.created_at)-new Date(t.created_at));let s=a.map((t,i)=>`
                <div class="communication-item ${i>=3?"hidden-comm":""}" data-comm-index="${i}">
                    <div class="communication-header">
                        <button class="communication-button">Click to view info</button>
                        <h4 class="communication-subject">${t.subject}</h4>
                        <p class="communication-date">${this.formatDate(t.created_at)}</p>
                    </div>
                    <div class="communication-modal-data" style="display: none;">
                        <div class="communication-modal-subject">${t.subject}</div>
                        <div class="communication-modal-date">${this.formatDate(t.created_at)}</div>
                        <div class="communication-modal-body">${this.parseMarkdown(t.content||"")}</div>
                    </div>
                </div>
            `).join(""),v=a.length>3?`
                <div class="communication-show-more-container">
                    <button class="communication-show-more" id="showMoreComm">Show More</button>
                </div>
            `:"",r=`
                <div class="popup-modal" id="communicationModal">
                    <div class="communication-modal-overlay modal-overlay"></div>
                    <div class="popup-modal-content">
                        <button class="communication-modal-close modal-close">&times;</button>
                        <div class="communication-modal-body-container">
                            <h3 class="modal-comm-subject"></h3>
                            <p class="modal-comm-date"></p>
                            <div class="modal-comm-body"></div>
                        </div>
                    </div>
                </div>
            `,c=n.querySelector(".collections-layout");c&&(c.innerHTML=`
                    <div class="communication-list">${s}</div>
                    ${v}
                    ${r}
                `),window.dispatchEvent(new CustomEvent("communicationsDataLoaded",{detail:{communications:a}}))}catch(a){e.innerHTML=`<div class="error">Error loading communications: ${a.message}</div>`}})}initializeAll(){return d(this,null,function*(){let o=document.querySelectorAll(".collections-section.events"),n=document.querySelectorAll(".collections-section.calendar_view"),e=document.querySelectorAll(".collections-section.communications"),a=[];o.forEach(s=>{a.push(this.renderEvents(".collections-section.events"))}),n.forEach(s=>{a.push(this.renderCalendarView(".collections-section.calendar_view"))}),e.forEach(s=>{a.push(this.renderCommunications(".collections-section.communications"))}),yield Promise.all(a)})}};window.CollectionsAPI=u;document.addEventListener("DOMContentLoaded",()=>{let m="/api/database";new u(m).initializeAll()});})();
