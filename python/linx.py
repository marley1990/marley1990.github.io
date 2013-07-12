
from pyplasm import *

DRAW = VIEW

domain = GRID([5])
domain2D = GRID([10,10])

##support function
def GRID(args):
    model = ([[]],[[0]])
    for k,steps in enumerate(args):
        model = larExtrude(model,steps*[1])
    V,cells = model
    verts = AA(list)(scipy.array(V) / AA(float)(args))
    return MKPOL([verts, AA(AA(lambda h:h+1))(cells), None])

##scalate object and then translate resulted-oject  SBAGLIATO
def RT(axisR,rotates):
	def RT0(axisT, translate):
		def RT00(ob):
			return T(axisT)(translate)(R(axisR)(rotates)(ob));
		return RT00;
	return RT0;

def color(r,g,b,o):
	def color0(ob):
		if(o == 0):
			return COLOR([r/255,g/255,b/255])(ob);
		else:
			return COLOR([r/255,g/255,b/255,o])(ob);
	return color0;

white  = COLOR([1,.98,.98]);

gray = COLOR([0.62,0.71,0.80])

orchid = COLOR(PURPLE)

def inverti_coordinate(array,coordinata1,coordinata2):
	for i in range(0,len(array)):
		##inverto x e y
		if((coordinata1 == 0 and coordinata2 == 1) or (coordinata1 == 1 and coordinata2 == 0)):
			a_supp = array[i][0];
			array[i][0] = array[i][1];
			array[i][1] = a_supp ;
			i = i+1;
    
		if((coordinata1 == 0 and coordinata2 == 2) or (coordinata1 == 2 and coordinata2 == 0)):
			a_supp = array[i][0];
			array[i][0] = array[i][2];
			array[i][2] = a_supp ;
			i = i+1;
     
		if((coordinata1 == 2 and coordinata2 == 1) or (coordinata1 == 1 and coordinata2 == 2)):
			a_supp = array[i][2];
			array[i][2] = array[i][1];
			array[i][1] = a_supp ;
			i = i+1;
    
	return array;

def NUBSPLINE(degree,totpoints=80):
	def NUBSPLINE1(knots):
		def NUBSPLINE2(points):
			m=len(knots)
			tmin=min(knots)
			tmax=max(knots)
			tsiz=tmax-tmin
			v=[tsiz/float(totpoints-1) for i in range(totpoints-1)]
			assert len(v)+1==totpoints
			v=[-tmin] + v
			domain=QUOTE(v)
			return BSPLINE(degree)(knots)(points)
		return NUBSPLINE2
	return NUBSPLINE1

def genNUBS (controlPoints):
	domain = INTERVALS(1)(20)
	knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
	nubs = BEZIER(S1)(controlPoints)
	curve = MAP(nubs)(domain)
	return [curve,nubs]

def translatePoints (arrayOfPoints,dx,dy,dz):
	result = [];
	for point in arrayOfPoints:
		x,y,z = point;
		result.append([x+dx,y+dy,z+dz])
	return result

def scalePoints(arrayOfPoints,sx,sy,sz):
	result = [];
	for point in arrayOfPoints:
		x,y,z = point;
		result.append([x*sx,y*sy,z*sz])
	return result

def rotZ (arrayOfPoints,a):
	result = [];
	for point in arrayOfPoints:
		x,y,z = point;
		result.append([COS(a)*x+SIN(a)*y+0,-SIN(a)*x+COS(a)*y+0,0+0+1*z]);
	return result;

def create_ptl(l,r,h):
	ptl = [[0,0,h],[l,0,h],[l+0.05,r/4,h],[l+0.1,r/2,h],[l+0.05,r,h],[l,r,h],[0,r,h]];
	center = [0,r/2,h];
	end = BEZIER(S1)([[0,0,h],[0,r,h]]);
	return [genNUBS(ptl)[1],center,end,ptl];

def mapC(args):
	result = [];
	for i in range(0,len(args)-1):
		result.append(MAP(BEZIER(S2)([args[i],args[i+1]]))(GRID([10,10])));
    
	return STRUCT(result);

