import {assert} from "chai";
import {UuidGenerator} from "./UuidGenerator";

describe("@unit UuidGenerator", () => {
	let gen: UuidGenerator;
	
	beforeEach(() => {
		gen = new UuidGenerator();
	});
	
	it("generate(): should generate id string", () => {
		let generated = gen.generate();
		assert.isString(generated);
		assert.isAbove(generated.length, 1);
	})
});
