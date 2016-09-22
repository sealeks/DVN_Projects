/*    */


var simulator = {};


// initializer

simulator.expressionevent = function(handler, source, root){
    this.handler = handler;
    this.source = source;
    this.window=window;
    this.root=root;
    this.documentElement=window.document.documentElement;
    this.create();
    this.regist();
    
}

simulator.expressionevent.prototype.create = function(){
    this.element= this.documentElement.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.documentElement.appendChild(this.element);
}

simulator.expressionevent.prototype.regist = function(){
    var ts= this.root;
    //console.log('---',this.element,this.handler , this.source);
    if (this.element.addExpressionListener( this.handler , this.source))
        this.sourceset=true; 
    else
        console.log('AddExpressionListener source no regist');    
}

simulator.expressionevent.prototype.unregist = function(){
    if (this.element && this.handler && this.sourceset){
        this.element.removeExpressionListener( this.handler);
        if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
      }
}


simulator.initializer = function(tag ,start , stop){
    
  this.tag = tag;
  //if (start || start==0){
      this.valid = true;
      this.start = start;
  //}
  //if (stop || stop==0)
        this.stop = stop;
  if (this.valid){
      this.atach();
  }   
}

simulator.initializer.prototype.atach = function(){
    if (this.valid && (this.start || this.start==0 || this.start===null)) {
       window.$$(this.tag + ' @= ' + (this.start===null ? 'null' : this.start).toString());}
}


simulator.initializer.prototype.detach = function(){
    if (this.valid && (this.stop || this.stop==0 || this.stop===null)) {
       window.$$(this.tag + ' @= ' + (this.stop===null ? 'null' : this.stop).toString());}
}

simulator.initializer.prototype.execute = function(){
 
}


// casevalue

simulator.valueobserver = function(tag ,start , source ,stop){
  this.tag = tag;
  if (source){
      this.valid = true;
      this.source = source;
  }
  //if (start || start==0)
  this.start = start;
  //if (stop || start==0)
  this.stop = stop;    
  if (this.valid){
      this.atach();
  }     
}

simulator.valueobserver.prototype.atach = function(){
    if (this.valid && (this.start || this.start==0 || this.start===null)) {
       window.$$(this.tag + ' @= ' + (this.start===null ? 'null' : this.start).toString());}
}


simulator.valueobserver.prototype.detach = function(){
    if (this.valid && (this.stop || this.stop==0 || this.stop===null)) {
       window.$$(this.tag + ' @= ' + (this.stop===null ? 'null' : this.stop).toString());}
}

simulator.valueobserver.prototype.execute = function(){
    $$(' ' + this.tag + ' @= (' + this.source + ')');
}


// delayer

simulator.booldelayer = function(tag ,start , source ,stop, onvalue, offvalue, ontimeout, offtimeout){
  this.tag = tag;
  if (source && onvalue || offvalue){
      this.valid = true;
      this.source = source;
      this.onvalue = onvalue;
      this.offvalue = offvalue;
  }
  this.ontimeout = ontimeout ? ontimeout : 1000;
  this.offtimeout = offtimeout ? offtimeout : 1000;
  //if (start || start==0)
        this.start = start;
  //if (stop || start==0)
        this.stop = stop;    
  if (this.valid){
      this.atach();
  }     
}

simulator.booldelayer.prototype.atach = function(){
    
    var ts =this;
    if (this.source){
        this.sourcehandler = function(){
            ts.sourceevent(event);
        };
        this.sourceset = new simulator.expressionevent(this.sourcehandler , this.source, this);
    }
    
    if (this.valid && (this.start || this.start==0 || this.start===null)) {
       window.$$(this.tag + ' @= ' + (this.start===null ? 'null' : this.start).toString());}
}


simulator.booldelayer.prototype.detach = function(){
    if (this.valid && (this.stop || this.stop==0 || this.stop===null)) {
       window.$$(this.tag + ' @= ' + (this.stop===null ? 'null' : this.stop).toString());}
    if (this.sourcehandler && this.sourceset)
        this.sourceset.unregist();
}

simulator.booldelayer.prototype.execute = function(){
    
}

simulator.booldelayer.prototype.sourceevent = function(){
    if (event.expression==this.source && event.valid){     
        var ts = this;
        if (event.value && this.onvalue!==undefined && !ts.state)
        setTimeout(function(){console.log('on delay fire');$$(ts.tag +' @= '+ts.onvalue);ts.state = 1;}, ts.ontimeout );
        if (!event.value && this.offvalue!==undefined && ts.state)
        setTimeout(function(){console.log('off delay fire');$$(ts.tag +' @= '+ts.offvalue);ts.state = 0;},ts.offtimeout);
}    
}


// differeciator

simulator.differeciator = function(tag ,start , source ,stop){
  this.tag = tag;
  if (source){
      this.valid = true;
      this.source = source;
  }
  //if (start || start==0)
        this.start = start;
  //if (stop || start==0)
        this.stop = stop;    
  if (this.valid){
      this.atach();
  }     
}

