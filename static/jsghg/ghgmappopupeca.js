// ghg map popup 
$( document ).on( "pagecreate", function() {
    // The window width and height are decreased by 30 to take the tolerance of 15 pixels at each side into account
    function scale( width, height, padding, border ) {
        var scrWidth = $( window ).width() - 30,
            scrHeight = $( window ).height() - 30,
            ifrPadding = 2 * padding,
            ifrBorder = 2 * border,
            ifrWidth = width + ifrPadding + ifrBorder,
            ifrHeight = height + ifrPadding + ifrBorder,
            h, w;
        if ( ifrWidth < scrWidth && ifrHeight < scrHeight ) {
            w = ifrWidth;
            h = ifrHeight;
        } else if ( ( ifrWidth / scrWidth ) > ( ifrHeight / scrHeight ) ) {
            w = scrWidth;
            h = ( scrWidth / ifrWidth ) * ifrHeight;
        } else {
            h = scrHeight;
            w = ( scrHeight / ifrHeight ) * ifrWidth;
        }
        return {
            'width': w - ( ifrPadding + ifrBorder ),
            'height': h - ( ifrPadding + ifrBorder )
        };
    };
    $( ".ui-popup iframe" )
        .attr( "width", 0 )
        .attr( "height", "auto" );
    $( "#ghgmappopupeca iframe" ).contents().find( "#ghgmap" )
        .css( { "width" : 0, "height" : 0 } );
    $( "#ghgmappopupeca" ).on({
        popupbeforeposition: function() {
            var size = scale( 750, 450, 0, 1 ),
                w = size.width,
                h = size.height;
            $( "#ghgmappopupeca iframe" )
                .attr( "width", w )
                .attr( "height", h );
            $( "#ghgmappopupeca iframe" ).contents().find( "#ghgmap" )
                .css( { "width": w, "height" : h } );
        },
        popupafterclose: function() {
            $( "#ghgmappopupeca iframe" )
                .attr( "width", 0 )
                .attr( "height", 0 );
            $( "#ghgmappopupeca iframe" ).contents().find( "#ghgmap" )
                .css( { "width": 0, "height" : 0 } );
        }
    });
});
