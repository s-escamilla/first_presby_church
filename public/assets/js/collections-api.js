(()=>{var r=(m,o,n)=>new Promise((t,a)=>{var s=c=>{try{d(n.next(c))}catch(e){a(e)}},v=c=>{try{d(n.throw(c))}catch(e){a(e)}},d=c=>c.done?t(c.value):Promise.resolve(c.value).then(s,v);d((n=n.apply(m,o)).next())});var u=class{constructor(o){this.apiBaseUrl=o||"/api/database",this.cache={events:null,communications:null,staff:null}}fetchCollection(o){return r(this,null,function*(){if(this.cache[o])return this.cache[o];try{let t=yield(yield fetch(`${this.apiBaseUrl}/index.php`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({functionname:"get",collection:o,arguments:{}})})).json();if(t.success)return this.cache[o]=t.result,t.result;throw new Error(t.error||"Failed to fetch collection")}catch(n){throw console.error(`Error fetching ${o}:`,n),n}})}getEvents(){return r(this,null,function*(){return this.fetchCollection("events")})}getCommunications(){return r(this,null,function*(){return this.fetchCollection("communications")})}getStaff(){return r(this,null,function*(){return this.fetchCollection("staff")})}formatDate(o){return new Date(o).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}formatDateTime(o){return new Date(o).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}parseMarkdown(o){return o?o.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}renderEvents(o=".collections-section.events"){return r(this,null,function*(){let n=document.querySelector(o);if(!n)return;let t=n.querySelector(".collections-layout.events");t&&(t.innerHTML='<div class="loading">Loading events...</div>');try{let a=yield this.getEvents();if(!a||a.length===0){t.innerHTML='<div class="no-data">No events available</div>';return}a.sort((i,l)=>new Date(i.date)-new Date(l.date));let s=a[0],v=`
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
            `,e=`
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
            `;t.innerHTML=v+c+e}catch(a){t.innerHTML=`<div class="error">Error loading events: ${a.message}</div>`}})}renderCalendarView(o=".collections-section.calendar_view"){return r(this,null,function*(){let n=document.querySelector(o);if(n)try{let t=yield this.getEvents();if(!t||t.length===0){let e=n.querySelector(".events-data");e&&(e.innerHTML='<div class="no-data">No events available</div>');let i=n.querySelector(".event-cards-container");i&&(i.innerHTML='<div class="no-data">No events available</div>');return}t.sort((e,i)=>new Date(e.date)-new Date(i.date)),window.calendarEventsData=t;let a=t.map(e=>`
                <div class="event-data-item" 
                     data-title="${e.title}"
                     data-date="${e.date}"
                     data-location="${e.location||""}"
                     data-details="${this.escapeHtml(e.details||"")}">
                </div>
            `).join(""),s=n.querySelector(".events-data");s&&(s.innerHTML=a);let v=t.map((e,i)=>{let l=new Date(e.date),h=l.getDate(),p=l.toLocaleDateString("en-US",{month:"short"}),y=l.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0});return`
                    <div class="event-card ${i>=6?"hidden-event":""}" data-event-date="${e.date}">
                        <div class="event-card-date-badge" data-date="${e.date}">
                            <div class="event-day">${h}</div>
                            <div class="event-month">${p}</div>
                        </div>
                        <div class="event-card-content">
                            <h4 class="event-card-title">${e.title}</h4>
                            <p class="event-card-time">${y}</p>
                            <p class="event-card-location">${e.location||"Location TBD"}</p>
                            ${e.details?`<p class="event-card-details">${e.details.substring(0,100)}${e.details.length>100?"...":""}</p>`:""}
                        </div>
                    </div>
                `}).join(""),d=t.length>6?`
                <button class="event-show-more">Show More Events</button>
            `:"",c=n.querySelector(".event-cards-container");c&&(c.innerHTML=v+d),window.dispatchEvent(new CustomEvent("calendarDataLoaded",{detail:{events:t}}))}catch(t){console.error("Error loading calendar events:",t);let a=n.querySelector(".events-data");a&&(a.innerHTML=`<div class="error">Error loading events: ${t.message}</div>`);let s=n.querySelector(".event-cards-container");s&&(s.innerHTML=`<div class="error">Error loading events: ${t.message}</div>`)}})}escapeHtml(o){let n=document.createElement("div");return n.textContent=o,n.innerHTML}renderCommunications(o=".collections-section.communications"){return r(this,null,function*(){let n=document.querySelector(o);if(!n)return;let t=n.querySelector(".communication-list");t&&(t.innerHTML='<div class="loading">Loading communications...</div>');try{let a=yield this.getCommunications();if(!a||a.length===0){t.innerHTML='<div class="no-data">No communications available</div>';return}a.sort((e,i)=>new Date(i.created_at)-new Date(e.created_at));let s=a.map((e,i)=>`
                <div class="communication-item ${i>=3?"hidden-comm":""}" data-comm-index="${i}">
                    <div class="communication-header">
                        <button class="communication-button">Click to view info</button>
                        <h4 class="communication-subject">${e.subject}</h4>
                        <p class="communication-date">${this.formatDate(e.created_at)}</p>
                    </div>
                    <div class="communication-modal-data" style="display: none;">
                        <div class="communication-modal-subject">${e.subject}</div>
                        <div class="communication-modal-date">${this.formatDate(e.created_at)}</div>
                        <div class="communication-modal-body">${this.parseMarkdown(e.content||"")}</div>
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
                `)}catch(a){t.innerHTML=`<div class="error">Error loading communications: ${a.message}</div>`}})}initializeAll(){return r(this,null,function*(){let o=document.querySelectorAll(".collections-section.events"),n=document.querySelectorAll(".collections-section.calendar_view"),t=document.querySelectorAll(".collections-section.communications"),a=[];o.forEach(s=>{a.push(this.renderEvents(".collections-section.events"))}),n.forEach(s=>{a.push(this.renderCalendarView(".collections-section.calendar_view"))}),t.forEach(s=>{a.push(this.renderCommunications(".collections-section.communications"))}),yield Promise.all(a)})}};window.CollectionsAPI=u;document.addEventListener("DOMContentLoaded",()=>{let m="/api/database";new u(m).initializeAll()});})();
