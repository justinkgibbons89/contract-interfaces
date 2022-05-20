export class EVMError extends Error {
	constructor(msg: string) {
		super(msg);
		Object.setPrototypeOf(this, EVMError.prototype);
	}
}