
function drawTable_leg2(){
  var button = document.getElementById("object");
  button.setAttribute("onclick","viewTable_leg2()")
    var dec = document.getElementById("decomposition");
  dec.setAttribute("onclick","decTable_leg2()");
    alert("Click on view object button to see Table_leg2")
}


function viewTable_leg2(){
 var plasm = document.getElementById("plasm")
      if(plasm == null){
  var message = 'Do you want see the table_leg2?'

  var choice = confirm(message)

  if (choice == true) {
	 var plasm = document.createElement("div");
        plasm.setAttribute("id","plasm")
        var cont = document.getElementById("container");
        cont.appendChild(plasm)
        init();
        var canvas = document.getElementsByTagName('canvas')[0]
        canvas.setAttribute("onmouseover","hiddenBody()");
        canvas.setAttribute("onmouseout","clearBody()");
        canvas.setAttribute("height","500px");
        showTable_leg2()
  }
}
}

var table_leg23;

function showTable_leg2(){
/*
support function
*/
//scalate object and then translate resulted-oject
var RT = function(axisR,rotates){
  return function(axisT, translate){
    return function(object){
      return T(axisT)(translate)(R(axisR)(rotates)(object));
    }
  }
}

var color = function(r,g,b,o){ // o must be in to interval 0 and 1
  return function(object){
  if(o == 0)
    return COLOR([r/255,g/255,b/255])(object);
  else
    return COLOR([r/255,g/255,b/255,o])(object);
  }
}

var white  = color(255,250,250,0);

var gray = color(159,182,205,0);

/* table leg function support*/


function genNUBS (controlPoints){
  var domain = INTERVALS(1)(20)
  var knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
  var nubs = NUBS(S0)(2)(knots)(controlPoints)
  var curve = MAP(nubs)(domain)
  return [curve,nubs]
}

function create_ptl(l,r,h){
var ptl = [[0,0,h],[l,0,h],[l+0.05,r/4,h],[l+0.1,r/2,h],
           [l+0.05,r,h],[l,r,h],[0,r,h]];
var center = [0,r/2,h];
var end = BEZIER(S0)([[0,0,h],[0,r,h]]);
return [genNUBS(ptl)[1],center,end,ptl];
}

var make_leg = function(l,r,h){
  var arrayleg1 = create_ptl(l,r,0);
  var arrayleg2 = create_ptl(l,r,h);

  var leg1 = mapC([ arrayleg1[2],
    arrayleg1[0], 
    arrayleg2[0],
    arrayleg2[2],
    arrayleg1[2]
    ])
  var arrayleg3 = create_ptl(l-0.05,r-0.05,0);
  var arrayleg4 = create_ptl(l-0.05,r-0.05,h*40);

  var leg2 = mapC([arrayleg3[0], 
    arrayleg4[0],
    arrayleg4[2],
    arrayleg3[2]/*,
    create_ptl(l-0.05,r-0.05,h*40)[2]*/
    ])

  var behind = CUBOID([0.025,0.2,2+h])
  var leg = white(STRUCT([leg1,T([0,1,2])([0.025,0.025,h])(leg2),behind]))
  return leg;
}

var mapC = function(args){
    var result = new Array();
    for(var i = 0; i<args.length-1; i++){
      result.push(MAP(BEZIER(S1)([args[i],args[i+1]]))(domain2D));
    }
/*    result.push(MAP(BEZIER(S1)([args[args.length-1],args[args.length-2]]))(domain2D))*/
    return  STRUCT(result);
  
}

var create_plane = function(l,r,h){
  var arrayplane1 = create_ptl(l,r,h);
  var arrayplane2 =  create_ptl(l,r,h+6)

  var plane = mapC([arrayplane1[2],
              arrayplane1[0], 
              arrayplane2[0],
              arrayplane2[2],
              arrayplane1[2]
              ])

var plane_RT = RT([1,2],-PI/2)([1,2],[-h,x_plane+z_plane])(plane)

return white(plane_RT);
}


/* table leg*/

var domain = DOMAIN([[0,1]])([10])
var domain2D = DOMAIN([[0,1],[0,1]])([10,10])


var dx = 1.62

var l = 2.60;
var r = 0.2;
var h = 0.05;

var x_plane = h*41;
var y_plane = l;
var z_plane = r;

var new_heigh = h*40
var new_prof = l/2;
var new_weigh = r-0.05;

var base1 = mapC([create_ptl(l,r,0)[2],
              create_ptl(l,r,0)[0], 
              create_ptl(l,r,h)[0],
              create_ptl(l,r,h)[2],
              create_ptl(l,r,0)[2]
              ])

var base2 = mapC([create_ptl(new_prof,new_weigh,0)[0], 
              create_ptl(new_prof,new_weigh,new_heigh)[0],
              create_ptl(new_prof,new_weigh,new_heigh)[2],
              create_ptl(new_prof,new_weigh,0)[2]
              ])

var behind = STRUCT([T([1,2])([r-0.05,(new_heigh)*0.1])(CUBOID([0.01,6-2*(r-0.05),(x_plane+z_plane+0.1)-(new_heigh)*0.1])),
                     T([1,2])([r-0.05,(new_heigh)*0.1])(CUBOID([l*0.2,6-2*(new_weigh),0.01]))
                   ]);

var table_leg23 = white(STRUCT([T([1])([6-r])(make_leg(l,r,h)),create_plane(y_plane,z_plane,x_plane),
                                STRUCT([base1,T([1,2])([0.025,h])(base2)]),behind]))


DRAW(table_leg23)




function Animate() {
  var message = 'Do you want to activate the movement of table_leg2?'

  var choice = confirm(message)

  if (choice == true) {
    setInterval(function () {
    table_leg23.rotate([0,1], PI/45)/*.rotate([1,2],PI/45).rotate([0,2],PI/45)*/;
    }, 100);
  }
  

}

Animate()
}

