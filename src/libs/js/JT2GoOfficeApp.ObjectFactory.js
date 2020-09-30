

// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 


(function () {
    "use strict";

    /// <summary>
    ///  Used for retrieval/Creation of objects used in the Office Add-in (resizer, controls, converter, viewer wrapper, browser container, data handler, urls etc, etc)
    /// </summary>
    function ObjectFactory() {
        if (typeof this.instance === 'object') {
            return this.instance;
        }

        this.instance = this;
        this.resizer=undefined;
        this.controls = undefined;
        this.converter = undefined;
        this.viewerWrapper = undefined;
        this.browserContainer = undefined;
        this.dataHandler = undefined;

        //localization singleton.
        if (!this.localization) {
            this.localization = new JT2GoOfficeApp.Localization();
        }
    }

 

    //browser,content,taskpane
    var getPlatform = function () {
        var platform = "";
        var appContainer = document.getElementById('containerInfoID');
        if (appContainer) {
            platform = appContainer.getAttribute('platform');
        }

        return platform;
    };

    //Remote,local
    var getHost = function () {
        var platform = "";
        var appContainer = document.getElementById('containerInfoID');
        if (appContainer) {
            platform = appContainer.getAttribute('host');
        }

        return platform;
    };

    /// <summary>
    ///  Get localization object.
    /// </summary>
    ObjectFactory.prototype.getLocalization = function () {

        if (!this.localization) {
            this.localization = new JT2GoOfficeApp.Localization();
        }

        return this.localization;

    };

    /// <summary>
    ///  gets the appropriate resizer based on the platform specified in the html.
    /// </summary>
    ObjectFactory.prototype.getResizer = function (width, height) {

        if (this.resizer === undefined) {
            if (getPlatform() === 'taskpane') {
                this.resizer = new JT2GoOfficeApp.TaskResizer(width, height);
            } else {
                this.resizer = new JT2GoOfficeApp.Resizer(width, height);
            }
        }
        return this.resizer;

    };

    /// <summary>
    ///  Gets the controls object
    /// </summary>
    ObjectFactory.prototype.getControls = function () {
        if (this.controls === undefined) {
            this.controls = new JT2GoOfficeApp.Controls();
        }

        return this.controls;
    };

    /// <summary>
    ///  Gets the controls object
    /// </summary>
    ObjectFactory.prototype.getConverter = function () {
        if (this.converter === undefined) {
            if (JT2GoOfficeApp.Converter) {
                this.converter = new JT2GoOfficeApp.Converter();
            }
        }

        return this.converter;
    };

    /// <summary>
    ///  Gets the viewer wrapper object
    /// </summary>
    ObjectFactory.prototype.getViewerWrapper = function () {

        if (this.viewerWrapper === undefined) {
            this.viewerWrapper = new JT2GoOfficeApp.ViewerWrapper();
        }

        return this.viewerWrapper;
    };

    /// <summary>
    ///  Gets the appropriate browser container based on the platform specified in the html page
    /// </summary>
    ObjectFactory.prototype.getBrowserContainer = function () {

        if (this.browserContainer === undefined) {
            if (getPlatform() === 'browser') {
                this.browserContainer = new JT2GoOfficeApp.BrowserContainerBase();
            } else {
                this.browserContainer = new JT2GoOfficeApp.BrowserContainer();
            }
        }

        return this.browserContainer;

    };

    /// <summary>
    ///  Gets the appropriate data handler based on the platform specified in the html page
    /// </summary>
    ObjectFactory.prototype.getDataHandler = function () {

        if (this.dataHandler === undefined) {
            if (getPlatform() === 'browser') {
                this.dataHandler = new JT2GoOfficeApp.DataHandlerBase();
            } else {
                this.dataHandler = new JT2GoOfficeApp.DataHandler();
            }
        }

        return this.dataHandler;
    };

    //TODO: when Microsoft has the integrated One Drive stuff working for Office Add-in implement the integrated One Drive support.
    //ObjectFactory.prototype.getOneDriveURL = function () {
    //    var url = 'https://converterservicebeta.azurewebsites.net/common/oneDriveWrapper.html';


    //    if (getHost() === 'local') {
    //        url = 'http://localhost:55254/common/oneDriveWrapper.html';
    //    }

    //    return url;

    //};

    /// <summary>
    ///  Gets the appropriate converter upload url based on the host specified in the html page
    /// </summary>
    ObjectFactory.prototype.getConverterUploadURL = function () {
        var url = 'https://converterservicebeta.azurewebsites.net/ConverterService/webapi/converter/upload';


        if (getHost() === 'local') {
            url = 'http://localhost:8080/ConverterService/webapi/converter/upload';
        }

        return url;

    };

    /// <summary>
    ///  Gets the appropriate converter upload by URL url based on the host specified in the html page
    /// </summary>
    ObjectFactory.prototype.getConverterUploadByURLURL = function () {
        var url = 'https://converterservicebeta.azurewebsites.net/ConverterService/webapi/converter/uploadURL';


        if (getHost() === 'local') {
            url = 'http://localhost:8080/ConverterService/webapi/converter/uploadURL';
        }

        return url;

    };

    /// <summary>
    ///  Gets the appropriate converter convert url based on the host specified in the html page
    /// </summary>
    ObjectFactory.prototype.getConverterConvertURL = function () {
        var url = 'https://converterservicebeta.azurewebsites.net/ConverterService/webapi/converter/convert';

        if (getHost() === 'local') {
            url = 'http://localhost:8080/ConverterService/webapi/converter/convert';
        }

        return url;
    };

 

    JT2GoOfficeApp.ObjectFactory = new ObjectFactory();
 

})();