def make_leg(l,r,h):
	arrayleg1 = create_ptl(l,r,0);
	arrayleg2 = create_ptl(l,r,h);

	leg1 = mapC([ arrayleg1[2],
	arrayleg1[0], 
	arrayleg2[0],
	arrayleg2[2],
	arrayleg1[2]
	])
	arrayleg3 = create_ptl(l-0.05,r-0.05,0);
	arrayleg4 = create_ptl(l-0.05,r-0.05,h*40);

  	leg2 = mapC([arrayleg3[0], 
	arrayleg4[0],
	arrayleg4[2],
	arrayleg3[2]
    ])

	behind = CUBOID([0.025,0.2,2+h])
	leg = STRUCT([leg1,T([1,2,3])([0.025,0.025,h])(leg2),behind])
	return white(leg);

def create_plane(l,r,h):
	arrayplane1 = create_ptl(l,r,h);
	arrayplane2 =  create_ptl(l,r,h+6)

	plane = mapC([arrayplane1[2],
              arrayplane1[0], 
              arrayplane2[0],
              arrayplane2[2],
              arrayplane1[2]
              ])

	plane_RT = white(RT([2,3],-PI/2)([2,3],[-h,x_plane+z_plane])(plane))

	return plane_RT;


## table leg

dx = 1.62

l = 2.60;
r = 0.2;
h = 0.05;

x_plane = h*41;
y_plane = l;
z_plane = r;

new_heigh = h*40
new_prof = l/2;
new_weigh = r-0.05;

##  DRAW(MAP(BEZIER(S1)([create_ptl(l,r,0)[2],create_ptl(l,r,0)[0]]))(domain2D))

base1 = mapC([create_ptl(l,r,0)[2],
			create_ptl(l,r,0)[0], 
			create_ptl(l,r,h)[0],
			create_ptl(l,r,h)[2],
			create_ptl(l,r,0)[2]
			])

base2 = mapC([create_ptl(new_prof,new_weigh,0)[0], 
              create_ptl(new_prof,new_weigh,new_heigh)[0],
              create_ptl(new_prof,new_weigh,new_heigh)[2],
              create_ptl(new_prof,new_weigh,0)[2]
              ])

base = T([2])([6-r])(STRUCT([base1,T([2,3])([0.025,h])(base2)]))



behind = STRUCT([T([2,3])([r-0.05,(new_heigh)*0.1])(CUBOID([0.01,6-2*(r-0.05),(x_plane+z_plane+0.1)-(new_heigh)*0.1])),
                     T([2,3])([r-0.05,(new_heigh)*0.1])(CUBOID([l*0.2,6-2*(new_weigh),0.01]))
                   ]);

table_leg = white(STRUCT([make_leg(l,r,h),create_plane(y_plane,z_plane,x_plane),base,behind]))

table_leg23 = white(STRUCT([T([2])([6-r])(make_leg(l,r,h)),create_plane(y_plane,z_plane,x_plane),
                                STRUCT([base1,T([2,3])([0.025,h])(base2)]),behind]))


table_leg2 = T([1,2])([8.52-dx+0.07,12.97])(R([1,2])(-PI/2)(table_leg23))

##other accessoris for table_leg*/

o2 = mapC([create_ptl(l/4,r-0.05,2)[2],
              create_ptl(l/4,r-0.05,2)[0], 
              create_ptl(l/4,r-0.05,4)[0],
              create_ptl(l/4,r-0.05,4)[2],
              create_ptl(l/4,r-0.05,2)[2]
              ])

o3 = mapC([create_ptl(l/4,r-0.05,2)[2],
              create_ptl(l/4,r-0.05,2)[0], 
              create_ptl(l/4,r-0.05,4)[0],
              create_ptl(l/4,r-0.05,4)[2],
              create_ptl(l/4,r-0.05,2)[2]
              ])

ptl_T = inverti_coordinate([[0,0,h],[l/2,0,h],[l/2+0.05,(r-0.05)/4,h],[l/2+0.1,(r-0.05)/2,h],[l/2+0.05,(r-0.05),h],[l/2,(r-0.05),h],[0,(r-0.05),h]],1,2)

ptl_tCenter = [[0,h,(r-0.05)/2]];

