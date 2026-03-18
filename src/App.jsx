import React, { useState, useCallback, useRef, useEffect } from "react";

const ALL_EXPIRIES = ["1w","1m","2m","3m","6m","9m","1y","18m","2y","3y","4y","5y","6y","7y","8y","9y","10y","12y","15y","20y","25y","30y"];
const TENORS       = ["1Y","2Y","3Y","4Y","5Y","7Y","10Y","12Y","15Y","20Y","25Y","30Y"];
const BANKS        = ["ANZ","BARC","BNPP","BOA","CBA","CITI","CS","DB","GS","HSBC","JPM","MACQ","MIZUHO","MS","MUF","NAB","NOMURA","RBC","SG","SMBC","TD","UBS","WBC","WFC","NWM","LLOY","STAN","ING"];
const BANK_COLORS  = {
  JPM:"#4a8fd4",GS:"#7ab0d4",MS:"#4a7ab0",BOA:"#d44a4a",CITI:"#4a4ad4",
  BARC:"#4ab0d4",DB:"#d4874a",UBS:"#d4d44a",BNPP:"#4ad484",SG:"#d44a84",
  HSBC:"#d44a4a",NAB:"#e05080",ANZ:"#4a4ab0",CBA:"#d4aa4a",WBC:"#4ad4aa",
  RBC:"#4ab08a",TD:"#4aaa4a",CS:"#aaaaaa",MACQ:"#aa4ad4",NOMURA:"#d4aa4a",
  MIZUHO:"#4ad44a",SMBC:"#d44aaa",MUF:"#aad44a",NWM:"#8a9ab0",
  LLOY:"#4a7a4a",STAN:"#d4604a",ING:"#e08030",WFC:"#6a4ad4",
};
const bkc = (b) => BANK_COLORS[b] || "#6a9ab0";

const AUD_FWD = {
  "1w":  [3.976,4.060,4.134,4.448,4.511,4.642,4.793,4.869,4.943,4.996,4.997,4.983],
  "1m":  [4.000,4.068,4.158,4.460,4.523,4.653,4.802,4.877,4.949,5.001,5.002,4.987],
  "2m":  [4.036,4.079,4.190,4.477,4.539,4.667,4.814,4.888,4.958,5.008,5.008,4.993],
  "3m":  [4.076,4.090,4.223,4.493,4.555,4.682,4.826,4.898,4.967,5.015,5.014,4.999],
  "6m":  [4.219,4.127,4.332,4.545,4.604,4.726,4.863,4.930,4.993,5.036,5.032,5.017],
  "9m":  [4.191,4.165,4.452,4.597,4.654,4.771,4.899,4.962,5.019,5.057,5.050,5.035],
  "1y":  [4.132,4.202,4.580,4.648,4.704,4.815,4.935,4.993,5.045,5.078,5.068,5.052],
  "18m": [4.030,4.392,4.632,4.707,4.766,4.872,4.986,5.035,5.079,5.104,5.090,5.074],
  "2y":  [4.274,4.818,4.804,4.860,4.904,4.986,5.078,5.114,5.143,5.154,5.133,5.117],
  "3y":  [5.390,5.089,5.038,5.075,5.096,5.142,5.201,5.230,5.235,5.225,5.192,5.175],
  "4y":  [4.773,4.848,4.921,5.004,5.055,5.121,5.190,5.211,5.224,5.207,5.175,5.162],
  "5y":  [4.928,5.000,5.051,5.128,5.155,5.218,5.264,5.264,5.275,5.239,5.200,5.189],
  "6y":  [5.077,5.117,5.161,5.212,5.240,5.280,5.306,5.305,5.300,5.257,5.219,5.206],
  "7y":  [5.160,5.206,5.220,5.278,5.311,5.328,5.332,5.333,5.310,5.263,5.227,5.214],
  "8y":  [5.255,5.253,5.279,5.346,5.347,5.372,5.352,5.355,5.314,5.261,5.229,5.215],
  "9y":  [5.252,5.292,5.335,5.365,5.374,5.375,5.363,5.346,5.309,5.250,5.223,5.210],
  "10y": [5.334,5.381,5.361,5.400,5.416,5.382,5.376,5.340,5.304,5.237,5.217,5.205],
  "12y": [5.321,5.353,5.384,5.384,5.368,5.364,5.324,5.294,5.248,5.199,5.184,5.175],
  "15y": [5.238,5.255,5.271,5.320,5.335,5.274,5.229,5.189,5.145,5.131,5.125,5.122],
  "20y": [5.060,5.060,5.061,5.091,5.092,5.048,5.009,5.016,5.023,5.032,5.035,5.037],
  "25y": [4.898,4.893,4.887,4.910,4.904,4.944,4.975,4.986,4.997,5.008,5.014,5.018],
  "30y": [5.031,5.031,5.031,5.061,5.061,5.061,5.061,5.061,5.061,5.061,5.061,5.061],
};

const AUD_PREM = {
  "1w":  [6.96,  14.96, 23.41, 31.51, 39.51, 53.61, 70.72, 80.43, 93.70, 112.05,122.43,130.91],
  "1m":  [14.83, 31.91, 49.54, 66.10, 82.31, 111.35,147.46,167.10,193.59,228.51,253.36,271.07],
  "2m":  [21.66, 46.37, 71.33, 94.36, 116.70,157.36,209.00,236.29,272.55,318.37,356.53,381.40],
  "3m":  [27.37, 58.04, 88.56, 116.50,143.44,192.88,256.47,289.96,333.86,388.25,435.49,465.50],
  "6m":  [41.56, 85.24, 127.78,166.97,204.60,273.58,362.82,412.09,474.94,554.06,613.33,654.84],
  "9m":  [52.34, 105.44,156.38,203.89,249.63,332.64,440.02,499.64,574.23,668.47,742.01,796.86],
  "1y":  [61.93, 122.81,180.56,234.67,285.79,380.62,502.65,570.59,654.11,760.34,843.03,909.11],
  "18m": [77.49, 150.65,219.07,283.37,342.81,456.57,600.81,682.31,780.08,905.21,1000.24,1082.27],
  "2y":  [86.50, 168.22,245.16,317.64,387.78,512.79,672.03,762.56,872.25,1011.11,1123.46,1211.34],
  "3y":  [100.51,195.30,283.47,366.45,447.59,593.95,776.24,881.61,1008.09,1163.62,1292.91,1392.66],
  "4y":  [109.30,211.83,307.81,399.17,487.58,643.85,844.84,957.83,1096.15,1267.43,1404.34,1509.87],
  "5y":  [114.34,222.73,324.17,419.53,511.09,675.61,885.74,1005.64,1152.73,1333.43,1476.34,1587.57],
  "6y":  [117.41,228.66,332.04,428.97,521.70,689.65,905.63,1027.00,1178.02,1366.56,1517.54,1633.59],
  "7y":  [118.63,231.14,334.92,431.85,524.34,693.38,912.19,1033.34,1186.49,1380.17,1537.55,1656.93],
  "8y":  [118.74,231.37,336.19,432.71,525.60,693.91,911.47,1026.67,1185.44,1379.75,1543.05,1671.70],
  "9y":  [117.85,229.61,334.60,431.35,522.03,688.95,903.45,1021.64,1174.97,1368.19,1536.35,1663.22],
  "10y": [116.08,226.20,330.69,424.77,515.25,679.51,889.46,1005.74,1157.06,1348.42,1519.98,1649.51],
  "12y": [113.01,219.68,320.52,411.31,498.55,660.40,867.26,981.89,1123.41,1327.65,1497.73,1598.17],
  "15y": [104.34,202.91,295.57,380.51,461.59,613.00,814.01,920.88,1047.70,1265.87,1429.74,1485.52],
  "20y": [91.29, 176.77,257.14,331.97,403.40,538.63,723.73,831.61,981.41,1097.31,1215.49,1303.23],
  "25y": [78.99, 153.25,222.68,287.57,349.46,477.04,652.81,747.91,879.84,981.91,1084.83,1160.62],
  "30y": [74.88, 143.99,208.84,269.42,327.11,439.77,592.11,673.55,786.76,873.80,959.72,1022.57],
};

const AUD_MID = {
  "1w":  [64.34, 70.48, 74.92, 77.3,  79.24, 80.2,  79.06, 78.28, 77.87, 77.62, 75.02, 73.49],
  "1m":  [66.05, 72.39, 76.34, 78.09, 79.51, 80.24, 79.42, 78.35, 77.51, 76.27, 74.8,  73.32],
  "2m":  [68.44, 74.62, 77.97, 79.09, 79.99, 80.47, 79.89, 78.64, 77.46, 75.43, 74.72, 73.23],
  "3m":  [70.83, 76.5,  79.3,  80,    80.55, 80.82, 80.34, 79.09, 77.77, 75.4,  74.81, 73.26],
  "6m":  [76.77, 80.19, 81.71, 81.92, 82.1,  81.94, 81.27, 80.39, 79.14, 76.98, 75.38, 73.73],
  "9m":  [79.69, 81.76, 82.49, 82.53, 82.66, 82.24, 81.39, 80.5,  79.04, 76.73, 75.34, 74.12],
  "1y":  [82.43, 83.26, 83.35, 83.14, 82.84, 82.4,  81.44, 80.54, 78.89, 76.48, 75.01, 74.1 ],
  "18m": [85.77, 85.07, 84.34, 83.75, 82.92, 82.53, 81.33, 80.49, 78.65, 76.13, 74.41, 73.75],
  "2y":  [84.52, 84.07, 83.55, 83.12, 83.07, 82.13, 80.65, 79.77, 78,    75.43, 74.13, 73.21],
  "3y":  [83.95, 83.45, 82.57, 81.98, 82,    81.41, 79.79, 79.02, 77.26, 74.4,  73.1,  72.11],
  "4y":  [82.81, 82.05, 81.3,  81.01, 81.07, 80.15, 78.93, 78.05, 76.39, 73.68, 72.17, 71.05],
  "5y":  [81.05, 80.78, 80.22, 79.76, 79.65, 78.9,  77.69, 76.95, 75.45, 72.79, 71.22, 70.12],
  "6y":  [79.6,  79.36, 78.67, 78.11, 77.9,  77.21, 76.18, 75.37, 73.95, 71.52, 70.16, 69.14],
  "7y":  [78.1,  77.94, 77.12, 76.45, 76.14, 75.52, 74.66, 73.79, 72.46, 70.24, 69.1,  68.16],
  "8y":  [76.78, 76.64, 76.07, 75.35, 75.08, 74.35, 73.38, 72.11, 71.18, 69,    68.12, 67.54],
  "9y":  [75.46, 75.35, 75.03, 74.45, 73.92, 73.18, 72.1,  71.12, 69.9,  67.75, 67.14, 66.51],
  "10y": [74.13, 74.05, 73.98, 73.15, 72.8,  72.01, 70.81, 69.82, 68.62, 66.52, 66.16, 65.69],
  "12y": [72.89, 72.64, 72.43, 71.54, 71.13, 70.65, 69.65, 68.72, 67.11, 65.9,  65.57, 64   ],
  "15y": [70.04, 69.8,  69.46, 68.76, 68.42, 68.08, 67.76, 66.74, 64.72, 64.92, 64.65, 61.43],
  "20y": [68,    67.4,  66.9,  66.38, 66.08, 65.96, 66.24, 66.19, 66.54, 61.75, 60.3,  59.12],
  "25y": [66.64, 66.12, 65.5,  64.95, 64.6,  65.88, 67.41, 67.19, 67.36, 62.42, 60.81, 59.5 ],
  "30y": [72.5,  71.35, 70.6,  69.99, 69.6,  69.97, 70.49, 69.78, 69.48, 64.09, 62.08, 60.5 ],
};

// Heatmap: pure blue scale, mode-aware
// vol/prem ranges defined per-currency inside component
const heatBg = (val, min, max) => {
  const t = val == null ? 0 : Math.max(0, Math.min(1, (val - min) / (max - min)));
  // darkest: rgba(8,15,50,0.25)  brightest: rgba(30,110,230,0.75)
  const r = Math.round(8  + t * 22);
  const g = Math.round(15 + t * 95);
  const b = Math.round(50 + t * 180);
  const a = (0.25 + t * 0.50).toFixed(4);
  return `rgba(${r},${g},${b},${a})`;
};
const premiumHeatBg = (prem) => heatBg(prem, 6, 1700);

const USD_FWD = {
  "1w": [3.18843,3.48896,3.78458,4.07486,4.34678,4.01495,3.90353,3.55869,3.03023,2.99675,2.93845,2.88829],
  "1m": [3.2249,3.5267,3.82271,4.11311,4.35567,4.02376,3.89985,3.55143,3.03011,2.99614,2.93772,2.88792],
  "2m": [3.2761,3.5777,3.87359,4.16386,4.36698,4.03524,3.89489,3.54181,3.02995,2.99534,2.93677,2.88745],
  "3m": [3.33096,3.63057,3.92574,4.21558,4.37784,4.04664,3.88965,3.53192,3.02974,2.9945,2.93578,2.88694],
  "6m": [3.48345,3.78306,4.07808,4.3676,4.4003,4.07485,3.86816,3.49714,3.0259,2.98939,2.93063,2.88351],
  "9m": [3.63607,3.93567,4.23052,4.51973,4.40903,4.09598,3.8388,3.45548,3.01868,2.98152,2.92315,2.87809],
  "1y": [3.78879,4.08839,4.38308,4.66742,4.40612,4.11088,3.80274,3.40786,3.00816,2.97099,2.91341,2.87072],
  "18m": [4.09459,4.39418,4.68855,4.656,4.35969,4.11964,3.70754,3.29246,2.97696,2.94168,2.88698,2.85],
  "2y": [4.40085,4.70043,4.98825,4.57895,4.26076,4.10039,3.58181,3.15049,2.93225,2.90143,2.85131,2.82132],
  "3y": [5.01474,5.30471,4.64431,4.2215,4.12136,3.97377,3.23696,2.78794,2.80254,2.78824,2.75242,2.7403],
  "4y": [5.61074,4.44507,3.93248,3.87321,3.82255,3.49884,2.76752,2.56677,2.62041,2.63253,2.61768,2.62846],
  "5y": [3.23361,3.04764,3.25258,3.3354,3.36746,2.85827,2.18306,2.28809,2.39045,2.43787,2.45015,2.48832],
  "6y": [2.85614,3.26251,3.37157,3.40374,3.07427,2.52802,2.12655,2.23952,2.33781,2.39187,2.41737,2.45934],
  "7y": [3.68305,3.64305,3.5994,3.13355,2.77378,2.1913,2.11237,2.22676,2.31333,2.36815,2.40419,2.4476],
  "8y": [3.60159,3.55529,2.93787,2.52856,2.20305,1.66255,2.00555,2.13503,2.22229,2.29164,2.34713,2.39715],
  "9y": [3.50734,2.59053,2.15119,1.83182,1.56039,1.53113,1.90794,2.03538,2.13596,2.21875,2.29383,2.34994],
  "10y": [1.65404,1.45389,1.25438,1.05511,0.86039,1.41577,1.82075,1.94287,2.05535,2.15036,2.24494,2.30655],
  "12y": [0.84883,0.64868,0.45657,1.04913,1.39996,1.79644,2.05034,2.13163,2.20406,2.28524,2.35852,2.4064],
  "15y": [2.8704,2.8704,2.8704,2.8704,2.8701,2.81081,2.75257,2.72252,2.68404,2.70131,2.7115,2.71816],
  "20y": [2.65737,2.64737,2.63746,2.62764,2.6179,2.59867,2.57067,2.59964,2.6284,2.65685,2.67366,2.68468],
  "25y": [2.55607,2.54607,2.53615,2.52632,2.51703,2.58444,2.63475,2.65422,2.6736,2.69281,2.70418,2.71165],
  "30y": [2.76899,2.76899,2.76899,2.76899,2.76899,2.76899,2.76899,2.76899,2.76899,2.76899,2.76899,2.76899],
};
const USD_MID = {
  "1w": [92,95.35,98.69,102.04,105.38,108.73,108.73,105.38,102.04,98.69,95.35,92],
  "1m": [91.25,94.57,97.89,101.2,104.52,107.84,107.84,104.52,101.2,97.89,94.57,91.25],
  "2m": [90.5,93.79,97.08,100.37,103.66,106.95,106.95,103.66,100.37,97.08,93.79,90.5],
  "3m": [89.75,93.01,96.28,99.54,102.8,106.07,106.07,102.8,99.54,96.28,93.01,89.75],
  "6m": [89,92.24,95.47,98.71,101.95,105.18,105.18,101.95,98.71,95.47,92.24,89],
  "9m": [88.25,91.46,94.67,97.88,101.09,104.3,104.3,101.09,97.88,94.67,91.46,88.25],
  "1y": [87.5,90.68,93.86,97.05,100.23,103.41,103.41,100.23,97.05,93.86,90.68,87.5],
  "18m": [86.75,89.9,93.06,96.21,99.37,102.52,102.52,99.37,96.21,93.06,89.9,86.75],
  "2y": [86,89.13,92.25,95.38,98.51,101.64,101.64,98.51,95.38,92.25,89.13,86],
  "3y": [85.25,88.35,91.45,94.55,97.65,100.75,100.75,97.65,94.55,91.45,88.35,85.25],
  "4y": [84.5,87.57,90.65,93.72,96.79,99.86,99.86,96.79,93.72,90.65,87.57,84.5],
  "5y": [83.75,86.8,89.84,92.89,95.93,98.98,98.98,95.93,92.89,89.84,86.8,83.75],
  "7y": [83,86.02,89.04,92.05,95.07,98.09,98.09,95.07,92.05,89.04,86.02,83],
  "10y": [82.25,85.24,88.23,91.22,94.21,97.2,97.2,94.21,91.22,88.23,85.24,82.25],
  "12y": [81.5,84.46,87.43,90.39,93.35,96.32,96.32,93.35,90.39,87.43,84.46,81.5],
  "15y": [80.75,83.69,86.62,89.56,92.5,95.43,95.43,92.5,89.56,86.62,83.69,80.75],
  "20y": [80,82.91,85.82,88.73,91.64,94.55,94.55,91.64,88.73,85.82,82.91,80],
};
const USD_PREM = {
  "1w": [9.94,20.23,30.79,41.54,52.4,72.69,98.36,111.02,129.82,158.48,180.92,198.18],
  "1m": [20.47,41.66,63.4,85.52,107.88,149.69,202.57,228.73,267.5,326.6,372.84,408.44],
  "2m": [28.62,58.24,88.62,119.52,150.77,209.24,283.22,319.9,374.26,456.93,521.67,571.51],
  "3m": [34.66,70.52,107.28,144.64,182.47,253.31,342.93,387.46,453.45,553.64,632.07,692.5],
  "6m": [48.18,97.97,148.92,200.66,253.16,351.67,476.38,538.86,631.18,770.66,880.09,964.25],
  "9m": [57.97,117.77,178.91,240.89,304.13,422.78,573.23,649.04,760.85,929.1,1061.1,1162.71],
  "1y": [65.75,133.47,202.61,272.64,344.45,479.14,650.23,736.99,864.65,1055.87,1206.09,1321.74],
  "18m": [78.23,158.58,240.39,323.58,409.41,570.1,775.55,880.79,1034.48,1263.67,1443.74,1582.45],
  "2y": [87.63,177.37,268.47,362.2,458.88,639.57,872.7,992.95,1167.15,1425.87,1629.67,1786.31],
  "3y": [101.4,204.65,311.2,421.43,534.72,746.29,1026.28,1171.81,1377.8,1683.67,1924.86,2110.16],
  "4y": [109.96,223.83,342.05,463.88,588.93,824.71,1142.44,1306.8,1535.88,1876.95,2145.96,2352.4],
  "5y": [117.48,239.9,366.45,496.76,630.5,888.29,1237.41,1414.65,1661.17,2029.32,2320.15,2542.32],
  "7y": [129.15,263.01,401.25,546.18,698.62,994.89,1390.75,1586.49,1859.58,2269.8,2593.01,2839.04],
  "10y": [140.29,289.55,447.66,614.51,789.95,1123.64,1554.8,1767.34,2066.1,2515.16,2867.05,3134.1],
  "12y": [149.71,308.99,477.74,653.34,834.77,1177.77,1620.97,1839.55,2147.24,2609.5,2969.94,3243.53],
  "15y": [159.24,325.44,498.18,677.23,862.22,1212.55,1667.2,1891.63,2207.12,2678.71,3046.22,3324.44],
  "20y": [158.33,324.05,496.83,676.35,862.31,1215,1672.89,1898.26,2213.42,2683.28,3049.03,3326.1],
};

const cellKey = (exp, ten) => `${exp}|${ten}`;
const loadLS  = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };




// ── Cap & Floor Panel ────────────────────────────────────────────
const CF_TENORS    = [1,2,3,4,5,6,7,8,9,10,12,15,20];
const CF_TYPES     = ['CAP','FLR','STRADDLE'];
const ALL_STRIKES  = ["-2.00","-1.50","-1.00","-0.50","0.00","ATM-STD","+0.50","+1.00","+1.50","+2.00","+2.50","+3.00","+3.50","+4.00","+4.50","+5.00","+5.50","+6.00","+6.50","+7.00"];
const FWD_COLS     = [
  [{s:1,e:2},{s:2,e:3},{s:3,e:4},{s:4,e:5},{s:5,e:6},{s:6,e:7},{s:7,e:8},{s:8,e:9},{s:9,e:10}],
  [{s:1,e:3},{s:2,e:4},{s:3,e:5},{s:4,e:6},{s:5,e:7},{s:7,e:9}],
  [{s:1,e:4},{s:2,e:5},{s:3,e:6},{s:4,e:7},{s:5,e:8},{s:7,e:10}],
  [{s:1,e:5},{s:2,e:6},{s:3,e:7},{s:4,e:8},{s:5,e:9}],
  [{s:1,e:6},{s:2,e:7},{s:3,e:8},{s:4,e:9},{s:5,e:10}],
];
const cfqKey    = (ccy,t,tp)       => `${ccy}_${t}_${tp}`;
const fwdqKey   = (ccy,s,e)        => `${ccy}_fwd_${s}x${e}`;
const spotKey   = (ccy,t,sk,tp)    => `${ccy}_spot_${t}_${sk}_${tp}`;
const fwdotmKey = (ccy,s,e,sk,tp)  => `${ccy}_fwdotm_${s}x${e}_${sk}_${tp}`;

const cfBkCol = (b) => {
  if(!b) return "#608090";
  const BF={NAB:"#e05050",WBC:"#d03060",CBA:"#e07030",ANZ:"#3090d0",JPM:"#4060e0",GS:"#a040c0",MS:"#c08020",BARC:"#30a070",DB:"#5070e0",UBS:"#d04040",CS:"#c05030",CITI:"#2090c0",HSBC:"#d03030",NOM:"#8040c0",MIZUHO:"#3080c0",MUFG:"#4090b0",MST:"#50b080",MQG:"#e06020",SG:"#c04040",BNP:"#3060c0"};
  if(BF[b]) return BF[b];
  const cols=["#e05050","#e08030","#50c080","#5090e0","#a060d0","#40b0b0","#c0a030","#e04080"];
  let h=0; for(let i=0;i<b.length;i++) h=(h*31+b.charCodeAt(i))&0xffff; return cols[h%cols.length];
};

function CfCell({ quotes, referred, onRefer, onDel, onClick, active, compact, prevQuotes, refMid }) {
  const [hov, setHov] = React.useState(false);
  const bids   = quotes?.bids   || [];
  const offers = quotes?.offers || [];
  const actB   = bids.filter(q   => !referred?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price);
  const actO   = offers.filter(q => !referred?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price);
  const bB=actB[0], bO=actO[0];
  const both   = bB && bO;
  const cross  = both && bB.price >= bO.price;
  const spread = both ? (bO.price - bB.price).toFixed(4) : null;
  const hasData  = bids.length>0||offers.length>0;
  const w = compact ? undefined : 114;
  const prevBids   = prevQuotes?.bids   || [];
  const prevOffers = prevQuotes?.offers || [];
  // bg tint like swaption cells
  let bg = active?"rgba(30,70,150,.35)":"rgba(8,14,24,.8)";
  if(!active){ if(both) bg=cross?"rgba(20,50,180,.40)":"rgba(30,55,18,.35)"; else if(bB) bg="rgba(0,60,20,.30)"; else if(bO) bg="rgba(80,35,0,.28)"; }
  const bdr = active?"rgba(60,120,220,.6)":cross?"rgba(30,70,200,.55)":both?"rgba(60,140,30,.45)":bB?"rgba(0,140,50,.40)":bO?"rgba(180,80,0,.40)":"#1a2e44";
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:bg, border:`1px solid ${bdr}`,
        borderRadius:3, padding:compact?"1px 2px":"2px 5px", cursor:"pointer",
        minWidth:w, position:"relative", userSelect:"none", minHeight:compact?undefined:34}}>
      {/* reference mid — always dim, sits behind live prices like swaption premium */}
      {refMid!=null && <div style={{color:"#243c54",fontSize:8,textAlign:"center",lineHeight:"1.1",paddingTop:1,opacity:.75}}>{refMid}</div>}
      {/* empty */}
      {!hasData && refMid==null && <span style={{color:"#1e3048",fontSize:8,display:"block",textAlign:"center",lineHeight:"34px"}}>—</span>}
      {/* live prices */}
      {hasData && (
        <div style={{display:"flex",flexDirection:"column",paddingTop:refMid!=null?1:2}}>
          {/* BIDS — best only normally, all on hover */}
          {(hov ? actB : actB.slice(0,1)).map((q,i)=>(
            <div key={q.id} className="qrow" style={{display:"flex",alignItems:"center",gap:2,marginBottom:1}}>
              <span style={{color:cross&&i===0?"#5090e0":"#00c040",fontWeight:700,fontSize:compact?10:11,flex:1,textAlign:"center"}}>{q.price}</span>
              {hov && q.bank && <span style={{color:cfBkCol(q.bank),fontSize:7,fontWeight:700}}>{q.bank}</span>}
              {hov && <span className="qrow-actions" style={{display:"flex",gap:1}}>
                <button className="ref-btn" onClick={e=>{e.stopPropagation();onRefer('b',q.id);}}
                  style={{color:referred?.has(`b|${q.id}`)?"#a070d0":"#5080a0",borderColor:referred?.has(`b|${q.id}`)?"#7050a0":"#2a4060",background:referred?.has(`b|${q.id}`)?"rgba(100,50,160,.2)":"transparent"}}>
                  {referred?.has(`b|${q.id}`)?"UN-REF":"REF"}
                </button>
                <span className="del-btn" onClick={e=>{e.stopPropagation();onDel('b',q.id);}}>✕</span>
              </span>}
            </div>
          ))}
          {/* spread */}
          {both && !hov && <div style={{textAlign:"center",color:"#1e3450",fontSize:7,lineHeight:"9px"}}>{cross?<span style={{color:"#6080ff",fontSize:7,fontWeight:700}}>CROSS</span>:spread}</div>}
          {/* OFFERS */}
          {(hov ? actO : actO.slice(0,1)).map((q,i)=>(
            <div key={q.id} className="qrow" style={{display:"flex",alignItems:"center",gap:2,marginTop:1}}>
              <span style={{color:cross&&i===0?"#5090e0":"#ff8c00",fontWeight:700,fontSize:compact?10:11,flex:1,textAlign:"center"}}>{q.price}</span>
              {hov && q.bank && <span style={{color:cfBkCol(q.bank),fontSize:7,fontWeight:700}}>{q.bank}</span>}
              {hov && <span className="qrow-actions" style={{display:"flex",gap:1}}>
                <button className="ref-btn" onClick={e=>{e.stopPropagation();onRefer('o',q.id);}}
                  style={{color:referred?.has(`o|${q.id}`)?"#a070d0":"#5080a0",borderColor:referred?.has(`o|${q.id}`)?"#7050a0":"#2a4060",background:referred?.has(`o|${q.id}`)?"rgba(100,50,160,.2)":"transparent"}}>
                  {referred?.has(`o|${q.id}`)?"UN-REF":"REF"}
                </button>
                <span className="del-btn" onClick={e=>{e.stopPropagation();onDel('o',q.id);}}>✕</span>
              </span>}
            </div>
          ))}
        </div>
      )}
      {/* prev session prices greyed/struck */}
      {!hasData && (prevBids.length>0||prevOffers.length>0) && (
        <div style={{marginTop:1,opacity:.32}}>
          {prevBids.map((q,i)=><div key={i} style={{color:"#00c040",fontSize:9,textDecoration:"line-through",textAlign:"center"}}>{q.price}{q.bank&&<span style={{color:cfBkCol(q.bank),fontSize:7,marginLeft:2}}>{q.bank}</span>}</div>)}
          {prevOffers.map((q,i)=><div key={i} style={{color:"#ff8c00",fontSize:9,textDecoration:"line-through",textAlign:"center"}}>{q.price}{q.bank&&<span style={{color:cfBkCol(q.bank),fontSize:7,marginLeft:2}}>{q.bank}</span>}</div>)}
        </div>
      )}
    </div>
  );
}

