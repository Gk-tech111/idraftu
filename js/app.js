(function(){
  if('requestIdleCallback' in window){
    requestIdleCallback(()=>{
      ['private/index.html'].forEach(h=>{const l=document.createElement('link');l.rel='prefetch';l.href=h;document.head.appendChild(l)});
    });
  }
})();