// iDraftU: small enhancements, no heavy frameworks
(function(){
  // Prefetch director module when idle for snappier navigation on mobile
  if('requestIdleCallback' in window){
    requestIdleCallback(()=>{
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = './director/index.html';
      document.head.appendChild(link);
    });
  }
})();