import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  Post,
  Param,
} from '@nestjs/common';
import { AddressObject } from '../datarating/fetch-address/address';
import { RatesGeoRisque } from '../datarating/fetch-georisque/Georisque';
import { eauAnalysis } from '../datarating/fetch-eau/eauAnalysis';
import { RatingsDBService } from './ratingsDB.service';
import { FetchAddressService } from '../datarating/fetch-address/address.service';
import { FetchEauService } from '../datarating/fetch-eau/fetch-eau.service';
import { FetchGeorisqueService } from '../datarating/fetch-georisque/fetch-georisque.service';
import { EauPotableData, RatesEau, eauAllData } from '../datarating/fetch-eau/eau';
import { AddressObjectDTO, JsonEauDTO, JsonGeorisqueDTO } from './rating.dto';
import { DBJsonGeorisque } from '../DBjson-Georisque/DBjsonGeorisque.service';
import { DBAddressInfo } from '../DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from '../DBallRatings/DBallRatings.service';
import axios from 'axios';
import { FetchParcCarto } from '../datarating/fetch-cartoParc/fetch-cartoParc.service';
import { RatesParcCarto } from '../datarating/fetch-cartoParc/cartoParc';
import { DBJsonEau } from '../DBjson-Eau/DBjsonEau.service';
import { FetchDPE } from '../datarating/fetch-dpe/fetchDPE.service';
import { DBJsonDPE } from '../DBJson-DPE/DBjsonDPE.service';
import { RatesDPE } from '../datarating/fetch-dpe/DPE';
import { Request } from 'express';
import { DBJsonParcCarto } from '../DBJson-ParcCarto/DBjsonParcCarto.service';
import axiosInstanceWithUserAdgent from '../../utils/axiosInstance';

@Controller('ratingcontroller')
export class RatingController {
  constructor(
    private RatingsDBService: RatingsDBService,
    private fetchAddressService: FetchAddressService,
    private fetchEauService: FetchEauService,
    private fetchGeorisqueService: FetchGeorisqueService,
    private fetchParcCarto: FetchParcCarto,
    private fetchDPE: FetchDPE,
    private DBAllRatings: DBAllRatings,
    private DBjsonGeorisque: DBJsonGeorisque,
    private DBjsonEau: DBJsonEau,
    private DBAddressInfo: DBAddressInfo,
    private DBJsonParcCarto: DBJsonParcCarto,
    private DBJsonDPE: DBJsonDPE,
  ) {} //Inport the token service so I can use it in the controller

