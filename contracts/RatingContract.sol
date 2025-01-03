// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract RatingContract {
    struct Rating {
        mapping(address => uint8) ratings;
        uint256 totalRatings;
        uint256 ratingCount;
    }

    mapping(uint256 => mapping(address => uint8)) public driverRatings;
    mapping(uint256 => mapping(address => uint8)) public passengerRatings;
    mapping(address => Rating) private userRatings;

    event PassengerRated(uint256 tripId, address indexed passenger, uint8 rating);
    event RatedDriver(uint256 tripId, address indexed passenger, uint8 rating);

    function rateDriver(uint256 _tripId, address _driver, uint8 _rating, address _passenger) external {
        require(_rating > 0 && _rating <= 5, "Invalid rating");
        
        driverRatings[_tripId][_passenger] = _rating;
        
        Rating storage driverRating = userRatings[_driver];
        driverRating.ratings[_passenger] = _rating;
        driverRating.totalRatings += _rating;
        driverRating.ratingCount++;

        emit RatedDriver(_tripId, _passenger, _rating);
    }

    function ratePassenger(uint256 _tripId, address _passenger, uint8 _rating, address _driver) external {
        require(_rating > 0 && _rating <= 5, "Invalid rating");
        
        passengerRatings[_tripId][_passenger] = _rating;
        
        Rating storage passengerRating = userRatings[_passenger];
        passengerRating.ratings[_driver] = _rating;
        passengerRating.totalRatings += _rating;
        passengerRating.ratingCount++;

        emit PassengerRated(_tripId, _passenger, _rating);
    }

    function calculateUserAverageRating(address _user) public view returns (uint256, uint256) {
        Rating storage rating = userRatings[_user];
        
        if (rating.ratingCount == 0) {
            return (0, 0);
        }
        
        uint256 averageRating = (rating.totalRatings * 100) / rating.ratingCount;
        return (averageRating, rating.ratingCount);
    }

    function getTripDriverRating(uint256 _tripId, address _passenger) external view returns (uint8) {
        return driverRatings[_tripId][_passenger];
    }

    function getTripPassengerRating(uint256 _tripId, address _passenger) external view returns (uint8) {
        return passengerRatings[_tripId][_passenger];
    }
}