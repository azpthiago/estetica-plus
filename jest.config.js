export default {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Remove o .js das importações nos testes
  },
  testEnvironment: "node", // Garantir que o ambiente de teste seja Node
};