function CfEntryPanel({ label, onCommit, onClose }) {
  const [f, setF] = React.useState({bid:'',offer:'',bidBank:'',offerBank:'',bidStrike:'',offerStrike:''});
  const [suggest, setSuggest] = React.useState([]);
  const [activeField, setActiveField] = React.useState(null);
  const iS={background:"#060a10",border:"1px solid #2a4870",color:"#b0bcc8",fontSize:10,borderRadius:3,padding:"3px 6px",fontFamily:"inherit",width:"100%",outline:"none",marginBottom:3};
  const go=()=>{if(f.bid||f.offer){ onCommit(f); setF({bid:'',offer:'',bidBank:'',offerBank:'',bidStrike:'',offerStrike:''}); setSuggest([]); }};
  const bankInput=(field,val)=>{ const v=val.toUpperCase(); setActiveField(field); setF(p=>({...p,[field]:v})); setSuggest(v.length>=1?BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6):[]); };
  const SIDES=[{side:"BID",pCol:"#00c040",lCol:"#007a28",fk:"bid",bk:"bidBank",sk:"bidStrike"},{side:"OFFER",pCol:"#ff8c00",lCol:"#994400",fk:"offer",bk:"offerBank",sk:"offerStrike"}];
  return (
    <div style={{marginTop:10,background:"#0a1422",border:"1px solid #1e3450",borderRadius:4,padding:"10px 14px",maxWidth:440}}>
      <div style={{color:"#4a7898",fontSize:9,marginBottom:8,letterSpacing:".1em",fontWeight:700}}>{label}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {SIDES.map(({side,pCol,lCol,fk,bk,sk})=>(
          <div key={side} style={{borderLeft:`3px solid ${pCol}`,paddingLeft:8}}>
            <div style={{color:lCol,fontSize:8,marginBottom:4,letterSpacing:".1em"}}>{side}</div>
            <input style={{...iS,color:pCol,fontWeight:700}} value={f[fk]} onChange={e=>setF(v=>({...v,[fk]:e.target.value}))} placeholder="price (bp)" autoFocus={side==="BID"} onKeyDown={e=>e.key==="Enter"&&go()}/>
            <div style={{position:"relative",marginBottom:3}}>
              <input style={{...iS,marginBottom:0,color:f[bk]?bkc(f[bk]):"#b0bcc8",fontWeight:700,letterSpacing:".06em"}} value={f[bk]} onChange={e=>bankInput(bk,e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="BANK" autoComplete="off"/>
              {suggest.length>0&&activeField===bk&&(
                <div className="suggest">{suggest.map(b=>(<div key={b} className="sug-item" style={{color:bkc(b)}} onMouseDown={()=>{setF(v=>({...v,[bk]:b}));setSuggest([]);}}>{b}</div>))}</div>
              )}
            </div>
            <input style={iS} value={f[sk]} onChange={e=>setF(v=>({...v,[sk]:e.target.value}))} placeholder="Strike %"/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={go} style={{flex:1,background:"rgba(20,60,150,.5)",border:"1px solid #2e4e78",color:"#70b0f0",padding:"5px",borderRadius:3,cursor:"pointer",fontFamily:"inherit",fontSize:9,letterSpacing:".1em"}}>+ ADD</button>
        <button onClick={onClose} style={{background:"rgba(80,20,20,.4)",border:"1px solid #4a2020",color:"#c05050",padding:"5px 10px",borderRadius:3,cursor:"pointer",fontFamily:"inherit",fontSize:9}}>✕</button>
      </div>
    </div>
  );
}

// ── OTM matrix (shared for spot/fwd) ─────────────────────────────
function OtmMatrix({ title, rowKey, rows, rowLabel, ccy, cfQuotes, cfRef, activeCell, setActiveCell, toggleRef, delQ, visStrikes, cfStrike, showAtmK, prevSession }) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,minWidth:0,overflow:"hidden"}}>
      <div style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".12em",marginBottom:4,flexShrink:0,paddingLeft:2}}>{title}</div>
      <div style={{flex:1,overflow:"auto",minHeight:0}}>
        <table style={{borderCollapse:"collapse",fontSize:9,tableLayout:"fixed",width:"100%"}}>
          <thead>
            <tr>
              <th style={{minWidth:showAtmK?90:50,color:"#3a6080",fontSize:8,fontWeight:700,padding:"3px 6px",borderBottom:"1px solid #1a2e44",textAlign:"left",position:"sticky",left:0,background:"#080c14",zIndex:3,whiteSpace:"nowrap"}}>
                {showAtmK?"YR / K":"PERIOD"}
              </th>
              {visStrikes.map(s=>{
                const isAtmStd=s==="ATM-STD"; const sv=isAtmStd?null:parseFloat(s);
                const col=isAtmStd?"#a070d0":sv===0?"#5aaae8":sv<0?"#00c040":"#ff8c00";
                const bg=isAtmStd?"rgba(120,50,200,.1)":sv===0?"rgba(30,80,180,.1)":"transparent";
                return (
                  <th key={s} colSpan={isAtmStd?2:1} style={{color:col,fontSize:7,fontWeight:700,padding:"3px 4px",borderBottom:"1px solid #1a2e44",textAlign:"center",background:bg,whiteSpace:"nowrap",borderLeft:"1px solid #0e1c2e"}}>
                    {isAtmStd?"ATM-STD":`${s}%`}
                  </th>
                );
              })}
            </tr>
            <tr>
              <th style={{position:"sticky",left:0,background:"#080c14",zIndex:3,borderBottom:"1px solid #1a2e44",padding:"2px 6px"}}/>
              {visStrikes.map(s=>{
                if(s==="ATM-STD") return (
                  <th key={s} colSpan={2} style={{color:"#a070d0",fontSize:7,padding:"2px 1px",borderBottom:"1px solid #1a2e44",textAlign:"center",background:"rgba(120,50,200,.08)",borderLeft:"1px solid #0e1c2e"}}>REF</th>
                );
                const sv2=parseFloat(s); const isFlrOnly=sv2<=0; const isCapOnly=sv2>0;
                return (
                  <th key={s} style={{color:isFlrOnly?"#00c040":"#ff8c00",fontSize:7,padding:"2px 1px",borderBottom:"1px solid #1a2e44",textAlign:"center",background:isFlrOnly?"rgba(0,192,64,.04)":"rgba(255,140,0,.04)",borderLeft:"1px solid #0e1c2e"}}>
                    {isFlrOnly?"FLR":"CAP"}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(row=>{
              const atmK = showAtmK ? (cfStrike?.[`${ccy}_${row}`]||"") : null;
              return (
                <tr key={rowKey(row)} style={{borderBottom:"1px solid #0e1c2e"}}>
                  <td style={{position:"sticky",left:0,background:"#080c14",zIndex:2,padding:"3px 6px",verticalAlign:"middle",borderRight:"1px solid #1a2e44"}}>
                    <span style={{color:"#5a88b0",fontWeight:700,fontSize:10}}>{rowLabel(row)}</span>
                    {showAtmK && atmK && <span style={{color:"#2a4860",fontSize:7,marginLeft:4}}>{atmK}%</span>}
                  </td>
                  {visStrikes.map(sk=>{
                    const isAtmStdCol=sk==="ATM-STD";
                    const isAtmCol=sk==="0.00";
                    const capKey=`${ccy}_${rowKey(row)}_cap_${sk}`;
                    const flrKey=`${ccy}_${rowKey(row)}_flr_${sk}`;
                    if(isAtmStdCol){
                      const rk=rowKey(row);
                      // For FWD rows (e.g. "1x2"), use end tenor for strike ref; for spot rows use rk directly
                      const refTenor=typeof row==="object"?row.e:rk;
                      const strdKey=`${ccy}_${refTenor}_STRADDLE`;
                      const dref=AUD_DUMMY_QUOTES[strdKey];
                      const mid=dref?((dref.bids[0].price+dref.offers[0].price)/2).toFixed(1):null;
                      const stk=cfStrike?.[`${ccy}_${refTenor}`]||null;
                      return (
                        <td key={sk} colSpan={2} style={{padding:"2px 3px",verticalAlign:"middle",background:"rgba(80,20,160,.07)",borderLeft:"1px solid #0e1c2e",textAlign:"center"}}>
                          {mid!=null
                            ?<><div style={{color:"#c080f0",fontWeight:700,fontSize:10}}>{mid}</div>{stk&&<div style={{color:"#7040a0",fontSize:7}}>{stk}%</div>}</>
                            :<span style={{color:"#2a1840",fontSize:8}}>—</span>}
                        </td>
                      );
                    }
                    const skv=parseFloat(sk); const useFlr=skv<=0;
                    const activeKey=useFlr?flrKey:capKey; const activeType=useFlr?"FLR":"CAP";
                    return (
                      <React.Fragment key={sk}>
                        <td style={{padding:"2px 2px",verticalAlign:"middle",background:isAtmCol?"rgba(30,80,180,.05)":"transparent",borderLeft:"1px solid #0e1c2e"}}>
                          <CfCell compact
                            quotes={cfQuotes[activeKey]} referred={cfRef[activeKey]} active={activeCell?.key===activeKey}
                            prevQuotes={prevSession?.[activeKey]}
                            onRefer={(side,id)=>toggleRef(activeKey,side,id)} onDel={(side,id)=>delQ(activeKey,side,id)}
                            onClick={()=>setActiveCell(activeCell?.key===activeKey?null:{key:activeKey,tenor:rowLabel(row),type:activeType,strike:sk,isOtm:true})}/>
                        </td>
                        <td style={{padding:"0",verticalAlign:"middle",background:"transparent",display:"none"}}>
                          <CfCell compact
                            quotes={cfQuotes[flrKey]} referred={cfRef[flrKey]} active={false}
                            prevQuotes={prevSession?.[flrKey]}
                            onRefer={(side,id)=>toggleRef(flrKey,side,id)} onDel={(side,id)=>delQ(flrKey,side,id)}
                            onClick={()=>setActiveCell(activeCell?.key===flrKey?null:{key:flrKey,tenor:rowLabel(row),type:"FLR",strike:sk,isOtm:true})}/>
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const AUD_DUMMY_QUOTES = {"AUD_1_STRADDLE": {"bids": [{"id": 5000, "price": 37.92, "bank": null, "strike": null}], "offers": [{"id": 5001, "price": 38.92, "bank": null, "strike": null}]}, "AUD_1_CAP": {"bids": [{"id": 3, "price": 20.2, "bank": null, "strike": "4.006"}], "offers": [{"id": 4, "price": 21.2, "bank": null, "strike": "4.006"}]}, "AUD_1_FLR": {"bids": [{"id": 5, "price": 17.2, "bank": null, "strike": "4.006"}], "offers": [{"id": 6, "price": 18.2, "bank": null, "strike": "4.006"}]}, "AUD_2_STRADDLE": {"bids": [{"id": 5002, "price": 139.05, "bank": null, "strike": null}], "offers": [{"id": 5003, "price": 140.05, "bank": null, "strike": null}]}, "AUD_2_CAP": {"bids": [{"id": 9, "price": 37.2, "bank": null, "strike": "3.753"}], "offers": [{"id": 10, "price": 38.2, "bank": null, "strike": "3.753"}]}, "AUD_2_FLR": {"bids": [{"id": 11, "price": 31.6, "bank": null, "strike": "3.753"}], "offers": [{"id": 12, "price": 32.6, "bank": null, "strike": "3.753"}]}, "AUD_3_STRADDLE": {"bids": [{"id": 5004, "price": 249.34, "bank": null, "strike": null}], "offers": [{"id": 5005, "price": 250.34, "bank": null, "strike": null}]}, "AUD_3_CAP": {"bids": [{"id": 15, "price": 66.9, "bank": null, "strike": "3.652"}], "offers": [{"id": 16, "price": 67.9, "bank": null, "strike": "3.652"}]}, "AUD_3_FLR": {"bids": [{"id": 17, "price": 57.0, "bank": null, "strike": "3.652"}], "offers": [{"id": 18, "price": 58.0, "bank": null, "strike": "3.652"}]}, "AUD_4_STRADDLE": {"bids": [{"id": 5006, "price": 368.86, "bank": null, "strike": null}], "offers": [{"id": 5007, "price": 369.86, "bank": null, "strike": null}]}, "AUD_4_CAP": {"bids": [{"id": 21, "price": 99.2, "bank": null, "strike": "3.648"}], "offers": [{"id": 22, "price": 100.2, "bank": null, "strike": "3.648"}]}, "AUD_4_FLR": {"bids": [{"id": 23, "price": 84.5, "bank": null, "strike": "3.648"}], "offers": [{"id": 24, "price": 85.5, "bank": null, "strike": "3.648"}]}, "AUD_5_STRADDLE": {"bids": [{"id": 5008, "price": 498.88, "bank": null, "strike": null}], "offers": [{"id": 5009, "price": 499.88, "bank": null, "strike": null}]}, "AUD_5_CAP": {"bids": [{"id": 27, "price": 134.3, "bank": null, "strike": "3.696"}], "offers": [{"id": 28, "price": 135.3, "bank": null, "strike": "3.696"}]}, "AUD_5_FLR": {"bids": [{"id": 29, "price": 114.4, "bank": null, "strike": "3.696"}], "offers": [{"id": 30, "price": 115.4, "bank": null, "strike": "3.696"}]}, "AUD_6_STRADDLE": {"bids": [{"id": 5010, "price": 635.18, "bank": null, "strike": null}], "offers": [{"id": 5011, "price": 636.18, "bank": null, "strike": null}]}, "AUD_6_CAP": {"bids": [{"id": 33, "price": 171.1, "bank": null, "strike": "3.765"}], "offers": [{"id": 34, "price": 172.1, "bank": null, "strike": "3.765"}]}, "AUD_6_FLR": {"bids": [{"id": 35, "price": 145.7, "bank": null, "strike": "3.765"}], "offers": [{"id": 36, "price": 146.7, "bank": null, "strike": "3.765"}]}, "AUD_7_STRADDLE": {"bids": [{"id": 5012, "price": 780.79, "bank": null, "strike": null}], "offers": [{"id": 5013, "price": 781.79, "bank": null, "strike": null}]}, "AUD_7_CAP": {"bids": [{"id": 39, "price": 210.5, "bank": null, "strike": "3.838"}], "offers": [{"id": 40, "price": 211.5, "bank": null, "strike": "3.838"}]}, "AUD_7_FLR": {"bids": [{"id": 41, "price": 179.2, "bank": null, "strike": "3.838"}], "offers": [{"id": 42, "price": 180.2, "bank": null, "strike": "3.838"}]}, "AUD_8_STRADDLE": {"bids": [{"id": 5014, "price": 915.04, "bank": null, "strike": null}], "offers": [{"id": 5015, "price": 916.04, "bank": null, "strike": null}]}, "AUD_8_CAP": {"bids": [{"id": 45, "price": 246.7, "bank": null, "strike": "3.906"}], "offers": [{"id": 46, "price": 247.7, "bank": null, "strike": "3.906"}]}, "AUD_8_FLR": {"bids": [{"id": 47, "price": 210.1, "bank": null, "strike": "3.906"}], "offers": [{"id": 48, "price": 211.1, "bank": null, "strike": "3.906"}]}, "AUD_9_STRADDLE": {"bids": [{"id": 5016, "price": 1053.71, "bank": null, "strike": null}], "offers": [{"id": 5017, "price": 1054.71, "bank": null, "strike": null}]}, "AUD_9_CAP": {"bids": [{"id": 51, "price": 284.1, "bank": null, "strike": "3.969"}], "offers": [{"id": 52, "price": 285.1, "bank": null, "strike": "3.969"}]}, "AUD_9_FLR": {"bids": [{"id": 53, "price": 242.0, "bank": null, "strike": "3.969"}], "offers": [{"id": 54, "price": 243.0, "bank": null, "strike": "3.969"}]}, "AUD_10_STRADDLE": {"bids": [{"id": 5018, "price": 1191.92, "bank": null, "strike": null}], "offers": [{"id": 5019, "price": 1192.92, "bank": null, "strike": null}]}, "AUD_10_CAP": {"bids": [{"id": 57, "price": 321.4, "bank": null, "strike": "4.022"}], "offers": [{"id": 58, "price": 322.4, "bank": null, "strike": "4.022"}]}, "AUD_10_FLR": {"bids": [{"id": 59, "price": 273.8, "bank": null, "strike": "4.022"}], "offers": [{"id": 60, "price": 274.8, "bank": null, "strike": "4.022"}]}, "AUD_12_STRADDLE": {"bids": [{"id": 5020, "price": 1462.43, "bank": null, "strike": null}], "offers": [{"id": 5021, "price": 1463.43, "bank": null, "strike": null}]}, "AUD_12_CAP": {"bids": [{"id": 63, "price": 394.5, "bank": null, "strike": "4.111"}], "offers": [{"id": 64, "price": 395.5, "bank": null, "strike": "4.111"}]}, "AUD_12_FLR": {"bids": [{"id": 65, "price": 336.0, "bank": null, "strike": "4.111"}], "offers": [{"id": 66, "price": 337.0, "bank": null, "strike": "4.111"}]}, "AUD_15_STRADDLE": {"bids": [{"id": 5022, "price": 1892.01, "bank": null, "strike": null}], "offers": [{"id": 5023, "price": 1893.01, "bank": null, "strike": null}]}, "AUD_15_CAP": {"bids": [{"id": 69, "price": 510.5, "bank": null, "strike": "4.180"}], "offers": [{"id": 70, "price": 511.5, "bank": null, "strike": "4.180"}]}, "AUD_15_FLR": {"bids": [{"id": 71, "price": 434.8, "bank": null, "strike": "4.180"}], "offers": [{"id": 72, "price": 435.8, "bank": null, "strike": "4.180"}]}, "AUD_20_STRADDLE": {"bids": [{"id": 5024, "price": 2229.5, "bank": null, "strike": null}], "offers": [{"id": 5025, "price": 2230.5, "bank": null, "strike": null}]}, "AUD_20_CAP": {"bids": [{"id": 3002, "price": 601.6, "bank": null, "strike": "4.220"}], "offers": [{"id": 3003, "price": 602.6, "bank": null, "strike": "4.220"}]}, "AUD_20_FLR": {"bids": [{"id": 3004, "price": 512.4, "bank": null, "strike": "4.220"}], "offers": [{"id": 3005, "price": 513.4, "bank": null, "strike": "4.220"}]}};
const AUD_DUMMY_STRIKE = {"AUD_1":"4.006","AUD_2":"3.753","AUD_3":"3.652","AUD_4":"3.648","AUD_5":"3.696","AUD_6":"3.765","AUD_7":"3.838","AUD_8":"3.906","AUD_9":"3.969","AUD_10":"4.022","AUD_12":"4.111","AUD_15":"4.180","AUD_20":"4.220"};
const AUD_DUMMY_VOL    = {"AUD_1":"93.5","AUD_2":"105.0","AUD_3":"100.9","AUD_4":"97.9","AUD_5":"96.4","AUD_6":"94.8","AUD_7":"93.9","AUD_8":"91.5","AUD_9":"89.8","AUD_10":"88.5","AUD_12":"86.1","AUD_15":"85.5","AUD_20":"84.0"};
const ALL_FWDS         = FWD_COLS.flat();

const WEDGE_ROWS = [
  // ── 1Y gaps (0.25x1 through 9x10) ─────────────────────────
  {id:"3m_1Y",  swpExp:"3m",  swpTen:"1Y",  swpLabel:"3M X 1Y",   cfsPeriod:"0.25x1", cfsS:0,  cfsE:1},
  {id:"1y_1Y",  swpExp:"1y",  swpTen:"1Y",  swpLabel:"1Y X 1Y",   cfsPeriod:"1x2",    cfsS:1,  cfsE:2},
  {id:"2y_1Y",  swpExp:"2y",  swpTen:"1Y",  swpLabel:"2Y X 1Y",   cfsPeriod:"2x3",    cfsS:2,  cfsE:3},
  {id:"3y_1Y",  swpExp:"3y",  swpTen:"1Y",  swpLabel:"3Y X 1Y",   cfsPeriod:"3x4",    cfsS:3,  cfsE:4},
  {id:"4y_1Y",  swpExp:"4y",  swpTen:"1Y",  swpLabel:"4Y X 1Y",   cfsPeriod:"4x5",    cfsS:4,  cfsE:5},
  {id:"5y_1Y",  swpExp:"5y",  swpTen:"1Y",  swpLabel:"5Y X 1Y",   cfsPeriod:"5x6",    cfsS:5,  cfsE:6},
  {id:"6y_1Y",  swpExp:"6y",  swpTen:"1Y",  swpLabel:"6Y X 1Y",   cfsPeriod:"6x7",    cfsS:6,  cfsE:7},
  {id:"7y_1Y",  swpExp:"7y",  swpTen:"1Y",  swpLabel:"7Y X 1Y",   cfsPeriod:"7x8",    cfsS:7,  cfsE:8},
  {id:"8y_1Y",  swpExp:"8y",  swpTen:"1Y",  swpLabel:"8Y X 1Y",   cfsPeriod:"8x9",    cfsS:8,  cfsE:9},
  {id:"9y_1Y",  swpExp:"9y",  swpTen:"1Y",  swpLabel:"9Y X 1Y",   cfsPeriod:"9x10",   cfsS:9,  cfsE:10},
  // ── longer tenors ──────────────────────────────────────────
  {id:"5y_2Y",  swpExp:"5y",  swpTen:"2Y",  swpLabel:"5Y X 2Y",   cfsPeriod:"5x7",    cfsS:5,  cfsE:7},
  {id:"5y_5Y",  swpExp:"5y",  swpTen:"5Y",  swpLabel:"5Y X 5Y",   cfsPeriod:"5x10",   cfsS:5,  cfsE:10},
  {id:"10y_2Y", swpExp:"10y", swpTen:"2Y",  swpLabel:"10Y X 2Y",  cfsPeriod:"10x12",  cfsS:10, cfsE:12},
  {id:"10y_5Y", swpExp:"10y", swpTen:"5Y",  swpLabel:"10Y X 5Y",  cfsPeriod:"10x15",  cfsS:10, cfsE:15},
  {id:"10y_10Y",swpExp:"10y", swpTen:"10Y", swpLabel:"10Y X 10Y", cfsPeriod:"10x20",  cfsS:10, cfsE:20},
];


// ── FWD CFS Cell — outright + legged synthetic ─────────────
function FwdCfsCell({ quotes, referred, onRefer, onDel, onClick, active, prevQuotes, legged, cfBkCol }) {
  const [hov, setHov] = React.useState(false);
  const bids   = quotes?.bids   || [];
  const offers = quotes?.offers || [];
  const actB   = bids.filter(q   => !referred?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price);
  const actO   = offers.filter(q => !referred?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price);
  const outBid   = actB[0];
  const outOffer = actO[0];
  const legBid   = legged?.leggedBid   ?? null;
  const legOffer = legged?.leggedOffer ?? null;
  // best market: highest bid, lowest offer
  const bestBid   = (outBid && legBid)   ? (outBid.price >= legBid   ? {price:outBid.price,  bank:outBid.bank, isLeg:false} : {price:legBid,   bank:null, isLeg:true})
                  : outBid  ? {price:outBid.price,  bank:outBid.bank, isLeg:false}
                  : legBid  ? {price:legBid,   bank:null, isLeg:true}
                  : null;
  const bestOffer = (outOffer && legOffer) ? (outOffer.price <= legOffer ? {price:outOffer.price, bank:outOffer.bank, isLeg:false} : {price:legOffer, bank:null, isLeg:true})
                  : outOffer ? {price:outOffer.price, bank:outOffer.bank, isLeg:false}
                  : legOffer ? {price:legOffer, bank:null, isLeg:true}
                  : null;
  const hasOutright = bids.length>0||offers.length>0;
  const hasLegged   = legBid!=null||legOffer!=null;
  const hasAny = hasOutright||hasLegged;
  // Implied wedge: outright FWD ± swaption → inferred wedge
  // impWedgeOffer: if outright offer tighter than legged → outright offer - swpBid  (bid of swp + ? = outright offer)
  // impWedgeBid:  if outright bid  higher  than legged → outright bid  - swpOffer
  const impWedgeOffer = outOffer && legged?.swpBid   !=null && (legOffer==null||outOffer.price < legOffer) ? +(outOffer.price - legged.swpBid).toFixed(4)   : null;
  const impWedgeBid   = outBid   && legged?.swpOffer !=null && (legBid  ==null||outBid.price  > legBid)   ? +(outBid.price  - legged.swpOffer).toFixed(4) : null;
  const both = bestBid&&bestOffer;
  const cross = both && bestBid.price >= bestOffer.price;
  let bg = active?"rgba(30,70,150,.35)":"rgba(8,14,24,.8)";
  if(!active){ if(both) bg=cross?"rgba(20,50,180,.40)":"rgba(30,55,18,.35)"; else if(bestBid) bg="rgba(0,60,20,.30)"; else if(bestOffer) bg="rgba(80,35,0,.28)"; }
  const bdr = active?"rgba(60,120,220,.6)":cross?"rgba(30,70,200,.55)":both?"rgba(60,140,30,.45)":bestBid?"rgba(0,140,50,.40)":bestOffer?"rgba(180,80,0,.40)":"#1a2e44";
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:bg,border:`1px solid ${bdr}`,borderRadius:3,padding:"2px 5px",cursor:"pointer",minWidth:114,minHeight:34,position:"relative",userSelect:"none"}}>
      {!hasAny && <span style={{color:"#1e3048",fontSize:8,display:"block",textAlign:"center",lineHeight:"30px"}}>—</span>}
      {hasAny && (
        <div style={{display:"flex",flexDirection:"column",paddingTop:2}}>
          {/* BEST BID */}
          {bestBid && (
            <div style={{marginBottom:1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                <span style={{color:cross?"#5090e0":"#00c040",fontWeight:700,fontSize:11,flex:1,textAlign:"center"}}>{bestBid.price.toFixed(4)}</span>
                {bestBid.bank&&<span style={{color:cfBkCol(bestBid.bank),fontSize:7}}>{bestBid.bank}</span>}
                {bestBid.isLeg&&outBid&&<span style={{color:"#1a5030",fontSize:7}} title={`Outright: ${outBid.price.toFixed(4)}`}>†</span>}
              </div>
              {bestBid.isLeg && legged && (hov||true) && (
                <div style={{fontSize:7,color:"#1e3a28",textAlign:"center",lineHeight:"9px"}}>
                  {legged.swpBid?.toFixed(4)}{legged.leggedBidSwpBank?<span style={{color:cfBkCol(legged.leggedBidSwpBank),marginLeft:1}}>{legged.leggedBidSwpBank}</span>:null}
                  {legged.wedgeBid!=null&&<span style={{color:"#1a4030"}}> +{legged.wedgeBid>0?"+":""}{legged.wedgeBid}{legged.leggedBidWedgeBank?<span style={{color:cfBkCol(legged.leggedBidWedgeBank),marginLeft:1}}>{legged.leggedBidWedgeBank}</span>:null}</span>}
                </div>
              )}
            </div>
          )}
          {/* spread */}
          {both&&!cross&&<div style={{textAlign:"center",color:"#1e3450",fontSize:7,lineHeight:"8px"}}>{(bestOffer.price-bestBid.price).toFixed(4)}</div>}
          {both&&cross&&<div style={{textAlign:"center",color:"#6080ff",fontSize:7,lineHeight:"8px"}}>CROSS</div>}
          {/* BEST OFFER */}
          {bestOffer && (
            <div style={{marginTop:1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                <span style={{color:cross?"#5090e0":"#ff8c00",fontWeight:700,fontSize:11,flex:1,textAlign:"center"}}>{bestOffer.price.toFixed(4)}</span>
                {bestOffer.bank&&<span style={{color:cfBkCol(bestOffer.bank),fontSize:7}}>{bestOffer.bank}</span>}
                {bestOffer.isLeg&&outOffer&&<span style={{color:"#5a2800",fontSize:7}} title={`Outright: ${outOffer.price.toFixed(4)}`}>†</span>}
              </div>
              {bestOffer.isLeg && legged && (hov||true) && (
                <div style={{fontSize:7,color:"#3a2010",textAlign:"center",lineHeight:"9px"}}>
                  {legged.swpOffer?.toFixed(4)}{legged.leggedOfferSwpBank?<span style={{color:cfBkCol(legged.leggedOfferSwpBank),marginLeft:1}}>{legged.leggedOfferSwpBank}</span>:null}
                  {legged.wedgeOffer!=null&&<span style={{color:"#3a2010"}}> +{legged.wedgeOffer>0?"+":""}{legged.wedgeOffer}{legged.leggedOfferWedgeBank?<span style={{color:cfBkCol(legged.leggedOfferWedgeBank),marginLeft:1}}>{legged.leggedOfferWedgeBank}</span>:null}</span>}
                </div>
              )}
            </div>
          )}
          {/* hover: outright depth + REF/DEL */}
          {hov && hasOutright && (
            <div style={{position:"absolute",top:"100%",left:0,zIndex:50,background:"#0a1828",border:"1px solid #2a4870",borderRadius:4,padding:"6px 8px",minWidth:190,marginTop:2}}>
              {bids.length>0&&<div style={{color:"#3a6080",fontSize:7,marginBottom:3}}>OUTRIGHT BIDS</div>}
              {bids.map(q=>(
                <div key={q.id} style={{display:"flex",gap:4,alignItems:"center",marginBottom:3,opacity:referred?.has(`b|${q.id}`)?0.35:1}}>
                  <span style={{color:"#00c040",fontSize:11,fontWeight:700,width:52}}>{q.price.toFixed(4)}</span>
                  {q.bank&&<span style={{color:cfBkCol(q.bank),fontSize:8,fontWeight:700,flex:1}}>{q.bank}</span>}
                  <button className="ref-btn" onClick={e=>{e.stopPropagation();onRefer('b',q.id);}} style={{color:referred?.has(`b|${q.id}`)?"#a070d0":"#5080a0",borderColor:referred?.has(`b|${q.id}`)?"#7050a0":"#2a4060"}}>{referred?.has(`b|${q.id}`)?"UN-REF":"REF"}</button>
                  <span className="del-btn" onClick={e=>{e.stopPropagation();onDel('b',q.id);}}>✕</span>
                </div>
              ))}
              {offers.length>0&&<div style={{color:"#3a6080",fontSize:7,marginBottom:3,marginTop:4}}>OUTRIGHT OFFERS</div>}
              {offers.map(q=>(
                <div key={q.id} style={{display:"flex",gap:4,alignItems:"center",marginBottom:3,opacity:referred?.has(`o|${q.id}`)?0.35:1}}>
                  <span style={{color:"#ff8c00",fontSize:11,fontWeight:700,width:52}}>{q.price.toFixed(4)}</span>
                  {q.bank&&<span style={{color:cfBkCol(q.bank),fontSize:8,fontWeight:700,flex:1}}>{q.bank}</span>}
                  <button className="ref-btn" onClick={e=>{e.stopPropagation();onRefer('o',q.id);}} style={{color:referred?.has(`o|${q.id}`)?"#a070d0":"#5080a0",borderColor:referred?.has(`o|${q.id}`)?"#7050a0":"#2a4060"}}>{referred?.has(`o|${q.id}`)?"UN-REF":"REF"}</button>
                  <span className="del-btn" onClick={e=>{e.stopPropagation();onDel('o',q.id);}}>✕</span>
                </div>
              ))}
              {legged&&(legBid||legOffer)&&<div style={{borderTop:"1px solid #1a2e44",marginTop:4,paddingTop:4}}>
                <div style={{color:"#3a6080",fontSize:7,marginBottom:2}}>LEGGED SYNTHETIC</div>
                {legBid&&<div style={{color:"#2a6040",fontSize:9}}>{legBid.toFixed(4)} = {legged.swpBid?.toFixed(4)} + {legged.wedgeBid?.toFixed(4)}</div>}
                {legOffer&&<div style={{color:"#604020",fontSize:9}}>{legOffer.toFixed(4)} = {legged.swpOffer?.toFixed(4)} + {legged.wedgeOffer?.toFixed(4)}</div>}
              </div>}
              {(impWedgeBid!=null||impWedgeOffer!=null)&&<div style={{borderTop:"1px solid #1a2e44",marginTop:4,paddingTop:4}}>
                <div style={{color:"#3a6080",fontSize:7,marginBottom:2}}>IMPLIED WEDGE</div>
                {impWedgeBid!=null&&<div style={{color:"#2a6040",fontSize:9}}>bid: {impWedgeBid.toFixed(4)} = {outBid.price.toFixed(4)} - {legged.swpOffer?.toFixed(4)}{outBid.bank&&<span style={{color:cfBkCol(outBid.bank),marginLeft:3}}>{outBid.bank}</span>}</div>}
                {impWedgeOffer!=null&&<div style={{color:"#604020",fontSize:9}}>offer: {impWedgeOffer.toFixed(4)} = {outOffer.price.toFixed(4)} - {legged.swpBid?.toFixed(4)}{outOffer.bank&&<span style={{color:cfBkCol(outOffer.bank),marginLeft:3}}>{outOffer.bank}</span>}</div>}
              </div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Wedge Panel ──────────────────────────────────────────────
function WedgePanel({ ccy, wedgeQuotes, wedgeRef, wedgeLog=[], setWedgeLog, wedgeActive, setWedgeActive, wedgeFwdImp, setWedgeFwdImp, addWedgeQuote, reloadWedgeQuote, toggleWedgeRef, delWedgeQ, swpQuotes={}, swpReferred, cfQuotes={}, cfRef={}, cfBkCol }) {
  const TENORS_IDX = {"1Y":0,"2Y":1,"3Y":2,"4Y":3,"5Y":4,"7Y":5,"10Y":6,"12Y":7,"15Y":8,"20Y":9};
  const prem = ccy==="AUD" ? AUD_PREM : null;
  const swpMid = (exp,ten) => {
    if(!prem||!prem[exp]) return null;
    const idx = TENORS_IDX[ten];
    if(idx===undefined) return null;
    return prem[exp][idx];
  };
  const swpLive = (exp,ten) => {
    const k = `${exp}|${ten}`;
    const cell = swpQuotes[k]; if(!cell) return {bid:null,offer:null,bidBank:null,offerBank:null};
    const actB = cell.bids.filter(q=>!swpReferred?.has(`${k}|bids|${q.id}`));
    const actO = cell.offers.filter(q=>!swpReferred?.has(`${k}|offers|${q.id}`));
    // bids sorted desc on insert, offers sorted asc
    return { bid:actB[0]?.price??null, bidBank:actB[0]?.bank??null, offer:actO[0]?.price??null, offerBank:actO[0]?.bank??null };
  };
  const thS = {color:"#3a6080",fontSize:8,fontWeight:700,padding:"5px 8px",borderBottom:"1px solid #1a2e44",textAlign:"center",letterSpacing:".08em",whiteSpace:"nowrap",background:"#080c14"};
  const thL = {color:"#5a96c8",fontSize:8,fontWeight:700,padding:"5px 8px",borderBottom:"1px solid #1a2e44",textAlign:"center",letterSpacing:".08em",whiteSpace:"nowrap",background:"#080c14"};
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
      <div style={{background:"#080c14",borderBottom:"1px solid #1a2e44",padding:"5px 14px",flexShrink:0}}>
        <span style={{color:"#3a6080",fontSize:9,letterSpacing:".1em"}}>SWAPTION v CFS WEDGE · {ccy}</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"row",overflow:"hidden",minHeight:0}}>
        {/* main table */}
        <div style={{flex:1,overflow:"auto",padding:"10px 14px",minWidth:0}}>
          {wedgeActive && (
            <div style={{marginBottom:10,flexShrink:0}}>
              <CfEntryPanel label={`WEDGE · ${wedgeActive}`} onCommit={f=>addWedgeQuote(wedgeActive,f)} onClose={()=>setWedgeActive(null)}/>
            </div>
          )}
          <table style={{borderCollapse:"collapse",fontSize:10,width:"100%",tableLayout:"fixed"}}>
            <thead>
              <tr>
                <th style={{...thS,width:90,textAlign:"left"}}>SWAPTION</th>
                <th style={{...thS,width:64}}>SWP BID</th>
                <th style={{...thS,width:56}}>MID</th>
                <th style={{...thS,width:64}}>SWP OFFER</th>
                <th style={{...thL,width:120}}>WEDGE BP&apos;s</th>
                <th style={{...thS,width:65}}>CFS PERIOD</th>
                <th style={{...thL,width:150}}>LEGGED CFS STRADDLE</th>
              </tr>
            </thead>
            <tbody>
              {WEDGE_ROWS.map(row=>{
                const sm = swpMid(row.swpExp, row.swpTen);
                const live = swpLive(row.swpExp, row.swpTen);
                const wq = wedgeQuotes[row.id]||{bids:[],offers:[]};
                const wr = wedgeRef[row.id];
                const actB = wq.bids.filter(q=>!wr?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price);
                const actO = wq.offers.filter(q=>!wr?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price);
                // Implied wedge from live outright FWD price
                const fwdKey = `${ccy}_fwd_${row.cfsS}x${row.cfsE}`;
                const fwdCell = cfQuotes[fwdKey];
                const fwdActB = fwdCell ? fwdCell.bids.filter(q=>!cfRef[fwdKey]?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price) : [];
                const fwdActO = fwdCell ? fwdCell.offers.filter(q=>!cfRef[fwdKey]?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price) : [];
                const baseBid   = live.bid   ?? sm;
                const baseOffer = live.offer ?? sm;
                // impWedgeBid = fwdBid - swpOffer (buying the fwd, selling the swaption)
                // impWedgeOffer = fwdOffer - swpBid (selling the fwd, buying the swaption)
                const impWedgeBidPrice   = fwdActB[0]!=null && baseOffer!=null ? +(fwdActB[0].price - baseOffer).toFixed(4) : null;
                const impWedgeOfferPrice = fwdActO[0]!=null && baseBid  !=null ? +(fwdActO[0].price - baseBid).toFixed(4)  : null;
                // Best wedge: entered vs implied — highest bid, lowest offer
                const entBid   = actB[0]; const entOffer = actO[0];
                const wBest  = impWedgeBidPrice!=null && (entBid==null||impWedgeBidPrice>entBid.price)
                  ? {price:impWedgeBidPrice, bank:null, fwdBank:fwdActB[0]?.bank??null, isImplied:true}
                  : entBid ? {...entBid, isImplied:false} : null;
                const wOffer = impWedgeOfferPrice!=null && (entOffer==null||impWedgeOfferPrice<entOffer.price)
                  ? {price:impWedgeOfferPrice, bank:null, fwdBank:fwdActO[0]?.bank??null, isImplied:true}
                  : entOffer ? {...entOffer, isImplied:false} : null;
                const cfsBid   = baseBid  !=null && wBest  ? (baseBid   + wBest.price).toFixed(4)  : null;
                const cfsOffer = baseOffer!=null && wOffer ? (baseOffer + wOffer.price).toFixed(4) : null;
                // wedge mid for background tint
                const wMid = wBest && wOffer ? (wBest.price+wOffer.price)/2 : wBest?.price ?? wOffer?.price ?? null;
                const isNeg = wMid!==null && wMid < 0;
                const isActive = wedgeActive===row.id;
                const hasBoth = wBest && wOffer;
                const cross = hasBoth && wBest.price >= wOffer.price;
                let wBg = isActive?"rgba(30,70,150,.35)":"rgba(8,14,24,.8)";
                if(!isActive){ if(isNeg) wBg="rgba(120,20,20,.35)"; else if(hasBoth) wBg="rgba(30,55,18,.35)"; else if(wBest) wBg="rgba(0,60,20,.28)"; else if(wOffer) wBg="rgba(80,35,0,.28)"; }
                const wBdr = isActive?"rgba(60,120,220,.6)":isNeg?"rgba(200,40,40,.5)":hasBoth?"rgba(60,140,30,.4)":"#1a2e44";
                return (
                  <tr key={row.id} style={{borderBottom:"1px solid #0e1c2e"}}>
                    {/* swaption label */}
                    <td style={{padding:"3px 8px",color:"#4a7898",fontSize:9,fontWeight:700,verticalAlign:"middle"}}>{row.swpLabel}</td>
                    {/* live swaption BID */}
                    <td style={{padding:"3px 4px",textAlign:"center",verticalAlign:"middle"}}>
                      {live.bid!=null
                        ?<div><span style={{color:"#00c040",fontWeight:700,fontSize:11}}>{live.bid.toFixed(4)}</span>
                          {live.bidBank&&<div style={{color:"#2a5040",fontSize:7,marginTop:1}}>{live.bidBank}</div>}
                        </div>
                        :<span style={{color:"#1a2a3a",fontSize:8}}>—</span>}
                    </td>
                    {/* swaption mid reference */}
                    <td style={{padding:"3px 4px",textAlign:"center",verticalAlign:"middle"}}>
                      {sm!=null
                        ?<span style={{color:"#2a4860",fontSize:10,fontWeight:500}}>{sm.toFixed(4)}</span>
                        :<span style={{color:"#1a2a3a",fontSize:8}}>—</span>}
                    </td>
                    {/* live swaption OFFER */}
                    <td style={{padding:"3px 4px",textAlign:"center",verticalAlign:"middle"}}>
                      {live.offer!=null
                        ?<div><span style={{color:"#ff8c00",fontWeight:700,fontSize:11}}>{live.offer.toFixed(4)}</span>
                          {live.offerBank&&<div style={{color:"#603010",fontSize:7,marginTop:1}}>{live.offerBank}</div>}
                        </div>
                        :<span style={{color:"#1a2a3a",fontSize:8}}>—</span>}
                    </td>
                    {/* wedge cell — bid/offer entry like CfCell */}
                    <td style={{padding:"2px 3px",verticalAlign:"middle"}}>
                      <WedgeCell
                        bids={wq.bids} offers={wq.offers} referred={wr}
                        bestBid={wBest} bestOffer={wOffer}
                        active={isActive} bg={wBg} bdr={wBdr} cross={cross} isNeg={isNeg}
                        onRefer={(s,id)=>toggleWedgeRef(row.id,s,id)}
                        onDel={(s,id)=>delWedgeQ(row.id,s,id)}
                        onClick={()=>setWedgeActive(isActive?null:row.id)}
                        cfBkCol={cfBkCol}/>
                    </td>
                    {/* cfs period label */}
                    <td style={{padding:"3px 4px",textAlign:"center",verticalAlign:"middle",color:"#3a6888",fontSize:9,fontWeight:700}}>{row.cfsPeriod}</td>
                    {/* legged cfs straddle computed — side by side */}
                    <td style={{padding:"3px 6px",verticalAlign:"middle"}}>
                      {cfsBid||cfsOffer
                        ?<div style={{background:"rgba(8,14,24,.6)",border:"1px solid #1a2e44",borderRadius:3,padding:"4px 8px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                          {/* BID */}
                          <div style={{textAlign:"right"}}>
                            {cfsBid&&<><span style={{color:"#00c040",fontWeight:700,fontSize:12}}>{cfsBid}</span>
                              <div style={{fontSize:7,marginTop:1}}>
                                {live.bidBank&&<span style={{color:cfBkCol(live.bidBank),marginRight:2}}>{live.bidBank}</span>}
                                {wBest&&(wBest.isImplied
                                  ? <span style={{color:"#1a4060"}}>↔{wBest.fwdBank||"FWD"}</span>
                                  : wBest.bank&&<span style={{color:cfBkCol(wBest.bank)}}>+{wBest.bank}</span>)}
                              </div></>}
                            {!cfsBid&&<span style={{color:"#1e3048",fontSize:9}}>—</span>}
                          </div>
                          <span style={{color:"#1e3450",fontSize:11,fontWeight:300}}>/</span>
                          {/* OFFER */}
                          <div style={{textAlign:"left"}}>
                            {cfsOffer&&<><span style={{color:"#ff8c00",fontWeight:700,fontSize:12}}>{cfsOffer}</span>
                              <div style={{fontSize:7,marginTop:1}}>
                                {live.offerBank&&<span style={{color:cfBkCol(live.offerBank),marginRight:2}}>{live.offerBank}</span>}
                                {wOffer&&(wOffer.isImplied
                                  ? <span style={{color:"#3a2010"}}>↔{wOffer.fwdBank||"FWD"}</span>
                                  : wOffer.bank&&<span style={{color:cfBkCol(wOffer.bank)}}>+{wOffer.bank}</span>)}
                              </div></>}
                            {!cfsOffer&&<span style={{color:"#1e3048",fontSize:9}}>—</span>}
                          </div>
                        </div>
                        :<span style={{color:"#1e3048",fontSize:8,display:"block",textAlign:"center"}}>—</span>}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* right: log panel — wedge entries */}
        <WedgeLogPanel
          wedgeQuotes={wedgeQuotes} wedgeRef={wedgeRef} wedgeLog={wedgeLog} setWedgeLog={setWedgeLog}
          reloadWedgeQuote={reloadWedgeQuote}
          swpQuotes={swpQuotes} swpReferred={swpReferred} swpMid={swpMid} swpLive={swpLive}
          cfBkCol={cfBkCol}/>
      </div>
    </div>
  );
}

// Wedge bid/offer cell (same pattern as CfCell)
function WedgeCell({ bids, offers, referred, bestBid, bestOffer, active, bg, bdr, cross, isNeg, onRefer, onDel, onClick, cfBkCol }) {
  const [hov, setHov] = React.useState(false);
  const actB = bids.filter(q=>!referred?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price);
  const actO = offers.filter(q=>!referred?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price);
  const hasData = bids.length>0||offers.length>0;
  const bCol = cross?"#5090e0":isNeg?"#ff4444":"#00c040";
  const oCol = cross?"#5090e0":isNeg?"#ff7744":"#ff8c00";
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:bg,border:`1px solid ${bdr}`,borderRadius:3,padding:"3px 8px",cursor:"pointer",minWidth:140,minHeight:28,position:"relative",userSelect:"none"}}>
      {!hasData && <span style={{color:"#1e3048",fontSize:8,display:"block",textAlign:"center",lineHeight:"22px"}}>—</span>}
      {hasData && !hov && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          {/* BID side — use bestBid (may be implied) */}
          <div style={{textAlign:"right"}}>
            {bestBid
              ? <><span style={{color:bCol,fontWeight:700,fontSize:12}}>{bestBid.price>0?"+":""}{bestBid.price}</span>
                  {bestBid.isImplied
                    ? <div style={{fontSize:6,color:"#2a5870",textAlign:"right"}}>{bestBid.fwdBank&&<span style={{color:cfBkCol(bestBid.fwdBank)}}>{bestBid.fwdBank}</span>} <span style={{color:"#1a3a50"}}>↔swp</span></div>
                    : bestBid.bank&&<div style={{color:cfBkCol(bestBid.bank),fontSize:7,textAlign:"right"}}>{bestBid.bank}</div>}</>
              : <span style={{color:"#1e3048",fontSize:9}}>—</span>}
          </div>
          <span style={{color:"#1e3450",fontSize:11,fontWeight:300}}>/</span>
          {/* OFFER side — use bestOffer */}
          <div style={{textAlign:"left"}}>
            {bestOffer
              ? <><span style={{color:oCol,fontWeight:700,fontSize:12}}>{bestOffer.price>0?"+":""}{bestOffer.price}</span>
                  {bestOffer.isImplied
                    ? <div style={{fontSize:6,color:"#503010",textAlign:"left"}}>{bestOffer.fwdBank&&<span style={{color:cfBkCol(bestOffer.fwdBank)}}>{bestOffer.fwdBank}</span>} <span style={{color:"#3a2010"}}>↔swp</span></div>
                    : bestOffer.bank&&<div style={{color:cfBkCol(bestOffer.bank),fontSize:7}}>{bestOffer.bank}</div>}</>
              : <span style={{color:"#1e3048",fontSize:9}}>—</span>}
          </div>
          {cross&&<span style={{color:"#6080ff",fontSize:7,marginLeft:2}}>CROSS</span>}
        </div>
      )}
      {hasData && hov && (
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {actB.map(q=>(
            <div key={q.id} style={{display:"flex",alignItems:"center",gap:3}}>
              <span style={{color:bCol,fontWeight:700,fontSize:11,minWidth:36}}>{q.price>0?"+":""}{q.price}</span>
              {q.bank&&<span style={{color:cfBkCol(q.bank),fontSize:7,flex:1}}>{q.bank}</span>}
              <button className="ref-btn" onClick={e=>{e.stopPropagation();onRefer('b',q.id);}} style={{color:referred?.has(`b|${q.id}`)?"#a070d0":"#5080a0",borderColor:referred?.has(`b|${q.id}`)?"#7050a0":"#2a4060"}}>{referred?.has(`b|${q.id}`)?"UN-REF":"REF"}</button>
              <span className="del-btn" onClick={e=>{e.stopPropagation();onDel('b',q.id);}}>✕</span>
            </div>
          ))}
          {actB.length>0&&actO.length>0&&<div style={{borderTop:"1px solid #1a2e44"}}/>}
          {actO.map(q=>(
            <div key={q.id} style={{display:"flex",alignItems:"center",gap:3}}>
              <span style={{color:oCol,fontWeight:700,fontSize:11,minWidth:36}}>{q.price>0?"+":""}{q.price}</span>
              {q.bank&&<span style={{color:cfBkCol(q.bank),fontSize:7,flex:1}}>{q.bank}</span>}
              <button className="ref-btn" onClick={e=>{e.stopPropagation();onRefer('o',q.id);}} style={{color:referred?.has(`o|${q.id}`)?"#a070d0":"#5080a0",borderColor:referred?.has(`o|${q.id}`)?"#7050a0":"#2a4060"}}>{referred?.has(`o|${q.id}`)?"UN-REF":"REF"}</button>
              <span className="del-btn" onClick={e=>{e.stopPropagation();onDel('o',q.id);}}>✕</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Wedge log panel — CFS period as primary, legged CFS bid/offer
function WedgeLogPanel({ wedgeQuotes, wedgeRef, wedgeLog=[], setWedgeLog, reloadWedgeQuote, swpQuotes, swpReferred, swpMid, swpLive, cfBkCol }) {
  const entries = [];
  WEDGE_ROWS.forEach(row=>{
    const wq=wedgeQuotes[row.id]; if(!wq) return;
    const wr=wedgeRef[row.id];
    const actB=wq.bids.filter(q=>!wr?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price);
    const actO=wq.offers.filter(q=>!wr?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price);
    if(!actB[0]&&!actO[0]) return;
    const live=swpLive(row.swpExp,row.swpTen);
    const sm=swpMid(row.swpExp,row.swpTen);
    const baseBid=live.bid??sm; const baseOffer=live.offer??sm;
    const cfsBid  =baseBid  !=null&&actB[0]?(baseBid  +actB[0].price).toFixed(4):null;
    const cfsOffer=baseOffer!=null&&actO[0]?(baseOffer+actO[0].price).toFixed(4):null;
    entries.push({row,actB,actO,live,cfsBid,cfsOffer});
  });
  const [tab, setTab] = React.useState("hist");
  const prevLogLen = React.useRef(wedgeLog.length);
  React.useEffect(()=>{
    if(wedgeLog.length > prevLogLen.current) setTab("hist");
    prevLogLen.current = wedgeLog.length;
  },[wedgeLog.length]);
  return (
    <div style={{width:220,flexShrink:0,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"5px 10px",borderBottom:"1px solid #1e3450",flexShrink:0,display:"flex",alignItems:"center",gap:4}}>
        {[["cfs","CFS STRADDLE"],["hist","WEDGE HISTORY"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{background:tab===id?"rgba(20,60,150,.4)":"transparent",border:`1px solid ${tab===id?"rgba(50,110,220,.5)":"transparent"}`,
              color:tab===id?"#80b8f0":"#305070",padding:"2px 6px",borderRadius:2,cursor:"pointer",fontSize:8,fontWeight:700,letterSpacing:".07em",fontFamily:"inherit"}}>
            {lbl}{id==="hist"&&wedgeLog.length>0&&<span style={{background:"rgba(60,140,220,.3)",color:"#60a0d0",borderRadius:8,padding:"0 4px",marginLeft:3,fontSize:7}}>{wedgeLog.length}</span>}
          </button>
        ))}
        {tab==="hist" && wedgeLog.length>0 && <>
          <button className="btn" style={{marginLeft:"auto",fontSize:7,padding:"1px 4px",color:"#40c080",borderColor:"#1a5030"}} onClick={()=>{if(reloadWedgeQuote)wedgeLog.forEach(l=>reloadWedgeQuote(l));}} title="Reload all history onto surface">↺ ALL</button>
          <button className="btn" style={{fontSize:7,padding:"1px 4px"}} onClick={()=>setWedgeLog([])}>CLEAR</button>
        </>}
      </div>
      {tab==="cfs" && (
        <div style={{flex:1,overflow:"auto"}}>
          {entries.length===0
            ?<div style={{padding:"20px 10px",color:"#1e3048",fontSize:9,textAlign:"center"}}>No prices yet</div>
            :entries.map(({row,actB,actO,live,cfsBid,cfsOffer})=>(
              <div key={row.id} style={{padding:"5px 10px",borderBottom:"1px solid #1a2e44"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:3}}>
                  <span style={{color:"#5aaae8",fontWeight:700,fontSize:11}}>{row.cfsPeriod}</span>
                  <span style={{color:"#2a4060",fontSize:8}}>{row.swpLabel}</span>
                </div>
                {cfsBid&&<div style={{marginBottom:2}}>
                  <span style={{color:"#00c040",fontWeight:700,fontSize:12}}>{cfsBid}</span>
                  <span style={{fontSize:7,marginLeft:4}}>
                    {live.bidBank&&<span style={{color:cfBkCol(live.bidBank)}}>{live.bidBank}</span>}
                    {actB[0]?.bank&&<span style={{color:cfBkCol(actB[0].bank),marginLeft:3}}>+{actB[0].bank}</span>}
                  </span>
                </div>}
                {cfsOffer&&<div>
                  <span style={{color:"#ff8c00",fontWeight:700,fontSize:12}}>{cfsOffer}</span>
                  <span style={{fontSize:7,marginLeft:4}}>
                    {live.offerBank&&<span style={{color:cfBkCol(live.offerBank)}}>{live.offerBank}</span>}
                    {actO[0]?.bank&&<span style={{color:cfBkCol(actO[0].bank),marginLeft:3}}>+{actO[0].bank}</span>}
                  </span>
                </div>}
                <div style={{marginTop:3,fontSize:7,color:"#1e3450"}}>
                  wedge: {actB[0]?<span style={{color:"#2a6040"}}>{actB[0].price>0?"+":""}{actB[0].price}</span>:null}
                  {actB[0]&&actO[0]&&" / "}
                  {actO[0]?<span style={{color:"#604020"}}>{actO[0].price>0?"+":""}{actO[0].price}</span>:null}
                </div>
              </div>
            ))
          }
        </div>
      )}
      {tab==="hist" && (
        <div style={{flex:1,overflow:"auto"}}>
          {wedgeLog.length===0
            ?<div style={{padding:"20px 10px",color:"#1e3048",fontSize:9,textAlign:"center"}}>No wedge history yet</div>
            :wedgeLog.map(l=>(
              <div key={l.lid} className="lr" style={{padding:"6px 10px",borderBottom:"1px solid #1a2e44"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{display:"flex",gap:4,alignItems:"baseline"}}>
                    <span style={{color:"#5aaae8",fontWeight:700,fontSize:11}}>{l.period}</span>
                    <span style={{color:"#2a4060",fontSize:8}}>{l.swpLabel}</span>
                  </div>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <span style={{color:"#1e3048",fontSize:7}}>{new Date(l.ts).toLocaleTimeString("en-GB",{hour12:false})}</span>
                    <span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>setWedgeLog(p=>p.filter(x=>x.lid!==l.lid))}>✕</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  {l.bid!=null&&<><span style={{color:"#007a28",fontSize:7}}>B</span><span style={{color:"#00c040",fontWeight:700,fontSize:12}}>{l.bid>0?"+":""}{l.bid}</span>{l.bidBank&&<span style={{color:cfBkCol(l.bidBank),fontSize:8,marginLeft:2}}>{l.bidBank}</span>}</>}
                  {l.bid!=null&&l.offer!=null&&<span style={{color:"#243c54",fontSize:9}}>/</span>}
                  {l.offer!=null&&<><span style={{color:"#994400",fontSize:7}}>O</span><span style={{color:"#ff8c00",fontWeight:700,fontSize:12}}>{l.offer>0?"+":""}{l.offer}</span>{l.offerBank&&<span style={{color:cfBkCol(l.offerBank),fontSize:8,marginLeft:2}}>{l.offerBank}</span>}</>}
                </div>
                <button onClick={()=>reloadWedgeQuote&&reloadWedgeQuote(l)}
                  style={{background:"rgba(20,60,30,.5)",border:"1px solid rgba(40,140,80,.4)",color:"#40c080",fontSize:7,borderRadius:2,padding:"1px 5px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".06em"}}>
                  ↺ LOAD
                </button>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

function CapFloorPanel({ ccy, subMenu, hiddenSt, setHiddenSt, cfLiveRef, cfEodRef, swpQuotes={}, swpReferred }) {
  const initQ = () => ({});  // all cells start empty; straddle ref comes from AUD_DUMMY_QUOTES
  const [cfQuotes,  setCfQuotes]  = React.useState(()=>{
    try{ const s=localStorage.getItem("vbl_cfQuotes"); return s?JSON.parse(s):initQ(); }catch{return initQ();}
  });
  const [wedgeQuotes, setWedgeQuotes] = React.useState({});
  const [wedgeRef,    setWedgeRef]    = React.useState({});
  const [wedgeLog,    setWedgeLog]    = React.useState(()=>{
    try{ return (JSON.parse(localStorage.getItem("vbl_wedgeLog")||"[]")).map(l=>({...l,ts:l.ts})); }catch{return[];} 
  });
  const [wedgeActive, setWedgeActive] = React.useState(null);
  const [wedgeFwdImp, setWedgeFwdImp] = React.useState({});
  const [cfRef,     setCfRef]     = React.useState({});
  const [cfStrike,  setCfStrike]  = React.useState(ccy==="AUD"?AUD_DUMMY_STRIKE:{});
  const [cfVol,     setCfVol]     = React.useState(ccy==="AUD"?AUD_DUMMY_VOL:{});
  const [cfLog,     setCfLog]     = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem("vbl_cfLog")||"[]").map(l=>({...l,ts:l.ts})); }catch{return[];} 
  });
  const [customEntries, setCustomEntries] = React.useState([]);
  const [customLog,     setCustomLog]     = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem("vbl_customLog")||"[]"); }catch{return[];} 
  });
  const [exoticEntries, setExoticEntries] = React.useState([]);
  const [exoticLog,     setExoticLog]     = React.useState(()=>{ try{return JSON.parse(localStorage.getItem("vbl_exoticLog")||"[]");}catch{return[];} });
  const [copiedExLive,  setCopiedExLive]  = React.useState(false);
  const [copiedExEOD,   setCopiedExEOD]   = React.useState(false);
  const [activeCell,setActiveCell]= React.useState(null);
  const [otmView,   setOtmView]   = React.useState('spot');
  const [prevSession,setPrevSession]= React.useState({});
  const [cfFiltBank,setCfFiltBank]= React.useState(null);
  const [cfFiltTen, setCfFiltTen] = React.useState(null);
  const [cfFiltMins,setCfFiltMins]= React.useState(null);
  const [cfFiltStrike,setCfFiltStrike]= React.useState(null);
  const [cfSort,    setCfSort]    = React.useState('desc');
  const [copiedCfLive,setCopiedCfLive]= React.useState(false);
  const [copiedCfEOD, setCopiedCfEOD] = React.useState(false);
  const now = new Date();

  React.useEffect(()=>{ try{localStorage.setItem("vbl_wedgeLog",JSON.stringify(wedgeLog.slice(0,200)));}catch{} },[wedgeLog]);
  React.useEffect(()=>{ try{localStorage.setItem("vbl_cfLog",JSON.stringify(cfLog.slice(0,500)));}catch{} },[cfLog]);
  React.useEffect(()=>{ try{localStorage.setItem("vbl_cfQuotes",JSON.stringify(cfQuotes));}catch{} },[cfQuotes]);
  React.useEffect(()=>{ try{localStorage.setItem("vbl_customLog",JSON.stringify(customLog.slice(0,200)));}catch{} },[customLog]);
    React.useEffect(()=>{ try{localStorage.setItem("vbl_exoticLog",JSON.stringify(exoticLog.slice(0,200)));}catch{} },[exoticLog]);
    const _ccyFirst = React.useRef(true);
  React.useEffect(()=>{
    if(_ccyFirst.current){ _ccyFirst.current=false; return; }
    setCfQuotes(initQ()); try{localStorage.removeItem("vbl_cfQuotes");}catch{}
    setCfStrike(ccy==="AUD"?AUD_DUMMY_STRIKE:{});
    setCfVol(ccy==="AUD"?AUD_DUMMY_VOL:{});
    setCfRef({}); setActiveCell(null); setPrevSession({});
    // NOTE: cfLog intentionally NOT cleared — history persists across ccy tabs
  },[ccy]);

  // Session boundary check — AUD 08:30-16:30 Sydney, others midnight UTC
  React.useEffect(()=>{
    const checkSession = () => {
      const nowUtc = new Date();
      let isActive;
      if(ccy==="AUD"){
        // Sydney = UTC+11 (AEDT) or UTC+10 (AEST) — use Intl to get local Sydney hour
        // Use Intl.DateTimeFormat for reliable parsing (avoids AM/PM locale issues)
        const sydParts = new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(nowUtc);
        const sydHH = parseInt(sydParts.find(p=>p.type==="hour")?.value||"0",10);
        const sydMM = parseInt(sydParts.find(p=>p.type==="minute")?.value||"0",10);
        const mins = sydHH*60+sydMM;
        isActive = mins>=510 && mins<990; // 08:30=510, 16:30=990
      } else {
        const utcHour = nowUtc.getUTCHours(), utcMin = nowUtc.getUTCMinutes();
        isActive = !(utcHour===0 && utcMin<2); // active except first 2 mins of UTC day
      }
      if(!isActive){
        // Archive current quotes to prevSession if there's anything live
        setCfQuotes(cur=>{
          const hasLive = Object.values(cur).some(c=>c.bids?.length>0||c.offers?.length>0);
          if(hasLive) setPrevSession(cur);
          return initQ();
        });
        setCfLog([]);
      }
    };
    checkSession();
    const id = setInterval(checkSession, 60000);
    return ()=>clearInterval(id);
  },[ccy]);

  const visStrikes = ALL_STRIKES.filter(s=>!hiddenSt.has(s));
  const toggleStrike = (s) => setHiddenSt(prev=>{ const n=new Set(prev); n.has(s)?n.delete(s):n.add(s); return n; });

  const cfBankCounts = cfLog.reduce((acc,l)=>{
    if(l.bidBank)   acc[l.bidBank]  =(acc[l.bidBank]  ||0)+1;
    if(l.offerBank) acc[l.offerBank]=(acc[l.offerBank]||0)+1;
    return acc;
  },{});

  const displayCfLog = cfLog.filter(l=>{
    if(cfFiltBank && l.bidBank!==cfFiltBank && l.offerBank!==cfFiltBank) return false;
    if(cfFiltTen  && String(l.tenor)!==String(cfFiltTen)) return false;
    if(cfFiltStrike && l.strikeCol!==cfFiltStrike) return false;
    if(cfFiltMins){ const age=(now-(l.ts instanceof Date?l.ts:new Date(l.ts)))/60000; if(isNaN(age)||age>cfFiltMins) return false; }
    return true;
  }).slice().sort((a,b)=>{
    const ta=a.ts instanceof Date?a.ts:new Date(a.ts);
    const tb=b.ts instanceof Date?b.ts:new Date(b.ts);
    return cfSort==="asc"?ta-tb:tb-ta;
  });

  const addQuotes = (key,tenor,type,f,strikeCol=null) => {
    const ts = new Date();
    setCfQuotes(prev=>{
      const cell=prev[key]||{bids:[],offers:[]};
      const nb=f.bid?  [...cell.bids,  {id:Date.now(),   price:parseFloat(f.bid),   bank:f.bidBank||null,   strike:f.bidStrike,   ts}]:cell.bids;
      const no=f.offer?[...cell.offers,{id:Date.now()+1, price:parseFloat(f.offer), bank:f.offerBank||null, strike:f.offerStrike, ts}]:cell.offers;
      return {...prev,[key]:{bids:nb,offers:no}};
    });
    setCfLog(prev=>[{id:Date.now(),ccy,tenor,type,
      bid:f.bid?parseFloat(f.bid):null, offer:f.offer?parseFloat(f.offer):null,
      bidBank:f.bidBank||null, offerBank:f.offerBank||null,
      bidStrike:f.bidStrike, offerStrike:f.offerStrike, strikeCol, ts},...prev]);
    setActiveCell(null);
  };


  // Reload a log entry directly into cfQuotes (no re-log)
  const cfReloadQuote = (l) => {
    const key = l.type==="FWD"
      ? `${l.ccy}_fwd_${l.tenor}`
      : (l.strikeCol ? `${l.ccy}_${l.tenor}_${l.type.toLowerCase()}_${l.strikeCol}` : `${l.ccy}_${l.tenor}_${l.type}`);
    const id = Date.now();
    setCfQuotes(prev => {
      const cell = prev[key]||{bids:[],offers:[]};
      const nb = l.bid  !=null ? [...cell.bids,  {id,      price:l.bid,   bank:l.bidBank||null,   ts:new Date()}].sort((a,b)=>b.price-a.price) : cell.bids;
      const no = l.offer!=null ? [...cell.offers,{id:id+1, price:l.offer, bank:l.offerBank||null, ts:new Date()}].sort((a,b)=>a.price-b.price) : cell.offers;
      return {...prev,[key]:{bids:nb,offers:no}};
    });
  };
  const cfReloadAllLog = (logEntries) => {
    setCfQuotes(prev => {
      const next = {...prev};
      logEntries.forEach((l,i) => {
        const key = l.type==="FWD"
          ? `${l.ccy}_fwd_${l.tenor}`
          : (l.strikeCol ? `${l.ccy}_${l.tenor}_${l.type.toLowerCase()}_${l.strikeCol}` : `${l.ccy}_${l.tenor}_${l.type}`);
        const id = Date.now()+i*2;
        const cell = next[key]||{bids:[],offers:[]};
        const nb = l.bid  !=null ? [...cell.bids,  {id,      price:l.bid,   bank:l.bidBank||null,   ts:new Date()}].sort((a,b)=>b.price-a.price) : cell.bids;
        const no = l.offer!=null ? [...cell.offers,{id:id+1, price:l.offer, bank:l.offerBank||null, ts:new Date()}].sort((a,b)=>a.price-b.price) : cell.offers;
        next[key] = {bids:nb,offers:no};
      });
      return next;
    });
  };

  const cfCopyClip = (text, setter) => {
    navigator.clipboard.writeText(text).then(()=>{ setter(true); setTimeout(()=>setter(false),1800); });
  };

  const cfExportLive = () => {
    const lines = [];
    if(subMenu==="atm"){
      lines.push(`${ccy} ATM CAPS & FLOORS`);
      CF_TENORS.forEach(t=>{
        const stk=cfStrike?.[`${ccy}_${t}`]||"";
        CF_TYPES.forEach(tp=>{
          const key=cfqKey(ccy,t,tp);
          const cell=cfQuotes[key]; if(!cell) return;
          const actB=(cell.bids||[]).filter(q=>!cfRef[key]?.has(`b|${q.id}`))[0];
          const actO=(cell.offers||[]).filter(q=>!cfRef[key]?.has(`o|${q.id}`))[0];
          if(!actB&&!actO) return;
          const b=actB?actB.price.toFixed(4):"";
          const o=actO?actO.price.toFixed(4):"";
          lines.push((`${t}y ${tp}`).padEnd(14)+`atm ${stk}%`.padEnd(14)+`${b}/${o}`);
        });
      });
    } else if(subMenu==="wedge"){
      const wLines=[];
      WEDGE_ROWS.forEach(row=>{
        const wq=wedgeQuotes[row.id]; if(!wq) return;
        const wr=wedgeRef[row.id];
        const wB=wq.bids.filter(q=>!wr?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price)[0];
        const wO=wq.offers.filter(q=>!wr?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price)[0];
        if(!wB&&!wO) return;
        wLines.push((row.cfsPeriod).padEnd(8)+`${row.swpLabel}`.padEnd(12)+(wB?`${wB.price>0?"+":""}${wB.price}`:"")+" / "+(wO?`${wO.price>0?"+":""}${wO.price}`:""));
      });
      if(wLines.length){ lines.push(`${ccy} WEDGE BP'S`); wLines.forEach(l=>lines.push(l)); lines.push(""); }
    } else if(subMenu==="otm"){
      const doView=(view)=>{
        const rows=view==="spot"?CF_TENORS.map(t=>({rk:String(t),lbl:`${t}y`})):ALL_FWDS.map(({s,e})=>({rk:`${s}x${e}`,lbl:`${s}x${e}`}));
        const sec=[]; let any=false;
        rows.forEach(({rk,lbl})=>{
          visStrikes.filter(s=>s!=="ATM-STD").forEach(sk=>{
            ["cap","flr"].forEach(tp=>{
              const key=`${ccy}_${rk}_${tp}_${sk}`;
              const cell=cfQuotes[key]; if(!cell) return;
              const actB=(cell.bids||[]).filter(q=>!cfRef[key]?.has(`b|${q.id}`))[0];
              const actO=(cell.offers||[]).filter(q=>!cfRef[key]?.has(`o|${q.id}`))[0];
              if(!actB&&!actO) return;
              sec.push((lbl+" "+sk+"%").padEnd(14)+(tp.toUpperCase()).padEnd(5)+(actB?actB.price.toFixed(4):"")+"/"+(actO?actO.price.toFixed(4):""));
              any=true;
            });
          });
        });
        if(any){ lines.push(`${ccy} OTM ${view.toUpperCase()} CAPS & FLOORS`); sec.forEach(l=>lines.push(l)); lines.push(""); }
      };
      doView("spot"); doView("fwd");
    }
    // FWD STRADDLES — iterate ALL WEDGE_ROWS (not just FWD_COLS grid) so legged prices aren't missed
    if(subMenu==="atm"){
      const fwdLines=[];
      // Collect unique fwd pairs: all WEDGE_ROWS + any outright cfQuotes fwd keys
      const seenPairs = new Set();
      const fwdPairs = [];
      WEDGE_ROWS.forEach(row=>{
        const k=`${row.cfsS}x${row.cfsE}`;
        if(!seenPairs.has(k)){ seenPairs.add(k); fwdPairs.push({s:row.cfsS,e:row.cfsE,label:row.cfsPeriod}); }
      });
      // also include any outright fwd quotes not already covered
      Object.keys(cfQuotes).filter(k=>k.startsWith(`${ccy}_fwd_`)).forEach(k=>{
        const pair=k.replace(`${ccy}_fwd_`,""); // e.g. "1x2"
        if(!seenPairs.has(pair)){
          const [s,e]=pair.split("x").map(Number);
          if(!isNaN(s)&&!isNaN(e)){ seenPairs.add(pair); fwdPairs.push({s,e,label:pair}); }
        }
      });
      fwdPairs.sort((a,b)=>a.s!==b.s?a.s-b.s:a.e-b.e);
      fwdPairs.forEach(({s,e,label})=>{
        const key=fwdqKey(ccy,s,e);
        const leg=wedgeLookup[`${s}x${e}`];
        const cell=cfQuotes[key];
        const actB=cell?(cell.bids||[]).filter(q=>!cfRef[key]?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price):[];
        const actO=cell?(cell.offers||[]).filter(q=>!cfRef[key]?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price):[];
        const bbOut=actB[0]; const boOut=actO[0];
        const bbLeg=leg?.leggedBid; const boLeg=leg?.leggedOffer;
        const bestB = bbOut&&bbLeg ? (bbOut.price>=bbLeg?{p:bbOut.price,leg:false}:{p:bbLeg,leg:true})
                    : bbOut ? {p:bbOut.price,leg:false}
                    : bbLeg ? {p:bbLeg,leg:true} : null;
        const bestO = boOut&&boLeg ? (boOut.price<=boLeg?{p:boOut.price,leg:false}:{p:boLeg,leg:true})
                    : boOut ? {p:boOut.price,leg:false}
                    : boLeg ? {p:boLeg,leg:true} : null;
        if(!bestB&&!bestO) return;
        const bStr=bestB?`${bestB.p.toFixed(4)}${bestB.leg?" *L*":""}` : "";
        const oStr=bestO?`${bestO.p.toFixed(4)}${bestO.leg?" *L*":""}` : "";
        fwdLines.push((label||`${s}x${e}`).padEnd(8)+bStr+" / "+oStr);
      });
      if(fwdLines.length){ lines.push(""); lines.push(`${ccy} FWD CFS STRADDLE`); fwdLines.forEach(l=>lines.push(l)); lines.push(""); }
      // WEDGE PRICES
      const wLines=[];
      WEDGE_ROWS.forEach(row=>{
        const wq=wedgeQuotes[row.id]; if(!wq) return;
        const wr=wedgeRef[row.id];
        const wB=wq.bids.filter(q=>!wr?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price)[0];
        const wO=wq.offers.filter(q=>!wr?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price)[0];
        if(!wB&&!wO) return;
        const bStr=wB?`${wB.price>0?"+":""}${wB.price}` : "";
        const oStr=wO?`${wO.price>0?"+":""}${wO.price}` : "";
        wLines.push((row.cfsPeriod).padEnd(8)+`${row.swpLabel}`.padEnd(12)+bStr+" / "+oStr);
      });
      if(wLines.length){ lines.push(""); lines.push(`${ccy} WEDGE BP'S`); wLines.forEach(l=>lines.push(l)); lines.push(""); }
    }
    // CUSTOM entries
    if(subMenu==="custom" && customEntries.length>0){
      lines.push(`${ccy} CUSTOM CAPS & FLOORS`);
      customEntries.forEach(e=>{
        const b=e.bid!=null?e.bid.toFixed(4):"";
        const o=e.offer!=null?e.offer.toFixed(4):"";
        const atm=e.atm?` ATM ${e.atm}%`:"";
        const stk=e.strike?` K=${e.strike}%`:"";
        const delta2=e.delta?` Δ=${e.delta}%`:""; lines.push(`${e.type} ${e.tenor||""}${stk}${atm}${delta2}`.padEnd(28)+`${b}/${o}`);
      });
    }
    while(lines.length&&lines[lines.length-1]==="") lines.pop();
    if(!lines.length) return;
    cfCopyClip(lines.join("\n"), setCopiedCfLive);
  };

  const cfExportEOD = () => {
    const out = [];
    const pad="                              ";
    if(subMenu==="atm"){
      out.push(`${ccy} ATM CAPS & FLOORS`);
      CF_TENORS.forEach(t=>{
        const stk=cfStrike?.[`${ccy}_${t}`]||"";
        CF_TYPES.forEach(tp=>{
          const key=cfqKey(ccy,t,tp);
          const cell=cfQuotes[key]; if(!cell) return;
          const allB=cell.bids||[]; const allO=cell.offers||[];
          if(!allB.length&&!allO.length) return;
          const actB=allB.filter(q=>!cfRef[key]?.has(`b|${q.id}`));
          const actO=allO.filter(q=>!cfRef[key]?.has(`o|${q.id}`));
          const refB=allB.filter(q=> cfRef[key]?.has(`b|${q.id}`));
          const refO=allO.filter(q=> cfRef[key]?.has(`o|${q.id}`));
          out.push((`${t}y ${tp}`).padEnd(14)+`atm ${stk}%`.padEnd(14)+(actB[0]?actB[0].price.toFixed(4):"")+"/"+(actO[0]?actO[0].price.toFixed(4):""));
          actB.slice(1).forEach(q=>out.push(pad+q.price.toFixed(4)+"/"));
          actO.slice(1).forEach(q=>out.push(pad+"/"+q.price.toFixed(4)));
          refB.forEach(q=>out.push(pad+"("+q.price.toFixed(4)+"/ reffed)"));
          refO.forEach(q=>out.push(pad+"(/"+q.price.toFixed(4)+" reffed)"));
          out.push("");
        });
      });
    } else {
      const doView=(view)=>{
        const rows=view==="spot"?CF_TENORS.map(t=>({rk:String(t),lbl:`${t}y`})):ALL_FWDS.map(({s,e})=>({rk:`${s}x${e}`,lbl:`${s}x${e}`}));
        const sec=[]; let any=false;
        rows.forEach(({rk,lbl})=>{
          visStrikes.filter(s=>s!=="ATM-STD").forEach(sk=>{
            ["cap","flr"].forEach(tp=>{
              const key=`${ccy}_${rk}_${tp}_${sk}`;
              const cell=cfQuotes[key]; if(!cell) return;
              const allB=cell.bids||[]; const allO=cell.offers||[];
              if(!allB.length&&!allO.length) return;
              const actB=allB.filter(q=>!cfRef[key]?.has(`b|${q.id}`));
              const actO=allO.filter(q=>!cfRef[key]?.has(`o|${q.id}`));
              const refB=allB.filter(q=> cfRef[key]?.has(`b|${q.id}`));
              const refO=allO.filter(q=> cfRef[key]?.has(`o|${q.id}`));
              sec.push((lbl+" "+sk+"%").padEnd(14)+(tp.toUpperCase()).padEnd(5)+(actB[0]?actB[0].price.toFixed(4):"")+"/"+(actO[0]?actO[0].price.toFixed(4):""));
              actB.slice(1).forEach(q=>sec.push(pad+q.price.toFixed(4)+"/"));
              actO.slice(1).forEach(q=>sec.push(pad+"/"+q.price.toFixed(4)));
              refB.forEach(q=>sec.push(pad+"("+q.price.toFixed(4)+"/ reffed)"));
              refO.forEach(q=>sec.push(pad+"(/"+q.price.toFixed(4)+" reffed)"));
              sec.push(""); any=true;
            });
          });
        });
        if(any){ out.push(`${ccy} OTM ${view.toUpperCase()} CAPS & FLOORS`); sec.forEach(l=>out.push(l)); }
      };
      doView("spot"); doView("fwd");
    }
    if(subMenu==="wedge"){ const wl=[]; WEDGE_ROWS.forEach(row=>{ const wq=wedgeQuotes[row.id]; if(!wq) return; const wr=wedgeRef[row.id]; const aB=wq.bids.filter(q=>!wr?.has(`b|${q.id}`)); const aO=wq.offers.filter(q=>!wr?.has(`o|${q.id}`)); const rB=wq.bids.filter(q=>wr?.has(`b|${q.id}`)); const rO=wq.offers.filter(q=>wr?.has(`o|${q.id}`)); if(!aB.length&&!aO.length&&!rB.length&&!rO.length) return; wl.push((row.cfsPeriod).padEnd(8)+`${row.swpLabel}`.padEnd(12)+(aB[0]?`${aB[0].price>0?"+":""}${aB[0].price}`:"")+' / '+(aO[0]?`${aO[0].price>0?"+":""}${aO[0].price}`:"")  ); aB.slice(1).forEach(q=>wl.push("".padEnd(20)+`${q.price>0?"+":""}${q.price}/`)); aO.slice(1).forEach(q=>wl.push("".padEnd(20)+`/${q.price>0?"+":""}${q.price}`)); rB.forEach(q=>wl.push("".padEnd(20)+`(reffed ${q.price>0?"+":""}${q.price}/)`)); wl.push(""); }); if(wl.length){ out.unshift(`${ccy} WEDGE BP'S - EOD`); wl.forEach(l=>out.push(l)); } }
    if(subMenu==="custom"&&customEntries.length>0){ out.push(`${ccy} CUSTOM C&F - EOD`); customEntries.forEach(e=>{ const b=e.bid!=null?e.bid.toFixed(4):""; const o=e.offer!=null?e.offer.toFixed(4):""; out.push(`${e.type} ${e.tenor||""}`+(e.strike?` K=${e.strike}%`:""  )+(e.atm?` ATM ${e.atm}%`:""  )+(e.delta?` Δ=${e.delta}%`:"").padEnd(30)+`${b}/${o}`); }); }
    while(out.length&&out[out.length-1]==="") out.pop();
    if(!out.length) return;
    cfCopyClip(out.join("\n"), setCopiedCfEOD);
  };

  // build wedge lookup: {`${s}x${e}` -> {leggedBid, leggedBidSwpBank, leggedBidWedgeBank, leggedOffer, leggedOfferSwpBank, leggedOfferWedgeBank}}
  const wedgeLookup = React.useMemo(()=>{
    const AUD_PREM_LOCAL = ccy==="AUD" ? AUD_PREM : null;
    const TENORS_IDX_LOCAL = {"1Y":0,"2Y":1,"3Y":2,"4Y":3,"5Y":4,"7Y":5,"10Y":6,"12Y":7,"15Y":8,"20Y":9};
    const map = {};
    WEDGE_ROWS.forEach(row=>{
      const k = `${row.cfsS}x${row.cfsE}`;
      const swpCell = swpQuotes[`${row.swpExp}|${row.swpTen}`];
      const swpActB = swpCell ? swpCell.bids.filter(q=>!swpReferred?.has(`${row.swpExp}|${row.swpTen}|bids|${q.id}`)) : [];
      const swpActO = swpCell ? swpCell.offers.filter(q=>!swpReferred?.has(`${row.swpExp}|${row.swpTen}|offers|${q.id}`)) : [];
      const swpBid   = swpActB[0]?.price ?? (AUD_PREM_LOCAL?.[row.swpExp]?.[TENORS_IDX_LOCAL[row.swpTen]] ?? null);
      const swpOffer = swpActO[0]?.price ?? (AUD_PREM_LOCAL?.[row.swpExp]?.[TENORS_IDX_LOCAL[row.swpTen]] ?? null);
      const wq = wedgeQuotes[row.id]||{bids:[],offers:[]};
      const wr = wedgeRef[row.id];
      const wActB = wq.bids.filter(q=>!wr?.has(`b|${q.id}`)).slice().sort((a,b)=>b.price-a.price);
      const wActO = wq.offers.filter(q=>!wr?.has(`o|${q.id}`)).slice().sort((a,b)=>a.price-b.price);
      if((wActB[0]||wActO[0])) {
        map[k] = {
          leggedBid:   swpBid!=null   && wActB[0] ? +(swpBid   + wActB[0].price).toFixed(4) : null,
          leggedBidSwpBank:   swpActB[0]?.bank ?? null,
          leggedBidWedgeBank: wActB[0]?.bank ?? null,
          leggedOffer: swpOffer!=null && wActO[0] ? +(swpOffer + wActO[0].price).toFixed(4) : null,
          leggedOfferSwpBank:   swpActO[0]?.bank ?? null,
          leggedOfferWedgeBank: wActO[0]?.bank ?? null,
          swpBid, swpOffer,
          wedgeBid:   wActB[0]?.price ?? null,
          wedgeOffer: wActO[0]?.price ?? null,
        };
      }
    });
    return map;
  }, [wedgeQuotes, wedgeRef, swpQuotes, swpReferred, ccy]);

  React.useEffect(()=>{ if(cfLiveRef) cfLiveRef.current=cfExportLive; if(cfEodRef) cfEodRef.current=cfExportEOD; });


  const addWedgeQuote = (id, f) => {
    const ts = new Date();
    setWedgeQuotes(prev => {
      const cell = prev[id] || {bids:[],offers:[]};
      const nb = f.bid   ? [...cell.bids,   {id:Date.now(),   price:parseFloat(f.bid),   bank:f.bidBank||null,   ts}] : cell.bids;
      const no = f.offer ? [...cell.offers,  {id:Date.now()+1, price:parseFloat(f.offer), bank:f.offerBank||null, ts}] : cell.offers;
      return {...prev, [id]:{bids:nb,offers:no}};
    });
    const row = WEDGE_ROWS.find(r=>r.id===id);
    setWedgeLog(prev=>[{lid:Date.now()+2,rowId:id,
      period:row?row.cfsPeriod:id, swpLabel:row?row.swpLabel:id,
      bid:f.bid?parseFloat(f.bid):null, offer:f.offer?parseFloat(f.offer):null,
      bidBank:f.bidBank||null, offerBank:f.offerBank||null, ts:new Date().toISOString()},...prev].slice(0,200));
    setWedgeActive(null);
  };
  const reloadWedgeQuote = (l) => {
    const id = Date.now();
    setWedgeQuotes(prev => {
      const cell = prev[l.rowId] || {bids:[],offers:[]};
      const nb = l.bid   != null ? [...cell.bids,   {id,     price:l.bid,   bank:l.bidBank||null,   ts:new Date()}].sort((a,b)=>b.price-a.price) : cell.bids;
      const no = l.offer != null ? [...cell.offers, {id:id+1,price:l.offer, bank:l.offerBank||null, ts:new Date()}].sort((a,b)=>a.price-b.price) : cell.offers;
      return {...prev, [l.rowId]:{bids:nb,offers:no}};
    });
  };

  const toggleWedgeRef = (id, side, qid) => {
    const k = `${side}|${qid}`;
    setWedgeRef(prev => { const s = new Set(prev[id]||[]); s.has(k)?s.delete(k):s.add(k); return {...prev,[id]:s}; });
  };
  const delWedgeQ = (id, side, qid) => {
    setWedgeQuotes(prev => {
      const cell = prev[id]||{bids:[],offers:[]};
      return {...prev,[id]:{bids:side==='b'?cell.bids.filter(q=>q.id!==qid):cell.bids, offers:side==='o'?cell.offers.filter(q=>q.id!==qid):cell.offers}};
    });
  };

  const toggleRef=(ck,side,qid)=>{
    const k=`${side}|${qid}`;
    setCfRef(prev=>{ const s=new Set(prev[ck]||[]); s.has(k)?s.delete(k):s.add(k); return {...prev,[ck]:s}; });
  };

  const delQ=(ck,side,qid)=>{
    setCfQuotes(prev=>{
      const c=prev[ck]||{bids:[],offers:[]};
      const nb=side==='b'?c.bids.filter(q=>q.id!==qid):c.bids;
      const no=side==='o'?c.offers.filter(q=>q.id!==qid):c.offers;
      return {...prev,[ck]:{bids:nb,offers:no}};
    });
  };

  const entryLabel = () => {
    if(!activeCell) return "";
    if(activeCell.isOtm) return `${ccy} · ${activeCell.tenor}Y ${activeCell.type} K=${activeCell.strike}`;
    if(activeCell.isFwd) return `${ccy} · ${activeCell.tenor} FWD`;
    return `${ccy} · ${activeCell.tenor}Y ${activeCell.type}`;
  };


  // ── Custom panel inline state ──
  const [custForm, setCustForm] = React.useState({label:"",type:"CAP",tenor:"",strike:"",atm:"",delta:"",bid:"",offer:"",bidBank:"",offerBank:""});
  const [custSuggest, setCustSuggest] = React.useState([]);
  const [custEditId, setCustEditId] = React.useState(null);
  const [custEditForm, setCustEditForm] = React.useState({bid:"",offer:"",bidBank:"",offerBank:"",atm:"",delta:""});
  const [custActiveField, setCustActiveField] = React.useState(null);
  const [custHistSort, setCustHistSort] = React.useState("desc");
  const custIS = {background:"#060a10",border:"1px solid #2a4870",color:"#b0bcc8",fontSize:10,borderRadius:3,padding:"3px 6px",fontFamily:"inherit",outline:"none",marginBottom:3,width:"100%"};
  const custBankInput=(field,val)=>{ const v=val.toUpperCase(); setCustActiveField(field); setCustForm(f=>({...f,[field]:v})); setCustSuggest(v.length>=1?BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6):[]); };
  const custTypeCol = (t) => t==="CAP"?"#ff8c00":t==="FLOOR"?"#00c040":t==="COLLAR"?"#a070d0":t==="STRADDLE"?"#c080d0":"#80b8d8";
  const custAdd = (overrides) => {
    const src2 = overrides||custForm;
    if(!src2.bid&&!src2.offer&&!src2.label&&!src2.tenor) return;
    const entry = {id:Date.now(),...src2,atm:src2.atm||null,delta:src2.delta||null,bid:src2.bid?parseFloat(src2.bid):null,offer:src2.offer?parseFloat(src2.offer):null,ts:new Date()};
    setCustomEntries(prev=>[entry,...prev]);
    setCustomLog(prev=>[{lid:Date.now()+1,...src2,bid:src2.bid?parseFloat(src2.bid):null,offer:src2.offer?parseFloat(src2.offer):null,ts:new Date()},...prev].slice(0,500));
    if(!overrides) setCustForm({label:"",type:"CAP",tenor:"",strike:"",atm:"",delta:"",bid:"",offer:"",bidBank:"",offerBank:""});
    setCustSuggest([]);
  };
  const custRemove = (id) => setCustomEntries(prev=>prev.filter(e=>e.id!==id));
  const custLoadFromLog = (l) => custAdd({label:l.label,type:l.type,tenor:l.tenor,strike:l.strike,bid:l.bid!=null?String(l.bid):"",offer:l.offer!=null?String(l.offer):"",bidBank:l.bidBank||"",offerBank:l.offerBank||""});
  const custSortedLog = [...customLog].sort((a,b)=>{ const ta=a.ts instanceof Date?a.ts:new Date(a.ts); const tb=b.ts instanceof Date?b.ts:new Date(b.ts); return custHistSort==="asc"?ta-tb:tb-ta; });

    // wedge/custom/exotic all rendered via display:none toggle — never unmount

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>

      {/* ── WEDGE (persistent) ── */}
      <div style={{display:subMenu==="wedge"?"flex":"none",flex:1,flexDirection:"column",overflow:"hidden",minHeight:0}}>
        <WedgePanel
          ccy={ccy}
          wedgeQuotes={wedgeQuotes} wedgeRef={wedgeRef} wedgeLog={wedgeLog} setWedgeLog={setWedgeLog}
          wedgeActive={wedgeActive} setWedgeActive={setWedgeActive}
          wedgeFwdImp={wedgeFwdImp} setWedgeFwdImp={setWedgeFwdImp}
          addWedgeQuote={addWedgeQuote} reloadWedgeQuote={reloadWedgeQuote}
          toggleWedgeRef={toggleWedgeRef} delWedgeQ={delWedgeQ}
          swpQuotes={swpQuotes} swpReferred={swpReferred}
          cfQuotes={cfQuotes} cfRef={cfRef}
          cfBkCol={cfBkCol}/>
      </div>

      {/* ── CUSTOM (persistent) ── */}
      {subMenu==="custom" && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
        {/* toolbar */}
        <div style={{background:"#080c14",borderBottom:"1px solid #1a2e44",padding:"5px 14px",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"#3a6080",fontSize:9,letterSpacing:".1em"}}>CUSTOM CAPS & FLOORS · {ccy}</span>
          <span style={{color:"#1e3048",fontSize:8,marginLeft:4}}>BESPOKE STRUCTURES</span>
          <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
            {customEntries.length>0&&<span style={{color:"#243c54",fontSize:9}}>{customEntries.length} active</span>}
            <button onClick={cfExportLive} style={{background:copiedCfLive?"rgba(20,120,60,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedCfLive?"rgba(40,200,100,.5)":"#2e4e78"}`,color:copiedCfLive?"#40e890":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>{copiedCfLive?"COPIED ✓":"LIVE"}</button>
            <button onClick={cfExportEOD}  style={{background:copiedCfEOD?"rgba(120,80,20,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedCfEOD?"rgba(200,150,40,.5)":"#2e4e78"}`,color:copiedCfEOD?"#e0b040":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>{copiedCfEOD?"COPIED ✓":"EOD"}</button>
            {customLog.length>0&&<button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={()=>{setCustomEntries([]);setCustomLog([])}}>CLEAR ALL</button>}
          </div>
        </div>
        <div style={{flex:1,width:"100%",display:"flex",overflow:"hidden",minHeight:0}}>
          {/* LEFT: entry form */}
          <div style={{width:280,flexShrink:0,padding:"14px 12px",borderRight:"1px solid #1a2e44",display:"flex",flexDirection:"column",gap:6,overflowY:"auto",background:"#040810"}}>
            <div style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".12em",marginBottom:2}}>NEW ENTRY</div>
            <div>
              <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>LABEL / DESCRIPTION</div>
              <input style={custIS} value={custForm.label} onChange={e=>{
                  const lbl=e.target.value;
                  const parsed={};
                  // tenor: leading NxM or Ny pattern
                  const tenM=lbl.match(/\b(\d+[xy]\d+|\d+[yY])\b/i);
                  if(tenM) parsed.tenor=tenM[1].toUpperCase();
                  // strike: number followed by % or ending in digit after space
                  const stkM=lbl.match(/\b(\d+\.\d+)\s*%/);
                  if(stkM) parsed.strike=stkM[1];
                  // type: cap/floor/collar/straddle etc
                  const typeM=lbl.match(/\b(cap|floor|collar|straddle|corridor|digital cap|digital floor|barrier cap|barrier floor|ratchet)\b/i);
                  if(typeM) parsed.type=typeM[1].toUpperCase().replace('DIGITAL CAP','DIGITAL CAP').replace('DIGITAL FLOOR','DIGITAL FLOOR').replace('BARRIER CAP','BARRIER CAP').replace('BARRIER FLOOR','BARRIER FLOOR');
                  // ATM if mentioned
                  const atmM=lbl.match(/\bATM[\s@-]*(\d+\.?\d*)%?/i);
                  if(atmM&&atmM[1]) parsed.atm=atmM[1];
                  setCustForm(f=>({...f,label:lbl,...parsed}));
                }} placeholder="e.g. 5Y Cap 4.50% notional 100m"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div>
                <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>TYPE</div>
                <select style={{...custIS,marginBottom:0,color:custTypeCol(custForm.type),fontWeight:700}} value={custForm.type} onChange={e=>setCustForm(f=>({...f,type:e.target.value}))}>
                  <option>CAP</option><option>FLOOR</option><option>COLLAR</option><option>STRADDLE</option>
                  <option>CORRIDOR</option><option>DIGITAL CAP</option><option>DIGITAL FLOOR</option>
                  <option>BARRIER CAP</option><option>BARRIER FLOOR</option><option>RATCHET</option>
                </select>
              </div>
              <div>
                <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>TENOR</div>
                <input style={custIS} value={custForm.tenor} onChange={e=>setCustForm(f=>({...f,tenor:e.target.value}))} placeholder="e.g. 5Y, 2x7"/>
              </div>
            </div>
            <div>
              <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>STRIKE %</div>
              <input style={custIS} value={custForm.strike} onChange={e=>setCustForm(f=>({...f,strike:e.target.value}))} placeholder="e.g. 4.500"/>
            </div>
            <div>
              <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>ATM REF %</div>
              <input style={{...custIS,color:"#a070d0"}} value={custForm.atm} onChange={e=>setCustForm(f=>({...f,atm:e.target.value}))} placeholder="e.g. 4.006"/>
            </div>
            <div>
              <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>Δ DELTA %</div>
              <input style={{...custIS,color:"#4a8070"}} value={custForm.delta||""} onChange={e=>setCustForm(f=>({...f,delta:e.target.value}))} placeholder="e.g. 35"/>
            </div>
            {[{side:"BID",pCol:"#00c040",lCol:"#007a28",fk:"bid",bk:"bidBank"},{side:"OFFER",pCol:"#ff8c00",lCol:"#994400",fk:"offer",bk:"offerBank"}].map(({side,pCol,lCol,fk,bk})=>(
              <div key={side} style={{borderLeft:`3px solid ${pCol}`,paddingLeft:8}}>
                <div style={{color:lCol,fontSize:8,marginBottom:3,letterSpacing:".1em"}}>{side}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                  <input style={{...custIS,marginBottom:0,color:pCol,fontWeight:700}} value={custForm[fk]} onChange={e=>setCustForm(f=>({...f,[fk]:e.target.value}))} placeholder="price (bp)" onKeyDown={e=>e.key==="Enter"&&custAdd()}/>
                  <div style={{position:"relative"}}>
                    <input style={{...custIS,marginBottom:0,color:custForm[bk]?cfBkCol(custForm[bk]):"#b0bcc8",fontWeight:700,letterSpacing:".06em"}} value={custForm[bk]} onChange={e=>custBankInput(bk,e.target.value)} onKeyDown={e=>e.key==="Enter"&&custAdd()} placeholder="BANK" autoComplete="off"/>
                    {custSuggest.length>0&&custActiveField===bk&&(
                      <div className="suggest">{custSuggest.map(b=>(<div key={b} className="sug-item" style={{color:cfBkCol(b)}} onMouseDown={()=>{setCustForm(v=>({...v,[bk]:b}));setCustSuggest([]);}}>{b}</div>))}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={()=>custAdd()} className="btn" style={{width:"100%",fontSize:9,padding:"5px 0",letterSpacing:".12em",marginTop:4,color:"#40a060",borderColor:"#1a4030"}}>+ ADD QUOTE</button>
          </div>
          {/* CENTRE: live entries */}
          <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            <div style={{padding:"6px 12px",borderBottom:"1px solid #1a2e44",flexShrink:0,background:"#060a12",display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>ACTIVE QUOTES</span>
              <span style={{color:"#243c54",fontSize:8,marginLeft:4}}>{customEntries.length} entries</span>
              {customEntries.length>0&&<button className="btn" style={{marginLeft:"auto",fontSize:8,padding:"2px 5px"}} onClick={()=>setCustomEntries([])}>CLEAR ACTIVE</button>}
            </div>
            <div style={{flex:1,overflow:"auto",padding:"0 0 10px 0"}}>
              {customEntries.length===0
                ?<div style={{padding:"60px 0",color:"#1e3048",fontSize:10,textAlign:"center"}}>No active custom quotes<br/><span style={{fontSize:8,color:"#1a2a38"}}>Use the form on the left to add quotes, or ↺ LOAD from history →</span></div>
                :<table style={{borderCollapse:"collapse",width:"100%",fontSize:10}}>
                  <thead style={{position:"sticky",top:0,background:"#060a12",zIndex:1}}>
                    <tr>{["LABEL","TYPE","TENOR","STRIKE","ATM REF","Δ%","BID","NAME","OFFER","NAME","TIME/✎"].map(h=>(<th key={h} style={{color:"#3a6080",fontSize:8,fontWeight:700,padding:"6px 8px",borderBottom:"1px solid #1a2e44",textAlign:"left",letterSpacing:".08em",whiteSpace:"nowrap"}}>{h}</th>))}</tr>
                  </thead>
                  <tbody>
                    {customEntries.map(e=>(
                      <tr key={e.id} className="lr" style={{borderBottom:"1px solid #0e1c2e",background:custEditId===e.id?"rgba(20,50,100,.2)":"transparent"}}>
                        <td style={{padding:"6px 8px",color:"#80b8d8",fontWeight:700,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.label||"—"}</td>
                        <td style={{padding:"6px 8px",color:custTypeCol(e.type),fontWeight:700,fontSize:9,whiteSpace:"nowrap"}}>{e.type}</td>
                        <td style={{padding:"6px 8px",color:"#5aaae8",fontWeight:700}}>{e.tenor||"—"}</td>
                        <td style={{padding:"6px 8px",color:"#4a7898"}}>{e.strike?`${e.strike}%`:"—"}</td>
                        {custEditId===e.id
                          ? <>
                              <td style={{padding:"3px 4px"}}><input autoFocus style={{...custIS,width:52,color:"#a070d0"}} value={custEditForm.atm} onChange={ev=>setCustEditForm(f=>({...f,atm:ev.target.value}))} placeholder="ATM%"/></td>
                              <td style={{padding:"3px 4px"}}><input style={{...custIS,width:44,color:"#4a8070"}} value={custEditForm.delta} onChange={ev=>setCustEditForm(f=>({...f,delta:ev.target.value}))} placeholder="Δ%"/></td>
                              <td style={{padding:"3px 4px"}}><input style={{...custIS,width:60,color:"#00c040",fontWeight:700}} value={custEditForm.bid} onChange={ev=>setCustEditForm(f=>({...f,bid:ev.target.value}))} placeholder="bid"/></td>
                              <td style={{padding:"3px 4px",position:"relative"}}><input style={{...custIS,width:55,color:custEditForm.bidBank?cfBkCol(custEditForm.bidBank):"#888",fontSize:9,fontWeight:700,letterSpacing:".06em"}} value={custEditForm.bidBank} onChange={ev=>{const v=ev.target.value.toUpperCase();setCustActiveField("editBidBank");setCustEditForm(f=>({...f,bidBank:v}));setCustSuggest(v.length>=1?BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6):[]);}} onBlur={()=>setTimeout(()=>setCustSuggest([]),150)} placeholder="BANK" autoComplete="off"/>
                                {custSuggest.length>0&&custActiveField==="editBidBank"&&<div className="suggest">{custSuggest.map(b=>(<div key={b} className="sug-item" style={{color:cfBkCol(b)}} onMouseDown={()=>{setCustEditForm(f=>({...f,bidBank:b}));setCustSuggest([]);}}>{b}</div>))}</div>}
                              </td>
                              <td style={{padding:"3px 4px"}}><input style={{...custIS,width:60,color:"#ff8c00",fontWeight:700}} value={custEditForm.offer} onChange={ev=>setCustEditForm(f=>({...f,offer:ev.target.value}))} placeholder="offer"/></td>
                              <td style={{padding:"3px 4px",position:"relative"}}><input style={{...custIS,width:55,color:custEditForm.offerBank?cfBkCol(custEditForm.offerBank):"#888",fontSize:9,fontWeight:700,letterSpacing:".06em"}} value={custEditForm.offerBank} onChange={ev=>{const v=ev.target.value.toUpperCase();setCustActiveField("editOfferBank");setCustEditForm(f=>({...f,offerBank:v}));setCustSuggest(v.length>=1?BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6):[]);}} onBlur={()=>setTimeout(()=>setCustSuggest([]),150)} placeholder="BANK" autoComplete="off"/>
                                {custSuggest.length>0&&custActiveField==="editOfferBank"&&<div className="suggest">{custSuggest.map(b=>(<div key={b} className="sug-item" style={{color:cfBkCol(b)}} onMouseDown={()=>{setCustEditForm(f=>({...f,offerBank:b}));setCustSuggest([]);}}>{b}</div>))}</div>}
                              </td>
                              <td style={{padding:"3px 4px"}}>
                                <button style={{...custIS,padding:"2px 6px",cursor:"pointer",color:"#40c080",borderColor:"#1a5030",marginRight:3}} onClick={()=>{
                                  const bid2 = custEditForm.bid ? parseFloat(custEditForm.bid) : e.bid;
                                  const offer2 = custEditForm.offer ? parseFloat(custEditForm.offer) : e.offer;
                                  const bidBank2 = custEditForm.bidBank || e.bidBank;
                                  const offerBank2 = custEditForm.offerBank || e.offerBank;
                                  const atm2 = custEditForm.atm || e.atm;
                                  const delta2x = custEditForm.delta || e.delta;
                                  const now = new Date();
                                  const logEntry = {lid:Date.now()+1, label:e.label, type:e.type, tenor:e.tenor, strike:e.strike, atm:atm2, delta:delta2x, bid:bid2, offer:offer2, bidBank:bidBank2, offerBank:offerBank2, ts:now};
                                  setCustomEntries(prev=>prev.map(x=>x.id===e.id?{...x,bid:bid2,offer:offer2,bidBank:bidBank2,offerBank:offerBank2,atm:atm2,delta:delta2x,ts:now}:x));
                                  setCustomLog(prev=>[logEntry,...prev].slice(0,500));
                                  setCustEditId(null);
                                }}>✓</button>
                                <span style={{color:"#4a2020",cursor:"pointer",fontSize:10,marginRight:4}} onClick={()=>{setCustomEntries(prev=>prev.map(x=>x.id===e.id?{...x,bid:null,offer:null,bidBank:null,offerBank:null}:x));setCustEditId(null);}}>CLR</span>
                                <span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>setCustEditId(null)}>✕</span>
                              </td>
                            </>
                          : <>
                              <td style={{padding:"6px 8px",color:"#a070d0"}}>{e.atm?`${e.atm}%`:"—"}</td>
                              <td style={{padding:"6px 8px",color:"#4a8070",fontSize:9}}>{e.delta?`${e.delta}%`:"—"}</td>
                              <td style={{padding:"6px 8px"}}>{e.bid!=null?<span style={{color:"#00c040",fontWeight:700}}>{e.bid.toFixed(4)}</span>:"—"}</td>
                              <td style={{padding:"6px 8px"}}>{e.bidBank?<span style={{color:cfBkCol(e.bidBank),fontSize:9,fontWeight:700}}>{e.bidBank}</span>:"—"}</td>
                              <td style={{padding:"6px 8px"}}>{e.offer!=null?<span style={{color:"#ff8c00",fontWeight:700}}>{e.offer.toFixed(4)}</span>:"—"}</td>
                              <td style={{padding:"6px 8px"}}>{e.offerBank?<span style={{color:cfBkCol(e.offerBank),fontSize:9,fontWeight:700}}>{e.offerBank}</span>:"—"}</td>
                              <td style={{padding:"6px 8px",color:"#243c54",fontSize:8,whiteSpace:"nowrap"}}>
                                {(e.ts instanceof Date?e.ts:new Date(e.ts)).toLocaleTimeString("en-GB",{hour12:false})}
                                <span style={{marginLeft:6,color:"#4070a0",cursor:"pointer",fontSize:9}} onClick={()=>{setCustEditId(e.id);setCustEditForm({bid:e.bid!=null?String(e.bid):"",offer:e.offer!=null?String(e.offer):"",bidBank:e.bidBank||"",offerBank:e.offerBank||"",atm:e.atm||"",delta:e.delta||""});}}>✎</span>
                                <span style={{marginLeft:4,color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>custRemove(e.id)}>✕</span>
                              </td>
                            </>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </div>
          </div>
          {/* RIGHT: history */}
          <div style={{width:240,flexShrink:0,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"6px 10px",borderBottom:"1px solid #1e3450",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>HISTORY</span>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                {customLog.length>0&&<button className="btn" style={{fontSize:7,padding:"2px 5px",color:"#40c080",borderColor:"#1a5030"}} onClick={()=>customLog.forEach(l=>custLoadFromLog(l))}>↺ ALL</button>}
                {customLog.length>0&&<button className="btn" style={{fontSize:7,padding:"2px 5px"}} onClick={()=>setCustomLog([])}>CLEAR</button>}
                <span style={{color:"#243c54",fontSize:9}}>{customLog.length}</span>
              </div>
            </div>
            <div style={{padding:"4px 10px",borderBottom:"1px solid #1e3450",flexShrink:0}}>
              <select value={custHistSort} onChange={e=>setCustHistSort(e.target.value)} style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",width:"100%"}}>
                <option value="desc">Newest first</option><option value="asc">Oldest first</option>
              </select>
            </div>
            <div style={{flex:1,overflow:"auto"}}>
              {custSortedLog.length===0
                ?<div style={{padding:"24px 10px",color:"#1e3048",fontSize:9,textAlign:"center"}}>No history yet</div>
                :custSortedLog.map(l=>(
                  <div key={l.lid} className="lr" style={{padding:"6px 10px",borderBottom:"1px solid #1a2e44"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                      <div><span style={{color:custTypeCol(l.type),fontWeight:700,fontSize:9}}>{l.type}</span>{l.tenor&&<span style={{color:"#5aaae8",fontWeight:700,fontSize:10,marginLeft:5}}>{l.tenor}</span>}{l.strike&&<span style={{color:"#4a7898",fontSize:8,marginLeft:4}}>{l.strike}%</span>}{l.atm&&<span style={{color:"#a070d0",fontSize:8,marginLeft:4}}>ATM {l.atm}%</span>}{l.delta&&<span style={{color:"#4a8070",fontSize:8,marginLeft:4}}>Δ{l.delta}%</span>}</div>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <span style={{color:"#1e3048",fontSize:7}}>{(l.ts instanceof Date?l.ts:new Date(l.ts)).toLocaleTimeString("en-GB",{hour12:false})}</span>
                        <span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>setCustomLog(p=>p.filter(x=>x.lid!==l.lid))}>✕</span>
                      </div>
                    </div>
                    {l.label&&<div style={{color:"#4a6880",fontSize:8,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.label}</div>}
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      {l.bid!=null&&<><span style={{color:"#007a28",fontSize:7}}>B</span><span style={{color:"#00c040",fontWeight:700,fontSize:11}}>{l.bid.toFixed(4)}</span>{l.bidBank&&<span style={{color:cfBkCol(l.bidBank),fontSize:8,marginLeft:2}}>{l.bidBank}</span>}</>}
                      {l.bid!=null&&l.offer!=null&&<span style={{color:"#243c54",fontSize:9}}>/</span>}
                      {l.offer!=null&&<><span style={{color:"#994400",fontSize:7}}>O</span><span style={{color:"#ff8c00",fontWeight:700,fontSize:11}}>{l.offer.toFixed(4)}</span>{l.offerBank&&<span style={{color:cfBkCol(l.offerBank),fontSize:8,marginLeft:2}}>{l.offerBank}</span>}</>}
                    </div>
                    <button onClick={()=>custLoadFromLog(l)} style={{background:"rgba(20,60,30,.5)",border:"1px solid rgba(40,140,80,.4)",color:"#40c080",fontSize:7,borderRadius:2,padding:"1px 5px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".06em"}}>↺ LOAD</button>
                  </div>
                ))
              }
            </div>
            <div style={{padding:"5px 10px",borderTop:"1px solid #1e3450",fontSize:8,color:"#1e3048",letterSpacing:".07em",flexShrink:0}}>CUSTOM · INDICATIVE ONLY</div>
          </div>
        </div>
      </div>}

      {/* ── EXOTIC (persistent) ── */}
      {subMenu==="exotic" && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
        <ExoticPanel ccy={ccy} cfBkCol={cfBkCol}
          entries={exoticEntries} setEntries={setExoticEntries}
          log={exoticLog} setLog={setExoticLog}
          copiedLive={copiedExLive} setCopiedLive={setCopiedExLive}
          copiedEOD={copiedExEOD} setCopiedEOD={setCopiedExEOD}
          cfCopyClip={cfCopyClip}/>
      </div>}

      {/* ── ATM ── */}
      <div style={{display:subMenu==="atm"?"flex":"none",flex:1,flexDirection:"column",overflow:"hidden",minHeight:0}}>
          {/* toolbar */}
          <div style={{background:"#080c14",borderBottom:"1px solid #1a2e44",padding:"5px 14px",display:"flex",alignItems:"center",flexShrink:0}}>
            <span style={{color:"#3a6080",fontSize:9,letterSpacing:".1em"}}>ATM · {ccy}</span>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              <button onClick={cfExportLive} style={{background:copiedCfLive?"rgba(20,120,60,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedCfLive?"rgba(40,200,100,.5)":"#2e4e78"}`,color:copiedCfLive?"#40e890":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>{copiedCfLive?"COPIED ✓":"LIVE"}</button>
              <button onClick={cfExportEOD}  style={{background:copiedCfEOD?"rgba(120,80,20,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedCfEOD?"rgba(200,150,40,.5)":"#2e4e78"}`,color:copiedCfEOD?"#e0b040":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>{copiedCfEOD?"COPIED ✓":"EOD"}</button>
            </div>
          </div>
          {/* body row: [content | log panel] */}
          <div style={{flex:1,display:"flex",flexDirection:"row",overflow:"hidden",minHeight:0}}>
            {/* left: scrollable content */}
            <div style={{flex:1,overflow:"auto",padding:"10px 14px",display:"flex",flexDirection:"column",gap:12,minWidth:0}}>
              {/* entry panel inline — floats at top when a cell is active */}
              {activeCell && (
                <div style={{flexShrink:0}}>
                  <CfEntryPanel label={entryLabel()} onCommit={f=>addQuotes(activeCell.key,activeCell.tenor,activeCell.type,f,activeCell.strike||null)} onClose={()=>setActiveCell(null)}/>
                </div>
              )}
              {/* tables side by side */}
              <div style={{display:"flex",flexDirection:"row",gap:20,alignItems:"flex-start",flex:1,minWidth:0}}>
                {/* SPOT CAPS & FLOORS */}
                <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
                  <div style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".12em",marginBottom:6}}>ATM CAPS & FLOORS · {ccy}</div>
                  <table style={{borderCollapse:"collapse",fontSize:10,tableLayout:"fixed",width:"100%"}}>
                    <thead>
                      <tr>
                        <th style={{color:"#3a6080",fontSize:8,fontWeight:700,padding:"4px 6px",borderBottom:"1px solid #1a2e44",textAlign:"left",width:28}}>YR</th>
                        <th style={{color:"#ff8c00",fontSize:8,fontWeight:700,padding:"4px 6px",borderBottom:"1px solid #1a2e44",textAlign:"center",width:90,letterSpacing:".1em"}}>CAP</th>
                        <th style={{color:"#00c040",fontSize:8,fontWeight:700,padding:"4px 6px",borderBottom:"1px solid #1a2e44",textAlign:"center",width:90,letterSpacing:".1em"}}>FLR</th>
                        <th style={{color:"#a070d0",fontSize:8,fontWeight:700,padding:"4px 6px",borderBottom:"1px solid #1a2e44",textAlign:"center",width:130,letterSpacing:".1em"}}>STRADDLE</th>
                        <th style={{color:"#3a6080",fontSize:8,fontWeight:700,padding:"4px 2px",borderBottom:"1px solid #1a2e44",textAlign:"center",width:32,letterSpacing:".06em"}}>ATM K</th>
                        <th style={{color:"#3a6080",fontSize:8,fontWeight:700,padding:"4px 2px",borderBottom:"1px solid #1a2e44",textAlign:"center",width:30,letterSpacing:".06em"}}>VOL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CF_TENORS.map(t=>{
                        const sk=`${ccy}_${t}`;
                        return (
                          <tr key={t} style={{borderBottom:"1px solid #0e1c2e"}}>
                            <td style={{color:"#5a88b0",fontWeight:700,fontSize:11,padding:"4px 6px",textAlign:"right",verticalAlign:"middle"}}>{t}</td>
                            {CF_TYPES.map(tp=>{
                              const key=cfqKey(ccy,t,tp);
                              const cell=cfQuotes[key]||{bids:[],offers:[]};
                              const aB=cell.bids.filter(q=>!cfRef[key]?.has(`b|${q.id}`))[0];
                              const aO=cell.offers.filter(q=>!cfRef[key]?.has(`o|${q.id}`))[0];
                              if(tp==="STRADDLE") {
                                const dq=AUD_DUMMY_QUOTES[`${ccy}_${t}_STRADDLE`];
                                const rm=dq?((dq.bids[0].price+dq.offers[0].price)/2).toFixed(1):null;
                                return (
                                  <td key={tp} style={{padding:"2px 3px",verticalAlign:"middle"}}>
                                    <CfCell quotes={cfQuotes[key]} referred={cfRef[key]} active={activeCell?.key===key}
                                      refMid={rm}
                                      onRefer={(side,id)=>toggleRef(key,side,id)} onDel={(side,id)=>delQ(key,side,id)}
                                      prevQuotes={prevSession[key]}
                                      onClick={()=>setActiveCell(activeCell?.key===key?null:{key,tenor:t,type:tp,isFwd:false})}/>
                                  </td>
                                );
                              }
                              return (
                                <td key={tp} style={{padding:"2px 3px",verticalAlign:"middle"}}>
                                  <CfCell quotes={cfQuotes[key]} referred={cfRef[key]} active={activeCell?.key===key}
                                    onRefer={(side,id)=>toggleRef(key,side,id)} onDel={(side,id)=>delQ(key,side,id)}
                                    prevQuotes={prevSession[key]}
                                    onClick={()=>setActiveCell(activeCell?.key===key?null:{key,tenor:t,type:tp,isFwd:false})}/>
                                </td>
                              );
                            })}
                            <td style={{padding:"2px 3px",verticalAlign:"middle",textAlign:"center"}}>
                              <input value={cfStrike[sk]||''} onChange={e=>setCfStrike(p=>({...p,[sk]:e.target.value}))}
                                placeholder="4.050%" style={{background:"#060a10",border:"1px solid #1a2e44",color:"#6090b0",fontSize:9,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",width:28,outline:"none",textAlign:"center"}}/>
                            </td>
                            <td style={{padding:"2px 3px",verticalAlign:"middle",textAlign:"center"}}>
                              <input value={cfVol[sk]||''} onChange={e=>setCfVol(p=>({...p,[sk]:e.target.value}))}
                                placeholder="93.5" style={{background:"#060a10",border:"1px solid #1a2e44",color:"#a0c0e0",fontSize:9,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",width:26,outline:"none",textAlign:"center"}}/>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* FWD CFS SPOT PREMIUM */}
                <div style={{flexShrink:0}}>
                  <div style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".12em",marginBottom:6}}>FWD CFS SPOT PREMIUM · {ccy}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"nowrap",alignItems:"flex-start"}}>
                    {FWD_COLS.map((col,ci)=>(
                      <div key={ci} style={{flexShrink:0}}>
                        {col.map(({s,e})=>{
                          const key=fwdqKey(ccy,s,e); const isAct=activeCell?.key===key;
                          const legged = wedgeLookup[`${s}x${e}`];
                          return (
                            <div key={key} style={{marginBottom:4}}>
                              <div style={{color:"#3a6888",fontSize:8,fontWeight:700,marginBottom:2,letterSpacing:".06em"}}>{s}X{e}</div>
                              <FwdCfsCell
                                quotes={cfQuotes[key]} referred={cfRef[key]} active={isAct}
                                onRefer={(side,id)=>toggleRef(key,side,id)} onDel={(side,id)=>delQ(key,side,id)}
                                prevQuotes={prevSession[key]}
                                onClick={()=>setActiveCell(isAct?null:{key,tenor:`${s}x${e}`,type:"FWD",isFwd:true})}
                                legged={legged} cfBkCol={cfBkCol}/>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* right: history log */}
            <CfLogPanel cfLog={cfLog} setCfLog={setCfLog} displayCfLog={displayCfLog} cfBankCounts={cfBankCounts} cfFiltBank={cfFiltBank} setCfFiltBank={setCfFiltBank} cfFiltTen={cfFiltTen} setCfFiltTen={setCfFiltTen} cfFiltMins={cfFiltMins} setCfFiltMins={setCfFiltMins} cfFiltStrike={cfFiltStrike} setCfFiltStrike={setCfFiltStrike} cfSort={cfSort} setCfSort={setCfSort} cfBkCol={cfBkCol} allStrikes={visStrikes} subMenu={subMenu} cfReloadQuote={cfReloadQuote} cfReloadAllLog={cfReloadAllLog}/>
          </div>
        </div>
      

      {/* ── OTM ── */}
      <div style={{display:subMenu==="otm"?"flex":"none",flex:1,flexDirection:"column",overflow:"hidden",minHeight:0}}>
          {/* OTM sub-nav + strike toggle bar */}
          <div style={{background:"#080c14",borderBottom:"1px solid #1a2e44",padding:"5px 14px",display:"flex",gap:6,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
            {[["spot","OTM Spot Cap & Floor Matrix"],["fwd","OTM FWD Cap & Floor Matrix"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setOtmView(id)}
                style={{background:otmView===id?"rgba(20,60,150,.4)":"transparent",
                  border:`1px solid ${otmView===id?"rgba(50,110,220,.5)":"#1a2e44"}`,
                  color:otmView===id?"#80b8f0":"#305070",
                  padding:"4px 10px",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700,
                  letterSpacing:".08em",fontFamily:"inherit"}}>
                {lbl}
              </button>
            ))}
            <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
              <button onClick={cfExportLive}
                style={{background:copiedCfLive?"rgba(20,120,60,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedCfLive?"rgba(40,200,100,.5)":"#2e4e78"}`,color:copiedCfLive?"#40e890":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>
                {copiedCfLive?"COPIED ✓":"LIVE"}
              </button>
              <button onClick={cfExportEOD}
                style={{background:copiedCfEOD?"rgba(120,80,20,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedCfEOD?"rgba(200,150,40,.5)":"#2e4e78"}`,color:copiedCfEOD?"#e0b040":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>
                {copiedCfEOD?"COPIED ✓":"EOD"}
              </button>
            </div>
          </div>

          {/* Matrix + log */}
          <div style={{flex:1,display:"flex",minWidth:0,minHeight:0}}>
            <div style={{flex:1,minWidth:0,minHeight:0,display:"flex",flexDirection:"column",padding:"10px 10px 0 14px"}}>
              {otmView==="spot" && (
                <OtmMatrix
                  title={`OTM SPOT CAPS & FLOORS · ${ccy}`}
                  rowKey={t=>t} rows={CF_TENORS} rowLabel={t=>`${t}y`}
                  ccy={ccy} cfQuotes={cfQuotes} cfRef={cfRef}
                  activeCell={activeCell} setActiveCell={setActiveCell}
                  toggleRef={toggleRef} delQ={delQ}
                  visStrikes={visStrikes} cfStrike={cfStrike} showAtmK={true}
                  prevSession={prevSession}/>
              )}
              {otmView==="fwd" && (
                <OtmMatrix
                  title={`OTM FWD CAPS & FLOORS · ${ccy}`}
                  rowKey={({s,e})=>`${s}x${e}`} rows={ALL_FWDS} rowLabel={({s,e})=>`${s}x${e}`}
                  ccy={ccy} cfQuotes={cfQuotes} cfRef={cfRef}
                  activeCell={activeCell} setActiveCell={setActiveCell}
                  toggleRef={toggleRef} delQ={delQ}
                  visStrikes={visStrikes} cfStrike={cfStrike} showAtmK={false}
                  prevSession={prevSession}/>
              )}
              {activeCell?.isOtm && (
                <div style={{flexShrink:0,paddingBottom:10,paddingTop:4}}>
                  <CfEntryPanel label={entryLabel()} onCommit={f=>addQuotes(activeCell.key,activeCell.tenor,activeCell.type,f,activeCell.strike||null)} onClose={()=>setActiveCell(null)}/>
                </div>
              )}
            </div>
            <CfLogPanel cfLog={cfLog} setCfLog={setCfLog} displayCfLog={displayCfLog} cfBankCounts={cfBankCounts} cfFiltBank={cfFiltBank} setCfFiltBank={setCfFiltBank} cfFiltTen={cfFiltTen} setCfFiltTen={setCfFiltTen} cfFiltMins={cfFiltMins} setCfFiltMins={setCfFiltMins} cfFiltStrike={cfFiltStrike} setCfFiltStrike={setCfFiltStrike} cfSort={cfSort} setCfSort={setCfSort} cfBkCol={cfBkCol} allStrikes={visStrikes} subMenu={subMenu} cfReloadQuote={cfReloadQuote} cfReloadAllLog={cfReloadAllLog}/>
            <CfOtmStrikePanel cfQuotes={cfQuotes} cfRef={cfRef} ccy={ccy} visStrikes={visStrikes} otmView={otmView} setOtmView={setOtmView} subMenu={subMenu}/>
          </div>
        </div>
      
    </div>
  );
}

// ── Exotic Caps & Floors ─────────────────────────────────────────
const EXOTIC_TYPES = [
  "DIGITAL CAP","DIGITAL FLOOR","BARRIER CAP","BARRIER FLOOR",
  "KNOCK-IN CAP","KNOCK-IN FLOOR","KNOCK-OUT CAP","KNOCK-OUT FLOOR",
  "RANGE ACCRUAL","RATCHET CAP","RATCHET FLOOR","CORRIDOR",
  "AUTOCAP","ACCUMULATOR"
];
function ExoticPanel({ ccy, cfBkCol, entries, setEntries, log, setLog, copiedLive, setCopiedLive, copiedEOD, setCopiedEOD, cfCopyClip }) {
  const iS={background:"#060a10",border:"1px solid #2a4870",color:"#b0bcc8",fontSize:10,borderRadius:3,padding:"3px 6px",fontFamily:"inherit",outline:"none",marginBottom:3,width:"100%"};
  const [form, setForm] = React.useState({label:"",type:"DIGITAL CAP",tenor:"",strike:"",barrier:"",atm:"",delta:"",bid:"",offer:"",bidBank:"",offerBank:""});
  const [suggest, setSuggest] = React.useState([]);
  const [activeField, setActiveField] = React.useState(null);
  const [histSort, setHistSort] = React.useState("desc");
  const typeCol = (t) => { if(t&&t.includes("CAP")) return "#ff8c00"; if(t&&t.includes("FLOOR")) return "#00c040"; if(t&&(t.includes("RANGE")||t.includes("ACCRUAL")||t.includes("CORRIDOR"))) return "#a070d0"; if(t&&t.includes("RATCHET")) return "#40c0d0"; return "#80b8d8"; };
  const bankInput=(field,val)=>{ const v=val.toUpperCase(); setActiveField(field); setForm(f=>({...f,[field]:v})); setSuggest(v.length>=1?BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6):[]); };
  const add = (overrides) => {
    const s = overrides||form;
    if(!s.bid&&!s.offer&&!s.label&&!s.tenor) return;
    const entry = {id:Date.now(),...s,bid:s.bid?parseFloat(s.bid):null,offer:s.offer?parseFloat(s.offer):null,ts:new Date()};
    setEntries(prev=>[entry,...prev]);
    setLog(prev=>[{lid:Date.now()+1,...s,bid:s.bid?parseFloat(s.bid):null,offer:s.offer?parseFloat(s.offer):null,ts:new Date()},...prev].slice(0,500));
    if(!overrides) setForm({label:"",type:"DIGITAL CAP",tenor:"",strike:"",barrier:"",atm:"",delta:"",bid:"",offer:"",bidBank:"",offerBank:""});
    setSuggest([]);
  };
  const remove = (id) => setEntries(prev=>prev.filter(e=>e.id!==id));
  const loadFromLog = (l) => add({label:l.label,type:l.type,tenor:l.tenor,strike:l.strike,barrier:l.barrier,bid:l.bid!=null?String(l.bid):"",offer:l.offer!=null?String(l.offer):"",bidBank:l.bidBank||"",offerBank:l.offerBank||""});
  const sortedLog = [...log].sort((a,b)=>{ const ta=a.ts instanceof Date?a.ts:new Date(a.ts); const tb=b.ts instanceof Date?b.ts:new Date(b.ts); return histSort==="asc"?ta-tb:tb-ta; });
  const exportLive = () => { if(!entries.length) return; const lines=[`${ccy} EXOTIC CAPS & FLOORS`]; entries.forEach(e=>{ const b=e.bid!=null?e.bid.toFixed(4):""; const o=e.offer!=null?e.offer.toFixed(4):""; lines.push(`${e.type} ${e.tenor||""}`+(e.strike?` K=${e.strike}%`:"")+(e.barrier?` B=${e.barrier}%`:"")+(e.atm?` ATM ${e.atm}%`:"")+(e.delta?` Δ=${e.delta}%`:"").padEnd(32)+`${b}/${o}`); }); cfCopyClip(lines.join("\n"), setCopiedLive); };
  const exportEOD = () => { if(!entries.length) return; const lines=[`${ccy} EXOTIC CAPS & FLOORS - EOD`]; entries.forEach(e=>{ const b=e.bid!=null?e.bid.toFixed(4):""; const o=e.offer!=null?e.offer.toFixed(4):""; if(e.label) lines.push(`  ${e.label}`); lines.push(`${e.type} ${e.tenor||""}`+(e.strike?` K=${e.strike}%`:"")+(e.barrier?` B=${e.barrier}%`:"")+(e.atm?` ATM ${e.atm}%`:"")+(e.delta?` Δ=${e.delta}%`:"").padEnd(32)+`${b}/${o}`); }); cfCopyClip(lines.join("\n"), setCopiedEOD); };
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
      <div style={{background:"#080c14",borderBottom:"1px solid #1a2e44",padding:"5px 14px",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
        <span style={{color:"#3a6080",fontSize:9,letterSpacing:".1em"}}>EXOTIC CAPS & FLOORS · {ccy}</span>
        <span style={{color:"#1e3048",fontSize:8,marginLeft:4,letterSpacing:".06em"}}>DIGITAL · BARRIER · KNOCK-IN/OUT · RANGE ACCRUAL · RATCHET · CORRIDOR</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          {entries.length>0&&<span style={{color:"#243c54",fontSize:9}}>{entries.length} active</span>}
          <button onClick={exportLive} style={{background:copiedLive?"rgba(20,120,60,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedLive?"rgba(40,200,100,.5)":"#2e4e78"}`,color:copiedLive?"#40e890":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>{copiedLive?"COPIED \u2713":"LIVE"}</button>
          <button onClick={exportEOD}  style={{background:copiedEOD?"rgba(120,80,20,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedEOD?"rgba(200,150,40,.5)":"#2e4e78"}`,color:copiedEOD?"#e0b040":"#5a96c8",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>{copiedEOD?"COPIED \u2713":"EOD"}</button>
          {log.length>0&&<button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={()=>{setEntries([]);setLog([])}}>CLEAR ALL</button>}
        </div>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>
        <div style={{width:290,flexShrink:0,padding:"14px 12px",borderRight:"1px solid #1a2e44",display:"flex",flexDirection:"column",gap:6,overflowY:"auto",background:"#040810"}}>
          <div style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".12em",marginBottom:2}}>NEW ENTRY</div>
          <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>LABEL / DESCRIPTION</div><input style={iS} value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} placeholder="e.g. 5Y Digital Cap 4.50%"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>TYPE</div><select style={{...iS,marginBottom:0,color:typeCol(form.type),fontWeight:700}} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{EXOTIC_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>TENOR</div><input style={iS} value={form.tenor} onChange={e=>setForm(f=>({...f,tenor:e.target.value}))} placeholder="e.g. 5Y, 2x7"/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>STRIKE %</div><input style={iS} value={form.strike} onChange={e=>setForm(f=>({...f,strike:e.target.value}))} placeholder="e.g. 4.500"/></div>
            <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>BARRIER %</div><input style={{...iS,color:"#d0a040"}} value={form.barrier} onChange={e=>setForm(f=>({...f,barrier:e.target.value}))} placeholder="e.g. 5.500"/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>ATM REF %</div><input style={{...iS,color:"#a070d0"}} value={form.atm} onChange={e=>setForm(f=>({...f,atm:e.target.value}))} placeholder="e.g. 4.006"/></div>
            <div><div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>Δ DELTA %</div><input style={{...iS,color:"#4a8070"}} value={form.delta} onChange={e=>setForm(f=>({...f,delta:e.target.value}))} placeholder="e.g. 35"/></div>
          </div>
          {[{side:"BID",pCol:"#00c040",lCol:"#007a28",fk:"bid",bk:"bidBank"},{side:"OFFER",pCol:"#ff8c00",lCol:"#994400",fk:"offer",bk:"offerBank"}].map(({side,pCol,lCol,fk,bk})=>(
            <div key={side} style={{borderLeft:`3px solid ${pCol}`,paddingLeft:8}}>
              <div style={{color:lCol,fontSize:8,marginBottom:3,letterSpacing:".1em"}}>{side}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                <input style={{...iS,marginBottom:0,color:pCol,fontWeight:700}} value={form[fk]} onChange={e=>setForm(f=>({...f,[fk]:e.target.value}))} placeholder="price (bp)" onKeyDown={e=>e.key==="Enter"&&add()}/>
                <div style={{position:"relative"}}><input style={{...iS,marginBottom:0,color:form[bk]?cfBkCol(form[bk]):"#b0bcc8",fontWeight:700,letterSpacing:".06em"}} value={form[bk]} onChange={e=>bankInput(bk,e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="BANK" autoComplete="off"/>{suggest.length>0&&activeField===bk&&(<div className="suggest">{suggest.map(b=>(<div key={b} className="sug-item" style={{color:cfBkCol(b)}} onMouseDown={()=>{setForm(v=>({...v,[bk]:b}));setSuggest([]);}}>{b}</div>))}</div>)}</div>
              </div>
            </div>
          ))}
          <button onClick={()=>add()} className="btn" style={{width:"100%",fontSize:9,padding:"5px 0",letterSpacing:".12em",marginTop:4,color:"#40a060",borderColor:"#1a4030"}}>+ ADD QUOTE</button>
        </div>
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          <div style={{padding:"6px 12px",borderBottom:"1px solid #1a2e44",flexShrink:0,background:"#060a12",display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>ACTIVE QUOTES</span>
            <span style={{color:"#243c54",fontSize:8,marginLeft:4}}>{entries.length} entries</span>
            {entries.length>0&&<button className="btn" style={{marginLeft:"auto",fontSize:8,padding:"2px 5px"}} onClick={()=>setEntries([])}>CLEAR ACTIVE</button>}
          </div>
          <div style={{flex:1,overflow:"auto",padding:"0 0 10px 0"}}>
            {entries.length===0
              ?<div style={{padding:"60px 0",color:"#1e3048",fontSize:10,textAlign:"center"}}>No active exotic quotes<br/><span style={{fontSize:8,color:"#1a2a38"}}>Use the form on the left to add, or \u21ba LOAD from history →</span></div>
              :<table style={{borderCollapse:"collapse",width:"100%",fontSize:10}}>
                <thead style={{position:"sticky",top:0,background:"#060a12",zIndex:1}}>
                  <tr>{["LABEL","TYPE","TENOR","STRIKE","BARRIER","ATM REF","\u0394%","BID","NAME","OFFER","NAME","TIME"].map(h=>(<th key={h} style={{color:"#3a6080",fontSize:8,fontWeight:700,padding:"6px 8px",borderBottom:"1px solid #1a2e44",textAlign:"left",letterSpacing:".08em",whiteSpace:"nowrap"}}>{h}</th>))}</tr>
                </thead>
                <tbody>
                  {entries.map(e=>(
                    <tr key={e.id} className="lr" style={{borderBottom:"1px solid #0e1c2e"}}>
                      <td style={{padding:"6px 8px",color:"#80b8d8",fontWeight:700,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.label||"\u2014"}</td>
                      <td style={{padding:"6px 8px",color:typeCol(e.type),fontWeight:700,fontSize:9,whiteSpace:"nowrap"}}>{e.type}</td>
                      <td style={{padding:"6px 8px",color:"#5aaae8",fontWeight:700}}>{e.tenor||"\u2014"}</td>
                      <td style={{padding:"6px 8px",color:"#4a7898"}}>{e.strike?`${e.strike}%`:"\u2014"}</td>
                      <td style={{padding:"6px 8px",color:"#d0a040"}}>{e.barrier?`${e.barrier}%`:"\u2014"}</td>
                      <td style={{padding:"6px 8px",color:"#a070d0"}}>{e.atm?`${e.atm}%`:"\u2014"}</td>
                      <td style={{padding:"6px 8px",color:"#4a8070",fontSize:9}}>{e.delta?`${e.delta}%`:"\u2014"}</td>
                      <td style={{padding:"6px 8px"}}>{e.bid!=null?<span style={{color:"#00c040",fontWeight:700}}>{e.bid.toFixed(4)}</span>:"\u2014"}</td>
                      <td style={{padding:"6px 8px"}}>{e.bidBank?<span style={{color:cfBkCol(e.bidBank),fontSize:9,fontWeight:700}}>{e.bidBank}</span>:"\u2014"}</td>
                      <td style={{padding:"6px 8px"}}>{e.offer!=null?<span style={{color:"#ff8c00",fontWeight:700}}>{e.offer.toFixed(4)}</span>:"\u2014"}</td>
                      <td style={{padding:"6px 8px"}}>{e.offerBank?<span style={{color:cfBkCol(e.offerBank),fontSize:9,fontWeight:700}}>{e.offerBank}</span>:"\u2014"}</td>
                      <td style={{padding:"6px 8px",color:"#243c54",fontSize:8,whiteSpace:"nowrap"}}>
                        {(e.ts instanceof Date?e.ts:new Date(e.ts)).toLocaleTimeString("en-GB",{hour12:false})}
                        <span style={{marginLeft:6,cursor:"pointer",fontSize:10,color:"#4a2020"}} onClick={()=>remove(e.id)}>\u2715</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>
        <div style={{width:240,flexShrink:0,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"6px 10px",borderBottom:"1px solid #1e3450",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>HISTORY</span>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {log.length>0&&<button className="btn" style={{fontSize:7,padding:"2px 5px",color:"#40c080",borderColor:"#1a5030"}} onClick={()=>log.forEach(l=>loadFromLog(l))}>\u21ba ALL</button>}
              {log.length>0&&<button className="btn" style={{fontSize:7,padding:"2px 5px"}} onClick={()=>setLog([])}>CLEAR</button>}
              <span style={{color:"#243c54",fontSize:9}}>{log.length}</span>
            </div>
          </div>
          <div style={{padding:"4px 10px",borderBottom:"1px solid #1e3450",flexShrink:0}}>
            <select value={histSort} onChange={e=>setHistSort(e.target.value)} style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",width:"100%"}}><option value="desc">Newest first</option><option value="asc">Oldest first</option></select>
          </div>
          <div style={{flex:1,overflow:"auto"}}>
            {sortedLog.length===0
              ?<div style={{padding:"24px 10px",color:"#1e3048",fontSize:9,textAlign:"center"}}>No history yet</div>
              :sortedLog.map(l=>(
                <div key={l.lid} className="lr" style={{padding:"6px 10px",borderBottom:"1px solid #1a2e44"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                    <div><span style={{color:typeCol(l.type),fontWeight:700,fontSize:9}}>{l.type}</span>{l.tenor&&<span style={{color:"#5aaae8",fontWeight:700,fontSize:10,marginLeft:5}}>{l.tenor}</span>}{l.strike&&<span style={{color:"#4a7898",fontSize:8,marginLeft:4}}>{l.strike}%</span>}{l.barrier&&<span style={{color:"#d0a040",fontSize:8,marginLeft:4}}>B:{l.barrier}%</span>}</div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <span style={{color:"#1e3048",fontSize:7}}>{(l.ts instanceof Date?l.ts:new Date(l.ts)).toLocaleTimeString("en-GB",{hour12:false})}</span>
                      <span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>setLog(p=>p.filter(x=>x.lid!==l.lid))}>\u2715</span>
                    </div>
                  </div>
                  {l.label&&<div style={{color:"#4a6880",fontSize:8,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.label}</div>}
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    {l.bid!=null&&<><span style={{color:"#007a28",fontSize:7}}>B</span><span style={{color:"#00c040",fontWeight:700,fontSize:11}}>{l.bid.toFixed(4)}</span>{l.bidBank&&<span style={{color:cfBkCol(l.bidBank),fontSize:8,marginLeft:2}}>{l.bidBank}</span>}</>}
                    {l.bid!=null&&l.offer!=null&&<span style={{color:"#243c54",fontSize:9}}>/</span>}
                    {l.offer!=null&&<><span style={{color:"#994400",fontSize:7}}>O</span><span style={{color:"#ff8c00",fontWeight:700,fontSize:11}}>{l.offer.toFixed(4)}</span>{l.offerBank&&<span style={{color:cfBkCol(l.offerBank),fontSize:8,marginLeft:2}}>{l.offerBank}</span>}</>}
                  </div>
                  <button onClick={()=>loadFromLog(l)} style={{background:"rgba(20,60,30,.5)",border:"1px solid rgba(40,140,80,.4)",color:"#40c080",fontSize:7,borderRadius:2,padding:"1px 5px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".06em"}}>\u21ba LOAD</button>
                </div>
              ))
            }
          </div>
          <div style={{padding:"5px 10px",borderTop:"1px solid #1e3450",fontSize:8,color:"#1e3048",letterSpacing:".07em",flexShrink:0}}>EXOTIC · INDICATIVE ONLY</div>
        </div>
      </div>
    </div>
  );
}


// ── Custom Caps & Floors ────────────────────────────────────
function CustomCapsFloors({ ccy, cfBkCol, entries, setEntries, log, setLog }) {
  const iS = {background:"#060a10",border:"1px solid #2a4870",color:"#b0bcc8",fontSize:10,borderRadius:3,padding:"3px 6px",fontFamily:"inherit",outline:"none",marginBottom:3,width:"100%"};
  const [form, setForm] = React.useState({label:"",type:"CAP",tenor:"",strike:"",bid:"",offer:"",bidBank:"",offerBank:""});
  const [suggest, setSuggest] = React.useState([]); const [activeField, setActiveField] = React.useState(null);
  const [histSort, setHistSort] = React.useState("desc");
  const bankInput=(field,val)=>{ const v=val.toUpperCase(); setActiveField(field); setForm(f=>({...f,[field]:v})); setSuggest(v.length>=1?BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6):[]); };

  const add = (overrides) => {
    const src2 = overrides||form;
    if(!src2.bid&&!src2.offer&&!src2.label&&!src2.tenor) return;
    const entry = {id:Date.now(),...src2,atm:src2.atm||null,delta:src2.delta||null,bid:src2.bid?parseFloat(src2.bid):null,offer:src2.offer?parseFloat(src2.offer):null,ts:new Date()};
    setEntries(prev=>[entry,...prev]);
    setLog(prev=>[{lid:Date.now()+1,...src2,bid:src2.bid?parseFloat(src2.bid):null,offer:src2.offer?parseFloat(src2.offer):null,ts:new Date()},...prev].slice(0,500));
    if(!overrides) setForm(f=>({...f,label:"",strike:"",bid:"",offer:"",bidBank:"",offerBank:""}));
    setSuggest([]);
  };
  const remove = (id) => setEntries(prev=>prev.filter(e=>e.id!==id));
  const loadFromLog = (l) => add({label:l.label,type:l.type,tenor:l.tenor,strike:l.strike,bid:l.bid!=null?String(l.bid):"",offer:l.offer!=null?String(l.offer):"",bidBank:l.bidBank||"",offerBank:l.offerBank||""});
  const typeCol = (t) => t==="CAP"?"#ff8c00":t==="FLOOR"?"#00c040":t==="COLLAR"?"#a070d0":t==="STRADDLE"?"#c080d0":"#80b8d8";
  const sortedLog = [...log].sort((a,b)=>{ const ta=a.ts instanceof Date?a.ts:new Date(a.ts); const tb=b.ts instanceof Date?b.ts:new Date(b.ts); return histSort==="asc"?ta-tb:tb-ta; });

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
      {/* toolbar */}
      <div style={{background:"#080c14",borderBottom:"1px solid #1a2e44",padding:"5px 14px",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
        <span style={{color:"#3a6080",fontSize:9,letterSpacing:".1em"}}>CUSTOM CAPS & FLOORS · {ccy}</span>
        <span style={{color:"#1e3048",fontSize:8,marginLeft:4}}>BESPOKE STRUCTURES</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          {entries.length>0&&<span style={{color:"#243c54",fontSize:9}}>{entries.length} active</span>}
          {log.length>0&&<button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={()=>{setEntries([]);setLog([])}}>CLEAR ALL</button>}
        </div>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {/* ── LEFT: entry form ── */}
        <div style={{width:280,flexShrink:0,padding:"14px 12px",borderRight:"1px solid #1a2e44",display:"flex",flexDirection:"column",gap:6,overflowY:"auto",background:"#040810"}}>
          <div style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".12em",marginBottom:2}}>NEW ENTRY</div>
          <div>
            <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>LABEL / DESCRIPTION</div>
            <input style={iS} value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} placeholder="e.g. 5Y Cap 4.50% notional 100m"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div>
              <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>TYPE</div>
              <select style={{...iS,marginBottom:0,color:typeCol(form.type),fontWeight:700}} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                <option>CAP</option><option>FLOOR</option><option>COLLAR</option><option>STRADDLE</option>
                <option>CORRIDOR</option><option>DIGITAL CAP</option><option>DIGITAL FLOOR</option>
                <option>BARRIER CAP</option><option>BARRIER FLOOR</option><option>RATCHET</option>
              </select>
            </div>
            <div>
              <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>TENOR</div>
              <input style={iS} value={form.tenor} onChange={e=>setForm(f=>({...f,tenor:e.target.value}))} placeholder="e.g. 5Y, 2x7"/>
            </div>
          </div>
          <div>
            <div style={{color:"#3a6080",fontSize:8,marginBottom:3,letterSpacing:".08em"}}>STRIKE %</div>
            <input style={iS} value={form.strike} onChange={e=>setForm(f=>({...f,strike:e.target.value}))} placeholder="e.g. 4.500 (or cap/floor pair: 5.00/3.50)"/>
          </div>
          {[{side:"BID",pCol:"#00c040",lCol:"#007a28",fk:"bid",bk:"bidBank"},{side:"OFFER",pCol:"#ff8c00",lCol:"#994400",fk:"offer",bk:"offerBank"}].map(({side,pCol,lCol,fk,bk})=>(
            <div key={side} style={{borderLeft:`3px solid ${pCol}`,paddingLeft:8}}>
              <div style={{color:lCol,fontSize:8,marginBottom:3,letterSpacing:".1em"}}>{side}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                <input style={{...iS,marginBottom:0,color:pCol,fontWeight:700}} value={form[fk]} onChange={e=>setForm(f=>({...f,[fk]:e.target.value}))} placeholder="price (bp)" onKeyDown={e=>e.key==="Enter"&&add()}/>
                <div style={{position:"relative"}}>
                  <input style={{...iS,marginBottom:0,color:form[bk]?cfBkCol(form[bk]):"#b0bcc8",fontWeight:700,letterSpacing:".06em"}} value={form[bk]} onChange={e=>bankInput(bk,e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="BANK" autoComplete="off"/>
                  {suggest.length>0&&activeField===bk&&(
                    <div className="suggest">{suggest.map(b=>(<div key={b} className="sug-item" style={{color:cfBkCol(b)}} onMouseDown={()=>{setForm(v=>({...v,[bk]:b}));setSuggest([]);}}>{b}</div>))}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button onClick={()=>add()} className="btn" style={{width:"100%",fontSize:9,padding:"5px 0",letterSpacing:".12em",marginTop:4,color:"#40a060",borderColor:"#1a4030"}}>+ ADD QUOTE</button>
        </div>

        {/* ── CENTRE: live entries table ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          <div style={{padding:"6px 12px",borderBottom:"1px solid #1a2e44",flexShrink:0,background:"#060a12",display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"#4a7898",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>ACTIVE QUOTES</span>
            <span style={{color:"#243c54",fontSize:8,marginLeft:4}}>{entries.length} entries</span>
            {entries.length>0&&<button className="btn" style={{marginLeft:"auto",fontSize:8,padding:"2px 5px"}} onClick={()=>setEntries([])}>CLEAR ACTIVE</button>}
          </div>
          <div style={{flex:1,overflow:"auto",padding:"0 0 10px 0"}}>
            {entries.length===0
              ?<div style={{padding:"60px 0",color:"#1e3048",fontSize:10,textAlign:"center"}}>No active custom quotes<br/><span style={{fontSize:8,color:"#1a2a38"}}>Use the form on the left to add quotes, or ↺ LOAD from history →</span></div>
              :<table style={{borderCollapse:"collapse",width:"100%",fontSize:10}}>
                <thead style={{position:"sticky",top:0,background:"#060a12",zIndex:1}}>
                  <tr>
                    {["LABEL","TYPE","TENOR","STRIKE","ATM REF","Δ%","BID","NAME","OFFER","NAME","TIME/✎"].map(h=>(
                      <th key={h} style={{color:"#3a6080",fontSize:8,fontWeight:700,padding:"6px 8px",borderBottom:"1px solid #1a2e44",textAlign:"left",letterSpacing:".08em",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map(e=>(
                    <tr key={e.id} className="lr" style={{borderBottom:"1px solid #0e1c2e"}}>
                      <td style={{padding:"6px 8px",color:"#80b8d8",fontWeight:700,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.label||"—"}</td>
                      <td style={{padding:"6px 8px",color:typeCol(e.type),fontWeight:700,fontSize:9,whiteSpace:"nowrap"}}>{e.type}</td>
                      <td style={{padding:"6px 8px",color:"#5aaae8",fontWeight:700}}>{e.tenor||"—"}</td>
                      <td style={{padding:"6px 8px",color:"#4a7898"}}>{e.strike?`${e.strike}%`:"—"}</td>
                      <td style={{padding:"6px 8px"}}>
                        {e.bid!=null&&<div>
                          <span style={{color:"#00c040",fontWeight:700}}>{e.bid.toFixed(4)}</span>
                          {e.bidBank&&<span style={{color:cfBkCol(e.bidBank),fontSize:8,marginLeft:4,fontWeight:700}}>{e.bidBank}</span>}
                        </div>}
                      </td>
                      <td style={{padding:"6px 8px"}}>
                        {e.offer!=null&&<div>
                          <span style={{color:"#ff8c00",fontWeight:700}}>{e.offer.toFixed(4)}</span>
                          {e.offerBank&&<span style={{color:cfBkCol(e.offerBank),fontSize:8,marginLeft:4,fontWeight:700}}>{e.offerBank}</span>}
                        </div>}
                      </td>
                      <td style={{padding:"6px 8px",color:"#243c54",fontSize:8,whiteSpace:"nowrap"}}>{(e.ts instanceof Date?e.ts:new Date(e.ts)).toLocaleTimeString("en-GB",{hour12:false})}</td>
                      <td style={{padding:"6px 8px"}}><span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>remove(e.id)}>✕</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>

        {/* ── RIGHT: history panel ── */}
        <div style={{width:240,flexShrink:0,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"6px 10px",borderBottom:"1px solid #1e3450",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>HISTORY</span>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {log.length>0&&<button className="btn" style={{fontSize:7,padding:"2px 5px",color:"#40c080",borderColor:"#1a5030"}} onClick={()=>log.forEach(l=>loadFromLog(l))} title="Reload all history onto active">↺ ALL</button>}
              {log.length>0&&<button className="btn" style={{fontSize:7,padding:"2px 5px"}} onClick={()=>setLog([])}>CLEAR</button>}
              <span style={{color:"#243c54",fontSize:9}}>{log.length}</span>
            </div>
          </div>
          <div style={{padding:"4px 10px",borderBottom:"1px solid #1e3450",flexShrink:0}}>
            <select value={histSort} onChange={e=>setHistSort(e.target.value)}
              style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",width:"100%"}}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
          <div style={{flex:1,overflow:"auto"}}>
            {sortedLog.length===0
              ?<div style={{padding:"24px 10px",color:"#1e3048",fontSize:9,textAlign:"center"}}>No history yet</div>
              :sortedLog.map(l=>(
                <div key={l.lid} className="lr" style={{padding:"6px 10px",borderBottom:"1px solid #1a2e44"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                    <div>
                      <span style={{color:typeCol(l.type),fontWeight:700,fontSize:9}}>{l.type}</span>
                      {l.tenor&&<span style={{color:"#5aaae8",fontWeight:700,fontSize:10,marginLeft:5}}>{l.tenor}</span>}
                      {l.strike&&<span style={{color:"#4a7898",fontSize:8,marginLeft:4}}>{l.strike}%</span>}{l.atm&&<span style={{color:"#a070d0",fontSize:8,marginLeft:4}}>ATM {l.atm}%</span>}{l.delta&&<span style={{color:"#4a8070",fontSize:8,marginLeft:4}}>Δ{l.delta}%</span>}
                    </div>
                    <span style={{color:"#1e3048",fontSize:7}}>{(l.ts instanceof Date?l.ts:new Date(l.ts)).toLocaleTimeString("en-GB",{hour12:false})}</span>
                  </div>
                  {l.label&&<div style={{color:"#4a6880",fontSize:8,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.label}</div>}
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    {l.bid!=null&&<><span style={{color:"#007a28",fontSize:7}}>B</span><span style={{color:"#00c040",fontWeight:700,fontSize:11}}>{l.bid.toFixed(4)}</span>{l.bidBank&&<span style={{color:cfBkCol(l.bidBank),fontSize:8,marginLeft:2}}>{l.bidBank}</span>}</>}
                    {l.bid!=null&&l.offer!=null&&<span style={{color:"#243c54",fontSize:9}}>/</span>}
                    {l.offer!=null&&<><span style={{color:"#994400",fontSize:7}}>O</span><span style={{color:"#ff8c00",fontWeight:700,fontSize:11}}>{l.offer.toFixed(4)}</span>{l.offerBank&&<span style={{color:cfBkCol(l.offerBank),fontSize:8,marginLeft:2}}>{l.offerBank}</span>}</>}
                  </div>
                  <button onClick={()=>loadFromLog(l)}
                    style={{background:"rgba(20,60,30,.5)",border:"1px solid rgba(40,140,80,.4)",color:"#40c080",fontSize:7,borderRadius:2,padding:"1px 5px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".06em"}}>
                    ↺ LOAD
                  </button>
                </div>
              ))
            }
          </div>
          <div style={{padding:"5px 10px",borderTop:"1px solid #1e3450",fontSize:8,color:"#1e3048",letterSpacing:".07em",flexShrink:0}}>CUSTOM · INDICATIVE ONLY</div>
        </div>

      </div>
    </div>
  );
}


// ── CF OTM Strike Panel ──────────────────────────────────────
function CfOtmStrikePanel({ cfQuotes, cfRef, ccy, visStrikes, otmView, setOtmView, subMenu }) {
  if(subMenu!=="otm") return null;
  const activeStrikes = visStrikes.filter(s=>s!=="ATM-STD");
  const rows = otmView==="spot"
    ? CF_TENORS.map(t=>({rk:String(t), lbl:`${t}y`}))
    : ALL_FWDS.map(({s,e})=>({rk:`${s}x${e}`, lbl:`${s}x${e}`}));
  const cells = [];
  rows.forEach(({rk,lbl})=>{
    activeStrikes.forEach(sk=>{
      ["cap","flr"].forEach(tp=>{
        const key=`${ccy}_${rk}_${tp}_${sk}`;
        const cell=cfQuotes[key]; if(!cell) return;
        const actB=(cell.bids||[]).filter(q=>!cfRef[key]?.has(`b|${q.id}`))[0];
        const actO=(cell.offers||[]).filter(q=>!cfRef[key]?.has(`o|${q.id}`))[0];
        if(actB||actO) cells.push({lbl,sk,tp,actB,actO});
      });
    });
  });
  return (
    <div style={{width:190,flexShrink:0,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"6px 10px",borderBottom:"1px solid #1e3450",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".1em"}}>OTM STRIKES</span>
        <div style={{display:"flex",gap:3}}>
          {["spot","fwd"].map(v=>(
            <button key={v} className={`btn${otmView===v?" on":""}`} style={{padding:"1px 5px",fontSize:8}} onClick={()=>setOtmView(v)}>{v.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {cells.length===0
          ?<div style={{padding:"20px 10px",color:"#1e3048",fontSize:9,textAlign:"center"}}>No OTM prices yet</div>
          :cells.map(({lbl,sk,tp,actB,actO},i)=>(
            <div key={i} className="lr" style={{padding:"5px 10px",borderBottom:"1px solid #1a2e44"}}>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:2}}>
                <span style={{color:"#5aaae8",fontWeight:700,fontSize:10}}>{lbl}</span>
                <span style={{color:parseFloat(sk)<=0?"#00c040":"#ff8c00",fontSize:8,fontWeight:600}}>{sk}%</span>
                <span style={{color:tp==="cap"?"#ff8c00":"#00c040",fontSize:8,fontWeight:700,marginLeft:"auto"}}>{tp.toUpperCase()}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"baseline"}}>
                {actB&&<><span style={{color:"#007a28",fontSize:7}}>B</span><span style={{color:"#00c040",fontWeight:700,fontSize:11}}>{actB.price.toFixed(4)}</span>{actB.bank&&<span style={{color:"#2a5040",fontSize:8}}> {actB.bank}</span>}</>}
                {actB&&actO&&<span style={{color:"#243c54",fontSize:9}}>/</span>}
                {actO&&<><span style={{color:"#994400",fontSize:7}}>O</span><span style={{color:"#ff8c00",fontWeight:700,fontSize:11}}>{actO.price.toFixed(4)}</span>{actO.bank&&<span style={{color:"#5a3010",fontSize:8}}> {actO.bank}</span>}</>}
              </div>
            </div>
          ))
        }
      </div>
      <div style={{padding:"5px 10px",borderTop:"1px solid #1e3450",fontSize:8,color:"#1e3048",letterSpacing:".07em",flexShrink:0}}>OTM · INDICATIVE ONLY</div>
    </div>
  );
}

// ── CF Log Panel (extracted) ──────────────────────────────────────
function CfLogPanel({ cfLog, setCfLog, displayCfLog, cfBankCounts, cfFiltBank, setCfFiltBank, cfFiltTen, setCfFiltTen, cfFiltMins, setCfFiltMins, cfFiltStrike, setCfFiltStrike, cfSort, setCfSort, cfBkCol, allStrikes=[], subMenu, cfReloadQuote, cfReloadAllLog }) {
  return (
    <div style={{width:240,flexShrink:0,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {Object.keys(cfBankCounts).length>0 && (
        <div style={{padding:"6px 10px",borderBottom:"1px solid #1e3450",flexShrink:0}}>
          <div style={{fontSize:8,color:"#3a6080",letterSpacing:".1em",marginBottom:4}}>FILTER BY BANK</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            <span className="bktag" style={{background:cfFiltBank===null?"rgba(60,120,200,.3)":"rgba(30,50,70,.3)",color:cfFiltBank===null?"#60b0f0":"#508090",border:`1px solid ${cfFiltBank===null?"rgba(60,120,200,.5)":"#253a52"}`,fontSize:8}} onClick={()=>setCfFiltBank(null)}>ALL</span>
            {Object.entries(cfBankCounts).sort((a,b)=>b[1]-a[1]).map(([b,ct])=>(
              <span key={b} className="bktag" style={{background:cfFiltBank===b?`${cfBkCol(b)}33`:"rgba(20,35,50,.4)",color:cfBkCol(b),border:`1px solid ${cfFiltBank===b?cfBkCol(b)+"66":"#1a2a3a"}`,fontSize:8}} onClick={()=>setCfFiltBank(cfFiltBank===b?null:b)}>
                {b} <span style={{opacity:.5}}>{ct}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <div style={{padding:"6px 10px",borderBottom:"1px solid #1e3450",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".12em"}}>CF HISTORY{cfFiltBank?` · ${cfFiltBank}`:""}</span>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {displayCfLog.length>0 && cfReloadAllLog && <button className="btn" style={{fontSize:8,padding:"2px 5px",color:"#40c080",borderColor:"#1a5030"}} onClick={()=>cfReloadAllLog(displayCfLog)} title="Reload all visible CF history onto surface">↺ ALL</button>}
          {cfLog.length>0 && <button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={()=>{setCfLog([]);setCfFiltBank(null);}}>CLEAR</button>}
          <span style={{color:"#243c54",fontSize:9}}>{displayCfLog.length}</span>
        </div>
      </div>
      <div style={{padding:"4px 10px",borderBottom:"1px solid #1e3450",display:"flex",flexWrap:"wrap",gap:3,flexShrink:0}}>
        {[{val:cfFiltMins,set:v=>setCfFiltMins(v),opts:[["","All time"],["15","15m"],["60","1h"],["240","4h"]]},
          {val:cfFiltTen||"",set:v=>setCfFiltTen(v||null),opts:[["","All tenors"],...CF_TENORS.map(t=>[String(t),`${t}Y`])]}
        ].map((f,fi)=>(
          <select key={fi} value={f.val||""} onChange={e=>f.set(e.target.value?fi===0?Number(e.target.value):e.target.value:null)}
            style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",flex:1}}>
            {f.opts.map(([v,lbl])=><option key={v} value={v}>{lbl}</option>)}
          </select>
        ))}
        <select value={cfSort} onChange={e=>setCfSort(e.target.value)}
          style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",flex:1}}>
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
      {subMenu==="otm" && allStrikes.filter(s=>s!=="ATM-STD").length>0 && (
        <div style={{padding:"4px 10px",borderBottom:"1px solid #1e3450",display:"flex",flexWrap:"wrap",gap:3,flexShrink:0}}>
          <span style={{color:"#253a52",fontSize:8,marginRight:2,alignSelf:"center"}}>K:</span>
          <button className="exp-chip" onClick={()=>setCfFiltStrike(null)}
            style={{background:cfFiltStrike===null?"rgba(40,80,140,.35)":"rgba(20,30,40,.5)",color:cfFiltStrike===null?"#60a0d0":"#304050",border:`1px solid ${cfFiltStrike===null?"rgba(60,120,200,.4)":"#253a52"}`}}>ALL</button>
          {allStrikes.filter(s=>s!=="ATM-STD").map(sk=>(
            <button key={sk} className="exp-chip" onClick={()=>setCfFiltStrike(cfFiltStrike===sk?null:sk)}
              style={{background:cfFiltStrike===sk?"rgba(40,80,140,.35)":"rgba(20,30,40,.5)",
                color:cfFiltStrike===sk?(parseFloat(sk)<=0?"#00c040":"#ff8c00"):"#304050",
                border:`1px solid ${cfFiltStrike===sk?"rgba(60,120,200,.4)":"#253a52"}`}}>
              {sk}%
            </button>
          ))}
        </div>
      )}
      <div style={{flex:1,overflow:"auto"}}>
        {displayCfLog.length===0
          ?<div style={{padding:"24px 10px",color:"#1e3048",fontSize:10,textAlign:"center"}}>No quotes yet</div>
          :displayCfLog.map(l=>(
            <div key={l.id} className="lr" style={{padding:"6px 10px",borderBottom:"1px solid #1a2e44"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{color:"#5aaae8",fontWeight:700,fontSize:11}}>{l.tenor}{typeof l.tenor==="number"?"Y":""}</span>
                  <span style={{color:l.type==="CAP"?"#ff8c00":l.type==="FLR"?"#00c040":l.type==="STRADDLE"?"#a070d0":"#5090e0",fontSize:9,fontWeight:700}}>{l.type}</span>
                  {l.strikeCol&&l.strikeCol!=="ATM-STD"&&<span style={{color:parseFloat(l.strikeCol)<=0?"#00c040":"#ff8c00",fontSize:8,fontWeight:600,marginLeft:2}}>{l.strikeCol}%</span>}
                  {l.bidBank   && <span style={{color:cfBkCol(l.bidBank),fontSize:8,fontWeight:700,background:`${cfBkCol(l.bidBank)}22`,padding:"0 4px",borderRadius:2,border:`1px solid ${cfBkCol(l.bidBank)}44`}}>{l.bidBank}</span>}
                  {l.offerBank && l.offerBank!==l.bidBank && <span style={{color:cfBkCol(l.offerBank),fontSize:8,fontWeight:700,background:`${cfBkCol(l.offerBank)}22`,padding:"0 4px",borderRadius:2,border:`1px solid ${cfBkCol(l.offerBank)}44`}}>{l.offerBank}</span>}
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span style={{color:"#1e3048",fontSize:8}}>{(l.ts instanceof Date?l.ts:new Date(l.ts)).toLocaleTimeString("en-GB",{hour12:false})}</span>
                  <span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>setCfLog(p=>p.filter(x=>x.id!==l.id))}>✕</span>
                </div>
              </div>
              <div style={{display:"flex",gap:5,alignItems:"baseline",flexWrap:"wrap"}}>
                {l.bid!=null   && <><span style={{color:"#00c040",fontWeight:700,fontSize:12}}>{l.bid}</span>{l.bidStrike&&<span style={{color:"#2a5040",fontSize:8}}>{l.bidStrike}%</span>}<span style={{color:"#1a3828",fontSize:7}}>b</span></>}
                {l.bid!=null&&l.offer!=null && <span style={{color:"#243c54",fontSize:9}}>/</span>}
                {l.offer!=null && <><span style={{color:"#ff8c00",fontWeight:700,fontSize:12}}>{l.offer}</span>{l.offerStrike&&<span style={{color:"#5a3010",fontSize:8}}>{l.offerStrike}%</span>}<span style={{color:"#3a2010",fontSize:7}}>o</span></>}
                {l.bid!=null&&l.offer!=null && <span style={{color:"#1e3048",fontSize:8,marginLeft:"auto"}}>{"spd "+(l.offer-l.bid).toFixed(4)}</span>}
                {cfReloadQuote && <button onClick={()=>cfReloadQuote(l)}
                  style={{marginLeft:"auto",background:"rgba(20,60,30,.5)",border:"1px solid rgba(40,140,80,.4)",color:"#40c080",fontSize:7,borderRadius:2,padding:"1px 5px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".06em"}}
                  title="Reload onto surface">↺ LOAD</button>}
              </div>
            </div>
          ))
        }
      </div>
      <div style={{padding:"6px 10px",borderTop:"1px solid #1e3450",fontSize:8,color:"#1e3048",letterSpacing:".07em",flexShrink:0}}>CF · INDICATIVE ONLY</div>
    </div>
  );
}


function OtmItem({q, bkc, removeOtm, addCounter, removeCounter}) {
  const [cf, setCf] = React.useState({bank:"", price:"", side:"bid"});
  const typeCol = q.type==="Payer"?"#ff8c00":q.type==="Receiver"?"#00c040":"#a070d0";
  return (
    <div style={{padding:"7px 14px",borderBottom:"1px solid #1a2e44"}}>
      {/* Header row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span style={{color:"#5aaae8",fontWeight:700,fontSize:12}}>{q.exp.toUpperCase()}<span style={{color:"#385878",fontSize:10}}>x</span>{q.ten}</span>
          <span style={{color:typeCol,fontSize:9,fontWeight:700}}>{q.type}</span>
          {q.bank && <span style={{color:bkc(q.bank),fontSize:9,fontWeight:700,background:`${bkc(q.bank)}18`,padding:"1px 5px",borderRadius:2,border:`1px solid ${bkc(q.bank)}44`,opacity:q.referred?.4:1,textDecoration:q.referred?"line-through":"none"}}>{q.bank}</span>}
        </div>
        <span style={{color:"#4a2020",fontSize:10,cursor:"pointer"}} onClick={()=>removeOtm(q.id)}>✕</span>
      </div>
      {/* Price row */}
      <div style={{display:"flex",gap:8,alignItems:"baseline",fontSize:11,marginBottom:q.legs&&q.legs.length>1?2:4}}>
        {(!q.legs||q.legs.length<=1) && <>
          <span style={{color:"#2a4860",fontSize:8}}>K</span>
          <span style={{color:"#80b8d8",fontSize:10}}>
            {q.strike>0?"+":""}{q.strike}bp
            {q.strikePct && <span style={{color:"#385878",fontSize:8,marginLeft:4}}>({q.strikePct}%)</span>}
          </span>
        </>}
        <span style={{color:q.side==="bid"?"#00c040":q.side==="offer"?"#ff8c00":"#80b8d8",fontWeight:700,fontSize:12}}>{q.price}</span>
        <span style={{color:"#2a4860",fontSize:8}}>{q.side}</span>
        <span style={{color:"#1e3048",fontSize:7,marginLeft:"auto"}}>{q.ts.toLocaleTimeString("en-GB",{hour12:false})}</span>
      </div>
      {/* Multi-leg strikes */}
      {q.legs&&q.legs.length>1 && (
        <div style={{marginBottom:4,paddingLeft:4,borderLeft:"2px solid #1e3450"}}>
          {q.legs.map((leg,li)=>(
            <div key={li} style={{display:"flex",gap:6,alignItems:"baseline",fontSize:9,marginBottom:1}}>
              <span style={{color:"#3a6888",width:60}}>{leg.label}</span>
              {leg.strikePct && <span style={{color:"#507080"}}>{leg.strikePct}%</span>}
              {leg.ratio && <span style={{color:"#806030",fontSize:8}}>x{leg.ratio}</span>}
            </div>
          ))}
        </div>
      )}
      {/* Existing counters */}
      {(q.counters||[]).map(c=>(
        <div key={c.id} style={{display:"flex",alignItems:"center",gap:4,marginBottom:3,paddingLeft:8,borderLeft:"2px solid #1e3450"}}>
          <span style={{color:bkc(c.bank),fontSize:9,fontWeight:700,opacity:c.referred?.4:1,textDecoration:c.referred?"line-through":"none"}}>{c.bank}</span>
          <span style={{color:c.side==="bid"?"#00c040":c.side==="offer"?"#ff8c00":"#80b8d8",fontWeight:700,fontSize:11,opacity:c.referred?.4:1,textDecoration:c.referred?"line-through":"none"}}>{c.price}</span>
          <span style={{color:"#2a4860",fontSize:8}}>{c.side}</span>
          <span style={{color:"#4a2020",fontSize:9,cursor:"pointer",marginLeft:"auto"}} onClick={()=>removeCounter(q.id,c.id)}>✕</span>
        </div>
      ))}
      {/* Add counter inline */}
      <div style={{display:"flex",gap:3,marginTop:4,alignItems:"center"}}>
        <input value={cf.bank} onChange={e=>setCf(f=>({...f,bank:e.target.value}))} placeholder="Bank"
          style={{background:"#060a10",border:"1px solid #1a2e44",color:"#b0bcc8",fontSize:8,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",width:44,outline:"none",textTransform:"uppercase"}}/>
        <input value={cf.price} onChange={e=>setCf(f=>({...f,price:e.target.value}))} placeholder="bp"
          onKeyDown={e=>{if(e.key==="Enter"){addCounter(q.id,cf.bank,cf.price,cf.side);setCf({bank:"",price:"",side:"bid"});}}}
          style={{background:"#060a10",border:"1px solid #1a2e44",color:"#b0bcc8",fontSize:8,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",width:38,outline:"none"}}/>
        <select value={cf.side} onChange={e=>setCf(f=>({...f,side:e.target.value}))}
          style={{background:"#080c14",border:"1px solid #1a2e44",color:cf.side==="bid"?"#00c040":"#ff8c00",fontSize:8,borderRadius:3,padding:"2px 2px",fontFamily:"inherit",width:46}}>
          <option value="bid">Bid</option><option value="offer">Offer</option><option value="mid">Mid</option>
        </select>
        <button onClick={()=>{addCounter(q.id,cf.bank,cf.price,cf.side);setCf({bank:"",price:"",side:"bid"});}}
          style={{background:"rgba(20,50,80,.5)",border:"1px solid #2e4e78",color:"#5a96c8",fontSize:8,borderRadius:3,padding:"2px 5px",cursor:"pointer",fontFamily:"inherit"}}>+</button>
      </div>
    </div>
  );
}

export default function App() {
  const [quotes, setQuotes]               = useState({});
  const [referred, setReferred]           = useState(new Set());   // Set of "k|side|id" that are referred
  const [activeCell, setActiveCell]       = useState(null);
  const [editVals, setEditVals]           = useState({ bid:"", offer:"", bidBank:"", offerBank:"" });
  const [activeBankField, setActiveBankField] = useState(null);
  const [bankSuggest, setBankSuggest]     = useState([]);
  const [log, setLog]                     = useState(() => loadLS("vbl_log4",[]).map(l=>({...l,ts:new Date(l.ts)})));
  const [hoveredCell, setHoveredCell]     = useState(null);
  const [filterBank, setFilterBank]       = useState(null);
  const [filterExp,  setFilterExp]        = useState(null);
  const [filterTen,  setFilterTen]        = useState(null);
  const [filterMins, setFilterMins]       = useState(null);
  const [sortDir,    setSortDir]          = useState("desc");
  const [otmQuotes,  setOtmQuotes]       = useState(() => {
    return loadLS("vbl_otm2",[]).map(q=>({...q, ts:new Date(q.ts), counters:(q.counters||[]).map(c=>({...c,ts:new Date(c.ts)}))}));
  });
  const [otmFilterExp,  setOtmFilterExp]  = useState(null);
  const [otmFilterTen,  setOtmFilterTen]  = useState(null);
  const [otmFilterMins, setOtmFilterMins] = useState(null);
  const [otmSortDir,    setOtmSortDir]    = useState("desc");
  const [otmForm,    setOtmForm]         = useState({exp:"1m",ten:"10Y",strike:"",type:"Payer",side:"bid",price:"",bank:""});
  const [showOtmForm, setShowOtmForm]     = useState(true); // desc=newest first, asc=oldest first
  const [viewMode, setViewMode]           = useState("premium");
  const [hiddenExpiries, setHiddenExpiries] = useState(new Set());
  const [showExpMgr, setShowExpMgr]       = useState(false);
  const [showStrikeMgr, setShowStrikeMgr] = useState(false);
  const [cfHiddenSt, setCfHiddenSt]       = useState(new Set());
  const bidRef = useRef(null);
  const cfLiveRef = useRef(null);
  const cfEodRef  = useRef(null);
  const [copiedLive, setCopiedLive] = useState(false);
  const [copiedEOD,  setCopiedEOD]  = useState(false);
  const CCYS = ['AUD','USD','EUR','JPY'];
  const CCY_ISO = {AUD:'au', USD:'us', EUR:'eu', JPY:'jp'};
  const [activeCcy, setActiveCcy] = useState('AUD');
  const [activeProduct, setActiveProduct] = useState('swaption');
  const [cfSubMenu,     setCfSubMenu]     = useState('atm');
  const [activeCfCcy,   setActiveCfCcy]   = useState('AUD');
  const CCY_VOL_RANGE  = {AUD:[59,87],   USD:[80,110],  EUR:[59,87],  JPY:[59,87]};
  const CCY_PREM_RANGE = {AUD:[6,1700],  USD:[10,3400], EUR:[6,1700], JPY:[6,1700]};
  const CCY_FWD   = {AUD:AUD_FWD,  USD:USD_FWD,  EUR:AUD_FWD,  JPY:AUD_FWD};
  const CCY_MID   = {AUD:AUD_MID,  USD:USD_MID,  EUR:AUD_MID,  JPY:AUD_MID};
  const CCY_PREM  = {AUD:AUD_PREM, USD:USD_PREM, EUR:AUD_PREM, JPY:AUD_PREM};
  const FWD      = CCY_FWD[activeCcy]   || AUD_FWD;
  const MID      = CCY_MID[activeCcy]   || AUD_MID;
  const PREMIUM  = CCY_PREM[activeCcy]  || AUD_PREM;
  const [VOL_MIN,  VOL_MAX]  = CCY_VOL_RANGE[activeCcy]  || [59,87];
  const [PREM_MIN, PREM_MAX] = CCY_PREM_RANGE[activeCcy] || [6,1700];
  const [ccyStore, setCcyStore] = useState({AUD:{quotes:{},log:[],referred:new Set()},USD:{quotes:{},log:[],referred:new Set()},EUR:{quotes:{},log:[],referred:new Set()},JPY:{quotes:{},log:[],referred:new Set()}});

  useEffect(() => { try { localStorage.setItem("vbl_log4", JSON.stringify(log.slice(0,300))); } catch {} }, [log]);
  useEffect(() => { try { localStorage.setItem("vbl_otm2", JSON.stringify(otmQuotes.slice(0,200))); } catch {} }, [otmQuotes]);
  useEffect(() => { if (activeCell && bidRef.current) bidRef.current.focus(); }, [activeCell]);

  const visibleExpiries = ALL_EXPIRIES.filter(e => !hiddenExpiries.has(e));

  const toggleExpiry = (exp) => {
    setHiddenExpiries(prev => {
      const n = new Set(prev);
      n.has(exp) ? n.delete(exp) : n.add(exp);
      return n;
    });
  };

  const openCell = (exp, ten) => {
    setActiveCell({ exp, ten, k: cellKey(exp,ten) });
    setEditVals({ bid:"", offer:"", bidBank:"", offerBank:"" });
    setBankSuggest([]);
  };

  const handleBankInput = (field, val) => {
    const v = val.toUpperCase();
    setActiveBankField(field);
    setEditVals(e => ({...e, [field]: v}));
    setBankSuggest(v.length>=1 ? BANKS.filter(b=>b.startsWith(v)&&b!==v).slice(0,6) : []);
  };

  const commitQuote = useCallback(() => {
    if (!activeCell) return;
    const { exp, ten, k } = activeCell;
    const ti        = TENORS.indexOf(ten);
    const mid       = MID[exp]?.[ti];
    const bidPrice  = editVals.bid   !== "" ? parseFloat(editVals.bid)   : null;
    const offrPrice = editVals.offer !== "" ? parseFloat(editVals.offer) : null;
    const bidBank   = editVals.bidBank.trim().toUpperCase()   || null;
    const offerBank = editVals.offerBank.trim().toUpperCase() || null;
    if (bidPrice===null && offrPrice===null) { setBankSuggest([]); setActiveCell(null); return; }
    const id = Date.now();
    setQuotes(prev => {
      const cell = prev[k] || {bids:[],offers:[]};
      const nb = bidPrice  != null ? [...cell.bids,  {price:bidPrice, bank:bidBank, id}].sort((a,b)=>b.price-a.price) : cell.bids;
      const no = offrPrice != null ? [...cell.offers,{price:offrPrice,bank:offerBank,id:id+1}].sort((a,b)=>a.price-b.price) : cell.offers;
      return {...prev,[k]:{bids:nb,offers:no}};
    });
    setLog(l => [{
      id: Date.now(),
      exp, ten,
      bid:    bidPrice?.toFixed(4)  ?? "--",
      offer:  offrPrice?.toFixed(4) ?? "--",
      mid:    mid?.toFixed(4)       ?? "--",
      spread: bidPrice!=null&&offrPrice!=null ? (offrPrice-bidPrice).toFixed(4) : "--",
      fwd:    FWD[exp]?.[ti]?.toFixed(3) ?? "--",
      bidBank, offerBank, ts: new Date(),
    }, ...l].slice(0,300));
    setBankSuggest([]);
    setActiveCell(null);
  }, [activeCell, editVals]);

  const handleKD = (e) => {
    if (e.key==="Enter" && bankSuggest.length===0) commitQuote();
    if (e.key==="Escape") { setActiveCell(null); setBankSuggest([]); }
    if (e.key==="Tab") {
      e.preventDefault();
      const fields = ['[name="bid"]','[name="bidBank"]','[name="offer"]','[name="offerBank"]'];
      const idx = fields.findIndex(s=>document.querySelector(s)===e.target);
      document.querySelector(fields[(idx+1)%4])?.focus();
    }
  };

  const removeQuote = (k, side, id, e) => {
    e.stopPropagation();
    setQuotes(prev => {
      const cell = prev[k]; if(!cell) return prev;
      const upd = {...cell,[side]:cell[side].filter(q=>q.id!==id)};
      if(upd.bids.length===0&&upd.offers.length===0){const n={...prev};delete n[k];return n;}
      return {...prev,[k]:upd};
    });
    setReferred(prev => { const n=new Set(prev); n.delete(`${k}|${side}|${id}`); return n; });
  };

  const toggleRefer = (k, side, id, e) => {
    e.stopPropagation();
    const rk = `${k}|${side}|${id}`;
    setReferred(prev => { const n=new Set(prev); n.has(rk)?n.delete(rk):n.add(rk); return n; });
  };

  const isReferred = (k, side, id) => referred.has(`${k}|${side}|${id}`);

  const clearCell = (k, e) => {
    e.stopPropagation();
    setQuotes(prev => { const n={...prev}; delete n[k]; return n; });
  };


  const switchCcy = (ccy) => {
    if (ccy === activeCcy) return;
    // save current ccy state
    setCcyStore(prev => ({
      ...prev,
      [activeCcy]: { quotes, log, referred }
    }));
    // load new ccy state
    const next = ccyStore[ccy] || {quotes:{},log:[],referred:new Set()};
    setQuotes(next.quotes);
    setLog(next.log);
    setReferred(next.referred);
    setActiveCcy(ccy);
    setActiveCell(null);
    setFilterBank(null);
  };

  const buildLegs = (type, exp, ten, strikeOffset, price, fwdVal) => {
    const fv = fwdVal;
    const s1 = fv != null ? (fv + strikeOffset/100).toFixed(3) : null;
    const atm = fv != null ? fv.toFixed(3) : null;
    if (type==="Payer Ladder") {
      const s2 = fv!=null?(fv+strikeOffset*2/100).toFixed(3):null;
      return [{label:"ATM",strike:0,strikePct:atm},{label:`+${strikeOffset}bp`,strike:strikeOffset,strikePct:s1},{label:`+${strikeOffset*2}bp`,strike:strikeOffset*2,strikePct:s2}];
    }
    if (type==="Receiver Ladder") {
      const s2 = fv!=null?(fv+strikeOffset*2/100).toFixed(3):null;
      return [{label:"ATM",strike:0,strikePct:atm},{label:`${strikeOffset}bp`,strike:strikeOffset,strikePct:s1},{label:`${strikeOffset*2}bp`,strike:strikeOffset*2,strikePct:s2}];
    }
    if (type==="Payer 1x2"||type==="Receiver 1x2") {
      return [{label:"ATM",strike:0,strikePct:atm},{label:`${strikeOffset>0?"+":""}${strikeOffset}bp`,strike:strikeOffset,strikePct:s1,ratio:2}];
    }
    if (type==="Risk Reversal") {
      const s2 = fv!=null?(fv-strikeOffset/100).toFixed(3):null;
      return [{label:`Payer +${strikeOffset}bp`,strike:strikeOffset,strikePct:s1},{label:`Recv -${strikeOffset}bp`,strike:-strikeOffset,strikePct:s2}];
    }
    if (type==="Strangle") {
      const s2 = fv!=null?(fv-strikeOffset/100).toFixed(3):null;
      return [{label:`Payer +${strikeOffset}bp`,strike:strikeOffset,strikePct:s1},{label:`Recv -${strikeOffset}bp`,strike:-strikeOffset,strikePct:s2}];
    }
    return [{label:"",strike:strikeOffset,strikePct:s1}];
  };
  const addOtm = () => {
    const {exp,ten,strike,type,side,price,bank} = otmForm;
    if (!strike||!price) return;
    const fwdVal = FWD[exp]?.[TENORS.indexOf(ten)];
    const offset = parseFloat(strike);
    const legs = buildLegs(type, exp, ten, offset, parseFloat(price), fwdVal);
    const strikePct = fwdVal != null ? (fwdVal + offset/100).toFixed(3) : null;
    setOtmQuotes(prev => [{
      id: Date.now(),
      exp, ten, strike: offset, type, side, price: parseFloat(price),
      strikePct, legs,
      bank: bank.trim().toUpperCase()||null,
      counters: [], ts: new Date()
    }, ...prev]);
    setOtmForm(f=>({...f, strike:"", price:"", bank:""}));
  };
  const removeOtm = (id) => setOtmQuotes(prev => prev.filter(q=>q.id!==id));
  const addCounter = (id, cbank, cprice, cside) => {
    if (!cbank||!cprice) return;
    setOtmQuotes(prev => prev.map(q => q.id!==id ? q : {
      ...q, counters: [...(q.counters||[]), {id:Date.now(), bank:cbank.trim().toUpperCase(), price:parseFloat(cprice), side:cside, ts:new Date()}]
    }));
  };
  const removeCounter = (qid, cid) => {
    setOtmQuotes(prev => prev.map(q => q.id!==qid ? q : {...q, counters:(q.counters||[]).filter(c=>c.id!==cid)}));
  };

  const referAllBank = (bank) => {
    setReferred(prev => {
      const n = new Set(prev);
      Object.entries(quotes).forEach(([k,cell]) => {
        (cell.bids||[]).forEach(q   => { if(q.bank===bank) n.add(`${k}|bids|${q.id}`);   });
        (cell.offers||[]).forEach(q => { if(q.bank===bank) n.add(`${k}|offers|${q.id}`); });
      });
      return n;
    });
    setOtmQuotes(prev => prev.map(q => {
      if (q.bank===bank) return {...q, referred:true};
      const counters = (q.counters||[]).map(c => c.bank===bank?{...c,referred:true}:c);
      return {...q, counters};
    }));
  };
  const reinstateAllBank = (bank) => {
    setReferred(prev => {
      const n = new Set(prev);
      Object.entries(quotes).forEach(([k,cell]) => {
        (cell.bids||[]).forEach(q   => { if(q.bank===bank) n.delete(`${k}|bids|${q.id}`);   });
        (cell.offers||[]).forEach(q => { if(q.bank===bank) n.delete(`${k}|offers|${q.id}`); });
      });
      return n;
    });
    setOtmQuotes(prev => prev.map(q => {
      const base = q.bank===bank?{...q,referred:false}:q;
      const counters = (base.counters||[]).map(c => c.bank===bank?{...c,referred:false}:c);
      return {...base, counters};
    }));
  };

  const copyToClip = (text, setter) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 1800);
    });
  };

  const exportLive = () => {
    const lines = [];
    ALL_EXPIRIES.forEach(exp => {
      TENORS.forEach((ten, ti) => {
        const k    = cellKey(exp, ten);
        const cell = quotes[k];
        if (!cell) return;
        const fwd    = FWD[exp]?.[ti];
        const bids   = (cell.bids   || []).filter(q => !isReferred(k,'bids',  q.id));
        const offers = (cell.offers || []).filter(q => !isReferred(k,'offers',q.id));
        if (bids.length === 0 && offers.length === 0) return;
        const label  = `${exp}${ten.toLowerCase()}`;
        const strike = fwd != null ? `atm ${fwd.toFixed(3)}%` : '';
        const b = bids.length   > 0 ? bids[0].price.toFixed(4)   : '';
        const o = offers.length > 0 ? offers[0].price.toFixed(4) : '';
        lines.push(`${label.padEnd(8)}  ${strike.padEnd(14)}  ${b}/${o}`);
      });
    });
    if (otmQuotes.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push('--- OTM ---');
      otmQuotes.forEach(q => {
        const lbl  = `${q.exp}${q.ten.toLowerCase()}`;
        const kStr = `K ${q.strike>0?"+":""}${q.strike}bp${q.strikePct?` (${q.strikePct}%)`:""}`;
        const bk   = q.bank?` [${q.bank}]`:"";
        const col1 = lbl.padEnd(8);
        const col2 = q.type.padEnd(10);
        const col3 = kStr.padEnd(24);
        lines.push(`${col1}  ${col2}  ${col3}  ${q.price}${bk} ${q.side}`);
        const indent = ' '.repeat(8+2+10+2+24+2);
        (q.counters||[]).forEach(c=>lines.push(`${indent}${c.price} ${c.side} [${c.bank}]`));
      });
    }
    if (lines.length === 0) return;
    copyToClip(lines.join('\n'), setCopiedLive);
  };

  const exportEOD = () => {
    const out = [];
    const pad = ' '.repeat(38); // indent for continuation lines
    ALL_EXPIRIES.forEach(exp => {
      TENORS.forEach((ten, ti) => {
        const k    = cellKey(exp, ten);
        const cell = quotes[k];
        if (!cell) return;
        const fwd    = FWD[exp]?.[ti];
        const allBids   = cell.bids   || [];
        const allOffers = cell.offers || [];
        if (allBids.length === 0 && allOffers.length === 0) return;
        const activeBids   = allBids.filter(q   => !isReferred(k,'bids',  q.id));
        const activeOffers = allOffers.filter(q => !isReferred(k,'offers',q.id));
        const reffedBids   = allBids.filter(q   =>  isReferred(k,'bids',  q.id));
        const reffedOffers = allOffers.filter(q =>  isReferred(k,'offers',q.id));
        const label  = `${exp}${ten.toLowerCase()}`;
        const strike = fwd != null ? `atm ${fwd.toFixed(3)}%` : '';
        // first line: label + strike + best bid/best offer
        const b0 = activeBids.length   > 0 ? activeBids[0].price.toFixed(4)   : '';
        const o0 = activeOffers.length > 0 ? activeOffers[0].price.toFixed(4) : '';
        out.push(`${label.padEnd(8)}  ${strike.padEnd(14)}  ${b0}/${o0}`);
        // remaining active bids (bid only lines)
        activeBids.slice(1).forEach(q => {
          out.push(`${pad}${q.price.toFixed(4)}/`);
        });
        // remaining active offers (offer only lines)
        activeOffers.slice(1).forEach(q => {
          out.push(`${pad}/${q.price.toFixed(4)}`);
        });
        // referred bids
        reffedBids.forEach(q => {
          out.push(`${pad}(${q.price.toFixed(4)}/ reffed)`);
        });
        // referred offers
        reffedOffers.forEach(q => {
          out.push(`${pad}(/${q.price.toFixed(4)} reffed)`);
        });
        out.push(''); // blank line between cells
      });
    });
    if (otmQuotes.length > 0) {
      out.push('');
      out.push('--- OTM ---');
      otmQuotes.forEach(q => {
        const lbl  = `${q.exp}${q.ten.toLowerCase()}`;
        const kStr = `K ${q.strike>0?"+":""}${q.strike}bp${q.strikePct?` (${q.strikePct}%)`:""}`;
        const bk   = q.bank?` [${q.bank}]`:"";
        const col1 = lbl.padEnd(8);
        const col2 = q.type.padEnd(10);
        const col3 = kStr.padEnd(24);
        out.push(`${col1}  ${col2}  ${col3}  ${q.price}${bk} ${q.side}`);
        const indent = ' '.repeat(8+2+10+2+24+2);
        (q.counters||[]).forEach(c=>out.push(`${indent}${c.price} ${c.side} [${c.bank}]`));
        out.push('');
      });
    }
    // trim trailing blank lines
    while (out.length && out[out.length-1] === '') out.pop();
    if (out.length === 0) return;
    copyToClip(out.join('\n'), setCopiedEOD);
  };


  const displayOtm = otmQuotes.filter(q => {
    if (filterBank    && q.bank!==filterBank && !(q.counters||[]).some(c=>c.bank===filterBank)) return false;
    if (otmFilterExp  && q.exp!==otmFilterExp) return false;
    if (otmFilterTen  && q.ten!==otmFilterTen) return false;
    if (otmFilterMins) { const age=(now-(q.ts instanceof Date?q.ts:new Date(q.ts)))/60000; if(isNaN(age)||age>otmFilterMins) return false; }
    return true;
  }).slice().sort((a,b)=>{
    if (otmSortDir==="exp") { const ei=ALL_EXPIRIES.indexOf(a.exp)-ALL_EXPIRIES.indexOf(b.exp); return ei!==0?ei:TENORS.indexOf(a.ten)-TENORS.indexOf(b.ten); }
    if (otmSortDir==="ten") { const ti=TENORS.indexOf(a.ten)-TENORS.indexOf(b.ten); return ti!==0?ti:ALL_EXPIRIES.indexOf(a.exp)-ALL_EXPIRIES.indexOf(b.exp); }
    const ta=a.ts instanceof Date?a.ts:new Date(a.ts); const tb=b.ts instanceof Date?b.ts:new Date(b.ts);
    return otmSortDir==="asc"?ta-tb:tb-ta;
  });
  const allCells = Object.values(quotes);
  const bidCt    = allCells.reduce((s,c)=>s+c.bids.length,0);
  const offrCt   = allCells.reduce((s,c)=>s+c.offers.length,0);
  const twowayCt = allCells.filter(c=>c.bids.length>0&&c.offers.length>0).length;
  const crossCt  = allCells.filter(c=>c.bids.length>0&&c.offers.length>0&&c.bids[0].price>=c.offers[0].price).length;
  const referCt  = referred.size;

  const bankCounts = log.reduce((acc,l)=>{
    if(l.bidBank)   acc[l.bidBank]  =(acc[l.bidBank]  ||0)+1;
    if(l.offerBank) acc[l.offerBank]=(acc[l.offerBank]||0)+1;
    return acc;
  },{});
  const now = new Date();
  const displayLog = log.filter(l => {
    if (filterBank && l.bidBank!==filterBank && l.offerBank!==filterBank) return false;
    if (filterExp  && l.exp!==filterExp)  return false;
    if (filterTen  && l.ten!==filterTen)  return false;
    if (filterMins) { const ts=l.ts instanceof Date?l.ts:new Date(l.ts); const age=(now-ts)/60000; if(isNaN(age)||age>filterMins) return false; }
    return true;
  }).slice().sort((a,b) => {
    if (sortDir==="exp") {
      const ei = ALL_EXPIRIES.indexOf(a.exp) - ALL_EXPIRIES.indexOf(b.exp);
      if (ei!==0) return ei;
      return TENORS.indexOf(a.ten) - TENORS.indexOf(b.ten);
    }
    if (sortDir==="ten") {
      const ti = TENORS.indexOf(a.ten) - TENORS.indexOf(b.ten);
      if (ti!==0) return ti;
      return ALL_EXPIRIES.indexOf(a.exp) - ALL_EXPIRIES.indexOf(b.exp);
    }
    const ta=a.ts instanceof Date?a.ts:new Date(a.ts);
    const tb=b.ts instanceof Date?b.ts:new Date(b.ts);
    return sortDir==="asc"?ta-tb:tb-ta;
  });
  const reloadQuote = (l) => {
    const k = cellKey(l.exp, l.ten);
    const id = Date.now();
    setQuotes(prev => {
      const cell = prev[k] || {bids:[],offers:[]};
      const bidPrice  = l.bid  !=="--" ? parseFloat(l.bid)   : null;
      const offrPrice = l.offer!=="--" ? parseFloat(l.offer) : null;
      const nb = bidPrice  != null ? [...cell.bids,  {price:bidPrice,  bank:l.bidBank||null,   id}      ].sort((a,b)=>b.price-a.price) : cell.bids;
      const no = offrPrice != null ? [...cell.offers,{price:offrPrice, bank:l.offerBank||null, id:id+1}].sort((a,b)=>a.price-b.price) : cell.offers;
      return {...prev,[k]:{bids:nb,offers:no}};
    });
  };

  const reloadAllVisible = () => {
    setQuotes(prev => {
      const next = {...prev};
      displayLog.forEach((l,i) => {
        const k = cellKey(l.exp, l.ten);
        const id = Date.now() + i*2;
        const cell = next[k] || {bids:[],offers:[]};
        const bidPrice  = l.bid  !=="--" ? parseFloat(l.bid)   : null;
        const offrPrice = l.offer!=="--" ? parseFloat(l.offer) : null;
        const nb = bidPrice  != null ? [...cell.bids,  {price:bidPrice,  bank:l.bidBank||null,   id}      ].sort((a,b)=>b.price-a.price) : cell.bids;
        const no = offrPrice != null ? [...cell.offers,{price:offrPrice, bank:l.offerBank||null, id:id+1}].sort((a,b)=>a.price-b.price) : cell.offers;
        next[k] = {bids:nb,offers:no};
      });
      return next;
    });
  };

  const ts  = now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  return (
    <div style={{height:"100vh",background:"#020408",color:"#b0bcc8",fontFamily:"'JetBrains Mono','Fira Code',monospace",display:"flex",flexDirection:"column",width:"100%",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        html,body,#root{width:100%;height:100%;overflow:hidden;margin:0;padding:0;}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:#060810} ::-webkit-scrollbar-thumb{background:#243448;border-radius:3px}
        .ci{background:transparent;border:none;outline:none;font-family:inherit;font-size:11px;width:100%;text-align:center;color:inherit}
        .hv:hover{background:rgba(70,130,255,0.05)!important;cursor:pointer}
        .fi{animation:fi .1s ease} @keyframes fi{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
        .lr{animation:lr .14s ease} @keyframes lr{from{opacity:0;transform:translateX(4px)}to{opacity:1;transform:translateX(0)}}
        .btn{background:rgba(20,45,80,.6);border:1px solid #2e4e78;color:#5a96c8;padding:3px 8px;border-radius:3px;cursor:pointer;font-size:9px;font-family:inherit;letter-spacing:.08em;transition:all .15s}
        .btn:hover{background:rgba(40,80,150,.4);color:#70b8f0;border-color:#3a5a8a}
        .btn.on{background:rgba(40,90,170,.35);border-color:rgba(70,140,220,.6);color:#70c0ff}
        .bktag{border-radius:2px;padding:1px 5px;font-size:9px;font-weight:700;cursor:pointer;letter-spacing:.06em}
        .suggest{position:absolute;z-index:100;background:#0e1c2e;border:1px solid #305878;border-radius:3px;top:100%;left:0;right:0}
        .sug-item{padding:4px 8px;font-size:10px;cursor:pointer} .sug-item:hover{background:#1e3048}
        .qrow-actions{opacity:0;transition:opacity .12s}
        .qrow:hover .qrow-actions{opacity:1}
        .ref-btn{font-size:7px;cursor:pointer;padding:1px 3px;border-radius:2px;border:1px solid;letter-spacing:.04em;font-family:inherit}
        .del-btn{font-size:9px;cursor:pointer;color:#e03838;margin-left:1px}
        .referred-price{opacity:0.35;text-decoration:line-through}
        .exp-chip{padding:2px 6px;border-radius:2px;font-size:9px;cursor:pointer;font-family:inherit;font-weight:600;letter-spacing:.08em;transition:all .12s}
      `}</style>

      {/* TOP TITLE BAR */}
      <div style={{background:"#060c18",borderBottom:"1px solid #1a2e44",padding:"6px 18px",textAlign:"center",flexShrink:0}}>
        <span style={{color:"#3a6080",fontSize:9,fontWeight:700,letterSpacing:".25em"}}>INTEREST RATE OPTION LIVE MARKETS BLOTTER</span>
      </div>

      {/* HEADER */}
      <div style={{background:"#0d1520",borderBottom:"1px solid #253d58",padding:"9px 18px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#2080e0",boxShadow:"0 0 8px #2080e055"}}/>
          {[["swaption","SWAPTION"],["capfloor","CAP & FLOOR"]].map(([pid,plbl])=><button key={pid} onClick={()=>setActiveProduct(pid)} style={{background:activeProduct===pid?"rgba(30,80,180,.45)":"transparent",border:`1px solid ${activeProduct===pid?"rgba(60,130,230,.5)":"transparent"}`,color:activeProduct===pid?"#ccd8e4":"#3a6080",padding:"3px 10px",borderRadius:3,cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:".1em",fontFamily:"inherit"}}>{plbl}</button>)}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <button className={`btn${showExpMgr?" on":""}`} onClick={()=>setShowExpMgr(v=>!v)}>
            EXPIRIES {hiddenExpiries.size>0?`(${hiddenExpiries.size} hidden)`:""}
          </button>
          <button onClick={()=>setViewMode(v=>v==="vol"?"premium":"vol")}
            style={{background:viewMode==="premium"?"rgba(180,130,20,.25)":"rgba(30,50,80,.3)",border:`1px solid ${viewMode==="premium"?"rgba(200,160,40,.5)":"#253a52"}`,color:viewMode==="premium"?"#d4aa30":"#508090",padding:"3px 10px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em"}}>
            {viewMode==="vol"?"bpVOL":"bpPREM"}
          </button>
          <button onClick={activeProduct==="capfloor"?()=>cfLiveRef.current?.():exportLive}
            style={{background:copiedLive?"rgba(20,120,60,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedLive?"rgba(40,200,100,.5)":"#2e4e78"}`,color:copiedLive?"#40e890":"#5a96c8",padding:"3px 10px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>
            {copiedLive?"COPIED ✓":"LIVE"}
          </button>
          <button onClick={activeProduct==="capfloor"?()=>cfEodRef.current?.():exportEOD}
            style={{background:copiedEOD?"rgba(120,80,20,.4)":"rgba(20,50,80,.5)",border:`1px solid ${copiedEOD?"rgba(200,150,40,.5)":"#2e4e78"}`,color:copiedEOD?"#e0b040":"#5a96c8",padding:"3px 10px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit",letterSpacing:".08em",transition:"all .2s"}}>
            {copiedEOD?"COPIED ✓":"EOD"}
          </button>
          <span style={{color:"#4a7898",fontSize:9}}>INDICATIVE ONLY</span>
          <span style={{color:"#305870",fontSize:11}}>{ts}</span>
        </div>
      </div>


      {/* PRODUCT TABS ROW */}
      <div style={{background:"#080c14",borderBottom:"1px solid #1e3450",padding:"5px 18px",display:"flex",gap:5,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
        {CCYS.map(ccy=>{const active=activeProduct==="swaption"?activeCcy===ccy:activeCfCcy===ccy;return(<button key={ccy} onClick={()=>activeProduct==="swaption"?switchCcy(ccy):setActiveCfCcy(ccy)} style={{background:active?"rgba(30,80,180,.45)":"rgba(15,35,70,.4)",border:`1px solid ${active?"rgba(60,130,230,.5)":"#1e3450"}`,color:active?"#90c8f0":"#406080",padding:"4px 10px",borderRadius:3,cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:6}}><img src={`https://flagcdn.com/20x15/${CCY_ISO[ccy]}.png`} width="20" height="15" style={{borderRadius:2,border:"1px solid rgba(255,255,255,.2)",flexShrink:0}} alt={ccy}/><span>{ccy}</span></button>);})}
        {activeProduct==="capfloor" && <>
          <span style={{color:"#253a52",margin:"0 6px"}}>|</span>
          {[["atm","ATM Caps & Floors"],["wedge","ATM Swaption v CFS Wedges"],["otm","OTM Caps & Floors"],["custom","Custom Caps & Floors"],["exotic","Cap & Floor Exotics"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>{setCfSubMenu(id);setActiveCell(null);setCopiedCfLive(false);setCopiedCfEOD(false);}} style={{background:cfSubMenu===id?"rgba(20,60,150,.4)":"transparent",border:`1px solid ${cfSubMenu===id?"rgba(50,110,220,.5)":"transparent"}`,color:cfSubMenu===id?"#80b8f0":"#305070",padding:"3px 8px",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700,letterSpacing:".08em",fontFamily:"inherit"}}>{lbl}</button>
          ))}
          {cfSubMenu==="otm" && (
            <button className={`btn${showStrikeMgr?" on":""}`} onClick={()=>setShowStrikeMgr(v=>!v)} style={{marginLeft:8}}>
              STRIKES {cfHiddenSt.size>0?`(${cfHiddenSt.size} hidden)`:""}
            </button>
          )}
        </>}
      </div>

      {/* STRIKE MANAGER */}
      {activeProduct==="capfloor" && cfSubMenu==="otm" && showStrikeMgr && (
        <div style={{background:"#0b1420",borderBottom:"1px solid #1e3450",padding:"8px 18px",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
          <span style={{color:"#305870",fontSize:9,marginRight:4,letterSpacing:".08em"}}>TOGGLE STRIKES:</span>
          {ALL_STRIKES.map(sk=>{
            const hidden = cfHiddenSt.has(sk);
            const isAtm  = sk==="ATM-STD"||sk==="0.00";
            return (
              <button key={sk} className="exp-chip"
                onClick={()=>setCfHiddenSt(prev=>{ const n=new Set(prev); n.has(sk)?n.delete(sk):n.add(sk); return n; })}
                style={{background:hidden?"rgba(20,30,40,.5)":isAtm?"rgba(60,40,120,.3)":"rgba(40,80,140,.25)",color:hidden?"#304050":isAtm?"#a070d0":"#60a0d0",border:`1px solid ${hidden?"#253a52":isAtm?"rgba(160,80,200,.4)":"rgba(60,120,200,.4)"}`}}>
                {sk==="ATM-STD"?"ATM-STD":`${sk}%`}
              </button>
            );
          })}
          <button className="btn" style={{marginLeft:8}} onClick={()=>setCfHiddenSt(new Set())}>SHOW ALL</button>
        </div>
      )}

      {/* EXPIRY MANAGER */}
      {activeProduct==="swaption" && showExpMgr && (
        <div style={{background:"#0b1420",borderBottom:"1px solid #1e3450",padding:"8px 18px",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{color:"#305870",fontSize:9,marginRight:4,letterSpacing:".08em"}}>TOGGLE ROWS:</span>
          {ALL_EXPIRIES.map(exp=>{
            const hidden = hiddenExpiries.has(exp);
            return (
              <button key={exp} className="exp-chip"
                onClick={()=>toggleExpiry(exp)}
                style={{background:hidden?"rgba(20,30,40,.5)":"rgba(40,80,140,.25)",color:hidden?"#508090":"#60a0d0",border:`1px solid ${hidden?"#253a52":"rgba(60,120,200,.4)"}`}}>
                {exp.toUpperCase()}
              </button>
            );
          })}
          <button className="btn" style={{marginLeft:8}} onClick={()=>setHiddenExpiries(new Set())}>SHOW ALL</button>
        </div>
      )}

      {/* LIVE POSITION BAR */}
      <div style={{background:"#060c16",borderBottom:"1px solid #1a2e44",padding:"5px 18px",display:"flex",gap:16,alignItems:"center",flexShrink:0}}>
        <span style={{fontSize:9,color:"#3a6080",letterSpacing:".1em",flexShrink:0}}>LIVE</span>
        {[{l:"BIDS",v:bidCt,c:"#00c040"},{l:"OFFERS",v:offrCt,c:"#ff8c00"},{l:"2-WAY",v:twowayCt,c:"#4890d0"},{l:"CROSSED",v:crossCt,c:crossCt?"#5090e0":"#243c54"}].map(s=>(
          <div key={s.l} style={{display:"flex",gap:3,alignItems:"baseline"}}>
            <span style={{color:s.c,fontSize:14,fontWeight:700}}>{s.v}</span>
            <span style={{color:s.c,fontSize:8,opacity:.5,letterSpacing:".08em"}}>{s.l}</span>
          </div>
        ))}
        {referCt>0 && <div style={{display:"flex",gap:3,alignItems:"baseline"}}>
          <span style={{color:"#a070d0",fontSize:14,fontWeight:700}}>{referCt}</span>
          <span style={{color:"#a070d0",fontSize:8,opacity:.5}}>REFFED</span>
        </div>}
      </div>

      {/* BANK FILTER BAR */}
      {activeProduct==="swaption" && Object.keys(bankCounts).length>0 && (
        <div style={{background:"#060c16",borderBottom:"1px solid #1a2e44",padding:"5px 18px",display:"flex",flexWrap:"wrap",gap:4,alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:9,color:"#3a6080",letterSpacing:".1em",marginRight:4,flexShrink:0}}>BANK</span>
          <span className="bktag" style={{background:filterBank===null?"rgba(60,120,200,.3)":"rgba(30,50,70,.3)",color:filterBank===null?"#60b0f0":"#508090",border:`1px solid ${filterBank===null?"rgba(60,120,200,.5)":"#253a52"}`}} onClick={()=>setFilterBank(null)}>ALL</span>
          {Object.entries(bankCounts).sort((a,b)=>b[1]-a[1]).map(([b,ct])=>(
            <span key={b} className="bktag" style={{background:filterBank===b?`${bkc(b)}33`:"rgba(20,35,50,.4)",color:bkc(b),border:`1px solid ${filterBank===b?bkc(b)+"66":"#1a2a3a"}`}}
              onClick={()=>setFilterBank(filterBank===b?null:b)}>
              {b} <span style={{opacity:.5}}>{ct}</span>
            </span>
          ))}
          {filterBank && <>
            <button className="btn" style={{fontSize:8,color:"#a070d0",borderColor:"#604080",marginLeft:4}}
              onClick={()=>referAllBank(filterBank)}>REFER ALL {filterBank}</button>
            <button className="btn" style={{fontSize:8,color:"#00c040",borderColor:"#205040"}}
              onClick={()=>reinstateAllBank(filterBank)}>REINSTATE ALL {filterBank}</button>
          </>}
        </div>
      )}

      <div style={{display:activeProduct==="capfloor"?"flex":"none",flex:1,overflow:"hidden",flexDirection:"column",minHeight:0}}>
        <CapFloorPanel ccy={activeCfCcy} subMenu={cfSubMenu} hiddenSt={cfHiddenSt} setHiddenSt={setCfHiddenSt} cfLiveRef={cfLiveRef} cfEodRef={cfEodRef} swpQuotes={quotes} swpReferred={referred}/>
      </div>
      <div style={{display:activeProduct==="swaption"?"flex":"none",flex:1,overflow:"hidden"}}>
        {/* GRID */}
        <div style={{flex:1,overflow:"auto",padding:"8px 10px"}}>
          <table style={{borderCollapse:"collapse",fontSize:11,tableLayout:"fixed",width:"100%",minWidth:900}}>
            <thead>
              <tr>
                <th style={{width:44,padding:"5px 6px",textAlign:"left",color:"#5a88b0",fontSize:9,borderBottom:"2px solid #2a4868",fontWeight:500}}>{viewMode==="vol"?"bpVol":"bpPrem"}</th>
                {TENORS.map(t=>(
                  <th key={t} style={{padding:"5px 3px",textAlign:"center",minWidth:88,color:"#7aaed8",fontSize:10,fontWeight:600,borderBottom:"2px solid #2a4868",letterSpacing:".1em"}}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleExpiries.map(exp=>(
                <tr key={exp}>
                  <td style={{padding:"2px 6px",color:"#8cc0e0",fontWeight:700,fontSize:10,letterSpacing:".1em",borderRight:"2px solid #2a4868",borderBottom:"1px solid #1a2e44",cursor:"pointer",userSelect:"none"}}
                    title="Click to hide row" onClick={()=>toggleExpiry(exp)}>
                    {exp.toUpperCase()}
                  </td>
                  {TENORS.map((ten,ti)=>{
                    const mid      = MID[exp]?.[ti];
                    const prem     = PREMIUM[exp]?.[ti];
                    const k        = cellKey(exp,ten);
                    const cell     = quotes[k];
                    const isActive = activeCell?.k===k;
                    const isHov    = hoveredCell===k;
                    const bids     = cell?.bids   || [];
                    const offers   = cell?.offers || [];
                    const hasBid   = bids.length>0;
                    const hasOff   = offers.length>0;
                    const both     = hasBid&&hasOff;
                    const cross    = both && bids[0].price>=offers[0].price;
                    const dispMid  = viewMode==="premium" ? prem?.toFixed(1) : mid?.toFixed(4);

                    // Base = premium heatmap, override with quote state colour
                    let bg = heatBg(viewMode==="premium" ? prem : mid, viewMode==="premium" ? PREM_MIN : VOL_MIN, viewMode==="premium" ? PREM_MAX : VOL_MAX);
                    if(both)        bg = cross?"rgba(20,50,180,.50)":"rgba(40,70,20,.40)";
                    else if(hasBid) bg = "rgba(0,80,30,.35)";
                    else if(hasOff) bg = "rgba(100,45,0,.30)";
                    if(isActive)    bg = "rgba(30,90,220,.50)";
                    const bdr = isActive?"rgba(50,140,255,.80)":cross?"rgba(30,70,200,.65)":both?"rgba(80,160,40,.55)":hasBid?"rgba(0,160,60,.50)":hasOff?"rgba(200,100,0,.50)":"rgba(255,255,255,0.12)";

                    return (
                      <td key={ten} className="hv"
                        onClick={()=>!isActive && openCell(exp,ten)}
                        onMouseEnter={()=>setHoveredCell(k)}
                        onMouseLeave={()=>setHoveredCell(null)}
                        style={{background:bg,border:`1px solid ${bdr}`,padding:"2px 2px",position:"relative",transition:"background .1s",cursor:"pointer",minWidth:88,verticalAlign:"top"}}>

                        {isActive ? (
                          <div className="fi" style={{display:"flex",flexDirection:"column",gap:1,padding:"3px 4px",position:"relative"}}>
                            <div style={{textAlign:"center",color:"#3a80b8",fontSize:8,marginBottom:2}}>
                              fwd {FWD[exp]?.[ti]?.toFixed(3)??"--"}% | {viewMode==="premium"?`${prem?.toFixed(1)??"--"}bp`:`mid ${mid?.toFixed(4)??"--"}`}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:2}}>
                              <span style={{color:"#007a28",fontSize:9,width:8}}>B</span>
                              <input ref={bidRef} name="bid" className="ci" style={{color:"#00c040",fontWeight:700}}
                                value={editVals.bid} placeholder={mid?.toFixed(4)}
                                onChange={e=>setEditVals(v=>({...v,bid:e.target.value}))} onKeyDown={handleKD}/>
                              <div style={{position:"relative",width:50,flexShrink:0}}>
                                <input name="bidBank" className="ci" style={{color:editVals.bidBank?bkc(editVals.bidBank):"#2a5a3a",fontWeight:700,fontSize:10,letterSpacing:".06em",width:50}}
                                  value={editVals.bidBank} placeholder="BANK"
                                  onChange={e=>handleBankInput("bidBank",e.target.value)} onKeyDown={handleKD} autoComplete="off"/>
                                {bankSuggest.length>0 && activeBankField==="bidBank" && (
                                  <div className="suggest">{bankSuggest.map(b=>(
                                    <div key={b} className="sug-item" style={{color:bkc(b)}} onMouseDown={()=>{setEditVals(v=>({...v,bidBank:b}));setBankSuggest([]);}}>{b}</div>
                                  ))}</div>
                                )}
                              </div>
                            </div>
                            <div style={{borderTop:"1px solid #141e2a",margin:"0 2px"}}/>
                            <div style={{display:"flex",alignItems:"center",gap:2}}>
                              <span style={{color:"#994400",fontSize:9,width:8}}>O</span>
                              <input name="offer" className="ci" style={{color:"#ff8c00",fontWeight:700}}
                                value={editVals.offer} placeholder={mid?.toFixed(4)}
                                onChange={e=>setEditVals(v=>({...v,offer:e.target.value}))} onKeyDown={handleKD}/>
                              <div style={{position:"relative",width:50,flexShrink:0}}>
                                <input name="offerBank" className="ci" style={{color:editVals.offerBank?bkc(editVals.offerBank):"#5a2a1a",fontWeight:700,fontSize:10,letterSpacing:".06em",width:50}}
                                  value={editVals.offerBank} placeholder="BANK"
                                  onChange={e=>handleBankInput("offerBank",e.target.value)} onKeyDown={handleKD} autoComplete="off"/>
                                {bankSuggest.length>0 && activeBankField==="offerBank" && (
                                  <div className="suggest">{bankSuggest.map(b=>(
                                    <div key={b} className="sug-item" style={{color:bkc(b)}} onMouseDown={()=>{setEditVals(v=>({...v,offerBank:b}));setBankSuggest([]);}}>{b}</div>
                                  ))}</div>
                                )}
                              </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"flex-end",gap:4,marginTop:3}}>
                              <button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={e=>{e.stopPropagation();setActiveCell(null);}}>ESC</button>
                              <button className="btn" style={{fontSize:8,padding:"2px 5px",color:"#40a060",borderColor:"#1a4030"}} onClick={e=>{e.stopPropagation();commitQuote();}}>ADD</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{display:"flex",flexDirection:"column",padding:"2px 3px",gap:0,minHeight:22}}>
                            {isHov && <div style={{textAlign:"center",color:"#3a80b8",fontSize:7,marginBottom:1}}>fwd {FWD[exp]?.[ti]?.toFixed(3)??"--"}%</div>}
                            <div style={{textAlign:"center",color:(hasBid||hasOff)?"#508090":"#68a0ba",fontSize:(hasBid||hasOff)?8:11,fontWeight:(hasBid||hasOff)?400:500,opacity:(hasBid||hasOff)?.45:1,marginBottom:(hasBid||hasOff)?1:0}}>
                              {dispMid ?? "--"}
                            </div>

                            {/* BIDS — best only, full depth on hover */}
                            {(isHov ? bids : bids.slice(0,1)).map((q,i)=>{
                              const ref = isReferred(k,"bids",q.id);
                              return (
                                <div key={q.id} className="qrow" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,marginBottom:1}}>
                                  <span className={ref?"referred-price":""} style={{color:ref?"#1a6030":cross&&i===0?"#5090e0":"#00c040",fontWeight:700,fontSize:10}}>{q.price.toFixed(4)}</span>
                                  {isHov && q.bank && <span style={{color:bkc(q.bank),fontSize:8,fontWeight:700}}>{q.bank}</span>}
                                  {isHov && (
                                    <span className="qrow-actions" style={{display:"flex",gap:2,alignItems:"center"}}>
                                      <button className="ref-btn" onClick={e=>toggleRefer(k,"bids",q.id,e)}
                                        style={{color:ref?"#a070d0":"#5080a0",borderColor:ref?"#7050a0":"#2a4060",background:ref?"rgba(100,50,160,.2)":"transparent"}}>
                                        {ref?"UN-REF":"REF"}
                                      </button>
                                      <span className="del-btn" onClick={e=>removeQuote(k,"bids",q.id,e)}>✕</span>
                                    </span>
                                  )}
                                </div>
                              );
                            })}

                            {both && (
                              <div style={{textAlign:"center",color:"#253a52",fontSize:8,lineHeight:"10px",marginBottom:1}}>
                                {cross ? <span style={{color:"#80b8ff",fontSize:7,fontWeight:700}}>CROSS</span> : `${(offers[0].price-bids[0].price).toFixed(4)}`}
                              </div>
                            )}

                            {/* OFFERS — best only, full depth on hover */}
                            {(isHov ? offers : offers.slice(0,1)).map((q,i)=>{
                              const ref = isReferred(k,"offers",q.id);
                              return (
                                <div key={q.id} className="qrow" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,marginBottom:1}}>
                                  <span className={ref?"referred-price":""} style={{color:ref?"#7a4010":cross&&i===0?"#5090e0":"#ff8c00",fontWeight:700,fontSize:10}}>{q.price.toFixed(4)}</span>
                                  {isHov && q.bank && <span style={{color:bkc(q.bank),fontSize:8,fontWeight:700}}>{q.bank}</span>}
                                  {isHov && (
                                    <span className="qrow-actions" style={{display:"flex",gap:2,alignItems:"center"}}>
                                      <button className="ref-btn" onClick={e=>toggleRefer(k,"offers",q.id,e)}
                                        style={{color:ref?"#a070d0":"#5080a0",borderColor:ref?"#7050a0":"#2a4060",background:ref?"rgba(100,50,160,.2)":"transparent"}}>
                                        {ref?"UN-REF":"REF"}
                                      </button>
                                      <span className="del-btn" onClick={e=>removeQuote(k,"offers",q.id,e)}>✕</span>
                                    </span>
                                  )}
                                </div>
                              );
                            })}

                            {isHov && (hasBid||hasOff) && (
                              <div style={{textAlign:"center",marginTop:1}}>
                                <span onClick={e=>clearCell(k,e)} style={{color:"#4a2020",fontSize:7,cursor:"pointer"}}>CLEAR ALL</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT PANEL */}
        <div style={{width:"22%",minWidth:220,maxWidth:300,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"8px 14px",borderBottom:"1px solid #1e3450",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".12em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:120}}>QUOTE HISTORY{filterBank?` · ${filterBank}`:""}</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {displayLog.length>0 && <button className="btn" style={{fontSize:8,padding:"2px 6px",color:"#40c080",borderColor:"#1a5030"}} onClick={reloadAllVisible} title="Reload all visible history onto surface">↺ LOAD ALL</button>}
              {log.length>0 && <button className="btn" onClick={()=>{setLog([]);setFilterBank(null);setFilterExp(null);setFilterTen(null);setFilterMins(null);}}>CLEAR</button>}
              <span style={{color:"#243c54",fontSize:9}}>{displayLog.length}</span>
            </div>
          </div>
          <div style={{padding:"5px 14px",borderBottom:"1px solid #1e3450",display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}>
            {[{val:filterMins,set:setFilterMins,opts:[["","All time"],["15","15m"],["60","1h"],["240","4h"]]},
              {val:filterExp||"",set:v=>setFilterExp(v||null),opts:[["","All expiries"],["1w","1Wk"],["1m","1M"],["2m","2M"],["3m","3M"],["6m","6M"],["9m","9M"],["1y","1Y"],["18m","18M"],["2y","2Y"],["3y","3Y"],["4y","4Y"],["5y","5Y"],["6y","6Y"],["7y","7Y"],["8y","8Y"],["9y","9Y"],["10y","10Y"],["12y","12Y"],["15y","15Y"],["20y","20Y"],["25y","25Y"],["30y","30Y"]]},
              {val:filterTen||"",set:v=>setFilterTen(v||null),opts:[["","All tenors"],["1Y","1Y"],["2Y","2Y"],["3Y","3Y"],["4Y","4Y"],["5Y","5Y"],["7Y","7Y"],["10Y","10Y"],["12Y","12Y"],["15Y","15Y"],["20Y","20Y"],["25Y","25Y"],["30Y","30Y"]]}
            ].map((f,fi)=>(
              <select key={fi} value={f.val||""} onChange={e=>f.set(e.target.value?fi===0?Number(e.target.value):e.target.value:null)}
                style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",cursor:"pointer",flex:1}}>
                {f.opts.map(([v,lbl])=><option key={v} value={v}>{lbl}</option>)}
              </select>
            ))}
            <select value={sortDir} onChange={e=>setSortDir(e.target.value)}
              style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",cursor:"pointer",flex:1}}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
              <option value="exp">By expiry (1wk→30y)</option>
              <option value="ten">By tenor (1Y→30Y)</option>
            </select>
            {(filterExp||filterTen||filterMins) && <button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={()=>{setFilterExp(null);setFilterTen(null);setFilterMins(null);}}>✕</button>}
          </div>
          <div style={{flex:1,overflow:"auto"}}>
            {displayLog.length===0
              ? <div style={{padding:"24px 14px",color:"#1e3048",fontSize:10,textAlign:"center"}}>{filterBank?`No quotes from ${filterBank}`:"No quotes yet"}</div>
              : displayLog.map((l,i)=>(
                <div key={l.id||i} className="lr" style={{padding:"7px 14px",borderBottom:"1px solid #1a2e44",background:i===0?"rgba(35,70,150,.08)":"transparent"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:"#5aaae8",fontWeight:700,fontSize:12}}>{l.exp.toUpperCase()}<span style={{color:"#385878",fontSize:10}}>x</span>{l.ten}</span>
                      {(l.bidBank||l.offerBank) && (
                        <div style={{display:"flex",gap:3,alignItems:"center"}}>
                          {l.bidBank   && <span style={{color:bkc(l.bidBank),fontWeight:700,fontSize:10,background:`${bkc(l.bidBank)}18`,padding:"1px 5px",borderRadius:2,border:`1px solid ${bkc(l.bidBank)}44`}}>{l.bidBank}</span>}
                          {l.bidBank&&l.offerBank && <span style={{color:"#508090",fontSize:9}}>v</span>}
                          {l.offerBank && <span style={{color:bkc(l.offerBank),fontWeight:700,fontSize:10,background:`${bkc(l.offerBank)}18`,padding:"1px 5px",borderRadius:2,border:`1px solid ${bkc(l.offerBank)}44`}}>{l.offerBank}</span>}
                        </div>
                      )}
                    </div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <span style={{color:"#243c54",fontSize:8}}>{new Date(l.ts).toLocaleTimeString("en-GB",{hour12:false})}</span>
                      <span style={{color:"#4a2020",cursor:"pointer",fontSize:10}} onClick={()=>setLog(p=>p.filter(x=>(x.id||x.ts)!==(l.id||l.ts)))}>✕</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,fontSize:11,alignItems:"baseline"}}>
                    <span style={{color:"#2a4860",fontSize:8}}>MID</span><span style={{color:"#80b8d8"}}>{l.mid}</span>
                    {l.bid!=="--"   && <><span style={{color:"#007a28",fontSize:8}}>B</span><span style={{color:"#00c040",fontWeight:700}}>{l.bid}</span></>}
                    {l.offer!=="--" && <><span style={{color:"#994400",fontSize:8}}>O</span><span style={{color:"#ff8c00",fontWeight:700}}>{l.offer}</span></>}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:2,fontSize:8,color:"#2a4460"}}>
                    <span>fwd {l.fwd}%</span>
                    {l.spread!=="--" && <span>spd {l.spread}v</span>}
                    <button onClick={()=>reloadQuote(l)}
                      style={{marginLeft:"auto",background:"rgba(20,60,30,.5)",border:"1px solid rgba(40,140,80,.4)",color:"#40c080",fontSize:7,borderRadius:2,padding:"1px 5px",cursor:"pointer",fontFamily:"inherit",letterSpacing:".06em"}}
                      title="Reload onto surface">↺ LOAD</button>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{padding:"7px 14px",borderTop:"1px solid #1e3450",fontSize:8,color:"#243c54",letterSpacing:".07em"}}>
            INDICATIVE ONLY · NOT FOR EXECUTION · {now.toLocaleDateString("en-GB")}
          </div>
        </div>

        {/* OTM STRUCTURES PANEL */}
        <div style={{width:"22%",minWidth:220,maxWidth:300,background:"#080c14",borderLeft:"1px solid #1e3450",display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
          <div style={{padding:"8px 14px",borderBottom:"1px solid #1e3450",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <span style={{color:"#60a0c8",fontSize:9,fontWeight:700,letterSpacing:".12em"}}>OTM STRUCTURES</span>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button className={`btn${showOtmForm?" on":""}`} onClick={()=>setShowOtmForm(v=>!v)}>{showOtmForm?"▲ FORM":"▼ ADD"}</button>
              {otmQuotes.length>0 && <button className="btn" onClick={()=>setOtmQuotes([])}>CLEAR</button>}
              <span style={{color:"#243c54",fontSize:9}}>{displayOtm.length}</span>
            </div>
          </div>
          <div style={{padding:"5px 14px",borderBottom:"1px solid #1e3450",display:"flex",flexWrap:"wrap",gap:4,alignItems:"center",flexShrink:0}}>
            {[{val:otmFilterMins,set:v=>setOtmFilterMins(v),opts:[["","All time"],["15","15m"],["60","1h"],["240","4h"]]},
              {val:otmFilterExp||"",set:v=>setOtmFilterExp(v||null),opts:[["","All expiries"],...ALL_EXPIRIES.map(e=>[e,e.toUpperCase()])]},
              {val:otmFilterTen||"",set:v=>setOtmFilterTen(v||null),opts:[["","All tenors"],...TENORS.map(t=>[t,t])]}
            ].map((f,fi)=>(
              <select key={fi} value={f.val||""} onChange={e=>f.set(e.target.value?fi===0?Number(e.target.value):e.target.value:null)}
                style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",cursor:"pointer",flex:1}}>
                {f.opts.map(([v,lbl])=><option key={v} value={v}>{lbl}</option>)}
              </select>
            ))}
            <select value={otmSortDir} onChange={e=>setOtmSortDir(e.target.value)}
              style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",cursor:"pointer",flex:1}}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
              <option value="exp">By expiry</option>
              <option value="ten">By tenor</option>
            </select>
            {(otmFilterExp||otmFilterTen||otmFilterMins) && <button className="btn" style={{fontSize:8,padding:"2px 5px"}} onClick={()=>{setOtmFilterExp(null);setOtmFilterTen(null);setOtmFilterMins(null);}}>✕</button>}
          </div>

          {/* ADD FORM */}
          {showOtmForm && <div style={{padding:"8px 14px",borderBottom:"1px solid #1e3450",flexShrink:0}}>
            <div style={{display:"flex",gap:3,marginBottom:4,flexWrap:"wrap"}}>
              {/* Expiry */}
              <select value={otmForm.exp} onChange={e=>setOtmForm(f=>({...f,exp:e.target.value}))}
                style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",flex:1}}>
                {ALL_EXPIRIES.map(e=><option key={e} value={e}>{e.toUpperCase()}</option>)}
              </select>
              {/* Tenor */}
              <select value={otmForm.ten} onChange={e=>setOtmForm(f=>({...f,ten:e.target.value}))}
                style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",flex:1}}>
                {TENORS.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              {/* Type */}
              <select value={otmForm.type} onChange={e=>setOtmForm(f=>({...f,type:e.target.value}))}
                style={{background:"#080c14",border:"1px solid #1e3450",color:"#4a80a8",fontSize:9,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",flex:1}}>
                <option>Payer</option>
                <option>Receiver</option>
                <option>Straddle</option>
                <option>Strangle</option>
                <option>Risk Reversal</option>
                <option>Payer Ladder</option>
                <option>Receiver Ladder</option>
                <option>Payer 1x2</option>
                <option>Receiver 1x2</option>
              </select>
            </div>
            <div style={{display:"flex",gap:3,marginBottom:4}}>
              {/* Strike offset */}
              <div style={{flex:1,position:"relative"}}>
                <input value={otmForm.strike} onChange={e=>setOtmForm(f=>({...f,strike:e.target.value}))}
                  placeholder="+30bp" style={{background:"#060a10",border:"1px solid #1e3450",color:"#b0bcc8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",width:"100%",outline:"none"}}/>
              </div>
              {/* Side */}
              <select value={otmForm.side} onChange={e=>setOtmForm(f=>({...f,side:e.target.value}))}
                style={{background:"#080c14",border:"1px solid #1e3450",color:otmForm.side==="bid"?"#00c040":"#ff8c00",fontSize:9,borderRadius:3,padding:"2px 3px",fontFamily:"inherit",width:52}}>
                <option value="bid">Bid</option>
                <option value="offer">Offer</option>
                <option value="mid">Mid</option>
              </select>
              {/* Price */}
              <input value={otmForm.price} onChange={e=>setOtmForm(f=>({...f,price:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&addOtm()}
                placeholder="bp" style={{background:"#060a10",border:"1px solid #1e3450",color:"#b0bcc8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",width:44,outline:"none"}}/>
            </div>
            <div style={{display:"flex",gap:3,marginBottom:4}}>
              <input value={otmForm.bank} onChange={e=>setOtmForm(f=>({...f,bank:e.target.value}))}
                placeholder="Bank (opt)" style={{background:"#060a10",border:"1px solid #1e3450",color:"#b0bcc8",fontSize:9,borderRadius:3,padding:"2px 4px",fontFamily:"inherit",flex:1,outline:"none",textTransform:"uppercase"}}/>
            </div>
            <button onClick={addOtm} className="btn" style={{width:"100%",fontSize:9,padding:"3px 0",letterSpacing:".1em"}}>+ ADD</button>
          </div>}

          {/* LIST */}
          <div style={{flex:1,overflow:"auto"}}>
            {displayOtm.length===0
              ? <div style={{padding:"24px 14px",color:"#1e3048",fontSize:10,textAlign:"center"}}>{otmQuotes.length>0?"No matches":"No structures yet"}</div>
              : displayOtm.map(q=>(
                <OtmItem key={q.id} q={q} bkc={bkc} removeOtm={removeOtm} addCounter={addCounter} removeCounter={removeCounter}/>
              ))
            }
          </div>

          <div style={{padding:"7px 14px",borderTop:"1px solid #1e3450",fontSize:8,color:"#243c54",letterSpacing:".07em",flexShrink:0}}>
            OTM · INDICATIVE ONLY
          </div>
        </div>

      </div>
    </div>
  );
}
