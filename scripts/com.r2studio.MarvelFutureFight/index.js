function TaskController(){this.tasks={},this.isRunning=!1,this.interval=200}TaskController.prototype.getFirstPriorityTaskName=function(){var t=null,n=Date.now();for(var s in this.tasks){var o=this.tasks[s];n-o.lastRunTime<o.interval||(null!==t?o.priority<t.priority?t=o:o.interval>t.interval?t=o:o.lastRunTime<t.lastRunTime&&(t=o):t=o)}return null===t?"":t.name},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=this.getFirstPriorityTaskName(),n=this.tasks[t];void 0!==n&&(n.run(),n.lastRunTime=Date.now(),0===--n.runTimes&&delete this.tasks[t]),sleep(this.interval)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.updateRunInterval=function(t){t<this.interval&&t>=50&&(this.interval=t)},TaskController.prototype.newTaskObject=function(t,n,s,o,i){return{name:t,run:n,interval:s||1e3,runTimes:o||0,priority:i,lastRunTime:0,status:0}},TaskController.prototype.newTask=function(t,n,s,o,i){void 0===i&&(i=!1);{if("function"==typeof n){var e=this.newTaskObject(t,n,s,o,0);i&&(e.lastRunTime=Date.now()),this.updateRunInterval(e.interval);var r="system_newTask_"+t,a=this.newTaskObject(r,function(){this.tasks[t]=e}.bind(this),0,1,-20);return this.tasks[r]=a,e}console.log("Error not a function",t,n)}},TaskController.prototype.removeTask=function(t){var n="system_removeTask_"+Date.now().toString(),s=this.newTaskObject(n,function(){delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[n]=s},TaskController.prototype.removeAllTasks=function(){var t="system_removeAllTask_"+Date.now().toString(),n=this.newTaskObject(t,function(){for(var t in this.tasks)delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[t]=n},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning&&(this.isRunning=!1,console.log("wait loop stop..."))};
function RBM(t){void 0==t&&(t=DEFAULT_CONFIG),this.appName=t.appName||DEFAULT_CONFIG.appName,this.oriScreenWidth=t.oriScreenWidth||DEFAULT_CONFIG.oriScreenWidth,this.oriScreenHeight=t.oriScreenHeight||DEFAULT_CONFIG.oriScreenHeight,this.oriVirtualButtonHeight=t.oriVirtualButtonHeight||DEFAULT_CONFIG.oriVirtualButtonHeight,this.oriAppWidth=this.oriScreenWidth,this.oriAppHeight=this.oriScreenHeight-this.oriVirtualButtonHeight,this.oriResizeFactor=t.oriResizeFactor||DEFAULT_CONFIG.oriResizeFactor,this.resizeFactor=t.resizeFactor||DEFAULT_CONFIG.resizeFactor,this.imageThreshold=t.imageThreshold||DEFAULT_CONFIG.imageThreshold,this.imageQuality=t.imageQuality||DEFAULT_CONFIG.imageQuality,this.screenWidth=0,this.screenHeight=0,this.resizeScreenWidth=0,this.resizeScreenHeight=0,this.appWidth=0,this.appHeight=0,this.appMinRatio=1,this.appMaxRatio=1,this.researchTimes=5,this.virtualButtonHeight=0,this.ip="",this.during=t.eventDelay||DEFAULT_CONFIG.eventDelay,this.running=!0,this._screenshotImg=0,this.init()}var DEFAULT_CONFIG={appName:"testApp",oriScreenWidth:1080,oriScreenHeight:1920,oriVirtualButtonHeight:0,oriResizeFactor:.4,eventDelay:200,imageThreshold:.85,imageQuality:80,resizeFactor:.4};RBM.prototype.init=function(){var t=getScreenSize();this.screenWidth=t.width,this.screenHeight=t.height,this.virtualButtonHeight=getVirtualButtonHeight(),this.appWidth=this.screenWidth,0!==this.oriVirtualButtonHeight?this.appHeight=this.screenHeight-this.virtualButtonHeight:this.appHeight=this.screenHeight,this.resizeAppWidth=this.appWidth*this.resizeFactor,this.resizeAppHeight=this.appHeight*this.resizeFactor;var i=this.appWidth/this.oriAppWidth,e=this.appHeight/this.oriAppHeight;this.appMinRatio=Math.min(i,e),this.appMaxRatio=Math.max(i,e)},RBM.prototype.log=function(){sleep(10);for(var t=0;t<arguments.length;t++)"object"==typeof arguments[t]&&(arguments[t]=JSON.stringify(arguments[t]));console.log.apply(console,arguments)},RBM.prototype.mappingImageWHs=function(t){var i=[];if(this.appMinRatio===this.appMaxRatio)i.push({width:t.width*this.appMinRatio,height:t.height*this.appMinRatio});else for(var e=(this.appMaxRatio-this.appMinRatio)/this.researchTimes,h=this.appMinRatio;h<=this.appMaxRatio;h+=e)i.push({width:t.width*h,height:t.height*h});return i},RBM.prototype.mappingXY=function(t){var i=Math.round(t.x*this.appWidth/this.oriAppWidth),e=Math.round(t.y*this.appHeight/this.oriAppHeight);return{x:i,y:e}},RBM.prototype.getImagePath=function(){return getStoragePath()+"/scripts/"+this.appName+"/images"},RBM.prototype.startApp=function(t,i){void 0===i?execute("monkey -p "+t+" -c android.intent.category.LAUNCHER 1"):execute("am start -n "+t+"/"+i)},RBM.prototype.stopApp=function(t){execute("am force-stop "+t)},RBM.prototype.currentApp=function(){var t=execute("dumpsys activity activities").split("mFocusedActivity")[1].split(" ")[3].split("/"),i=t[0],e=t[1];return{packageName:i,activityName:e}},RBM.prototype.click=function(t){t=this.mappingXY(t),tap(t.x,t.y,this.during)},RBM.prototype.tapDown=function(t){t=this.mappingXY(t),tapDown(t.x,t.y,this.during)},RBM.prototype.moveTo=function(t){t=this.mappingXY(t),moveTo(t.x,t.y,this.during)},RBM.prototype.tapUp=function(t){t=this.mappingXY(t),tapUp(t.x,t.y,this.during)},RBM.prototype.swipe=function(t,i,e){void 0===e&&(e=5),t=this.mappingXY(t),i=this.mappingXY(i);var h=this.during/(e+2),s=(t.x-i.x)/e,a=(t.y-i.y)/e;tapDown(t.x,t.y,h);for(var r=0;e>=r;r++)moveTo(t.x+r*s,t.y+r*a,h);tapUp(i.x,i.y,h)},RBM.prototype.screenshot=function(t){var i=this.getImagePath()+"/"+t,e=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);saveImage(e,i),releaseImage(e)},RBM.prototype.screencrop=function(t,i,e,h,s){var a=this.getImagePath()+"/"+t,r=Math.abs(h-i),o=Math.abs(s-e),p=getScreenshotModify(Math.min(i,h),Math.min(e,s),r,o,r*this.resizeFactor,o*this.resizeFactor,this.imageQuality);saveImage(p,a),releaseImage(p)},RBM.prototype.findImage=function(t,i){void 0===i&&(i=this.imageThreshold);var e=0;e=0!=this._screenshotImg?this._screenshotImg:getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);var h=this.getImagePath()+"/"+t,s=openImage(h);if(0===s)return this.log("Image is not found: ",h),void releaseImage(e);for(var a=getImageSize(s),r=this.mappingImageWHs(a),o=void 0,p=0;p<r.length;p++){var n=r[p];n.width*=this.resizeFactor/this.oriResizeFactor,n.height*=this.resizeFactor/this.oriResizeFactor;var g=resizeImage(s,n.width,n.height);if(o=findImage(e,g),o.width=n.width,o.height=n.height,releaseImage(g),o.score>=i)break;o=void 0}return releaseImage(s),releaseImage(e),o},RBM.prototype.imageExists=function(t,i){var e=this.findImage(t,i);return void 0===e?!1:!0},RBM.prototype.imageClick=function(t,i){var e=this.findImage(t,i);if(void 0!==e){var h=(e.x+e.width/2)*this.appWidth/this.resizeAppWidth,s=(e.y+e.height/2)*this.appHeight/this.resizeAppHeight;tap(h,s,this.during)}},RBM.prototype.imageWaitClick=function(t){void 0===t&&(t=1e4);for(var i=Date.now();this.running;){var e=this.findImage(filename,threshold);if(void 0!==e){var h=Math.round(e.x*this.appWidth/this.resizeAppWidth),s=Math.round(e.y*this.appHeight/this.resizeAppHeight);tap(h,s,this.during);break}if(sleep(3*this.during),Date.now()-i>t)break}},RBM.prototype.imageWaitShow=function(t){void 0===t&&(t=1e4);for(var i=Date.now();this.running;){var e=this.findImage(filename,threshold);if(void 0!==e)break;if(sleep(3*this.during),Date.now()-i>t)break}},RBM.prototype.imageWaitGone=function(t){void 0===t&&(t=1e4);for(var i=Date.now();this.running;){var e=this.findImage(filename,threshold);if(void 0===e)break;if(sleep(3*this.during),Date.now()-i>t)break}},RBM.prototype.keepScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0),this._screenshotImg=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality)},RBM.prototype.releaseScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0)},RBM.prototype.typing=function(t){typing(label,this.during)},RBM.prototype.keycode=function(t){keycode(t,this.during)},RBM.prototype.sleep=function(){sleep(this.during)};

