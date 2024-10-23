// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    function updateTripSchedule(
        uint256 _tripId,
        uint256 _newPickupTime,
        uint256 _newDropoffTime
    ) public onlyDriver(_tripId) tripExists(_tripId) tripNotCompleted(_tripId) {
        require(
            _newPickupTime > block.timestamp,
            "New pickup time must be in the future"
        );
        require(
            _newDropoffTime > _newPickupTime,
            "New dropoff time must be after pickup time"
        );

        TripSchedule storage schedule = tripSchedules[_tripId];
        schedule.pickupTime = _newPickupTime;
        schedule.dropoffTime = _newDropoffTime;

        emit TripScheduleUpdated(_tripId, _newPickupTime, _newDropoffTime);
    }

    function bookTrip(
        uint256 _tripId
    ) public payable tripExists(_tripId) tripNotCompleted(_tripId) {
        Trip storage trip = trips[_tripId];
        TripSchedule storage schedule = tripSchedules[_tripId];

        require(!isBooked[_tripId][msg.sender], "Already booked this trip");
        require(trip.availableSeats > 0, "No seats available");
        require(msg.value == trip.price, "Incorrect payment amount");
        require(
            schedule.pickupTime > block.timestamp,
            "Trip pickup time has passed"
        );

        trip.passengers.push(msg.sender);
        isBooked[_tripId][msg.sender] = true;
        trip.availableSeats--;
        escrow[_tripId] += msg.value;

        emit TripBooked(_tripId, msg.sender, msg.value);
    }

    function completeTrip(
        uint256 _tripId
    ) public onlyDriver(_tripId) tripExists(_tripId) tripNotCompleted(_tripId) {
        Trip storage trip = trips[_tripId];
        TripSchedule storage schedule = tripSchedules[_tripId];

        require(
            block.timestamp >= schedule.dropoffTime,
            "Trip not yet complete"
        );

        uint256 escrowAmount = escrow[_tripId];
        require(escrowAmount > 0, "No funds in escrow");

        trip.completed = true;
        escrow[_tripId] = 0; // Clear escrow before transfer to prevent reentrancy

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
            string memory pickupLocation,
            string memory dropoffLocation,
            uint256 price,
            uint256 availableSeats,
            bool completed
        )
    {
        Trip storage trip = trips[_tripId];
        return (
            trip.pickupLocation,
            trip.dropoffLocation,
            trip.price,
            trip.availableSeats,
            trip.completed
        );
    }

    function getTripPassengers(
        uint256 _tripId
    ) public view tripExists(_tripId) returns (address[] memory) {
        return trips[_tripId].passengers;
    }

    function getDriverRating(
        uint256 _tripId,
        address passenger
    ) public view tripExists(_tripId) returns (uint8) {
        return trips[_tripId].ratings[passenger];
    }

    receive() external payable {}
}
