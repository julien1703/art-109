document.addEventListener('DOMContentLoaded',()=>{
  const yearEl=document.getElementById('year');
  if(yearEl) yearEl.textContent=new Date().getFullYear();
});

(function initMobileDropdown(){
  const toggle=document.getElementById("nav-toggle");
  const dropdown=document.getElementById("mobile-dropdown");
  const header=document.getElementById("nav-header");
  if(!toggle||!dropdown||!header) return;

  let outsideHandler=null, escHandler=null;

  function open(){
    toggle.setAttribute("aria-expanded","true");
    dropdown.classList.add("open");
    outsideHandler=(e)=>{ if(!e.target.closest('#nav-header')) close(); };
    document.addEventListener('click',outsideHandler);
    escHandler=(e)=>{ if(e.key==='Escape') close(); };
    document.addEventListener('keydown',escHandler);
  }

  function close(){
    toggle.setAttribute("aria-expanded","false");
    dropdown.classList.remove("open");
    if(outsideHandler){document.removeEventListener('click',outsideHandler);outsideHandler=null;}
    if(escHandler){document.removeEventListener('keydown',escHandler);escHandler=null;}
  }

  toggle.addEventListener('click',(e)=>{
    e.stopPropagation();
    const isOpen=toggle.getAttribute('aria-expanded')==='true';
    isOpen?close():open();
  });

  dropdown.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>close()));

  const mq=window.matchMedia('(min-width: 992px)');
  mq.addEventListener('change',e=>{ if(e.matches) close(); });
})();

document.querySelectorAll(".carousel").forEach((carousel)=>{
  const images=carousel.querySelectorAll("img");
  const dots=carousel.querySelectorAll(".dot");
  let currentIndex=0;
  const baseLabel=carousel.getAttribute("aria-label")||"Gallery";
  const showImage=(index)=>{
    images.forEach((img,i)=>img.classList.toggle("active",i===index));
    dots.forEach((dot,i)=>dot.classList.toggle("active",i===index));
    carousel.setAttribute("aria-label",`${baseLabel} – slide ${index+1} of ${images.length}`);
  };
  const prevBtn=carousel.querySelector(".prev");
  const nextBtn=carousel.querySelector(".next");
  prevBtn?.addEventListener("click",()=>{ currentIndex=(currentIndex-1+images.length)%images.length; showImage(currentIndex); });
  nextBtn?.addEventListener("click",()=>{ currentIndex=(currentIndex+1)%images.length; showImage(currentIndex); });
  dots.forEach((dot,index)=>dot.addEventListener("click",()=>{ currentIndex=index; showImage(currentIndex); }));
  carousel.addEventListener("keydown",(e)=>{ if(e.key==="ArrowLeft") prevBtn?.click(); if(e.key==="ArrowRight") nextBtn?.click(); });
  showImage(0);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor)=>{
  anchor.addEventListener("click",function(e){
    const targetId=this.getAttribute("href");
    if(!targetId||targetId==="#") return;
    const target=document.querySelector(targetId);
    if(!target) return;
    e.preventDefault();
    const headerOffset=80;
    const elementPosition=target.getBoundingClientRect().top;
    const offsetPosition=elementPosition+window.pageYOffset-headerOffset;
    window.scrollTo({top:offsetPosition,behavior:"smooth"});
  });
});

const sections=document.querySelectorAll("section[id]");
const navLinks=document.querySelectorAll('.nav-desktop a[href^="#"], #mobile-dropdown a[href^="#"]');

function updateActiveNav(){
  let current="";
  sections.forEach((section)=>{ if(window.pageYOffset>=section.offsetTop-150) current=section.getAttribute("id"); });
  navLinks.forEach((link)=>{ link.classList.toggle("active",link.getAttribute("href")==='#'+current); });
}

let ticking=false;
window.addEventListener("scroll",()=>{
  if(!ticking){
    window.requestAnimationFrame(()=>{ updateActiveNav(); ticking=false; });
    ticking=true;
  }
});
updateActiveNav();
