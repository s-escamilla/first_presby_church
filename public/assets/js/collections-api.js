(()=>{var $=Object.create;var h=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var M=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var D=(c,e)=>()=>(e||c((e={exports:{}}).exports,e),e.exports);var T=(c,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of g(e))!C.call(c,a)&&a!==t&&h(c,a,{get:()=>e[a],enumerable:!(n=S(e,a))||n.enumerable});return c};var b=(c,e,t)=>(t=c!=null?$(M(c)):{},T(e||!c||!c.__esModule?h(t,"default",{value:c,enumerable:!0}):t,c));var d=(c,e,t)=>new Promise((n,a)=>{var s=l=>{try{r(t.next(l))}catch(o){a(o)}},m=l=>{try{r(t.throw(l))}catch(o){a(o)}},r=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,m);r((t=t.apply(c,e)).next())});var p=D(()=>{});var y=b(p());var u=class{constructor(e){this.apiBaseUrl=e||"/api/database",this.cache={events:null,communications:null,staff:null}}fetchCollection(e){return d(this,null,function*(){if(this.cache[e])return this.cache[e];try{let n=yield(yield fetch(`${this.apiBaseUrl}/index.php`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({functionname:"get",collection:e,arguments:{}})})).json();if(n.success)return this.cache[e]=n.result,n.result;throw new Error(n.error||"Failed to fetch collection")}catch(t){throw console.error(`Error fetching ${e}:`,t),t}})}getEvents(){return d(this,null,function*(){yield this.fetchCollection("events").then(()=>{(0,y.default)()})})}getCommunications(){return d(this,null,function*(){return this.fetchCollection("communications")})}getStaff(){return d(this,null,function*(){return this.fetchCollection("staff")})}formatDate(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}formatDateTime(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:!0})}parseMarkdown(e){return e?e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}renderEvents(e=".collections-section.events"){return d(this,null,function*(){let t=document.querySelector(e);if(!t)return;let n=t.querySelector(".collections-layout.events");n&&(n.innerHTML='<div class="loading">Loading events...</div>');try{let a=yield this.getEvents();if(!a||a.length===0){n.innerHTML='<div class="no-data">No events available</div>';return}a.sort((i,v)=>new Date(i.date)-new Date(v.date));let s=a[0],m=`
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
            `,l=`
                <div class="event-list">
                    ${a.map((i,v)=>`
                <div class="event-item ${v===0?"active":""}" 
                     data-event-index="${v}" 
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
            `;n.innerHTML=m+l+o}catch(a){n.innerHTML=`<div class="error">Error loading events: ${a.message}</div>`}})}renderCalendarView(e=".collections-section.calendar_view"){return d(this,null,function*(){let t=document.querySelector(e);if(t)try{let n=yield this.getEvents();if(!n||n.length===0){let o=t.querySelector(".events-data");o&&(o.innerHTML='<div class="no-data">No events available</div>');let i=t.querySelector(".event-cards-container");i&&(i.innerHTML='<div class="no-data">No events available</div>');return}n.sort((o,i)=>new Date(o.date)-new Date(i.date)),window.calendarEventsData=n;let a=n.map(o=>`
                <div class="event-data-item" 
                     data-title="${o.title}"
                     data-date="${o.date}"
                     data-location="${o.location||""}"
                     data-details="${this.escapeHtml(o.details||"")}">
                </div>
            `).join(""),s=t.querySelector(".events-data");s&&(s.innerHTML=a);let m=n.map((o,i)=>{let v=new Date(o.date),f=v.getDate(),w=v.toLocaleDateString("en-US",{month:"short"}),L=v.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0});return`
                    <div class="event-card ${i>=6?"hidden-event":""}" data-event-date="${o.date}">
                        <div class="event-card-date-badge" data-date="${o.date}">
                            <div class="event-day">${f}</div>
                            <div class="event-month">${w}</div>
                        </div>
                        <div class="event-card-content">
                            <h4 class="event-card-title">${o.title}</h4>
                            <p class="event-card-time">${L}</p>
                            <p class="event-card-location">${o.location||"Location TBD"}</p>
                            ${o.details?`<p class="event-card-details">${o.details.substring(0,100)}${o.details.length>100?"...":""}</p>`:""}
                        </div>
                    </div>
                `}).join(""),r=n.length>6?`
                <button class="event-show-more">Show More Events</button>
            `:"",l=t.querySelector(".event-cards-container");l&&(l.innerHTML=m+r),window.dispatchEvent(new CustomEvent("calendarDataLoaded",{detail:{events:n}}))}catch(n){console.error("Error loading calendar events:",n);let a=t.querySelector(".events-data");a&&(a.innerHTML=`<div class="error">Error loading events: ${n.message}</div>`);let s=t.querySelector(".event-cards-container");s&&(s.innerHTML=`<div class="error">Error loading events: ${n.message}</div>`)}})}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}renderCommunications(e=".collections-section.communications"){return d(this,null,function*(){let t=document.querySelector(e);if(!t)return;let n=t.querySelector(".communication-list");n&&(n.innerHTML='<div class="loading">Loading communications...</div>');try{let a=yield this.getCommunications();if(!a||a.length===0){n.innerHTML='<div class="no-data">No communications available</div>';return}a.sort((o,i)=>new Date(i.created_at)-new Date(o.created_at));let s=a.map((o,i)=>`
                <div class="communication-item ${i>=3?"hidden-comm":""}" data-comm-index="${i}">
                    <div class="communication-header">
                        <button class="communication-button">Click to view info</button>
                        <h4 class="communication-subject">${o.subject}</h4>
                        <p class="communication-date">${this.formatDate(o.created_at)}</p>
                    </div>
                    <div class="communication-modal-data" style="display: none;">
                        <div class="communication-modal-subject">${o.subject}</div>
                        <div class="communication-modal-date">${this.formatDate(o.created_at)}</div>
                        <div class="communication-modal-body">${this.parseMarkdown(o.content||"")}</div>
                    </div>
                </div>
            `).join(""),m=a.length>3?`
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
            `,l=t.querySelector(".collections-layout");l&&(l.innerHTML=`
                    <div class="communication-list">${s}</div>
                    ${m}
                    ${r}
                `)}catch(a){n.innerHTML=`<div class="error">Error loading communications: ${a.message}</div>`}})}initializeAll(){return d(this,null,function*(){let e=document.querySelectorAll(".collections-section.events"),t=document.querySelectorAll(".collections-section.calendar_view"),n=document.querySelectorAll(".collections-section.communications"),a=[];e.forEach(s=>{a.push(this.renderEvents(".collections-section.events"))}),t.forEach(s=>{a.push(this.renderCalendarView(".collections-section.calendar_view"))}),n.forEach(s=>{a.push(this.renderCommunications(".collections-section.communications"))}),yield Promise.all(a)})}};window.CollectionsAPI=u;document.addEventListener("DOMContentLoaded",()=>{let c="/api/database";new u(c).initializeAll()});})();