ptl2 = translatePoints(ptl_T,0,-6.05,0);

ptl2Center = translatePoints(ptl_tCenter,0,-6.05,0);

ptl3 = mapC([ptl_tCenter[0],
                  genNUBS(ptl_T)[1],
                  genNUBS(ptl2)[1],
                  ptl2Center[0],
                  BEZIER(S1)([[0,h,0],[0,h,r-0.05]]),
                  BEZIER(S1)([[0,h-6.05,0],[0,h-6.05,r-0.05]])
                    ])

o = STRUCT([T([2])([0.025])(o2),T([2])([6-r])(o3),T([2,3])([(r-0.05),2+0.1])(gray(CUBOID([0.01,6-2*(r-0.05),2-0.1]))),
                T([2,3])([-0.065+6.05+0.05,4])(white(ptl3))])

o = white(T([3])([h+r])(o))

table_leg3 = T([2])([12.97-6+0.025])(o);
##end


##accessoris for table_leg2*/
o22 = mapC([create_ptl(l/4,r-0.05,2+r)[0], 
              create_ptl(l/4,r-0.05,6+r)[0],
              create_ptl(l/4,r-0.05,6+r)[2],
              create_ptl(l/4,r-0.05,2+r)[2]
              ])

o23 = mapC([create_ptl(l/4,r-0.05,2+r)[0], 
              create_ptl(l/4,r-0.05,6+r)[0],
              create_ptl(l/4,r-0.05,6+r)[2],
              create_ptl(l/4,r-0.05,2+r)[2]
              ])

sc2 = STRUCT([o22,T([2])([6-(r-0.05)])(o23),T([2,3])([(r-0.05),2+0.1+r])(gray(CUBOID([0.01,6-2*(r-0.05),4-0.1-h]))),
                  T([2,3])([(r-0.05),2+0.1+h+2+r])(white(CUBOID([l/2,6-2*(r-0.05),2-0.1-h]))),
                  T([1,2,3])([l/2,(r-0.05),2+0.1+h+2+r])(gray(CUBOID([0.1,6-2*(r-0.05),2-0.1-h])))])


osc3 = T([1,2])([l/4,6])(R([1,2])(PI)(STRUCT([o22,T([2])([6-(r-0.05)])(o23)])))

sc3 =  STRUCT([osc3,T([1,2,3])([l/4,(r-0.05),2+0.1+h+r])(gray(CUBOID([0.01,6-2*(r-0.05),4-0.1-h]))),
                  T([1,2,3])([-l/2+l/4,(r-0.05),2+0.1+h+2+r])(white(CUBOID([l/2,6-2*(r-0.05),2-0.1-h]))),
                  T([1,2,3])([-l/2+l/4-0.1,(r-0.05),2+0.1+h+2+r])(gray(CUBOID([0.1,6-2*(r-0.05),2-0.1-h])))])



table_leg22 = T([1,2,3])([8.52-dx+0.07,12.97,h])(R([1,2])(-PI/2)(sc2))

table_leg4 = T([1,2,3])([8.52-dx+0.07,l/4,h])(R([1,2])(-PI/2)(sc3))

##end
##middle worksurface

ptl_xzy = [[0,6,2.25],[2.60,6,2.25],[2.65,6,2.2],[2.7,6,2.15],[2.65,6,2.05],[2.60,6,2.05],[0,6,2.05]]

vector = genNUBS(ptl_xzy)[1]

t = translatePoints(ptl_xzy,0,1,0);

vector0 = genNUBS(translatePoints(ptl_xzy,0,1,0))[1];

vector1 = genNUBS(translatePoints(rotZ(t,PI/4),-4.5,8.1,0))[1];

vector3 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0))[1];

vector4 = genNUBS(translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0))[1];

curve_center = []; curve_center.append(vector); curve_center.append(vector0); curve_center.append(vector1); curve_center.append(vector3);
curve_center.append(vector4);

drs = MAP(BEZIER(S2)(curve_center))(GRID([10,10]));

close0 = BEZIER(S1)([ptl_xzy[0],translatePoints(ptl_xzy,0,1,0)[0],
                        translatePoints(rotZ(t,PI/4),-4.5,8.1,0)[0],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0)[0],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0)[0]])

