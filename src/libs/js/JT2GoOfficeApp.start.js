
// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 

///Intellisense links.
/// <reference path="..\App\Home\DataHandler" />
/// <reference path="ViewerWrapper.js" />
/// <reference path="..\App\Home\BrowserContainer.js" />



/// <summary>
//Main class for UI interaction.
/// </summary>


JT2GoOfficeApp.start = function (initConfig) {
    "use strict";

    var viewerContainer;
    var startingWidth = 274;
    var startingHeight = 200;

   


    var localization = JT2GoOfficeApp.ObjectFactory.getLocalization();
    var converter = JT2GoOfficeApp.ObjectFactory.getConverter();
    var controls = JT2GoOfficeApp.ObjectFactory.getControls();

    var viewerWrapper = JT2GoOfficeApp.ObjectFactory.getViewerWrapper();
	window.viewerManager = viewerWrapper;

    var dataHandler = JT2GoOfficeApp.ObjectFactory.getDataHandler();
    var browserContainer = JT2GoOfficeApp.ObjectFactory.getBrowserContainer();

    var resizer = JT2GoOfficeApp.ObjectFactory.getResizer(startingWidth, startingHeight);

    /// <summary>
    ///Creates a screenshot with current context of view.
    /// </summary>
    function doScreenshot() {
        var done = function (encodedPng) {

            var binImg = encodedPng.split('data:image/png;base64,');

            browserContainer.saveSnapshot(viewerWrapper.getCurrentMV(), binImg);
        };

        viewerWrapper.createSnapshot(done);
    }

  

    /// <summary>
    ///  Loads a model into the viewer using a one drive URL.  callback executed on completion (no return value)
    /// </summary>
    function urlLoad(url, callback) {
        if (url !== undefined && url !== "") {
            controls.spinner.text(JT2GoOfficeApp.ObjectFactory.getLocalization().getString("uploading...."));
            controls.spinner.show(true);

            browserContainer.processOneDriveURL(url, function (processedURL) {
                var context = dataHandler.getDocContext();
                context.fileName = "";
                context.filePath = url;//Persist the unmolested url.
                dataHandler.persistDocContext(context);
                converter.uploadURL(processedURL, function (jsonString) {
                    if (jsonString !== undefined && jsonString !== "") {
                        //Grab this now;  Viewer will modify the structure and make it unusable.
                        var strData = JSON.stringify(jsonString);

                        dataHandler.doLoad(jsonString, function () {
                            browserContainer.saveData(jsonString);
                            callback();
                        });
                    } else {
                        controls.spinner.show(false);

                    }
                });
            });
            
        }
    }

    /// <summary>
    ///  Loads a model into the viewer using a local file object.  callback executed on completion (no return value)
    /// </summary>
    function fileLoad(file, callback) {
        if (file !== undefined && file !== "") {
            controls.spinner.text(JT2GoOfficeApp.ObjectFactory.getLocalization().getString("uploading...."));
            controls.spinner.show(true);
            var context = dataHandler.getDocContext();
            context.fileName = "";
            context.filePath = "";
            dataHandler.persistDocContext(context);
            converter.upload(file, function (jsonString) {
                if (jsonString !== undefined && jsonString !== "") {
                    //Grab this now;  Viewer will modify the structure and make it unusable.
                    var strData = JSON.stringify(jsonString);

                    dataHandler.doLoad(jsonString, function () {
                        browserContainer.saveData(strData);
                        if (callback) {
                            callback();
                        }
                    });
                } else {
                    controls.spinner.show(false);

                }
            });
        }
    }

    /// <summary>
    ///  Picks a local file and loads it in the viewer.  callback executed on completion (no return value)  One Drive currently not supported.
    /// </summary>
    function doFilePick(isOneDrive, callback) {
        controls.spinner.text(JT2GoOfficeApp.ObjectFactory.getLocalization().getString("uploading...."));
        controls.viewerTitle.show(true, "");
        controls.showViewerLabel("", false);


        if (isOneDrive) {
            //filename = browserContainer.doOneDriveFilePick(processMessage);
           
        } else {
            browserContainer.doFilePick(function (file) {
                    fileLoad(file, callback);
            });

        }

    }


    /// <summary>
    // Register listeners for pan, zoom, rotate, screenshot, and expand collapse of model view and part areas.
    /// </summary>
    function registerUIHandlers() {

        

        document.getElementById('pan').onclick = function () {
            var pan = document.getElementById('pan');
            controls.commandBar.toggleMovementCtrl(pan);
           
            viewerWrapper.setMouseMode('pan');
        };

        document.getElementById('zoom').onclick = function () {
            var zoom = document.getElementById('zoom');
            controls.commandBar.toggleMovementCtrl(zoom);

            viewerWrapper.setMouseMode('zoom');
        };

        document.getElementById('rotate').onclick = function () {
            var rotate = document.getElementById('rotate');
            controls.commandBar.toggleMovementCtrl(rotate);

            viewerWrapper.setMouseMode('rotate');
        };


        var filePickerCtrl = document.getElementById('filePickerButton');
        if (filePickerCtrl !== null) {
            filePickerCtrl.onclick = function () {
                doFilePick(false);
            };
        }

        var saveURLButton = document.getElementById('saveURLButton');
        if (saveURLButton !== null) {
            saveURLButton.onclick = function () {
                var saveURLButton = document.getElementById('urlDataSource');
                
                if (saveURLButton.value !== null && saveURLButton.value !== "") {
                    urlLoad(saveURLButton.value);
                }
            };
        }

        var screenShotCtrl = document.getElementById('screenshotButton');
        if (screenShotCtrl !== null) {
            screenShotCtrl.onclick = function () {
                doScreenshot();
            };
        }

    }



    /// <summary>
    /// Loads the viewer, populates the model view list if applicable, registers for change listener on that list.
    /// </summary>
    browserContainer.initialize(function (shouldLoad) {

        

        if (shouldLoad) {
            controls.msInitialize();
            var webGLSupport = browserContainer.detectWebGL();
            if (webGLSupport === "unavailable" || webGLSupport === "disabled") {
                var msg = (webGLSupport === "unavailable" ? "Please update browser to version that supports WebGL. " : "Please turn on webGL support in your browser");
                browserContainer.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString(msg));
                controls.disableAll();
            } else {

                var viewerContext = null;
                var callback = function () {

                    if (viewerContext) {
                        viewerWrapper.setCameraInfo(viewerContext);
                        if (viewerContext.id !== undefined && viewerContext.id !== "") {
                            viewerWrapper.setModelViewActive(viewerContext.id, viewerContext.name);
                            var label = viewerContext.name !== undefined ? viewerContext.name : "";
                            controls.showViewerLabel(label, true);
                            controls.mvDropDownWrapper.set(viewerContext.id, viewerContext.name);
                        }
                    }
                };

                browserContainer.processBindings(function () {
                    browserContainer.loadEmbeddedBodData(function (status) {

                        controls.associatedFile.initialize(function (associatedFileContext) {
                            viewerContext = associatedFileContext;

                            if (associatedFileContext) {
                                if (associatedFileContext.dataID) {
                                    browserContainer.loadEmbeddedBodData(null, associatedFileContext.dataID);
                                }
                                if ( associatedFileContext.filePath){
                                    urlLoad(associatedFileContext.filePath, callback);
                                }
                            } else {
                                doFilePick(false, callback);
                            }

                        });
                    });

                });

                
                

                registerUIHandlers();


                window.addEventListener("resize", function () {
                    resizer.resize();
                });

                viewerContainer = document.getElementById('component');
                if (dataHandler.getDocContext) {

                    var cntxt = dataHandler.getDocContext();
                }

                if (viewerWrapper.initialize(viewerContainer)) {

                    var viewerHostElement = document.getElementById('viewerHost');

                    if (viewerHostElement !== undefined) {

                        if (parseInt(cntxt.width) !== 0) {

                            resizer.resize(cntxt.width, cntxt.height);
                        } else {
                            cntxt.width = viewerHostElement.clientWidth;
                            startingWidth = cntxt.width;
                            cntxt.height = startingHeight;
                            if (dataHandler.persistDocContext) {
                                dataHandler.persistDocContext(cntxt);
                            }

                            resizer.init(startingWidth, startingHeight);
                        }

                        if (cntxt.fileName !== undefined && cntxt.fileName !== "") {
                            if (cntxt.filePath != undefined && cntxt.filePath != "") {
                                controls.messageBanner(localization.getString("You used a URL for <b>") + cntxt.fileName + localization.getString("</b>. would you like to reload it?"), localization.getString("Load"), function () { urlLoad(cntxt.filePath); });

                            } else {
                                controls.messageBanner(localization.getString("You used file <b>") + cntxt.fileName + localization.getString("</b>. would you like to reload it?"), localization.getString("Browse to File"), function () { doFilePick(false); });
                            }
                        }
                    }

                    document.getElementById('component').ondragover = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    };

                    document.getElementById('component').ondragenter = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    };


                } else {
                    console.error('Viewer initialize error: ', viewerWrapper.error);
                    browserContainer.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString("Failed to initialize viewer."));
                }


                //Because of the way the ui fabric dialog works you get a nasty dialog flash during startup, so its wrapped in a container that is hidden during startup.
                var startDlg = document.getElementById('startupDialogHide');

                if (startDlg) {
                    startDlg.classList.remove('siemens-hidden');
                }

                browserContainer.finit(initConfig);
            }
        }
    });
};