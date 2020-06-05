var timer = null;
var rmn;
class Block {
  constructor(nr) {
    const step = g.getWidth()/4;
    const yc = g.getHeight()-15;
    this.mnsize = step/2;
    this.hrsize = (step-10)/2;
    if(nr<4) {
      this.xpos = 3.5*step;
      this.ypos = yc-(nr-0.5)*step;
    } else if(nr<7) {
      this.xpos = 2.5*step;
      this.ypos = yc-(nr-3.5)*step;
    } else if(nr<10) {
      this.xpos = 1.5*step;
      this.ypos = yc-(nr-6.5)*step;
    } else if(nr<15) {
      this.xpos = 0.5*step;
      this.ypos = yc-(nr-9.5)*step;
    }
    this.hractive = false;
    this.mnactive = false;
    this.clrpassive = "#000000";
    this.clrhractive = "#DECECE";
    this.clrmnactive = "#FFFFFF";
    this.stext="";
  }
  draw() {
    var textcolor;
    if(this.mnactive) {
      g.setColor(this.clrmnactive);
    } else {
      g.setColor(this.clrpassive);
    }
    g.fillRect(this.xpos-this.mnsize,this.ypos-this.mnsize,this.xpos+this.mnsize,this.ypos+this.mnsize);
    if(this.hractive) {
      g.setColor(this.clrhractive);
      txtcolor = this.clrpassive;
    } else {
      g.setColor(this.clrpassive);
      txtcolor = this.clrmnactive;
    }
    g.fillRect(this.xpos-this.hrsize,this.ypos-this.hrsize,this.xpos+this.hrsize,this.ypos+this.hrsize);
    if(this.stext.length>0) {
      g.setColor(txtcolor);
      g.setFont("Vector",30);
      const fy = g.getFontHeight()/2;
      const fx = g.stringWidth(this.stext)/2;
      g.drawString(this.stext, this.xpos-fx, this.ypos-fy, false); 
      this.stext="";
    }   
  } 
  text(ht) {
    this.stext = ht;
  }
}

function ui () {
  Bangle.loadWidgets();
  var showhr=true;
  var hrold = 99;
  var mnold = 99;
  var mn5old = 99;
  var seold = 99;
  var bl = new Array(12);
  for(var k=1; k<13; k++) {
    bl[k] = new Block(k);
  }
  function runit() {
    var now = new Date();
    var hr = now.getHours();
    var hrnew = hr;
    var mnnew = now.getMinutes();
    var senew = now.getSeconds();
    var mn5new = Math.floor(mnnew/5);
    if(hrnew>=12) hrnew=hrnew-12;
//    if(hrnew===0) hrnew=12;
    if(hrnew!=hrold || mn5new!=mn5old || mnnew!=mnold) {
      g.clear();
      Bangle.drawWidgets();
      for(var i=1; i<bl.length; i++) {
        if(i<=hrnew) {
          bl[i].hractive = true;
        } else {
          bl[i].hractive = false;
        }
        if(i===hrnew && showhr) bl[i].text(hrnew.toFixed(0));
        if(i<=mn5new) { 
          bl[i].mnactive = true;
        } else {
          bl[i].mnactive = false;
        }
        mp = 1+Math.floor(Math.random()*12);
        if(mp===hrnew) {
          if(mp>1) {
            mp=mp-1;
          } else {
            mp=mp+1;
          }
        }
      }
      if(mnnew!=mnold) {
        rmn = mnnew-Math.floor(mnnew/5)*5;
        if(rmn!=0) {
          bl[mp].text(rmn.toFixed(0));
        }
      }
      bl[8].draw();
      bl[5].draw();
      bl[10].draw();
      bl[3].draw();
      bl[11].draw();
      bl[2].draw();
      bl[7].draw();
      bl[6].draw();
      bl[4].draw();
      bl[9].draw();
      bl[1].draw();
      bl[12].draw();
    }
    hrold=hrnew;
    mnold=mnnew;
    mn5old= mn5new;
    bl[12].mnactive=false;
    if(senew!=seold) {
      bl[12].hractive=!bl[12].hractive;
      if(hr>12) bl[12].mnactive=!bl[12].hractive;
      if(hrnew===12) bl[12].text(hrnew.toFixed(0));
      if(mp===12 && rmn!=0) bl[12].text(rmn.toFixed(0));
      bl[12].draw();
    }
  }
  Bangle.on('lcdPower', function(on) {
    if (on) {
      runit();
      timer = setInterval(runit,1000);
    } else {
      if(timer) clearInterval(timer);
    }
  });
  Bangle.on('touch', function(button) {
    if(button===2) showhr=!showhr; 
      mnold=99;
      runit();
  });
  runit();
  timer = setInterval(runit,1000);
}
ui();
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
