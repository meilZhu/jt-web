import * as $ from './jquery-2.1.4.min.js';

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
    /// Base implementation of DataHandler.  contains functionality that isn't specific to the container the app is running in (static HTML page, task pane, content pane, web app)
    /// </summary>
    function DataHandlerBase() {
       
    }

    /// <summary>
    /// Create a empty document level viewer context object.
    /// </summary>
    DataHandlerBase.prototype.emptyContext = function(){
        return {
            fileName: "",
            filePath: "",
            width: 0,
            height: 0,
            empty: true,
            acknowledgedUsage: false
        };
    };

    /// <summary>
    ///No-Op.  no template at this level.
    /// </summary>
    DataHandlerBase.prototype.setViewerContextTemplate = function () {
        return undefined;
    };

    /// <summary>
    /// No-Op.  No viewer context at this level
    /// </summary>
    DataHandlerBase.prototype.createViewerContext = function () {

        return undefined;
    };


    /// <summary>
    /// No-Op.  No viewer context at this level
    /// </summary>
    DataHandlerBase.prototype.findViewerContext = function () {

        return undefined;
    };


    /// <summary>
    /// Search a list of nodes (attributes, child nodes, etc) looking for a local name.  If found return node.
    /// </summary>
    DataHandlerBase.prototype.nodeFind = function (nodes, nodeLocalName) {
        var found;
        var i;
        for (i = 0; i < nodes.length; i += 1) {
            if (nodeLocalName === nodes[i].localName) {
                found = nodes[i];
                break;
            }
        }

        return found;
    };

    /// <summary>
    ///  Given a json object making up Structure, Properties, and PMI for bod data  parse and load in the viewer.  
    ///  callback executes on completion with no return value.
    /// </summary>
    DataHandlerBase.prototype.doLoad = function (jsonString, callback) {

        var controls = JT2GoOfficeApp.ObjectFactory.getControls();

        controls.spinner.text(JT2GoOfficeApp.ObjectFactory.getLocalization().getString("loading...."));
        controls.spinner.show(true);

        if (jsonString !== undefined && jsonString !== "") {
            //take the title and save it off as our filename.
            var context = this.getDocContext();
            context.fileName = jsonString.structure.title;
            this.persistDocContext(context);

            this.parseAndLoadResponse(jsonString, function (rootID) {
                controls.mvDropDownWrapper.loadModelViewList(rootID);
                controls.spinner.show(false);
                controls.viewerTitle.show(true, context.fileName);

                var resizer = JT2GoOfficeApp.ObjectFactory.getResizer();
                resizer.resize();

                if (callback) {
                    JT2GoOfficeApp.ObjectFactory.getViewerWrapper().setAllVisible(rootID, callback);
                }

            });
        } else {
            controls.spinner.show(false);

        }
    };

    /// <summary>.
    /// Parse json strings and send them to appropriate viewer api's as needed.
    /// </summary>
    DataHandlerBase.prototype.parseAndLoadResponse = function (jsonData, callback) {


        //When structure is done load pmi data.
        var structDone = function (success, rootid) {
          
                callback(rootid);
            

        };

        var jsonString = JSON.stringify(jsonData);

        //Load structure in the viewer.
        JT2GoOfficeApp.ObjectFactory.getViewerWrapper().loadStructObject(jsonData.structure, structDone);
    };

    /// <summary>.
    /// No Op.  No document level context to search at this level.
    /// </summary>
    DataHandlerBase.prototype.findFile = function (callback) {

        callback(undefined);
    };


    /// <summary>
    ///  Returns current document level viewer context, or empty context if none.
    /// </summary>
    DataHandlerBase.prototype.getDocContext = function () {
        if (this.docContext === undefined) {
            this.docContext = this.emptyContext();
        }

        return this.docContext;
    };



    /// <summary>
    ///  Sets document context object to passed context  (not persisted beyond session)
    /// </summary>
    DataHandlerBase.prototype.persistDocContext = function (context) {
        this.docContext = context;
    };


    JT2GoOfficeApp.DataHandlerBase = DataHandlerBase;

})();
// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 

/// <summary>.
///Layer between the viewer javascript and the office layer that allows interaction with the document without coupling the document data type to the viewer code.
/// </summary>
(function () {
    "use strict";
    function DataHandler() {
        JT2GoOfficeApp.DataHandlerBase.call(this);
		// var decodedDataStruct = atob('');
		// this.model = JSON.parse(decodedDataStruct);

		var decodedDataPMI = atob('');
		if (decodedDataPMI != undefined && decodedDataPMI.length > 0){
			this.PMI = JSON.parse(decodedDataPMI);
		}
    }

    DataHandler.prototype = Object.create(JT2GoOfficeApp.DataHandlerBase.prototype);
    DataHandler.prototype.constructor = DataHandler;

    DataHandler.prototype.doLoad_original = JT2GoOfficeApp.DataHandlerBase.prototype.doLoad;

    DataHandler.prototype.doLoad = function(data, cback){
        //Create a json object of the appropriate structure from the stored data and call the base dataHandler.doLoad(data) using the data object.

        this.model = data;

        var jsonData = {structure: data, pmi: this.PMI};
        DataHandler.prototype.doLoad_original.call(this, jsonData, cback);

        // var oThis = this;
        // $.ajax({
        //     url: initConfig.dataUrl,
        //     type:'get',
        //     dataType:'text',
        //     success:function(res){
        //         oThis.model = JSON.parse(atob(res));
        //         console.log(oThis.model,'sdsjflkdjsfjdjsfld')
        //         var jsonData = {structure: oThis.model, pmi: oThis.PMI};
        //         DataHandler.prototype.doLoad_original.call(oThis, jsonData, cback);
        //     }
        // })
        
    };

    /// <summary>.
    ///Sets current viewer context template.
    /// </summary>
    DataHandler.prototype.setViewerContextTemplate = function (contextTemplate) {
  
    };

    /// <summary>.
    ///Using viewer context template will update with actual data and return viewer context xml with the values populated.
    /// </summary>
    DataHandler.prototype.createViewerContext = function (rootID, psid, pos, rot, tgt, name) {
    };

    /// <summary>.
    /// Using context object will return camera orientation /psid object to use to trigger the same viewer state/Model view.
    /// </summary>
    DataHandler.prototype.findViewerContext = function (xmlContext) {
        return undefined;
    };




    /// <summary>.
    /// Parse json strings and send them to appropriate viewer api's as needed.
    /// </summary>
    DataHandler.prototype.findFile = function (callback) {

        callback();
    };



    DataHandler.prototype.getDocContext = function () {
        return this.emptyContext();
    };

    DataHandler.prototype.persistDocContext = function (context) {

    };

  


    JT2GoOfficeApp.DataHandler = DataHandler;
})();