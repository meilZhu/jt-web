import * as PLMVisWeb from './plmvisweb.js';

// @<COPYRIGHT>@
// ==================================================
// Copyright 2016.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@ 

///Intellisense links.
/// <reference path="html2canvas.min.js" />
/// <reference path="three_min.js" />
/// <reference path="TrackballControls.js" />
/// <reference path="plmvisweb.min.js" />

/// <summary>
//abstraction layer for interacting with the viewer.
/// </summary>

(function () {
    "use strict";

    function ViewerWrapper() {
        this.viewerRootID = "";
        //prefix of viewer root id... root:somenumber
        this.prefixRootID = "";
        this.pmiManager = undefined;
        this.viewer = undefined;
        this.errorString = "";
        this.snapshots;
        this.viewerCtrl = undefined;
        this.mvInfo = undefined;
        this.fileLoaded = false;
    }




    /// <summary>
    /// Changes the mouse mode between pan, zoom, rotate.
    /// </summary>
    ViewerWrapper.prototype.setMouseMode = function (targetID) {
        var mouseMode = PLMVisWeb.MouseMode.CONTEXT;


        if (targetID === "pan") {
            mouseMode = PLMVisWeb.MouseMode.PAN;
        } else
            if (targetID === "zoom") {
                mouseMode = PLMVisWeb.MouseMode.ZOOM;
            } else
                if (targetID === "rotate") {
                    mouseMode = PLMVisWeb.MouseMode.ROTATE;
                }

        this.viewer.setMouseNavigationMode(mouseMode);
    };

    /// <summary>
    /// Get the size of the viewer (x,y)
    /// </summary>
    ViewerWrapper.prototype.getSize = function () {
        return this.viewerCtrl.getSize();
    };

    /// <summary>
    //Register for Viewer selection events.
    /// </summary>
    ViewerWrapper.prototype.registerSelectionEvent = function (event) {
        this.viewer.registerSelectionEvent(event);
    };

    /// <summary>
    ///Create a png snapshot.
    /// </summary>
    ViewerWrapper.prototype.createSnapshot = function (callback) {
        this.snapshots.createSnapshotPNG(callback);
    };

    /// <summary>
    /// Get Current camera info.
    /// </summary>
    ViewerWrapper.prototype.getCameraInfo = function () {
        return this.viewer.getCameraOrientationInfo();
    };

    /// <summary>
    /// Set current camera info.
    /// </summary>
    ViewerWrapper.prototype.setCameraInfo = function (data) {
        this.viewer.setCameraOrientationInfo({ pos: data.pos, rot: data.rot, tgt: data.tgt });
    };

    /// <summary>
    /// get part/mv/entity name associated with psid.
    /// </summary>
    ViewerWrapper.prototype.getNameByID = function (id) {
        return this.viewer.getNameByPsId(id);
    };

    /// <summary>
    /// Retrieve current error, if any.
    /// </summary>
    ViewerWrapper.prototype.error = function () {
        return this.errorString;
    };

    /// <summary>
    /// Initialize the viewer.
    /// </summary>
    ViewerWrapper.prototype.initialize = function (ctrl) {

        var initialized = false;
        this.mvInfo = undefined;

        if (ctrl) {
            if (PLMVisWeb === undefined) {
                this.errorString = JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Error: PLMVisWeb not defined');
            } else {

                var params = {
                    host: ctrl,
                    width: ctrl.offsetWidth + 'px',
                    height: ctrl.offsetHeight + 'px'
                };
                this.viewerCtrl = new PLMVisWeb.Control(params);

                if (!this.viewerCtrl) {
                    this.errorString = JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Error: Unable to create control');
                }
                else {
                    this.viewer = this.viewerCtrl.getExtensionManager(PLMVisWeb.Viewer);

                    if (this.viewer === undefined) {
                        this.errorString = JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Error: Unable to create viewer manager');
                    } else {
                        this.snapshots = this.viewer.addExtension(PLMVisWeb.Snapshot);
                        this.snapshots.setSnapshotEnabled(true);

                        initialized = true;
                    }
                }
                this.viewer.draw();
            }
        } else {
            this.errorString = JT2GoOfficeApp.ObjectFactory.getLocalization().getString('Error: Unable to find control container');
        }

        return initialized;
    };


    /// <summary>
    /// Set model view active associated with passed id.
    /// </summary>
    ViewerWrapper.prototype.setModelViewActive = function (id, mvName) {

        var psId = parseInt(id);

        if (psId > -1) {
            this.mvInfo = {
                id: id,
                name: mvName
            };
            //update the root part of the psid to the current root id.
            var strSplit = id.split(":");
            var mvID = id;
            if (strSplit.length > 1) {
                mvID = strSplit[1];
            }
            var updatedID = this.prefixRootID + ":" + mvID;
            if (this.pmiManager) {
                this.pmiManager.setModelViewActive(updatedID, true);
            }
        }
        else {

            this.turnOffPMI();
            this.viewer.setCameraOrientation([0, 0, 1, 0, 0, -1, 0, 0, 0, 0]);
            this.viewer.fitAll();
        }

    };

    /// <summary>
    /// Set all parts visible.  callback executed when finished.
    /// </summary>
    ViewerWrapper.prototype.setAllVisible = function (rootID, callback) {
        this.viewer.setVisibilityByPsId(rootID, true, callback);
    };

    /// <summary>
    /// Turn off all PMI.
    /// </summary>
    ViewerWrapper.prototype.turnOffPMI = function () {
        this.mvInfo = undefined;

        if (this.pmiManager) {
            this.pmiManager.setVisibilityByPsId(this.pmiManager.psId, false);
        }
        this.viewer.setVisibilityByPsId(this.viewer.psId, true);
    };

    /// <summary>
    /// load structure in the viewer.
    /// </summary>
    ViewerWrapper.prototype.loadStructObject = function (jsonData, callback) {

        var localThis = this;
        var wrappedCallback = function (success, rootID) {
            localThis.fileLoaded = success;
            if (callback !== undefined) {
                callback(success, rootID);
            }
        }

        this.fileLoaded = false;
        this.turnOffPMI();

        var viewer = this.viewer;

        if (jsonData !== undefined) {
            var fileDone = function (success, rootid) {
                if (success) {
                    viewer.setVisibilityByPsId(rootid, true, function () {
                        viewer.draw();
                    });
                }

                wrappedCallback(success, rootid);
            };

            this.viewer.openWithObject(jsonData, fileDone);

        } else {

            wrappedCallback(false);

        }
    };


    /// <summary>
    /// Get Model view object from pmi manager.  returns undefined if no model views.
    /// </summary>
    ViewerWrapper.prototype.getModelViewsStructureInfo = function () {

        if (this.pmiManager) {
            var mvTree = this.pmiManager.getModelViewsStructureInfo();
        }

        if (mvTree === null) {
            mvTree = undefined;
        }

        return mvTree;
    };

    /// <summary>
    /// gets currently active model view, if any
    /// </summary>
    ViewerWrapper.prototype.getCurrentMV = function () {

        return this.mvInfo;
    };

    /// <summary>
    /// Get view root id for model.
    /// </summary>
    ViewerWrapper.prototype.getRootID = function () {

        return this.viewerRootID;
    };

    /// <summary>
    /// Load PMI data in the viewer.
    /// </summary>
    ViewerWrapper.prototype.loadPmiObjects = function (rootid, jsonData, callback) {



        if (this.pmiManager !== undefined && rootid !== undefined) {
            this.viewerRootID = rootid;

            var pmiManager = this.pmiManager;

            var prefix = this.viewerRootID;
            var strSplit = this.viewerRootID.split(":");
            if (strSplit.length >= 1) {
                prefix = strSplit[0];
            }
            this.prefixRootID = prefix;
            var pmiDone = function (success) {
                if (success) {
                }

                if (callback !== undefined) {
                    callback(success);
                }
            };

            this.pmiManager.loadPmiDataWithObject(rootid, jsonData, pmiDone);
        } else {
            if (callback !== undefined) {
                callback(false);
            }
        }

    },


    /// <summary>
    /// Process the model views json object into key value pairs to consumption by model view list box.
    /// </summary>
    ViewerWrapper.prototype.processMvJson = function (modelViews, rootPrefix, addCallback) {

        var callback = addCallback;


        if (modelViews !== undefined && rootPrefix !== undefined) {
            if (modelViews.psId !== undefined && modelViews.children === undefined) { // leaf

                callback(modelViews.name, modelViews.psId);
            }
            else {

                var numChildren = modelViews.children.length;
                var childIdx;
                for (childIdx = 0; childIdx < numChildren; childIdx += 1) {
                    if (modelViews.children[childIdx].text === undefined) { // don't bother with text nodes, it's just data
                        this.processMvJson(modelViews.children[childIdx], rootPrefix, callback);
                    }
                }

            }
        }

    };

    /// <summary>
    /// returns true if a part is loaded in the viewer.
    /// </summary>
    ViewerWrapper.prototype.isFileLoaded = function () {

        return this.fileLoaded;

    };


    /// <summary>
    /// causes viewer to resize to width and height specified.
    /// </summary>
    ViewerWrapper.prototype.resize = function (width, height) {

        this.viewerCtrl.setSize(width, height);
    };


    JT2GoOfficeApp.ViewerWrapper = ViewerWrapper;
})();