close1 = BEZIER(S1)([[0,6,2.05],[0,7,2.05],[0,7,2.05],[0,7.5,2.05],[0,8,2.05],[0,8.5,2.05],[0,9,2.05],[0,9.5,2.05],[0,10,2.05]
	,[0,10.5,2.05],[0,11.5,2.05],[0,11.7,2.05],[0,11.9,2.05],[0,12.1,2.05],[0,12.3,2.05],[0,12.5,2.05]
	,[0,12.9,2.05],[0,12.91,2.05],[0,12.93,2.05],[0,12.94,2.05],[0,12.95,2.05],[0,12.96,2.05],[0,12.965,2.05],
	[0,12.97,2.05],[1.63-dx,12.97,2.05],[1.80-dx,12.97,2.05],[1.9-dx,12.97,2.05],[1.95-dx,12.97,2.05]
	,[2.05-dx,12.97,2.05],[2.05-dx,12.97,2.05],[3.05-dx,12.97,2.05],[4.05-dx,12.97,2.05],
	[5.05-dx,12.97,2.05],[6.05-dx,12.97,2.05],[7.05-dx,12.97,2.05],[8.52-dx,12.97,2.05]])

close2 = BEZIER(S1)([[0,6,2.05+r],[0,7,2.05+r],[0,7,2.05+r],[0,7.5,2.05+r],[0,8,2.05+r],[0,8.5,2.05+r],[0,9,2.05+r],[0,9.5,2.05+r],[0,10,2.05+r]
	,[0,10.5,2.05+r],[0,11.5,2.05+r],[0,11.7,2.05+r],[0,11.9,2.05+r],[0,12.1,2.05+r],[0,12.3,2.05+r],[0,12.5,2.05+r]
	,[0,12.9,2.05+r],[0,12.91,2.05+r],[0,12.93,2.05+r],[0,12.94,2.05+r],[0,12.95,2.05+r],[0,12.96,2.05+r],[0,12.965,2.05+r],
	[0,12.97,2.05+r],[1.63-dx,12.97,2.05+r],[1.80-dx,12.97,2.05+r],[1.9-dx,12.97,2.05+r],[1.95-dx,12.97,2.05+r]
	,[2.05+r-dx,12.97,2.05+r],[2.05+r-dx,12.97,2.05+r],[3.05-dx,12.97,2.05+r],[4.05-dx,12.97,2.05+r],
	[5.05-dx,12.97,2.05+r],[6.05-dx,12.97,2.05+r],[7.05-dx,12.97,2.05+r],[8.52-dx,12.97,2.05+r]])

close3 = BEZIER(S1)([ptl_xzy[6],translatePoints(ptl_xzy,0,1,0)[6],
                        translatePoints(rotZ(t,PI/4),-4.5,8.1,0)[6],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+0.07,6+l+4.37,0)[6],
                        translatePoints(rotZ(t,PI/2),l*0.2-dx+1.07,6+l+4.37,0)[6]])

close = mapC([close0,close2,close1,close3]);

behind0 = T([2])([6])(STRUCT([T([3])([new_heigh*0.1])(CUBOID([0.01,6.97,(x_plane+z_plane+0.1)-(h*40)*0.1])),
                     T([3])([new_heigh*0.1])(CUBOID([l*0.2,6.97,0.01]))
                   ]))

behind1 = T([2])([12.97])(STRUCT([T([3])([new_heigh*0.1])(CUBOID([6.97,0.01,(x_plane+z_plane+0.1)-(h*40)*0.1])),
                     T([2,3])([-l*0.2,new_heigh*0.1])(CUBOID([6.97,l*0.2,0.01]))
                   ]));

center_table = white(STRUCT([drs,close,behind0,behind1]))


table1 = T([2])([-12.97])(STRUCT([table_leg,table_leg2,center_table]))

model_temp = STRUCT([table_leg22,o])

model1 = T([2])([-12.97])(model_temp)

table2 = R([1,2])(PI/2)(table1);

model2 =STRUCT([table_leg3,table_leg4])