simulator.differeciator.prototype.atach = function(){
 
    if (this.valid && (this.start || this.start==0 || this.start===null)) {
       window.$$(this.tag + ' @= ' + (this.start===null ? 'null' : this.start).toString());}
 
    var ts = this;
    
    this.diffhandler = function(){ts.diffevent(event);};
    this.diffset = new simulator.expressionevent( this.diffhandler , this.source, this);
}


simulator.differeciator.prototype.detach = function(){
    if (this.valid && (this.stop || this.stop==0 || this.stop===null)) {
       window.$$(this.tag + ' @= ' + (this.stop===null ? 'null' : this.stop).toString());}
    if (this.diffhandler && this.diffset)
        //window.removeExpressionListener( this.autohandler);
        this.diffset.unregist();    
}

simulator.differeciator.prototype.execute = function(){
   
}

simulator.differeciator.prototype.diffevent = function(event){
    var ts = this;
    if (event.valid){
       setTimeout(function(){$$(ts.tag + ' @= ' + event.value);},0);
       //console.log(this.tag,event.value);
        }      
}


// random_value

simulator.random_value = function(tag ,mediana, deviation){
  this.tag = tag;

  this.valid = true;
  this.mediana = mediana ? mediana : 0.5;
  this.deviation = deviation ? deviation : 0.005;
  if (this.valid){
      this.atach();
  }     
}

simulator.random_value.prototype.atach = function(){
    
    var ts = this;
    $$(ts.tag + ' @= (' + ts.mediana + ' )');
 
    
    
    /*this.diffhandler = function(){ts.diffevent(event);};
    if (window.addExpressionListener( this.diffhandler , this.source))
        this.diffset=true; 
    else
       console.log('AddExpressionListener source no regist');*/
}


simulator.random_value.prototype.detach = function(){

       $$(this.tag + ' @= 0')
    /*if (this.diffhandler && this.diffset)
        window.removeExpressionListener( this.autohandler);*/
}

simulator.random_value.prototype.execute = function(){
    var ts = this;
    $$(ts.tag + ' @= ( ' + ts.tag + ' + ('+ts.tag + '.maxeu - '+ts.tag + '.mineu) * '+ts.deviation + '* (rnd()*2-1)/2)');
}

/*simulator.random_value.prototype.diffevent = function(event){
    var ts = this;
    if (event.expression==this.source){
       setTimeout(function(){$$(ts.tag + ' @= ' + event.value);},0);
       //console.log(this.tag,event.value);
        }      
}*/


// differeciator

simulator.inertial_differeciator = function(tag,  period ,start , source ,stop, delay, count){
  this.tag = tag;
  if (source){
      this.valid = true;
      this.source = source;
      this.period=period /7;
  }
  this.delay = delay ? delay : 1000;
  if (this.delay<100) this.delay=100;
  this.count = count ? count : 7;
  var dt = new Date();
  this.lasttime = dt.getTime() + 0;
  //if (start || start==0)
        this.start = start;
  //if (stop || start==0)
        this.stop = stop;    
  if (this.valid){
      this.atach();
  
  }     
  if (this.count<3) this.count=3;
  if (this.count>99) this.count=99;
  if (this.count % 2) this.count=this.count+1;

  this.values=[];
  for (var i=0;i<this.count;++i)
      this.values.push(0);
  this.mediana =   (this.count-1) / 2;
  
  this.koef = 2;
  var hh =0.5;
  for (var k=1;k<this.mediana;++k){
      this.koef = this.koef + hh;
      hh = hh / 2;
  }
  this.koef = 1 /this.koef;
  this.id=0;
  this.current=0;
}

simulator.inertial_differeciator.prototype.add = function(i, val){
    this.values[(this.current+i)<this.values.length ? this.current+i: i+this.current-this.values.length]= 
        this.values[(this.current+i)<this.values.length ? this.current+i: i+this.current-this.values.length] + val;
}

simulator.inertial_differeciator.prototype.get= function(){
    return this.values[this.current];
}

simulator.inertial_differeciator.prototype.clear= function(){
    this.values[this.current]=0;
}

simulator.inertial_differeciator.prototype.inc= function(){
    this.current = (this.current+1)<this.values.length ? this.current+1 : 0;
}

simulator.inertial_differeciator.prototype.set= function(){
    
    for (var i=0;i<this.values.length;i++){
        var valport = this.koef / Math.pow (2,((i-this.mediana) < 0  ? (this.mediana-i) : (i-this.mediana))) * this.value /* (1000 / this.delay)*/;
        this.add(i,valport)       
    }
    var curr = this.get();
    this.clear();
    this.inc();
    return curr;
}


simulator.inertial_differeciator.prototype.atach = function(){
 
    if (this.valid && (this.start || this.start==0 || this.start===null)) {
       window.$$(this.tag + ' @= ' + (this.start===null ? 'null' : this.start).toString());}
 
    var ts = this;
    
    this.diffhandler = function(){ts.diffevent(event);};
    this.diffset = new simulator.expressionevent( this.diffhandler , this.source, this);
}


