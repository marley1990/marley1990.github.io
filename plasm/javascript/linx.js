



function view(){
 var plasm = document.getElementById("plasm")
      if(plasm == null){
  var message = 'Do you want see the linx model?'

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
        showModel()
  }
}
else{
  alert("First close vision")
}
}



var final_model;

function showModel(){
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

var gray = color(96,123,139,0);

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

var base = T([1])([6-r])(STRUCT([base1,T([1,2])([0.025,h])(base2)]))



var behind = STRUCT([T([1,2])([r-0.05,(new_heigh)*0.1])(CUBOID([0.01,6-2*(r-0.05),(x_plane+z_plane+0.1)-(new_heigh)*0.1])),
                     T([1,2])([r-0.05,(new_heigh)*0.1])(CUBOID([l*0.2,6-2*(new_weigh),0.01]))
                   ]);

var table_leg = white(STRUCT([make_leg(l,r,h),create_plane(y_plane,z_plane,x_plane),base,behind]))

var table_leg23 = white(STRUCT([T([1])([6-r])(make_leg(l,r,h)),create_plane(y_plane,z_plane,x_plane),
                                STRUCT([base1,T([1,2])([0.025,h])(base2)]),behind]))


var table_leg2 = T([0,1])([8.52-dx+0.07,12.97])(R([0,1])(-PI/2)(table_leg23))

/*other accessoris for table_leg*/

var o2 = mapC([create_ptl(l/4,r-0.05,2)[2],
              create_ptl(l/4,r-0.05,2)[0], 
              create_ptl(l/4,r-0.05,4)[0],
              create_ptl(l/4,r-0.05,4)[2],
              create_ptl(l/4,r-0.05,2)[2]
              ])

var o3 = mapC([create_ptl(l/4,r-0.05,2)[2],
              create_ptl(l/4,r-0.05,2)[0], 
              create_ptl(l/4,r-0.05,4)[0],
              create_ptl(l/4,r-0.05,4)[2],
              create_ptl(l/4,r-0.05,2)[2]
              ])

var ptl_T = inverti_coordinate([[0,0,h],[l/2,0,h],[l/2+0.05,(r-0.05)/4,h],[l/2+0.1,(r-0.05)/2,h],[l/2+0.05,(r-0.05),h],[l/2,(r-0.05),h],[0,(r-0.05),h]],1,2)

var ptl_tCenter = [[0,h,(r-0.05)/2]];

var ptl2 = translatePoints(ptl_T,0,6,0);

var ptl2Center = translatePoints(ptl_tCenter,0,6,0);

var ptl3 = mapC([ptl_tCenter[0],
                  genNUBS(ptl_T)[1],
                  genNUBS(ptl2)[1],
                  ptl2Center[0],
                  BEZIER(S0)([[0,h,0],[0,h,r-0.05]]),
                  BEZIER(S0)([[0,h+6,0],[0,h+6,r-0.05]])
                    ])

var o = STRUCT([T([1])([0.025])(o2),T([1])([6-r])(o3),T([1,2])([(r-0.05),2+0.1])(gray(CUBOID([0.01,6-2*(r-0.05),2-0.1]))),
                T([1,2])([-0.065,4])(ptl3)])

o = T([2])([h+r])(o)

table_leg3 = T([1])([12.97-6+0.025])(o);

//end

/*accessoris for table_leg2*/
var o22 = mapC([create_ptl(l/4,r-0.05,2+r)[0], 
              create_ptl(l/4,r-0.05,6+r)[0],
              create_ptl(l/4,r-0.05,6+r)[2],
              create_ptl(l/4,r-0.05,2+r)[2]
              ])

var o23 = mapC([create_ptl(l/4,r-0.05,2+r)[0], 
              create_ptl(l/4,r-0.05,6+r)[0],
              create_ptl(l/4,r-0.05,6+r)[2],
              create_ptl(l/4,r-0.05,2+r)[2]
              ])

var sc2 = STRUCT([o22,T([1])([6-(r-0.05)])(o23),T([1,2])([(r-0.05),2+0.1+r])(gray(CUBOID([0.01,6-2*(r-0.05),4-0.1-h]))),
                  T([1,2])([(r-0.05),2+0.1+h+2+r])(COLOR([1,1,1])(CUBOID([l/2,6-2*(r-0.05),2-0.1-h]))),
                  T([0,1,2])([l/2,(r-0.05),2+0.1+h+2+r])(gray(CUBOID([0.1,6-2*(r-0.05),2-0.1-h])))])


var osc3 = T([0,1])([l/4,6])(R([0,1])(PI)(STRUCT([o22,T([1])([6-(r-0.05)])(o23)])))

var sc3 =  STRUCT([osc3,T([0,1,2])([l/4,(r-0.05),2+0.1+h+r])(gray(CUBOID([0.01,6-2*(r-0.05),4-0.1-h]))),
                  T([0,1,2])([-l/2+l/4,(r-0.05),2+0.1+h+2+r])(COLOR([1,1,1])(CUBOID([l/2,6-2*(r-0.05),2-0.1-h]))),
                  T([0,1,2])([-l/2+l/4-0.1,(r-0.05),2+0.1+h+2+r])(gray(CUBOID([0.1,6-2*(r-0.05),2-0.1-h])))])



table_leg22 = T([0,1,2])([8.52-dx+0.07,12.97,h])(R([0,1])(-PI/2)(sc2))

table_leg4 = T([0,1,2])([8.52-dx+0.07,l/4,h])(R([0,1])(-PI/2)(sc3))

//end

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


var table1 = T([1])([-12.97])(STRUCT([table_leg,table_leg2,center_table]))

var model_temp = STRUCT([table_leg22,o])

var model1 = T([1])([-12.97])(model_temp)

var table2 = R([0,1])(PI/2)(table1);

var model2 =STRUCT([table_leg3,table_leg4])

var final_model1 = STRUCT([model1,model2,table1,table2])

/*  END  finqui oooook*/

var final_model2 = R([0,1])(PI)(final_model1)

/*START*/

var ddz = 0.3+h/2;

var cyl = T([2])([2+r+0.05])(CYL_SURFACE([0.20,4])([20,20]));

var t_support1 = mapC([create_ptl(l/4,r-0.05,2)[2],
              create_ptl(l/4,r-0.05,2)[0], 
              create_ptl(l/4,r-0.05,6)[0],
              create_ptl(l/4,r-0.05,6)[2],
              create_ptl(l/4,r-0.05,2)[2]
              ])


t_support2 = R([0,1])(PI)(t_support1)

support1 = T([1,2])([-12.97+6,0.2+h])(t_support1);

support2 = T([1,2])([-12.97+6+0.15,0.2+h])(t_support2)

support = STRUCT([support1,support2]);

var support_result = STRUCT([support,cyl])

for(var i = 1 ; i<=3; i++){
support_result = STRUCT([support_result,R([0,1])(i*PI/2)(support)])
}

var cubo1 = T([1,2])([-12.97+6+(r-0.05),2+0.35])(gray(CUBOID([0.01,6.8-(r-0.05),2-0.1+ddz])));
var cubo2 = T([0,1,2])([-0.15,-12.97+6+(r-0.05),2+r-0.05+2+ddz+0.1])(CUBOID([0.3,6.8-(r-0.05),0.1]));

var cubo =STRUCT([cubo1,cubo2])
var cubo_result = STRUCT([cubo]);

for(var i = 1 ; i<=3; i++){
cubo_result = STRUCT([cubo_result,R([0,1])(i*PI/2)(cubo)])
}

//rimane 0.2+h

var new_z = 2+r-0.05+2+ddz+0.1;

var dy =-12.97+6+2*(r-0.05)+(6.8-(r-0.05))/2-(r-0.05);

var cubo3 =T([0,1,2])([-0.005,-12.97+6+(r-0.05),new_z])(gray(CUBOID([0.01,(6.8-(r-0.05))/2-(r-0.05),1.2+ddz])));

var heighCstart = new_z
var heighCend = 2+r-0.05+2-0.01+0.1+1.7+ddz


var cubo_support1 = mapC([create_ptl(0.05,r-0.05,heighCstart)[2],
              create_ptl(0.05,r-0.05,heighCstart)[0], 
              create_ptl(0.05,r-0.05,heighCend)[0],
              create_ptl(0.05,r-0.05,heighCend)[2],
              create_ptl(0.05,r-0.05,heighCstart)[2]
              ])

var cubo5 =T([0,1,2])([-0.15,-12.97+6+(r-0.05),new_z+1.2+ddz])(CUBOID([0.3,(6.8-(r-0.05))/2-(r-0.05),0.1]));

var cubo6 =T([0,1,2])([-0.15,dy,new_z+1.2+ddz])(CUBOID([0.3,(6.8-(r-0.05))/2,0.1]));

cubo_support2 = T([1])([dy])(R([0,1])(PI)(cubo_support1))

c_support1 = T([1])([-12.97+6+(6.8-(r-0.05))/2])(cubo_support1);

var cubo4 =T([0,1,2])([-0.005,dy,new_z])(gray(CUBOID([0.01,(6.8-(r-0.05))/2,1.2+ddz])));

var cubo_support = STRUCT([c_support1,cubo3,cubo4,cubo_support2,cubo5,cubo6])

var cubo_support_result = STRUCT([cubo_support])

for(var i = 1 ; i<=3; i++){
cubo_support_result = STRUCT([cubo_support_result,R([0,1])(i*PI/2)(cubo_support)])
}

h = 0;
r = 0.10;
var hend = h+(6.8-(r-0.05))/2-(r-0.05)
var up_point = inverti_coordinate([[0,0,h],[0.1/2,0,h],[0.1/2+0.05,(r-0.05)/4,h],[0.1/2+0.1,(r-0.05)/2,h],[0.1/2+0.05,(r-0.05),h],[0.1/2,(r-0.05),h],[0,(r-0.05),h]],1,2)

var up_Center = [[0,h,(r-0.05)/2]];

var up_t = translatePoints(up_point,0,hend,0);

var uptCenter = translatePoints(up_Center,0,hend,0);

var up1 = mapC([up_Center[0],
                  genNUBS(up_point)[1],
                  genNUBS(up_t)[1],
                  uptCenter[0],
                  BEZIER(S0)([[0,h,0],[0,h,r-0.05]]),
                  BEZIER(S0)([[0,hend,0],[0,hend,r-0.05]])
                    ])

var up2 = T([1])([hend])(R([0,1])(PI)(up1));

var up_1 = T([1,2])([dy,new_z+1.2+ddz+0.1])(STRUCT([up1,up2]))

var up_temp = STRUCT([up_1,T([1])([-0.15-hend])(up_1)])

var up  = STRUCT([up_temp])

for(var i = 1 ; i<=3; i++){
up = STRUCT([up,R([0,1])(i*PI/2)(up_temp)])
}

var sx = scalePoints(ptl_xzy,0.5,0.5,1);
var drsclose_pointsx = translatePoints(scalePoints(ptl_xzy,0.5,0.5,1),0,-(6.8-(r-0.05))/2+0.15,0)
var sxend = BEZIER(S0)([[0,-0.225,2.05],[0,-0.225,2.25]])

var dx2 = scalePoints(translatePoints(rotZ(t,PI/2),l*0.2-dx+1,6+l+4.4,0),0.5,0.5,1)
var drsclose_pointdx = translatePoints(scalePoints(translatePoints(rotZ(t,PI/2),l*0.2-dx+1,6+l+4.4,0),0.5,0.5,1),+(6.8-(r-0.05))/2-0.15,0,0)
var dxend = BEZIER(S0)([[6.675,6.5,2.05],[6.675,6.5,2.25]])


var sxdrs = STRUCT([MAP(BEZIER(S1)([sxend,genNUBS(drsclose_pointsx)[1]]))(domain2D),
            MAP(BEZIER(S1)([genNUBS(sx)[1],genNUBS(drsclose_pointsx)[1]]))(domain2D)])

var dxdrs = STRUCT([MAP(BEZIER(S1)([dxend,genNUBS(drsclose_pointdx)[1]]))(domain2D),
            MAP(BEZIER(S1)([genNUBS(dx2)[1],genNUBS(drsclose_pointdx)[1]]))(domain2D)])

var drscloseScalate =S([0,1])([0.5,0.5])(STRUCT([drs,close]))

var drsclose_T = T([1,2])([-6.55,hend-1.5+ddz+h+0.2])(STRUCT([sxdrs,dxdrs,drscloseScalate]))
var drsclose  = STRUCT([drsclose_T])


for(var i = 1 ; i<=3; i++){
drsclose= STRUCT([drsclose,R([0,1])(i*PI/2)(drsclose_T)])
}


/*END*/

/*other*/
var book = T([0,1,2])([-0.3,-12.97+3,4+2*(r-0.05)+0.25])(orchid(CUBOID([1.5,0.75,0.1])))
/*penna sedia computer*/
var Circle = function(r, h){
var Circum0 = function(v){
return [r*COS(v[0]), r*SIN(v[0]), h];
}
return Circum0;
}

var create_pen = function(r,h){
  var disk = COLOR([1,1,0])(MAP(BEZIER(S1)([Circle(r,0),[0,0,0]]))(DOMAIN([[0,2*PI],[0,1]])([5,5])))
  var disk1 = COLOR([1,1,0])(MAP(BEZIER(S1)([Circle(r,0),Circle(r,h)]))(DOMAIN([[0,2*PI],[0,1]])([5,5])))
  var cyl = COLOR([238/255,207/255,161/255])(MAP(BEZIER(S1)([Circle(r,h),Circle(r*0.7,h+0.08)]))(DOMAIN([[0,2*PI],[0,1]])([5,5])))
    var circle1 = Circle(r*0.7,0)
  var circle2 = Circle(r*0.7,h+0.08)
  var pen1 = MAP(BEZIER(S1)([circle2,circle1]))(DOMAIN([[0,2*PI],[0,1]])([5,5]))
  var pen2 = COLOR([0,0,0])(MAP(BEZIER(S1)([circle2,[0,0,h+0.11]]))(DOMAIN([[0,2*PI],[0,1]])([5,5])))
  return T([0,1])([r,r])(STRUCT([cyl,disk,disk1,pen1,pen2]))

}

var pen = R([1,2])(PI/14)(create_pen(0.05,0.9))
var array_pen = STRUCT([pen])
for(var i = 1 ; i<=4; i++){
array_pen = STRUCT([array_pen,R([0,1])([i*PI/2])(pen)])
}

var circle1 = Circle(0.25,0)
var circle2 = Circle(0.25,0.8)
var base = SKELETON(1)(MAP(BEZIER(S1)([circle1,[0,0,0]]))(DOMAIN([[0,2*PI],[0,1]])([10,10])))
var takepen = SKELETON(1)(MAP(BEZIER(S1)([circle2,circle1]))(DOMAIN([[0,2*PI],[0,1]])([10,10])))
var contenitor_pen = T([0,1,2])([6,-2,2+(r)])(STRUCT([array_pen,COLOR([1,1,1])(STRUCT([base,takepen]))]))
var array_contenitor_pen = STRUCT([contenitor_pen,T([0,1,2])([-4.3,0.6,hend-1.5+ddz+h+0.2+0.15])(contenitor_pen)])
var array_contenitor_pen2 = R([0,1])(PI)(array_contenitor_pen)

/*start computer */
var computer1 = CUBOID([0.1,1,1])
var computer2 = T([0])([0.1])(CUBOID([0.1,0.1,1]))
var computer3 = T([0,1])([0.1,0.9])(CUBOID([0.1,0.1,1]))
var computer4 = T([0,2])([0.1,0.9])(CUBOID([0.1,1,0.1]))
var computer5 = T([0])([0.1])(CUBOID([0.1,1,0.1]))
var scr = COLOR([0,0,0,0.5])(T([0,1,2])([0.15,0.1,0.1])(CUBOID([0.01,0.8,0.8])))
var cylinder = T([1,2])([0.5,-0.3])(CYL_SURFACE([0.1,0.3])([10,10]))
var diskc = T([1,2])([0.5,-0.3])(DISK(0.5,0)([20,20]))
var computer = STRUCT([computer1,computer2,computer3,computer4,computer5,scr,COLOR([0,0,0])(cylinder),COLOR([0,0,0])(diskc)])
var computer_array = STRUCT([T([0,1,2])([1.2,-12.97+3,2+0.601])(computer),
                             T([0,1,2])([2,-12.97+3+4.5,2+0.601])(R([0,1])(PI/6)(computer)) ])
/*end computer*/

/* pc*/

var black = color(0,0,0,0)

var pc_point = [[0,0,0],[0,0,1.3],[0,0.01,1.3],[0,.79,1.3],[0,0.8,1.3],[0,0.8,0],[0,0.8,0]]

var pc_end = BEZIER(S0)([[0,0,0],[0,0.8,0]])

var pc_nubs = NUBS(S0)(1)([0,0,1,2,3,4,5,6,6])(pc_point)

var pc_point1 = [[-0.05,0,0],[-0.05,0,1.4],[-0.05,0.01,1.4],[-0.05,.79,1.4],[-0.05,0.8,1.4],[-0.05,0.8,0],[-0.05,0.8,0]]

var pc_nubs1 = NUBS(S0)(1)([0,0,1,2,3,4,5,6,6])(pc_point1)

var pc_point2 = [[-0.95,0,0],[-0.95,0,1.4],[-0.95,0.01,1.4],[-0.95,.79,1.4],[-0.95,0.8,1.4],[-0.95,0.8,0],[-0.95,0.8,0]]

var pc_nubs2 = NUBS(S0)(1)([0,0,1,2,3,4,5,6,6])(pc_point2)

var pc_point3 = [[-1,0,0],[-1,0,1.3],[-1,0.01,1.3],[-1,.79,1.3],[-1,0.8,1.3],[-1,0.8,0],[-1,0.8,0]]

var pc_nubs3 = NUBS(S0)(1)([0,0,1,2,3,4,5,6,6])(pc_point3)

var pc_end3 = BEZIER(S0)([[-1,0,0],[-1,0.8,0]])

var pc_support1 = black(T([0,1,2])([-1.05,-0.05,-0.1])(CUBOID([1.1,0.9,0.1])))

var pc_support2 = T([0,1])([-0.45,-0.05])(CUBOID([0.1,0.05,0.3]))

var pc_support3 = T([0])([-0.3])(pc_support2);

var pc_support23 = STRUCT([pc_support2,pc_support3]);

var pc_support = black(STRUCT([pc_support23,T([1])([0.85])(pc_support23),pc_support1]))

var pc_map = mapC([pc_end,pc_nubs,pc_nubs1,pc_nubs2,pc_nubs3,pc_end3,pc_end])

var torus = function (R, r) {
  return function (v) {
    var a = v[0];
    var b = v[1];

    var u = (r * COS(a) + R) * COS(b);
    var v = (r * COS(a) + R) * SIN(b);
    var w = (r * SIN(a));

    return [u,v,w];
  }
}

var domainWheel = DOMAIN([[0,2*PI],[0,1]])([20,20])

var wheel1 = MAP(torus(0.08,0.05))(DOMAIN([[0,2*PI],[0,2*PI]])([20,20]))

var wheel2 = T([2])([0.15])(wheel1)

var wheel11 = Circle(0.05,0)

var wheel21 = Circle(0.05,0.1)

var wheel3 = STRUCT([MAP(BEZIER(S1)([wheel11,[0,0,0]]))(domainWheel),
                     MAP(BEZIER(S1)([wheel11,wheel21]))(domainWheel),
                     MAP(BEZIER(S1)([wheel21,[0,0,0.1]]))(domainWheel)
                     ]);

var wheel4 = R([0,2])(-PI/2)(T([1,2])([-0.025/2,0.065])(CUBOID([0.2,0.025,0.025])))

var wheelR = R([1,2])(-PI/2)(STRUCT([wheel1,wheel2,wheel3]))

var wheelRR = STRUCT([wheelR,T([1,2])([0.075,0.05])(wheel4)])

var wheelR2 = T([1])([0.6])(wheelRR)

var wheel = black(STRUCT([wheelRR,wheelR2]))



var pc_t = STRUCT([pc_map,pc_support,T([0,2])([-0.1,-0.1-0.1-0.025])(wheel),T([0,2])([-0.95,-0.1-0.1-0.025])(wheel)]);

var pc = T([0,1,2])([2,-11,0.225])(pc_t)

/*END*/

var final_model = STRUCT([final_model1,final_model2,cyl,support_result,cubo_result,cubo_support_result,up,
  drsclose,book,R([0,1])(PI)(book),array_contenitor_pen,array_contenitor_pen2,computer_array,
  R([0,1])(PI)(computer_array),pc,R([0,1])(PI)(pc)])

DRAW(final_model)




function Animate() {
  var message = 'Do you want to activate the movement of the Marco Barbieri model?'

  var choice = confirm(message)

  if (choice == true) {
    setInterval(function () {
    final_model.rotate([0,1], PI/45)/*.rotate([1,2],PI/45).rotate([0,2],PI/45)*/;
    }, 10);
  }
  

}

Animate()
}