  @Get('getrate')
  // @Roles('admin', 'user')
  async getExistingRate(@Body() dataQuery: AddressObjectDTO, @Req() req: Request) {
    try {
      const addressObject = await this.fetchAddressService.findAddress(dataQuery);

      if (!addressObject) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }

      const rate = await this.RatingsDBService.getRatingsByAddressID(addressObject);
      if (!rate) {
        throw new HttpException('Rate not found for the given address', HttpStatus.NOT_FOUND);
      }

      return rate;
    } catch (error) {
      // Log the error for server-side reference
      console.error(error);

      // Throw an HTTP exception with a generic message for client-side
      throw new HttpException(
        'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Retrieves Georisque data for a specific address based on the provided address ID.
   *
   * This function handles a GET request to the 'fetchGeorisque/:addressID' endpoint. It checks
   * whether the Georisque data related to the given address ID is present in the database. If the
   * data exists, it fetches and returns the associated Georisque ratings. If not, it returns null.
   *
   * @param param The address ID extracted from the URL parameter. It is used to identify the
   *              specific address for which Georisque data is being requested.
   * @param req   The extended request object of type Request, which includes additional
   *              user information such as user ID and UUID.
   *
   * @returns     A Promise resolving to the Georisque rates associated with the address ID if found,
   *              or null if no data is available.
   */
  @Get('fetchgeorisque/:addressID')
  async fetchGerosiqueByAddressID(
    @Param('addressID') param: string,
    @Req() req: Request,
  ): Promise<RatesGeoRisque | null> {
    if (await this.DBjsonGeorisque.isFilled(param)) {
      return this.DBAllRatings.getRatingGeorisqueByAddressId(param);
    } else {
      return null;
    }
  }
  /**
   * Handles a POST request to fetch Georisque data for a specific address and analyze it.
   *
   * This endpoint, accessible at 'fetchGeorisque', accepts an address object in the request body.
   * It first logs the received data for debugging purposes. Then, it initiates a series of API
   * calls (via the `fetchGeorisqueService`) to gather comprehensive Georisque data related to the
   * provided address. After receiving this data, it is analyzed to produce Georisque rates.
   * The collected data is also stored in the database for future reference. Finally, the analyzed
   * Georisque rates are returned as the response.
   *
   * @param dataQuerry The address object received in the request body, used to fetch and analyze
   *                   Georisque data.
   * @param req        The extended request object of type Request, which includes additional
   *                   user information such as user ID and UUID.
   *
   * @returns          A Promise resolving to the analyzed Georisque rates for the provided address.
   */
  @Post('fetchgeorisque')
  async postGerosique(@Body() addressObject: AddressObject, @Req() req: Request): Promise<RatesGeoRisque> {
    const georisqueAllData = await this.fetchGeorisqueService.callAllApiGasparPromiseAll(addressObject);
    const ratesGaspar = this.fetchGeorisqueService.analisysGaspar(georisqueAllData);

    await this.DBjsonGeorisque.addJsonGeorisque(addressObject.properties.id, georisqueAllData);
    await this.DBAllRatings.updateRating(addressObject.properties.id, ratesGaspar);
    return ratesGaspar;
  }

  @Get('fetcheau/:addressID')
  async fetchEauByAddressID(
    @Param('addressID') param: string,
    @Req() req: Request,
  ): Promise<RatesEau | null> {
    if (await this.DBjsonEau.isFilled(param)) {
      return this.DBAllRatings.getRatingEauByAddressId(param);
    } else {
      return null;
    }
  }
  @Post('fetcheau')
  async postEau(@Body() addressObject: AddressObject, @Req() req: Request): Promise<RatesEau> {
    let dataEauPotable: EauPotableData[];
    let eauAllData: eauAllData;
    const resultEauPotable: number = await this.fetchEauService.qualiteEau(addressObject).then((res) => {
      dataEauPotable = this.fetchEauService.dataCalculation(res);
      return eauAnalysis(dataEauPotable);
    });
    eauAllData = { eauPotable: dataEauPotable };
    await this.DBjsonEau.addJsonEau(addressObject.properties.id, eauAllData);
    await this.DBAllRatings.updateRating(addressObject.properties.id, { eauPotable: resultEauPotable });

    return { eauPotable: resultEauPotable };
  }

  @Get('fethParcCarto/:addressID')
  async fethParcCartoByAddressID(
    @Param('addressID') param: string,
    @Req() req: Request,
  ): Promise<RatesParcCarto | null> {
    if (await this.DBJsonParcCarto.isFilled(param)) {
      return this.DBAllRatings.getRatingParcCartoByAddressId(param);
    } else {
      return null;
    }
  }
  @Post('fethParcCarto')
  async postParcCarto(@Body() addressObject: AddressObject, @Req() req: Request): Promise<RatesParcCarto> {
    // Create a circle around th coordonate to search inside
    const geoJsonAreaAroundPoint = this.fetchParcCarto.createGeoJSONCircleString(
      addressObject.geometry.coordinates[1],
      addressObject.geometry.coordinates[0],
      5000, //Rayon
      10, // Number of point
    );
    // Getting the data from the API
    const parcCartoAllData = await this.fetchParcCarto.getNatureDatas(geoJsonAreaAroundPoint);
    // Calculate Rates
    const rateParcCarto = this.fetchParcCarto.getRate(parcCartoAllData);
    // Update DB
    this.DBAllRatings.updateRating(addressObject.properties.id, rateParcCarto);
    this.DBJsonParcCarto.addJson(addressObject.properties.id, parcCartoAllData);
    return rateParcCarto;
  }

  @Get('fethDPE/:addressID')
  async fethDPEByAddressID(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<RatesParcCarto | null> {
    if (await this.DBJsonDPE.isFilled(addressID)) {
      return this.DBAllRatings.getRatingParcCartoByAddressId(addressID);
    } else {
      return null;
    }
  }
  @Post('fethDPE')
  async postDPE(@Body() addressObject: AddressObject, @Req() req: Request): Promise<any> {
    const resultDPEHabitat = await this.fetchDPE.getDPEDatas(addressObject);
    const ratesDPEHabitat = this.fetchDPE.getDPERates(resultDPEHabitat);
    // Update DB
    // this.DBAllRatings.updateRating(addressObject.properties.id, ratesDPEHabitat);
    // this.DBJsonDPE.addJson(addressObject.properties.id, resultDPEHabitat);
    // return ratesDPEHabitat;
  }
  /**
   * Handles a POST request to obtain rate information for a specified address.
   *
   * This endpoint, accessible at 'getrate', takes an address object DTO as input and performs
   * several operations to fetch and associate address information with a user. It first
   * retrieves the address ID based on the provided address details. If the address information
   * is not already in the database, it creates a new entry. Then, it associates this address
   * with the current user's ID. The function ultimately returns the processed address object.
   *
   * @param dataQuery The address details provided in the request body. It should be an instance
   *                  of AddressObjectDTO, which includes city, postcode, and street.
   * @param req       The extended request object, which includes additional user information such
   *                  as user ID and UUID. It should be an instance of Request.
   *
   * @returns         A Promise that resolves to an AddressObject containing the address details.
   *
   * @throws HttpException with a status of BAD_REQUEST if any error occurs during the process.
   */
  @Post('getrate')
  // @Roles('admin', 'user')
  async postAskForRate(@Body() dataQuery: AddressObjectDTO, @Req() req: Request): Promise<AddressObject> {
    try {
      // Get address ID of the specific address
      let inputaddressObject: AddressObjectDTO = {
        address: dataQuery.address,
      };
      const addressObject: AddressObject = await this.fetchAddressService.findAddress(inputaddressObject);
      let addressInfo = await this.DBAddressInfo.findAddressInfo(addressObject.properties.id);
      // Fill address info DB
      if (!addressInfo) {
        addressInfo = await this.DBAddressInfo.createEntry(addressObject);
      }
      // link user with addressID
      if (!(await this.DBAllRatings.entryExists(addressObject.properties.id))) {
        await this.DBAllRatings.createEntry(addressObject.properties.id);
      }
      // Return the address object
      console.error(addressObject);
      return addressObject;
    } catch (err) {
      throw new HttpException('error in Post getrate' + err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('getjsongeorisque')
  // @Roles('admin', 'user')
  async getJsonGeorisque(@Body() dataQuerry: JsonGeorisqueDTO) {
    return await this.DBjsonGeorisque.getSpecificJsonDataGeorisque(dataQuerry.addressID, dataQuerry.jsonData);
  }
  @Get('getjsoneau')
  // @Roles('admin', 'user')
  async getJsonEau(@Body() dataQuerry: JsonEauDTO) {
    return await this.DBjsonEau.getSpecificJsonDataEau(dataQuerry.addressID, dataQuerry.jsonData);
  }
  @Get('vigieau')
  // @Roles('admin', 'user')
  async vigieau(@Body() dataQuerry: any) {
    const response = await axiosInstanceWithUserAdgent.get(
      `https://api.vigieau.gouv.fr/reglementation?lon=3.117428&lat=43.355801&commune=34155&profil=exploitation`,
    );
  }
  @Get('testnewapi')
  // @Roles('admin', 'user')
  async testnewapi(@Body() dataQuerry: any) {
    try {
      const response = await axiosInstanceWithUserAdgent.get(
        `https://api.vigieau.beta.gouv.fr/reglementation?commune=66048_7xolnt`,
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
