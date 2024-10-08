export default {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Remove o .js das importações nos testes
  },
  testEnvironment: "node", // Define o ambiente de teste como Node
};
