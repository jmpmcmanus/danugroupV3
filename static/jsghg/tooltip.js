function CustomTooltip(tooltipId, width){
   var tooltipId = tooltipId;
   $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");

   if(width){
       $("#"+tooltipId).css("width", width);
   }
   hideTooltip();
   function showTooltip(content, event){
       $("#"+tooltipId).html(content);
       $("#"+tooltipId).show();
       updatePosition(event);
   }
   function hideTooltip(){
       $("#"+tooltipId).hide();
   }
   function updatePosition(event){
       var ttid = "#"+tooltipId;
       var xOffset = 0;
       var yOffset = 0;

       var ttw = $(ttid).width();
       var tth = $(ttid).height();
       var wscrY = $(window).scrollTop();
       var wscrX = $(window).scrollLeft();
       var curX = (document.all) ? event.clientX + wscrX : event.pageX;
       var curY = (document.all) ? event.clientY + wscrY : event.pageY;

       var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
       if (ttleft < wscrX + xOffset){
	  ttleft = wscrX + xOffset;
       } 
       var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
       if (tttop < wscrY + yOffset){
	 tttop = curY + yOffset;
       } 
       $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
   }
   return {
       showTooltip: showTooltip,
       hideTooltip: hideTooltip,
       updatePosition: updatePosition
   }
}

function addCommas(nFlt) {
    nStr = d3.round(nFlt, 2); 
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
	x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
