
function drawCenter_table(){
  var button = document.getElementById("object");
  button.setAttribute("onclick","viewCenter_table()")
  var dec = document.getElementById("decomposition");
  dec.setAttribute("onclick","decCenter_table()");
  alert("Click on view object button to see Center_table")
}

function viewCenter_table(){
 var plasm = document.getElementById("plasm")
      if(plasm == null){
  var message = 'Do you want see the center_table?'

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
        showCenter_table()
  }
}
else{
  alert("First close vision")
}
}



var center_table;

function showCenter_table(){

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

var orchid = color(153,50,204,0)
/* table leg function support*/

function inverti_coordinate(array,coordinata1,coordinata2){
  for(var i=0;i<array.length;i++){
    //inverto x e y
    if(coordinata1 === 0 && coordinata2 === 1 || coordinata1 === 1 && coordinata2 === 0){
      var a_supp = array[i][0];
      array[i][0] = array[i][1];
      array[i][1] = a_supp ;
    }
    else if(coordinata1 === 0 && coordinata2 === 2 || coordinata1 === 2 && coordinata2 === 0){
      var a_supp = array[i][0];
      array[i][0] = array[i][2];
      array[i][2] = a_supp ;
    }
    else if(coordinata1 === 2 && coordinata2 === 1 || coordinata1 === 1 && coordinata2 === 2){
      var a_supp = array[i][2];
      array[i][2] = array[i][1];
      array[i][1] = a_supp ;
    }

    else
      console.log("coordinata errata");
  }
  return array;
}

function genNUBS (controlPoints){
  var domain = INTERVALS(1)(20)
  var knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
  var nubs = NUBS(S0)(2)(knots)(controlPoints)
  var curve = MAP(nubs)(domain)
  return [curve,nubs]
}


function translatePoints (arrayOfPoints,dx,dy,dz) {
  var result = [];
  var dx = dx || 0;
  var dy = dy || 0;
  var dz = dz || 0;
  for (i=0; i < arrayOfPoints.length; i++) {
    p = arrayOfPoints[i].concat([1])
    AffineTransformation = [[1,0,0,dx],[0,1,0,dy],[0,0,1,dz],[0,0,0,1]]
    var mul = numeric.dot(AffineTransformation,p)
    mul.pop()
    result=result.concat([mul])
  }
  return result
}

function scalePoints (arrayOfPoints,sx,sy,sz) {
  var result = [];
  var sx = sx || 1;
  var sy = sy || 1;
  var sz = sz || 1;
  for (i=0; i < arrayOfPoints.length; i++) {
    p = arrayOfPoints[i].concat([1])

    AffineTransformation = [[sx,0,0,0],[0,sy,0,0],[0,0,sz,0],[0,0,0,1]]
    var mul = numeric.dot(AffineTransformation,p)
    mul.pop()
    result=result.concat([mul])
  }
  return result
}


function rotZ (arrayOfPoints,angle) {
  var a = angle
  var result = [];
  for (i=0; i < arrayOfPoints.length; i++) {
    p = arrayOfPoints[i]
    AffineTransformation = [[COS(a),SIN(a),0],[-SIN(a),COS(a),0],[0,0,1]]
    var mul = numeric.dot(AffineTransformation,p)
    result=result.concat([mul])
  }
  return result
}

function create_ptl(l,r,h){
var ptl = [[0,0,h],[l,0,h],[l+0.05,r/4,h],[l+0.1,r/2,h],
           [l+0.05,r,h],[l,r,h],[0,r,h]];
var center = [0,r/2,h];
var end = BEZIER(S0)([[0,0,h],[0,r,h]]);
return [genNUBS(ptl)[1],center,end,ptl];
}



var mapC = function(args){
    var result = new Array();
    for(var i = 0; i<args.length-1; i++){
      result.push(MAP(BEZIER(S1)([args[i],args[i+1]]))(domain2D));
    }
/*    result.push(MAP(BEZIER(S1)([args[args.length-1],args[args.length-2]]))(domain2D))*/
    return  STRUCT(result);
  
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

//middle worksurface

var ptl_xzy = [[0,6,2.25],[2.60,6,2.25],[2.65,6,2.2],[2.7,6,2.15],[2.65,6,2.05],[2.60,6,2.05],[0,6,2.05]]

var vector = genNUBS(ptl_xzy)[1]

var t = translatePoints(ptl_xzy,0,1,0);

var vector0 = genNUBS(translatePoints(ptl_xzy,0,1,0))[1];

var vector1 = genNUBS(translatePoints(rotZ(t,PI/4),-4.5,8.1,0))[1];

var vector3 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0))[1];

