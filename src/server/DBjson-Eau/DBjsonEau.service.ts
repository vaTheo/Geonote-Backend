import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnumEau } from './jsonEau';
import { eauAllData } from '@server/datarating/fetch-eau/eau';

@Injectable()
export class DBJsonEau {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param addressID
   * @param jsonToGet
   * @returns
   */
  async getSpecificJsonDataEau(addressID: string, jsonToGet: EnumEau): Promise<any | null> {
    // Convert jsonToGet to actual database field
    const dbField = jsonToGet;
    if (!dbField) {
      throw new NotFoundException(`Invalid field name: ${jsonToGet}`);
    }

    const dataSourceWithJsonData = await this.prisma.addressInfo.findUnique({
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
      return null
    }

    const jsonData = dataSourceWithJsonData.jsonDataEau[0][dbField] as string;
    if (jsonData === null || jsonData === undefined) {
      return null
    }
    return await JSON.parse(jsonData);
  }

  /**
   *
   * @param dataSourceID
   * @param dataEau
   */
  async addJsonEau(addressID: string, dataEau: eauAllData) {
    try {
      const createData: any = { addressID: addressID };
      const fields: Array<keyof eauAllData> = Object.keys(dataEau) as Array<keyof eauAllData>;

      fields.forEach((field) => {
        if (dataEau[field]) {
          createData[field] = JSON.stringify(dataEau[field]);
        }
      });

      await this.prisma.jsonDataEau.create({ data: createData });
    } catch (err) {
      console.error(`Error in addJsonEau: ${err.message}`);
    }
  }
  async isFilled(addressID: string): Promise<boolean> {
    try {
      const count = await this.prisma.jsonDataEau.count({
        where: {
          addressID: addressID,
        },
      });

      return count > 0 || false;
    } catch (err) {
      return false;
    }
  }


}
