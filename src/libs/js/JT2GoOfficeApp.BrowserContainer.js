import * as $ from './jquery-2.1.4.min.js';

// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 

///Intellisense links.
/// <reference path="../App.js" />

/// <summary>
/// Base implementation of BrowserContainer.  contains functionality that isn't specific to the container the app is running in (static HTML page, task pane, content pane, web app)
/// </summary>
(function () {
    "use strict";

    function BrowserContainerBase() {

    }

    /// <summary>
    //Show a string as console output
    /// </summary>
    BrowserContainerBase.prototype.showNotification = function (errorString) {
        console.error(errorString);
    };

    /// <summary>
    //Initialize the web app, load the templates, and fire the callback when the dom is ready.
    /// </summary>
    BrowserContainerBase.prototype.initialize = function (callback) {

        var domReady = function (callback) {
            if (document.readyState === "interactive" || document.readyState === "complete"){
                callback();
            } else {
                document.addEventListener("DOMContentLoaded", callback);
            }
        };

        domReady(function () {
            var controls = JT2GoOfficeApp.ObjectFactory.getControls();
            if (controls) {
                controls.msInitialize();
            }
            callback(true);
        });

    };

    BrowserContainerBase.prototype.detectWebGL = function () {
 
        if (window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                 names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
               context = false;

            for (var i = 0; i < names.length; i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled                                     
                        return "available";
                    }
                } catch (e) { return "unavailable"; }
            }

            // WebGL is supported, but disabled
            return "disabled";
        }

        // WebGL not supported
        return "unavailable";
    };

    /// <summary>
    //No op code.  Bindings specific to office app
    /// </summary>
    BrowserContainerBase.prototype.processBindings = function () {
        return undefined;
    };

    /// <summary>
    //No op code.  Bindings specific to office app    /// </summary>
    BrowserContainerBase.prototype.bindingSelectionChanged = function () {
        return undefined;
    };

    /// <summary>
    //No op code.  Bindings specific to office app
    /// </summary>
    BrowserContainerBase.prototype.addEventHandlerToBinding = function () {
        return undefined;
    };

    /// <summary>
    //No op code.  Bindings specific to office app
    /// </summary>
    BrowserContainerBase.prototype.loadTemplates = function () {
        return undefined;
    };


    /// <summary>
    //Retrieves a file from the server using a asynchronise get.  Used to load templates, etc.
    /// </summary>
    BrowserContainerBase.prototype.asyncGet = function (file, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.responseType = 'text';


        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/xml');
        }

        xhr.onload = function () {
            if (xhr.response !== undefined) {
                if (xhr.response !== null && (xhr.status === 200 || xhr.status === 0)) { // need 0 for local file access
                    callback(xhr.response);
                }
                else {
                    console.error('Error fetching ' + file);
                    JT2GoOfficeApp.BrowserContainerBase.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Unable to retrieve data.'));
                    callback("");
                }
            }
            else {
                console.error('Error fetching ' + file);
                JT2GoOfficeApp.BrowserContainerBase.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Unable to retrieve data.'));
                callback("");
            }
        };
        xhr.send(null);
    };

    /// <summary>
    //No op code.  Bindings specific to office app
    /// </summary>
    BrowserContainerBase.prototype.getImageContentControl = function () {

        return undefined;

    };

    /// <summary>
    //No op code.  image saving specific to Office app
    /// </summary>
    BrowserContainerBase.prototype.saveSnapshot = function () {
        return undefined;
    };


    /// <summary>
    //No op code.  image saving specific to Office app
    /// </summary>
    BrowserContainerBase.prototype.saveImage = function () {
        return undefined;
    };


    /// <summary>
    //No op code.  image saving specific to Office app
    /// </summary>
    BrowserContainerBase.prototype.saveOOXML = function () {
        return undefined;
    };
	
    /// <summary>
    //No op code.  Currently no need for finit code in anything but the Office add-in.
    /// </summary>
	 BrowserContainerBase.prototype.finit = function () {
        return undefined;
    };


    /// <summary>
    // Load file from local machine.
    /// </summary>
    BrowserContainerBase.prototype.doFilePick = function (callback) {
        var fileSelector = document.createElement('input');
        fileSelector.id = "fileSelectorJTFile";
        fileSelector.setAttribute('type', 'file');
        fileSelector.style.display = "none";
        fileSelector.multiple = false;
        fileSelector.accept = "application/x-jt";

        document.body.appendChild(fileSelector);
        var handleFileSelect = function (evt) {
            var file = evt.target.files[0]; // FileList object
            //TODO: when Microsoft has the integrated One Drive stuff working for Office Add-in implement the integrated One Drive support.
            //var oneDriveUpload = JT2GoOfficeApp.ObjectFactory.getDataHandler().getData("AutoOneDriveUpload");

            //if (oneDriveUpload) {
            //    var reader = new FileReader();

            //    if (file && reader) {
            //        reader.addEventListener("load", function () {
            //            JT2GoOfficeApp.BrowserContainerBase.doOneDriveFileSave(file.name, "fileSelectorJTFile", reader.result);
            //        }, false);

            //        reader.readAsDataURL(file);

            //    }
            //}

            callback(file);        };

        fileSelector.addEventListener('change', handleFileSelect, false);
        fileSelector.click();
    };

    /// <summary>
    // Load file from One Drive URL.
    /// </summary>
    BrowserContainerBase.prototype.processOneDriveURL = function (sourceURL, callback) {



        var b64URL = btoa(sourceURL);

        //Append u! to be beginning of the string.
        var encodedUrl = "u!" + b64URL;

        var url = 'https://api.onedrive.com/v1.0/shares/' + encodedUrl + '/root?expand=children';

        $.ajax({
            type: 'GET',
            url: url,
            headers: {
                "Prefer": 'respond-async'
            },
            // "Authorization": 'Bearer ' + accessToken},
            success: function (data) {

                var downloadurl = data['@content.downloadUrl'];

                $.ajax({
                    type: 'GET',
                    url: downloadurl,
                    success: function (unusedData) {

                        var downloadurl = data['@content.downloadUrl'];
                       
                        if (!downloadurl) {
                            console.error('OneDrive url not returned: ', err.message);
                            app.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Unable to access One Drive url.'));
                            callback("");
                        } else {
                            callback(downloadurl);
                        }
                       
                    },
                    error: function (err) {
                        console.error('OneDrive url error: ', err.message);
                        app.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Unable to access One Drive url.'));
                        callback("");
                    }
                });
            },
            error: function (err) {
                console.error('OneDrive url error: ', err.message);
                app.showNotification(JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Unable to access url.'));
                callback("");
            }

        });
    }

    BrowserContainerBase.prototype.saveData = function (strData, modelName) {
    }

    //TODO: when Microsoft has the integrated One Drive stuff working for Office Add-in implement the integrated One Drive support.
    /// <summary>
    // Save file to One Drive.  Currently unsupported because not supported in Office 2013
    /// </summary>
    //BrowserContainerBase.prototype.doOneDriveFileSave = function (filename, filePickerID, uri) {

    //    var options = {

    //        // Specify the options for the picker (we want download links and only one file).
    //        //clientId: "57a7b669-a02a-4456-8091-cb027d765c86",
    //        clientId: "529b2271-b5d2-4d79-b00f-ffac6adfcc8d",
    //        fileName: filename,
    //        action: "save | query",
    //        file: filePickerID,
    //        sourceUri: uri,
    //        sourceInputElementId: filePickerID,
    //        advanced: {},

    //        success: function (files) {
    //            console.log("success");
    //        },

    //        cancel: function () {
    //            // Handle the cancel function, which in this case we don't do anything
    //            browserContainer.showNotification("Cancel");

    //        },

    //        error: function (e) {
    //            // Handle errors generated by the picker.
    //            browserContainer.showNotification(e);
    //        },

    //        progress: function (p) {
    //            /* progress handler */
    //            console.log(p);
    //        }
    //    };

    //    OneDrive.save(options);

    //};

    /// <summary>
    // Pick and load a file from One Drive.  Currently unsupported because not supported in Office 2013
    /// </summary>
    //BrowserContainerBase.prototype.doOneDriveFilePick = function () {
    //    return undefined;

    //    if (Office.context.requirements.isSetSupported('DialogAPI', '1.1')) {
    //        // Use Office UI methods;

    //        //var signInURL = "http://localhost:55254/common/oneDriveWrapper.html";
    //        var signInURL = objFactory.getOneDriveURL();

    //        Office.context.ui.displayDialogAsync(signInURL,
    //        { height: 40, width: 40 },
    //        function (result) {
    //            dlg = result.value;
    //            dlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage);
    //        });
    //    } else{
    //        browserContainer.showNotification('DialogAPI is not supported in this Office version');
    //    }

    //};

    JT2GoOfficeApp.BrowserContainerBase = BrowserContainerBase;

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

    function BrowserContainer() {


        var browserContainer = new JT2GoOfficeApp.BrowserContainerBase();

        browserContainer.showNotification = function (errorString) {
            app.showNotification(errorString);
        };

        browserContainer.initialize = function (callback) {

			var domReady = function (callback) {
				document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
			};
			browserContainer.loadTemplates();
			domReady(function () {
				var controls = JT2GoOfficeApp.ObjectFactory.getControls();
				if (controls) {
					controls.msInitialize();
				}
				callback(true);
			});
		};


        browserContainer.processBindings = function () {

        };

        browserContainer.bindingSelectionChanged = function (eventArgs) {
        };

        browserContainer.addEventHandlerToBinding = function (thisbinding) {
        };

        browserContainer.loadTemplates = function () {


        };

        browserContainer.getImageContentControl = function (name, caption, base64File, width, height) {

        };

        browserContainer.saveSnapshot = function (mvInfo, binImg) {

        };

        browserContainer.saveOOXML = function (mvPsId, binImg, name) {

        };

        browserContainer.saveImage = function (mvPsId, binImg, name) {


        };

        browserContainer.saveLabelAndImage = function (mvPsId, text, binImg) {


        };

        // 获取选中的模型
        browserContainer.onSelectionChange = function (pids) {
            $('.structureLabel').removeClass("strusel");
            if(pids != undefined) {
                for(let i = 0; i < pids.length; i++) {
                    $('#structureLabel' + pids[i].replace(":", "_")).addClass("strusel");
                }
            }
        }

        // browserContainer.toggleSelectionChildren = function (childrenNode, psId, sel) {
        //     if(childrenNode != undefined) {
        //         for(let i = 0; i < childrenNode.length; i++) {
        //             let childNode = childrenNode[i];
        //             browserContainer.toggleSelectionChildren(childNode.children, psId, sel);
        //             if(childNode.psId == psId) {
        //                 childNode.selected = sel;
        //                 break;
        //             }
        //         }
        //     }
        // }

        browserContainer.toggleSelection = function (comp, psId) {
            var sel = $(comp).toggleClass("strusel").hasClass("strusel");
            viewerManager.viewer.setSelectionByPsId(psId, sel);
        };

        browserContainer.onDisplayChange = function (comp, psId) {
            viewerManager.viewer.setVisibilityByPsId(psId, comp.checked);
        };

        browserContainer.initStructureNode = function(cache, node, psId) {
            cache.push('<li>');
            cache.push('<input type="checkbox" checked onchange="JT2GoOfficeApp.ObjectFactory.getBrowserContainer().onDisplayChange(this, \'' + psId + ':' + node.psId + '\')"/>');
            cache.push('<label class="structureLabel" onclick="JT2GoOfficeApp.ObjectFactory.getBrowserContainer().toggleSelection(this, \'' + psId + ':' + node.psId+'\')" id="structureLabel'+ psId + '_' + node.psId +'">');
            cache.push(node.title);
            cache.push('</label>');
            if (node.hasOwnProperty('children')) {
                cache.push('<ul>');
                for(var i = 0; i < node.children.length; i++) {
                    browserContainer.initStructureNode(cache, node.children[i], psId);
                }
                cache.push('</ul>');
            }
            cache.push('</li>');
        }

        browserContainer.initStructureView = function(model) {
            console.log(model);
            document.getElementById("structureArea").innerHTML = '';
            if(model != undefined) {
                let cache = ['<ul>'];
                browserContainer.initStructureNode(cache, model, "1");
                cache.push('</ul>');
                document.getElementById("structureArea").innerHTML = cache.join('');
            }
        }

        browserContainer.finit = function (initConfig) {
            var dataHandler = JT2GoOfficeApp.ObjectFactory.getDataHandler();
            dataHandler.doLoad(initConfig, function(arg){
				if (initialCameraInfo !== undefined){
					// viewerManager.setCameraInfo(initialCameraInfo);
				}
                // init structure view
                browserContainer.initStructureView(dataHandler.model);
			});
            // regist selection event
            // viewerManager.viewer.registerSelectionEvent(browserContainer.onSelectionChange);
        }

        return browserContainer;
    };

    JT2GoOfficeApp.BrowserContainer = BrowserContainer;
})();