final_model1 = STRUCT([model1,model2,table1,table2])

##END  finqui oooook*/

final_model2 = R([1,2])(PI)(final_model1)

## start

ddz = 0.3+h/2;

cyl = T([3])([2+r+0.05])(CYLINDER([0.20,4])(20));

t_support1 = mapC([create_ptl(l/4,r-0.05,2)[2],
              create_ptl(l/4,r-0.05,2)[0], 
              create_ptl(l/4,r-0.05,6)[0],
              create_ptl(l/4,r-0.05,6)[2],
              create_ptl(l/4,r-0.05,2)[2]
              ])


t_support2 = R([1,2])(PI)(t_support1)

support1 = T([2,3])([-12.97+6,0.2+h])(t_support1);

support2 = T([2,3])([-12.97+6+0.15,0.2+h])(t_support2)

support = STRUCT([support1,support2]);

support_result = STRUCT([support,cyl,R([1,2])(1*PI/2)(support),R([1,2])(2*PI/2)(support),R([1,2])(3*PI/2)(support)])

cubo1 = T([2,3])([-12.97+6+(r-0.05),2+0.35])(gray(CUBOID([0.01,6.8-(r-0.05),2-0.1+ddz])));
cubo2 = T([1,2,3])([-0.15,-12.97+6+(r-0.05),2+r-0.05+2+ddz+0.1])(CUBOID([0.3,6.8-(r-0.05),0.1]));

cubo =STRUCT([cubo1,cubo2])
cubo_result = STRUCT([cubo,R([1,2])(1*PI/2)(cubo),R([1,2])(2*PI/2)(cubo),R([1,2])(3*PI/2)(cubo)]);


##rimane 0.2+h
new_z = 2+r-0.05+2+ddz+0.1;

dy =-12.97+6+2*(r-0.05)+(6.8-(r-0.05))/2-(r-0.05);

cubo3 =T([1,2,3])([-0.005,-12.97+6+(r-0.05),new_z])(gray(CUBOID([0.01,(6.8-(r-0.05))/2-(r-0.05),1.2+ddz])));

heighCstart = new_z
heighCend = 2+r-0.05+2-0.01+0.1+1.7+ddz


cubo_support1 = mapC([create_ptl(0.05,r-0.05,heighCstart)[2],
              create_ptl(0.05,r-0.05,heighCstart)[0], 
              create_ptl(0.05,r-0.05,heighCend)[0],
              create_ptl(0.05,r-0.05,heighCend)[2],
              create_ptl(0.05,r-0.05,heighCstart)[2]
              ])

cubo5 =T([1,2,3])([-0.15,-12.97+6+(r-0.05),new_z+1.2+ddz])(CUBOID([0.3,(6.8-(r-0.05))/2-(r-0.05),0.1]));

cubo6 =T([1,2,3])([-0.15,dy,new_z+1.2+ddz])(CUBOID([0.3,(6.8-(r-0.05))/2,0.1]));

cubo_support2 = T([2])([dy])(R([1,2])(PI)(cubo_support1))

c_support1 = T([2])([-12.97+6+(6.8-(r-0.05))/2])(cubo_support1);

cubo4 =T([1,2,3])([-0.005,dy,new_z])(gray(CUBOID([0.01,(6.8-(r-0.05))/2,1.2+ddz])));

cubo_support = STRUCT([c_support1,cubo3,cubo4,cubo_support2,cubo5,cubo6])

cubo_support_result = STRUCT([cubo_support,R([1,2])(1*PI/2)(cubo_support),R([1,2])(2*PI/2)(cubo_support),R([1,2])(3*PI/2)(cubo_support)])

h = 0;
r = 0.10;
hend = h+(6.8-(r-0.05))/2-(r-0.05)
up_point = inverti_coordinate([[0,0,h],[0.1/2,0,h],[0.1/2+0.05,(r-0.05)/4,h],[0.1/2+0.1,(r-0.05)/2,h],[0.1/2+0.05,(r-0.05),h],[0.1/2,(r-0.05),h],[0,(r-0.05),h]],1,2)

up_Center = [[0,h,(r-0.05)/2]];