simulator.inertial_differeciator.prototype.detach = function(){
    if (this.valid && (this.stop || this.stop==0 || this.stop===null)) {
       window.$$(this.tag + ' @= ' + (this.stop===null ? 'null' : this.stop).toString());}
    if (this.diffhandler && this.diffset)
        this.diffset.unregist();
}

simulator.inertial_differeciator.prototype.execute = function(){
   var ts = this;
       var dt = new Date();
       var curtime = dt.getTime() + 0;
       if ((this.lasttime+this.delay)<=curtime){
       this.lasttime=curtime;
       var val = this.set(this.value);
       setTimeout(function(){$$(ts.tag + ' @= ' + val );}, 0);
       }
}

simulator.inertial_differeciator.prototype.diffevent = function(event){
    if (event.valid){       
       this.value = event.value;}      
}



// simulator.valvle
simulator.valve_init  = function(state, on, off, don, doff, ron, roff, timeopen, timeclose , auto){
   if (on) add_simulation ( new simulator.initializer(on , state==1 ? 1 : 0 , null));
   if (off) add_simulation ( new simulator.initializer(off , state==2 ? 1 : 0 , null));
   if (don) add_simulation ( new simulator.initializer(don , 0 , null));
   if (doff) add_simulation ( new simulator.initializer(doff , 0 , null));
   if (ron) add_simulation ( new simulator.initializer(ron , 0 , null));
   if (roff) add_simulation ( new simulator.initializer(roff , 0 , null));
   if (auto) add_simulation ( new simulator.initializer(auto , 0 , null));
   var valve_ = new simulator.valve(on, off  , don, doff , ron, roff , timeopen, timeclose );
   add_simulation (valve_);
   return valve_;
}

simulator.valve  = function(on, off, don, doff, ron, roff, timeopen, timeclose , initpos){
    this.on= on;
    this.off=off;
    this.don= don;
    this.doff=doff; 
    this.ron= ron;
    this.roff=roff;  
    this.timeopen= timeopen!==undefined ? timeopen : 10000;
    this.timeclose= timeclose!==undefined ? timeclose : 10000; 
    this.timeopen= this.timeopen>50 ? this.timeopen : 50;
    this.timeclose= this.timeclose>50 ? this.timeclose : 50;     
    this.initpos= this.initpos ? this.initpos : 0; 
    this.state = 0;
    this.atach();
}

simulator.valve.prototype.atach = function(){
      
    var ts =this;
    if (this.ron){
        this.ronhandler = function(){
            ts.ronevent(event);
        };
        this.ronset = new simulator.expressionevent(this.ronhandler , this.ron, this);
    }
    
    if (this.roff){
        this.roffhandler = function(){
            ts.roffevent(event);
        };
        this.roffset = new simulator.expressionevent(this.roffhandler , this.roff, this);
    }
    
    if (this.don){
        this.donhandler = function(){
            ts.donevent(event);
        };
        this.donset = new simulator.expressionevent(this.donhandler , this.don, this);
    }
    
    if (this.doff){
        this.doffhandler = function(){
            ts.doffevent(event);
        };
        this.doffset = new simulator.expressionevent(this.doffhandler , this.doff, this);
    }
    
    if (this.on){
        this.onhandler = function(){
            ts.onevent(event);
        };
        this.onset = new simulator.expressionevent(this.onhandler , this.on, this);
    }
    
    if (this.off){
        this.offhandler = function(){
            ts.offevent(event);
        };
        this.offset = new simulator.expressionevent(this.offhandler , this.off, this);
    }    
   
}

simulator.valve.prototype.detach = function(){
    if (this.ronhandler && this.ronset)
        this.ronset.unregist();//window.removeExpressionListener( this.ronhandler);
    if (this.roffhandler && this.roffset)
        this.roffset.unregist();//window.removeExpressionListener( this.roffhandler);
    if (this.donhandler && this.donset)
        this.donset.unregist();//window.removeExpressionListener( this.donhandler);
    if (this.doffhandler && this.doffset)
        this.doffset.unregist();//window.removeExpressionListener( this.doffhandler);
    if (this.onhandler && this.onset)
        this.onset.unregist();//window.removeExpressionListener( this.onhandler);
    if (this.offhandler && this.offset)
        this.offset.unregist();//window.removeExpressionListener( this.offhandler);    
}


