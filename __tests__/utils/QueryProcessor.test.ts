import QueryProcessor from "../../utils/QueryProcessor";
import '@testing-library/jest-dom'

describe("QueryProcessor", () => {
    test("should return a string", () => {
        const query = "test";
        const response: string = QueryProcessor(query);
        expect(typeof response).toBe("string");
    });

    test('should return shakespeare description', () => {
        const query = "shakespeare";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
            "English poet, playwright, and actor, widely regarded as the greatest " +
            "writer in the English language and the world's pre-eminent dramatist."
          ));
    });

    test('should return name', () => {
        const query = "What is your name?";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "Dilshod"
          ));
    })

    test('should return Andrew ID', () => {
        const query = "What is your Andrew ID?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("dzk");
    })

    test('should return player ID', () => {
        const query = "What is your player ID?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("d1bcc070");
    })

    test('should return game ID', () => {
        const query = "What is your game ID?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("a5d040da");
    })

    test('should add numbers', () => {
        expect(QueryProcessor("What is 62 plus 67?")).toBe("129");
        expect(QueryProcessor("What is 86 plus 53 plus 14?")).toBe("153");
    })

    test('should compute powers exactly', () => {
        expect(QueryProcessor("What is 38 to the power of 97?")).toBe((38n ** 97n).toString());
        expect(QueryProcessor("What is 32 to the power of 22?")).toBe((32n ** 22n).toString());
    })

    test('should respect operator precedence', () => {
        expect(QueryProcessor("What is 98 multiplied by 3 plus 37?")).toBe("331");
    })

    test('should divide numbers', () => {
        expect(QueryProcessor("What is 84 divided by 4?")).toBe("21");
    })

    test('should find the largest number', () => {
        expect(QueryProcessor("Which of the following numbers is the largest: 86, 67, 80?")).toBe("86");
    })

    test('should multiply numbers', () => {
        expect(QueryProcessor("What is 6 multiplied by 7?")).toBe("42");
    })

    test('should find primes', () => {
        expect(QueryProcessor("Which of the following numbers are primes: 4, 7, 9, 13?")).toBe("7, 13");
    })
});