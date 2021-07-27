exports.mockGetWordNumber = [
  {
    WORD: ` первое второе третье `,
    NUM: 0,
    RESULT: `первое`,
  }, {
    WORD: `    первое    второе  третье `,
    NUM: 1,
    RESULT: `второе`,
  }, {
    WORD: `    первое    второе  третье `,
    NUM: undefined,
    RESULT: ``,
  }
];