simulator.valve.prototype.ronevent = function(event){
    if (event.expression==this.ron && event.valid){     
        var ts = this;
        if (event.value && !this._ron){
            
           this._ron=1;
           
           // Есть don или doff
            if (ts.don || ts.doff){
                setTimeout(function(){
                    if (ts.on && ts._on){
                        $$(ts.ron + ' @= 0');
                        return;
                    }                    
                    if (ts.off && ts._off) $$(ts.off + ' @= 0');
                    if (ts.roff && ts._roff) $$(ts.roff + ' @= 0');
                    if (ts.doff && ts._doff) $$(ts.doff + ' @= 0');  
                    if (ts.don && !ts._don) $$(ts.don + ' @= 1');
                },1);
                return;
            } 
              
            // Есть  on              
            if (ts.on) {
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
                
                if (ts.roff && ts._roff){
                setTimeout(function(){
                    $$(ts.roff + ' @= 0');
                },1);} 
            
                var intervalfunc= function(){
                    if (ts.on) $$(ts.on + ' @= 1');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                this.intervalid = setInterval(intervalfunc,this.timeopen);
                return;               
            }
            
            // Есть  off
            if (ts.off) {
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
                
                if (ts.roff && ts._roff){
                    setTimeout(function(){
                        $$(ts.roff + ' @= 0');
                    },1);
                } 
            
                var intervalfunc= function(){
                    if (ts.off) $$(ts.off + ' @= 0');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                
                this.intervalid = setInterval(intervalfunc,this.timeclose);
                
                return;
            }
                        
        }
        
        
        if (!event.value && this._ron){
            
            this._ron=0;
            
            if (this.intervalid)
                clearInterval(this.intervalid);
            
            if (!ts.roff){
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
                
      
                if (ts.doff || ts.don){
                    setTimeout(function(){
                        if (ts.doff && !ts._doff) $$(ts.doff + ' @= 1');
                        if (ts.don) $$(ts.don + ' @= 0');
                    },1);
                    return ;
                }               
                
            
                var intervalfunc= function(){
                    if (ts.off) $$(ts.off + ' @= 1');
                    if (ts.on) $$(ts.on + ' @= 0');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                
                this.intervalid = setInterval(intervalfunc,this.timeclose);
                
                return;
            }
            
            if (ts.don && ts._don)
             setTimeout(function(){
                        if (ts.don) $$(ts.don + ' @= 0');},1);
            
            
        }       
    }       
}


simulator.valve.prototype.roffevent = function(event){
    if (event.expression==this.roff && event.valid){     
        var ts = this;
        if (event.value && !this._roff){
            
           this._roff=1;
           
           // Есть don или doff
            if (ts.don || ts.doff){
                setTimeout(function(){
                     if (ts.off && ts._off){
                        $$(ts.roff + ' @= 0');
                        return;
                    }    
                    if (ts.on && ts._on) $$(ts.on + ' @= 0');
                    if (ts.ron && ts._ron) $$(ts.ron + ' @= 0');
                    if (ts.don && ts._don) $$(ts.don + ' @= 0');  
                    if (ts.doff && !ts._doff) $$(ts.doff + ' @= 1');
                },1);
                return;
            } 
            
            
            // Есть  off
            if (ts.off) {
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
                
                if (ts.ron && ts._ron){
                    setTimeout(function(){
                        $$(ts.ron + ' @= 0');
                    },1);
                } 
            
                var intervalfunc= function(){
                    if (ts.off) $$(ts.off + ' @= 1');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                
                this.intervalid = setInterval(intervalfunc,this.timeclose);
                
                return;
            }
            
            // Есть  on              
            if (ts.on) {
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
                
                if (ts.ron && ts._ron){
                setTimeout(function(){
                    $$(ts.ron + ' @= 0');
                },1);} 
            
                var intervalfunc= function(){
                    if (ts.on) $$(ts.on + ' @= 0');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                this.intervalid = setInterval(intervalfunc,this.timeopen);
                return;               
            }
            
            
        }
            
        if (!event.value && this._roff){
            
            this._roff=0;
            
            if (this.intervalid)
                clearInterval(this.intervalid);
            
             if (!ts.ron){
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
                
      
                if (ts.doff || ts.don){
                    setTimeout(function(){
                        if (ts.don && !ts._don) $$(ts.don + ' @= 1');
                        if (ts.doff) $$(ts.doff + ' @= 0');
                    },1);
                    return ;
                }               
                
            
                var intervalfunc= function(){
                    if (ts.on) $$(ts.on + ' @= 1');
                    if (ts.off) $$(ts.off + ' @= 0');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                
                this.intervalid = setInterval(intervalfunc,this.timeclose);
                
                return;
            }
            
            if (ts.doff && ts._doff)
                setTimeout(function(){
                    if (ts.doff) $$(ts.doff + ' @= 0');
                },1);
        }       
    }         
}

simulator.valve.prototype.donevent = function(event){
    if (event.expression==this.don && event.valid){     
        var ts = this;
        if (event.value && !this._don){       
            this._don=1;
            if (this.intervalid)
                clearInterval(this.intervalid);
            this.intervalid=0;
            
            var intervalfunc= function(){
                if (ts.on) $$(ts.on + ' @= 1');
                this.state=0;
                if (ts.intervalid){
                    clearInterval(ts.intervalid);
                    ts.intervalid=0;
                }
            }
            this.intervalid = setInterval(intervalfunc,this.timeopen);           
        }
        if (!event.value && this._don){
            
            this._don=0;
            
            if (!ts.roff){
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
           
                          
                var intervalfunc= function(){
                    if (ts.off) $$(ts.off + ' @= 1');
                    if (ts.on) $$(ts.on + ' @= 0');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                
                this.intervalid = setInterval(intervalfunc,this.timeclose);
                
                return;
            }
        }       
    }       
}


simulator.valve.prototype.doffevent = function(event){
    if (event.expression==this.doff && event.valid){     
        var ts = this;
        if (event.value && !this._doff){
            this._doff=1; 
            if (this.intervalid)
                clearInterval(this.intervalid);
            this.intervalid=0;           
            var intervalfunc= function(){
                if (ts.on) $$(ts.on + ' @= 0');
                if (ts.off) $$(ts.off + ' @= 1');
                this.state=0;
                if (ts.intervalid){
                    clearInterval(ts.intervalid);
                    ts.intervalid=0;
                }
            }
            this.intervalid = setInterval(intervalfunc,this.timeclose);            
        }
        if (!event.value && this._doff){
            
            this._doff=0;
            
            if (!ts.ron){
                
                if (this.intervalid)
                    clearInterval(this.intervalid);
                this.intervalid=0;
           
                          
                var intervalfunc= function(){
                    if (ts.on) $$(ts.on + ' @= 1');
                    if (ts.off) $$(ts.off + ' @= 0');
                    this.state=0;
                    if (ts.intervalid){
                        clearInterval(ts.intervalid);
                        ts.intervalid=0;
                    }                
                }
                
                this.intervalid = setInterval(intervalfunc,this.timeopen);
                
                return;
            }
        }
    }         
}

simulator.valve.prototype.onevent = function(event){
    if (event.expression==this.on && event.valid){     
        var ts = this;
        if (event.value && !this._on){
           this._on=1;
           this.state=1;
            setTimeout(function(){if (ts.ron && ts._ron && ts.roff) $$(ts.ron + ' @= 0');},1);
            if (this.intervalid)
                clearInterval(this.intervalid);
            this.intervalid=0;              
        }
        if (!event.value && this._on){
            this._on=0;
            if (this.state==1) this.state=0;
        }
        if (this.okfunk && (event.value || (!event.value && !this.off))){
            setTimeout(function(){if (ts.okfunk) {ts.okfunk();ts.okfunk=undefined;ts.cancelfunk=undefined;}},0);
        }
    }       
}


simulator.valve.prototype.offevent = function(event){
    if (event.expression==this.off && event.valid){     
        var ts = this;
        if (event.value && !this._off){
           this._off=1; 
           this.state=2;
           setTimeout(function(){if (ts.roff && ts._roff && ts.ron) $$(ts.roff + ' @= 0');},1);
           if (this.intervalid)
                clearInterval(this.intervalid);
           this.intervalid=0;             
        }
        if (!event.value && this._off){
            this._off=0;
            if (this.state==2) this.state=0;
        }
        if (this.okfunk && (event.value || (!event.value && !this.on))){
            setTimeout(function(){if (ts.okfunk) {ts.okfunk();ts.okfunk=undefined;ts.cancelfunk=undefined;}},0);
        }        
    }         
}


simulator.valve.prototype.execute = function(){
  
}

simulator.valve.prototype.shedule = function(sp,okfunk,cancelfnc){
    var ts = this;
    if (sp){
        if (ts._on || (!ts.on && !ts._off)){
           if (okfunk) okfunk(); 
        }
        else{
           ts.okfunk = okfunk;
           ts.cancelfnc = cancelfnc;
           if (ts.ron){
               setTimeout(function(){$$(ts.ron + ' @= 1')},0)
               return;}
           if (ts.roff){
               setTimeout(function(){$$(ts.roff + ' @= 0')},0)
               return;}
           if (cancelfnc) cancelfnc();
           ts.okfunk = undefined;
           ts.cancelfnc = undefined;           
        }
    }
    else{
        if (ts._off  || (!ts.off && !ts._on)){
           if (okfunk) okfunk(); 
        }
        else{
           ts.okfunk = okfunk;
           ts.cancelfnc = cancelfnc;
           if (ts.roff){
               setTimeout(function(){$$(ts.roff + ' @= 1')},0)
               return;}
           if (ts.ron){
               setTimeout(function(){$$(ts.ron + ' @= 0')},0)
               return;}
           if (cancelfnc) cancelfnc();
           ts.okfunk = undefined;
           ts.cancelfnc = undefined;           
        }
    }          
}
 
// simulator.actuator

simulator.actuator  = function(pos, sp, tick){
    this.pos= pos;
    this.sp=sp;
    this.sp = sp;
    this.enable=true;
    if (!tick)
       this._tick=0.05;
    else{
        if (parseFloat(tick)==parseFloat(tick)) this._tick=parseFloat(tick) / 10;
        else this.tick= '('+tick+ '/10)';
    }
    this.enable=true;
    this.atach();
}

simulator.actuator.prototype.position = function(){
    return this.pos;
}

simulator.actuator.prototype.atach = function(){
    var ts=this;
    if (this.sp){
        this.sphandler = function(){
            ts.spevent(event);
        };
        this.spset=new simulator.expressionevent(this.sphandler , this.sp, this);
    }
    if (this.tick){
        this._tick=0.05;
        this.tickhandler = function(){
            ts.tickevent(event);
        };
        this.tickset=new simulator.expressionevent(this.tickhandler , this.tick, this);
    }
}


simulator.actuator.prototype.detach = function(){
    if (this.sphandler && this.spset)
        this.spset.unregist();//window.removeExpressionListener( this.sphandler);
    if (this.tickhandler && this.tickset)
        this.tickset.unregist();//window.removeExpressionListener( this.tickhandler);    
}

/*simulator.actuator.prototype.sp = function(val){
    console.log('sp actuator set',val);
    $$(this.sp + ' @=  '+ val );
}*/

simulator.actuator.prototype.setenable= function(val){
    console.log('sp actuator enable',val)
    this.enable=val;
}

simulator.actuator.prototype.normalize = function(){
    console.log('actuator normalize');
    $$(this.sp + ' @=  '+ this.pos );
}

simulator.actuator.prototype.spdiff = function(val){
    if ((val<0 ? -val : val)>2) console.log('diff actuator set',val);
    if (val===undefined || val===null || val!=val){
        console.log('diff actuator set undef',val);
       return;}
    if (this._diff)
        this._diff += val
    else
        this._diff = val;
    if (this._diff<-100) this._diff=-100;
    if (this._diff>100) this._diff=100;
    //$$(this.sp + ' @@=  ('+ this.sp + ' + '+ val + ')' );
}

simulator.actuator.prototype.spevent = function(event){
    if (event.valid){     
       this._sp= event.valid ? event.value : undefined;
    }
}    

simulator.actuator.prototype.tickevent = function(event){
    var ts=this;
    if (event.valid && this.enable){ 
         this._tick= event.valid ? event.value : undefined;     
    }
} 

simulator.actuator.prototype.execute = function(){
var ts=this;
//var pos__=$$(ts.pos);
//if (this._sp==0 && pos__>5)
//console.log('sp  == 0',this.sp)
if (this._diff){
    var df=this.sp +' @= (&'+this.sp+'+ '+this._diff + ')';
    $$(df);
    this._diff=undefined;
}
if (this.enable && this._sp!==undefined && ts._tick!==undefined){
$$('(abs(' + ts.pos + ' - '+ ts._sp + ') && ('+ts.pos+'.valid)) ? (' + ts.pos + ' @= (' + ts.pos + ' + (' + ts._sp + '<' + ts.pos + ' ? (- ' + ts._tick + ') : ('+ ts._tick + ')  ))) : ('+ 
        '((abs(' + ts.pos + ' - '+ ts._sp + ') > 0) &&  ('+ts.pos+'.valid)) ? (' + ts.pos + ' @= ' + ts._sp + ') : (1)' + 
        ') ');}
}


//  regulator


simulator.regulator  = function(val, valsp, pos, possp, auto,  rev, kp , ki , kd , tick, enable){
    this.val= val;
    this.valsp=valsp;
    this.pos= pos;
    this.possp=possp;
    
    
    this.auto=auto;
    this.autostate=false;
  
    this.diff = !rev ? '(' + valsp + ' - ' + val + ') / ('+val+'.maxeu - '+val+'.mineu)' : '(' + val + ' - ' + valsp + ') / ('+val+'.maxeu - '+val+'.mineu)';
    this.diffstate = 0;
    
    if (!enable)
        this._enable=true; 
    else 
        this.enable=enable;
  
    this.kp= kp===undefined ? 1 : kp;
    this.ki= ki===undefined ? 10 : ki;
    this.kd= kd===undefined ? 1 : kd;
    this.tick= tick;
    
   
    this.possp=possp; 
    this.auto=auto;    
    this.tick=tick ? tick : 0.05;
    this.K = 0;
    this.I = 0;
    this.D = 0;
    this.error = 0;
    this.lasterror = 0;
    this.preflasterror = 0;
    this.olddiff=undefined;
    
    this.atach();
    
    
}

simulator.regulator.prototype.atach = function(){
    
    this.actuator = new simulator.actuator(this.pos, this.possp, this.tick);
    
    var ts =this;
    
    //console.log('attach regulator');
    
    this.autohandler = function(){ts.autoevent(event);};
    if (this.auto)
        this.autoset = new simulator.expressionevent(this.autohandler , this.auto, this);

    this.diffhandler = function(){ts.diffevent(event);};
    if (this.diff)
        this.diffset = new simulator.expressionevent(this.diffhandler , this.diff, this);
   
   
   this.kphandler = function(){ts.kpevent(event);};
   
   if (this.kp.constructor == String){
        this.kpset=new simulator.expressionevent(this.kphandler , this.kp, this);this.kp=0;}
    
   this.kihandler = function(){ts.kievent(event);};
   
   if (this.ki.constructor == String){
        this.kiset=new simulator.expressionevent(this.kihandler , this.ki, this);this.ki=0;} 
    
   this.kdhandler = function(){ts.kdevent(event);};
   
   if (this.kd.constructor == String){
        this.kdset=new simulator.expressionevent(this.kdhandler , this.kd, this);this.kd=0;}  
    
   this.enablehandler = function(){ts.enableevent(event);};
   
   if (this.enable && this.enable.constructor == String){
        this.enableset=new simulator.expressionevent(this.enablehandler , this.enable, this);}    

}


simulator.regulator.prototype.detach = function(){
    if (this.autohandler && this.autoset)
        this.autoset.unregist();//window.removeExpressionListener( this.autohandler);
    if (this.diffhandler && this.diffset)
        this.diffset.unregist();//window.removeExpressionListener( this.diffhandler);    
    if (this.kphandler && this.kpset)
        this.kpset.unregist();//window.removeExpressionListener( this.kphandler);
    if (this.kihandler && this.kiset)
        this.kiset.unregist();//window.removeExpressionListener( this.kihandler);
    if (this.kdhandler && this.kdset)
        this.kdset.unregist();//window.removeExpressionListener( this.kdhandler); 
    if (this.enablehandler && this.enableset)
        this.enableset.unregist();//window.removeExpressionListener( this.enablehandler);    
}

simulator.regulator.prototype.enableevent = function(event){
    if (event.valid){        
        this._enable=event.value;
        this.actuator.setenable(event.value);
        if (event.value){
            this.K = 0;
            this.I = 0;
            this.D = 0;}    
}
}    

simulator.regulator.prototype.autoevent = function(event){
    if (event.valid){        
        if (this.autostate != event.value){           
            var ts =this;
            this.K = 0;
            this.I = 0;
            this.D = 0;
            this.olddiff=undefined;
            this.error = 0;
            this.lasterror = 0;
            this.preflasterror = 0;
            this.lasttime = undefined;
            this.preflasttime = undefined;
            this.kplast = 0;
            if(!event.value){
            if (this.actuator)
                setTimeout(function(){ts.actuator.normalize()},1);
            }
            else{              
                setTimeout(function(){$$(ts.diff, function(){ts.diffevent({expression : ts.diff, value: event.value, valid: 100 });})},1);
            }    
    }
        this.autostate = event.value;
    }       
}

simulator.regulator.prototype.kpevent = function(event){
    if (event.valid){
        this.kp = event.value; 
        console.log('kp:',this.kp);
    }       
}

simulator.regulator.prototype.kievent = function(event){
    if (event.valid){
        this.ki = event.value; 
        console.log('ki:',this.ki);
    }       
}

simulator.regulator.prototype.kdevent = function(event){
    if (event.valid){
        this.kd = event.value; 
        console.log('kd:',this.kd);
    }       
}

simulator.regulator.prototype.diffevent = function(event){
    if (event.valid && this.autostate){
        this.K = this.K + this.kp * (event.value - (this.kplast===undefined ? 0 : this.kplast));
        this.error = event.value;  
        this.kplast = event.value;
    }
}

simulator.regulator.prototype.delt = function(){
     var rslt = (this.K+this.I+ this.D);
     //console.log('p : ', this.K, 'i : '  ,this.I,  'd :', this.D , 'sum' ,  rslt);
     return (rslt<-1) ? - 1 : ((rslt>1) ? 1 : rslt)
}

simulator.regulator.prototype.execute = function(){
    if (this.autostate && this.actuator){
        //console.log('this.autostate ',this.autostate );
        var ts = this;
        var tmp = new Date();
        var curtime = tmp.getTime() + 0;
        var difftime = curtime - this.lasttime;
        var difftime_d = curtime - this.perflasttime;
        if (this.lasttime && this.error){         
            this.I =  this.kp * (this.error * (difftime)) / (this.ki ? this.ki : Infinity) / 1000;}
        
        if (this.lasttime && (this.error ||this.lasttime || this.perflasterror)) {
            if (this.lasttime && this.perflasttime){
                this.D = this.kp * (this.error - 2 * this.lasterror +  this.perflasterror) / (difftime_d ? difftime_d : Infinity) * this.kd * 1000;}
            else{
                if (this.lasttime)
                    this.D = this.kp * (this.error - this.lasterror) / (difftime ? difftime : Infinity) * this.kd * 1000;
                else
                    this.D = 0;
            }
        }
        
        this.perflasttime = this.lasttime;
        this.lasttime = curtime + 0 ;
        
        this.perflasterror = this.lasterror;
        this.lasterror = this.error ;
        
       // if (this.K) 
       //     console.log('prop ',this.K );
       // console.log( this.I, this.D );
        if (this.D && (this.D<-0.08)) this.D=-0.08;
        if (this.D && (this.D>0.08)) this.D=0.08;
        var d_and_i_and_k = (this.I ? this.I : 0) + (this.D ? this.D : 0)  + (this.K ? this.K : 0);
        if (d_and_i_and_k<-1) d_and_i_and_k=-1;
        if (d_and_i_and_k>1) d_and_i_and_k=1;
        if (d_and_i_and_k){
        //if (this.valsp=='p8_sp') console.log( 'd_and_i_and_k p= % 4.2f, i= % 4.2f, d= % 4.8f, k= %4.2f',this.K*100,this.I*100,this.D*100,d_and_i_and_k*100)
        ts.actuator.spdiff(d_and_i_and_k * 100);;}
     
        this.K=0;
        
    }
    if (this.actuator){
       this.actuator.execute(); 
    }
}


//  sheduler

simulator.sheduler = function(start , source ,stop, shedulelist){
  if (source && shedulelist){
      this.valid = true;
      this.source = source;
      this.shedulelist = shedulelist;
  }
  if (start || start==0)
        this.start = start;
  if (stop || start==0)
        this.stop = stop;    
  if (this.valid){
      this.atach();
  }     
}

simulator.sheduler.prototype.atach = function(){
    
    var ts =this;
    if (this.source){
        this.sourcehandler = function(){
            ts.sourceevent(event);
        };

        this.sourceset = new simulator.expressionevent(this.sourcehandler , this.source, this);
    }
    
    if (this.valid && (this.start || this.start==0))
       $$(this.source + ' @= ' + this.start);
}


simulator.sheduler.prototype.detach = function(){
    if (this.sourcehandler && this.sourceset)
        this.sourceset.unregist();//window.removeExpressionListener( this.sourcehandler);   
    if (this.valid && (this.stop || this.stop==0))
       $$(this.source + ' @= ' + this.stop)

}

simulator.sheduler.prototype.execute = function(){
    
}

simulator.sheduler.prototype.sourceevent = function(){
    if (event.expression==this.source && event.valid){     
        var ts = this;
        if (event.value){
            this.set = 1;
            for (var i=this.shedulelist.length-1; i>=0; --i){
                    var shedulerow= ts.shedulelist[i]; 
                    var sh = new simulator.sheduler.task(shedulerow.shedule,shedulerow.sp, 
                             nextsh ? nextsh : {
                                 execute: function(){setTimeout(function(){if (ts.okfunk)
                                     ts.okfunk();ts.okfunk =undefined;ts.cancelfnc =undefined;},0)}} );
                    ts.shedulelist[i].sh = sh;
                    var nextsh = sh;
            }
            if (sh) sh.execute();                            
        }
        else{
            this.set = 0;
        }
}    
}


simulator.sheduler.prototype.shedule = function(sp,okfunk,cancelfnc){
    if (this.set){
        if (okfunk){okfunk()}
    }
    else{
        var ts = this;
        ts.okfunk = okfunk;
        ts.cancelfnc = cancelfnc;
        setTimeout(function(){$$(ts.source + ' @= 1')},0);       
    }
}



//  sheduler.task

simulator.sheduler.task = function(sheduler, sp, nextsheduler, cancelfunc){
    this.sheduler = sheduler;
    this.sp = sp;
    this.nextsheduler = nextsheduler;
    this.cancelfunc = cancelfunc ? cancelfunc : function(){};
}

simulator.sheduler.task.prototype.execute = function(){
    var tss = this;
    var nextcall = tss.nextsheduler ? function(){tss.nextsheduler.execute()} : 
        function(){
        $$(tss.sourse +' @= 0');};
    setTimeout(function(){
        tss.sheduler.shedule(tss.sp, nextcall ,tss.cancelfunc)},0);
}

//  sheduler.timeoutshedule

simulator.sheduler.timeoutshedule = function(timeout){
    this.timeout = timeout ? timeout : 0 ;
}

simulator.sheduler.timeoutshedule.prototype.shedule = function(sp,okfunk,cancelfnc){
    var tss = this;
    this.okfunk = okfunk;
    this.cancelfnc = cancelfnc;
    setTimeout(function(){
        tss.okfunk();tss.okfunk = undefined;tss.cancelfnc = undefined;},tss.timeout); 
}

//  sheduler.commandshedule

simulator.sheduler.commandshedule = function(func,timeout){
    this.func = func ? func : function(){} ;
    this.timeout = timeout ? timeout : 0 ;
}

simulator.sheduler.commandshedule.prototype.shedule = function(sp,okfunk,cancelfnc){
    var tss = this;
    this.okfunk = okfunk;
    this.cancelfnc = cancelfnc;
    setTimeout(function(){
        tss.func();tss.okfunk();tss.okfunk = undefined;tss.cancelfnc = undefined;},tss.timeout); 
}

//  sheduler.commandshedule

simulator.sheduler.checkvalueshedule = function(value, timeout){
    this.value = value ? value : function(){} ;
    this.source = value;
}

simulator.sheduler.checkvalueshedule.prototype.atach = function(){
    
    var ts =this;
    if (this.source){
        this.sourcehandler = function(){
            ts.sourceevent(event);
        };
        this.sourceset = new simulator.expressionevent(this.sourcehandler , this.source, this)
    }
}


simulator.sheduler.checkvalueshedule.prototype.detach = function(){
    if (this.sourcehandler && this.sourceset)
        this.sourceset.unregist();//window.removeExpressionListener( this.sourcehandler);
}

simulator.sheduler.checkvalueshedule.prototype.shedule = function(sp,okfunk,cancelfnc){
    var tss = this;
    this.okfunk = okfunk;
    this.cancelfnc = cancelfnc;
    setTimeout(function(){
        tss.atach();},0); 
}

simulator.sheduler.checkvalueshedule.prototype.sourceevent = function(){
    if (event.expression==this.source && event.valid){     
        if (event.value){
           var tss = this;
           setTimeout(function(){if (tss.okfunk) tss.okfunk();tss.okfunk = undefined;tss.cancelfnc = undefined;tss.detach();},0);
}}}