// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract TripContract {
    struct TripSchedule {
        uint256 pickupTime; // Unix timestamp for pickup
        uint256 dropoffTime; // Unix timestamp for dropoff
        bool isFlexible; // If true, times are approximate
    }

    struct Trip {
        address driver; // Driver's address
        string pickupLocation; // Pickup location
        string dropoffLocation; // Dropoff location
        uint256 price; // Price per seat in tokens
        uint256 availableSeats; // Number of available seats
        bool completed; // Whether the trip is completed
        address[] passengers; // List of passengers
        mapping(address => uint8) ratings; // Ratings given by passengers
    }

    uint256 public tripCount;
    mapping(uint256 => Trip) public trips;
    mapping(uint256 => TripSchedule) public tripSchedules;
    mapping(uint256 => mapping(address => bool)) public isBooked;
    mapping(uint256 => uint256) public escrow;
    mapping(uint256 => mapping(address => uint8)) public passengerRatings; // Ratings given to passengers
    mapping(uint256 => mapping(address => bool))
        public passengerCompletionConfirmation;
    mapping(address => bool) private hasCompletedTrip;

    event TripCancelled(
        uint256 tripId,
        uint256 totalRefunded,
        uint256 passengerCount
    );
    event PassengerRefunded(uint256 tripId, address passenger, uint256 amount);

    event BookingCancelled(
        uint256 tripId,
        address passenger,
        uint256 refundAmount
    );
    event PassengerRated(
        uint256 tripId,
        address indexed passenger,
        uint8 rating
    );

    event TripCreated(
        uint256 tripId,
        address indexed driver,
        string pickupLocation,
        string dropoffLocation,
        uint256 pickupTime,
        uint256 dropoffTime,
        uint256 price,
        uint256 seats
    );
    event TripBooked(uint256 tripId, address indexed passenger, uint256 amount);
    event TripCompleted(uint256 tripId, address indexed driver);
    event RatedDriver(uint256 tripId, address indexed passenger, uint8 rating);
    event TripScheduleUpdated(
        uint256 tripId,
        uint256 newPickupTime,
        uint256 newDropoffTime
    );

    event RefundFailed(uint256 tripId, address passenger);
    bool private locked;

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyDriver(uint256 _tripId) {
        require(msg.sender == trips[_tripId].driver, "Not the driver");
        _;
    }

    modifier onlyPassenger(uint256 _tripId) {
        require(isBooked[_tripId][msg.sender], "Not booked on this trip");
        _;
    }

    modifier tripExists(uint256 _tripId) {
        require(_tripId > 0 && _tripId <= tripCount, "Invalid trip ID");
        _;
    }

    modifier tripNotCompleted(uint256 _tripId) {
        require(!trips[_tripId].completed, "Trip already completed");
        _;
    }

    function createTrip(
        string memory _pickupLocation,
        string memory _dropoffLocation,
        uint256 _pickupTime,
        uint256 _dropoffTime,
        uint256 _price,
        uint256 _availableSeats,
        bool _isFlexible
    ) public {
        require(_availableSeats > 0, "Must have at least one seat");
        require(_price > 0, "Price must be greater than 0");
        require(
            _pickupTime > block.timestamp,
            "Pickup time must be in the future"
        );
        require(
            _dropoffTime > _pickupTime,
            "Dropoff time must be after pickup time"
        );
        require(bytes(_pickupLocation).length > 0, "Pickup location required");
        require(
            bytes(_dropoffLocation).length > 0,
            "Dropoff location required"
        );

        tripCount++;
        Trip storage newTrip = trips[tripCount];
        newTrip.driver = msg.sender;
        newTrip.pickupLocation = _pickupLocation;
        newTrip.dropoffLocation = _dropoffLocation;
        newTrip.price = _price;
        newTrip.availableSeats = _availableSeats;
        newTrip.completed = false;

        // Store schedule separately
        tripSchedules[tripCount] = TripSchedule({
            pickupTime: _pickupTime,
            dropoffTime: _dropoffTime,
            isFlexible: _isFlexible
        });

        emit TripCreated(
            tripCount,
            msg.sender,
            _pickupLocation,
            _dropoffLocation,
            _pickupTime,
            _dropoffTime,
            _price,
            _availableSeats
        );
    }

    function cancelTrip(
        uint256 _tripId
    )
        public
        onlyDriver(_tripId)
        tripExists(_tripId)
        tripNotCompleted(_tripId)
        noReentrant // Add reentrancy protection for multiple refunds
    {
        Trip storage trip = trips[_tripId];
        uint256 totalRefunded = 0;
        uint256 passengerCount = trip.passengers.length;
        TripSchedule storage currentSchedule = tripSchedules[_tripId];

        require(
            block.timestamp < currentSchedule.pickupTime,
            "Trip has already started"
        );


        // Process refunds first
        if (passengerCount > 0) {
            uint256 refundAmount = trip.price;
            for (uint256 i = 0; i < passengerCount; i++) {
                address passenger = trip.passengers[i];

                // Reset booking status
                isBooked[_tripId][passenger] = false;

                // Process refund
                (bool success, ) = payable(passenger).call{value: refundAmount}(
                    ""
                );
                if (!success) {
                    emit RefundFailed(_tripId, passenger);
                }

                totalRefunded += refundAmount;
                emit PassengerRefunded(_tripId, passenger, refundAmount);
            }

            // Clear the passengers array
            delete trip.passengers;
        }

        // Clear escrow
        escrow[_tripId] = 0;

        // Mark trip as completed to prevent further bookings
        trip.completed = true;

        emit TripCancelled(_tripId, totalRefunded, passengerCount);
    }

    function updateTripSchedule(
        uint256 _tripId,
        uint256 _newPickupTime,
        uint256 _newDropoffTime
    ) public onlyDriver(_tripId) tripExists(_tripId) tripNotCompleted(_tripId) {
        TripSchedule storage currentSchedule = tripSchedules[_tripId];

        // Check if the current pickup time has passed
        require(
            block.timestamp < currentSchedule.pickupTime,
            "Trip has already started or passed"
        );

        // Check if the trip schedule is flexible
        require(currentSchedule.isFlexible, "Trip schedule is not flexible");

        // Validate new times
        require(
            _newPickupTime > block.timestamp,
            "New pickup time must be in the future"
        );
        require(
            _newDropoffTime > _newPickupTime,
            "New dropoff time must be after pickup time"
        );

        // Update the schedule
        currentSchedule.pickupTime = _newPickupTime;
        currentSchedule.dropoffTime = _newDropoffTime;

        emit TripScheduleUpdated(_tripId, _newPickupTime, _newDropoffTime);
    }

    function bookTrip(
        uint256 _tripId
    ) public payable tripExists(_tripId) tripNotCompleted(_tripId) {
        Trip storage trip = trips[_tripId];
        TripSchedule storage schedule = tripSchedules[_tripId];

        require(msg.sender != trip.driver, "Driver cannot book their own trip");
        require(!isBooked[_tripId][msg.sender], "Already booked this trip");
        require(trip.availableSeats > 0, "No seats available");
        require(msg.value == trip.price, "Incorrect payment amount");
        require(
            schedule.pickupTime > block.timestamp,
            "Trip pickup time has passed"
        );
        require(
            address(msg.sender).balance >= trip.price,
            "Insufficient balance to book this trip"
        );

        trip.passengers.push(msg.sender);
        isBooked[_tripId][msg.sender] = true;
        trip.availableSeats--;
        escrow[_tripId] += msg.value;

        emit TripBooked(_tripId, msg.sender, msg.value);
    }

    function cancelBooking(
        uint256 _tripId
    )
        public
        onlyPassenger(_tripId)
        tripExists(_tripId)
        tripNotCompleted(_tripId)
    {
        Trip storage trip = trips[_tripId];
        TripSchedule storage schedule = tripSchedules[_tripId];

        require(block.timestamp < schedule.pickupTime, "Too late to cancel");

        // Find and remove passenger
        for (uint256 i = 0; i < trip.passengers.length; i++) {
            if (trip.passengers[i] == msg.sender) {
                trip.passengers[i] = trip.passengers[
                    trip.passengers.length - 1
                ];
                trip.passengers.pop();
                break;
            }
        }

        isBooked[_tripId][msg.sender] = false;
        trip.availableSeats++;

        uint256 refundAmount = trip.price;
        escrow[_tripId] -= refundAmount;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit BookingCancelled(_tripId, msg.sender, refundAmount);
    }

    function confirmTripCompletion(
        uint256 _tripId
    ) public tripExists(_tripId) tripNotCompleted(_tripId) {
        Trip storage trip = trips[_tripId];
        TripSchedule storage schedule = tripSchedules[_tripId];

        require(
            block.timestamp >= schedule.dropoffTime,
            "Trip not yet complete"
        );

        // Allow either driver or passengers to confirm
        require(
            msg.sender == trip.driver || isBooked[_tripId][msg.sender],
            "Not authorized to confirm trip completion"
        );

        require(
            !hasCompletedTrip[msg.sender],
            "You have already completed the trip"
        );

        // Mark the confirmation
        passengerCompletionConfirmation[_tripId][msg.sender] = true;
        hasCompletedTrip[msg.sender] = true;

        // Check if we have enough confirmations to complete the trip
        uint256 confirmationCount = 0;
        uint256 passengerConfirmations = 0;
        bool driverConfirmed = false;

        // Check driver's confirmation
        if (passengerCompletionConfirmation[_tripId][trip.driver]) {
            driverConfirmed = true;
            confirmationCount++;
        }

        // Count passenger confirmations
        for (uint256 i = 0; i < trip.passengers.length; i++) {
            if (passengerCompletionConfirmation[_tripId][trip.passengers[i]]) {
                passengerConfirmations++;
                confirmationCount++;
            }
        }

        // Calculate required confirmations based on passenger count
        bool hasEnoughConfirmations = false;
        uint256 totalPassengers = trip.passengers.length;

        if (driverConfirmed) {
            // Driver must always confirm
            if (totalPassengers == 1) {
                // For 1 passenger: require both driver and passenger
                hasEnoughConfirmations = (passengerConfirmations == 1);
            } else if (totalPassengers == 2) {
                // For 2 passengers: require driver and both passengers
                hasEnoughConfirmations = (passengerConfirmations == 2);
            } else if (totalPassengers == 3) {
                // For 3 passengers: require driver and at least 2 passengers
                hasEnoughConfirmations = (passengerConfirmations >= 2);
            } else if (totalPassengers > 3) {
                // For >3 passengers: require driver and all-but-one passengers
                hasEnoughConfirmations = (passengerConfirmations >=
                    totalPassengers - 1);
            }
        }

        // If we have enough confirmations, complete the trip
        if (hasEnoughConfirmations) {
            finalizeTrip(_tripId);
        }
    }

    // Internal function to finalize the trip and release funds
    function finalizeTrip(uint256 _tripId) internal {
        Trip storage trip = trips[_tripId];

        require(!trip.completed, "Trip already completed");

        uint256 escrowAmount = escrow[_tripId];
        require(escrowAmount > 0, "No funds in escrow");

        trip.completed = true;
        escrow[_tripId] = 0;

        (bool success, ) = payable(trip.driver).call{value: escrowAmount}("");
        require(success, "Transfer failed");

        emit TripCompleted(_tripId, trip.driver);
    }

    function rateDriver(
        uint256 _tripId,
        uint8 _rating
    ) public onlyPassenger(_tripId) tripExists(_tripId) {
        Trip storage trip = trips[_tripId];
        require(trip.completed, "Trip not completed");
        require(_rating > 0 && _rating <= 5, "Invalid rating");

        trip.ratings[msg.sender] = _rating;

        emit RatedDriver(_tripId, msg.sender, _rating);
    }

    function ratePassengers(
        uint256 _tripId,
        address[] calldata _passengers,
        uint8[] calldata _ratings
    ) public onlyDriver(_tripId) tripExists(_tripId) {
        require(_passengers.length > 0, "No passengers provided");
        require(
            _passengers.length == _ratings.length,
            "Passengers and ratings length mismatch"
        );

        Trip storage trip = trips[_tripId];
        require(trip.completed, "Trip not completed");

        for (uint256 i = 0; i < _passengers.length; i++) {
            address passenger = _passengers[i];
            uint8 rating = _ratings[i];

            require(
                isBooked[_tripId][passenger],
                "Not a passenger of this trip"
            );
            require(rating > 0 && rating <= 5, "Invalid rating");

            passengerRatings[_tripId][passenger] = rating;

            emit PassengerRated(_tripId, passenger, rating);
        }
    }

    function getTripSchedule(
        uint256 _tripId
    )
        public
        view
        tripExists(_tripId)
        returns (uint256 pickupTime, uint256 dropoffTime, bool isFlexible)
    {
        TripSchedule storage schedule = tripSchedules[_tripId];
        return (schedule.pickupTime, schedule.dropoffTime, schedule.isFlexible);
    }

    function getTripDetails(
        uint256 _tripId
    )
        public
        view
        tripExists(_tripId)
        returns (
            address driver,
            string memory pickupLocation,
            string memory dropoffLocation,
            uint256 price,
            uint256 availableSeats,
            bool completed
        )
    {
        Trip storage trip = trips[_tripId];
        return (
            trip.driver,
            trip.pickupLocation,
            trip.dropoffLocation,
            trip.price,
            trip.availableSeats,
            trip.completed
        );
    }

    function calculateDriverAverageRating(
        address _driver
    ) public view returns (uint256, uint256) {
        uint256 totalRatings = 0;
        uint256 ratingCount = 0;

        for (uint256 i = 1; i <= tripCount; i++) {
            // Check ratings if trip is completed
            if (trips[i].completed) {
                // Check if this trip's driver rated this address as a passenger
                uint8 passengerRating = passengerRatings[i][_driver];

                if (passengerRating > 0) {
                    totalRatings += passengerRating;
                    ratingCount++;
                }

                // Check if some passenger rated this driver when they were a driver
                for (uint256 j = 0; j < trips[i].passengers.length; j++) {
                    uint8 driverRating = trips[i].ratings[
                        trips[i].passengers[j]
                    ];
                    if (driverRating > 0 && trips[i].driver == _driver) {
                        totalRatings += driverRating;
                        ratingCount++;
                    }
                }
            }
        }

        uint256 averageRating = ratingCount > 0
            ? (totalRatings * 100) / ratingCount
            : 0;
        return (averageRating, ratingCount);
    }

    function calculatePassengerAverageRating(
        address _passenger
    ) public view returns (uint256, uint256) {
        uint256 totalRatings = 0;
        uint256 ratingCount = 0;

        for (uint256 i = 1; i <= tripCount; i++) {
            if (trips[i].completed) {
                bool passengerWasOnTrip = false;
                for (uint256 j = 0; j < trips[i].passengers.length; j++) {
                    if (trips[i].passengers[j] == _passenger) {
                        passengerWasOnTrip = true;
                        break;
                    }
                }

                if (passengerWasOnTrip) {
                    uint8 rating = passengerRatings[i][_passenger];
                    if (rating > 0) {
                        totalRatings += rating;
                        ratingCount++;
                    }
                }

                if (trips[i].driver == _passenger) {
                    for (uint256 j = 0; j < trips[i].passengers.length; j++) {
                        uint8 driverRating = trips[i].ratings[
                            trips[i].passengers[j]
                        ];
                        if (driverRating > 0) {
                            totalRatings += driverRating;
                            ratingCount++;
                        }
                    }
                }
            }
        }

        uint256 averageRating = ratingCount > 0
            ? (totalRatings * 100) / ratingCount
            : 0;
        return (averageRating, ratingCount);
    }

    receive() external payable {}
}