up_t = translatePoints(up_point,0,hend,0);

uptCenter = translatePoints(up_Center,0,hend,0);

up1 = mapC([up_Center[0],
                  genNUBS(up_point)[1],
                  genNUBS(up_t)[1],
                  uptCenter[0],
                  BEZIER(S1)([[0,h,0],[0,h,r-0.05]]),
                  BEZIER(S1)([[0,hend,0],[0,hend,r-0.05]])
                    ])

up2 = T([2])([hend])(R([1,2])(PI)(up1));

up_1 = T([2,3])([dy,new_z+1.2+ddz+0.1])(STRUCT([up1,up2]))

up_temp = STRUCT([up_1,T([2])([-0.15-hend])(up_1)])

up  = STRUCT([up_temp,R([1,2])(1*PI/2)(up_temp),R([1,2])(2*PI/2)(up_temp),R([1,2])(3*PI/2)(up_temp)])

sx = scalePoints(ptl_xzy,0.5,0.5,1);
drsclose_pointsx = translatePoints(scalePoints(ptl_xzy,0.5,0.5,1),0,-(6.8-(r-0.05))/2+0.15,0)
sxend = BEZIER(S1)([[0,-0.225,2.05],[0,-0.225,2.25]])

dx2 = scalePoints(translatePoints(rotZ(t,PI/2),l*0.2-dx+1,6+l+4.4,0),0.5,0.5,1)
drsclose_pointdx = translatePoints(scalePoints(translatePoints(rotZ(t,PI/2),l*0.2-dx+1,6+l+4.4,0),0.5,0.5,1),+(6.8-(r-0.05))/2-0.15,0,0)
dxend = BEZIER(S1)([[6.675,6.5,2.05],[6.675,6.5,2.25]])


sxdrs = STRUCT([MAP(BEZIER(S2)([genNUBS(drsclose_pointsx)[1],sxend]))(GRID([10,10])),
            MAP(BEZIER(S2)([genNUBS(drsclose_pointsx)[1],genNUBS(sx)[1]]))(GRID([10,10]))])

dxdrs = STRUCT([MAP(BEZIER(S2)([dxend,genNUBS(drsclose_pointdx)[1]]))(GRID([10,10])),
            MAP(BEZIER(S2)([genNUBS(dx2)[1],genNUBS(drsclose_pointdx)[1]]))(GRID([10,10]))])

drscloseScalate =S([1,2])([0.5,0.5])(STRUCT([drs,close]))

drsclose_T = T([2,3])([-6.55,hend-1.5+ddz+h+0.2])(STRUCT([sxdrs,dxdrs,drscloseScalate]))
drsclose  = STRUCT([drsclose_T,R([1,2])(1*PI/2)(drsclose_T),R([1,2])(2*PI/2)(drsclose_T),R([1,2])(3*PI/2)(drsclose_T),R([1,2])(4*PI/2)(drsclose_T)])


##END

##other
book = orchid(T([1,2,3])([-0.3,-12.97+3,4+2*(r-0.05)+0.25])(CUBOID([1.5,0.75,0.1])))

##penna sedia computer*/
def Circle(r, h):
	def Circum0(v):
		return [r*COS(v[0]), r*SIN(v[0]), h];
	return Circum0;

domainPI = PROD([INTERVALS(2*PI)(10),INTERVALS(1)(10)])

def create_pen(r,h):
	disk = COLOR([1,1,0])(MAP(BEZIER(S2)([Circle(r,0),[0,0,0]]))(domainPI))
	disk1 = COLOR([1,1,0])(MAP(BEZIER(S2)([Circle(r,0),Circle(r,h)]))(domainPI))
	cyl = COLOR([238/255,207/255,161/255])(MAP(BEZIER(S2)([Circle(r,h),Circle(r*0.7,h+0.08)]))(domainPI))
	circle1 = Circle(r*0.7,0)
	circle2 = Circle(r*0.7,h+0.08)
	pen1 = MAP(BEZIER(S2)([circle2,circle1]))(domainPI)
	pen2 = COLOR([0,0,0])(MAP(BEZIER(S2)([circle2,[0,0,h+0.11]]))(domainPI))
	return T([1,2])([r,r])(STRUCT([cyl,disk,disk1,pen1,pen2]))


