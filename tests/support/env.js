process.env.NODE_ENV = 'test'
process.env.PORT = 9999

require("ts-node").register({
    project: "tests/tsconfig.spec.json",
});