var vector4 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0))[1];

var vector5 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0))[0];

var curve_center = []; curve_center[0] = vector; curve_center[1] = vector0; curve_center[2]= vector1; curve_center[3]  = vector3;
curve_center[4] = vector4;

var drs = MAP(BEZIER(S1)(curve_center))(domain2D);



var close0 = BEZIER(S0)([ptl_xzy[0],translatePoints(ptl_xzy,0,1,0)[0],
                        translatePoints(rotZ(t,PI/4),-4.5,8.1,0)[0],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0)[0],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0)[0]])

var close1 = NUBS(S0)(1)([0,0,1,2,3,4,4])([[0,6,2.05],[0,7,2.05],[0,12.97,2.05],[7.05-dx,12.97,2.05],[8.52-dx,12.97,2.05]])

var close2 = NUBS(S0)(1)([0,0,1,2,3,4,4])([[0,6,2.05+r],[0,7,2.05+r],[0,12.97,2.05+r],[7.05-dx,12.97,2.05+r],[8.52-dx,12.97,2.05+r]])

var close3 = BEZIER(S0)([ptl_xzy[6],translatePoints(ptl_xzy,0,1,0)[6],
                        translatePoints(rotZ(t,PI/4),-4.5,8.1,0)[6],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0)[6],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0)[6]])

var close = mapC([close0,close2,close1,close3]);

var behind0 = T([1])([6])(STRUCT([T([2])([new_heigh*0.1])(CUBOID([0.01,6.97,(x_plane+z_plane+0.1)-(h*40)*0.1])),
                     T([2])([new_heigh*0.1])(CUBOID([l*0.2,6.97,0.01]))
                   ]))

var behind1 = T([1])([12.97])(STRUCT([T([2])([new_heigh*0.1])(CUBOID([6.97,0.01,(x_plane+z_plane+0.1)-(h*40)*0.1])),
                     T([1,2])([-l*0.2,new_heigh*0.1])(CUBOID([6.97,l*0.2,0.01]))
                   ]));

var center_table = white(STRUCT([drs,close,behind0,behind1]))


DRAW(center_table)




function Animate() {
  var message = 'Do you want to activate the movement of center_table?'

  var choice = confirm(message)

  if (choice == true) {
    setInterval(function () {
    center_table.rotate([0,1], PI/45)/*.rotate([1,2],PI/45).rotate([0,2],PI/45)*/;
    }, 100);
  }
  

}

Animate()
}

function decCenter_table(){
    var message = 'Do you want see the decomposition of center_table?'

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

var orchid = color(153,50,204,0)
/* table leg function support*/

function inverti_coordinate(array,coordinata1,coordinata2){
  for(var i=0;i<array.length;i++){
    //inverto x e y
    if(coordinata1 === 0 && coordinata2 === 1 || coordinata1 === 1 && coordinata2 === 0){
      var a_supp = array[i][0];
      array[i][0] = array[i][1];
      array[i][1] = a_supp ;
    }
    else if(coordinata1 === 0 && coordinata2 === 2 || coordinata1 === 2 && coordinata2 === 0){
      var a_supp = array[i][0];
      array[i][0] = array[i][2];
      array[i][2] = a_supp ;
    }
    else if(coordinata1 === 2 && coordinata2 === 1 || coordinata1 === 1 && coordinata2 === 2){
      var a_supp = array[i][2];
      array[i][2] = array[i][1];
      array[i][1] = a_supp ;
    }

    else
      console.log("coordinata errata");
  }
  return array;
}

function genNUBS (controlPoints){
  var domain = INTERVALS(1)(20)
  var knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
  var nubs = NUBS(S0)(2)(knots)(controlPoints)
  var curve = MAP(nubs)(domain)
  return [curve,nubs]
}


function translatePoints (arrayOfPoints,dx,dy,dz) {
  var result = [];
  var dx = dx || 0;
  var dy = dy || 0;
  var dz = dz || 0;
  for (i=0; i < arrayOfPoints.length; i++) {
    p = arrayOfPoints[i].concat([1])
    AffineTransformation = [[1,0,0,dx],[0,1,0,dy],[0,0,1,dz],[0,0,0,1]]
    var mul = numeric.dot(AffineTransformation,p)
    mul.pop()
    result=result.concat([mul])
  }
  return result
}

function scalePoints (arrayOfPoints,sx,sy,sz) {
  var result = [];
  var sx = sx || 1;
  var sy = sy || 1;
  var sz = sz || 1;
  for (i=0; i < arrayOfPoints.length; i++) {
    p = arrayOfPoints[i].concat([1])

    AffineTransformation = [[sx,0,0,0],[0,sy,0,0],[0,0,sz,0],[0,0,0,1]]
    var mul = numeric.dot(AffineTransformation,p)
    mul.pop()
    result=result.concat([mul])
  }
  return result
}


function rotZ (arrayOfPoints,angle) {
  var a = angle
  var result = [];
  for (i=0; i < arrayOfPoints.length; i++) {
    p = arrayOfPoints[i]
    AffineTransformation = [[COS(a),SIN(a),0],[-SIN(a),COS(a),0],[0,0,1]]
    var mul = numeric.dot(AffineTransformation,p)
    result=result.concat([mul])
  }
  return result
}

function create_ptl(l,r,h){
var ptl = [[0,0,h],[l,0,h],[l+0.05,r/4,h],[l+0.1,r/2,h],
           [l+0.05,r,h],[l,r,h],[0,r,h]];
var center = [0,r/2,h];
var end = BEZIER(S0)([[0,0,h],[0,r,h]]);
return [genNUBS(ptl)[1],center,end,ptl];
}



var mapC = function(args){
    var result = new Array();
    for(var i = 0; i<args.length-1; i++){
      result.push(MAP(BEZIER(S1)([args[i],args[i+1]]))(domain2D));
    }
/*    result.push(MAP(BEZIER(S1)([args[args.length-1],args[args.length-2]]))(domain2D))*/
    return  STRUCT(result);
  
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

//middle worksurface

var ptl_xzy = [[0,6,2.25],[2.60,6,2.25],[2.65,6,2.2],[2.7,6,2.15],[2.65,6,2.05],[2.60,6,2.05],[0,6,2.05]]

var vector = genNUBS(ptl_xzy)[1]

var t = translatePoints(ptl_xzy,0,1,0);

var vector0 = genNUBS(translatePoints(ptl_xzy,0,1,0))[1];

var vector1 = genNUBS(translatePoints(rotZ(t,PI/4),-4.5,8.1,0))[1];

var vector3 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0))[1];

