import * as assert from "assert";
import {CarStatusHelper} from "../../helpers/CarStatusHelper";

describe('Test CarStatusHelper functions', () => {

    describe('Test calculatePenalty function', () => {

        it('should return 1 penalty point for the speed of 61km ', () => {

            const expextedPenaltyPoints = 1;

            const speedInKm = 61;

            const calculatedPenaltyPoints = CarStatusHelper.calculatePenalty(speedInKm);

            assert.ok(expextedPenaltyPoints === calculatedPenaltyPoints);

        });

        it('should return 19 penalty point for the speed of 79km ', () => {

            const expextedPenaltyPoints = 19;

            const speedInKm = 79;

            const calculatedPenaltyPoints = CarStatusHelper.calculatePenalty(speedInKm);

            assert.ok(expextedPenaltyPoints === calculatedPenaltyPoints);

        });

        it('should return 20 penalty point for the speed of 80km ', () => {

            const expextedPenaltyPoints = 20;

            const speedInKm = 80;

            const calculatedPenaltyPoints = CarStatusHelper.calculatePenalty(speedInKm);

            assert.ok(expextedPenaltyPoints === calculatedPenaltyPoints);

        });

        it('should return 22 penalty point for the speed of 81km ', () => {

            const expextedPenaltyPoints = 22;

            const speedInKm = 81;

            const calculatedPenaltyPoints = CarStatusHelper.calculatePenalty(speedInKm);

            assert.ok(expextedPenaltyPoints === calculatedPenaltyPoints);

        });

        it('should return 58 penalty point for the speed of 99km ', () => {

            const expextedPenaltyPoints = 58;

            const speedInKm = 99;

            const calculatedPenaltyPoints = CarStatusHelper.calculatePenalty(speedInKm);

            assert.ok(expextedPenaltyPoints === calculatedPenaltyPoints);

        });

    });

});