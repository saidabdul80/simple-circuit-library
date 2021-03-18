const defaultConfiguration = {
	value:0,
	mode: 0,
	range: 2,
	type:'dc'
};

class digitalMultimeter{
		
		constructor(containerID,config = {}){
			//if (!containerID) throw new Error("invalid container id");      
			this.config = {...defaultConfiguration, ...config};
			this.container_id = containerID;
			this.dynamic_mode_id = "";
			this.dynamic_range_id = "";
			this.dynamic_id = "";
			this.dynamic_class_btn = "";
			this.dataObject ={ 
				stateType: 'off'
			};
			this.valueholder_id = "";
			var $vm = this;		
			this.exampleEndpoint ="";
			this.exampleEndpoint2 ="";

           

		}


		modeSlider(){
			let $vm = this;
			$('#'+this.dynamic_range_id).change(function(){				
				$('#'+$vm.dynamic_mode_id).html($(this).val());
				$(this).mousemove(function(){
					$('#'+$vm.dynamic_mode_id).html($(this).val());

				})
			});
		}
		tyepSwitch(){
			let $vm = this;
			$('.'+this.dynamic_class_btn).click(function(){
				$('.'+$vm.dynamic_class_btn).removeClass('btnDigitalActivate');
				$(this).addClass('btnDigitalActivate');
			})
		}
		reader(){
			this.dynamic_mode_id += 'mode_';
			this.dynamic_range_id += 'range_';
			this.dynamic_class_btn += 'btnDigital_';
			this.valueholder_id += 'htc_';
			this.dynamic_id += 'reader_';

			let $vm = this;
			this.valueholder_id += Math.floor((Math.random() * 1000) + 1);
			this.dynamic_mode_id += Math.floor((Math.random() * 1000) + 1);
			this.dynamic_range_id += Math.floor((Math.random() * 1000) + 1);
			this.dynamic_class_btn += Math.floor((Math.random() * 1000) + 1);
			this.dynamic_id += Math.floor((Math.random() * 1000) + 1);
			var cont_holder =  '<div id="'+this.dynamic_id+'" class="dragme" style="background: #fff;box-shadow: 0px 0px 4px #ccc; width: 200px; border-radius: 10px; height: 100px;padding: 12px 8px; position: absolute;display: flex;user-select: none;">';
          		cont_holder += '<div class="remover"   style="cursor:pointer;background:red;color:white;display:none;position:absolute;top:-35px;left:30%;border-radius:50%;flex-wrap:wrap;justify-content:center;align-items:center; width:35px;height:35px;font-size:1.3em;z-index:2;">&times</div>';
          		cont_holder += '<div class="remover2" rel="'+this.dynamic_id+'"   style="cursor:pointer;background:red;color:white;display:none;position:absolute;top:-35px;left:50%;border-radius:50%;flex-wrap:wrap;justify-content:center;align-items:center; width:35px;height:35px;font-size:1.3em;z-index:2;">&#x2702;</div>';
				cont_holder += '<div style="display: flex;flex-direction: column;width: 100%;">';

				cont_holder += '<div id="'+this.dynamic_mode_id+'" style="font-size: 300%;display: flex;justify-content: center;flex-wrap: wrap;align-items: center; font-stretch: condensed; font-family: \'digital-clock\', sans-serif;background-image: radial-gradient(closest-side at 50%  20%,#fff,#eee); width: 100%;border-radius: 10px;height: 70%;">000.00</div>';
				/*cont_holder += '<span id="'+this.dynamic_mode_id+'" title="mode" style="position: absolute;font-size: 1em; left: 8%;bottom: 42px;font-family:\'digital-clock\'">0</span>';*/
				/*cont_holder += '<input type="range" orient="vertical" class="digitalSlider" id="'+this.dynamic_range_id+'" value="0" min="0" max="220" style=""></div>';*/
				cont_holder += '<input type="number" value="0"  style="display:none;" id="'+this.valueholder_id+'">'		
				cont_holder += '<div style="display: flex;justify-content:center; flex-wrap: wrap; align-items: center;margin: 0px 2px;">';
				cont_holder += '<button onclick="state(\'off\');" class="btnDigital '+this.dynamic_class_btn+' btnDigitalActivate"><span> Off</span></button>'; //Off;
				cont_holder += '<button onclick="state(\'ac\');" class="'+this.dynamic_class_btn+' btnDigital "><span>AC</span><span class="symbolDigital ">&#126;</span>';//ac button
				cont_holder += '</button ><button onclick="state(\'dc\');" class="'+this.dynamic_class_btn+' btnDigital"><span>DC</span><span class="symbolDigital ">&#95;</span></button>'; //dc button
				cont_holder += '<button onclick="state(\'ohms\');" class="btnDigital '+this.dynamic_class_btn+'"><span> &#x2126;</span></button>'; //ohms button;
				//cont_holder += '<button class="btnDigital '+this.dynamic_class_btn+'"><span> &#x2126;</span></button>'; //ohms button;
				//cont_holder += '<button class="btnDigital '+this.dynamic_class_btn+'"><span> &#x2126;</span></button>'; //ohms button;
				cont_holder += '</div></div>';			
			$('#'+this.container_id).append(cont_holder);//renderer

			window.state = a => this.dataObject.stateType=a; //make state function global
		}

