export interface PenaltyResponseStructure {
    plates_no: string,
    license_no: string,
    speed: number,
    points: number,
    created_at: string,
    updated_at: string,
    total_points?: number,
}