var Config = {
  autoSameWar: false,
  autoNextWar: false,
  appName: 'com.r2studio.MarvelFutureFight',
  oriScreenWidth: 1920,
  oriScreenHeight: 1080,
  oriResizeFactor: 0.5,
  eventDelay: 1000,
  resizeFactor: 0.5,
  imageThreshold: 0.95,
};

function MarvelFutureFight() {}

MarvelFutureFight.prototype.click = function(image) {
  if (rbm.imageExists(image)) {
    rbm.imageClick(image);
    return true;
  }
  return false;
}

MarvelFutureFight.prototype.taskAutoStart = function() {
  if (this.click("StartButton.png")) {
    rbm.log('開始(綠色)');
    return;
  }

  if (Config.autoSameWar && this.click("FightAgainButton.png")) {
    rbm.log('打同一關');
    return;
  } else if (Config.autoNextWar && this.click("FightNextButton.png")) {
    rbm.log('打下一關');
    return;
  }

  if (this.click("SkipButton.png")) {
    rbm.log('跳過');
    return;
  }

  if (rbm.imageExists("RedCloseButton.png")) {
    rbm.keycode('BACK');
    rbm.log('關閉(紅色)');
    return;
  }

  if (this.click("ConfirmButton.png")) {
    rbm.log('確認(藍色)');
    return;
  }

  if (this.click("FightExitButtonSmall.png")) {
    rbm.log('離開(小)');
    return;
  }

  if (this.click("CancelButton.png")) {
    rbm.log('取消');
    return;
  }
}

