export interface SpeedPenalties {
    speed: number,
    penaltyPoints: number
}

export interface ActiveCarRabbitMqInterface {
    car_plates_no: string,
    driver_license_no: string,
    status?: 'STOPPED'
}

export interface CarStatusRabbitMqInterface {
    car_plate_no: string,
    coordinates: {
        latitude: number,
        longitude: number
    },
    speed: number,
    driver_license_no: string
}