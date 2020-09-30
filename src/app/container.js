module.exports = `
    <div class="siemens-inner-app-container">
        <div id="headerArea" class="siemens-header-area">
            <div class="ms-CommandBar siemens-commandBar" id="navButtons">

                <div class="ms-CommandBar-sideCommands siemens-sideCommands">
                    <div class="ms-CommandBarItem siemens-commandBarItem">
                        <div class="ms-CommandBarItem-linkWrapper siemens-commandBarItem-linkWrapper">
                            <a class="ms-CommandBarItem-link siemens-commandBarItem-link" tabindex="1" id="pan" title="Pan">
                                <span class="ms-CommandBarItem-icon ms-Icon siemens-Icon--pan"></span>
                                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Pan</span>
                            </a>
                        </div>
                    </div>

                    <div class="ms-CommandBarItem siemens-commandBarItem">
                        <div class="ms-CommandBarItem-linkWrapper siemens-commandBarItem-linkWrapper">
                            <a class="ms-CommandBarItem-link siemens-commandBarItem-link" tabindex="1" id="zoom" title="Zoom">
                                <span class="ms-CommandBarItem-icon ms-Icon siemens-Icon--zoom"></span>
                                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Zoom</span>
                            </a>
                        </div>
                    </div>

                    <div class="ms-CommandBarItem siemens-commandBarItem">
                        <div class="ms-CommandBarItem-linkWrapper siemens-commandBarItem-linkWrapper">
                            <a class="ms-CommandBarItem-link siemens-commandBarItem-link" tabindex="1" id="rotate" title="Rotate">
                                <span class="ms-CommandBarItem-icon ms-Icon siemens-Icon--rotate"></span>
                                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Rotate</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="ms-CommandBar-mainArea siemens-commandBar-mainArea">
                    <div class="ms-CommandBarItem siemens-commandBarItem" id="structureButton">
                        <div class="ms-CommandBarItem-linkWrapper siemens-commandBarItem-linkWrapper">
                            <a class="ms-CommandBarItem-link  ms-PanelAction-open siemens-commandBarItem-link" tabindex="5" title="structure views">
                                <span class="ms-Icon siemens-Icon--modelViews"></span>
                                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Structure Views</span>
                            </a>
                        </div>
                    </div>

                    <div class="ms-CommandBarItem siemens-commandBarItem" id="mpButton">
                        <div class="ms-CommandBarItem-linkWrapper siemens-commandBarItem-linkWrapper">
                            <a class="ms-CommandBarItem-link siemens-commandBarItem-link" tabindex="5" title="MP Point">
                                <span class="ms-Icon"></span>
                                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">MP Point</span>
                            </a>
                        </div>
                    </div>

                    <div class="ms-CommandBarItem siemens-commandBarItem" id="markButton">
                        <div class="ms-CommandBarItem-linkWrapper siemens-commandBarItem-linkWrapper">
                            <a class="ms-CommandBarItem-link siemens-commandBarItem-link" tabindex="5" title="Display Mark">
                                <span class="ms-Icon"></span>
                                <span class="ms-CommandBarItem-commandText ms-font-m ms-font-weight-regular">Display Point</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div id="contentBlock">

            <div id="spinnerContainer" class="siemens-spinner-container siemens-hidden">
                <div class="ms-Spinner  ms-Spinner--large siemens-spinner">
                    <span id="spinnerLabel" class="ms-Spinner-label siemens-spinner-label">Loading...</span>
                </div>
            </div>
            <div id="viewerHost">
                <div id="viewerTitle" class="ms-label ms-font-l siemens-viewer-title siemens-hidden"></div>
                <div id="component"></div>

                <div id="viewerLabel" class="ms-label ms-font-s-plus siemens-viewer-label"></div>
            </div>
        </div>

        <div class="ms-Panel" id="slideoutPanel">
            <div class="ms-Panel-main siemens-panel-main">
                <div class="ms-Panel-contentInner siemens-hidden" id="structurePane">
                    <div class="ms-Panel-commands">
                        <button class="ms-Panel-closeButton ms-PanelAction-close">
                            <i class="ms-Panel-closeIcon ms-Icon ms-Icon--x"></i>
                        </button>
                    </div>
                    <p class="ms-Panel-headerText">Structure Views</p>
                    <div class="ms-Panel-content">
                        <div class="siemens-modelViewArea" id="structureArea">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;