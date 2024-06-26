import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeorisqueAllData } from '../datarating/fetch-georisque/Georisque';
import { EnumGeorisque } from './jsonGeorisque';

@Injectable()
export class DBJsonGeorisque {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param addressID
   * @param jsonToGet
   * @returns
   */
  async getSpecificJsonDataGeorisque(addressID: string, jsonToGet: EnumGeorisque): Promise<any | null> {
    // Convert jsonToGet to actual database field
    const dbField = jsonToGet;
    if (!dbField) {
      return null;
    }

    const dataSourceWithJsonData = await this.prisma.addressInfo.findUnique({
      where: { addressID: addressID },
      include: {
        jsonDataGeorisque: {
          select: { [dbField]: true },
          take: 1,
        },
      },
    });
    if (
      !dataSourceWithJsonData ||
      !dataSourceWithJsonData.jsonDataGeorisque ||
      dataSourceWithJsonData.jsonDataGeorisque.length === 0
    ) {
      return null;
    }

    const jsonData = dataSourceWithJsonData.jsonDataGeorisque[0][dbField] as string;
    if (!jsonData) {
      return null;
    }
    // TODO: Why JSON data is type never when I remove the as string ?.???
    return await JSON.parse(jsonData);
  }

  /**
   *
   * @param dataSourceID
   * @param dataGeorisque
   */
  async addJsonGeorisque(addressID: string, dataGeorisque: GeorisqueAllData) {
    try {
      const createData: any = { addressID: addressID };
      const fields: Array<keyof GeorisqueAllData> = Object.keys(dataGeorisque) as Array<
        keyof GeorisqueAllData
      >;

      fields.forEach((field) => {
        if (dataGeorisque[field]) {
          createData[field] = JSON.stringify(dataGeorisque[field]);
        }
      });

      await this.prisma.jsonDataGeorisque.create({ data: createData });
    } catch (err) {
      console.error(`Error in addJsonGeorisque: ${err.message}`);
    }
  }

  async isFilled(addressId: string): Promise<boolean> {
    try {
      const count = await this.prisma.jsonDataGeorisque.count({
        where: {
          addressID: addressId,
        },
      });

      return count > 0 || false;
    } catch (err) {
      return false;
    }
  }
}
