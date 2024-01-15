let _canvasVideo = null, _canvasAR = null;
let _selectedDOMColorButton = null;

// tweak contours coefficients - 0 -> no tweak:
const mouthWiden = 0.01;
const upperLipOut = 0;//0.01;
const lowerLipOut = 0.005;//0.01;

const SHAPELIPS = {
  name: 'LIPS',

  // list of the points involved in this shape.
  // each point is given as its label
  // the label depends on the used neural network
  // run WEBARROCKSFACE.get_LMLabels() to get all labels
  points: [
    "lipsExt0", // 0
    "lipsExtTop1", // 1
    "lipsExtTop2", // 2
    "lipsExtTop3", // 3
    "lipsExtTop4", // 4
    "lipsExtTop5", // 5

    "lipsExt6", // 6

    "lipsExtBot7", // 7
    "lipsExtBot8", // 8
    "lipsExtBot9", // 9
    "lipsExtBot10", // 10
    "lipsExtBot11", // 11

    "lipsInt12", // 12

    "lipsIntTop13", // 13
    "lipsIntTop14", // 14
    "lipsIntTop15", // 15

    "lipsInt16", // 16

    "lipsIntBot17", // 17
    "lipsIntBot18", // 18
    "lipsIntBot19" // 19
  ],

  // iVals are interpolated values
  // a value is given for each shape point
  // in the same order as points array
  // a value can have between 0 and 4 elements
  // the value will be retrieved in the fragment shader used to color the shape
  // as a float, vec2, vec3 or vec4 depending on its components count
  // it is useful to not color evenly the shape
  // we can apply gradients, smooth borders, ...
  iVals: [
    [1], // lipsExt0
    [1], // lipsExtTop1
    [1], // lipsExtTop2
    [1], // lipsExtTop3
    [1], // lipsExtTop4
    [1], // lipsExtTop5

    [1], // lipsExt6

    [1], // lipsExtBot7
    [1], // lipsExtBot8
    [1], // lipsExtBot9
    [1], // lipsExtBot10
    [1], // lipsExtBot11

    [-1], // lipsInt12

    [-1], // lipsIntTop13
    [-1], // lipsIntTop14
    [-1], // lipsIntTop15

    [-1], // lipsInt16

    [-1], // lipsIntBot17
    [-1], // lipsIntBot18
    [-1] // lipsIntBot1
  ],

  // how to group shape points to draw triangles
  // each value is an index in shape points array
  tesselation: [
    // upper lip:
    0, 1, 13, // each group of 3 indices is a triangular face
    0, 12, 13,
    1, 13, 2,
    2, 13, 14,
    2, 3, 14,
    3, 4, 14,
    14, 15, 4,
    4, 5, 15,
    15, 5, 6,
    15, 6, 16,

    // lower lip:
    0, 12, 19,
    0, 19, 11,
    11, 10, 19,
    10, 18, 19,
    10, 9, 18,
    8, 9, 18,
    8, 17, 18,
    7, 8, 17,
    6, 7, 17,
    6, 17, 16 //*/
  ],

  // interpolated points:
  // to make shape border smoother, we can add computed points
  // each value of this array will insert 2 new points
  // 
  // the first point will be between the first 2 points indices 
  // the second point will be between the last 2 points indices
  // 
  // the first value of ks controls the position of the first interpolated point
  // if -1, it will match the first point, if 0 it will match the middle point
  // the second value of ks controls the position of the second interpolated point
  // if 1, it will match the last point, if 0 it will match the middle point
  // 
  // computed using Cubic Hermite interpolation
  // the point is automatically inserted into the tesselation
  // points are given by their indices in shape points array
  interpolations: [
    { // upper lip sides:
      tangentInfluences: [2, 2, 2],
      points: [1, 2, 3],
      ks: [-0.25, 0.25] // between -1 and 1
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [3, 4, 5],
      ks: [-0.25, 0.25] // between -1 and 1
    },
    { // upper lip middle
      tangentInfluences: [2, 2, 2],
      points: [2, 3, 4],
      ks: [-0.25, 0.25] // between -1 and 1
    },
    { // lower lip middle:
      tangentInfluences: [2, 2, 2],
      points: [10, 9, 8],
      ks: [-0.25, 0.25] // between -1 and 1
    }
  ],

  // we can move points along their normals using the outline feature.
  // an outline is specified by the list of point indices in shape points array
  // it will be used to compute the normals, the inside and the outside
  // 
  // displacement array are the displacement along normals to apply
  // for each point of the outline.
  outlines: [
    { // upper lip. Indices of points in points array:
      points: [
        0,
        1, 2, 3, 4, 5, // exterior
        6, 16,
        15, 14, 13, // interior
        12
      ],
      displacements: [ // displacements, relative to perimeter:
        mouthWiden,
        upperLipOut, upperLipOut, upperLipOut - 0.015, upperLipOut, upperLipOut, // exterior
        0.00, 0,
        0.01, 0.015, 0.01, // interior
        mouthWiden
      ]
    },
    { // lower lip:
      points: [
        12,
        19, 18, 17, // interior
        16, 6,
        7, 8, 9, 10, 11, // exterior
        0
      ],
      displacements: [
        0,
        0.015, 0.02, 0.015,
        0, 0.0,
        lowerLipOut, lowerLipOut, lowerLipOut, lowerLipOut, lowerLipOut,
        0.0
      ]
    }
  ],

  // RENDERING:
  // GLSLFragmentSource is the GLSL source code of the shader used
  // to fill the shape:

  // Debug interpolated vals:
  /*GLSLFragmentSource: "void main(void){\n\
    gl_FragColor = vec4(0.5 + 0.5*iVal, 0., 1.);\n\
  }" //*/

  // uniform color:
  /*GLSLFragmentSource: "void main(void){\n\
    gl_FragColor = vec4(0.1, 0.0, 0.2, 0.5);\n\
  }" //*/

  // debug samplerVideo and vUV:
  /*GLSLFragmentSource: "void main(void){\n\
    gl_FragColor = vec4(0., 1., 0., 1.) * texture2D(samplerVideo, vUV);\n\
  }" //*/

  // color with smooth border:
  GLSLFragmentSource: "\n\
    const vec2 ALPHARANGE = vec2(0.1, 0.6);\n\
    const vec3 LUMA = 1.3 * vec3(0.299, 0.587, 0.114);\n\
    \n\
      float linStep(float edge0, float edge1, float x){\n\
      float val = (x - edge0) / (edge1 - edge0);\n\
      return clamp(val, 0.0, 1.0);\n\
    }\n\
    \n\
    \n\
    void main(void){\n\
      // get grayscale video color:\n\
      vec3 videoColor = texture2D(samplerVideo, vUV).rgb;\n\
      vec3 videoColorGs = vec3(1., 1., 1.) * dot(videoColor, LUMA);\n\
      \n\
      // computer alpha:\n\
      float alpha = 1.0; // no border smoothing\n\
      alpha *= linStep(-1.0, -0.95, abs(iVal)); // interior\n\
      alpha *= 0.5 + 0.5 * linStep(1.0, 0.6, abs(iVal)); // exterior smoothing\n\
      float alphaClamped = ALPHARANGE.x + (ALPHARANGE.y - ALPHARANGE.x) * alpha;\n\
      \n\
      // mix colors:\n\
      vec3 color = videoColorGs * lipstickColor * 2;\n\
      gl_FragColor = vec4(color*alphaClamped, alphaClamped);\n\
      \n\
      // DEBUG ZONE:\n\
      //gl_FragColor = vec4(0., alpha, 0., 1.0);\n\
      //gl_FragColor = vec4(alpha, alpha, alphaClamped, 1.0);\n\
      //gl_FragColor = vec4(0., 1., 0., 1.);\n\
    }",
  // GLSLFragmentSource: "\n\
  //   const vec2 ALPHARANGE = vec2(0.1, 0.6);\n\
  //   const vec3 LUMA = 1.3 * vec3(0.299, 0.587, 0.114);\n\
  //   vec3 glossyHighlightColor = vec3(1.0, 1.0, 1.0); \n\
  //   \n\
  //     float linStep(float edge0, float edge1, float x){\n\
  //     float val = (x - edge0) / (edge1 - edge0);\n\
  //     return clamp(val, 0.0, 1.0);\n\
  //   }\n\
  //   \n\
  //   \n\
  //   void main(void){\n\
  //     // get grayscale video color:\n\
  //     vec3 videoColor = texture2D(samplerVideo, vUV).rgb;\n\
  //     vec3 videoColorGs = vec3(1., 1., 1.) * dot(videoColor, LUMA);\n\
  //     \n\
  //     // computer alpha:\n\
  //     float alpha = 1.0; // no border smoothing\n\
  //     alpha *= linStep(-1.0, -0.95, abs(iVal)); // interior\n\
  //     alpha *= 0.5 + 0.5 * linStep(1.0, 0.6, abs(iVal)); // exterior smoothing\n\
  //     float alphaClamped = ALPHARANGE.x + (ALPHARANGE.y - ALPHARANGE.x) * alpha;\n\
  //     \n\
  //     float glossiness = texture2D(glossinessMap, vUV).r;\n\
  //     vec3 viewDirection = normalize(vec3(0.0, 0.0, 1.0));\n\
  //     float specular = max(dot(viewDirection, normalize(videoColorGs)), 0.0);\n\
  //     specular = pow(specular, 1.0 / glossiness); \n\
  //     vec3 glossyColor = glossyHighlightColor * specular; \n\
  //     vec3 color = videoColorGs * lipstickColor * 1.5; // Adjust saturation as needed\n\
  //     color += glossyColor; \n\
  //     gl_FragColor = vec4(color*alphaClamped, alphaClamped);\n\
  //     \n\
  //     // DEBUG ZONE:\n\
  //     //gl_FragColor = vec4(0., alpha, 0., 1.0);\n\
  //     //gl_FragColor = vec4(alpha, alpha, alphaClamped, 1.0);\n\
  //     //gl_FragColor = vec4(0., 1., 0., 1.);\n\
  //   }",

  uniforms: [{
    name: 'lipstickColor',
    value: [0.77254901961, 0.36470588235, 0.41960784314]
  }]
}; //end SHAPELIPS

