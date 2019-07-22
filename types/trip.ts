export interface TripResponseStructure {
    trip_id: number;
    starting_point: {
        coordinates: number[]
    };
    finishing_point: {
        coordinates: number[]
    };
    distance: number
}

export type TripCoordinates = {
    type: 'Point',
    coordinates: number[]
}; // lat, long