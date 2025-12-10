export interface PathNode {
  id: string;
  pos: { x: number; y: number; z: number };
  neighbors: string[];
  isIntersection?: boolean;
}

export const PATH_NODES: Record<string, PathNode> = {
  "A": { id: "A", pos: { x: 1484, y: 64, z: -5802 }, neighbors: ["B"] }, // 1484 64 -5802
  "B": { id: "B", pos: { x: 1479, y: 64, z: -5794 }, neighbors: ["A", "C"] }, // 1479 64 -5794
  "C": { id: "C", pos: { x: 1477, y: 64, z: -5777 }, neighbors: ["B", "D"] }, // 1477 64 -5777
  "D": { id: "D", pos: { x: 1479, y: 64, z: -5760 }, neighbors: ["C", "E"] }, // 1479 64 -5760
  "E": { id: "E", pos: { x: 1480, y: 64, z: -5744 }, neighbors: ["D", "F"] }, // 1480 64 -5744
  "F": { id: "F", pos: { x: 1480, y: 64, z: -5732 }, neighbors: ["E", "G"] }, // 1480 63 -5732
  "G": { id: "G", pos: { x: 1471, y: 64, z: -5723 }, neighbors: ["F", "H"] }, // 1471 63 -5723
  "H": { id: "H", pos: { x: 1460, y: 64, z: -5719 }, neighbors: ["G", "I", "J"], isIntersection: true }, // 1460 63 -5719
  "I": { id: "I", pos: { x: 1461, y: 64, z: -5728 }, neighbors: ["H", "J"] }, // 1461 63 -5728
  "J": { id: "J", pos: { x: 1457, y: 64, z: -5713 }, neighbors: ["H", "K"] }, // 1457 63 -5713
  "K": { id: "K", pos: { x: 1454, y: 66, z: -5702 }, neighbors: ["J", "L"] }, // Former: A | 1454 66 -5702
  "L": { id: "L", pos: { x: 1455, y: 66, z: -5688 }, neighbors: ["K", "M", "GG"], isIntersection: true }, // Former: B | 1455 66 -5688
  "M": { id: "M", pos: { x: 1456, y: 66, z: -5681 }, neighbors: ["L", "N"] }, // Former: C | 1456 66 -5681
  "N": { id: "N", pos: { x: 1462, y: 66, z: -5672 }, neighbors: ["M", "O"] }, // Former: D | 1462 66 -5672
  "O": { id: "O", pos: { x: 1471, y: 66, z: -5663 }, neighbors: ["N", "P"] }, // Former: E | 1471 66 -5663
  "P": { id: "P", pos: { x: 1470, y: 66, z: -5651 }, neighbors: ["O", "Q"] }, // Former: F | 1470 66 -5651
  "Q": { id: "Q", pos: { x: 1464, y: 66, z: -5636 }, neighbors: ["R", "P"], isIntersection: true }, // Former: G | 1464 66 -5636
  "R": { id: "R", pos: { x: 1469, y: 66, z: -5630 }, neighbors: ["Q", "S"] }, // Former: H | 1469 66 -5630
  "S": { id: "S", pos: { x: 1480, y: 66, z: -5603 }, neighbors: ["R", "T"] }, // Former: I | 1480 66 -5603
  "T": { id: "T", pos: { x: 1484, y: 66, z: -5585 }, neighbors: ["U", "Y", "S"], isIntersection: true }, // Former: J | 1484 66 -5585
  "U": { id: "U", pos: { x: 1491, y: 66, z: -5587 }, neighbors: ["T", "V"] }, // Former: K | 1491 66 -5587
  "V": { id: "V", pos: { x: 1520, y: 66, z: -5600 }, neighbors: ["U", "W"] }, // Former: L | 1520 66 -5600
  "W": { id: "W", pos: { x: 1533, y: 66, z: -5611 }, neighbors: ["V", "X"] }, // Former: M | 1533 66 -5611
  "X": { id: "X", pos: { x: 1531, y: 66, z: -5633 }, neighbors: ["W"] }, // Former: N | 1531 66 -5633
  "Y": { id: "Y", pos: { x: 1485, y: 66, z: -5577 }, neighbors: ["T", "Z"] }, // Former: O | 1485 66 -5577
  "Z": { id: "Z", pos: { x: 1487, y: 66, z: -5563 }, neighbors: ["Y", "AA"] }, // Former: P | 1487 66 -5563
  "AA": { id: "AA", pos: { x: 1489, y: 66, z: -5543 }, neighbors: ["Z", "AB"] }, // Former: Q | 1489 66 -5543
  "AB": { id: "AB", pos: { x: 1492, y: 66, z: -5536 }, neighbors: ["AA", "AC"] }, // Former: R | 1492 66 -5536
  "AC": { id: "AC", pos: { x: 1493, y: 66, z: -5527 }, neighbors: ["AB", "AD", "AQ"], isIntersection: true }, // Former: S | 1493 66 -5527
  "AD": { id: "AD", pos: { x: 1501, y: 66, z: -5528 }, neighbors: ["AC", "AE"] }, // Former: T | 1501 66 -5528
  "AE": { id: "AE", pos: { x: 1517, y: 66, z: -5533 }, neighbors: ["AD", "AF"] }, // Former: U | 1517 66 -5533
  "AF": { id: "AF", pos: { x: 1528, y: 66, z: -5534 }, neighbors: ["AE", "AG", "AI"], isIntersection: true }, // Former: V | 1528 66 -5534
  "AG": { id: "AG", pos: { x: 1529, y: 66, z: -5542 }, neighbors: ["AF", "AH"] }, // Former: W | 1529 66 -5542
  "AH": { id: "AH", pos: { x: 1532, y: 66, z: -5547 }, neighbors: ["AG", "AI"] }, // Former: X | 1532 66 -5547
  "AI": { id: "AI", pos: { x: 1533, y: 66, z: -5532 }, neighbors: ["AH", "AJ", "AF"] }, // Former: Y | 1533 66 -5532
  "AJ": { id: "AJ", pos: { x: 1540, y: 66, z: -5532 }, neighbors: ["AI", "AK"] }, // Former: Z | 1540 66 -5532
  "AK": { id: "AK", pos: { x: 1551, y: 66, z: -5535 }, neighbors: ["AJ", "AL"] }, // Former: ZA | 1551 66 -5535
  "AL": { id: "AL", pos: { x: 1575, y: 66, z: -5540 }, neighbors: ["AK", "AM"] }, // Former: ZB | 1575 66 -5540
  "AM": { id: "AM", pos: { x: 1593, y: 66, z: -5544 }, neighbors: ["AL", "AN"] }, // Former: ZC | 1593 66 -5544
  "AN": { id: "AN", pos: { x: 1606, y: 66, z: -5551 }, neighbors: ["AM", "AO"] }, // Former: ZD | 1606 66 -5551
  "AO": { id: "AO", pos: { x: 1619, y: 66, z: -5562 }, neighbors: ["AN", "AP"] }, // Former: ZE | 1619 66 -5562
  "AP": { id: "AP", pos: { x: 1619, y: 66, z: -5576 }, neighbors: ["AO"] }, // Former: ZF | 1619 66 -5576
  "AQ": { id: "AQ", pos: { x: 1487, y: 66, z: -5526 }, neighbors: ["AC", "AR"] }, // Former: ZG | 1487 66 -5526
  "AR": { id: "AR", pos: { x: 1479, y: 66, z: -5525 }, neighbors: ["AQ", "AS"] }, // Former: ZH | 1479 66 -5525
  "AS": { id: "AS", pos: { x: 1469, y: 66, z: -5519 }, neighbors: ["AR", "AT", "AU"], isIntersection: true }, // Former: ZI | 1469 66 -5519
  "AT": { id: "AT", pos: { x: 1461, y: 66, z: -5512 }, neighbors: ["AS"] }, // Former: ZJ | 1461 66 -5512
  "AU": { id: "AU", pos: { x: 1463, y: 66, z: -5524 }, neighbors: ["AS", "AV"] }, // Former: ZL | 1463 66 -5524
  "AV": { id: "AV", pos: { x: 1450, y: 66, z: -5525 }, neighbors: ["AU", "AW"] }, // Former: ZM | 1450 66 -5525
  "AW": { id: "AW", pos: { x: 1439, y: 66, z: -5525 }, neighbors: ["AV", "AX"] }, // Former: ZN | 1439 66 -5525
  "AX": { id: "AX", pos: { x: 1431, y: 66, z: -5521 }, neighbors: ["AW", "AY", "GS"], isIntersection: true }, // Former: ZO | 1431 66 -5521
  "AY": { id: "AY", pos: { x: 1422, y: 66, z: -5516 }, neighbors: ["AX", "AZ"] }, // Former: ZP | 1422 66 -5516
  "AZ": { id: "AZ", pos: { x: 1410, y: 66, z: -5502 }, neighbors: ["AY", "BA"] }, // Former: ZQ | 1410 66 -5502
  "BA": { id: "BA", pos: { x: 1399, y: 66, z: -5486 }, neighbors: ["AZ", "BB"] }, // Former: ZR | 1399 66 -5486
  "BB": { id: "BB", pos: { x: 1393, y: 66, z: -5475 }, neighbors: ["BA", "BC", "BH"], isIntersection: true }, // Former: ZS | 1393 66 -5475
  "BC": { id: "BC", pos: { x: 1398, y: 66, z: -5473 }, neighbors: ["BB", "BD"] }, // Former: ZT | 1398 66 -5473
  "BD": { id: "BD", pos: { x: 1406, y: 66, z: -5472 }, neighbors: ["BC", "BE"] }, // Former: ZU | 1406 66 -5472
  "BE": { id: "BE", pos: { x: 1422, y: 66, z: -5468 }, neighbors: ["BD", "BF"] }, // Former: ZV | 1422 66 -5468
  "BF": { id: "BF", pos: { x: 1435, y: 65, z: -5463 }, neighbors: ["BE", "BG"] }, // Former: ZW | 1435 65 -5463
  "BG": { id: "BG", pos: { x: 1452, y: 65, z: -5449 }, neighbors: ["BF", "BH"] }, // Former: ZX | 1452 65 -5449
  "BH": { id: "BH", pos: { x: 1389, y: 66, z: -5468 }, neighbors: ["BB", "BI"] }, // Former: ZY | 1389 66 -5468
  "BI": { id: "BI", pos: { x: 1386, y: 66, z: -5461 }, neighbors: ["BH", "BJ", "BK"], isIntersection: true }, // Former: ZZ | 1386 66 -5461
  "BJ": { id: "BJ", pos: { x: 1387, y: 66, z: -5457 }, neighbors: ["BI", "BK"] }, // Former: ZZA | 1387 66 -5457
  "BK": { id: "BK", pos: { x: 1378, y: 66, z: -5462 }, neighbors: ["BJ", "BL"] }, // Former: ZZB | 1378 66 -5462
  "BL": { id: "BL", pos: { x: 1369, y: 66, z: -5467 }, neighbors: ["BK", "BM", "HA"], isIntersection: true }, // Former: ZZC | 1369 66 -5467
  "BM": { id: "BM", pos: { x: 1365, y: 66, z: -5462 }, neighbors: ["BL", "BN"] }, // Former: ZZD | 1365 66 -5462
  "BN": { id: "BN", pos: { x: 1356, y: 66, z: -5452 }, neighbors: ["BM", "BO"] }, // Former: ZZE | 1356 66 -5452
  "BO": { id: "BO", pos: { x: 1354, y: 66, z: -5442 }, neighbors: ["BN", "BP"] }, // Former: ZZF | 1354 66 -5442
  "BP": { id: "BP", pos: { x: 1355, y: 66, z: -5434 }, neighbors: ["BO", "BQ"] }, // Former: ZZG | 1355 66 -5434
  "BQ": { id: "BQ", pos: { x: 1353, y: 65, z: -5426 }, neighbors: ["BP", "BR"] }, // Former: ZZH | 1353 65 -5426
  "BR": { id: "BR", pos: { x: 1340, y: 65, z: -5413 }, neighbors: ["BQ", "BS", "BV"], isIntersection: true }, // Former: ZZI | 1340 65 -5413
  "BS": { id: "BS", pos: { x: 1338, y: 65, z: -5407 }, neighbors: ["BR", "BT"] }, // Former: ZZJ | 1338 65 -5407
  "BT": { id: "BT", pos: { x: 1330, y: 65, z: -5400 }, neighbors: ["BS", "BU"] }, // Former: ZZK | 1330 65 -5400
  "BU": { id: "BU", pos: { x: 1315, y: 65, z: -5382 }, neighbors: ["BT", "BV"] }, // Former: ZZL | 1315 65 -5382
  "BV": { id: "BV", pos: { x: 1333, y: 65, z: -5415 }, neighbors: ["BU", "BW"] }, // Former: ZZM | 1333 65 -5415
  "BW": { id: "BW", pos: { x: 1325, y: 66, z: -5416 }, neighbors: ["BV", "BX"] }, // Former: ZZN | 1325 66 -5416
  "BX": { id: "BX", pos: { x: 1312, y: 66, z: -5420 }, neighbors: ["BW", "BY"] }, // Former: ZZO | 1312 66 -5420
  "BY": { id: "BY", pos: { x: 1296, y: 66, z: -5423 }, neighbors: ["BX", "BZ"] }, // Former: ZZP | 1296 66 -5423
  "BZ": { id: "BZ", pos: { x: 1268, y: 66, z: -5426 }, neighbors: ["BY", "CA"] }, // Former: ZZQ | 1268 66 -5426
  "CA": { id: "CA", pos: { x: 1252, y: 66, z: -5423 }, neighbors: ["BZ", "CB"] }, // Former: ZZR | 1252 66 -5423
  "CB": { id: "CB", pos: { x: 1234, y: 66, z: -5420 }, neighbors: ["CA", "CC", "HH"], isIntersection: true }, // Former: ZZS | 1234 66 -5420
  "CC": { id: "CC", pos: { x: 1236, y: 65, z: -5413 }, neighbors: ["CB", "CD"] }, // Former: ZZT | 1236 65 -5413
  "CD": { id: "CD", pos: { x: 1243, y: 65, z: -5396 }, neighbors: ["CC", "CE"] }, // Former: ZZU | 1243 65 -5396
  "CE": { id: "CE", pos: { x: 1245, y: 65, z: -5382 }, neighbors: ["CD", "CF", "CK"], isIntersection: true }, // Former: ZZV | 1245 65 -5382
  "CF": { id: "CF", pos: { x: 1245, y: 65, z: -5376 }, neighbors: ["CE", "CG"] }, // Former: ZZW | 1245 65 -5376
  "CG": { id: "CG", pos: { x: 1244, y: 65, z: -5367 }, neighbors: ["CF", "CH"] }, // Former: ZZX | 1244 65 -5367
  "CH": { id: "CH", pos: { x: 1242, y: 65, z: -5353 }, neighbors: ["CG", "CI"] }, // Former: ZZY | 1242 65 -5353
  "CI": { id: "CI", pos: { x: 1235, y: 65, z: -5334 }, neighbors: ["CH", "CJ"] }, // Former: ZZZ | 1235 65 -5334
  "CJ": { id: "CJ", pos: { x: 1222, y: 65, z: -5317 }, neighbors: ["CI", "CK"] }, // Former: ZZZA | 1222 65 -5317
  "CK": { id: "CK", pos: { x: 1238, y: 65, z: -5381 }, neighbors: ["CJ", "CL"] }, // Former: ZZZB | 1238 65 -5381
  "CL": { id: "CL", pos: { x: 1228, y: 65, z: -5379 }, neighbors: ["CK", "CM"] }, // Former: ZZZC | 1228 65 -5379
  "CM": { id: "CM", pos: { x: 1213, y: 65, z: -5380 }, neighbors: ["CL", "CN"], isIntersection: true }, // Former: ZZZD | 1213 65 -5380
  "CN": { id: "CN", pos: { x: 1209, y: 65, z: -5375 }, neighbors: ["CM", "CO"] }, // Former: ZZZE | 1209 65 -5375
  "CO": { id: "CO", pos: { x: 1199, y: 65, z: -5369 }, neighbors: ["CN", "CP"] }, // Former: ZZZF | 1199 65 -5369
  "CP": { id: "CP", pos: { x: 1179, y: 65, z: -5360 }, neighbors: ["CO", "CQ"] }, // Former: ZZZG | 1179 65 -5360
  "CQ": { id: "CQ", pos: { x: 1163, y: 65, z: -5359 }, neighbors: ["CP", "CR"] }, // Former: ZZZH | 1163 65 -5359
  "CR": { id: "CR", pos: { x: 1162, y: 65, z: -5353 }, neighbors: ["CQ", "CS"] }, // Former: ZZZI | 1162 65 -5353
  "CS": { id: "CS", pos: { x: 1160, y: 65, z: -5346 }, neighbors: ["CR", "CT"] }, // Former: ZZZJ | 1160 65 -5346
  "CT": { id: "CT", pos: { x: 1142, y: 65, z: -5320 }, neighbors: ["CS", "CU"] }, // Former: ZZZK | 1142 65 -5320
  "CU": { id: "CU", pos: { x: 1123, y: 65, z: -5297 }, neighbors: ["CT", "CV"] }, // Former: ZZZL | 1123 65 -5297
  "CV": { id: "CV", pos: { x: 1110, y: 65, z: -5282 }, neighbors: ["CU", "CW", "CX"], isIntersection: true }, // Former: ZZZM | 1110 65 -5282
  "CW": { id: "CW", pos: { x: 1116, y: 65, z: -5269 }, neighbors: ["CV", "CX"] }, // Former: ZZZN | 1116 65 -5269
  "CX": { id: "CX", pos: { x: 1102, y: 65, z: -5286 }, neighbors: ["CW", "CY"] }, // Former: ZZZO | 1102 65 -5286
  "CY": { id: "CY", pos: { x: 1092, y: 65, z: -5284 }, neighbors: ["CX", "CZ"] }, // Former: ZZZP | 1092 65 -5284
  "CZ": { id: "CZ", pos: { x: 1074, y: 65, z: -5283 }, neighbors: ["CY", "DA"] }, // Former: ZZZQ | 1074 65 -5283
  "DA": { id: "DA", pos: { x: 1048, y: 65, z: -5282 }, neighbors: ["CZ", "DB", "DD", "DI"], isIntersection: true }, // Former: ZZZR | 1048 65 -5282
  "DB": { id: "DB", pos: { x: 1045, y: 65, z: -5274 }, neighbors: ["DA", "DC"] }, // Former: ZZZS | 1045 65 -5274
  "DC": { id: "DC", pos: { x: 1028, y: 65, z: -5255 }, neighbors: ["DB", "DD"] }, // Former: ZZZT | 1028 65 -5255
  "DD": { id: "DD", pos: { x: 1038, y: 65, z: -5278 }, neighbors: ["DC", "DE"] }, // Former: ZZZU | 1038 65 -5278
  "DE": { id: "DE", pos: { x: 1029, y: 65, z: -5276 }, neighbors: ["DD", "DF"] }, // Former: ZZZV | 1029 65 -5276
  "DF": { id: "DF", pos: { x: 1016, y: 65, z: -5278 }, neighbors: ["DE", "DG"] }, // Former: ZZZW | 1016 65 -5278
  "DG": { id: "DG", pos: { x: 997, y: 65, z: -5287 }, neighbors: ["DF", "DH"] }, // Former: ZZZX | 997 65 -5287
  "DH": { id: "DH", pos: { x: 975, y: 65, z: -5307 }, neighbors: ["DG", "DI"] }, // Former: ZZZY | 975 65 -5307
  "DI": { id: "DI", pos: { x: 1049, y: 65, z: -5292 }, neighbors: ["DH", "DJ"] }, // Former: ZZZZ | 1049 65 -5292
  "DJ": { id: "DJ", pos: { x: 1050, y: 65, z: -5305 }, neighbors: ["DI", "DK"] }, // Former: ZZZZA | 1050 65 -5305
  "DK": { id: "DK", pos: { x: 1050, y: 65, z: -5313 }, neighbors: ["DJ", "DL"], isIntersection: true }, // Former: ZZZZB | 1050 65 -5313
  "DL": { id: "DL", pos: { x: 1050, y: 65, z: -5339 }, neighbors: ["DK", "DM"] }, // Former: ZZZZC | 1050 65 -5339
  "DM": { id: "DM", pos: { x: 1043, y: 65, z: -5342 }, neighbors: ["DL", "DN"] }, // Former: ZZZZD | 1043 65 -5342
  "DN": { id: "DN", pos: { x: 1037, y: 65, z: -5349 }, neighbors: ["DM", "DO"] }, // Former: ZZZZE | 1037 65 -5349
  "DO": { id: "DO", pos: { x: 1036, y: 65, z: -5357 }, neighbors: ["DN", "DP"] }, // Former: ZZZZF | 1036 65 -5357
  "DP": { id: "DP", pos: { x: 1022, y: 65, z: -5369 }, neighbors: ["DO", "DQ"] }, // Former: ZZZZG | 1022 65 -5369
  "DQ": { id: "DQ", pos: { x: 1006, y: 65, z: -5392 }, neighbors: ["DP", "DR"] }, // Former: ZZZZH | 1006 65 -5392
  "DR": { id: "DR", pos: { x: 999, y: 65, z: -5395 }, neighbors: ["DQ", "DS"] }, // Former: ZZZZI | 999 65 -5395
  "DS": { id: "DS", pos: { x: 1008, y: 65, z: -5400 }, neighbors: ["DR", "DT"] }, // Former: ZZZZJ | 1008 65 -5400
  "DT": { id: "DT", pos: { x: 1010, y: 65, z: -5409 }, neighbors: ["DS", "DU"] }, // Former: ZZZZK | 1010 65 -5409
  "DU": { id: "DU", pos: { x: 1024, y: 65, z: -5436 }, neighbors: ["DT", "DV"] }, // Former: ZZZZL | 1024 65 -5436
  "DV": { id: "DV", pos: { x: 1040, y: 65, z: -5453 }, neighbors: ["DU", "DW"] }, // Former: ZZZZM | 1040 65 -5453
  "DW": { id: "DW", pos: { x: 1058, y: 65, z: -5462 }, neighbors: ["DV", "DX"] }, // Former: ZZZZN | 1058 65 -5462
  "DX": { id: "DX", pos: { x: 1058, y: 65, z: -5472 }, neighbors: ["DW", "DY"] }, // Former: ZZZZO | 1058 65 -5472
  "DY": { id: "DY", pos: { x: 1066, y: 65, z: -5490 }, neighbors: ["DX", "DZ"] }, // Former: ZZZZP | 1066 65 -5490
  "DZ": { id: "DZ", pos: { x: 1067, y: 65, z: -5460 }, neighbors: ["DY", "EA"] }, // Former: ZZZZQ | 1067 65 -5460
  "EA": { id: "EA", pos: { x: 1079, y: 65, z: -5455 }, neighbors: ["DZ", "EB"] }, // Former: ZZZZR | 1079 65 -5455
  "EB": { id: "EB", pos: { x: 1094, y: 65, z: -5449 }, neighbors: ["EA", "EC"] }, // Former: ZZZZS | 1094 65 -5449
  "EC": { id: "EC", pos: { x: 1102, y: 65, z: -5448 }, neighbors: ["EB", "ED", "EO"], isIntersection: true }, // Former: ZZZZT | 1102 65 -5448
  "ED": { id: "ED", pos: { x: 1109, y: 65, z: -5444 }, neighbors: ["EC", "EE"] }, // Former: ZZZZU | 1109 65 -5444
  "EE": { id: "EE", pos: { x: 1116, y: 65, z: -5442 }, neighbors: ["ED", "EF"] }, // Former: ZZZZV | 1116 65 -5442
  "EF": { id: "EF", pos: { x: 1132, y: 65, z: -5435 }, neighbors: ["EE", "EG"] }, // Former: ZZZZW | 1132 65 -5435
  "EG": { id: "EG", pos: { x: 1147, y: 65, z: -5422 }, neighbors: ["EH", "EF"] }, // Former: ZZZZX | 1147 65 -5422
  "EH": { id: "EH", pos: { x: 1161, y: 65, z: -5408 }, neighbors: ["EG", "EI"] }, // Former: ZZZZY | 1161 65 -5408
  "EI": { id: "EI", pos: { x: 1164, y: 65, z: -5399 }, neighbors: ["EH", "EJ"] }, // Former: ZZZZZ | 1164 65 -5399
  "EJ": { id: "EJ", pos: { x: 1163, y: 65, z: -5372 }, neighbors: ["EI", "EK"] }, // Former: ZZZZZA | 1163 65 -5372
  "EK": { id: "EK", pos: { x: 1139, y: 65, z: -5376 }, neighbors: ["EJ", "EL"], isIntersection: true }, // Former: ZZZZZB | 1139 65 -5376
  "EL": { id: "EL", pos: { x: 1059, y: 65, z: -5451 }, neighbors: ["EK", "EM"] }, // Former: ZZZZZC | 1059 65 -5451
  "EM": { id: "EM", pos: { x: 1061, y: 65, z: -5442 }, neighbors: ["EL", "EN"] }, // Former: ZZZZZD | 1061 65 -5442
  "EN": { id: "EN", pos: { x: 1055, y: 65, z: -5432 }, neighbors: ["EM", "EO"] }, // Former: ZZZZZE | 1055 65 -5432
  "EO": { id: "EO", pos: { x: 1103, y: 65, z: -5456 }, neighbors: ["EN", "EP"] }, // Former: ZZZZZF | 1103 65 -5456
  "EP": { id: "EP", pos: { x: 1108, y: 65, z: -5468 }, neighbors: ["EO", "EQ"] }, // Former: ZZZZZG | 1108 65 -5468
  "EQ": { id: "EQ", pos: { x: 1118, y: 65, z: -5483 }, neighbors: ["EP", "ER"] }, // Former: ZZZZZH | 1118 65 -5483
  "ER": { id: "ER", pos: { x: 1125, y: 66, z: -5491 }, neighbors: ["EQ", "ES", "EV", "EX"], isIntersection: true }, // Former: ZZZZZI | 1125 66 -5491
  "ES": { id: "ES", pos: { x: 1121, y: 66, z: -5500 }, neighbors: ["ER", "ET"] }, // Former: ZZZZZJ | 1121 66 -5500
  "ET": { id: "ET", pos: { x: 1115, y: 66, z: -5513 }, neighbors: ["ES", "EU"] }, // Former: ZZZZZK | 1115 66 -5513
  "EU": { id: "EU", pos: { x: 1112, y: 65, z: -5528 }, neighbors: ["ET", "EV"] }, // Former: ZZZZZL | 1112 65 -5528
  "EV": { id: "EV", pos: { x: 1135, y: 66, z: -5500 }, neighbors: ["EU", "EW"] }, // Former: ZZZZZM | 1135 66 -5500
  "EW": { id: "EW", pos: { x: 1156, y: 66, z: -5516 }, neighbors: ["EV", "EX"] }, // Former: ZZZZZN | 1156 66 -5516
  "EX": { id: "EX", pos: { x: 1140, y: 66, z: -5493 }, neighbors: ["EW", "EY"] }, // Former: ZZZZZO | 1140 66 -5493
  "EY": { id: "EY", pos: { x: 1150, y: 66, z: -5490 }, neighbors: ["EX", "EZ"] }, // Former: ZZZZZP | 1150 66 -5490
  "EZ": { id: "EZ", pos: { x: 1164, y: 66, z: -5488 }, neighbors: ["EY", "FA"] }, // Former: ZZZZZQ | 1164 66 -5488
  "FA": { id: "FA", pos: { x: 1206, y: 66, z: -5488 }, neighbors: ["FB", "FC", "FD"], isIntersection: true }, // Former: ZZZZZR | 1206 66 -5488
  "FB": { id: "FB", pos: { x: 1218, y: 66, z: -5492 }, neighbors: ["FA", "FC"] }, // Former: ZZZZZS | 1218 66 -5492
  "FC": { id: "FC", pos: { x: 1216, y: 66, z: -5501 }, neighbors: ["FB", "FD"] }, // Former: ZZZZZT | 1216 66 -5501
  "FD": { id: "FD", pos: { x: 1215, y: 66, z: -5518 }, neighbors: ["FC", "FE"] }, // Former: ZZZZZU | 1215 66 -5518
  "FE": { id: "FE", pos: { x: 1225, y: 66, z: -5543 }, neighbors: ["FD", "FF"] }, // Former: ZZZZZV | 1225 66 -5543
  "FF": { id: "FF", pos: { x: 1240, y: 66, z: -5560 }, neighbors: ["FE", "FG"] }, // Former: ZZZZZW | 1240 66 -5560
  "FG": { id: "FG", pos: { x: 1256, y: 66, z: -5563 }, neighbors: ["FF", "FH", "FI", "GH"], isIntersection: true }, // Former: ZZZZZX | 1256 66 -5563
  "FH": { id: "FH", pos: { x: 1254, y: 66, z: -5554 }, neighbors: ["FG", "FI"] }, // Former: ZZZZZY | 1254 66 -5554
  "FI": { id: "FI", pos: { x: 1257, y: 66, z: -5572 }, neighbors: ["FH", "FJ"] }, // Former: ZZZZZZ | 1257 66 -5572
  "FJ": { id: "FJ", pos: { x: 1262, y: 66, z: -5602 }, neighbors: ["FK", "FW", "FI"], isIntersection: true }, // Former: ZZZZZZB | 1262 66 -5602
  "FK": { id: "FK", pos: { x: 1265, y: 66, z: -5618 }, neighbors: ["FJ", "FL"] }, // Former: ZZZZZZC | 1265 66 -5618
  "FL": { id: "FL", pos: { x: 1267, y: 65, z: -5630 }, neighbors: ["FK", "FM"] }, // Former: ZZZZZZD | 1267 65 -5630
  "FM": { id: "FM", pos: { x: 1269, y: 65, z: -5652 }, neighbors: ["FL", "FN"] }, // Former: ZZZZZZE | 1269 65 -5652
  "FN": { id: "FN", pos: { x: 1270, y: 65, z: -5674 }, neighbors: ["EN", "FO", "FT", "FU"], isIntersection: true }, // Former: ZZZZZZF | 1270 65 -5674
  "FO": { id: "FO", pos: { x: 1259, y: 65, z: -5665 }, neighbors: ["FM", "FP"] }, // Former: ZZZZZZG | 1259 65 -5665
  "FP": { id: "FP", pos: { x: 1247, y: 65, z: -5653 }, neighbors: ["FO", "FQ"] }, // Former: ZZZZZZH | 1247 65 -5653
  "FQ": { id: "FQ", pos: { x: 1237, y: 65, z: -5646 }, neighbors: ["FP", "FR"] }, // Former: ZZZZZZI | 1237 65 -5646
  "FR": { id: "FR", pos: { x: 1223, y: 65, z: -5628 }, neighbors: ["FQ", "FS"] }, // Former: ZZZZZZJ | 1223 65 -5628
  "FS": { id: "FS", pos: { x: 1212, y: 65, z: -5613 }, neighbors: ["FR", "FT"] }, // Former: ZZZZZZK | 1212 65 -5613
  "FT": { id: "FT", pos: { x: 1263, y: 65, z: -5682 }, neighbors: ["FS", "FU"] }, // Former: ZZZZZZL | 1263 65 -5682
  "FU": { id: "FU", pos: { x: 1277, y: 65, z: -5679 }, neighbors: ["FT", "FV"] }, // Former: ZZZZZZM | 1277 65 -5679
  "FV": { id: "FV", pos: { x: 1299, y: 65, z: -5678 }, neighbors: ["FU", "FW"] }, // Former: ZZZZZZN | 1299 65 -5678
  "FW": { id: "FW", pos: { x: 1267, y: 66, z: -5601 }, neighbors: ["FV", "FX"] }, // Former: ZZZZZZO | 1267 66 -5601
  "FX": { id: "FX", pos: { x: 1278, y: 66, z: -5602 }, neighbors: ["FW", "FY"] }, // Former: ZZZZZZP | 1278 66 -5602
  "FY": { id: "FY", pos: { x: 1290, y: 66, z: -5606 }, neighbors: ["FX", "FZ"] }, // Former: ZZZZZZQ | 1290 66 -5606
  "FZ": { id: "FZ", pos: { x: 1315, y: 66, z: -5618 }, neighbors: ["FY", "GA"] }, // Former: ZZZZZZR | 1315 66 -5618
  "GA": { id: "GA", pos: { x: 1344, y: 66, z: -5629 }, neighbors: ["FZ", "GB"] }, // Former: ZZZZZZS | 1344 66 -5629
  "GB": { id: "GB", pos: { x: 1363, y: 66, z: -5639 }, neighbors: ["GA", "GC"] }, // Former: ZZZZZZT | 1363 66 -5639
  "GC": { id: "GC", pos: { x: 1395, y: 66, z: -5668 }, neighbors: ["GD", "GE"], isIntersection: true }, // Former: ZZZZZZV | 1395 66 -5668
  "GD": { id: "GD", pos: { x: 1397, y: 66, z: -5688 }, neighbors: ["GC"] }, // Former: ZZZZZZW | 1397 66 -5688
  "GE": { id: "GE", pos: { x: 1404, y: 66, z: -5670 }, neighbors: ["GF", "GC"] }, // Former: ZZZZZZX | 1404 66 -5670
  "GF": { id: "GF", pos: { x: 1420, y: 66, z: -5677 }, neighbors: ["GE", "GG"] }, // Former: ZZZZZZY | 1420 66 -5677
  "GG": { id: "GG", pos: { x: 1441, y: 66, z: -5685 }, neighbors: ["GF", "L"] }, // Former: ZZZZZZZ | 1441 66 -5685
  "GH": { id: "GH", pos: { x: 1264, y: 66, z: -5563 }, neighbors: ["FG", "GI"] }, // Former: ZZZZZZZB | 1264 66 -5563
  "GI": { id: "GI", pos: { x: 1273, y: 66, z: -5560 }, neighbors: ["GH", "GJ"] }, // Former: ZZZZZZZC | 1273 66 -5560
  "GJ": { id: "GJ", pos: { x: 1288, y: 66, z: -5557 }, neighbors: ["GI", "GK"] }, // Former: ZZZZZZZD | 1288 66 -5557
  "GK": { id: "GK", pos: { x: 1297, y: 67, z: -5557 }, neighbors: ["GJ", "GL"] }, // Former: ZZZZZZZE | 1297 67 -5557
  "GL": { id: "GL", pos: { x: 1322, y: 67, z: -5554 }, neighbors: ["GK", "GM"] }, // Former: ZZZZZZZF | 1322 67 -5554
  "GM": { id: "GM", pos: { x: 1349, y: 67, z: -5554 }, neighbors: ["GL", "GN", "GT"], isIntersection: true }, // Former: ZZZZZZZG | 1349 67 -5554
  "GN": { id: "GN", pos: { x: 1359, y: 67, z: -5558 }, neighbors: ["GM", "GO", "GP"], isIntersection: true }, // Former: ZZZZZZZH | 1359 67 -5558
  "GO": { id: "GO", pos: { x: 1365, y: 67, z: -5575 }, neighbors: ["GN", "GP"] }, // Former: ZZZZZZZI | 1365 67 -5575
  "GP": { id: "GP", pos: { x: 1369, y: 67, z: -5557 }, neighbors: ["GN", "GQ"] }, // Former: ZZZZZZZJ | 1369 67 -5557
  "GQ": { id: "GQ", pos: { x: 1383, y: 67, z: -5553 }, neighbors: ["GP", "GR"] }, // Former: ZZZZZZZK | 1383 67 -5553
  "GR": { id: "GR", pos: { x: 1399, y: 67, z: -5544 }, neighbors: ["GQ", "GS"] }, // Former: ZZZZZZZL | 1399 67 -5544
  "GS": { id: "GS", pos: { x: 1418, y: 67, z: -5532 }, neighbors: ["GR", "AX"] }, // Former: ZZZZZZZM | 1418 67 -5532
  "GT": { id: "GT", pos: { x: 1348, y: 67, z: -5548 }, neighbors: ["GS", "GU"] }, // Former: ZZZZZZZN | 1348 67 -5548
  "GU": { id: "GU", pos: { x: 1341, y: 67, z: -5532 }, neighbors: ["GT", "GV"] }, // Former: ZZZZZZZO | 1341 67 -5532
  "GV": { id: "GV", pos: { x: 1337, y: 66, z: -5522 }, neighbors: ["GU", "GW"] }, // Former: ZZZZZZZP | 1337 66 -5522
  "GW": { id: "GW", pos: { x: 1332, y: 66, z: -5508 }, neighbors: ["GV", "GX"] }, // Former: ZZZZZZZQ | 1332 66 -5508
  "GX": { id: "GX", pos: { x: 1332, y: 66, z: -5500 }, neighbors: ["GW", "GY", "GZ"], isIntersection: true }, // Former: ZZZZZZZR | 1332 66 -5500
  "GY": { id: "GY", pos: { x: 1329, y: 66, z: -5491 }, neighbors: ["GX", "GZ"] }, // Former: ZZZZZZZS | 1329 66 -5491
  "GZ": { id: "GZ", pos: { x: 1339, y: 66, z: -5499 }, neighbors: ["GY", "HA"] }, // Former: ZZZZZZZT | 1339 66 -5499
  "HA": { id: "HA", pos: { x: 1356, y: 66, z: -5483 }, neighbors: ["GZ", "BL"] }, // Former: ZZZZZZZV | 1356 66 -5483
  "HB": { id: "HB", pos: { x: 1221, y: 66, z: -5484 }, neighbors: ["FB", "HC"] }, // Former: ZZZZZZZW | 1221 66 -5484
  "HC": { id: "HC", pos: { x: 1226, y: 66, z: -5471 }, neighbors: ["HB", "HD"] }, // Former: ZZZZZZZX | 1226 66 -5471
  "HD": { id: "HD", pos: { x: 1235, y: 66, z: -5465 }, neighbors: ["HC", "HE", "HF"], isIntersection: true }, // Former: ZZZZZZZY | 1235 66 -5465
  "HE": { id: "HE", pos: { x: 1241, y: 66, z: -5466 }, neighbors: ["HD", "HF"] }, // Former: ZZZZZZZZ | 1241 66 -5466
  "HF": { id: "HF", pos: { x: 1235, y: 66, z: -5459 }, neighbors: ["HD", "HG"] }, // Former: ZZZZZZZZA | 1235 66 -5459
  "HG": { id: "HG", pos: { x: 1231, y: 66, z: -5445 }, neighbors: ["HF", "HH"] }, // Former: ZZZZZZZZB | 1231 66 -5445
  "HH": { id: "HH", pos: { x: 1232, y: 66, z: -5425 }, neighbors: ["HG", "CB"] }, // Former: ZZZZZZZZC | 1232 66 -5425

};
/*


IMPORTANT:

The Navigation system works but has issues with finding the shortest path and skipping the next node if it is in alphabetical order instead of coordinate order.
It will sometimes take the shortest route which means a straight line cut off-course before taking a path.
Navigation cancellation isn't fully working yet: Needs the button in GUI>Plots>"Cancel Navigation" where "Navigate to Plot" was clicked.

NEED:
When player leaves, it ends. 
After 5 minutes, it ends.

~ Zappy NE 11/25/25 1:33pm


*/