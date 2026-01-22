(()=>{var r=(m,i,n)=>new Promise((e,a)=>{var s=c=>{try{d(n.next(c))}catch(t){a(t)}},v=c=>{try{d(n.throw(c))}catch(t){a(t)}},d=c=>c.done?e(c.value):Promise.resolve(c.value).then(s,v);d((n=n.apply(m,i)).next())});var u=class{constructor(i){this.apiBaseUrl=i||"/api/database",this.cache={events:null,communications:null,staff:null}}fetchCollection(i){return r(this,null,function*(){if(this.cache[i])return this.cache[i];try{let e=yield(yield fetch(`${this.apiBaseUrl}/index.php`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({functionname:"get",collection:i,arguments:{}})})).json();if(e.success)return this.cache[i]=e.result,e.result;throw new Error(e.error||"Failed to fetch collection")}catch(n){throw console.error(`Error fetching ${i}:`,n),n}})}getEvents(){return r(this,null,function*(){return this.fetchCollection("events")})}getCommunications(){return r(this,null,function*(){return this.fetchCollection("communications")})}getStaff(){return r(this,null,function*(){return this.fetchCollection("staff")})}formatDate(i){return new Date(i).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}formatDateTime(i){return new Date(i).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}parseMarkdown(i){return i?i.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}renderEvents(i=".collections-section.events"){return r(this,null,function*(){let n=document.querySelector(i);if(!n)return;let e=n.querySelector(".collections-layout.events");e&&(e.innerHTML='<div class="loading">Loading events...</div>');try{let a=yield this.getEvents();if(!a||a.length===0){e.innerHTML='<div class="no-data">No events available</div>';return}a.sort((o,l)=>new Date(o.date)-new Date(l.date));let s=a[0],v=`
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
                    ${a.map((o,l)=>`
                <div class="event-item ${l===0?"active":""}" 
                     data-event-index="${l}" 
                     data-event-date="${o.date}">
                    <h4 class="event-item-title">${o.title}</h4>
                    <p class="event-item-date">${this.formatDateTime(o.date)}</p>
                    <div class="event-item-data" style="display: none;">
                        <span class="event-location">${o.location}</span>
                        <span class="event-details">${o.details||""}</span>
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
            `;e.innerHTML=v+c+t,window.dispatchEvent(new CustomEvent("eventsDataLoaded",{detail:{events:a}}))}catch(a){e.innerHTML=`<div class="error">Error loading events: ${a.message}</div>`}})}renderCalendarView(i=".collections-section.calendar_view"){return r(this,null,function*(){let n=document.querySelector(i);if(n)try{let e=yield this.getEvents();if(!e||e.length===0){let t=n.querySelector(".events-data");t&&(t.innerHTML='<div class="no-data">No events available</div>');let o=n.querySelector(".event-cards-container");o&&(o.innerHTML='<div class="no-data">No events available</div>');return}e.sort((t,o)=>new Date(t.date)-new Date(o.date)),window.calendarEventsData=e;let a=e.map(t=>`
                <div class="event-data-item" 
                     data-title="${t.title}"
                     data-date="${t.date}"
                     data-location="${t.location||""}"
                     data-details="${this.escapeHtml(t.details||"")}">
                </div>
            `).join(""),s=n.querySelector(".events-data");s&&(s.innerHTML=a);let v=e.map((t,o)=>{let l=new Date(t.date),h=l.getDate(),p=l.toLocaleDateString("en-US",{month:"short"}),y=l.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0});return`
                    <div class="event-card ${o>=6?"hidden-event":""}" data-event-date="${t.date}">
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
                `}).join(""),d=e.length>6?`
                <button class="event-show-more">Show More Events</button>
            `:"",c=n.querySelector(".event-cards-container");c&&(c.innerHTML=v+d)}catch(e){console.error("Error loading calendar events:",e);let a=n.querySelector(".events-data");a&&(a.innerHTML=`<div class="error">Error loading events: ${e.message}</div>`);let s=n.querySelector(".event-cards-container");s&&(s.innerHTML=`<div class="error">Error loading events: ${e.message}</div>`)}})}escapeHtml(i){let n=document.createElement("div");return n.textContent=i,n.innerHTML}renderCommunications(i=".collections-section.communications"){return r(this,null,function*(){let n=document.querySelector(i);if(!n)return;let e=n.querySelector(".communication-list");e&&(e.innerHTML='<div class="loading">Loading communications...</div>');try{let a=yield this.getCommunications();if(!a||a.length===0){e.innerHTML='<div class="no-data">No communications available</div>';return}a.sort((t,o)=>new Date(o.created_at)-new Date(t.created_at));let s=a.map((t,o)=>`
                <div class="communication-item ${o>=3?"hidden-comm":""}" data-comm-index="${o}">
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
            `:"",d=`
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
                    ${d}
                `),window.initializeCommunicationHandlers&&window.initializeCommunicationHandlers()}catch(a){e.innerHTML=`<div class="error">Error loading communications: ${a.message}</div>`}})}initializeAll(){return r(this,null,function*(){let i=document.querySelectorAll(".collections-section.events"),n=document.querySelectorAll(".collections-section.calendar_view"),e=document.querySelectorAll(".collections-section.communications"),a=[];i.forEach(s=>{a.push(this.renderEvents(".collections-section.events"))}),n.forEach(s=>{a.push(this.renderCalendarView(".collections-section.calendar_view"))}),e.forEach(s=>{a.push(this.renderCommunications(".collections-section.communications"))}),yield Promise.all(a)})}};window.CollectionsAPI=u;document.addEventListener("DOMContentLoaded",()=>{let m="/api/database";new u(m).initializeAll()});})();
