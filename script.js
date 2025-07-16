const preconnectLinks=['https://fonts.googleapis.com','https://fonts.gstatic.com','https://cdnjs.cloudflare.com'];function addPreconnects(){preconnectLinks.forEach(url=>{const link=document.createElement('link');link.rel='preconnect';link.href=url;if(url.includes('gstatic'))link.crossOrigin='anonymous';document.head.appendChild(link)})}
if('requestIdleCallback' in window){requestIdleCallback(addPreconnects)}else{setTimeout(addPreconnects,0)}
if(document.readyState==='loading'){document.addEventListener("DOMContentLoaded",initializePortfolio)}else{initializePortfolio()}
const passiveIfSupported=supportsPassive()?{passive:!0}:!1;function supportsPassive(){let supportsPassive=!1;try{const opts=Object.defineProperty({},'passive',{get:function(){supportsPassive=!0}});window.addEventListener("testPassive",null,opts);window.removeEventListener("testPassive",null,opts)}catch(e){}
return supportsPassive}
function initializePortfolio(){const fragment=document.createDocumentFragment();try{handleLoading();setupNavigation();setupScrollEffects();setupAnimations();setupContactForm();setupBackToTop();setupThemeHandling();const resumeModal=document.getElementById("resume-modal");if(resumeModal){try{setupResumeModal()}catch(error){console.warn('Resume modal setup failed:',error)}}
const typewriterElement=document.querySelector(".typewriter-text");if(typewriterElement){const shouldRunTypewriter=optimizeForMobile();if(shouldRunTypewriter!==!1){requestAnimationFrame(()=>{setTimeout(initTypewriter,isMobileDevice()?1000:500)})}}}catch(error){console.warn('Portfolio initialization error:',error)}}
function handleLoading(){const loader=document.getElementById("loader");window.addEventListener("load",function(){setTimeout(function(){if(loader)loader.classList.add("hidden");setupPageSpecificAnimations()},1200)})}
function setupNavigation(){const mobileMenu=document.getElementById("mobile-menu");const navLinks=document.getElementById("nav-links");const header=document.getElementById("header");if(!mobileMenu||!navLinks||!header)return;mobileMenu.addEventListener("click",function(){toggleMobileMenu(mobileMenu,navLinks)});const navLinkItems=navLinks.querySelectorAll("a");navLinkItems.forEach((link)=>{link.addEventListener("click",function(){closeMobileMenu(mobileMenu,navLinks)})});document.addEventListener("click",function(event){const isClickInsideNav=mobileMenu.contains(event.target)||navLinks.contains(event.target);if(!isClickInsideNav&&navLinks.classList.contains("active")){closeMobileMenu(mobileMenu,navLinks)}});setupSmoothScrolling()}
function toggleMobileMenu(menuButton,navLinks){menuButton.classList.toggle("active");navLinks.classList.toggle("active");const expanded=menuButton.getAttribute("aria-expanded")==="true"||!1;menuButton.setAttribute("aria-expanded",!expanded);document.body.style.overflow=navLinks.classList.contains("active")?"hidden":""}
function closeMobileMenu(menuButton,navLinks){menuButton.classList.remove("active");navLinks.classList.remove("active");menuButton.setAttribute("aria-expanded","false");document.body.style.overflow=""}
function setupSmoothScrolling(){document.querySelectorAll('a[href^="#"]').forEach((anchor)=>{anchor.addEventListener("click",function(e){e.preventDefault();const target=document.querySelector(this.getAttribute("href"));if(target){const headerOffset=80;const elementPosition=target.getBoundingClientRect().top;const offsetPosition=elementPosition+window.pageYOffset-headerOffset;window.scrollTo({top:offsetPosition,behavior:"smooth",})}})})}
function setupScrollEffects(){const header=document.getElementById("header");const sections=document.querySelectorAll(".section");const navLinks=document.querySelectorAll(".nav-links a");if(!header)return;let ticking=!1;let lastScrollY=0;const scrollHandler=function(){const currentScrollY=window.scrollY;if(Math.abs(currentScrollY-lastScrollY)<3)return;if(!ticking){requestAnimationFrame(function(){handleHeaderScroll(header);handleActiveNavigation(sections,navLinks);lastScrollY=currentScrollY;ticking=!1});ticking=!0}};if(supportsPassive()){window.addEventListener("scroll",scrollHandler,{passive:!0})}else{window.addEventListener("scroll",scrollHandler)}}
function handleHeaderScroll(header){if(window.scrollY>50){header.classList.add("scrolled")}else{header.classList.remove("scrolled")}}
function handleActiveNavigation(sections,navLinks){if(!sections||!navLinks)return;const scrollPos=window.scrollY+100;sections.forEach((section,index)=>{const top=section.offsetTop;const bottom=top+section.offsetHeight;if(scrollPos>=top&&scrollPos<=bottom){navLinks.forEach((link)=>link.classList.remove("active"));if(navLinks[index]){navLinks[index].classList.add("active")}}})}
function setupAnimations(){const observerOptions={threshold:0.1,rootMargin:"0px 0px -50px 0px",};const observer=new IntersectionObserver(function(entries){entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add("animate-in");if(entry.target.classList.contains("stagger-animation")){staggerChildAnimations(entry.target)}}})},observerOptions);const animatedElements=document.querySelectorAll(".project-card, .service-card, .skill-category",);animatedElements.forEach((el)=>{el.classList.add("animate-on-scroll");observer.observe(el)});optimizeImages()}
function optimizeImages(){const images=document.querySelectorAll('img');const isMobile=isMobileDevice();const imageObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){const img=entry.target;if(img.dataset.src){img.src=img.dataset.src;img.removeAttribute('data-src')}
img.style.opacity='1';observer.unobserve(img)}})},{rootMargin:isMobile?'50px 0px':'100px 0px',threshold:0.01});images.forEach(img=>{if(!img.hasAttribute('loading')){img.loading=isMobile?'lazy':'lazy'}
img.decoding='async';img.style.opacity='1';img.style.transition='opacity 0.3s ease';if(img.closest('.hero')){img.fetchPriority='high';img.loading='eager';if(isMobile&&img.src.includes('images/')){img.style.maxHeight='300px';img.style.objectFit='cover'}}
if(!isMobile&&'loading' in HTMLImageElement.prototype&&img.src.includes('.png')){const canvas=document.createElement('canvas');const webpSupport=canvas.toDataURL('image/webp').indexOf('webp')>-1;if(webpSupport&&!img.src.includes('webp')){console.log('WebP supported but not implemented for:',img.src)}}
img.onerror=function(){if(!isMobile){console.warn('Failed to load image:',this.src)}
this.style.backgroundColor='#1a1a2e';this.style.minHeight=isMobile?'150px':'200px'};if(img.src){img.dataset.originalSrc=img.src}
if(!img.closest('.hero')&&img.dataset.src){imageObserver.observe(img)}})}
function triggerEntranceAnimations(){const heroContent=document.querySelector(".hero-content");if(heroContent){heroContent.classList.add("animate-in")}}
function setupPageSpecificAnimations(){if(document.querySelector(".hero-content")){triggerEntranceAnimations()}}
function staggerChildAnimations(parent){const children=parent.children;Array.from(children).forEach((child,index)=>{setTimeout(()=>{child.classList.add("animate-in")},index*100)})}
function setupContactForm(){const form=document.getElementById("contact-form");if(!form)return;const submitButton=form.querySelector('button[type="submit"]');if(!submitButton)return;setupEmailDomainValidation();form.addEventListener("submit",function(e){e.preventDefault();handleFormSubmission(form,submitButton)});setupFormValidation(form)}
function setupEmailDomainValidation(){const allowedDomains=["gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com","icloud.com",];const emailInput=document.getElementById("email")||document.getElementById("index-email");const warning=document.getElementById("email-warning")||document.getElementById("index-email-warning");const form=document.getElementById("contact-form");if(!emailInput||!warning||!form)return;emailInput.addEventListener("input",function(){const email=emailInput.value;const domain=email.substring(email.lastIndexOf("@")+1);if(email&&!allowedDomains.includes(domain)){warning.style.display="block";emailInput.setCustomValidity("Invalid email domain.")}else{warning.style.display="none";emailInput.setCustomValidity("")}});form.addEventListener("submit",function(e){const email=emailInput.value;const domain=email.substring(email.lastIndexOf("@")+1);if(email&&!allowedDomains.includes(domain)){e.preventDefault();warning.style.display="block";showNotification("Submission blocked: Only trusted email domains allowed.","error",);return!1}})}
function handleFormSubmission(form,submitButton){const originalText=submitButton.innerHTML;const formData=new FormData(form);if(!validateForm(form)){showNotification("Please fill in all required fields correctly.","error",);return}
submitButton.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';submitButton.disabled=!0;fetch(form.action,{method:"POST",body:formData,headers:{Accept:"application/json",},}).then((response)=>{if(response.ok){showNotification("Message sent successfully! I'll get back to you soon.","success",);form.reset()}else{throw new Error("Network response was not ok")}}).catch((error)=>{console.error("Error:",error);showNotification("There was a problem sending your message. Please try again later.","error",)}).finally(()=>{submitButton.innerHTML=originalText;submitButton.disabled=!1})}
function setupFormValidation(form){const inputs=form.querySelectorAll("input, textarea");inputs.forEach((input)=>{input.addEventListener("blur",function(){validateField(this)});input.addEventListener("input",function(){clearFieldError(this)})})}
function validateForm(form){const inputs=form.querySelectorAll("input[required], textarea[required]");let isValid=!0;inputs.forEach((input)=>{if(!validateField(input)){isValid=!1}});return isValid}
function validateField(field){const value=field.value.trim();const fieldType=field.type;let isValid=!0;let errorMessage="";if(field.hasAttribute("required")&&!value){isValid=!1;errorMessage="This field is required."}
if(fieldType==="email"&&value){const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!emailRegex.test(value)){isValid=!1;errorMessage="Please enter a valid email address."}}
if(field.name==="name"&&value){const nameRegex=/^[a-zA-Z\s]+$/;if(!nameRegex.test(value)){isValid=!1;errorMessage="Name should only contain letters and spaces."}}
if(!isValid){showFieldError(field,errorMessage)}else{clearFieldError(field)}
return isValid}
function showFieldError(field,message){clearFieldError(field);field.classList.add("error");const errorElement=document.createElement("span");errorElement.className="field-error";errorElement.textContent=message;field.parentNode.appendChild(errorElement)}
function clearFieldError(field){field.classList.remove("error");const existingError=field.parentNode.querySelector(".field-error");if(existingError){existingError.remove()}}
function showNotification(message,type="info"){const notification=document.createElement("div");notification.className=`notification notification-${type}`;notification.innerHTML=`
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;document.body.appendChild(notification);setTimeout(()=>notification.classList.add("show"),100);setTimeout(()=>hideNotification(notification),5000);notification.querySelector(".notification-close").addEventListener("click",()=>{hideNotification(notification)})}
function hideNotification(notification){notification.classList.add("hide");setTimeout(()=>{if(notification.parentNode){notification.parentNode.removeChild(notification)}},300)}
function getNotificationIcon(type){const icons={success:"check-circle",error:"exclamation-circle",warning:"exclamation-triangle",info:"info-circle",};return icons[type]||icons.info}
function setupBackToTop(){const backToTopButton=document.getElementById("back-to-top");if(!backToTopButton)return;const throttledScrollHandler=throttle(function(){if(window.scrollY>300){backToTopButton.classList.add("visible")}else{backToTopButton.classList.remove("visible")}},16);window.addEventListener("scroll",throttledScrollHandler);backToTopButton.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth",})})}
function setupThemeHandling(){const savedTheme=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",savedTheme);window.toggleTheme=function(){const currentTheme=document.documentElement.getAttribute("data-theme");const newTheme=currentTheme==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",newTheme);localStorage.setItem("theme",newTheme)};optimizeFontLoading()}
function optimizeFontLoading(){const style=document.createElement('style');const mobileOptimizations=isMobileDevice()?`
        /* Mobile-specific optimizations */
        .floating-element {
            will-change: auto !important;
            animation: none !important;
        }
        .project-card, .service-card {
            will-change: auto;
        }
        /* Simplify animations on mobile */
        @media (max-width: 768px) {
            * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            .hero-background {
                display: none;
            }
        }
    `:`
        /* Hardware acceleration for animations on desktop */
        .floating-element, .project-card, .service-card {
            will-change: transform;
            transform: translateZ(0);
        }
    `;style.textContent=`
        @font-face {
            font-family: 'FontAwesome';
            font-display: swap;
        }
        .fa-solid-900, .fa-brands-400 {
            font-display: swap;
        }
        /* Critical CSS for font loading */
        .hero-content h1, .section-title {
            font-display: swap;
        }
        /* Reduce layout shift */
        img {
            width: auto;
            height: auto;
            max-width: 100%;
        }
        ${mobileOptimizations}
    `;document.head.insertBefore(style,document.head.firstChild);if(!isMobileDevice()||navigator.connection?.effectiveType==='4g'){const fontPreloads=['https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'];fontPreloads.forEach(fontUrl=>{const link=document.createElement('link');link.rel='preload';link.as='font';link.type='font/woff2';link.crossOrigin='anonymous';link.href=fontUrl;document.head.appendChild(link)})}}
function debounce(func,wait){let timeout;return function executedFunction(...args){const later=()=>{clearTimeout(timeout);func(...args)};clearTimeout(timeout);timeout=setTimeout(later,wait)}}
function throttle(func,limit){let inThrottle;return function(){const args=arguments;const context=this;if(!inThrottle){func.apply(context,args);inThrottle=!0;setTimeout(()=>(inThrottle=!1),limit)}}}
let scrollTimeout;let lastScrollY=0;const optimizedScrollHandler=function(){if(scrollTimeout)return;const currentScrollY=window.scrollY;if(Math.abs(currentScrollY-lastScrollY)<5)return;scrollTimeout=requestAnimationFrame(function(){lastScrollY=currentScrollY;scrollTimeout=null})};if(supportsPassive()){window.addEventListener("scroll",optimizedScrollHandler,{passive:!0})}else{window.addEventListener("scroll",optimizedScrollHandler)}
window.addEventListener("error",function(e){console.error("JavaScript error:",e.error)});function enhanceAccessibility(){const skipLink=document.createElement("a");skipLink.href="#main-content";skipLink.className="skip-link";skipLink.textContent="Skip to main content";document.body.insertBefore(skipLink,document.body.firstChild);document.addEventListener("keydown",function(e){if(e.key==="Escape"){const mobileMenu=document.getElementById("mobile-menu");const navLinks=document.getElementById("nav-links");if(navLinks&&navLinks.classList.contains("active")){closeMobileMenu(mobileMenu,navLinks)}}})}
document.addEventListener("DOMContentLoaded",enhanceAccessibility);function optimizeNetworkRequests(){const scripts=document.querySelectorAll('script[src*="googletagmanager"]');scripts.forEach(script=>{if(script.src.includes('gtag')){script.async=!0;script.defer=!0}})}
function initializePerformanceOptimizations(){preventForcedReflows();optimizeNetworkRequests();enableResourceHints();optimizeThirdPartyScripts();setupPerformanceMonitoring()}
function enableResourceHints(){const hints=[{rel:'dns-prefetch',href:'https://www.googletagmanager.com'},{rel:'preconnect',href:'https://fonts.googleapis.com'},{rel:'preconnect',href:'https://fonts.gstatic.com',crossOrigin:'anonymous'}];hints.forEach(hint=>{const link=document.createElement('link');link.rel=hint.rel;link.href=hint.href;if(hint.crossOrigin)link.crossOrigin=hint.crossOrigin;document.head.appendChild(link)})}
function optimizeThirdPartyScripts(){const scripts=document.querySelectorAll('script[src]');scripts.forEach(script=>{if(script.src.includes('googletagmanager')||script.src.includes('gtag')){script.async=!0;script.defer=!0;script.setAttribute('importance','low')}})}
function setupPerformanceMonitoring(){if('web-vital' in window||typeof webVitals!=='undefined'){return}
window.addEventListener('load',()=>{if(performance.timing){const loadTime=performance.timing.loadEventEnd-performance.timing.navigationStart;console.log(`Page load time: ${loadTime}ms`)}})}
if(document.readyState==='loading'){document.addEventListener("DOMContentLoaded",initializePerformanceOptimizations)}else{initializePerformanceOptimizations()}
function setupResumeModal(){const resumeModal=document.getElementById("resume-modal");const closeResumeButton=document.getElementById("close-resume");if(!resumeModal){return}
if(!closeResumeButton){return}
try{closeResumeButton.addEventListener("click",function(){closeResumeModal()});resumeModal.addEventListener("click",function(e){if(e.target===resumeModal){closeResumeModal()}});document.addEventListener("keydown",function(e){if(e.key==="Escape"&&resumeModal.classList&&resumeModal.classList.contains("active")){closeResumeModal()}})}catch(error){return}}
window.setupResumeModal=setupResumeModal;function isMobileDevice(){return window.innerWidth<=768||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
function optimizeForMobile(){if(!isMobileDevice())return;const floatingElements=document.querySelectorAll('.floating-element');floatingElements.forEach(el=>{if(el){el.style.animation='none';el.style.transform='translateZ(0)'}});const typewriterElement=document.querySelector(".typewriter-text");if(typewriterElement&&window.innerWidth<=480){typewriterElement.textContent="Freelance Data Analyst";return!1}
setTimeout(()=>{const cards=document.querySelectorAll('.project-card, .service-card');cards.forEach(card=>{if(card){card.style.willChange='auto'}})},2000);return!0}
function preventForcedReflows(){const elementCache=new Map();const performanceMetrics={scrollEvents:0,cacheHits:0,cacheMisses:0};const originalGetBoundingClientRect=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){const cacheKey=this.tagName+(this.id||'')+(this.className||'');if(elementCache.has(cacheKey)){performanceMetrics.cacheHits++;return elementCache.get(cacheKey)}
performanceMetrics.cacheMisses++;const rect=originalGetBoundingClientRect.call(this);if(rect.width>0&&rect.height>0){elementCache.set(cacheKey,rect)}
return rect};let cacheCleanupTimer;function scheduleCacheCleanup(){clearTimeout(cacheCleanupTimer);cacheCleanupTimer=setTimeout(()=>{elementCache.clear();if(window.location.hostname==='localhost'||window.location.hostname.includes('replit')){console.log('Performance metrics:',performanceMetrics)}},3000)}
window.addEventListener('resize',scheduleCacheCleanup,{passive:!0});window.addEventListener('scroll',scheduleCacheCleanup,{passive:!0});scheduleCacheCleanup()}
function openResumeModal(){const resumeModal=document.getElementById("resume-modal");if(resumeModal){resumeModal.classList.add("active");document.body.style.overflow="hidden"}}
function closeResumeModal(){const resumeModal=document.getElementById("resume-modal");if(resumeModal){resumeModal.classList.remove("active");document.body.style.overflow=""}}
if(typeof module!=="undefined"&&module.exports){module.exports={validateField,validateForm,showNotification,debounce,throttle,}}
const phrases=["Freelance Data Analyst","Power BI Developer","Excel Dashboard Specialist","Data Cleaning Expert","Python + AI Analyst",];let currentPhrase=0;let currentChar=0;let isDeleting=!1;const typeSpeed=100;const eraseSpeed=50;const delayBetween=1500;function initTypewriter(){const el=document.querySelector(".typewriter-text");if(!el){return}
function type(){const phrase=phrases[currentPhrase];if(!isDeleting){el.textContent=phrase.slice(0,currentChar+1);currentChar++;if(currentChar===phrase.length){isDeleting=!0;setTimeout(type,delayBetween)}else{setTimeout(type,typeSpeed)}}else{el.textContent=phrase.slice(0,currentChar);currentChar--;if(currentChar===0){isDeleting=!1;currentPhrase=(currentPhrase+1)%phrases.length;setTimeout(type,typeSpeed)}else{setTimeout(type,eraseSpeed)}}}
type()}
