
CNFIG_XML = 'start.xml';

function Background() {
    this.windows_ = [];
}

var tstdomain = 'http://localhost:8070/pages/';

Background.prototype.ifShowFrame_ = function () {
    var version = parseInt(navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    var os = 'other';
    if (navigator.appVersion.indexOf('Linux') != -1) {
        os = 'linux';
    } else if (navigator.appVersion.indexOf('CrOS') != -1) {
        os = 'cros';
    } else if (navigator.appVersion.indexOf('Mac OS X') != -1) {
        os = 'mac';
    }
    return os === 'linux' && version < 27 ||
            os === 'mac' && version < 25;
};

Background.prototype.newWindow = function () {
    /*var options1 = {
     name: 'screen1',
     file: 'screen1.xml',
     bounds: {top: 0,
     left: 0,
     width: 1920,
     height: 1080}
     }
     
     var options2= {
     name: 'screen2',
     file: 'screen2.xml',
     bounds: {top: 0,
     left: 1920,
     width: 1920,
     height: 1080}
     }
     
     this.windowOpen(options1, tstdomain);
     this.windowOpen(options2, tstdomain);*/
    for (var i = 0; i < this.cofiguration.domains.length; i++) {
        var url = this.cofiguration.domains[i].url;
        for (var nm in this.cofiguration.domains[i].forms) {
            var form = this.cofiguration.domains[i].forms[nm]
            var options = {
                name: nm,
                file: form.file,
                hidden: form.hidden ? true : undefined,
                bounds: {top: 0,
                    left: 0,
                    width: 1920,
                    height: 1080}
            }
            this.windowOpen(options, url);
        }
    }
};

//<form name="screen3" file="screen3.xml" left="100%" top="0%" width="100%" height="100%" name="screen3" decorated="no" visible="true"/>
//  windowOpen(tstopt, tstdomain)

Background.prototype.windowOpen = function (option, domain) {
    var _this = this;
    if (option) {
        var name = (typeof (option) == 'string') ? option : option.name;
        if (name) {
            if (this.windows_[name]) {
                this.windows_[name].focus();
            }
            else {
                if (option.file && domain) {
                    var winopp = {
                        id: name,
                        frame: (this.ifShowFrame_() ? 'chrome' : 'none')
                    };
                    for (var key in option)
                        if (key != 'file' && key != 'name')
                            winopp[key] = option[key];
                    chrome.app.window.create('screen.html', winopp, function (win) {
                        var wv = win.contentWindow.document.getElementById('webview');
                        if (wv) {
                            wv.setAttribute('src', domain + option.file);
                        }
                        else {
                            win.contentWindow.onload = function () {
                                var wv = this.document.getElementById('webview');
                                if (wv) {
                                    wv.setAttribute('src', domain + option.file);
                                }
                            }
                        }
                        _this.windows_[option.name] = win;
                    }.bind(this));
                }
            }
        }
    }
}

Background.prototype.windowClose = function (option) {
    if (option) {
        var name = (typeof (option) == 'string') ? option : option.name;
        if (name) {
            this.windows_[name].close();
            delete this.windows_[name];
        }
    }
}

Background.prototype.launch = function (launchData) {

    this.windows_ = [];
    this.cofiguration = {};
    this.cofiguration.domains = [];
    this.cofiguration.configDoc = null;

    this.loadConfiguration();

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        console.log("message received to background =", message);
        switch (message) {
            case  '$$exit' :
            {
                console.log("need exit");
                var wns = chrome.app.window.getAll();
                for (var i = 0; i < wns.length; ++i)
                    wns[i].close()
                break;
            }
            default:
            {

            }
        }
    });

    //if (this.windows_.length == 0)
    //this.newWindow();

};

Background.prototype.onWindowClosed = function (win) {
};

Background.prototype.onWindowReady = function (textApp) {
};

Background.prototype.loadConfiguration = function () {
    var this_ = this;
    try {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", CNFIG_XML, true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    this_.cofiguration.configDoc = xmlHttp.responseXML;
                    this_.readConfigurations();
                    return true;
                }
            }
        }
        xmlHttp.send(null);
    }
    catch (exception) {
        console.error('Background.prototype.loadConfiguration', exception);
    }
}

Background.prototype.readConfigurations = function () {
    var projects = this.cofiguration.configDoc.getElementsByTagName('project');
    for (var i = 0; i < projects.length; i++)
        this.readConfiguration(projects[i]);
    var domains = this.cofiguration.configDoc.getElementsByTagName('domain');
    for (var i = 0; i < domains.length; i++)
        this.readConfiguration(domains[i]);

    this.newWindow();
}

Background.prototype.readConfiguration = function (domain) {
    if (domain.hasAttribute('url')) {
        var remoteurl = domain.getAttribute('url');
        var dom = {'url': remoteurl};
        dom.forms = {};
        for (var ch = domain.firstElementChild; ch; ch = ch.nextElementSibling) {
            if (ch.nodeName == 'form') {
                var frmelement = ch;
                if (frmelement.hasAttribute('name')) {
                    var frm = frmelement.getAttribute('name');
                    dom.forms[frm] = {'url': remoteurl};
                    this.readConfigurationAttr(dom.forms[frm], frmelement);
                }
            }
        }
        this.cofiguration.domains.push(dom);
    }
}


Background.prototype.readConfigurationAttr = function (domfrm, form) {
    for (var k in form.attributes) {
        switch (form.attributes[k].name) {
            case 'file':
                domfrm['file'] = form.attributes[k].value;
                break;
            case 'caption':
                domfrm['caption'] = form.attributes[k].value;
                break;
            case 'visible':
            {
                if (form.attributes[k].value == 'false')
                    domfrm['hidden'] = true;
                break;
            }
            default:
            {

            }
        }
    }
}

var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launch.bind(background));

/* Exports */
window['background'] = background;
Background.prototype['onWindowReady'] = Background.prototype.onWindowReady;
Background.prototype['newWindow'] = Background.prototype.newWindow;
