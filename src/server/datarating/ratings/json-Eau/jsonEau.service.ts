import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { jsonEau } from './jsonEau';
import { jsonEauMapping } from './jsonEau.const';
import { eauAllData } from '@server/datarating/fetch-eau/eau';

@Injectable()
export class JsonEauDB {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param addressID
   * @param jsonToGet
   * @returns
   */
  async getSpecificJsonDataEau(addressID: string, jsonToGet: keyof jsonEau): Promise<any | null> {
    // Convert jsonToGet to actual database field
    const dbField = jsonEauMapping[jsonToGet];
    if (!dbField) {
      throw new NotFoundException(`Invalid field name: ${jsonToGet}`);
    }

    const dataSourceWithJsonData = await this.prisma.dataSourceAddressID.findUnique({
      where: { addressID: addressID },
      include: {
        jsonDataEau: {
          select: { [dbField]: true },
          take: 1, // Assuming one-to-one relation or taking the first entry
        },
      },
    });
    if (
      !dataSourceWithJsonData ||
      !dataSourceWithJsonData.jsonDataEau ||
      dataSourceWithJsonData.jsonDataEau.length === 0
    ) {
      throw new NotFoundException(`No JSON data found for addressID: ${addressID}`);
    }

    const jsonData = dataSourceWithJsonData.jsonDataEau[0][dbField] as string;
    if (jsonData === null || jsonData === undefined) {
      throw new NotFoundException(`No JSON data found for addressID: ${addressID} and field: ${jsonToGet}`);
    }
    return await JSON.parse(jsonData);
  }

  /**
   *
   * @param dataSourceID
   * @param dataEau
   */
  async addJsonEau(dataSourceID: string, dataEau: eauAllData) {
    try {
      const createData: any = { DataSourcesID: dataSourceID };
      const fields: Array<keyof eauAllData> = Object.keys(dataEau) as Array<keyof eauAllData>;

      fields.forEach((field) => {
        if (dataEau[field]) {
          createData[field] = JSON.stringify(dataEau[field]);
        }
      });

      await this.prisma.jsonDataEau.create({ data: createData });
    } catch (err) {
      console.error(`Error in addJsonGeorisque: ${err.message}`);
    }
  }
}