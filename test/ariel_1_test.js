import { strictEqual, deepStrictEqual } from "assert";
import {
    fahrenheitToCelsius,
    roots,
    sign,
    bmi,
    factorial,
    pow,
    fib,
    duplicate,
    enlist,
    positives,
    addList,
} from "../00_Basics/ariel_1.js";

describe("Ariel1 Module Tests", () => {

    // Simple functions

    describe("fahrenheitToCelsius", () => {
        it("212 F -> 100 C", () => {
            strictEqual(fahrenheitToCelsius(212.0), 100.0);
        });

        it("32 F -> 0 C", () => {
            strictEqual(fahrenheitToCelsius(32), 0);
        });

        it("-40 F -> -40 C", () => {
            strictEqual(fahrenheitToCelsius(-40), -40);
        });
    })

    describe("roots", () => {
        it("roots(2, 4, 2)", () => {
            strictEqual(roots(2, 4, 2), -1);
        });

        it("roots(1, 0, 0)", () => {
            strictEqual(roots(1, 0, 0), 0);
        });

        it("roots(4, 5, 1)", () => {
            strictEqual(roots(4, 5, 1), -1 / 4);
        });
    });

    // Conditionals

    describe("sign", () => {
        it("negative number", () => {
            strictEqual(sign(-5), -1);
        });

        it("positive number", () => {
            strictEqual(sign(5), 1);
        });

        it("zero", () => {
            strictEqual(sign(0), 0);
        });
    });

    describe("bmi", () => {
        it("underweight", () => {
            strictEqual(bmi(47, 1.7), "underweight");
        });

        it("normal", () => {
            strictEqual(bmi(55, 1.5), "normal");
        });

        it("obese1", () => {
            strictEqual(bmi(76, 1.7), "obese1");
        });

        it("obese2", () => {
            strictEqual(bmi(81, 1.6), "obese2");
        });

        it("obese3", () => {
            strictEqual(bmi(120, 1.6), "obese3");
        });
    });

    // Recursion

    describe("factorial", () => {
        it("factorial(0)", () => {
            strictEqual(factorial(0), 1);
        });

        it("factorial(5)", () => {
            strictEqual(factorial(5), 120);
        });

        it("factorial(20)", () => {
            strictEqual(factorial(20), 2432902008176640000);
        });

        /*
        it("factorial(40)", () => {
          strictEqual(
            factorial(40),
            815915283247897734345611269596115894272000000000
          );
        });
    */
    });

    describe("pow", () => {
        it("5⁰ = 1", () => {
            strictEqual(pow(5, 0), 1);
        });

        it("-5³ = -125", () => {
            strictEqual(pow(-5, 3), -125);
        });

        it("15¹² = 129746337890625", () => {
            strictEqual(pow(15, 12), 129746337890625);
        });
    });

    describe("fib", () => {
        it("fib(6)", () => {
            strictEqual(fib(6), 8);
        });

        it("sequence 0 - 10", () => {
            deepStrictEqual(
                Array.from({ length: 11 }, (_, i) => fib(i)),
                [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
            );
        });

        it("fib(42)", () => {
            strictEqual(fib(42), 267914296);
        });
    });

    // Lists

    describe("duplicate", () => {
        it("empty list", () => {
            deepStrictEqual(duplicate([]), []);
        });

        it("number list", () => {
            deepStrictEqual(
                duplicate([1, 2, 3, 4, 5]),
                [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
        });

        it("string list", () => {
            deepStrictEqual(
                duplicate(["one", "two", "three"]),
                ["one", "one", "two", "two", "three", "three"]);
        });
    });

    describe("enlist", () => {
        it("empty list", () => {
            deepStrictEqual(enlist([]), []);
        });

        it("number list", () => {
            deepStrictEqual(enlist([1, 2, 3]), [[1], [2], [3]]);
        });

        it("nested list", () => {
            deepStrictEqual(
                enlist([[1, 2, 3], 4, [5], 7, 8]),
                [[[1, 2, 3]], [4], [[5]], [7], [8]]);
        });
    });

    describe("positives", () => {
        it("empty list", () => {
            deepStrictEqual(positives([]), []);
        });

        it("mixed list", () => {
            deepStrictEqual(
                positives([12, -4, 3, -1, -10, -13, 6, -5]),
                [12, 3, 6]);
        });

        it("only negatives list", () => {
            deepStrictEqual(
                positives([-4, -1, -10, -13, -5]),
                []);
        });

        it("only positives list", () => {
            deepStrictEqual(
                positives([6, 2, 9, 13]),
                [6, 2, 9, 13]);
        });
    });

    describe("addList", () => {
        it("empty list", () => {
            strictEqual(addList([]), 0);
        });

        it("small list", () => {
            strictEqual(addList([2, 4, 1, 3]), 10);
        });

        it("larger list", () => {
            strictEqual(addList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 55);
        });
    });
});
