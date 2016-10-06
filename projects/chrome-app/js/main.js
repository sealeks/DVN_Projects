
CNFIG_XML = 'start.xml';

function Background() {
    this.windows_ = {};
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

Background.prototype.newWindow = function (name) {
    for (var i = 0; i < this.cofiguration.domains.length; i++) {
        var url = this.cofiguration.domains[i].url;
        for (var nm in this.cofiguration.domains[i].forms) {
            var form = this.cofiguration.domains[i].forms[nm]
            var options = {
                name: nm,
                file: form.file,
                hidden: form.hidden ? true : undefined,
                bounds: form.bounds
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
                        //id: name,
                        frame: (this.ifShowFrame_() ? 'chrome' : 'none')
                    };
                    for (var key in option)
                        if (key != 'file' && key != 'name')
                            winopp[key] = option[key];
                    chrome.app.window.create('screen.html', winopp, function (win) {
                        var wv = win.contentWindow.document.getElementById('webview');
                        if (wv) {
                            wv.setAttribute('src', domain + option.file);
                            if (option.bounds.width && option.bounds.height) {
                                wv.setAttribute('style', "width: " + option.bounds.width
                                        + "px; height: " + +"px;");
                            }
                        }
                        else {
                            win.contentWindow.onload = function () {
                                var wv = this.document.getElementById('webview');
                                if (wv) {
                                    wv.setAttribute('src', domain + option.file);
                                    if (option.bounds.width && option.bounds.height)
                                        wv.setAttribute('style', "width: " + option.bounds.width
                                                + "px; height: " + option.bounds.height + "px;");
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

Background.prototype.buildArg = function (msg) {
    var it = msg.indexOf(':');
    if (it >= 0 && (it + 1) < msg.length)
        return {id: msg.substring(0, it), arg: msg.substring(it + 1)};
    return {id: msg};
}

Background.prototype.launch = function (launchData) {

    var this_ = this;
    this.windows_ = {};
    this.cofiguration = {};
    this.cofiguration.domains = [];
    this.cofiguration.configDoc = null;

    this.loadConfiguration();

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        var msg = this_.buildArg(message);
        var body = message.arg;
        var bodyob;
        try {
            bodyob = JSON.parse(body);
        }
        catch (exception) {
            bodyob = {};
        }
        switch (msg.id) {
            case  '$$exit' :
                this_.$$exit();
                break;
            case  'formopen':
                this_.formOpen(msg.arg);
                break;
            case  'formclose':
                this_.formHide(msg.arg);
                break;
            case  'formhide':
                this_.formHide(msg.arg);
                break;
            default:
            {
                this_.allBroadcast(message);
            }
        }
    });

};


Background.prototype.$$exit = function (name) {
    for (var key in this.windows_)
        this.windows_[key].close();
    this.windows_ = {};
}

Background.prototype.formOpen = function (name) {
    if (this.windows_ && this.windows_[name]) {
        this.windows_[name].show();
        this.windows_[name].focus();
    }
    else {
        if (!this.formFindandOpen(name))
            console.log("form for open", name, ' not found');
    }
}

Background.prototype.formFindandOpen = function (name) {
    for (var i = 0; i < this.cofiguration.domains.length; i++) {
        if (this.cofiguration.domains[i].forms[name]) {
            var url = this.cofiguration.domains[i].url;
            var form = this.cofiguration.domains[i].forms[name]
            var options = {
                name: name,
                file: form.file,
                hidden: form.hidden ? true : undefined,
                bounds: form.bounds
            }
            this.windowOpen(options, url);
            return true;
        }
    }
}

Background.prototype.formClose = function (name) {
    if (this.windows_ && this.windows_[name]) {
        this.windows_[name].close();
        delete this.windows_[name];
    }
    else {
        console.log("form for close", name, ' not found');
    }
}

Background.prototype.formHide = function (name) {
    if (this.windows_ && this.windows_[name]) {
        this.windows_[name].hide();
    }
    else {
        console.log("form for hide", name, ' not found');
    }
}

Background.prototype.allBroadcast = function (message) {
    for (var key in this.windows_)
        if (this.windows_[key].contentWindow)
            this.windows_[key].contentWindow.postMessage(message, '*');
    console.log('neen broadcast message', message);
}

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
    this.calculateBounds(domfrm, form);
}

Background.prototype.calculateBounds = function (domfrm, form) {
    var scrwidth = window.screen.width;
    var scrheight = window.screen.height;
    var bounds = {};
    for (var k in form.attributes) {
        switch (form.attributes[k].name) {
            case 'left':
                var left = this.calculateBound(form.attributes[k].value, scrwidth);
                if (left || left == 0)
                    bounds.left = left;
                break;
            case 'top':
                var top = this.calculateBound(form.attributes[k].value, scrheight);
                if (top || top == 0)
                    bounds.top = top;
                break;
            case 'width':
                var width = this.calculateBound(form.attributes[k].value, scrwidth);
                if (width || width == 0)
                    bounds.width = width;
                break;
            case 'height':
                var height = this.calculateBound(form.attributes[k].value, scrheight);
                if (height || height == 0)
                    bounds.height = height;
                break;
        }
    }
    domfrm['bounds'] = bounds;
}


Background.prototype.calculateBound = function (mdem, fulldem) {
    var res = mdem.toString().trim();
    if ((res.length > 1) && (res.substring(res.length - 1) == '%'))
        res = parseInt(res.substring(0, res.length - 1)) * fulldem / 100;
    else if ((res.length > 2) && (res.substring(res.length - 2) == 'px'))
        res = parseInt(res.substring(0, res.length - 2));
    else
        res = parseInt(res);
    return (res || res == 0) ? res : undefined;
}


var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launch.bind(background));

/* Exports */
window['background'] = background;
Background.prototype['onWindowReady'] = Background.prototype.onWindowReady;
Background.prototype['newWindow'] = Background.prototype.newWindow;