		//
		setValue(newvalue){
			this.config.value = newvalue;
		}

		//callback function wen data changes
		watchOut(){
			let $vm = this;
			watch(this.dataObject,'stateType', function(){
				$vm.update($vm.config.value);
			})//
			watch(this.config,'value', function(){
				$vm.update($vm.config.value);				
			})
		}

		shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}
		update(v,type){			
		/*	let nnew, nnold;
			setInterval(function(){
				nnew = ('#'+this.valueholder_id).val();
			},10);*/	
			var Digitalconter=0;			
			//if (range) {}//range for decimal
			let $vm = this;
			
			if (this.dataObject.stateType != 'off') {	
				//if (type != this.dataObject.stateType) {}							
				let decimalPt = [0.01,0.05,0.13,0.50,1.10,1.5,2.50,4.55,0.02,0.03,0.04,0.05,0.06,0.09,5.55,10.10,8.01,9.88,7.77];
			 	var digitCounter = setInterval(function(inv){			 	
			 		decimalPt = $vm.shuffle(decimalPt);								 		
					Digitalconter += decimalPt[Math.floor(Math.random() * 10) + decimalPt.length-10];
					if (Digitalconter<=v) {
						$('#'+$vm.dynamic_mode_id).html(Digitalconter.toFixed(2))
					}else{
						clearInterval(digitCounter);
					}					
				},60);
			}
		}
		getId(){
			return this.dynamic_id;
		}
		//jsplumb
      connectify(){
     //   var $vm = this;
        //console.log($vm.dynamic_id);
      /*  jsPlumb.ready(function () {

         
            $vm.instance.batch(function () {
  
                    var exampleDropOptions = {
                        tolerance: "touch",
                        hoverClass: "dropHover",
                        activeClass: "dragActive"
                    };

                    var exampleColor = "#000";                   
                    $vm.exampleEndpoint = {
                         endpoint: "Rectangle",
                        paintStyle: { width: 10, height: 10, fill: exampleColor},
                        isSource: true,
                        scope: "scope",
                        connectorStyle: { stroke: exampleColor, strokeWidth: 2 },
                        connector: ["Bezier", { curviness: 63 } ],
                        maxConnections: 3,
                        isTarget: true,
                        uuid:'negative'+$vm.dynamic_id,
                         beforeDrop: function (params) {
                            //console.log(params);
                            return true ; //return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
                        },
                        dropOptions: exampleDropOptions
                    };

                    //
                    // the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
                    // and has scope 'exampleConnection2'.
                    //
                    var color2 = "red";
                    $vm.exampleEndpoint2 = {
                        endpoint: "Rectangle",
                        paintStyle: { width: 10, height: 10, fill: color2},
                        isSource: true,                        
                        scope: "scope",
                        connectorStyle: { stroke: color2, strokeWidth: 2 },
                        connector: ["Bezier", { curviness: 63 } ],
                        maxConnections: 3,
                        isTarget: true,
                        target:"scope",
                        uuid:'positive'+$vm.dynamic_id,                                                
                         beforeDrop: function (params) {
                            //console.log(params);
                            return true ;//confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
                        },
                        dropOptions: exampleDropOptions
                    };
                    $vm.instance.addEndpoint($vm.dynamic_id, { anchor:  [0, 0.5, 0, 1]}, $vm.exampleEndpoint);
                    $vm.instance.addEndpoint($vm.dynamic_id, { anchor:  [1, 0.5, 0, 1] }, $vm.exampleEndpoint2);
                   
                   $vm.instance.draggable($(".dragme"),{});
            });
            jsPlumb.fire("jsPlumbDemoLoaded", $vm.instance);
      });*/
    }


}