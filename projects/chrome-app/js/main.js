/**
 * @constructor
 */
function Background() {
  this.entriesToOpen_ = [];
  this.windows_ = [];
}

/**
 * @return {boolean}
 * True if the system window frame should be shown. It is on the systems where
 * borderless window can't be dragged or resized.
 */
Background.prototype.ifShowFrame_ = function() {
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

Background.prototype.newWindow = function() {
    
  var options1 = {
    id: 'appWindowId001',
    frame: (this.ifShowFrame_() ? 'chrome' : 'none'),
        top: 0,
        left: 0,
        width: 1920,
        height: 1080
  };

  chrome.app.window.create('screen1.html', options1, function(win) {
    console.log('Window opened:', win);
    win.onClosed.addListener(this.onWindowClosed.bind(this, win));
  }.bind(this));

 /* var options2 = {
    id: 'appWindowId002',
    frame: (this.ifShowFrame_() ? 'chrome' : 'none'),
        top: 0,
        left: 1920,
        width: 1920,
        height: 1080
  };

  chrome.app.window.create('screen2.html', options2, function(win) {
    console.log('Window opened:', win);
    win.onClosed.addListener(this.onWindowClosed.bind(this, win));
  }.bind(this));*/    
};


Background.prototype.launch = function(launchData) {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        //alert("message received to background =", message);
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

  if (this.windows_.length == 0)
    this.newWindow();

};



/**
 * @param {Window} win
 * Handle onClosed.
 */
Background.prototype.onWindowClosed = function(win) {
  console.log('Window closed:', win);
};


/**
 * @param {TextApp} textApp
 * Called by the TextApp object in the window when the window is ready.
 */
Background.prototype.onWindowReady = function(textApp) {
};

/**
 * @param {FileEntry} entry
 * @param {function(FileEntry)} callback
 * Make a copy of a file entry.
 */
Background.prototype.copyFileEntry = function(entry, callback) {
  chrome.fileSystem.getWritableEntry(entry, callback);
};

var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launch.bind(background));

/* Exports */
window['background'] = background;
Background.prototype['onWindowReady'] = Background.prototype.onWindowReady;
Background.prototype['newWindow'] = Background.prototype.newWindow;
