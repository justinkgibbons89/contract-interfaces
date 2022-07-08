/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	"resolver": "jest-ts-webcompat-resolver",
	extensionsToTreatAsEsm: ['.ts'],
	globals: {
		'ts-jest': {
			useESM: true,
		},
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
};