function decTable_leg2(){
  var message = 'Do you want see the decomposition of table_leg2?'

  var choice = confirm(message)

  if(choice==true){
    var plasm = document.getElementById("plasm")
    if(plasm == null){
   var plasm = document.createElement("div");
        plasm.setAttribute("id","plasm")
        var cont = document.getElementById("container");
        cont.appendChild(plasm)
        init();
        var canvas = document.getElementsByTagName('canvas')[0]
        canvas.setAttribute("onmouseover","hiddenBody()");
        canvas.setAttribute("onmouseout","clearBody()");
        canvas.setAttribute("height","500px");
  }
else{
  alert("First close vision")
}
var RT = function(axisR,rotates){
  return function(axisT, translate){
    return function(object){
      return T(axisT)(translate)(R(axisR)(rotates)(object));
    }
  }
}
  var color = function(r,g,b,o){ // o must be in to interval 0 and 1
  return function(object){
  if(o == 0)
    return COLOR([r/255,g/255,b/255])(object);
  else
    return COLOR([r/255,g/255,b/255,o])(object);
  }
}

var white  = color(255,250,250,0);

function genNUBS (controlPoints){
  var domain = INTERVALS(1)(20)
  var knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
  var nubs = NUBS(S0)(2)(knots)(controlPoints)
  var curve = MAP(nubs)(domain)
  return [curve,nubs]
}


function create_ptl(l,r,h){
var ptl = [[0,0,h],[l,0,h],[l+0.05,r/4,h],[l+0.1,r/2,h],
           [l+0.05,r,h],[l,r,h],[0,r,h]];
var center = [0,r/2,h];
var end = BEZIER(S0)([[0,0,h],[0,r,h]]);
return [genNUBS(ptl)[1],center,end,ptl];
}



var make_leg = function(l,r,h){
  var arrayleg1 = create_ptl(l,r,0);
  var arrayleg2 = create_ptl(l,r,h);

  var leg1 = mapC([ arrayleg1[2],
    arrayleg1[0], 
    arrayleg2[0],
    arrayleg2[2],
    arrayleg1[2]
    ])
  var arrayleg3 = create_ptl(l-0.05,r-0.05,0);
  var arrayleg4 = create_ptl(l-0.05,r-0.05,h*40);

  var leg2 = mapC([arrayleg3[0], 
    arrayleg4[0],
    arrayleg4[2],
    arrayleg3[2]/*,
    create_ptl(l-0.05,r-0.05,h*40)[2]*/
    ])

  var behind = CUBOID([0.025,0.2,2+h])
  var leg = white(STRUCT([leg1,T([0,1,2])([0.025,0.025,h+0.3])(leg2),T([0])([-0.5])(behind)]))
  return leg;
}

var mapC = function(args){
    var result = new Array();
    for(var i = 0; i<args.length-1; i++){
      result.push(MAP(BEZIER(S1)([args[i],args[i+1]]))(domain2D));
    }
/*    result.push(MAP(BEZIER(S1)([args[args.length-1],args[args.length-2]]))(domain2D))*/
    return  STRUCT(result);
  
}

var create_plane = function(l,r,h){
  var arrayplane1 = create_ptl(l,r,h);
  var arrayplane2 =  create_ptl(l,r,h+6)

  var plane = mapC([arrayplane1[2],
              arrayplane1[0], 
              arrayplane2[0],
              arrayplane2[2],
              arrayplane1[2]
              ])

var plane_RT = RT([1,2],-PI/2)([1,2],[-h,x_plane+z_plane])(plane)

return white(plane_RT);
}

/* table leg*/

var domain = DOMAIN([[0,1]])([10])
var domain2D = DOMAIN([[0,1],[0,1]])([10,10])


var dx = 1.62

var l = 2.60;
var r = 0.2;
var h = 0.05;

var x_plane = h*41;
var y_plane = l;
var z_plane = r;

var new_heigh = h*40
var new_prof = l/2;
var new_weigh = r-0.05;

var base1 = mapC([create_ptl(l,r,0)[2],
              create_ptl(l,r,0)[0], 
              create_ptl(l,r,h)[0],
              create_ptl(l,r,h)[2],
              create_ptl(l,r,0)[2]
              ])

var base2 = mapC([create_ptl(new_prof,new_weigh,0)[0], 
              create_ptl(new_prof,new_weigh,new_heigh)[0],
              create_ptl(new_prof,new_weigh,new_heigh)[2],
              create_ptl(new_prof,new_weigh,0)[2]
              ])


var behind = STRUCT([T([1,2])([r-0.05,(new_heigh)*0.1])(CUBOID([0.01,6-2*(r-0.05),(x_plane+z_plane+0.1)-(new_heigh)*0.1])),
                     T([1,2])([r-0.05,(new_heigh)*0.1])(CUBOID([l*0.2,6-2*(new_weigh),0.01]))
                   ]);

var table_leg23D = white(STRUCT([T([1])([6-r])(make_leg(l,r,h)),T([2])([0.5])(create_plane(y_plane,z_plane,x_plane)),
                                STRUCT([base1,T([1,2])([0.025,h+0.3])(base2)]),T([0])([-0.5])(behind)]))


DRAW(table_leg23D)


}

}