pen = R([2,3])(PI/14)(create_pen(0.05,0.9))
array_pen = STRUCT([pen,R([1,2])(1*PI/2)(pen),R([1,2])(2*PI/2)(pen),R([1,2])(3*PI/2)(pen),R([1,2])(4*PI/2)(pen)])


circle1 = Circle(0.25,0)
circle2 = Circle(0.25,0.8)
base = SKELETON(1)(MAP(BEZIER(S2)([circle1,[0,0,0]]))(domainPI))
takepen = SKELETON(1)(MAP(BEZIER(S2)([circle2,circle1]))(domainPI))
contenitor_pen = T([1,2,3])([6,-2,2+(r)])(STRUCT([array_pen,COLOR([1,1,1])(STRUCT([base,takepen]))]))
array_contenitor_pen = STRUCT([contenitor_pen,T([1,2,3])([-4.3,0.6,hend-1.5+ddz+h+0.2+0.15])(contenitor_pen)])

array_contenitor_pen2 = STRUCT([array_contenitor_pen,R([1,2])(2*PI/2)(array_contenitor_pen)])



##start computer */
computer1 = CUBOID([0.1,1,1])
computer2 = T([1])([0.1])(CUBOID([0.1,0.1,1]))
computer3 = T([1,2])([0.1,0.9])(CUBOID([0.1,0.1,1]))
computer4 = T([1,3])([0.1,0.9])(CUBOID([0.1,1,0.1]))
computer5 = T([1])([0.1])(CUBOID([0.1,1,0.1]))
scr = COLOR([0,0,0,0.5])(T([1,2,3])([0.15,0.1,0.1])(CUBOID([0.01,0.8,0.8])))
cylinder = T([2,3])([0.5,-0.3])(CYLINDER([0.1,0.3])(10))
diskc = T([2,3])([0.5,-0.3])(CIRCLE(0.5)([20,20]))
computer = STRUCT([computer1,computer2,computer3,computer4,computer5,scr,COLOR([0,0,0])(cylinder),COLOR([0,0,0])(diskc)])
computer_array = STRUCT([T([1,2,3])([1.2,-12.97+3,2+0.601])(computer),T([1,2,3])([2,-12.97+3+4.5,2+0.601])(R([1,2])(PI/6)(computer)) ])
##end computer*/

##pc*/

black = color(0,0,0,0)

pc_point = [[0,0,0],[0,0,1.3],[0,0.01,1.3],[0,.79,1.3],[0,0.8,1.3],[0,0.8,0],[0,0.8,0]]

pc_end = BEZIER(S1)([[0,0,0],[0,0.8,0]])

pc_nubs = BSPLINE(1)([0,0,1,2,3,4,5,6,6])(pc_point)

pc_point1 = [[-0.05,0,0],[-0.05,0,1.4],[-0.05,0.01,1.4],[-0.05,.79,1.4],[-0.05,0.8,1.4],[-0.05,0.8,0],[-0.05,0.8,0]]

pc_nubs1 = BSPLINE(1)([0,0,1,2,3,4,5,6,6])(pc_point1)

pc_point2 = [[-0.95,0,0],[-0.95,0,1.4],[-0.95,0.01,1.4],[-0.95,.79,1.4],[-0.95,0.8,1.4],[-0.95,0.8,0],[-0.95,0.8,0]]

pc_nubs2 = BSPLINE(1)([0,0,1,2,3,4,5,6,6])(pc_point2)

pc_point3 = [[-1,0,0],[-1,0,1.3],[-1,0.01,1.3],[-1,.79,1.3],[-1,0.8,1.3],[-1,0.8,0],[-1,0.8,0]]

pc_nubs3 = BSPLINE(1)([0,0,1,2,3,4,5,6,6])(pc_point3)

pc_end3 = BEZIER(S1)([[-1,0,0],[-1,0.8,0]])

pc_support1 = black(T([1,2,3])([-1.05,-0.05,-0.1])(CUBOID([1.1,0.9,0.1])))

