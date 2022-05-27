import pkg from './package.json' assert {type: "json"};

const main = () => {
  console.log('Hello World');
  console.log(`${pkg.name} v${pkg.version}`);
};

main();
