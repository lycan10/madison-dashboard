import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "../order/order.css";
import "./price.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import ProgressFilter from "../../components/progressfilter/ProgressFilter";
import Pagination from "react-bootstrap/Pagination";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

// 100-3223-300 

// 100-4223-300

// 100-6222-300


const priceData = {
  "pushpull": {
    "pushPullCables": {
      "3Series": [
        {
          "conduit": [
            {
              "partNumber": "X0107",
              "package": "1 Spool",
              "packageQty": 2500,
              "unitOfMeasure": "FT",
              "drawing": "30608-1",
              "description": "3 SERIES CONDUIT - Use .075 Core",
              "currentPrice": 1353.14,
              "unitPrice": 0.54,
              "inchesPrice": 0.05
            },
            {
              "partNumber": "X1107",
              "package": "1 Spool",
              "packageQty": 500,
              "unitOfMeasure": "FT",
              "drawing": "30608-1",
              "description": "3 SERIES CONDUIT - Use .075 Core",
              "currentPrice": 409.36,
              "unitPrice": 0.82,
              "inchesPrice": 0.07
            },
            {
              "partNumber": "X0108",
              "package": "1 Spool",
              "packageQty": 2500,
              "unitOfMeasure": "FT",
              "drawing": "30609-1",
              "description": "3 SERIES CONDUIT - Use HP Core",
              "currentPrice": 1421.37,
              "unitPrice": 0.57,
              "inchesPrice": 0.05
            },
            {
              "partNumber": "X1108",
              "package": "1 Spool",
              "packageQty": 500,
              "unitOfMeasure": "FT",
              "drawing": "30609-1",
              "description": "3 SERIES CONDUIT - Use HP Core",
              "currentPrice": 432.09,
              "unitPrice": 0.86,
              "inchesPrice": 0.07
            },
            {
              "partNumber": "X0180-5",
              "package": "1 Spool",
              "packageQty": 1300,
              "unitOfMeasure": "FT",
              "drawing": "30591-1",
              "description": "3 SERIES HEFT CONDUIT",
              "currentPrice": 2285.57,
              "unitPrice": 1.76,
              "inchesPrice": 0.15
            },
            {
              "partNumber": "X0180-10",
              "package": "1 Spool",
              "packageQty": 500,
              "unitOfMeasure": "FT",
              "drawing": "30591-1",
              "description": "3 SERIES HEFT CONDUIT - Use w/30602-1",
              "currentPrice": 852.82,
              "unitPrice": 1.71,
              "inchesPrice": 0.15
            }
          ],
          "core": [
            {
              "partNumber": "X0002",
              "package": "1 Box",
              "packageQty": 2500,
              "unitOfMeasure": "FT",
              "drawing": "30006",
              "description": "3 SERIES .075 SOLID CORE use -w/30608-1",
              "currentPrice": 403.67,
              "unitPrice": 0.16,
              "inchesPrice": 0.01
            },
            {
              "partNumber": "X0109",
              "package": "1 Spool",
              "packageQty": 2500,
              "unitOfMeasure": "FT",
              "drawing": "30602-1",
              "description": "3 SERIES HP CORE - Use w/ 30609-1, 30591-1",
              "currentPrice": 722.05,
              "unitPrice": 0.29,
              "inchesPrice": 0.03
            },
            {
              "partNumber": "X1109",
              "package": "1 Spool",
              "packageQty": 500,
              "unitOfMeasure": "FT",
              "drawing": "30602-1",
              "description": "3 SERIES HP CORE - Use w/ 30609-1, 30591-1",
              "currentPrice": 250.17,
              "unitPrice": 0.50,
              "inchesPrice": 0.04
            }
          ],
          "hubs": [
            {
              "partNumber": "X0110",
              "package": "1 Pkg.",
              "packageQty": 50,
              "unitOfMeasure": "EA",
              "drawing": "30076-10",
              "description": "BULKHEAD HUB",
              "currentPrice": 78.94,
              "unitPrice": 1.58,
              "inchesPrice": 1.81
            },
            {
              "partNumber": "X0111",
              "package": "1 Pkg.",
              "packageQty": 50,
              "unitOfMeasure": "EA",
              "drawing": "30003-11",
              "description": "CLAMP HUB - S.S.",
              "currentPrice": 110.96,
              "unitPrice": 2.22,
              "inchesPrice": 2.31
            },
            {
              "partNumber": "X0112",
              "package": "1 Pkg.",
              "packageQty": 50,
              "unitOfMeasure": "EA",
              "drawing": "30582-11",
              "description": "BC COMBO HUB",
              "currentPrice": 372.03,
              "unitPrice": 7.44,
              "inchesPrice": 7.74
            },
            {
              "partNumber": "X0445",
              "package": "1 Pkg.",
              "packageQty": 20,
              "unitOfMeasure": "EA",
              "drawing": "30200-10",
              "description": "1/2-20 Thread: BULKHEAD HUB",
              "currentPrice": null,
              "unitPrice": 16.92,
              "inchesPrice": 0.85
            }
          ],
          "sleeves": [
            {
              "partNumber": "X0006",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30004-1",
              "description": "SLEEVE 1\" TRAVEL",
              "currentPrice": 60.72,
              "unitPrice": 1.21,
              "inchesPrice": 1.26
            },
            {
              "partNumber": "X0007",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30004-2",
              "description": "SLEEVE 2\" TRAVEL",
              "currentPrice": 61.82,
              "unitPrice": 1.24,
              "inchesPrice": 1.29
            },
            {
              "partNumber": "X0008",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30004-3",
              "description": "SLEEVE 3\" TRAVEL",
              "currentPrice": 62.92,
              "unitPrice": 1.26,
              "inchesPrice": 1.37
            },
            {
              "partNumber": "X0009",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30004-4",
              "description": "SLEEVE 4\" TRAVEL",
              "currentPrice": 68.45,
              "unitPrice": 1.37,
              "inchesPrice": 1.50
            },
            {
              "partNumber": "X0274-1",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "30004-5",
              "description": "SLEEVE 5\" TRAVEL",
              "currentPrice": 47.15,
              "unitPrice": 1.89,
              "inchesPrice": 2.06
            },
            {
              "partNumber": "X0300-1",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "30004-6",
              "description": "SLEEVE 6\" TRAVEL (Aluminum)",
              "currentPrice": 283.71,
              "unitPrice": 11.35,
              "inchesPrice": 11.80
            },
            {
              "partNumber": "X1286-00",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "30004-7",
              "description": "SLEEVE 7\" TRAVEL (Aluminum)",
              "currentPrice": 287.85,
              "unitPrice": 11.51,
              "inchesPrice": 11.97
            }
          ],
          "rods": [
            {
              "partNumber": "X0113",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30610-1",
              "description": "ROD 1\" TRAVEL",
              "currentPrice": 80.59,
              "unitPrice": 1.61,
              "inchesPrice": 1.84
            },
            {
              "partNumber": "X0114",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30610-2",
              "description": "ROD 2\" TRAVEL",
              "currentPrice": 62.07,
              "unitPrice": 1.24,
              "inchesPrice": 1.42
            },
            {
              "partNumber": "X0115",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30610-3",
              "description": "ROD 3\" TRAVEL",
              "currentPrice": 82.92,
              "unitPrice": 1.66,
              "inchesPrice": 1.81
            },
            {
              "partNumber": "X0116",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "30610-4",
              "description": "ROD 4\" TRAVEL",
              "currentPrice": 79.83,
              "unitPrice": 1.60,
              "inchesPrice": 1.66
            },
            {
              "partNumber": "X0275-1",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "30610-5",
              "description": "ROD 5\" TRAVEL",
              "currentPrice": 85.01,
              "unitPrice": 3.40,
              "inchesPrice": 3.54
            },
            {
              "partNumber": "X0299-1",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "30610-6",
              "description": "ROD 6\" TRAVEL",
              "currentPrice": 110.96,
              "unitPrice": 4.44,
              "inchesPrice": 4.62
            },
            {
              "partNumber": "X1285-00",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "30610-7",
              "description": "ROD 7\" TRAVEL",
              "currentPrice": 160.08,
              "unitPrice": 6.40,
              "inchesPrice": 6.66
            },
            {
              "partNumber": "30916982",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "98201698",
              "description": "HP Shift Rod",
              "currentPrice": null,
              "unitPrice": null,
              "inchesPrice": null
            },
            {
              "partNumber": "X1201-00",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "82092300",
              "description": "METRIC ROD 2\" TRAVEL",
              "currentPrice": 124.13,
              "unitPrice": 4.97,
              "inchesPrice": 5.68
            },
            {
              "partNumber": "X1202-00",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "82092301",
              "description": "METRIC ROD 3\" TRAVEL",
              "currentPrice": 139.33,
              "unitPrice": 5.57,
              "inchesPrice": 5.80
            },
            {
              "partNumber": "X1203-00",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "82092302",
              "description": "METRIC ROD 4\" TRAVEL",
              "currentPrice": 140.44,
              "unitPrice": 5.62,
              "inchesPrice": 6.13
            },
            {
              "partNumber": "X1204-00",
              "package": "1 Pkg.",
              "packageQty": 25,
              "drawing": "82092303",
              "description": "METRIC ROD 5\" TRAVEL",
              "currentPrice": 101.85,
              "unitPrice": 4.07,
              "inchesPrice": 4.24
            }
          ],
          "hardware": [
            {
              "partNumber": "X0014",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "10197",
              "description": "LOCK WASHER (B-HUBS)",
              "currentPrice": 35.48,
              "unitPrice": 0.07,
              "inchesPrice": 0.08
            },
            {
              "partNumber": "X0015",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30007",
              "description": "10/32 ROD NUT: S.S.",
              "currentPrice": 27.05,
              "unitPrice": 0.05,
              "inchesPrice": 0.06
            },
            {
              "partNumber": "X1257-00",
              "package": "1 Pkg.",
              "packageQty": 50,
              "drawing": "98204069",
              "description": "Metric Rod Nut: S.S. - M5x0.8",
              "currentPrice": 8.48,
              "unitPrice": 0.17,
              "inchesPrice": 0.19
            },
            {
              "partNumber": "X0016",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30008",
              "description": "ROD SEAL",
              "currentPrice": 75.62,
              "unitPrice": 0.15,
              "inchesPrice": 0.16
            },
            {
              "partNumber": "X0017",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30009-1",
              "description": "SLEEVE SEAL",
              "currentPrice": 77.29,
              "unitPrice": 0.15,
              "inchesPrice": 0.16
            },
            {
              "partNumber": "X1289-00",
              "package": "1 Pkg.",
              "packageQty": 100,
              "drawing": "30872",
              "description": "SEVERE CONDITION SLEEVE SEAL",
              "currentPrice": 28.76,
              "unitPrice": 0.29,
              "inchesPrice": 0.63
            },
            {
              "partNumber": "X1289-01",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30872",
              "description": "SEVERE CONDITION SLEEVE SEAL",
              "currentPrice": 121.44,
              "unitPrice": 0.24,
              "inchesPrice": 0.25
            },
            {
              "partNumber": "X0018",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30013",
              "description": "7/16-20 B-HUB NUT",
              "currentPrice": 41.40,
              "unitPrice": 0.08,
              "inchesPrice": 0.09
            },
            {
              "partNumber": "X0019",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30016",
              "description": "ROD BEARING",
              "currentPrice": 76.73,
              "unitPrice": 0.15,
              "inchesPrice": 0.16
            },
            {
              "partNumber": "X0261",
              "package": "1 Pkg.",
              "packageQty": 500,
              "drawing": "30719-1",
              "description": "HP ROD SEAL BEARINGS",
              "currentPrice": 73.77,
              "unitPrice": 0.15,
              "inchesPrice": 0.16
            }
          ]
        }
        
      ],
   
        "4series": [
          {
            "CONDUIT": [
              {
                "pn": "X0117",
                "package": "1 Spool = 2500 FT",
                "drawing": "40292-1",
                "description": "4 SERIES HP CONDUIT",
                "packagePrice": 1620.36,
                "unitPrice": 0.65,
                "inches": 1400,
                "inchesPrice": 907.40,
                "currentPrice": 1685.17,
                "newUnitPrice": 0.67,
                "increase": 0.06
              },
              {
                "pn": "X1117",
                "package": "1 Spool = 500 FT",
                "drawing": "40292-1",
                "description": "4 SERIES HP CONDUIT",
                "packagePrice": 443.48,
                "unitPrice": null,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 461.22,
                "newUnitPrice": 0.92,
                "increase": 0.08
              },
              {
                "pn": "X0181-10",
                "package": "1 Spool = 500 FT",
                "drawing": "40290-1",
                "description": "4 SERIES HEFT CONDUIT",
                "packagePrice": 1250.80,
                "unitPrice": 2.50,
                "inches": 600,
                "inchesPrice": 1500.96,
                "currentPrice": 1300.83,
                "newUnitPrice": 2.60,
                "increase": 0.22
              }
            ],
            "CORE": [
              {
                "pn": "X0118",
                "package": "1 Spool = 2500 FT",
                "drawing": "40287-1",
                "description": "4 SERIES HP CORE",
                "packagePrice": 1364.52,
                "unitPrice": 0.55,
                "inches": 1400,
                "inchesPrice": 764.13,
                "currentPrice": 1419.10,
                "newUnitPrice": 0.57,
                "increase": 0.05
              },
              {
                "pn": "X1118",
                "package": "1 Spool = 500 FT",
                "drawing": "40287-1",
                "description": "4 SERIES HP CORE",
                "packagePrice": 387.75,
                "unitPrice": null,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 403.26,
                "newUnitPrice": 0.81,
                "increase": 0.07
              }
            ],
            "HUBS": [
              {
                "pn": "X0119",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40024-10",
                "description": "BULKHEAD HUB",
                "packagePrice": 123.10,
                "unitPrice": 2.46,
                "inches": 65,
                "inchesPrice": 160.03,
                "currentPrice": 134.42,
                "newUnitPrice": 2.69,
                "increase": 2.69
              },
              {
                "pn": "X0120",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40023-10",
                "description": "CLAMP HUB",
                "packagePrice": 46.37,
                "unitPrice": 0.93,
                "inches": 90,
                "inchesPrice": 83.47,
                "currentPrice": 48.22,
                "newUnitPrice": 0.96,
                "increase": 0.96
              },
              {
                "pn": "X0121",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40277-11",
                "description": "BC COMBO HUB",
                "packagePrice": 172.22,
                "unitPrice": 3.44,
                "inches": 80,
                "inchesPrice": 275.55,
                "currentPrice": 197.02,
                "newUnitPrice": 3.94,
                "increase": 3.94
              }
            ],
            "SLEEVES": [
              {
                "pn": "X0028",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40004-1",
                "description": "SLEEVE 1\" TRAVEL",
                "packagePrice": 66.80,
                "unitPrice": 1.34,
                "inches": 50,
                "inchesPrice": 66.80,
                "currentPrice": 69.47,
                "newUnitPrice": 1.39,
                "increase": 1.39
              },
              {
                "pn": "X0029",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40004-2",
                "description": "SLEEVE 2\" TRAVEL",
                "packagePrice": 71.22,
                "unitPrice": 1.42,
                "inches": 40,
                "inchesPrice": 56.98,
                "currentPrice": 74.07,
                "newUnitPrice": 1.48,
                "increase": 1.48
              },
              {
                "pn": "X0030",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40004-3",
                "description": "SLEEVE 3\" TRAVEL",
                "packagePrice": 77.29,
                "unitPrice": 1.55,
                "inches": 60,
                "inchesPrice": 92.75,
                "currentPrice": 80.38,
                "newUnitPrice": 1.61,
                "increase": 1.61
              },
              {
                "pn": "X0031",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40004-4",
                "description": "SLEEVE 4\" TRAVEL",
                "packagePrice": 89.98,
                "unitPrice": 1.80,
                "inches": 53,
                "inchesPrice": 95.38,
                "currentPrice": 93.58,
                "newUnitPrice": 1.87,
                "increase": 1.87
              },
              {
                "pn": "X0276-1",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40004-5",
                "description": "SLEEVE 5\" TRAVEL",
                "packagePrice": 52.45,
                "unitPrice": 2.10,
                "inches": 20,
                "inchesPrice": 41.96,
                "currentPrice": 54.55,
                "newUnitPrice": 2.18,
                "increase": 2.18
              },
              {
                "pn": "X0305-1",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40004-6",
                "description": "SLEEVE 6\" TRAVEL (Aluminum)",
                "packagePrice": 114.27,
                "unitPrice": 4.57,
                "inches": 75,
                "inchesPrice": 342.81,
                "currentPrice": 118.84,
                "newUnitPrice": 4.75,
                "increase": 4.75
              },
              {
                "pn": "X1288-00",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40004-7",
                "description": "SLEEVE 7\" TRAVEL (Aluminum)",
                "packagePrice": 293.66,
                "unitPrice": 11.75,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 305.41,
                "newUnitPrice": 12.22,
                "increase": 12.22
              }
            ],
            "RODS": [
              {
                "pn": "X0122",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40288-1",
                "description": "ROD 1\" TRAVEL",
                "packagePrice": 98.26,
                "unitPrice": 1.97,
                "inches": 50,
                "inchesPrice": 98.26,
                "currentPrice": 102.19,
                "newUnitPrice": 2.04,
                "increase": 2.04
              },
              {
                "pn": "X0123",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40288-2",
                "description": "ROD 2\" TRAVEL",
                "packagePrice": 89.42,
                "unitPrice": 1.79,
                "inches": 25,
                "inchesPrice": 44.71,
                "currentPrice": 93.00,
                "newUnitPrice": 1.86,
                "increase": 1.86
              },
              {
                "pn": "X0124",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40288-3",
                "description": "ROD 3\" TRAVEL",
                "packagePrice": 93.29,
                "unitPrice": 1.87,
                "inches": 15,
                "inchesPrice": 27.99,
                "currentPrice": 106.72,
                "newUnitPrice": 2.13,
                "increase": 2.13
              },
              {
                "pn": "X0125",
                "package": "1 Pkg. = 50 EA",
                "drawing": "40288-4",
                "description": "ROD 4\" TRAVEL",
                "packagePrice": 104.89,
                "unitPrice": 2.10,
                "inches": 36,
                "inchesPrice": 75.52,
                "currentPrice": 109.09,
                "newUnitPrice": 2.18,
                "increase": 2.18
              },
              {
                "pn": "X0277-1",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40288-5",
                "description": "ROD 5\" TRAVEL",
                "packagePrice": 67.34,
                "unitPrice": 2.69,
                "inches": 33,
                "inchesPrice": 88.89,
                "currentPrice": 77.03,
                "newUnitPrice": 3.08,
                "increase": 3.08
              },
              {
                "pn": "X0304-1",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40288-6",
                "description": "ROD 6\" TRAVEL",
                "packagePrice": 66.30,
                "unitPrice": 2.65,
                "inches": 56,
                "inchesPrice": 148.51,
                "currentPrice": 72.40,
                "newUnitPrice": 2.90,
                "increase": 2.90
              },
              {
                "pn": "X1287-00",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40288-7",
                "description": "ROD 7\" TRAVEL",
                "packagePrice": 165.60,
                "unitPrice": 6.62,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 172.22,
                "newUnitPrice": 6.89,
                "increase": 6.89
              }
            ],
            "METRIC_RODS": [
              {
                "pn": "X1205-00",
                "package": "1 Pkg. = 25 EA",
                "drawing": "40303-2",
                "description": "METRIC ROD 2\" TRAVEL",
                "packagePrice": 100.18,
                "unitPrice": 4.01,
                "inches": 20,
                "inchesPrice": 80.14,
                "currentPrice": 104.19,
                "newUnitPrice": 4.17,
                "increase": 4.17
              },
              {
                "pn": "X1206-00",
                "package": "1 Pkg. = 25 EA",
                "drawing": "82092400",
                "description": "METRIC ROD 3\" TRAVEL",
                "packagePrice": 102.95,
                "unitPrice": 4.12,
                "inches": 6,
                "inchesPrice": 24.71,
                "currentPrice": 107.07,
                "newUnitPrice": 4.28,
                "increase": 4.28
              },
              {
                "pn": "X1207-00",
                "package": "1 Pkg. = 25 EA",
                "drawing": "82092401",
                "description": "METRIC ROD 4\" TRAVEL",
                "packagePrice": 136.96,
                "unitPrice": 5.48,
                "inches": 13,
                "inchesPrice": 71.22,
                "currentPrice": 156.68,
                "newUnitPrice": 6.27,
                "increase": 6.27
              },
              {
                "pn": "X1208-00",
                "package": "1 Pkg. = 25 EA",
                "drawing": "82092402",
                "description": "METRIC ROD 5\" TRAVEL",
                "packagePrice": 106.54,
                "unitPrice": 4.26,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 178.24,
                "newUnitPrice": 7.13,
                "increase": 7.13
              }
            ],
            "HARDWARE": [
              {
                "pn": "X0036",
                "package": "1 Pkg. = 500 EA",
                "drawing": "30072",
                "description": "LOCKWASHER (B-HUB)",
                "packagePrice": 48.03,
                "unitPrice": 0.10,
                "inches": 900,
                "inchesPrice": 86.45,
                "currentPrice": 49.95,
                "newUnitPrice": 0.10
              },
              {
                "pn": "X0037",
                "package": "1 Pkg. = 500 EA",
                "drawing": "40007",
                "description": "1/4-28 ROD NUT",
                "packagePrice": 22.64,
                "unitPrice": 0.05,
                "inches": 600,
                "inchesPrice": 27.17,
                "currentPrice": 23.55,
                "newUnitPrice": 0.05
              },
              {
                "pn": "X1258-00",
                "package": "1 Pkg. = 50 EA",
                "drawing": "98204073",
                "description": "Metric Rod Nut: S.S. - M6 x 1.0",
                "packagePrice": 9.17,
                "unitPrice": 0.18,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 10.19,
                "newUnitPrice": 0.20
              },
              {
                "pn": "X0038",
                "package": "1 Pkg. = 500 EA",
                "drawing": "40008",
                "description": "ROD SEAL",
                "packagePrice": 137.62,
                "unitPrice": 0.28,
                "inches": 510,
                "inchesPrice": 140.37,
                "currentPrice": 143.12,
                "newUnitPrice": 0.29
              },
              {
                "pn": "X0039",
                "package": "1 Pkg. = 500 EA",
                "drawing": "40009-1",
                "description": "SLEEVE SEAL",
                "packagePrice": 88.88,
                "unitPrice": 0.18,
                "inches": 500,
                "inchesPrice": 88.88,
                "currentPrice": 92.44,
                "newUnitPrice": 0.18
              },
              {
                "pn": "X1290-00",
                "package": "1 Pkg. = 100 EA",
                "drawing": "82518100",
                "description": "SEVERE CONDITION SLEEVE SEAL",
                "packagePrice": 65.14,
                "unitPrice": 0.65,
                "inches": 0,
                "inchesPrice": 0.00,
                "currentPrice": 67.75,
                "newUnitPrice": 0.68
              },
              {
                "pn": "X1290-01",
                "package": "1 Pkg. = 500 EA",
                "drawing": "82518100",
                "description": "SEVERE CONDITION SLEEVE SEAL",
                "packagePrice": 126.96,
                "unitPrice": 0.25,
                "inches": 500,
                "inchesPrice": 126.96,
                "currentPrice": 132.04,
                "newUnitPrice": 0.26
              },
              {
                "pn": "X0040",
                "package": "1 Pkg. = 500 EA",
                "drawing": "40013",
                "description": "5/8-18 B-HUB NUT",
                "packagePrice": 102.47,
                "unitPrice": 0.20,
                "inches": 400,
                "inchesPrice": 81.98,
                "currentPrice": 111.90,
                "newUnitPrice": 0.22
              },
              {
                "pn": "X0041",
                "package": "1 Pkg. = 500 EA",
                "drawing": "40016",
                "description": "ROD BEARING",
                "packagePrice": 79.49,
                "unitPrice": 0.16,
                "inches": 100,
                "inchesPrice": 15.90,
                "currentPrice": 82.67,
                "newUnitPrice": 0.17
              },
              {
                "pn": "X0262",
                "package": "1 Pkg. = 500 EA",
                "drawing": "40324-1",
                "description": "HP ROD SEAL BEARING",
                "packagePrice": 32.03,
                "unitPrice": 0.06,
                "inches": 600,
                "inchesPrice": 38.44,
                "currentPrice": 33.31,
                "newUnitPrice": 0.07
              }
            ]
          }
          
        ],
      
        "6Series": [
          {
              "conduit": [
                {
                  "partNumber": "X0126",
                  "package": "1 Spool = 2500 FT",
                  "drawing": "60268-1",
                  "description": "6 SERIES HP CONDUIT",
                  "currentPrice": 1989.92,
                  "unitPrice": 0.80,
                  "inchesPrice": 0.07
                },
                {
                  "partNumber": "X1126",
                  "package": "1 Spool = 500 FT",
                  "drawing": "60268-1",
                  "description": "6 SERIES HP CONDUIT",
                  "currentPrice": 540.12,
                  "unitPrice": 1.08,
                  "inchesPrice": 0.09
                },
                {
                  "partNumber": "X0182-10",
                  "package": "1 Spool = 500 FT",
                  "drawing": "60271-1",
                  "description": "6 SERIES HEFT CONDUIT",
                  "currentPrice": 903.50,
                  "unitPrice": 1.81,
                  "inchesPrice": 0.16
                }
              ],
              "core": [
                {
                  "partNumber": "X0127",
                  "package": "1 Spool = 2500 FT",
                  "drawing": "60252-1",
                  "description": "6 SERIES HP CORE",
                  "currentPrice": 1762.50,
                  "unitPrice": 0.71,
                  "inchesPrice": 0.06
                },
                {
                  "partNumber": "X1127",
                  "package": "1 Spool = 500 FT",
                  "drawing": "60252-1",
                  "description": "6 SERIES HP CORE",
                  "currentPrice": 466.21,
                  "unitPrice": 0.93,
                  "inchesPrice": 0.08
                }
              ],
              "hubs": [
                {
                  "partNumber": "X0128",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60024-10",
                  "description": "BULKHEAD HUB",
                  "currentPrice": 135.78,
                  "unitPrice": 2.72
                },
                {
                  "partNumber": "X0129",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60023-10",
                  "description": "CLAMP HUB",
                  "currentPrice": 90.53,
                  "unitPrice": 1.81
                },
                {
                  "partNumber": "X0130",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60247-11",
                  "description": "BC COMBO HUB",
                  "currentPrice": 324.57,
                  "unitPrice": 6.49
                }
              ],
              "sleeves": [
                {
                  "partNumber": "X0047",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60004-1",
                  "description": "SLEEVE 1\" TRAVEL",
                  "currentPrice": 79.49,
                  "unitPrice": 1.59
                },
                {
                  "partNumber": "X0048",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60004-2",
                  "description": "SLEEVE 2\" TRAVEL",
                  "currentPrice": 81.69,
                  "unitPrice": 1.63
                },
                {
                  "partNumber": "X0049",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60004-3",
                  "description": "SLEEVE 3\" TRAVEL",
                  "currentPrice": 92.73,
                  "unitPrice": 1.85
                },
                {
                  "partNumber": "X0050",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60004-4",
                  "description": "SLEEVE 4\" TRAVEL",
                  "currentPrice": 107.64,
                  "unitPrice": 2.15
                },
                {
                  "partNumber": "X0278-1",
                  "package": "1 Pkg = 25 EA",
                  "drawing": "60004-5",
                  "description": "SLEEVE 5\" TRAVEL",
                  "currentPrice": 59.62,
                  "unitPrice": 2.38
                }
              ],
              "rods": [
                {
                  "partNumber": "X0131",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60275-1",
                  "description": "ROD 1\" TRAVEL",
                  "currentPrice": 151.25,
                  "unitPrice": 3.03
                },
                {
                  "partNumber": "X0132",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60275-2",
                  "description": "ROD 2\" TRAVEL",
                  "currentPrice": 124.21,
                  "unitPrice": 2.48
                },
                {
                  "partNumber": "X0133",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60275-3",
                  "description": "ROD 3\" TRAVEL",
                  "currentPrice": 143.52,
                  "unitPrice": 2.87
                },
                {
                  "partNumber": "X0134",
                  "package": "1 Pkg = 50 EA",
                  "drawing": "60275-4",
                  "description": "ROD 4\" TRAVEL",
                  "currentPrice": 180.51,
                  "unitPrice": 3.61
                },
                {
                  "partNumber": "X0279-1",
                  "package": "1 Pkg = 25 EA",
                  "drawing": "60275-5",
                  "description": "ROD 5\" TRAVEL",
                  "currentPrice": 113.17,
                  "unitPrice": 4.53
                }
              ],
              "hardware": [
                {
                  "partNumber": "X0055",
                  "package": "1 Pkg = 500 EA",
                  "drawing": "10178",
                  "description": "LOCKWASHERS (B-HUB)",
                  "currentPrice": 136.34,
                  "unitPrice": 0.27
                },
                {
                  "partNumber": "X0056",
                  "package": "1 Pkg = 500 EA",
                  "drawing": "82507108",
                  "description": "5/16-24 ROD NUT",
                  "currentPrice": 35.88,
                  "unitPrice": 0.07
                },
                {
                  "partNumber": "X0057",
                  "package": "1 Pkg = 500 EA",
                  "drawing": "60008",
                  "description": "ROD SEAL",
                  "currentPrice": 99.36,
                  "unitPrice": 0.20
                },
                {
                  "partNumber": "X0058",
                  "package": "1 Pkg = 500 EA",
                  "drawing": "60009-1",
                  "description": "SLEEVE SEAL",
                  "currentPrice": 93.63,
                  "unitPrice": 0.19
                },
                {
                  "partNumber": "X0059",
                  "package": "1 Pkg = 500 EA",
                  "drawing": "60013",
                  "description": "11/16-16 B-HUB NUT",
                  "currentPrice": 155.65,
                  "unitPrice": 0.31
                }
              ]
          }
        ],
        // "8Series": [
        //   { "partNumber": "W5M2X", "partName": "conduit", "description": "8-Series Conduit", "unitPrice": 8.20 },
        //   { "partNumber": "C9B4T", "partName": "core", "description": "8-Series Inner Core Wire", "unitPrice": 5.95 },
        //   { "partNumber": "H7P3J", "partName": "bulkheads", "description": "8-Series Bulkhead Fittings", "unitPrice": 5.60 },
        //   { "partNumber": "T4L8Q", "partName": "clamps", "description": "8-Series Mounting Clamps", "unitPrice": 3.40 },
        //   { "partNumber": "S1D6W", "partName": "nuts", "description": "8-Series Cable Nuts", "unitPrice": 1.20 },
        //   { "partNumber": "F8K2M", "partName": "washers", "description": "8-Series Washers", "unitPrice": 0.75 },
        //   { "partNumber": "M3R9Z", "partName": "rods", "description": "8-Series Push Rods", "unitPrice": 6.90 },
        //   { "partNumber": "L6V7B", "partName": "seals", "description": "8-Series Rubber Seals", "unitPrice": 1.90 },
        //   { "partNumber": "P2X4H", "partName": "bearings", "description": "8-Series End Bearings", "unitPrice": 4.95 },
        //   { "partNumber": "D9S5C", "partName": "sleeves", "description": "8-Series Cable Sleeves", "unitPrice": 2.40 }
        // ]

      
    }
  },

  "hoses": {
    "standard": [
      { "partNumber": "4", "description": "1/4 inch Hydraulic Hose", "unitPrice": 0.61 },
      { "partNumber": "6", "description": "3/8 inch Hydraulic Hose", "unitPrice": 0.74 },
      { "partNumber": "8", "description": "1/2 inch Hydraulic Hose", "unitPrice": 0.93 },
      { "partNumber": "10", "description": "5/8 inch Hydraulic Hose", "unitPrice": 1.00 },
      { "partNumber": "12", "description": "3/4 inch Hydraulic Hose", "unitPrice": 1.33 },
      { "partNumber": "16", "description": "1 inch Hydraulic Hose", "unitPrice": 1.70 }
    ],
    "highPressure": [
      { "partNumber": "4", "description": "1/4 inch Hydraulic Hose", "unitPrice": 0.92 },
      { "partNumber": "6", "description": "3/8 inch Hydraulic Hose", "unitPrice": 1.11 },
      { "partNumber": "8", "description": "1/2 inch Hydraulic Hose", "unitPrice": 1.25 },
      { "partNumber": "10", "description": "5/8 inch Hydraulic Hose", "unitPrice": 1.46 },
      { "partNumber": "12", "description": "3/4 inch Hydraulic Hose", "unitPrice": 2.00 },
      { "partNumber": "16", "description": "1 inch Hydraulic Hose", "unitPrice": 2.55 }
    ]
  }
};