pc_support2 = T([1,2])([-0.45,-0.05])(CUBOID([0.1,0.05,0.3]))

pc_support3 = T([1])([-0.3])(pc_support2);

pc_support23 = STRUCT([pc_support2,pc_support3]);

pc_support = black(STRUCT([pc_support23,T([2])([0.85])(pc_support23),pc_support1]))

pc_map = white(T([1])([-1])(CUBOID([1,0.8,1.3])))

wheel1 = TORUS([0.05,0.08])([20,20])

wheel2 = T([3])([0.09])(wheel1)

wheel11 = Circle(0.05,0)

wheel21 = Circle(0.05,0.1)

wheel3 = STRUCT([MAP(BEZIER(S2)([wheel11,[0,0,0]]))(domainPI),
                    MAP(BEZIER(S2)([wheel11,wheel21]))(domainPI),
                    MAP(BEZIER(S2)([wheel21,[0,0,0.1]]))(domainPI)
                    ]);

wheel4 = R([1,3])(PI/2)(T([2,3])([-0.025/2,0.065])(CUBOID([0.2,0.025,0.025])))

wheelR = R([2,3])(-PI/2)(STRUCT([wheel1,wheel2,wheel3]))

wheelRR = STRUCT([wheelR,T([1,2])([0.075,0.05])(wheel4)])

wheelR2 = T([2])([0.6])(wheelRR)

wheel = black(STRUCT([wheelRR,wheelR2]))

pc_t = STRUCT([pc_map,pc_support,T([1,3])([-0.1,-0.1-0.1-0.025])(wheel),T([1,3])([-0.95,-0.1-0.1-0.025])(wheel)]);

pc = T([1,2,3])([2,-11,0.225])(pc_t)

pc_array = STRUCT([pc,R([1,2])(2*PI/2)(pc)])

wheel4R = STRUCT([T([2,3])([0.3,-0.1-0.1-0.025])(wheel),T([1,2,3])([-0.75,0.3,-0.1-0.1-0.025])(wheel)])

w = 1;

h3 = 1.5;

n = 1

def create_stair(w,h3,n):
	front1 = white(CUBOID([w,0.1,h3*(n)]));
	up1 = white(T([3])([h3*(n)])(CUBOID([w,w,0.1])));
	left1 = white(R([1,2])(PI/2)(CUBOID([w,0,h3*(n)])));
	righ3t1 = T([2])([w-0.1])(front1)
	down = white(CUBOID([w,w]));
	stair1 = STRUCT([front1,up1,left1,righ3t1,down]);
	return stair1;



draw_board0 = white(T([2,3])([(w)*0.2,h3*0.1])(CUBOID([w-0.1,0.05,(h3/2)*0.8]))); 

draw_down = COLOR([0,0,0])(T([2,3])([(w)*0.2,(h3/2)*0.2])(CUBOID([w-0.1,w*0.6])))

draw_board1 = T([2])([(w)*0.6])(draw_board0);

draw_board = T([1])([0.1])(STRUCT([draw_board0,draw_down,draw_board1]))

draw_righ3t = white(T([1])([w])(CUBOID([0.1,w,h3/2])))

draw_object = STRUCT([draw_board ,draw_righ3t])

drawer1 = STRUCT([draw_object,T([3])([h3/2+0.05])(S([3])([0.5])(draw_object)),T([3])([h3/2+h3/4+0.1])(S([3])([0.5])(draw_object)),
        create_stair(w,h3,n)])

drawer = T([1,2,3])([8.52-dx+0.07+4.9,-1.4,0.275])(R([1,2])(-PI/2)(STRUCT([drawer1,T([1,2])([w,-0.25])(wheel4R)])))

array_drawer = STRUCT([drawer,R([1,2])(1*PI/2)(drawer),R([1,2])(2*PI/2)(drawer),R([1,2])(3*PI/2)(drawer)])


final_model = STRUCT([final_model1,final_model2,cyl,support_result,cubo_result,cubo_support_result,up,
	drsclose,book,R([1,2])(PI)(book),array_contenitor_pen2,computer_array,
	R([1,2])(PI)(computer_array),pc_array,array_drawer
	])

DRAW(final_model)

