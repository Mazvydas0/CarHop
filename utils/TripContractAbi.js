export const tripContractAbi = [
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TripBooked",
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
        name: "driver",
        type: "address",
      },
    ],
    name: "TripCompleted",
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
        name: "driver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pickupLocation",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "dropoffLocation",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pickupTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dropoffTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "seats",
        type: "uint256",
      },
    ],
    name: "TripCreated",
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
        indexed: false,
        internalType: "uint256",
        name: "newPickupTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newDropoffTime",
        type: "uint256",
      },
    ],
    name: "TripScheduleUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tripId",
        type: "uint256",
      },
    ],
    name: "bookTrip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tripId",
        type: "uint256",
      },
    ],
    name: "completeTrip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_pickupLocation",
        type: "string",
      },
      {
        internalType: "string",
        name: "_dropoffLocation",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_pickupTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_dropoffTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_availableSeats",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isFlexible",
        type: "bool",
      },
    ],
    name: "createTrip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "escrow",
    outputs: [
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
        name: "_tripId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "passenger",
        type: "address",
      },
    ],
    name: "getDriverRating",
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
    ],
    name: "getTripDetails",
    outputs: [
      {
        internalType: "string",
        name: "pickupLocation",
        type: "string",
      },
      {
        internalType: "string",
        name: "dropoffLocation",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableSeats",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
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
    ],
    name: "getTripPassengers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
    ],
    name: "getTripSchedule",
    outputs: [
      {
        internalType: "uint256",
        name: "pickupTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dropoffTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isFlexible",
        type: "bool",
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
    name: "isBooked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
        internalType: "uint8",
        name: "_rating",
        type: "uint8",
      },
    ],
    name: "rateDriver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tripCount",
    outputs: [
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
    ],
    name: "tripSchedules",
    outputs: [
      {
        internalType: "uint256",
        name: "pickupTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dropoffTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isFlexible",
        type: "bool",
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
    ],
    name: "trips",
    outputs: [
      {
        internalType: "address",
        name: "driver",
        type: "address",
      },
      {
        internalType: "string",
        name: "pickupLocation",
        type: "string",
      },
      {
        internalType: "string",
        name: "dropoffLocation",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableSeats",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
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
        internalType: "uint256",
        name: "_newPickupTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newDropoffTime",
        type: "uint256",
      },
    ],
    name: "updateTripSchedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];