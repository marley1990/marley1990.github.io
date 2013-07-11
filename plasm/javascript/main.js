var p;
function hiddenBody() {
  document.getElementById("linx").style.overflow = 'hidden';

}

function clearBody() {
  document.getElementById("linx").style.overflow = 'auto';

}
function init(){
    $(function () {
      console.log('Starting PLaSM final-project...');
      p = new Plasm('plasm', 'plasm-inspector');
      fun.PLASM(p);
    });



    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-30496335-1']);
    _gaq.push(['_trackPageview']);

    (function() {
      var ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.async = true;
      ga.src = 'http://www.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(ga, s);
    })();
}


function closeVision(){
   var message = 'Are you sure that you want close this vision?'

  var choice = confirm(message)

  if (choice == true) {
  var plasm = document.getElementById("plasm")
  if(plasm != null)
    var cont = document.getElementById("container");
    console.log('Closing PLaSM for final-project...');
    cont.removeChild(plasm)
    p = null;

}
}
