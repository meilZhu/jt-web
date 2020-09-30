

// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 

/// <summary>
/// Base resizer functionality
/// </summary>
(function () {
    "use strict";

    var startingHeight = 0;

    /// <summary>
    /// Sets the initial starting height
    /// </summary>
    function Resizer(width, height) {

        startingHeight = height;
    }

    /// <summary>
    /// Sets viewer to specified size and persists it in the document level viewer context (if applicable)
    /// </summary>
    var setSize  = function (width, height) {
        if (width > 0 && height > 0) {
            var component = document.getElementById('component');
            component.style.width = width.toString() + "px";
            component.style.height = height.toString() + "px";
            JT2GoOfficeApp.ObjectFactory.getViewerWrapper().resize(width, height);
            var ctxt = JT2GoOfficeApp.ObjectFactory.getDataHandler().getDocContext();
            if (ctxt) {
                ctxt.width = width;
                ctxt.height = height;
            }
            if (JT2GoOfficeApp.ObjectFactory.getDataHandler().persistDocContext) {
                JT2GoOfficeApp.ObjectFactory.getDataHandler().persistDocContext(ctxt);
            }
        }
    };

    /// <summary>
    /// Force a resize.  If new sizes are passed in will set to them, if not will set the viewer to the maximum size that will fit in its container.
    /// </summary>
    var resize = function (newWidth, newHeight) {

        //Forced size, just go with it.
        if (newWidth && newHeight) {
            setSize(newWidth, newHeight);
        } else {
            var viewerHostElement = document.getElementById('viewerHost');

            if (viewerHostElement !== undefined) {

                if(!viewerHostElement) return;
                //Content area, can resize all 4 directions, let user figure it out.
                newHeight = viewerHostElement.clientHeight;

                //Subtract the height of the title area.
                var headerHeight = document.getElementById('headerArea').offsetHeight;
                var titleHeight = document.getElementById('viewerTitle').offsetHeight;
                var labelHeight = document.getElementById('viewerLabel').offsetHeight;
                newHeight -= (titleHeight + labelHeight + headerHeight);
                var heightChange = parseInt(newHeight) - startingHeight;
                newHeight = startingHeight + heightChange;

                setSize(parseInt(viewerHostElement.clientWidth), parseInt(newHeight));

            }
        }
    };

    /// <summary>
    /// Initialize the viewer size.
    /// </summary>
    Resizer.prototype.init = function () {

        //we want to the viewer to take all space available to it in this mode, throw away the initial sizes.
        resize();
    };

    /// <summary>
    /// Sets viewer to specified size and persists it in the document level viewer context (if applicable)
    /// </summary>
    Resizer.prototype.setSize = setSize;

    /// <summary>
    /// Force a resize.  If new sizes are passed in will set to them, if not will set the viewer to the maximum size that will fit in its container.
    /// </summary>
    Resizer.prototype.resize = resize;

    JT2GoOfficeApp.Resizer = Resizer;
})();