const Price = () => {
  // const [hardwareList, setHardwareList] = useState([
  //   { part: "", quantity: "", price: "" }
  // ]);

  // const addRow = () => {
  //   setHardwareList([...hardwareList, { part: "", quantity: "", price: "" }]);
  // };

  const [parts, setParts] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [newPart, setNewPart] = useState({
    name: "",
    quantity: 1,
    unitPrice: 0,
  });

  const handleAddPart = () => {
    setParts([...parts, newPart]);
    setShowModal(false);
    setNewPart({ name: "", quantity: 1, unitPrice: 0 });
  };

  // const handleHardwareChange = (index, field, value) => {
  //   const updated = [...hardwareList];
  //   updated[index][field] = value;
  //   setHardwareList(updated);
  // };

 
  

  const {
    loading,
    error,
  } = useOrders();

  const { token } = useAuth();

  // const user = JSON.parse(localStorage.getItem("user"));



  const [orderFormData, setOrderFormData] = useState({
    partName: "",
    quantity: 1,
    vendor: "",
    status: "New Order",
    comments: "",
  });

  const [pushPullFormData, setPushPullFormData] = useState({
    cableType: "",
    cableSeries: "",
    cableTravel: "",
    conduitFitting1: "",
    conduitFitting2: "",
    cableLenght: "",
  });


 const [hoseFormData, setHoseFormData] = useState({
  hoseType: "",       // 'standard' or 'highPressure'
  hosePartNumber: "", // selected part number from hose list
});


// AUTO-GENERATE HARDWARE BASED ON PART NUMBER
const generatePartsFromPartNumber = (partNumber) => {
  if (!partNumber || partNumber.length < 7) return [];

  const end1 = partNumber[4]; // 3rd digit in example 4233
  const end2 = partNumber[5];

  const partsList = [];

  const addPart = (partName) => {
    partsList.push({
      partName,
      partNumber: partName.toUpperCase(),
      quantity: 1,
      unitPrice: 0,
    });
  };

  const mapEndType = (end) => {
    if (end === "2") {
      addPart("bulkhead");
      addPart("nut");
      addPart("washer");
    }
    if (end === "3") {
      addPart("clamp");
    }
    if (end === "5") {
      addPart("bulkhead");
      addPart("clamp");
    }
  };

  mapEndType(end1);
  mapEndType(end2);

  return partsList;
};



  // useEffect(() => {
  //   const series = pushPullFormData.cableSeries;
  
  //   if (series && priceData.pushpull.pushPullCables[`${series}Series`]) {
  //     setParts(priceData.pushpull.pushPullCables[`${series}Series`]);
  //   }
  // }, [pushPullFormData.cableSeries]);

  useEffect(() => {
    const fullPartNumber =
      `${pushPullFormData.cableType}${pushPullFormData.cableSeries}${pushPullFormData.cableTravel}${pushPullFormData.conduitFitting1}${pushPullFormData.conduitFitting2}${pushPullFormData.cableLenght}`;
  
    if (fullPartNumber.length > 6) {
      const autoParts = generatePartsFromPartNumber(fullPartNumber);
      setParts(autoParts);
    }
  }, [pushPullFormData]);
  

  useEffect(() => {
    if (hoseFormData.hoseType && hoseFormData.hosePartNumber) {
      const selectedHose = priceData.hoses[hoseFormData.hoseType].find(
        (h) => h.partNumber === hoseFormData.hosePartNumber
      );
      setParts([
        {
          partName: selectedHose.description,
          partNumber: selectedHose.partNumber,
          quantity: 1,
          unitPrice: selectedHose.unitPrice,
        },
      ]);
    } else {
      setParts([]);
    }
  }, [hoseFormData.hoseType, hoseFormData.hosePartNumber]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Madison Generator - Pricing</h3>
{/* 
        <div className="rightsidebar-button" onClick={handleShowAddModal}>
          <HugeiconsIcon
            icon={Add01Icon}
            size={16}
            color="#ffffff"
            strokeWidth={3}
          />
          <p>New Part Number</p>
        </div> */}
      </div>

      <div className="order-page-title">
        <h3>Price List</h3>
      </div>


      <div className="custom-line no-margin"></div>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="order-table-container">
          <div className="price">
            <div className="price-type">
              <form className="custom-form">
                <div className="form-group">
                  <label htmlFor="status">Type of Cable</label>
                  <select
                    id="status"
                    name="status"
                    className="input-field"
                    value={orderFormData.status}
                    onChange={handleChange}
                  >
                    <option>Push-pull cable</option>
                    <option>T-handle cable</option>
                    <option>Positive lock cable</option>
                    <option>Tension cable</option>
                    <option>PTO cable</option>
                    <option>RVO cable</option>
                    <option>RVC cable</option>
                    <option>Hydraulic Hose</option>
                    <option>Modulator cable</option>
                    <option>Bow-fishing cable</option>
                    <option>Custom cable</option>
                  </select>
                </div>
                {orderFormData.status === "Push-pull cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="cableType"
                          name="cableType"
                          className="input-field"
                          value={pushPullFormData.cableType}
onChange={(e)=>setPushPullFormData({...pushPullFormData, cableType: e.target.value})}

                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="cableSeries"
                          name="cableSeries"
                          className="input-field"
                          value={pushPullFormData.cableSeries}
                          onChange={(e)=>setPushPullFormData({...pushPullFormData, cableSeries: e.target.value})}
                          
                        />
                        <input
                          type="text"
                          id="cableTravel"
                          name="cableTravel"
                          className="input-field"
                          value={pushPullFormData.cableTravel}
onChange={(e)=>setPushPullFormData({...pushPullFormData, cableTravel: e.target.value})}

                        />
                        <input
    type="text"
    className="input-field"
    value={pushPullFormData.conduitFitting1}
    onChange={(e) =>
      setPushPullFormData({
        ...pushPullFormData,
        conduitFitting1: e.target.value,
      })
    }
  />

  <input
    type="text"
    className="input-field"
    value={pushPullFormData.conduitFitting2}
    onChange={(e) =>
      setPushPullFormData({
        ...pushPullFormData,
        conduitFitting2: e.target.value,
      })
    }
  />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                      <input
    type="text"
    className="input-field"
    value={pushPullFormData.cableLenght}
    onChange={(e) =>
      setPushPullFormData({
        ...pushPullFormData,
        cableLenght: e.target.value,
      })
    }
  />
                        
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part Name</th>
                        <th>Part Number</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
  {parts.length > 0 ? (
    parts.map((part, index) => (
      <tr key={index}>
        <td>{part.partName}</td>
        <td>{part.partNumber}</td>
        <td>{part.quantity}</td>
        <td>${part.unitPrice}</td>
        <td>${(part.quantity * part.unitPrice).toFixed(2)}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td className="text-center no-parts" colSpan="5">
        No parts added yet
      </td>
    </tr>
  )}
</tbody>

                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                 {orderFormData.status === "T-handle cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                           value="0"
                           disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="3"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="7"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                      
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                 {orderFormData.status === "Positive lock cable" && (
                <div className="control-cables">

                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                         <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="8"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                 {orderFormData.status === "Tension cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="5"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                 {orderFormData.status === "PTO cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="3"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="5"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                       
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                 {orderFormData.status === "RVO cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="4"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="5"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="6"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                      {orderFormData.status === "RVC cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="1"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="4"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="5"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                     {orderFormData.status === "Modulator cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.length > 0 ? (
                        parts.map((part, index) => (
                          <tr key={index}>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>${part.unitPrice}</td>
                            <td>
                              ${(part.quantity * part.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="text-center no-parts" colSpan="4">
                            No parts added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
               
                     {orderFormData.status === "Bow-fishing cable" && (
                <div className="control-cables">

            
                <div className="form-group">
                  <label htmlFor="partName">Part Number</label>
                  <div className="part-number">
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableType">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="1"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                      </div>
                      <h3>Cable Type</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cable-details">
                      <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="0"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="8"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="8"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="2"
                          disabled
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value="2"
                          disabled
                        />
                      </div>
                      <h3>Cable Details</h3>
                    </div>
                    <div className="part-number-cableType-container">
                      <div className="part-number-cableLength">
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          id="partName"
                          name="partName"
                          className="input-field"
                          value={orderFormData.partName}
                          onChange={handleChange}
                        />
                      </div>
                      <h3>Cable Length</h3>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="vendor">Hardware</label>

                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Part number</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
               <tbody>
  {parts.length > 0 ? (
    parts.map((part, index) => (
      <tr key={index}>
        <td>{part.partName}</td>
        <td>{part.partNumber}</td>
        <td>{part.quantity}</td>
        <td>${part.unitPrice}</td>
        <td>${(part.quantity * part.unitPrice).toFixed(2)}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td className="text-center no-parts" colSpan="4">
        No parts added yet
      </td>
    </tr>
  )}
</tbody>

                  </table>

                  <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                )}
                
                {orderFormData.status === "Hydraulic Hose" && (
  <div className="hydraulic-hose">
  {/* Hose Type Selector */}
  <div className="form-group">
    <label htmlFor="hoseType">Hose Type</label>
    <select
      id="hoseType"
      name="hoseType"
      className="input-field"
      value={hoseFormData.hoseType}
      onChange={(e) =>
        setHoseFormData({ hoseType: e.target.value, hosePartNumber: "" })
      }
    >
      <option value="">Select Hose Type</option>
      <option value="standard">Standard Hose</option>
      <option value="highPressure">High Pressure Hose</option>
    </select>
  </div>

  {/* Hose Part Number Selector */}
  <div className="form-group">
    <label htmlFor="hosePartNumber">Part Number</label>
    <select
      id="hosePartNumber"
      name="hosePartNumber"
      className="input-field"
      value={hoseFormData.hosePartNumber}
      onChange={(e) =>
        setHoseFormData({ ...hoseFormData, hosePartNumber: e.target.value })
      }
      disabled={!hoseFormData.hoseType} // disabled until type is selected
    >
      <option value="">Select Part Number</option>
      {hoseFormData.hoseType &&
        priceData.hoses[hoseFormData.hoseType].map((hose) => (
          <option key={hose.partNumber} value={hose.partNumber}>
            {hose.partNumber} - {hose.description}
          </option>
        ))}
    </select>
  </div>

  {/* Parts Table */}
  <div className="form-group">
    <label htmlFor="vendor">Parts</label>
    <table className="parts-table">
      <thead>
        <tr>
          <th>Part</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {parts.length > 0 ? (
          parts.map((part, index) => (
            <tr key={index}>
              <td>{part.partName}</td>
              <td>{part.quantity}</td>
              <td>${part.unitPrice}</td>
              <td>${(part.quantity * part.unitPrice).toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="text-center no-parts" colSpan="4">
              No parts added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
    <button
                    className="add-part-btn"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add Part
                  </button>

                  {/* Modal below table */}
                  {showModal && (
                    <div className="modal-box">

                      <div className="modal-field">
                        <label>Part Name</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={newPart.name}
                          onChange={(e) =>
                            setNewPart({ ...newPart, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.quantity}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          className="modal-input"
                          value={newPart.unitPrice}
                          onChange={(e) =>
                            setNewPart({
                              ...newPart,
                              unitPrice: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          className="modal-cancel"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button className="modal-save" onClick={handleAddPart}>
                          Save
                        </button>
                      </div>
                    </div>
                  )}
  </div>
</div>

)}


                <div className="form-group">
                  <label htmlFor="status">Total</label>
                 <h1>$100</h1>
                </div>
        
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Price;
