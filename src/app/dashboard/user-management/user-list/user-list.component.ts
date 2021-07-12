import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/shared/services/user-management.service';
import { ExportTypes } from '../../../shared/enums/export-type';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  sampleDataSet: any = [{
    "id": 1,
    "model": "Elise",
    "manufacture": "Lotus",
    "modelYear": 2004,
    "mileage": 116879,
    "description": "The Lotus Elise first appeared in 1996 and revolutionised small sports car design with its lightweight extruded aluminium chassis and composite body. There have been many variations, but the basic principle remain the same.",
    "color": "Red",
    "price": 18347,
    "condition": 2,
    "createdDate": "09/30/2017",
    "status": 1,
    "VINCode": "1FTWX3D52AE575540",
    "_userId": 1,
    "_createdDate": "03/31/2015",
    "_updatedDate": "05/08/2015"
  }, {
    "id": 2,
    "model": "Sunbird",
    "manufacture": "Pontiac",
    "modelYear": 1984,
    "mileage": 99515,
    "description": "The Pontiac Sunbird is an automobile that was produced by Pontiac, initially as a subcompact for the 1976 to 1980 model years,and later as a compact for the 1982 to 1994 model years. The Sunbird badge ran for 18 years (with a hiatus during the 1981 and 1982 model years, as the 1982 model was called J2000) and was then replaced in 1995 by the Pontiac Sunfire. Through the years the Sunbird was available in notchback coupé, sedan, hatchback, station wagon, and convertible body styles.",
    "color": "Khaki",
    "price": 165956,
    "condition": 1,
    "createdDate": "03/22/2018",
    "status": 2,
    "VINCode": "JM1NC2EF8A0293556",
    "_userId": 1,
    "_createdDate": "11/11/2016",
    "_updatedDate": "09/01/2016"
  }, {
    "id": 3,
    "model": "Amigo",
    "manufacture": "Isuzu",
    "modelYear": 1993,
    "mileage": 138027,
    "description": "The Isuzu MU is a mid-size SUV that was produced by the Japan-based manufacturer Isuzu. The three-door MU was introduced in 1989, followed in 1990 by the five-door version called Isuzu MU Wizard, both of which stopped production in 1998 to be replaced by a second generation. This time, the five-door version dropped the \"MU\" prefix, to become the Isuzu Wizard. The acronym \"MU\" is short for \"Mysterious Utility\". Isuzu manufactured several variations to the MU and its derivates for sale in other countries.",
    "color": "Aquamarine",
    "price": 45684,
    "condition": 1,
    "createdDate": "03/06/2018",
    "status": 1,
    "VINCode": "1G6DG8E56C0973889",
    "_userId": 1,
    "_createdDate": "08/14/2012",
    "_updatedDate": "03/21/2013"
  }, {
    "id": 4,
    "model": "LS",
    "manufacture": "Lexus",
    "modelYear": 2004,
    "mileage": 183068,
    "description": "The Lexus LS (Japanese: レクサス・LS, Rekusasu LS) is a full-size luxury car (F-segment in Europe) serving as the flagship model of Lexus, the luxury division of Toyota. For the first four generations, all LS models featured V8 engines and were predominantly rear-wheel-drive, with Lexus also offering all-wheel-drive, hybrid, and long-wheelbase variants. The fifth generation changed to using a V6 engine with no V8 option, and the long wheelbase variant was removed entirely.",
    "color": "Mauv",
    "price": 95410,
    "condition": 2,
    "createdDate": "02/03/2018",
    "status": 2,
    "VINCode": "2T1BU4EE6DC859114",
    "_userId": 2,
    "_createdDate": "11/25/2012",
    "_updatedDate": "08/15/2013"
  }, {
    "id": 5,
    "model": "Paseo",
    "manufacture": "Toyota",
    "modelYear": 1997,
    "mileage": 74884,
    "description": "The Toyota Paseo (known as the Cynos in Japan and other regions) is a sports styled compact car sold from 1991–1999 and was loosely based on the Tercel. It was available as a coupe and in later models as a convertible. Toyota stopped selling the car in the United States in 1997, however the car continued to be sold in Canada, Europe and Japan until 1999, but had no direct replacement. The Paseo, like the Tercel, shares a platform with the Starlet. Several parts are interchangeable between the three",
    "color": "Pink",
    "price": 24796,
    "condition": 2,
    "createdDate": "08/13/2017",
    "status": 1,
    "VINCode": "1D7RB1GP0AS597432",
    "_userId": 1,
    "_createdDate": "11/21/2016",
    "_updatedDate": "10/09/2012"
  }, {
    "id": 6,
    "model": "M",
    "manufacture": "Infiniti",
    "modelYear": 2009,
    "mileage": 194846,
    "description": "The Infiniti M is a line of mid-size luxury (executive) cars from the Infiniti luxury division of Nissan.\r\nThe first iteration was the M30 Coupe/Convertible, which were rebadged JDM Nissan Leopard.\r\nAfter a long hiatus, the M nameplate was used for Infiniti's mid-luxury sedans (executive cars). First was the short-lived M45 sedan, a rebadged version of the Japanese-spec Nissan Gloria. The next generations, the M35/45 and M37/56/35h/30d, became the flagship of the Infiniti brand and are based on the JDM Nissan Fuga.",
    "color": "Puce",
    "price": 30521,
    "condition": 2,
    "createdDate": "01/27/2018",
    "status": 1,
    "VINCode": "YV1940AS1D1542424",
    "_userId": 2,
    "_createdDate": "03/13/2016",
    "_updatedDate": "12/14/2013"
  }, {
    "id": 7,
    "model": "Phantom",
    "manufacture": "Rolls-Royce",
    "modelYear": 2008,
    "mileage": 164124,
    "description": "The Rolls-Royce Phantom VIII is a luxury saloon car manufactured by Rolls-Royce Motor Cars. It is the eighth and current generation of Rolls-Royce Phantom, and the second launched by Rolls-Royce under BMW ownership. It is offered in two wheelbase lengths",
    "color": "Purple",
    "price": 196247,
    "condition": 2,
    "createdDate": "09/28/2017",
    "status": 2,
    "VINCode": "3VWML7AJ1DM234625",
    "_userId": 2,
    "_createdDate": "03/31/2012",
    "_updatedDate": "06/27/2014"
  }, {
    "id": 8,
    "model": "QX",
    "manufacture": "Infiniti",
    "modelYear": 2002,
    "mileage": 57410,
    "description": "The Infiniti QX80 (called the Infiniti QX56 until 2013) is a full-size luxury SUV built by Nissan Motor Company's Infiniti division. The naming convention originally adhered to the current trend of using a numeric designation derived from the engine's displacement, thus QX56 since the car has a 5.6-liter engine. From the 2014 model year, the car was renamed the QX80, as part of Infiniti's model name rebranding. The new name carries no meaning beyond suggesting that the vehicle is larger than smaller models such as the QX60",
    "color": "Green",
    "price": 185775,
    "condition": 2,
    "createdDate": "11/15/2017",
    "status": 1,
    "VINCode": "WDDHF2EB9CA161524",
    "_userId": 1,
    "_createdDate": "03/17/2013",
    "_updatedDate": "09/05/2014"
  }, {
    "id": 9,
    "model": "Daytona",
    "manufacture": "Dodge",
    "modelYear": 1993,
    "mileage": 4444,
    "description": "The Dodge Daytona was an automobile which was produced by the Chrysler Corporation under their Dodge division from 1984 to 1993. It was a front-wheel drive hatchback based on the Chrysler G platform, which was derived from the Chrysler K platform. The Chrysler Laser was an upscale rebadged version of the Daytona. The Daytona was restyled for 1987, and again for 1992. It replaced the Mitsubishi Galant-based Challenger, and slotted between the Charger and the Conquest. The Daytona was replaced by the 1995 Dodge Avenger, which was built by Mitsubishi Motors. The Daytona derives its name mainly from the Dodge Charger Daytona, which itself was named after the Daytona 500 race in Daytona Beach, Florida.",
    "color": "Maroon",
    "price": 171898,
    "condition": 1,
    "createdDate": "12/24/2017",
    "status": 2,
    "VINCode": "WBAET37422N752051",
    "_userId": 2,
    "_createdDate": "11/17/2012",
    "_updatedDate": "03/17/2018"
  }, {
    "id": 10,
    "model": "1500 Silverado",
    "manufacture": "Chevrolet",
    "modelYear": 1999,
    "mileage": 195310,
    "description": "The Chevrolet Silverado, and its mechanically identical cousin, the GMC Sierra, are a series of full-size and heavy-duty pickup trucks manufactured by General Motors and introduced in 1998 as the successor to the long-running Chevrolet C/K line. The Silverado name was taken from a trim level previously used on its predecessor, the Chevrolet C/K pickup truck from 1975 through 1998. General Motors continues to offer a GMC-badged variant of the Chevrolet full-size pickup under the GMC Sierra name, first used in 1987 for its variant of the GMT400 platform trucks.",
    "color": "Blue",
    "price": 25764,
    "condition": 1,
    "createdDate": "08/30/2017",
    "status": 2,
    "VINCode": "1N6AF0LX6EN590806",
    "_userId": 2,
    "_createdDate": "10/06/2013",
    "_updatedDate": "03/27/2017"
  }]
  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
  }

  addUser = () => {

  }

  exportUserList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }
}
