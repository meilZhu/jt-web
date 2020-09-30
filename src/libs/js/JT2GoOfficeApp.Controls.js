import * as $ from './jquery-2.1.4.min.js';

(function () {
    "use strict";

    /// <summary>
    /// Future home of localization handling for strings in the Office add-in.  Currently just returning the string that is passed to it.
    /// </summary>
    function Localization() {
        //Do some overloading trick here so only the json data representing the strings for the locale at startup is loaded.
    }

    Localization.prototype.getString = function(defString){
        //Use some lookup to return the localized value for the defString.  If none available just return the default
        return defString;
    }

    JT2GoOfficeApp.Localization = Localization;


})();

// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 


(function () {
    "use strict";



    function Controls() {

    }

    /// <summary>
    // commandbar wrapper for viewer command bar.
    /// </summary>
    var commandBar = {
        initialize: function () {
            return undefined;
        },

        /// <summary>
        // enable commandbar item
        /// </summary>
        enableItem: function (itemID, enable) {

            var menuElement = document.getElementById(itemID);

            if (menuElement) {
                if (enable) {
                    menuElement.classList.remove('siemens-is-disabled');
                } else {
                    menuElement.classList.add('siemens-is-disabled');
                }
            }


            var overflowElement = document.getElementById('commandBarNavOverflow');
            if (overflowElement) {
                var menuItems = overflowElement.getElementsByClassName('ms-ContextualMenu-link');
                var i;
                var el;
                var id;
                for (i = 0; i < menuItems.length; i += 1) {
                    el = menuItems[i];
                    id = el.getAttribute('proxytargetid');
                    if (id === itemID) {
                        if (enable) {
                            el.classList.remove('siemens-is-disabled');
                        } else {
                            el.classList.add('siemens-is-disabled');
                        }
                        break;
                    }
                }
            }

        },
        /// <summary>
        // change active Pan/Zoom/Rotate
        /// </summary>
        toggleMovementCtrl: function (ctrl) {

            var pan = document.getElementById('pan');
            var zoom = document.getElementById('zoom');
            var rotate = document.getElementById('rotate');

            if (pan) {
                pan.classList.remove("is-selected");
            }
            if (zoom) {
                zoom.classList.remove("is-selected");
            }
            if (rotate) {
                rotate.classList.remove("is-selected");
            }
            if (ctrl) {
                ctrl.classList.add("is-selected");
            }
        }
    };


    //TODO: when Microsoft has the integrated One Drive stuff working for Office Add-in implement the integrated One Drive support.
    /// <summary>
    // settings menu in settings pane Currently unsupported because One Drive interfaces not supported in Office 2013
    /// </summary>
    //var settingsMenu = function () {

    //    var oneDriveUploadToggle = document.getElementById('oneDriveUploadToggle');

    //    var setUploadCtrl = function () {
    //        var value = JT2GoOfficeApp.ObjectFactory.getDataHandler().getData("AutoOneDriveUpload");
    //        if (value !== null && value !== undefined) {
    //            oneDriveUploadToggle.checked = value;
    //        }
    //    };

    //    var oneDriveUpload = false;


    //    if (oneDriveUploadToggle !== undefined) {
    //        oneDriveUploadToggle.onclick = function () {
    //            oneDriveUpload = oneDriveUploadToggle.checked;

    //        };

    //        setUploadCtrl();
    //    }


    //    var settingsSave = document.getElementById('settingsMenuSave');
    //    if (settingsSave !== undefined) {
    //        settingsSave.onclick = function () {
    //            JT2GoOfficeApp.ObjectFactory.getDataHandler().persistData(oneDriveUpload, "AutoOneDriveUpload");
    //        };
    //    }

    //    var settingsCancel = document.getElementById('settingsMenuCancel');
    //    if (settingsCancel !== undefined) {
    //        settingsCancel.onclick = function () {
    //            setUploadCtrl();
    //        };
    //    }

    //    var panelClose = document.getElementById("panelClose");
    //    if (panelClose !== undefined) {
    //        panelClose.onclick = function () {
    //            setUploadCtrl();
    //        };
    //    }

    //};

    /// <summary>
    // show panel pane
    /// </summary>
    var showPanel = function (panelID, panelContentID) {
        var panelElement = document.getElementById(panelID);
        var panelContentPanes = panelElement.getElementsByClassName("ms-Panel-contentInner");

        var i;
        var content;
        for (i = 0; i < panelContentPanes.length; i += 1) {
            content = panelContentPanes[i];
            content.classList.remove("siemens-visible");
            content.classList.add("siemens-hidden");
        }
        if (panelContentID) {
            var panelContentElement = document.getElementById(panelContentID);
            panelContentElement.classList.add('siemens-visible');
        }

        // Display Panel first, to allow animations
        panelElement.classList.add("is-open");

        // Add animation class
        panelElement.classList.add("ms-Panel-animateIn");
    };

    /// <summary>
    // Panel wrapper
    /// </summary>
    Controls.prototype.panel = {
      
        /// <summary>
        // Initalize panel by given ID
        /// </summary>
        initialize: function (panelID) {

            var pfx = ["webkit", "moz", "MS", "o", ""];

            var panelElement = document.getElementById(panelID);
            var panelMain = panelElement.getElementsByClassName("ms-Panel-main");


            // Prefix function
            function prefixedEvent(element, type, callback) {
                var p;
                for (p = 0; p < pfx.length; p += 1) {
                    if (!pfx[p]) { type = type.toLowerCase(); }
                    element.addEventListener(pfx[p] + type, callback, false);
                }
            }


            /** Hook to open the panel. */
            $(".ms-PanelAction-close").on("click", function () {

                // Display Panel first, to allow animations
                panelElement.classList.add("ms-Panel-animateOut");

            });


            prefixedEvent(panelMain[0], 'AnimationEnd', function (event) {
                if (event.animationName.indexOf('Out') > -1) {

                    // Hide and Prevent ms-Panel-main from being interactive
                    panelElement.classList.remove('is-open');

                    // Remove animating classes for the next time we open panel
                    panelElement.classList.remove('ms-Panel-animateIn');
                    panelElement.classList.remove('ms-Panel-animateOut');

                }
            });
        },

        /// <summary>
        // Close Panel with given id
        /// </summary>
        close: function (panelID) {
            var panelElement = document.getElementById(panelID);
            panelElement.classList.add("ms-Panel-animateOut");
        },
        /// <summary>
        // show panel with given ID
        /// </summary>
        show: showPanel,

        /// <summary>
        // add a control to trigger a panel with given ids
        /// </summary>
        addTrigger: function (triggerElementID, panelID, panelContentID) {

            var triggerElement = document.getElementById(triggerElementID);
         
            triggerElement.onclick = function () {
                showPanel(panelID, panelContentID);

            };
        }
    };

    /// <summary>
    // Initialize the MS UI Fabric controls.
    /// </summary>
    Controls.prototype.msInitialize = function () {
        if (this.initialized) {
            return;
        }

        if ($('.ms-FilePicker').length > 0) {
            $('.ms-FilePicker').css({
                "position": "absolute !important"
            });

            $('.ms-Panel').FilePicker();
        }

        if ($.fn.Callout) {
            $('.ms-Callout').Callout();
        }

        if ($.fn.Spinner) {
            $('.ms-Spinner').Spinner();
        }



        if ($.fn.Toggle) {
            $('.ms-Toggle').Toggle();
        }

        if ($.fn.CommandBar) {
            $('.ms-CommandBar').CommandBar();
        }

        if ($.fn.Pivot) {
            $('.ms-Pivot').Pivot();
        }

        if ($.fn.Dialog) {
            $('.ms-Dialog').Dialog();
        }

        if ($.fn.TextField) {
            $('.ms-TextField').TextField();
        }

        // Vanilla JS Components
        if (window.fabric) {

            var element;
            var component;

            if (window.fabric.Spinner) {
                element = document.querySelector('.ms-Spinner');
                component = new window.fabric.Spinner(element);
            }



            if (window.fabric.Toggle) {
                element = document.querySelector('.ms-Toggle');
                component = new window.fabric.Toggle(element);
            }

            if (window.fabric.CommandBar) {
                element = document.querySelector('.ms-CommandBar');
                component = new window.fabric.CommandBar(element);
            }

            if (window.fabric.Pivot) {
                element = document.querySelector('.ms-Pivot');
                component = new window.fabric.Pivot(element);
            }

            if (window.fabric.Callout) {
                element = document.querySelector('.ms-Callout');
                component = new window.fabric.Callout(element);
            }

            if (window.fabric.Dialog) {
                var element = document.querySelector('.ms-Dialog');
                var component = new fabric['Dialog'](element);
            }

            if (window.fabric.TextField) {
                var element = document.querySelector('.ms-TextField');
                var component = new fabric['TextField'](element);
            }
        }

        //settingsMenu();
        this.panel.initialize("slideoutPanel");

        // this.panel.addTrigger("structureButton", "slideoutPanel", "structurePane");


        try{
            if (Office && (Office.context.requirements.isSetSupported('OOXMLCoercion', '1.1') || Office.context.requirements.isSetSupported('ImageCoercion', '1.1'))) {
                this.commandBar.enableItem('screenshotButton', true);
            } else {
                // Excel online doesn't have any image saving support.
                JT2GoOfficeApp.ObjectFactory.getBrowserContainer().showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString("Saving snapshots has been disabled. Saving data as Open XML or image type is not supported"));
                this.commandBar.enableItem('screenshotButton', false);
            }
        }catch(err){};
        this.initialized = true;

    };

    /// <summary>
    // Spinner (busy indicator)
    /// </summary>
    Controls.prototype.spinner = {
        /// <summary>
        // show/hide the spinner
        /// </summary>
        show: function (shouldShow) {
            if (shouldShow) {
                document.getElementById('spinnerContainer').classList.remove('siemens-hidden');
            } else {
                document.getElementById('spinnerContainer').classList.add('siemens-hidden');
            }
        },
        /// <summary>
        // set Spinner text.
        /// </summary>
        text: function (textValue) {
            document.getElementById('spinnerLabel').innerHTML = textValue;
        }
    };

    /// <summary>
    // Set title for viewer.
    /// </summary>
    Controls.prototype.viewerTitle = {
        /// <summary>
        // show or hide viewer title.  if showing use passed text.
        /// </summary>
        show: function (shouldShow, text) {
            if (shouldShow) {
                document.getElementById('viewerTitle').innerHTML = "";
                document.getElementById('viewerTitle').classList.remove('siemens-hidden');
            } else {
                document.getElementById('viewerTitle').classList.add('siemens-hidden');
            }
        }
    };
 

    /// <summary>
    // Viewer label show/hide and set text.  (label below the viewer).
    /// </summary>
    Controls.prototype.showViewerLabel = function (labelText, show) {
        if (labelText && labelText !== "" && show) {
            document.getElementById('viewerLabel').innerHTML = labelText;
            document.getElementById('viewerLabel').classList.remove('siemens-hidden');
        } else {
            document.getElementById('viewerLabel').classList.add('siemens-hidden');
        }
    };

    /// <summary>
    // Disable controls that allow loading of data in the viewer.
    /// </summary>
    Controls.prototype.disableAll = function(){
        this.commandBar.enableItem('filePickerButton', false);
        this.commandBar.enableItem('urlButton', false);
        this.commandBar.enableItem('screenshotButton', false);
    };

    /// <summary>
    // Show user confirmation callout.  call callback on completion of callout with true if agree, false if don't agree.
    /// </summary>
    Controls.prototype.showUserConfirmation = function (callback, reason) {
        
        document.getElementById('userConfirmation').classList.remove('siemens-hidden');
        var agree = document.getElementById('agreeButton');
        if (agree) {
            agree.onclick = function () {
                document.getElementById('userConfirmation').classList.add('siemens-hidden');
                callback(true);
            };
        }

        var disagree = document.getElementById('disagreeButton');
        if (disagree ) {
            disagree.onclick = function () {
                document.getElementById('userConfirmation').classList.add('siemens-hidden');
                callback(false);
            };
        }
    };

    /// <summary>
    // Model view dropdown box UI interface code.
    /// </summary>
    Controls.prototype.mvDropDownWrapper = {

        /// <summary>
        // Initialize Model View dropdown and place inside parentID control.
        /// </summary>
        initialize: function (parentID) {

            $('#mvDropDownParent').remove();
            var parent = document.getElementById(parentID);

            //Initialize MS code.
            return function () {
                if ($.fn.Dropdown) {
                    $('.ms-Dropdown').Dropdown();
                }

                // Vanilla JS Components
                if (window.fabric) {
                    if (window.fabric.Dropdown) {
                        var elements = document.querySelectorAll('.ms-Dropdown');
                       
                        var component;
                        elements.forEach(function (element) {
                            component = new window.fabric.Dropdown(element);
                        });
                    }
                }
            };
        },

        /// <summary>
        // set model view to passed choice.
        /// </summary>
        set: function (value, text) {

            var selectElement = document.getElementById("modelViewsList");
            if (selectElement) {
                selectElement.value = value.toString();
                var title = document.getElementById("modelViewAreaDropDown").getElementsByClassName('ms-Dropdown-title');
                if (title && title[0] !== undefined) {
                    title[0].innerHTML = text;
                    $("#modelViewAreaDropDown").find('.ms-Dropdown-item.is-selected').removeClass('is-selected');
                }
            }
        },

        /// <summary>
        ///Using rootID will populate the drop down list with all the model views in the part.
        /// </summary>
        loadModelViewList: function (rootid) {
        
            var controls = JT2GoOfficeApp.ObjectFactory.getControls();
            var viewerWrapper = JT2GoOfficeApp.ObjectFactory.getViewerWrapper();
            var localization = JT2GoOfficeApp.ObjectFactory.getLocalization();

            controls.commandBar.enableItem('mvButton', false);

            var completionCallback = controls.mvDropDownWrapper.initialize("modelViewAreaDropDown");

            if (rootid !== undefined) {

                var addCallback = function (title, attrib) {
                    var opt = document.createElement('option');
                    opt.setAttribute('value', attrib);
                    opt.setAttribute('mvName', title);
                    opt.innerHTML = title;
                    document.getElementById('modelViewsList').add(opt);
                };

                var sepPos = rootid.indexOf(":");
                var rootPrefix = rootid.slice(0, sepPos + 1);

                var mvTree = viewerWrapper.getModelViewsStructureInfo();

                if (mvTree !== undefined && mvTree.hasOwnProperty('children')) {
                    addCallback(localization.getString("Reset model view"), -1);

                    viewerWrapper.processMvJson(mvTree.children[0], rootPrefix, addCallback);

                    if (document.getElementById('modelViewsList').children.length > 1) {
                        controls.commandBar.enableItem('mvButton', true);
                        document.getElementById('modelViewArea').classList.remove('siemens-hidden');
                        var shotctrl = document.getElementById('screenshotText');
                        if (shotctrl) {
                            shotctrl.textContent = localization.getString('Insert Model View');
                        }

                        completionCallback();

                    }
                }
            }
        }

    };

    /// <summary>
    // message banner control.  callback executed when message banner closed.  msg and button label is displayed in banner.
    /// </summary>
    Controls.prototype.messageBanner = function (msg, buttonLabel, callback) {

        document.getElementById('clipperTextField').innerHTML = msg;
        var buttonDiv = document.getElementById("messageBannerButton");
        if (buttonDiv) {
            var button = buttonDiv.getElementsByClassName('ms-Button');
            if (button) {
                button[0].innerHTML = buttonLabel;
            }
        }
        document.getElementById('messageBanner').classList.remove('siemens-hidden');

        if ($.fn.MessageBanner) {
            $('.ms-MessageBanner').MessageBanner();
        }

        if (window.fabric) {

            if (window.fabric.MessageBanner) {
                var element = document.querySelector('.ms-MessageBanner');
                var component = new window.fabric.MessageBanner(element);
            }
        }

        var bannerCtrl = document.getElementById('messageBannerButton');
        if (bannerCtrl) {
            bannerCtrl.onclick = function () {
                document.getElementById('messageBanner').classList.add('siemens-hidden');
                callback();
            };
        }


        var messageBannerCloseCtrl = document.getElementById('messageBannerCloseButton');
        if (messageBannerCloseCtrl) {
            messageBannerCloseCtrl.onclick = function () {
                //hide it.
                document.getElementById('messageBanner').classList.add('siemens-hidden');
            };
        }

    };

 
    /// <summary>
    // commandbar wrapper for viewer command bar.
    /// </summary>
    Controls.prototype.commandBar = commandBar;


    var associatedFileContext = null;
    /// <summary>
    // callout to show information associated with the current selected binding in document.
    Controls.prototype.associatedFile = {
        /// <summary>
        // show/hide associated file callout.  If Show use viewer context to display appropriate file/text for associated file.
        /// </summary>
        show: function (show, viewerContext) {
            if (show) {
                associatedFileContext = viewerContext;
                var msg = "";

                if (viewerContext.filePath) {
                    msg = JT2GoOfficeApp.ObjectFactory.getLocalization().getString("This image was created with a URL for <b>") + viewerContext.fileName + JT2GoOfficeApp.ObjectFactory.getLocalization().getString("</b>.  do you want to load it?");
                } else {
                    msg = JT2GoOfficeApp.ObjectFactory.getLocalization().getString("This image was created with file <b>") + viewerContext.fileName + JT2GoOfficeApp.ObjectFactory.getLocalization().getString("</b>.  do you want to load it?");
                }

                var assocFile = document.getElementById('associatedFileText');
                assocFile.innerHTML = msg;
                document.getElementById('imageViewerMismatch').classList.remove('siemens-hidden');
            } else {
                document.getElementById('imageViewerMismatch').classList.add('siemens-hidden');
            }
        },

        /// <summary>
        // associated file initialization.  Sets callback for the load control in the associated file callout.
        /// </summary>
        initialize: function (callback) {

            var load = document.getElementById('loadAssociatedFile');
            if (load) {
                load.onclick = function () {
                    JT2GoOfficeApp.ObjectFactory.getControls().associatedFile.show(false);
                    callback(associatedFileContext);
                };
            }

            var cancel = document.getElementById('cancelAssociatedFileLoad');
            if (cancel) {
                cancel.onclick = function () {
                    JT2GoOfficeApp.ObjectFactory.getControls().associatedFile.show(false);
                };
            }
        }
    };

    JT2GoOfficeApp.Controls = Controls;


})();