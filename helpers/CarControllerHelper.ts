import {CustomError} from "../error/CustomError";

export class CarControllerHelper {

    public static checkManufactureDate(date: string): void {

        const splittedDate = date.split('/');

        if (splittedDate.length != 2) {
            throw new CustomError('manufacture_date', 'Manufacture date format is not correct');
        }

        try {
            const date = new Date(splittedDate.reverse().join('-'));

            if (isNaN(date.getTime())) {
                throw new Error('not valid');
            }

        }catch (e) {
            throw new CustomError('manufacture_date', 'Manufacture date format is not correct');
        }

    }

}