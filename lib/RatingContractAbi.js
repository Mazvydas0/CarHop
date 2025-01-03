export const ratingContractAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tripId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "passenger",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "PassengerRated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tripId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "passenger",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "RatedDriver",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "calculateUserAverageRating",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "driverRatings",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tripId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_passenger",
        type: "address",
      },
    ],
    name: "getTripDriverRating",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tripId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_passenger",
        type: "address",
      },
    ],
    name: "getTripPassengerRating",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "passengerRatings",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tripId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_driver",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_rating",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_passenger",
        type: "address",
      },
    ],
    name: "rateDriver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tripId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_passenger",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_rating",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_driver",
        type: "address",
      },
    ],
    name: "ratePassenger",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];