(()=>{var d=(m,t,i)=>new Promise((n,e)=>{var a=s=>{try{r(i.next(s))}catch(o){e(o)}},l=s=>{try{r(i.throw(s))}catch(o){e(o)}},r=s=>s.done?n(s.value):Promise.resolve(s.value).then(a,l);r((i=i.apply(m,t)).next())});var u=class{constructor(t){this.apiBaseUrl=t||"/api/database",this.cache={events:null,communications:null,staff:null}}fetchCollection(t){return d(this,null,function*(){if(this.cache[t])return this.cache[t];try{let n=yield(yield fetch(`${this.apiBaseUrl}/index.php`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({functionname:"get",collection:t,arguments:{}})})).json();if(n.success)return this.cache[t]=n.result,n.result;throw new Error(n.error||"Failed to fetch collection")}catch(i){throw console.error(`Error fetching ${t}:`,i),i}})}getEvents(){return d(this,null,function*(){return this.fetchCollection("events")})}getCommunications(){return d(this,null,function*(){return this.fetchCollection("communications")})}getStaff(){return d(this,null,function*(){return this.fetchCollection("staff")})}formatDate(t){return new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}formatDateTime(t){return new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}parseMarkdown(t){return t?t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}renderEvents(t=".collections-section.events"){return d(this,null,function*(){let i=document.querySelector(t);if(!i)return;let n=i.querySelector(".collections-layout.events");n&&(n.innerHTML='<div class="loading">Loading events...</div>');try{let e=yield this.getEvents();if(!e||e.length===0){n.innerHTML='<div class="no-data">No events available</div>';return}e.sort((c,v)=>new Date(c.date)-new Date(v.date));let a=e[0],l=`
                <div class="event-details">
                    <div class="event-details-content" data-event-id="0">
                        <h3 class="event-title">${a.title}</h3>
                        <p class="event-date">${this.formatDateTime(a.date)}</p>
                        <div class="event-location">
                            <p>${a.location}</p>
                        </div>
                        ${a.details?`
                            <div class="event-full-details">
                                ${this.parseMarkdown(a.details)}
                            </div>
                        `:""}
                    </div>
                </div>
            `,s=`
                <div class="event-list">
                    ${e.map((c,v)=>`
                <div class="event-item ${v===0?"active":""}" 
                     data-event-index="${v}" 
                     data-event-date="${c.date}">
                    <h4 class="event-item-title">${c.title}</h4>
                    <p class="event-item-date">${this.formatDateTime(c.date)}</p>
                    <div class="event-item-data" style="display: none;">
                        <span class="event-location">${c.location}</span>
                        <span class="event-details">${c.details||""}</span>
                    </div>
                </div>
            `).join("")}
                </div>
            `,o=`
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
            `;n.innerHTML=l+s+o,window.initializeEventHandlers&&window.initializeEventHandlers()}catch(e){n.innerHTML=`<div class="error">Error loading events: ${e.message}</div>`}})}renderCalendarView(t=".collections-section.calendar_view"){return d(this,null,function*(){let i=document.querySelector(t);if(i)try{let n=yield this.getEvents();window.calendarEventsData=n;let e=n.map(l=>`
                <div class="event-data-item" 
                     data-title="${l.title}"
                     data-date="${l.date}"
                     data-location="${l.location}"
                     data-details="${l.details||""}">
                </div>
            `).join(""),a=i.querySelector(".events-data");a&&(a.innerHTML=e),window.initializeCalendar&&window.initializeCalendar()}catch(n){console.error("Error loading calendar events:",n)}})}renderCommunications(t=".collections-section.communications"){return d(this,null,function*(){let i=document.querySelector(t);if(!i)return;let n=i.querySelector(".communication-list");n&&(n.innerHTML='<div class="loading">Loading communications...</div>');try{let e=yield this.getCommunications();if(!e||e.length===0){n.innerHTML='<div class="no-data">No communications available</div>';return}e.sort((o,c)=>new Date(c.date)-new Date(o.date));let a=e.map((o,c)=>`
                <div class="communication-item ${c>=3?"hidden-comm":""}" data-comm-index="${c}">
                    <div class="communication-header">
                        <button class="communication-button">Click to view info</button>
                        <h4 class="communication-subject">${o.subject}</h4>
                        <p class="communication-date">${this.formatDate(o.date)}</p>
                    </div>
                    <div class="communication-modal-data" style="display: none;">
                        <div class="communication-modal-subject">${o.subject}</div>
                        <div class="communication-modal-date">${this.formatDate(o.date)}</div>
                        <div class="communication-modal-body">${this.parseMarkdown(o.content)}</div>
                    </div>
                </div>
            `).join(""),l=e.length>3?`
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
            `,s=i.querySelector(".collections-layout");s&&(s.innerHTML=`
                    <div class="communication-list">${a}</div>
                    ${l}
                    ${r}
                `),window.initializeCommunicationHandlers&&window.initializeCommunicationHandlers()}catch(e){n.innerHTML=`<div class="error">Error loading communications: ${e.message}</div>`}})}initializeAll(){return d(this,null,function*(){let t=document.querySelectorAll(".collections-section.events"),i=document.querySelectorAll(".collections-section.calendar_view"),n=document.querySelectorAll(".collections-section.communications"),e=[];t.forEach(a=>{e.push(this.renderEvents(".collections-section.events"))}),i.forEach(a=>{e.push(this.renderCalendarView(".collections-section.calendar_view"))}),n.forEach(a=>{e.push(this.renderCommunications(".collections-section.communications"))}),yield Promise.all(e)})}};window.CollectionsAPI=u;document.addEventListener("DOMContentLoaded",()=>{let m="/api/database";new u(m).initializeAll()});})();