var vector4 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0))[1];

var curve_center = []; curve_center[0] = vector; curve_center[1] = vector0; curve_center[2]= vector1; curve_center[3]  = vector3;
curve_center[4] = vector4;

var drs = MAP(BEZIER(S1)(curve_center))(domain2D);



var close0 = BEZIER(S0)([ptl_xzy[0],translatePoints(ptl_xzy,0,1,0)[0],
                        translatePoints(rotZ(t,PI/4),-4.5,8.1,0)[0],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0)[0],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0)[0]])

var close1 = NUBS(S0)(1)([0,0,1,2,3,4,4])([[0,6,2.05],[0,7,2.05],[0,12.97,2.05],[7.05-dx,12.97,2.05],[8.52-dx,12.97,2.05]])

var close2 = NUBS(S0)(1)([0,0,1,2,3,4,4])([[0,6,2.05+r],[0,7,2.05+r],[0,12.97,2.05+r],[7.05-dx,12.97,2.05+r],[8.52-dx,12.97,2.05+r]])

var close3 = BEZIER(S0)([ptl_xzy[6],translatePoints(ptl_xzy,0,1,0)[6],
                        translatePoints(rotZ(t,PI/4),-4.5,8.1,0)[6],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0)[6],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0)[6]])

var close = mapC([close0,close2,close1,close3]);

var behind0 = T([1])([6])(STRUCT([T([2])([new_heigh*0.1])(CUBOID([0.01,6.97,(x_plane+z_plane+0.1)-(h*40)*0.1])),
                     T([2])([new_heigh*0.1])(CUBOID([l*0.2,6.97,0.01]))
                   ]))

var behind1 = T([1])([12.97])(STRUCT([T([2])([new_heigh*0.1])(CUBOID([6.97,0.01,(x_plane+z_plane+0.1)-(h*40)*0.1])),
                     T([1,2])([-l*0.2,new_heigh*0.1])(CUBOID([6.97,l*0.2,0.01]))
                   ]));

var center_tableD = STRUCT([drs,COLOR([0,0,1])(close),behind0,behind1])


DRAW(center_tableD)

var vector0 = genNUBS(translatePoints(ptl_xzy,0,1,0))[0];

var vector1 = genNUBS(translatePoints(rotZ(t,PI/4),-4.5,8.1,0))[0];

var vector3 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0))[0];

var vector4 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0))[0];

DRAW(COLOR([1,0,0])(vector0))
DRAW(COLOR([1,1,0])(vector1))
DRAW(COLOR([1,0,1])(vector3))
DRAW(COLOR([0,1,1])(vector4))

}
}