MarvelFutureFight.prototype.taskAttack = function() {
  if (this.click("FightButton.png")) {
    rbm.log('自動攻擊');
    // 隨機技能攻擊
    var screenWidth = Config.oriScreenWidth;
    var screenHeight = Config.oriScreenHeight;
    var diff = 140;
    for (var y = screenHeight; y > screenHeight - diff * 3; y -= diff) {
      for (var x = screenWidth; x > screenWidth - diff * 4; x -= diff) {
        if (!rbm.running) {
          return;
        }
        rbm.click({x: x - diff / 2, y: y - diff / 2}, 1000);
      }
    }
    return;
  }
}

// ===================================================================================
var rbm;
var mff;

function stop() {
  console.log('[MARVEL 未來之戰] 停止');
  Config.autoNextWar = false;
  Config.autoSameWar = false;
  rbm.running = false;
  sleep(1000);
  gTaskController.removeAllTasks();
}

function start(taskAttack, autoSameWar, autoNextWar) {
  console.log('[MARVEL 未來之戰] 啟動');
  Config.autoSameWar = autoSameWar;
  Config.autoNextWar = autoNextWar;

  rbm = new RBM(Config);
  mff = new MarvelFutureFight();
  gTaskController = new TaskController();
  if(autoSameWar || autoNextWar){gTaskController.newTask('taskAutoStart', mff.taskAutoStart.bind(mff), 1000, 0);}
  if(taskAttack){gTaskController.newTask('taskAttack', mff.taskAttack.bind(mff), 500, 0);}

  sleep(1000);
  gTaskController.start();
};
// start(true, false, false);
// stop();

// rbm.screencrop("FightButton.png", 1700, 845, 1810, 955);
// rbm.screencrop("FightExitButtonSmall.png", 1800, 970, 1890, 1040); // 發現英雄或進階完成
// rbm.screencrop("FightNextButton.png", 1640, 960, 1870, 1040);
// rbm.screencrop("FightAgainButton.png", 1370, 960, 1600, 1040);
// rbm.screencrop("StartButton.png", 1450, 985, 1730, 1050);
// rbm.screencrop("SkipButton.png", 1680, 30, 1890, 100);
// rbm.screencrop("RedCloseButton.png", 1630, 120, 1690, 180); // 商品
// rbm.screencrop("ConfirmButton.png", 820, 960, 1090, 1030); // 神盾局升級或英雄等級提升
// rbm.screencrop("CancelButton.png", 520, 920, 800, 990); // 英雄進階