const borderHardness = {
  eyes: 0.7,
  forehead: 0.8,
  chin: 0.3,
  mouth: 0.7
};

const SHAPEFACE = {
  // list of the points involved in this shape.
  // each point is given as its label
  // the label depends on the used neural network
  // run WEBARROCKSFACE.get_LMLabels() to get all labels
  name: 'TEXT',
  points: [
    // LIPS:
    "lipsExt0", // 0

    "lipsExtTop1",
    "lipsExtTop2",
    "lipsExtTop3",
    "lipsExtTop4",
    "lipsExtTop5",

    "lipsExt6",

    "lipsExtBot7",
    "lipsExtBot8",
    "lipsExtBot9",
    "lipsExtBot10", // 10
    "lipsExtBot11",

    "lipsInt12",

    "lipsIntTop13",
    "lipsIntTop14",
    "lipsIntTop15",

    "lipsInt16",

    "lipsIntBot17",
    "lipsIntBot18",
    "lipsIntBot19",

    // EYES:
    "eyeRightInt0", // 20
    "eyeRightTop0",
    "eyeRightTop1",
    "eyeRightExt0",
    "eyeRightBot0",
    "eyeRightBot1",
    "eyeRightOut0",
    "eyeRightOut1",
    "eyeRightOut2",
    "eyeRightOut3",

    "eyeLeftInt0", // 30
    "eyeLeftTop0",
    "eyeLeftTop1",
    "eyeLeftExt0",
    "eyeLeftBot0",
    "eyeLeftBot1",
    "eyeLeftOut0",
    "eyeLeftOut1",
    "eyeLeftOut2",
    "eyeLeftOut3",

    // CHEEKS:
    "cheekRightExt0", // 40
    "cheekRightExt1",
    "cheekRightExt2",
    "cheekRightExt3",
    "cheekRightExt4",
    "cheekRightExt5",
    "cheekRightInt0",

    "cheekLeftExt0",
    "cheekLeftExt1",
    "cheekLeftExt2",
    "cheekLeftExt3", // 50
    "cheekLeftExt4",
    "cheekLeftExt5",
    "cheekLeftInt0",

    // CONTOUR:
    "contourChinCtr0", // 54

    "contourRightChin0",
    "contourRightJaw0",
    "contourRightEar0",
    "contourRightEar1",
    "contourRightTemple0",
    "contourRightForehead0", // 60

    "contourLeftChin0",
    "contourLeftJaw0",
    "contourLeftEar0",
    "contourLeftEar1",
    "contourLeftTemple0",
    "contourLeftForehead0",

    "contourForheadCtr0" // 67
  ],

  // iVals are interpolated values
  // a value is given for each shape point
  // in the same order as points array
  // a value can have between 0 and 4 elements
  // the value will be retrieved in the fragment shader used to color the shape
  // as a float, vec2, vec3 or vec4 depending on its components count
  // it is useful to not color evenly the shape
  // we can apply gradients, smooth borders, ...
  // 
  // Here iVals are UV coordinates. To get them:
  //   * Open dev/faceTextured.blend
  //   * Select the face mesh in OBJECT mode
  //   * Open the Blender console and copy/paste dev/BlenderGetUVs.py
  //   
  // then I added the 2 values before each UV coordinate:
  //  * the 1st is whether the point belongs to a border (0 if on the border, 1 otherwise)
  //  * the second is the border hardness (0 -> smooth border, 1 -> hard border)
  // 
  iVals: [
    [1, borderHardness.mouth, 0.38919299840927124, 0.3237859904766083], // 0
    [1, borderHardness.mouth, 0.4305570125579834, 0.35324400663375854],
    [1, borderHardness.mouth, 0.4704410135746002, 0.3655099868774414],
    [1, borderHardness.mouth, 0.49974799156188965, 0.36793699860572815],
    [1, borderHardness.mouth, 0.5290539860725403, 0.36551299691200256],
    [1, borderHardness.mouth, 0.5689389705657959, 0.35325300693511963], // 5
    [1, borderHardness.mouth, 0.6103219985961914, 0.32381001114845276],
    [1, borderHardness.mouth, 0.5616750121116638, 0.3025819957256317],
    [1, borderHardness.mouth, 0.5328940153121948, 0.2971160113811493],
    [1, borderHardness.mouth, 0.49974799156188965, 0.2952269911766052],
    [1, borderHardness.mouth, 0.466607004404068, 0.2971140146255493], // 10
    [1, borderHardness.mouth, 0.4378330111503601, 0.3025769889354706],
    [0, borderHardness.mouth, 0.43960699439048767, 0.3253540098667145],
    [0, borderHardness.mouth, 0.46800699830055237, 0.335191011428833],
    [0, borderHardness.mouth, 0.49974799156188965, 0.33763501048088074],
    [0, borderHardness.mouth, 0.5314909815788269, 0.335193008184433], // 15
    [0, borderHardness.mouth, 0.5587869882583618, 0.32603898644447327],
    [0, borderHardness.mouth, 0.5313119888305664, 0.3223080039024353],
    [0, borderHardness.mouth, 0.49974900484085083, 0.3212139904499054],
    [0, borderHardness.mouth, 0.46818798780441284, 0.3223069906234741],
    [0, borderHardness.eyes, 0.39028099179267883, 0.5844590067863464], // 20
    [0, borderHardness.eyes, 0.3610830008983612, 0.5894529819488525],
    [0, borderHardness.eyes, 0.31834501028060913, 0.5864850282669067],
    [0, borderHardness.eyes, 0.2996639907360077, 0.5829010009765625],
    [0, borderHardness.eyes, 0.3231379985809326, 0.5792419910430908],
    [0, borderHardness.eyes, 0.3505229949951172, 0.5755299925804138], // 25
    [1, borderHardness.eyes, 0.24607500433921814, 0.5751919746398926],
    [1, borderHardness.eyes, 0.286965012550354, 0.6318539977073669],
    [1, borderHardness.eyes, 0.378248006105423, 0.6521350145339966],
    [1, borderHardness.eyes, 0.4497089982032776, 0.6134210228919983],
    [0, borderHardness.eyes, 0.6100460290908813, 0.5844659805297852], // 30
    [0, borderHardness.eyes, 0.6385059952735901, 0.5894529819488525],
    [0, borderHardness.eyes, 0.6832119822502136, 0.5887060165405273],
    [0, borderHardness.eyes, 0.6999220252037048, 0.5829010009765625],
    [0, borderHardness.eyes, 0.6764460206031799, 0.5792409777641296],
    [0, borderHardness.eyes, 0.6490600109100342, 0.575531005859375], // 35
    [1, borderHardness.eyes, 0.7581250071525574, 0.5751889944076538],
    [1, borderHardness.eyes, 0.7126079797744751, 0.6318539977073669],
    [1, borderHardness.eyes, 0.6213319897651672, 0.6521350145339966],
    [1, borderHardness.eyes, 0.5498589873313904, 0.6134210228919983],
    [1, borderHardness.chin, 0.3263629972934723, 0.3199169933795929], // 40
    [1, borderHardness.chin, 0.38306599855422974, 0.4545249938964844],
    [1, borderHardness.chin, 0.38513800501823425, 0.529017984867096],
    [1, borderHardness.chin, 0.23065899312496185, 0.5072849988937378],
    [1, borderHardness.chin, 0.2066890001296997, 0.3882339894771576],
    [1, borderHardness.chin, 0.2624650001525879, 0.2924579977989197], // 45
    [1, borderHardness.chin, 0.26894301176071167, 0.40658798813819885],
    [1, borderHardness.chin, 0.6733589768409729, 0.3199169933795929],
    [1, borderHardness.chin, 0.6164309978485107, 0.4545249938964844],
    [1, borderHardness.chin, 0.6164789795875549, 0.5275689959526062],
    [1, borderHardness.chin, 0.7690550088882446, 0.5072849988937378], // 50
    [1, borderHardness.chin, 0.7945070266723633, 0.3857809901237488],
    [1, borderHardness.chin, 0.7375400066375732, 0.2924579977989197],
    [1, borderHardness.chin, 0.7310709953308105, 0.40658798813819885],
    [0, borderHardness.chin, 0.5, 0.16923600435256958],
    [0, borderHardness.chin, 0.4147990047931671, 0.17605599761009216], // 55
    [0, borderHardness.chin, 0.2763719856739044, 0.20104800164699554],
    [0, borderHardness.chin, 0.11736500263214111, 0.29304400086402893],
    [0, borderHardness.forehead, 0.15203000605106354, 0.5684999823570251],
    [0, borderHardness.forehead, 0.2633129954338074, 0.7315890192985535],
    [0, borderHardness.forehead, 0.34400901198387146, 0.7739139795303345], // 60
    [0, borderHardness.chin, 0.585178017616272, 0.17605599761009216],
    [0, borderHardness.chin, 0.7236279845237732, 0.20104800164699554],
    [0, borderHardness.chin, 0.8826900124549866, 0.29291799664497375],
    [0, borderHardness.forehead, 0.850246012210846, 0.5677970051765442],
    [0, borderHardness.forehead, 0.7317180037498474, 0.7325220108032227], // 65
    [0, borderHardness.forehead, 0.6494290232658386, 0.7746469974517822],
    [0, borderHardness.forehead, 0.496410995721817, 0.7962639927864075]
  ],


  frontFacing: 'CCW', // for backface culling

  // how to group shape points to draw triangles
  // each value is an index in shape points array
  tesselation: [
    // upper lip:
    0, 13, 1, // each group of 3 indices is a triangular face
    0, 12, 13,
    1, 13, 2,
    2, 13, 14,
    2, 14, 3,
    3, 14, 4,
    14, 15, 4,
    4, 15, 5,
    15, 6, 5,
    15, 16, 6,

    // lower lip:
    0, 19, 12,
    0, 11, 19,
    11, 10, 19,
    10, 18, 19,
    10, 9, 18,
    9, 8, 18,
    8, 17, 18,
    8, 7, 17,
    7, 6, 17,
    6, 16, 17, //*/

    // upper right eye;
    20, 29, 28,
    20, 28, 21,
    21, 28, 27,
    21, 27, 22,
    22, 27, 26,
    22, 26, 23,

    // upper left eye:
    30, 38, 39,
    30, 31, 38,
    31, 37, 38,
    31, 32, 37,
    32, 36, 37,
    32, 33, 36,

    // right cheek:
    40, 41, 46,
    41, 42, 46,
    42, 43, 46,
    43, 44, 46,
    44, 45, 46,
    45, 40, 46,

    // left cheek:
    47, 53, 48,
    48, 53, 49,
    49, 53, 50,
    50, 53, 51,
    51, 53, 52,
    52, 53, 47,

    // chin right:
    54, 9, 10,
    54, 10, 11,
    55, 11, 0,
    55, 54, 11,
    56, 55, 0,
    56, 0, 40,
    56, 40, 45,
    56, 45, 57,
    57, 45, 44,

    // chin left:
    54, 8, 9,
    54, 7, 8,
    54, 61, 7,
    61, 6, 7,
    61, 62, 6,
    62, 47, 6,
    62, 52, 47,
    62, 63, 52,
    63, 51, 52,

    // nose area right:
    0, 1, 40,
    1, 41, 40,
    1, 2, 41,
    2, 3, 41,
    41, 29, 42,
    42, 29, 20,
    42, 20, 25,
    42, 25, 24,
    3, 29, 41,

    // nose area left:
    6, 47, 5,
    5, 47, 48,
    4, 5, 48,
    3, 4, 48,
    3, 48, 39,
    48, 49, 39,
    49, 30, 39,
    49, 35, 30,
    49, 34, 35,

    // nose center:
    3, 39, 29,
    29, 39, 67,

    // forehead right:
    29, 67, 28,
    28, 67, 60,
    27, 28, 60,
    27, 60, 59,
    58, 27, 59,
    58, 26, 27,

    // forehead left:
    39, 38, 67,
    38, 66, 67,
    38, 37, 66,
    37, 65, 66,
    37, 64, 65,
    36, 64, 37,

    // temple right:
    43, 42, 24,
    43, 24, 23,
    43, 23, 26,
    43, 26, 58,
    44, 43, 58,
    57, 44, 58,

    // temple left:
    49, 50, 34,
    34, 50, 33,
    50, 36, 33,
    50, 64, 36,
    50, 51, 64,
    51, 63, 64
  ],

  // interpolated points:
  // to make shape border smoother, we can add computed points
  // each value of this array will insert 2 new points
  // 
  // the first point will be between the first 2 points indices 
  // the second point will be between the last 2 points indices
  // 
  // the first value of ks controls the position of the first interpolated point
  // if -1, it will match the first point, if 0 it will match the middle point
  // the second value of ks controls the position of the second interpolated point
  // if 1, it will match the last point, if 0 it will match the middle point
  // 
  // computed using Cubic Hermite interpolation
  // the point is automatically inserted into the tesselation
  // points are given by their indices in shape points array
  interpolations: [
    // top of right eye smoother:
    {
      tangentInfluences: [2, 2, 2],
      points: [20, 21, 22],
      ks: [-0.5, 0.33] // between -1 and 1
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [21, 22, 23],
      ks: [-0.33, 0.5]
    },

    // bottom of right eye smoother:
    {
      tangentInfluences: [2, 2, 2],
      points: [24, 25, 20],
      ks: [-0.33, 0.5]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [23, 24, 25],
      ks: [-0.5, 0.33]
    },

    // top of left eye smoother:
    {
      tangentInfluences: [2, 2, 2],
      points: [32, 31, 30],
      ks: [-0.33, 0.5]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [33, 32, 31],
      ks: [-0.5, 0.33]
    },

    // bottom of left eye smoother:
    {
      tangentInfluences: [2, 2, 2],
      points: [30, 35, 34],
      ks: [-0.5, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [35, 34, 33],
      ks: [-0.33, 0.5]
    },

    // right forehead smoother:
    {
      tangentInfluences: [2, 2, 2],
      points: [60, 67, 66],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [59, 60, 67],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [58, 59, 60],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [57, 58, 59],
      ks: [-0.33, 0.33]
    },

    // left forehead smoother:
    {
      tangentInfluences: [2, 2, 2],
      points: [67, 66, 65],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [66, 65, 64],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [65, 64, 63],
      ks: [-0.33, 0.33]
    },

    // right lower jaw:
    {
      tangentInfluences: [2, 2, 2],
      points: [54, 55, 56],
      ks: [-0.5, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [55, 56, 57],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [56, 57, 58],
      ks: [-0.33, 0.33]
    },

    // left lower jaw:
    {
      tangentInfluences: [2, 2, 2],
      points: [62, 61, 54],
      ks: [-0.33, 0.5]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [63, 62, 61],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [64, 63, 62],
      ks: [-0.33, 0.33]
    },

    // mouth top:
    {
      tangentInfluences: [2, 2, 2],
      points: [14, 13, 12],
      ks: [-0.33, 0.5]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [15, 14, 13],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [16, 15, 14],
      ks: [-0.5, 0.33]
    },

    // mouth bottom:
    {
      tangentInfluences: [2, 2, 2],
      points: [12, 19, 18],
      ks: [-0.5, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [19, 18, 17],
      ks: [-0.33, 0.33]
    },
    {
      tangentInfluences: [2, 2, 2],
      points: [18, 17, 16],
      ks: [-0.33, 0.5]
    }
  ],

  // we can move points along their normals using the outline feature.
  // an outline is specified by the list of point indices in shape points array
  // it will be used to compute the normals, the inside and the outside
  // 
  // displacement array are the displacement along normals to apply
  // for each point of the outline.
  outlines: [
    { // upper lip. Indices of points in points array:
      points: [
        0,
        1, 2, 3, 4, 5, // exterior
        6, 16,
        15, 14, 13, // interior
        12
      ],
      displacements: [ // displacements, relative to perimeter:
        0,
        0, 0, 0, 0, 0, // exterior
        0, 0,
        0.02, 0.03, 0.02, // interior
        0
      ]
    },
    { // lower lip:
      points: [
        12,
        19, 18, 17, // interior
        16, 6,
        7, 8, 9, 10, 11, // exterior
        0
      ],
      displacements: [
        0,
        0.02, 0.03, 0.02,
        0, 0,
        0, 0, 0, 0, 0,
        0.0
      ]
    },

    // right top eye higher:
    /*{
      points: [20,21,22,23,24,25],
      displacements: [0.07,0.06,0.02,0.05,0,0,0,0]
    },
    // left top eye higher:
    {
      points: [30,31,32,33,34,35],
      displacements: [0.07,0.06,0.02,0.05,0,0,0,0]
    }*/
  ],

  // RENDERING:
  // GLSLFragmentSource is the GLSL source code of the shader used
  // to fill the shape:

  GLSLFragmentSource: "void main(void){\n\
    float borderThreshold = 1. - iVal.y;\n\
    float isInside = min(iVal.x / borderThreshold, 1.0);\n\
    // compute makeup color:\n\
    vec4 color = texture2D(color, iVal.zw);\n\
    // compute transparency:\n\
    float alpha = color.a * isInside;\n\
    // output color:\n\
    gl_FragColor = vec4(alpha * color.rgb, alpha);\n\
    \n\
    // DEBUG ZONE:\n\
    //gl_FragColor = vec4(0., 1., 0., 1.);\n\
  }",

  textures: [{
    id: 'color',
    src: 'assets/makeup2.png'
  }],
  // uniforms: [{
  //   name: 'color', //ERROR WHEN USED
  //   value: "assets/makeup2.png"
  // }]
}; // END SHAPEFACE

function start() {
  WebARRocksFaceShape2DHelper.init({
    NNCPath: './neuralNets/NN_LIPS_8.json',
    canvasVideo: _canvasVideo,
    canvasAR: _canvasAR,
    shapes: [SHAPELIPS]
    // ,videoURL: '../../../../testVideos/1032526922-hd.mov'
    //,videoURL: '../../../../testVideos/1057538806-hd.mp4'
  }).then(function () {

  }).catch(function (err) {
    throw new Error(err);
  });
}

function startTexture() {
  WebARRocksFaceShape2DHelper.init({
    NNCPath: './neuralNets/NN_FULLMAKEUP_5.json',
    canvasVideo: _canvasVideo,
    canvasAR: _canvasAR,
    shapes: [SHAPEFACE]
    //,videoURL: '../../../../testVideos/1032526922-hd.mov'
  }).then(function () {
    console.log('READY');
  }).catch(function (err) {
    throw new Error(err);
  });
}

// function change_NN() {
//   WebARRocksFaceShape2DHelper.change_NN({
//     NNCPath: './neuralNets/NN_LIPS_8.json',
//     canvasVideo: _canvasVideo,
//     canvasAR: _canvasAR,
//     shapes: [SHAPELIPS]
//   }).then(function () {
//     console.log("NN Changed");
//   });
// }


// entry point:
function main() {
  _canvasAR = document.getElementById('WebARRocksFaceCanvasAR');
  _canvasVideo = document.getElementById('WebARRocksFaceCanvasVideo');

  // _selectedDOMColorButton = document.getElementById('colorRed');

  WebARRocksResizer.size_canvas({
    canvas: _canvasVideo,
    overlayCanvas: [_canvasAR],
    callback: start,
    isFullScreen: true
  });
}

function mainTexture() {
  _canvasAR = document.getElementById('WebARRocksFaceCanvasAR');
  _canvasVideo = document.getElementById('WebARRocksFaceCanvasVideo');

  WebARRocksResizer.size_canvas({
    canvas: _canvasVideo,
    overlayCanvas: [_canvasAR],
    callback: startTexture,
    isFullScreen: true
  });
}


function change_lipstickColor(color) {//, event){
  // _selectedDOMColorButton.classList.remove('controlButtonSelected');
  // const domLink = event.target;
  // domLink.classList.add('controlButtonSelected');
  // _selectedDOMColorButton = domLink;
  WebARRocksFaceShape2DHelper.set_uniformValue('LIPS', 'lipstickColor', color);
}

function change_lipstickTexture(imageName) {
  // mainTexture(imageName);
  console.log(SHAPEFACE);
  console.log(SHAPEFACE.textures);
  WebARRocksFaceShape2DHelper.updateShape(SHAPEFACE, 'TEXT');
}


window.addEventListener('load', main);

// rgba(0.82352941176, 0.36862745098, 0.38431372549, 1.0) #d25e62
// rgba(0.75294117647, 0.37254901961, 0.45098039216, 1.0) #c05f73
// rgba(0.77254901961, 0.36470588235, 0.41960784314, 1.0) #c55d6b
// rgba(0.76862745098, 0.41176470588, 0.45490196078, 1.0) #c46974
// rgba(0.76470588235, 0.41960784314, 0.50196078431, 1.0) #c36b80
// rgba(0.9568627451, 0.34901960784, 0.42745098039, 1.0) #f4596d
// rgba(0.8862745098, 0.27843137255, 0.34901960784, 1.0) #e24759
// rgba(0.86666666667, 0.32156862745, 0.37254901961, 1.0) #dd525f
// rgba(0.80784313725, 0.18823529412, 0.20392156863, 1.0) #ce3034
// rgba(0.78039215686, 0.18039215686, 0.20392156863, 1.0) #c72e34
// rgba(0.87450980392, 0.29411764706, 0.27058823529, 1.0) #df4b45
// rgba(0.8, 0.29019607843, 0.26666666667, 1.0) #cc4a44
// rgba(0.78431372549, 0.39215686275, 0.69803921569, 1.0) #c864b2
// rgba(0.98431372549, 0.32941176471, 0.32941176471, 1.0) #fb5454
// rgba(0.96862745098, 0.41176470588, 0.36470588235, 1.0) #f7695d
// rgba(0.73333333333, 0.39607843137, 0.51764705882, 1.0) #bb6584
// rgba(0.69019607843, 0.43137254902, 0.42745098039, 1.0) #b06e6d
// rgba(0.7137254902, 0.42352941176, 0.40392156863, 1.0) #b66c67
// rgba(0.83529411765, 0.54117647059, 0.45098039216, 1.0) #d58a73
// rgba(0.6862745098, 0.38039215686, 0.32549019608, 1.0) #af6153
// rgba(0.61568627451, 0.28235294118, 0.21568627451, 1.0) #9d4837
// rgba(0.63921568627, 0.21568627451, 0.21568627451, 1.0) #a33737
// rgba(0.68235294118, 0.29411764706, 0.26274509804, 1.0) #ae4b43
// rgba(0.62745098039, 0.22745098039, 0.34117647059, 1.0) #a03a57
// rgba(0.60784313725, 0.25490196078, 0.36078431373, 1.0) #9b415c
// rgba(0.82745098039, 0.4862745098, 0.52156862745, 1.0) #d37c85
// rgba(0.74509803922, 0.36470588235, 0.52549019608, 1.0) #be5d86
// rgba(0.84705882353, 0.32941176471, 0.41568627451, 1.0) #d8546a
// rgba(0.85490196078, 0.32549019608, 0.45490196078, 1.0) #da5374
// rgba(0.78431372549, 0.36078431373, 0.63137254902, 1.0) #c85ca1
// rgba(0.81176470588, 0.39215686275, 0.39607843137, 1.0) #cf6465